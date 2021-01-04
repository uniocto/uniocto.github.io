---
title: Big Queryにおけるデータマートテーブル開発アンチパターン
tags: [bq,sql]
path: blog/00006
date: 2020-07-31
excerpt: Big Query上でデータマートテーブル開発を行う上で、私が出会ったアンチパターンを紹介いたします。
cover: ./preview.png
---

# TL;DR
Big Query上でデータマートテーブル開発を行う上で、私が出会ったアンチパターンを紹介いたします。

# 前提
1. 本記事内では便宜上、下記定義を利用します。
 *  データマート→GCPのBig Query（以後BQ）を前提に書きます。
 *  アンチパターン→開発や導入を阻害する一般的で再発性の高い障害要因。
2. 衝動的に書いた為、抜け漏れ、誤字脱字はご指摘くださると幸いです。

# 設計編
データマートのテーブルを設計する際に、発生するアンチパターンを紹介します。この段階で発生したアンチパターンは、運用時に不要な工数を生み出す原因となるため、注意が必要となります。

## 命名の自由度が高い
パッと見何を指しているのかわからないテーブル名、カラム名はアンチパターンとしています。「相対値（new/old/neo/_1）」、「受け継いだカラム名を変更する」、「日本語と英語が合体」など、アンチパターンは様々です。
対処法は、`「命名ルールの継続的作成」、「レビュー」、「ユーザーのリファクタリングへの理解」`の3つだと考えております。
命名規則は、ググれば出てくるため、事例を見た上で、小さいことから少しずつチームに合ったルールを作り始めるとよろしいかと思います。

```sql
-- アンチパターン
CREATE TABLE new_kpi_monitoring AS (
    SELECT
      department AS dp,
      SUM(amount) as kpi_1,
      AVG(amount) as kpi_2
    FROM
      sales_history
    group by department
);

--GOOD

CREATE TABLE department_kpi_monitoring AS (
    SELECT
      department,
      SUM(amount) AS sum_amount,
      AVG(amount) AS avg_amount
    FROM
      sales_histories
    group by department
);
```

## マスタが正規化されていない
そもそもマスタとは何かという話にもなりそうですが。マスタが正規化されておらず、レコードが百行以上の場合、正規化を検討することを推奨します。正規化しない場合、「重複した情報を保持するマスタテーブルが乱立」、「データの漏れや重複」といった事象に繋がる恐れもあるため、`正規化`することを推奨します。

## 異なる意味を持つテーブルを一つにまとめる
異なる意味を持つテーブルを一つにまとめる事をアンチパターンとしております。
特にBig Queryの仕様として、取込時間パーティションという機能があり、これを悪用したケースが多く見受けられます。
取込時間パーティションは任意の年月日を指定できるため、`2200-01-01`といった未来日付も、BQがまだ生まれていない`1900-01-01`といった日付も指定可能です。
例えば、`2200-01-01`は現時点の全データを、本日日付にはこれまでとの差分データを、`1900-01-01`には特定の条件を絞って抽出したデータを保持している場合、このアンチパターンに当てはまります。`スキーマが同じだからと安易に一つのテーブルに合わせず、意味単位でのテーブル作成する`ことを推奨します。

## 復旧オペレーションを視野に入れていない設計
分析用のデータは欠損し、復旧対応を行うケースがあります。復旧が一切不要な環境であれば、関係ありません。
復旧作業時は落ち着けずヒューマンエラーのリスクが高まるため、設計時に復旧オペレーションを確立している、そもそも`復旧不要が不要となるような設計、仕組み`を目指すべきだと考えております。例えばですが、以下のようなプラクティスが挙げられます。
* 利用するテーブルは基本的にrawデータを使用し、洗い変えられるようなテーブルは基本的に参照しない（復旧工程の複雑さを防ぐ）
* 日付等、特定のパラメータで復旧可能なようにジョブと合わせてテーブルを設計する


# SQL編
SQLのコーディングにおけるアンチパターンです。Big Query向けの内容になります。以下から、ラフなSQLのコードを用いて、アンチパターンを説明します。

