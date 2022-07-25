# Immersal Localization Testbed with Babylon WebAR

[English](./README.md)

https://user-images.githubusercontent.com/11372210/180830750-a18cdac0-3e3e-43e1-ba28-310c143e41f0.mp4

## About

Babylon.js の WebAR で Immersal の位置合わせを行う検証実装です。

`camera-access`という WebXR Device API のモジュールを使用して、
AR のカメラ情報にアクセスしカメラ画像やカメラの内部パラメータを取得・算出しています。

それらの情報を Immersal REST API によって位置合わせをし、
レスポンスデータからカメラの姿勢を計算しています。

## Environment

- Babylon.js 5.13.3
- Immersal REST API 1.16.1
- Vite 2.9.9
- TypeScript
- yarn
- Node.js 16.13
- Windows 10 Home
- Android 12 Pixel 4a 5G

## Setup

まずローカル環境で https を有効にするためにｵﾚｵﾚ証明書を発行します。
WSL を立ち上げて以下のコマンドを入力。
途中で CommonName を聞かれるので、`https://<IPアドレス>:3000`と入力。

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

### `.env.local`の作成

プロジェクトルートに`.env.local`ファイルを作成し、
その中に Immersal の開発者トークンとマップの ID を記述。

```
VITE_IMMERSAL_TOKEN=<Immersalのトークン>
VITE_MAP_ID=<マップID>
```

### yarn の実行

```
yarn
```

### WebXR Incubation の有効化

2022/07/26 現在は`camera-access`が実験的機能として**Chrome for Android のみ**
で提供されている。
そのため`chrome://flags`にアクセスして WebXR Incubation を enable にしたうえで実行しなくてはいけない。

## Usage

下記コマンドを実行し、ローカルサーバーを実行。

```
yarn dev
```

## Contact

何かございましたら、[にー兄さんの Twitter](https://twitter.com/ninisan_drumath)までご連絡ください。
