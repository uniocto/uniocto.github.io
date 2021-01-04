---
title: トイレを教えてくれるアプリを開発する
tags: [flutter,ML,python]
path: blog/00009
date: 2020-12-21
excerpt: トイレを教えてくれるアプリを開発します。
cover: ./preview.png
---

この記事は「[クソアプリ2 Advent Calendar 2020](https://qiita.com/advent-calendar/2020/kuso-app2)」の20日目の記事です。

# TL;DR
トイレが見つからずに困った経験、ありませんか。
そんなとき、助けてくれる味方が欲しいと考え、アプリを作ることにしました。

# 使い方
アプリを起動する。カメラを振り回してください。
画像からトイレのピクトグラムを見つけた際に、音と画面の両方で教えてくれます。
見つけた箇所にキラキラ光るエフェクトがつきます。

# デモ
@[tweet](https://twitter.com/uniocto/status/1340257765176983552)


# 以下作るまでの流れ
# データ準備
近所のデパートで画像を60枚ほど撮影させていただきました。ここで必要なのは、何より精神力です。
周囲の迷惑をかけず、かつ誤解を招かないよう最新の注意を払いながら撮影しました。
ここのベストプラクティスは、「普段使わないが、決して怪しくない服装」、「人気が少ない時間」、「人気の少ない場所」、「全身でトイレのアイコンのみを撮りに行く」、「人を一切映さない」です。
なお、ここ以降でお伝えできるプラクティスはないです。

# 前処理
前処理はlabelImageを利用いたしました。ポチポチ枠をつけて、xml形式で保存します。
https://github.com/tzutalin/labelImg
![](https://storage.googleapis.com/zenn-user-upload/8vgggm8ceei4aqv95g9ixzt49r7u)


# モデル構築
tensorflowのチュートリアルを参考に、モデルを構築しました。Google先生には頭が上がりません。
https://github.com/tensorflow/models/blob/master/research/object_detection/colab_tutorials/eager_few_shot_od_training_tflite.ipynb

xmlを読み込む際につけたラベルは以下みたいな感じで処理しました。
```python
import glob
import xml.etree.ElementTree as ET
files = glob.glob(annotations_dir)

image_width = 640
image_height = 853

gt_boxes = []
image_f_names = []
for i in files:
    tree = ET.parse(i)
    root = tree.getroot()
    image_f_names.append(os.path.basename(root[2].text))
    gt_boxes.append(np.array([[
        int(root[6][4][1].text) / image_width, # x
        int(root[6][4][0].text) / image_height, # y
        int(root[6][4][3].text) / image_width, # w
        int(root[6][4][2].text) / image_height # h
    ]], dtype=np.float32))
```

# アプリを開発する
趣味でflutterを触っていたため、下記リポジトリを参考にアプリ部分を実装しました。
シンプルなアプリですので、やっていることは以下リポジトリと大体同じです。
https://github.com/shaqian/flutter_realtime_detection


### 音声出力を担うクラス
flutter_ttsというライブラリを使用いたしました。
https://pub.dev/packages/flutter_tts
```dart
import 'dart:async';
import 'dart:math' as math;
import 'dart:io' show Platform;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

const List<String> customaryEpithet = [
  "Buddy! I found the toilet.",
  "You're lucky. That's the goal.",
  "Maybe it's the toilet.",
  "You can trust me, or you can lose everything here."
];


enum TtsState { playing, stopped, paused, continued }

class Speecher {
  static var _instance;
  factory Speecher() {
    if (_instance == null) {
      _instance = new Speecher._internal();
      _instance.initTts();
    }
    return _instance;
  }

  Speecher._internal();

  FlutterTts flutterTts;
  dynamic languages;
  String language;
  double volume = 0.5;
  double pitch = 1.0;
  double rate = 0.5;
  final random = math.Random();

  TtsState ttsState = TtsState.stopped;

  get isPlaying => ttsState == TtsState.playing;

  get isStopped => ttsState == TtsState.stopped;

  get isPaused => ttsState == TtsState.paused;

  get isContinued => ttsState == TtsState.continued;

  initTts() {
    flutterTts = FlutterTts();

    _getLanguages();

    if (!kIsWeb) {
      if (Platform.isAndroid) {
        _getEngines();
      }
    }
    flutterTts.setVolume(volume);
    flutterTts.setSpeechRate(rate);
    flutterTts.setPitch(pitch);
  }

  Future _getLanguages() async {
    languages = await flutterTts.getLanguages;
  }

  Future _getEngines() async {
    var engines = await flutterTts.getEngines;
    if (engines != null) {
      for (dynamic engine in engines) {
        print(engine);
      }
    }
  }

  Future speakText() async {
    if (ttsState == TtsState.stopped) {
      ttsState = TtsState.playing;
      await flutterTts.awaitSpeakCompletion(true);
      await flutterTts.speak(customaryEpithet[random.nextInt(customaryEpithet.length)]);
      ttsState = TtsState.stopped;
    }
    return;
  }
}

```

### キラキラのエフェクトをつけるwidget
glittersというライブラリを使用して実装しました。キラキラの表示範囲を絞る際の枠計算は元のものとほとんど同じです。
https://pub.dev/packages/glitters
```dart
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:glitters/glitters.dart';
import 'package:quntum_mind/resources/models/results.dart';
import 'package:quntum_mind/widgets/components/speecher.dart';

class BndBox extends StatelessWidget {
  final BndBoxResult bndboxresult;

  BndBox(this.bndboxresult);

  @override
  Widget build(BuildContext context) {
    Size screen = MediaQuery.of(context).size;
    final List<dynamic> results = bndboxresult.results;
    final int previewH = bndboxresult.height;
    final int previewW = bndboxresult.width;
    final double screenH = math.max(screen.height, screen.width);
    final double screenW = math.min(screen.height, screen.width);

    List<Widget> _renderBox() {
      if (results.length == 0) return [];
      if (results[0]["detectedClass"] != "toilet") return [];
      var _x = results[0]["rect"]["x"];
      var _w = results[0]["rect"]["w"];
      var _y = results[0]["rect"]["y"];
      var _h = results[0]["rect"]["h"];
      double scaleW, scaleH, x, y, w, h;

      if (screenH / screenW > previewH / previewW) {
        scaleW = screenH / previewH * previewW;
        scaleH = screenH;
        var difW = (scaleW - screenW) / scaleW;
        x = (_x - difW / 2) * scaleW - 10;
        w = _w * scaleW + 20;
        if (_x < difW / 2) w -= (difW / 2 - _x) * scaleW;
        y = _y * scaleH - 10;
        h = _h * scaleH + 20;
      } else {
        scaleH = screenW / previewW * previewH;
        scaleW = screenW;
        var difH = (scaleH - screenH) / scaleH;
        x = _x * scaleW - 10;
        w = _w * scaleW + 20;
        y = (_y - difH / 2) * scaleH - 10;
        h = _h * scaleH + 20;
        if (_y < difH / 2) h -= (difH / 2 - _y) * scaleH;
      }

      Speecher().speakText();
      return [
        Positioned(
          left: math.max(0, x),
          top: math.max(0, y),
          width: w,
          height: h,
          child: Container(
            padding: EdgeInsets.only(top: 5.0, left: 5.0),
            child: Stack(
              children: const <Widget>[
                Glitters(
                  minSize: 8.0,
                  maxSize: 20.0,
                  interval: Duration.zero,
                  maxOpacity: 0.7,
                ),
                Glitters(
                  minSize: 10.0,
                  maxSize: 25.0,
                  interval: Duration(milliseconds: 20),
                  color: Colors.lime,
                ),
                Glitters(
                  minSize: 10.0,
                  maxSize: 25.0,
                  duration: Duration(milliseconds: 200),
                  inDuration: Duration(milliseconds: 500),
                  outDuration: Duration(milliseconds: 500),
                  interval: Duration(milliseconds: 30),
                  color: Colors.white,
                  maxOpacity: 0.7,
                ),
                Glitters(
                  minSize: 14.0,
                  maxSize: 30.0,
                  interval: Duration(milliseconds: 40),
                  color: Colors.orange,
                ),
              ],
            ),
          ),
        )
      ];
    }

    return Stack(
      children: _renderBox(),
    );
  }
}

```

# 雑感
クソアプリは毎年楽しみにしていたので、参加できて良かったです。
なお、アプリは年始にandroid版をリリースする予定です。
もしご興味のある方は、こんなクソでもインストールいただけると嬉しいです。