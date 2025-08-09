---
title: "[TroubleShooting] NextAuth - Authentik Docker Issue (1)"
description: "Authentik을 docker container로 돌렸을 때 발생하는 오류"
date: 2025-06-16T07:12:24.418Z
tags: []
slug: "TroubleShooting-NextAuth-Authentik-Docker-Issue-1"
series:
  id: 3530ae60-5e2d-416b-9327-13c5e62bf4c7
  name: "TroubleShooting"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:01.804Z
  hash: "53ef44f7a3d94ae9a69cdca1bd5cfb37250179ba36f3898e98ba6095c6bb608b"
---

<a href="#English">English Version</a>
Next.js 프로젝트에서 Authentik을 OIDC Provider로 사용하기 위해, docker-compose 환경에서 Nginx를 통해 리버스 프록시를 구성하였다.
이 과정에서 /authentik/와 같은 서브패스 방식으로 Authentik을 배포하려 했으나, 정적 파일 로드 실패로 인해 인증 화면 자체가 정상 렌더링되지 않았다.

<br>

## ✏️ 오류 발생 환경
Nginx에서 다음과 같이 서브패스 프록시를 구성했었다:

```nginx
location /authentik/ {
    proxy_pass http://server:9000/;
    ...
}
```

그러나 브라우저에서 Authentik에 접근하면 다음과 같이 정적 파일 요청 실패가 발생:

```bash
GET http://app.localhost/static/dist/main.js 404 (Not Found)
GET http://app.localhost/static/dist/theme.css 404 (Not Found)
```

<br>

---

<br>

## ✏️ 원인
>Authentik은 내부적으로 정적 리소스의 경로를 절대경로`(/static/...)`로 지정하고 있다.
서브패스를 사용하면 브라우저가 `/authentik/static/...` 경로를 요청해야 하는데, Authentik은 이를 상대 경로가 아닌 절대경로`(/static/...)`로 반환하여 충돌 발생.

- 결과적으로 정적 리소스 요청이 전부 404 에러로 실패.


<br>

---

<br>

## ✏️ 해결방법
서브도메인 방식으로 분리하여 각각 독립적인 도메인으로 서비스

- Authentik → auth.localhost
- Next.js → app.localhost

이를 위해 Nginx에서 다음과 같이 도메인 단위로 리버스 프록시 설정을 변경:

```bash
server {
    listen 80;
    server_name auth.localhost;

    location / {
        proxy_pass http://authentik:9000;
        ...
    }
}

server {
    listen 80;
    server_name app.localhost;

    location / {
        proxy_pass http://nextjs-app:3000;
        ...
    }
}
```

이후 Authentik의 PUBLIC_URL을 ```http://auth.localhost```로 지정하여 절대경로 문제도 동시에 해결됨.
이로써 인증 UI, 정적 파일, OIDC 엔드포인트 모두 정상 동작하게 되었다.

<br>



<br>
<br>
<br>
<br>
<br>
<br>
<br>

<div id = "English"></div>
Subpath Issue When Running Authentik via Docker (Static Files Failing to Load)
In a Next.js project using Authentik as an OIDC provider, Nginx was configured as a reverse proxy in a docker-compose environment.
During this process, Authentik was deployed under a subpath (e.g. /authentik/), but static files failed to load, preventing the authentication UI from rendering properly.


<br>

---
<br>

## ✏️ Error Scenario
Initially, Nginx was configured with the following subpath proxy rule:

```bash
location /authentik/ {
    proxy_pass http://authentik:9000/;
    ...
}
```
However, when accessing Authentik in the browser, static resource requests failed:

```bash
GET http://app.localhost/static/dist/main.js 404 (Not Found)
GET http://app.localhost/static/dist/theme.css 404 (Not Found)
```

<br>

---

<br>

## ✏️ Root Cause
Internally, Authentik uses absolute paths (/static/...) for its static resources.
When using a subpath, the browser expects URLs like /authentik/static/....
However, Authentik returns absolute URLs such as /static/..., which leads to incorrect requests.

As a result, all static resource requests fail with 404 Not Found errors.

<br>

---

<br>


## ✏️ Solution
Instead of using subpaths, configure separate subdomains to serve each service independently:
- Authentik → auth.localhost
- Next.js → app.localhost

Update Nginx configuration to route by domain:

```bash
server {
    listen 80;
    server_name auth.localhost;

    location / {
        proxy_pass http://authentik:9000;
        ...
    }
}

server {
    listen 80;
    server_name app.localhost;

    location / {
        proxy_pass http://nextjs-app:3000;
        ...
    }
}
```


This resolves the absolute path issue entirely, allowing the authentication UI, static files, and all OIDC endpoints to work correctly.

