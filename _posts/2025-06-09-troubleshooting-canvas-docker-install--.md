---
title: "[TroubleShooting] Canvas Docker install 오류"
description: "Docker로 Next.js 프로젝트를 빌드하는 과정에서, npm ci 명령어 실행 시 canvas 모듈의 네이티브 바이너리 설치 실패로 인해 빌드가 중단되는 오류"
date: 2025-06-09T05:38:40.594Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-Canvas-Docker-install-오류"
categories: TroubleShooting
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:38:59.356Z
  hash: "678abe3830683411e66f6f9f2e151af05792a5f26ad8c39cc414fbb74af30f09"
---

Docker로 Next.js 프로젝트를 빌드하는 과정에서, npm ci 명령어 실행 시 canvas 모듈의 네이티브 바이너리 설치 실패로 인해 빌드가 중단되었다.

에러 메시지는 다음과 같다:

```bash
npm error node-pre-gyp ERR! install response status 404 Not Found on https://github.com/Automattic/node-canvas/releases/download/...
npm error Package pangocairo was not found in the pkg-config search path.
npm error gyp ERR! stack Error: `gyp` failed with exit code: 1
```

<br>

## ✏️ 오류 발생 환경
Next.js 프로젝트의 Dockerfile에서 다음과 같이 npm ci를 실행하는 코드가 포함되어 있었다:

```Dockerfile
RUN npm ci --prefer-offline --no-audit
```

<br>

해당 프로젝트는 canvas 모듈을 사용하고 있었고, 이 모듈은 C++로 구현된 네이티브 확장 모듈이므로 시스템 레벨의 라이브러리와 빌드 도구가 필요하다. 하지만 Docker 이미지에는 이러한 의존성이 포함되어 있지 않아 빌드 실패가 발생하였다.

<br>

---

## ✏️ 원인
canvas는 사전 빌드된 바이너리를 찾지 못하면 직접 소스 빌드 시도
- 이 과정에서 pkg-config, pangocairo, libcairo2-dev 등 필수 시스템 패키지가 누락되어 빌드 실패
- 기본적으로 사용하는 node 기반 Docker 이미지에는 이러한 라이브러리가 없기 때문에 gyp 빌드가 실패함

<br>

---
## ✏️ 해결방법
canvas 빌드를 위해 필요한 패키지들을 Dockerfile에 명시적으로 설치한다. 예시는 다음과 같다:

```bash
FROM node:20

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  pkg-config \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  && rm -rf /var/lib/apt/lists/*
```

위 패키지를 설치한 후 다시 npm ci를 실행하면 canvas 모듈도 문제없이 설치된다.
이제 docker-compose up --build 명령으로도 빌드가 정상 완료되며, Next.js 앱이 정상적으로 구동된다.