# Immersal Localization Testbed with Babylon WebAR

[日本語](./README_ja.md)

https://user-images.githubusercontent.com/11372210/180830750-a18cdac0-3e3e-43e1-ba28-310c143e41f0.mp4

## About

An testbed project to localize Immersal 3D map within Babylon.js WebAR app.

To get and calculate camera images and camera intrinsics, `camera-access` module for WebXR Device API can be used.

From these data, we can get pose matrix of WebAR camera.

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

### Enable https

First of all, you have to create SSL/TLS certificate and you can use openssl command.
When you are asked `CommonName` in the shell, answer `https://<IP Adress>:3000`

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

### Add `.env.local`

Create `.env.local` file under the project root directory,
and put Immersal API Token and Map ID you will localize.

```
VITE_IMMERSAL_TOKEN=<Immersal API TOKEN>
VITE_MAP_ID=<MAP ID>
```

### Install dependency

```
yarn install
```

### Enable WebXR Incubation

Now, `camera-access` is provided for **only Chrome for Android.**
You have to access to `chrome://flags` and enable "WebXR Incubation".

## Usage

Run this app for the command below.

```
yarn dev
```

## Contact

You can ask me anything on [my twitter](https://twitter.com/ninisan_drumath).
