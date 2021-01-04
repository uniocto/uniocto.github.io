---
title: エフェメラルなGoの実行環境を構築する
date: 2020-01-26
tags: [go,docker]
path: blog/00002
cover: ./preview.png
excerpt: Docker上に、goの実行環境を作ります。
---

dockerコンテナ上に、goの実行環境を構築します。

## 環境
```
ProductName:  Mac OS X  
ProductVersion:  10.15.2  
docker-compose version: 1.24.1  
```

## ゴール
goを実行できる開発環境を構築すること
フォルダ構造は以下。  
```
./  
└── go  
     ├── docker-compose.yaml  
     └── src  // 実行対象のアプリはこの直下に置く  
           └── hello_world  
                  └── main.go
```

## 工程
1. 下記コマンドにて、goのdocker imageを取得する
```
>docker pull golang
>docker images
```

2. go開発用のディレクトリを用意する。このsrc直下でgoのスクリプトを開発を進める。
```
>mkdir ~/go/src
```

3. 下記のようにdockerfileを記述する
```
~/go/docker-compose.yaml  
version: "2"  
services:  
      go:  
        image: golang  
        container_name: go  
        volumes:  
          - "~/go/src/:/go/src/"  
        working_dir: /go/src
```

4. Hello worldを出力するmain.goを作成する。
```
~/go/HelloWorld/main.go  
package main  
import ("fmt")  
func main() {
  	fmt.Printf("Hello World!\n")  
}
```

5. ~/goにて、docker-composeの起動し、コンテナの内部に入る。
```
>docker-compose up
>docker-compose run go bash  
>go#ls -l  
 root root  hello_world  
```

6. 下記コマンドを実行し、Hello Worldが出力されることを確認する。
```
go#go run HelloWorld/main.go
Hello World!  
```

## 雑記
バックエンドで根強い人気があるgoを学びたいと思い、開発環境を整えました。  
とはいえ、直近仕事で使うことはなさそうなので、「Go言語で作るインタプリタ」の写経専用環境になると思います。