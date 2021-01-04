---
title: 映画のポスター生成したい〜最も売れる映画のタイトルを決めたい〜
tags: [ML]
path: blog/00005
date: 2020-03-31
excerpt: データを集めるついでに、映画のタイトルのベクトル化と金額のデータを用意しました。
cover: ./preview.png
---

## 経緯
映画のポスターってかっこいいな・・・作りたいなぁ・・・  
そんな時、私は画像ジェネレーターであるGANに出会いました。

## 注意書き
私はデータサイエンティストでもなければ、機械学習にも詳しくないです。  
そのため、誤解を招く表現がございましたら、ご指摘くださると嬉しいです。

## アジェンダ
* 英語の形態素解析環境を構築
* Doc2vecの環境を構築

## 英語の形態素解析環境を構築
pip install polyglot
brew install icu4c
brew link icu4c --force
If you need to have icu4c first in your PATH run:
  echo 'export PATH="/usr/local/opt/icu4c/bin:$PATH"' >> ~/.bash_profile
  echo 'export PATH="/usr/local/opt/icu4c/sbin:$PATH"' >> ~/.bash_profile

For compilers to find icu4c you may need to set:
  export LDFLAGS="-L/usr/local/opt/icu4c/lib"
  export CPPFLAGS="-I/usr/local/opt/icu4c/include"

echo 'export PATH="/usr/local/opt/icu4c/bin:$PATH"' >> ~/.bash_profile
echo 'export PATH="/usr/local/opt/icu4c/sbin:$PATH"' >> ~/.bash_profile
export LDFLAGS="-L/usr/local/opt/icu4c/lib"
export CPPFLAGS="-I/usr/local/opt/icu4c/include"
pip install pyicu
pip install pycld2
pip install morfessor
polyglot download embeddings2.en pos2.en

その後、モデルを作る。


## 参考
https://shinodogg.com/2018/06/27/post-7843/

https://deepage.net/machine_learning/2017/01/08/doc2vec.html

file:///Users/so/Downloads/movie_grossing.html