## 予約語が小文字
可読性が下がります。私も開発時は小文字だけで書いちゃいますが、運用に乗せる時には、フォーマットを整えます。ルール作りが面倒であれば、`チーム共通のフォーマッターを導入する`ことを推奨します。

```sql
-- アンチパターン
select *
from sample_table
;
-- GOOD
SELECT *
FROM sample_table
;
```

## フォーマットがばらばら
SQLを書く人が増えれば増えるほど、発生するアンチパターンです。上と同様、`フォーマッターを統一する`のが、ベストだと考えております。Big QueryのGUIからでも始める事を推奨します。

```sql
-- アンチパターン
SELECT a,
       b,
       c,
       sum(d) AS sum_d
       ,e
FROM sample_table
GROUP BY a, b, c, e
;

-- GOOD
SELECT
  a,
  b,
  c,
  sum(d) AS sum_d,
  e
FROM sample_table
GROUP BY a, b, c, e
;

```

## テーブル名とカラム名に大文字と小文字を混ぜて使用する
DBによって、大文字、小文字を区別するか異なります。そのため、DB移行時にはデータ処理のリファクタリングが必要な手間が増やし、読みにくいと、何一つ利点はないと思っています。可搬性や保守性を考えると、`小文字で統一すること`を推奨します。

```sql
-- アンチパターン
SELECT
 a.P_KEY,
 b.sum_num
FROM
 dataset.TABLE
;

-- GOOD
SELECT
 a.p_key,
 b.sum_num
FROM
 dataset.table
;

```

## window関数を使わない
window関数を使わない場合、自己結合が連なったSQLが生まれます。
無用なデータロードや結合の原因となるため、`自己結合を見かけた場合はwindow関数の利用を検討する`とよろしいかと思います。

```sql
-- アンチパターン
WITH sum_num AS(
 SELECT
  partition_key,
  SUM(num) AS sum_num
  dataset.table
)
SELECT
 a.p_key,
 b.sum_num
FROM
 dataset.table AS a
LEFT OUTER JOIN
 sum_num b
 ON
  a.partition_key = b.partition_key
;

--GOOD
SELECT
 p_key,
 SUM(num) OVER (PARTITION BY partition_key) AS sum_num
FROM
 dataset.table
;
```


## ネストが深い
ネストは書きやすいですが、同時に可読性を落とす機能です。特に以下みたいなコードは読む気が失せます。`with句を利用して、可読性の高いコードを目指すこと`を推奨します。

```sql
-- アンチパターン
SELECT
 b_column,
 COUNT(DISTINCT p_key) AS p_key_cnt,
 COUNT(DISTINCT foreign_key) AS foreign_key
 AVG(DISTINCT sum_by_foreign_key) AS avg_sum_by_foreign_key
FROM
  (
   SELECT
    a.p_key,
    a.foreign_key,
    b.b_column,
    c.sum_by_foreign_key
   FROM
    (
     SELECT
      p_key,
      foreign_key,
      filter_column
     FROM
      dataset.table_a
     WHERE
      filter_column = '2020-01-01'
    ) AS a
    INNER JOIN 
    (
     SELECT
      foreign_key,
      b_column
     FROM
      dataset.table_b
    ) AS b
    ON
     a.foreign_key = b.foreign_key
    LEFT OUTER JOIN
     (
     SELECT
      foreign_key,
      SUM(sum_target) AS sum_by_foreign_key
     FROM
      dataset.table_a
     WHERE
      filter_column = '2020-01-01'
     GROUP BY
      foreign_key
     ) AS c
     ON
      a.foreign_key = c.foreign_key
)
GROUP BY b_column
;

-- GOOD
WITH foreign_sum AS (
 SELECT
  foreign_key,
  SUM(sum_target) AS sum_by_foreign_key
 FROM
  dataset.table_a
 WHERE
  filter_column = '2020-01-01'
)
SELECT
 b.b_column,
 COUNT(DISTINCT a.p_key) AS p_key_cnt,
 COUNT(DISTINCT a.foreign_key) AS foreign_key,
 AVG(c.sum_by_foreign_key) AS avg_sum_by_foreign_key
FROM dataset.table_a AS a
INNER JOIN
 dataset.table_b AS b
 ON
  a.foreign_key = b.foreign_key
LEFT OUTER JOIN 
 foreign_sum AS c
 ON a.foreign_key = c.foreign_key
WHERE
 a.filter_column = '2020-01-01'
GROUP BY b.b_column
;
```

