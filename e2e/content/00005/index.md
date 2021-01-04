---
title: papermillを使用してipynbでwebサーバーを構築する
tags: [ML,python,jupyter]
path: blog/00005
date: 2020-05-31
excerpt: ipynbファイル上でwebサーバーを構築する方法を共有いたします。  
cover: ./preview.png
---

# TL;DR
機械学習のシステム開発について、jupyter上でモデルを開発した後、運用時にpythonファイルに書き換えるケースが見受けられます。
今回は書き換えなくても運用できるように、ipynbファイル上でwebサーバーを構築する方法を共有いたします。  
ipynbファイルの実行には、papermillをというライブラリを使用します。  
https://papermill.readthedocs.io/en/latest/

また、本ドキュメントに記載している各コードは全て下記リポジトリに格納しております。  
https://github.com/uniocto/prediction-server-with-nb

# ステップ
1. テスト用のモデル構築
2. 予測用notebookの作成
3. サーバー用のdocker imageの作成
4. 動作確認
5. 所感

# 最終的なファイル構成
最終的には下記ファイル構成を作成します。
```
 ./  
 ├── model  # ステップ1で作成
 ├── requirements.txt  # ステップ2で作成
 ├── main.ipynb  # ステップ2で作成
 ├── docker-compose.yml  # ステップ3で作成
 └── dockerfile  # ステップ3で作成
```

# 1. テスト用のモデル構築
irisデータセットを使用して、簡易的なSVCモデルを作成します。

```python
import pickle
import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

iris_dataset = load_iris()

x = iris_dataset["data"]
y = iris_dataset["target"]


x_train, x_test, y_train, y_test = train_test_split(
    x,
    y,
    test_size = 0.2,
    train_size = 0.8,
    shuffle = True)


clf = SVC(gamma='scale')
clf.fit(x_train, y_train)

y_pred = clf.predict(x_test)
print(accuracy_score(y_test, y_pred))

filename = 'model'
pickle.dump(clf, open(filename, 'wb'))

clf = pickle.load(open(filename, 'rb'))
y_pred = clf.predict(x_test)
print(accuracy_score(y_test, y_pred))
```

# 2. 予測用notebookの作成
papermillから呼び出すrequirements.txtファイルとipynbファイルを作成します。pythonのサーバーといえば、
WSGIとASGIがあるため、参考として両方を用意しました。  
なお、今回はWSGIはwsgirefを、ASGIはuvicornを使用したものを以下に記載しておりますので、お好きな方を利用されるとよろしいかと思います。

## WSGIの場合
```
# requirements.txt
sklearn
numpy
papermill
```

```python
# main.ipynb
import json
import pickle
import numpy as np
from datetime import datetime
from wsgiref.util import setup_testing_defaults
from wsgiref.simple_server import make_server

PORT = 8000

class ModelPredictor:
    
    def __init__(self):
        self.model = pickle.load(open('model', 'rb'))

    def main(self,data):
        return json.dumps({"val": self.predict(self.prep(data))} ,cls = NumpyEncoder).encode()    

    def prep(self,data):
        return [[   data['sepal length (cm)'],
                    data['sepal width (cm)'],
                    data['petal length (cm)'],
                    data['petal width (cm)']]]

    def predict(self,data):
        return self.model.predict(data)[0]

class NumpyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NumpyEncoder, self).default(obj)

prd_controller = ModelPredictor()

prd_controller.predict(
    {"sepal length (cm)": 1,
    "sepal width (cm)": 1,
    "petal length (cm)": 1,
    "petal width (cm)":1})

def simple_app(environ, start_response):
    setup_testing_defaults(environ)
    
    wsgi_input = environ["wsgi.input"]
    content_length = int(environ["CONTENT_LENGTH"])
    data = json.loads(wsgi_input.read(content_length))

    print(wsgi_input)
    print(data)

    status = '200 OK'
    headers = [('Content-type', 'text/plain; charset=utf-8')]
    ret = [prd_controller.main(data)]
    start_response(status, headers)

    return ret

with make_server('0.0.0.0', PORT, simple_app) as httpd:
    print(f"Serving on port {PORT}...")
    httpd.serve_forever()
```


## ASGIの場合
```
# requirements.txt
sklearn
numpy
papermill
uvicorn
```

```python
# main.ipynb
import json
import pickle
import uvicorn
import numpy as np
import nest_asyncio
from datetime import datetime

nest_asyncio.apply()

PORT = 8000

class ModelPredictor:
    
    def __init__(self):
        self.model = pickle.load(open('model', 'rb'))

    def predict(self,body):
        rt_val = self.model.predict([[
                    body['sepal length (cm)'],
                    body['sepal width (cm)'],
                    body['petal length (cm)'],
                    body['petal width (cm)']]])
        return json.dumps({"val": rt_val[0]}, cls=NumpyEncoder).encode()

class NumpyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NumpyEncoder, self).default(obj)

prd_controller = ModelPredictor()

prd_controller.predict(
    {"sepal length (cm)": 1,
    "sepal width (cm)": 1,
    "petal length (cm)": 1,
    "petal width (cm)":1})

async def read_body(receive):
    body = b''
    more_body = True

    while more_body:
        message = await receive()
        body += message.get('body', b'')
        more_body = message.get('more_body', False)

    return json.loads(body)


async def app(scope, receive, send):
    body = await read_body(receive)
    ret = prd_controller.predict(body)
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [
            [b'content-type', b'text/plain'],
        ]
    })
    await send({
        'type': 'http.response.body',
        'body': ret,
    })

uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")
```

# 3. サーバー用のdocker imageの作成
予測webサーバーのdocker imageを作成するため、dockerfileを記述します。  
`papermill main.ipynb out.ipynb`でmain.ipynbファイルを実行した結果がout.ipynbとして出力されます。  
今回はコンテナの実行にdocker-composeを使用するため、docker-compose.ymlも作成します。
```dockerfile
# dockerfile
FROM jupyter/datascience-notebook:latest
WORKDIR /home/jovyan
COPY model ./
COPY main.ipynb ./
COPY requirements.txt ./
RUN pip install -r requirements.txt
ENTRYPOINT [ "papermill","main.ipynb","out.ipynb"] 
```

```yaml
# docker-compose.yml
version: '3'
services:
  notebook_server:
    build: .
    container_name: notebook_server
    hostname: notebook_server
    restart: always
    ports: 
      - 8000:8000
```

# 4. 動作確認
下記コマンドを実行してビルド後、curlにて動作を確認します。{"val": INTEGER}のフォーマットでデータが返ってくれば成功です。
```bash
$ docker-compose up -d
$ curl -X POST -H "Content-Type: application/json" -d '{  "sepal length (cm)": 1,  "sepal width (cm)": 1,  "petal length (cm)": 1,  "petal width (cm)":1}' localhost:8000
{"val": 0}
```

# 所感
紹介したは良いものの、以下の点からあまり推奨できません。  
* papermillはバッチ的な用途向きのツールで、webサーバー向きではない  
* imageのサイズも今回のは3.7GBほどになる

リソースが潤沢かつデータサイエンティストの生産性を最大にしたい場合、候補に上がるかもしれません。