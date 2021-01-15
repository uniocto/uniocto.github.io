---
title: Flutterによる個人androidアプリ開発にGitHub ActionsでCI/CDを導入した話
tags: [flutter]
path: blog/00010
date: 2020-01-15
excerpt: GitHub Actionsを使用して、Flutterのテスト、デプロイの自動化を行います。
cover: ./preview.png
---

# TL;DR
GitHub ActionsとFlutterを使用して、Google Playへのリリースの自動化をしたため、ご紹介させてください。  
現在、CI/CDを導入しているアプリはこちらの[クソアプリ](https://zenn.dev/uniocto/articles/2ac9566d3f1271)になります。
なお、本記事上では、使用したツールやactionsについて、用途は書きますがどういうツールかは説明する予定はございません。  
なお作成にあたり、以下の記事をご参考にさせていただきました。  
https://qiita.com/kasa_le/items/d57ca63f19db0b352790  
https://blog.joshuadeguzman.net/continuous-delivery-for-your-flutter-using-fastlane-github-actions-android

お急ぎの方は以下のyamlファイルを`.github/workflows`下に、`test.sh`をリポジトリ直下に置き、各secretsを登録すれば動作すると思います。  

登録するsecrets
* GH_TOKEN・・・GitHubのトークン。releaseを作成する際に使用。
* KEYSTORE_PASS・・・ビルド時に使用。
* KEYSTORE_KEY_PASS・・・ビルド時に使用。
* PLAYSTORE_ACCOUNT_KEY・・・Google Playにデプロイ時に使用。
* PACKAGE_NAME・・・Google Play上の一意のアプリ名。

```yml
# .github/workflows/ci.yml
name: Flutter CI

on:
  push:
    branches: [ dev ]

env:
  JAVA_VERSION: 12.x
  FLUTTER_VERSION: 1.22.4
  TEST_OUTPUT_DIR: test-reports

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK ${{ env.JAVA_VERSION }}
        uses: actions/setup-java@v1
        with:
          java-version: ${{ env.JAVA_VERSION }}

      - name: Set up flutter ${{ env.FLUTTER_VERSION }}
        uses: subosito/flutter-action@v1
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}

      - name: Set up test environment
        run: |
          flutter pub get
          flutter pub global activate dart_dot_reporter
          flutter pub global activate junitreport
          pip3 install junit2html

      - name: Analyze
        if: always()
        run: |
          flutter analyze
      
      - name: Test
        if: always()
        run: |
          export PATH="$PATH":"${FLUTTER_HOME}/bin/cache/dart-sdk/bin"
          export PATH="$PATH":"${FLUTTER_HOME}/.pub-cache/bin"
          type flutter
          ./test.sh ${TEST_OUTPUT_DIR}

      - name: Arcive test results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: ${{ env.TEST_OUTPUT_DIR }}
          path: ${{ env.TEST_OUTPUT_DIR }}
```

```yml
# .github/workflows/cd.yml
name: Google Play production release

on:
  push:
    branches: [ main ]
env:
  JAVA_VERSION: 12.x
  FLUTTER_VERSION: 1.22.4
  TEST_OUTPUT_DIR: test-reports
  GITVERSION_VERSION: '5.x'

jobs:
  version:
    name: Create version number
    runs-on: ubuntu-latest
    steps:
    - name: Allow unsecure commands
      id: ACTIONS_ALLOW_UNSECURE_COMMANDS
      run: echo 'ACTIONS_ALLOW_UNSECURE_COMMANDS=true' >> $GITHUB_ENV

    - uses: actions/checkout@v1

    - name: Fetch all history for all tags and branches
      run: |
        git config remote.origin.url https://x-access-token:${{ secrets.GH_TOKEN }}@github.com/${{ github.repository }}
        git fetch --prune --depth=10000

    - name: Install GitVersion
      uses: gittools/actions/gitversion/setup@v0.9.3
      with:
          versionSpec: ${{ env.GITVERSION_VERSION }}

    - name: Use GitVersion
      id: gitversion
      uses: gittools/actions/gitversion/execute@v0.9.3

    - name: Create version.txt with nuGetVersion
      run: echo ${{ steps.gitversion.outputs.nuGetVersion  }} > version.txt

    - name: Upload version.txt
      uses: actions/upload-artifact@v2
      with:
        name: gitversion
        path: version.txt
  build:
    name: Build APK and Create release
    needs: [ version ]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1

    - name: Get version.txt
      uses: actions/download-artifact@v2
      with:
        name: gitversion

    - name: Create new file without newline char from version.txt
      run: tr -d '\n' < version.txt > version1.txt

    - name: Read version
      id: version
      uses: juliangruber/read-file-action@v1
      with:
        path: version1.txt

    - name: Update version in YAML
      run: sed -i 's/99.99.99+99/${{ steps.version.outputs.content }}+${{ github.run_number }}/g' pubspec.yaml

    - name: Update KeyStore password in gradle properties
      run: sed -i 's/#{KEYSTORE_PASS}#/${{ secrets.KEYSTORE_PASS }}/g' android/key.properties

    - name: Update KeyStore key password in gradle properties
      run: sed -i 's/#{KEYSTORE_KEY_PASS}#/${{ secrets.KEYSTORE_KEY_PASS }}/g' android/key.properties

    - uses: actions/setup-java@v1
      with:
        java-version: ${{ env.JAVA_VERSION }}

    - uses: subosito/flutter-action@v1
      with:
        flutter-version: ${{ env.FLUTTER_VERSION }}

    - name: Set up test environment
      run: |
        flutter pub get
        flutter pub global activate dart_dot_reporter
        flutter pub global activate junitreport
        pip3 install junit2html

    - name: Analyze
      if: always()
      run: |
        flutter analyze
    
    - name: Test
      if: always()
      run: |
        export PATH="$PATH":"${FLUTTER_HOME}/bin/cache/dart-sdk/bin"
        export PATH="$PATH":"${FLUTTER_HOME}/.pub-cache/bin"
        type flutter
        ./test.sh ${TEST_OUTPUT_DIR}

    - name: Arcive test results
      if: always()
      uses: actions/upload-artifact@v2
      with:
        name: ${{ env.TEST_OUTPUT_DIR }}
        path: ${{ env.TEST_OUTPUT_DIR }}

    - name: Build aab
      run: flutter build appbundle
  
    - name: Create a Release in GitHub
      uses: ncipollo/release-action@v1
      with:
        artifacts: "build/app/outputs/apk/release/*.apk,build/app/outputs/bundle/release/app-release.aab"
        token: ${{ secrets.GH_TOKEN }}
        tag: ${{ steps.version.outputs.content }}
        commit: ${{ github.sha }}

    - name: Upload app bundle
      uses: actions/upload-artifact@v2
      with:
        name: appbundle
        path: build/app/outputs/bundle/release/app-release.aab

  release:
    name: Release app to google play production track
    needs: [ build ]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1

    - name: Get appbundle from artifacts
      uses: actions/download-artifact@v2
      with:
        name: appbundle

    - name: Release app to production track
      uses: r0adkll/upload-google-play@v1
      with:
        serviceAccountJsonPlainText: ${{ secrets.PLAYSTORE_ACCOUNT_KEY }}
        packageName: ${{ secrets.PACKAGE_NAME }}
        releaseFiles: app-release.aab
        track: production
        whatsNewDirectory: distribution/whatsnew
```

```bash
#!/bin/sh
mkdir -p ./test-reports/ 2>/dev/null

flutter test --machine > machine.log
cat machine.log | tojunit --output ./test-reports/TEST-results.xml

flutter pub global run dart_dot_reporter machine.log

python3 -m junit2htmlreport ./test-reports/TEST-results.xml
```


# 実装時の要件
実装時にはざっくりと以下の要件を叶える感じにしたいなと思い、実装しました。特にテストリポートのところは、qiitaの[kasa_leさんの記事](https://qiita.com/kasa_le/items/d57ca63f19db0b352790  )を参考にさせていただきました。
* devブランチにpushすると自動テスト（analyze + test）が実行される
* テストの結果は確認可能である
* mainブランチにマージした際には、テストに問題なければ、Google Playにデプロイされること
* リリースするものは、GitHub上でreleaseが作成される

# 使用させていただいたサービス/ツールなど
## GitHub Actions
GitHubが提供しているCI/CDツールです。無料ユーザーでも1日約66時間は利用できるため、かなり使いたい放題です。  
https://docs.github.com/ja/free-pro-team@latest/actions/learn-github-actions

## action系
使わせていただいたアクションの一覧になります。強い感謝の気持ちしかないです。
* [actions/checkout@v1](https://github.com/actions/checkout)・・・workflow内でリポジトリにアクセスする必要がある時に利用
* [gittools/actions/gitversion/setup@v0.9.3](https://github.com/gittools/actions)・・・GitVersionのセットアップ
* [gittools/actions/gitversion/execute@v0.9.3](https://github.com/gittools/actions)・・・GitVersionの実行
* [actions/upload-artifact@v2](https://github.com/actions/upload-artifact)・・・特定のファイルをGitHubからダウンロード可能にする処理
* [actions/download-artifact@v2](https://github.com/actions/download-artifact)・・・ワークフロー内で一度アップロードしたファイルをワークフローの内にダウンロード
* [juliangruber/read-file-action@v1](https://github.com/juliangruber/read-file-action)・・・ファイル読み込み処理
* [actions/setup-java@v1](https://github.com/actions/setup-java)・・・Javaのセットアップ
* [subosito/flutter-action@v1](https://github.com/subosito/flutter-action)・・・flutterのセットアップ
* [ncipollo/release-action@v1](https://github.com/ncipollo/release-action)・・・GitHub上にリリースの作成
* [r0adkll/upload-google-play@v1](https://github.com/r0adkll/upload-google-play)・・・Google Playにアップロードする処理。リリース先はbetaなど可能

## flutter
Googleが作成したDartのライブラリです。使いやすくて大好きです。  
https://github.com/flutter/flutter

## dart_dot_reporter
Dart/Flutterに関するテストリポートを作成してくれるDartのライブラリです。テスト結果をいい感じにするために使用しています。  
https://github.com/apastuhov/dart_dot_reporter

## junitreport
xml 形式のレポートを生成するツールです。テスト結果をいい感じにするために使用しています。  
https://github.com/RationaleEmotions/junitreport

## junit2html
junit xml ファイルから単一の html ファイルを生成するツールです。
テスト結果をいい感じにしてくれます。Python2系はEOLを2020年に迎えたので、python3を指定する必要があります。  
https://github.com/inorton/junit2html

# 所感
CI/CDを導入してから、デプロイの億劫さもなくなり、だいぶ楽になりました。
もう戻りたくないです。