## データを絞るタイミングが遅い
クエリのパフォーマンスに影響が出るため、必要なカラム、レコードは早めに抽出する事を推奨します。利用するデータベースに合わせて、適切にデータを絞るとよろしいかと思います。
以下のクエリでは、カラムとレコードを絞るタイミングが遅いケースを記載しております。

```sql
WITH anti_patturn AS (
SELECT
 *
FROM dataset.table
)
SELECT
 col1,
 col2
FROM
 anti_patturn
WHERE
 col3 = 'target_value'
; 
/*------------------------------*/
WITH GOOD AS (
SELECT
 col1,
 col2
FROM dataset.table
WHERE
 col3 = 'target_value'
)
SELECT
 *
FROM GOOD
;
```

## ADD(), SUB()に負数
一見解釈に困るため、アンチパターンとしています。ADD()とSUB()を正しく使い分けるとよろしいと思います。どうしてもどちらかに絞りたい場合は、ADD()のみに統一するとよろしいかと思います。

```sql
SELECT
 SUB(100,-5), -- アンチパターン
 ADD(100,5), -- GOOD
 ADD(100,-5), -- アンチパターン
 SUB(100,5), -- GOOD
```

## RIGHT OUTER JOIN
個人的アンチパターンです。SQLの予約語が英語なので、左から右に書いてある方がイメージしやすくて読み易いです。`LEFT OUTER JOIN`のみにすることを推奨します。

```sql
...
RIGHT OUTER JOIN outer_table
  ON
    outer_table.foreign_key == base_table.foreign_key -- アンチパターン
LEFT OUTER JOIN outer_table
  ON
    base_table.foreign_key == outer_table.foreign_key -- GOOD
```

## `DISTINCT`をとりあえず使う
DISTINCTの回数はSQLのパフォーマンスに直結するため、勢いで使うことは推奨できません。そもそもDISTINCTが何故必要なのか、データ重複が発生する原因を特定し、対処方法を検討することが重要だと考えております。また、全てのカラムを指定したGROUP BYはDISTINCTよりもパフォーマンスが高いため、可読性とパフォーマンスを天秤にかけて、検討するとよろしいかと思います。
GROUP BYを利用する際には、コメントを入れると、可読性が高まるため、おすすめします。

```sql
-- アンチパターン
SELECT DISTINCT
  a,
  b,
  c,
  d
FROM sample_table
;

-- GOOD
-- パフォーマンスを優先し、DISTINCTではなく、GROUP BYを利用
SELECT
  a,
  b,
  c,
  d
FROM sample_table
GROUP BY a, b, c, d
;
```
## TIMEZONEを指定しない`CURRENT_DATE()`
TIMEZONEの指定が不要な場合は、読み飛ばして良い、アンチパターンになります。
日本の場合、+9:00のため、TIMEZONEを指定しない場合、0時〜9時と9時〜24時で得られる日付が変わります。
CURRENT_DATETIME()も同様です。バグなので指定しましょう。

```sql
SELECT
CURRENT_DATE(), -- アンチパターン
CURRENT_DATETIME(), -- アンチパターン
CURRENT_DATE('Asia/Tokyo'), -- GOOD
CURRENT_DATETIME('Asia/Tokyo') -- GOOD
```

## コメントを使用しない
コメントを書くことを推奨します。特に独特のビジネスロジックが入った際には、コメントでビジネスロジックに関する補足や資料へのリンクを入れるだけで、SQLの読みやすさが違うと思います。

# おまけ
BQの小ネタですが、FROM句の前にカンマが入っていてもエラーを吐かずに通してくれます。
これはBQのフォーマッター的に、カラム名の直後にカンマが入るようになっていますが、開発時に末端のカラムをコメントアウト等をしてもカンマの調整が不要となるため開発体験は素晴らしいです。

```sql
# 以下でもSQLが通ります。
SELECT
  a,
  b,
  c,
  -- d
FROM sample_table
```