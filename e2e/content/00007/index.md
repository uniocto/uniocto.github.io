---
title: pythonにおける文字列フォーマットのプラクティス
tags: [python]
path: blog/00007
date: 2020-08-31
excerpt: pythonの文字列のフォーマットには、3パターンがあります。本記事ではこれらを利用した際のプラクティスを紹介します。
cover: ./preview.png
---

# 概要
pythonの文字列のフォーマットには、下記3パターンがあります。本記事ではこれらを利用した際のプラクティスを紹介します。
1. フォーマット式
2. フォーマットメソッド
3. フォーマット文字列

# 結論
可読性を優先する場合、テンプレートの利用有無で、使用するフォーマット機能を変えるとよろしいかと思います。
* テンプレートを使用する・・・フォーマット式かフォーマットメソッドでキーを指定
* テンプレートを使用しない・・・フォーマット文字列を使用

```python
first = "hello"
second = "world"

# テンプレート使用する場合
template_formula = "%(first)s %(second)s!"
template_method = "{first} {second}!"

print(template_formula % {"first":first, "second":second}) # フォーマット式
print(template_method.format(first=first, second=second)) # フォーマットメソッド

# 使用しない場合
print(f"{first} {second}!") # フォーマット文字列
```

# フォーマット式
型制御や辞書によるフォーマットが可能です。Cに馴染みのある方は利用されているかもしれません。私はほとんど使いませんが、使う時は辞書を渡すようにしております。
```python
first = "hello"
second = "world"

print("%s %s!" % (first, second))
# hello world!

#　辞書を引数とする場合
print("%(first)s %(second)s!" % {"first":first, "second":second})
# hello world!
```

# フォーマットメソッド
文字列のオブジェクトが持つメソッドです。フォーマット式と似たように、パラメータを指定することが可能です。
私はフォーマットが定まっている場合、基本的にフォーマットメソッドを用いて、パラメータを指定するようにしております。
```python
first = "hello"
second = "world"

print("{} {}!".format(first, second))
# hello world!
print("{0} {1}!".format(first, second))
# hello world!
print("{first} {second}!".format(first=first, second=second))
# hello world!
```

# フォーマット文字列
文字列のオブジェクトを作成する際に、先頭にfをつけることで利用できる機能です。python3.6より利用可能です。書き方のパターンはこれまでより少ないですが、変数名を指定するだけでフォーマット可能なため、純粋なコードの記述量が少なく、可読性は高いと思います。

```python
first = "hello"
second = "world"

print(f"{first} {second}!")
```

# それぞれの使い分け
フォーマット文字列は可読性が高いですが、評価時に文字列が固定されてしまうため、テンプレートの利用には適しておりません。そのため、フォーマットを固定したい場合には、お好みでフォーマット式かフォーマットメソッドの利用を推奨します。
```python
first = "hello"
second = "world"

# テンプレート使用
template_formula = "%(first)s %(second)s!"
template_method = "{first} {second}!"
template_str = f"{first} {second}!"

print(template_formula % {"first":first, "second":second}) # フォーマット式
# hello world!
print(template_method.format(first=first, second=second)) # フォーマットメソッド
# hello world!
print(template_str) # フォーマット文字列
# hello world!

second = "again"

print(template_formula % {"first":first, "second":second}) # フォーマット式
# hello again!
print(template_method.format(first=first, second=second)) # フォーマットメソッド
# hello again!
print(template_str) # フォーマット文字列
# hello world!
```