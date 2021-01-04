---
title: 'エフェメラルなブログ環境（gatsby）を構築する'
tags: [docker,gatsby,nodejs]
date: 2020-02-24
path: blog/00001
excerpt: Dockerコンテナ上に、gastbyを利用したブログ開発環境を構築します。
cover: ./preview.png
---
dockerコンテナ上に、ブログの実行環境を構築します。

## 環境
```
ProductName:  Mac OS X  
ProductVersion:  10.15.2  
docker-compose version: 1.24.1  
```

## ゴール
ブログを開発する環境を構築すること
フォルダ構造は以下。  
```
./  
└── node  
     ├── dockerfile  // gatsbyのdocker image作成
     ├── docker-compose.yaml  // volumeのマウント用
     └── blog_name  // 自由なブログ名を入力
```

## アジェンダ
* Docker imageの取得
* gatsbyのDockerコンテナを作成
* gatsbyコンテナの実行
* gatsbyスターターの選択
* スターターの動作を確認

## Docker imageの取得
まずは、gatsbyの実行環境を構築するため、Node.jsのイメージを取得します。
```
> docker pull node
> docker images
```

## gatsbyのDockerコンテナを作成
Docker imageを作成します。まずは以下のようにdockerfileとdocker-compose.yamlを記述。
```
~/node/dockerfile 
FROM node:latest
RUN npm install -g gatsby-cli
```

```
~/node/docker-compose.yaml  
version: "2"
services:
  gatsby:
    build:
      context: .
    container_name: gatsby
    volumes:
      - "~/node:/node/"
    working_dir: /node
    expose: 
      - 7000
```

## gatsbyコンテナの実行
下記コマンドを実行し、gatsbyコンテナを作成し、attachする。
```
>docker-compose up
>docker-compose run gatsby bash  
```

## gatsbyスターターの選択
下記リンクより、ブログを作成する際のスターターテンプレートを選択する。  
今回はスタンダードな「gatsby-starter-blog」を利用する前提で使用します。  
https://www.gatsbyjs.org/starters/?v=2

```
gatsby new gatsby-starter-blog https://github.com/gatsbyjs/gatsby-starter-blog
```

## スターターの動作を確認
gatsby developコマンドにて、動作確認する。Hostから、dockerコンテナ内のページを確認できるように、ホストを0.0.0.0を指定する。
```
gatsby develop --host=0.0.0.0
```
下記リンクにアクセスし、動作することを確認する。  

http://localhost:8000/  

contentフォルダ内にあるフォルダにあるindex.mdファイルを修正し、ページに反映されることを確認する。

## 雑記
ブログを作りたいと考えていて、静的WebサイトジェネレーターであるGatsbyにたどり着きました。  
