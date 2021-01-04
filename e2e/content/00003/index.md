---
title: 3,000円ほどの勉強代でGCPの資格二種類に合格しました
tags: [cloud,資格]
path: blog/00003
date: 2020-02-23
excerpt: 資格を取得するにあたって、勉強した内容を共有します。記事を読んだ方の資格取得の助けになればと思っております。
cover: ./preview.png
---

## 本記事を書く経緯
出費にピンを止めてGCPの「Professional Cloud Architect」と「Professional Data Engineer」を受け、受かったのでその勉強法を共有します。 
もちろん、公式の有償講座を受けることは価値があると思いますので、 
予算に合わせた準備をするとよろしいかと。  

## 合格した資格
以下の資格に受かりました。（各$200）
* Professional Cloud Architect  
https://cloud.google.com/certification/cloud-architect?hl=ja
* Professional Data Engineer  
https://cloud.google.com/certification/data-engineer?hl=ja  

## 勉強開始前のレベル
* 仕事でBigQuery、GCSを1500時間ほど運用/開発を経験
* 個人的にCompute Engine, Cloud Build, Cloud Function, Cloud Scheduler、Pub/Subを300時間ほど開発/運用を経験
* k8sの知識はyamlを0から書けないレベル

## 資格取得のモチベーション
「自分の市場価値を明確化したい」、「GCPのクールなプライズが欲しい」、「 Google Cloud Nextの資格取得者サロンに入ってみたい」の3つでした。 
市場価値については、以下の記事や求人を見て、モチベーションが高めました。  
https://www.globalknowledge.com/us-en/resources/resource-library/articles/top-paying-certifications/

## コスト  
* 出費 本代 3,000円  
Google Cloud Platform エンタープライズ設計ガイド  
https://www.amazon.co.jp/dp/4822257908/ref=cm_sw_em_r_mt_dp_U_fc5uEbJ04KMDB  
GCPの全体像が把握できたため、満足度の高い出費でした。  
ただ、2018年の本であるため、最新のGCPサービスは記載されておりません。  
もちろん試験範囲に最新のサービスも含まれるため、公式リファレンスで勉強する必要があります。  
* 勉強時間 合計100時間  
1試験あたり 50時間 = 2時間/日 * 25日

## 勉強対象
* 購入した上記本
* quiklabsのハンズオンクエスト（見るだけなら無料）  
https://google.qwiklabs.com/
* 公式ドキュメント  
https://cloud.google.com/docs?hl=ja  
* 公式ソリューション一覧  
https://cloud.google.com/solutions?hl=ja
* 資格毎の模擬試験
* GCP公式のクラウドサービス比較（他のクラウドサービスにも詳しい方向け）  
https://cloud.google.com/docs/compare?hl=ja

## 行った勉強法
勉強法は以下を行いました。私は手を動かさないと記憶できないので、得た知識をアウトプットすることを意識しました。
* 各試験ガイドの項目と勉強対象で得られた知識のリレーションをドキュメント化
* 課題とサービスの関係性を書く。
* 全サービスについて、quiklabと公式リファレンスを読みながら、GCPにデプロイ

## 個人的アドバイス
最後に所感ですが、以下の点を意識して試験に取り組めば、合格できると思います。
* 問題文を正しく読むこと
* 試験ガイドのスコープと知識が紐付けられていること
* ソリューション毎のコストを意識すること