---
title: Big Query上に貪欲法を実装する
tags: [bq,sql]
path: blog/00008
date: 2020-12-20
excerpt: Big Queryで動作する貪欲法をご紹介します。
cover: ./preview.png
---

この記事は「[Google Cloud Platform Advent Calendar 2020](https://qiita.com/advent-calendar/2020/gcp)」の11日目の記事です。

# TL;DR
機械学習システム等で予測した結果から、組み合わせの最適化をしたいケースがあると思います。
本ページはSQLで貪欲法を実装するケースを紹介します。貪欲法なので、最適解は得られませんが、計算コストとして安かったため、ご紹介させてください。
なお、今回実装するにあたり、Big Queryを使用しております。

# 貪欲法で解く問題について
いい感じのデータセットを見つけられなかったため、ベタ打ちで作りました。
おやつの分類ごとに予算が決まっていた時、購入するおやつの重量が最大となる組み合わせを探索しております。インプットテーブルは2つあり、1つはおやつ毎の値段、重さ、種類を、もう一方は種類毎の予算を保持しております。

## インプット1:おやつ毎のデータ
| item | item_type | item_weight | price |
| --- | --- | --- | --- |
| バナナ | フルーツ | 150 | 50 |
| キウイ | フルーツ | 110 | 40 |
| イチゴ | フルーツ | 50 | 30 |
| チョコレート | 甘味 | 40 | 30 |
| ふ菓子 | 甘味 | 10 | 20 |
| ガム | 甘味 | 20 | 30 |
| ポテトチップス | スナック | 30 | 60 |
| カツ | スナック | 15 | 20 |
| ガム | スナック | 15 | 30 |

## インプット2:種類毎の予算
| item_type | budget|
| --- | --- |
| フルーツ | 70|
| 甘味 | 50|
| スナック | 60|

# SQL
1円あたりの重さが高い順にピックアップするように実装しております。
```sql
with items AS (
    SELECT
        "バナナ" AS item, "フルーツ" AS item_type, 150 AS item_weight, 50 AS price
    UNION ALL
    SELECT
        "キウイ", "フルーツ", 110, 40
    UNION ALL
    SELECT
        "イチゴ", "フルーツ", 50, 30
    UNION ALL
    SELECT
        "チョコレート", "甘味", 40, 30
    UNION ALL
    SELECT
        "ふ菓子", "甘味", 10, 20
    UNION ALL
    SELECT
        "ガム", "甘味", 20, 30
    UNION ALL
    SELECT
        "ポテトチップス", "スナック", 30, 60
    UNION ALL
    SELECT
        "カツ", "スナック", 15, 20
    UNION ALL
    SELECT
        "ガム", "スナック", 15, 30
),
budgets AS (
    SELECT
        "フルーツ" AS item_type, 70 AS budget
    UNION ALL
    SELECT
        "甘味", 50
    UNION ALL
    SELECT
        "スナック", 60
),
add_cpa AS (
    SELECT
        item
        , item_weight
        , item_type
        , price
        , ROW_NUMBER() OVER (PARTITION BY item_type ORDER BY item_weight/price DESC, price ASC) AS cpa_rank
    FROM
        items
),
add_stack_weight AS (
    SELECT
        *
        , SUM(price) OVER (PARTITION BY item_type ORDER BY cpa_rank ASC) AS stack_price
    FROM
        add_cpa
)
SELECT
    add_stack_weight.*
    , budgets.budget
FROM
    add_stack_weight
INNER JOIN budgets
    ON
       add_stack_weight.item_type = budgets.item_type
WHERE
    add_stack_weight.stack_price <= budgets.budget
```

# クエリの結果
以下のようになります。item_type = "フルーツ"となっている物は、イチゴとキウイが最適解になりますが、今回の実装的に最もコスパの良いバナナを選んでいますね。
| item | item_weight | item_type | price | cpa_rank | stack_price | budget |
| --- | --- | ---| ---| ---| --- | ---|
| カツ | 15 | スナック | 20 | 1 | 20 | 60 |
| ガム | 15 | スナック | 30 | 2 | 50 | 60 |
| バナナ | 150 | フルーツ | 50 | 1 | 50 | 70 |
| チョコレート | 40 | 甘味 | 30 | 1 | 30 | 50 |

# 結論
SQLで貪欲法を実装しました。バッチで組み合わせ最適化テーブルを作る際に選択肢に上がると幸いです。