---
title: 映画のポスターを自動生成したい〜データ収集編〜
tags: [ML,python]
path: blog/00004
date: 2020-03-31
excerpt: 映画のタイトルから、映画のポスターっぽい画像を生成するものを作ることを目指します。今回は設計とデータ準備が範囲となります。
cover: ./preview.png
---

## 経緯
映画のポスターってかっこいいな・・・作りたいなぁ・・・  
そんな時、私は画像ジェネレーターであるGANに出会いました。

## 注意書き
私はデータサイエンティストでもなければ、機械学習にも詳しくないです。  
そのため、誤解を招く表現がございましたら、ご指摘くださると嬉しいです。

## アジェンダ
* 映GANを作るにあたって
* データの準備

## 映GANを作るにあたって
それっぽいポスターを作るためには、映画のタイトルと画像が紐づいたデータが重要になります。  
収集対象となる映画のタイトルは以下から取得することとしました。  
https://ja.wikipedia.org/wiki/%E5%B9%B4%E5%BA%A6%E5%88%A5%E6%98%A0%E7%94%BB%E8%88%88%E8%A1%8C%E6%88%90%E7%B8%BE

## データ準備
執筆時点で、以前使っていたgoogle-images-downloadでは、ダウンロードできなくなりました。  
その為、yahooから画像を収集します。スクリプトは以下です。  
※ 作成にあたり、下記サイトを参考にしました。  
https://qiita.com/ishiwara51/items/3979fbc1c69b4f8ee2d3

```
import os
import sys
import traceback
from mimetypes import guess_extension
from time import time, sleep
from urllib.request import urlopen, Request
from urllib.parse import quote
from bs4 import BeautifulSoup

MY_EMAIL_ADDR = ''

class Fetcher:
    def __init__(self, ua=''):
        self.ua = ua

    def fetch_img_direct(self, url):
        req = Request(url, headers={'User-Agent': self.ua})
        try:
            with urlopen(req, timeout=3) as p:
                page_b_content = p.read()
                structured_page = BeautifulSoup(page_b_content.decode('UTF-8'), 'html.parser')
                img_link_elems = structured_page.find_all('img')
                img_urls = [e.get('src') for e in img_link_elems if e.get('src').startswith('http')]
                img_urls = list(set(img_urls)) #なぜset化しているのかは不明
        except:
            sys.stderr.write('Error in fetching {}\n'.format(url))
            sys.stderr.write(traceback.format_exc())
            return None, None

        img_b_content = []
        mime = []
        for i, img_url in enumerate(img_urls):
            req1 = Request(img_url, headers={'User-Agent': self.ua})
            try:
                with urlopen(req1, timeout=3) as p:
                    img_b_content.append(p.read())
                    mime.append(p.getheader('Content-Type'))
            except:
                sys.stderr.write('Error in fetching {}\n'.format(img_url))
                sys.stderr.write(traceback.format_exc())
                continue

        return img_b_content, mime

fetcher = Fetcher(MY_EMAIL_ADDR)


def url_brancher(word):
    constant = "https://search.yahoo.co.jp/image/search?p={}&n=5".format(quote(word+" 映画"))
    urllist = [constant]
    return urllist


def main(word):
    data_dir = 'data_folder/'+word
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    yahoo_url_list = url_brancher(word)

    for i, yahoo_url in enumerate(yahoo_url_list):
        sleep(0.1)
        img, mime = fetcher.fetch_img_direct(yahoo_url)
        if not mime or not img:
            print('Error in fetching {}\n'.format(yahoo_url))
            continue

        for j, img_url in enumerate(img):
            ext = guess_extension(mime[j].split(';')[0])
            if ext in ('.jpe', '.jpeg'):
                ext = '.jpg'
                result_file = os.path.join(data_dir, str(i) + str(j)+ ext)
                with open(result_file, mode='wb') as f:
                    f.write(img_url)
                print('fetched', str(i) + str(j) + ext)
            if not ext:
                print('Error in fetching {}\n'.format(img_url))
                continue
```

## 感想
googleのスクリプトが使えなくなったのは、中々ショックでした。。。2019/12時点では動いてたのに・・・  
