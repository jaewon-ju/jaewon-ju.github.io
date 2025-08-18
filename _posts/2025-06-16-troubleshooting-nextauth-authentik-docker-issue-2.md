---
title: "[TroubleShooting] NextAuth - Authentik Docker Issue (2)"
description: "Authentik을 docker container로 돌렸을 때 발생하는 오류"
date: 2025-06-16T07:23:38.830Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-NextAuth-Authentik-Docker-Issue-2"
categories: TroubleShooting
velogSync:
  lastSyncedAt: 2025-08-18T06:18:44.240Z
  hash: "df2fc531c380b47e92ce890faf8d5ca28fb30d408a122b8da7a227b961f1edee"
---

<a href="#English">English Version</a>
Next.js 프로젝트에서 Authentik을 OIDC Provider로 사용하고자 하였고, docker-compose 기반에서 Authentik을 server:9000 으로 내부 연결하였다.
이 과정에서 NextAuth.js가 wellKnown 메커니즘을 통해 Authentik의 Public URL을 잘못 해석하면서 OAuth 인증 흐름이 정상적으로 동작하지 않는 문제가 발생했다.


<br>

---

<br>


## ✏️ 오류 발생 환경
NextAuth.js의 AuthentikProvider를 다음과 같이 설정:

```typescript
wellKnown: 'http://server:9000/application/o/wedeo/.well-known/openid-configuration'
```

이 때 NextAuth.js 라이브러리 내부 코드를 확인한 결과:

- wellKnown 옵션이 존재하면, NextAuth.js는 해당 엔드포인트로 직접 HTTP 요청을 보내어 authorize, token, jwks, userinfo 등의 엔드포인트 URL을 동적으로 가져옴.

- 이 과정에서 다음과 같은 OIDC 메타데이터가 반환됨:
```json
{
  "authorization_endpoint": "http://server:9000/application/o/authorize/",
  "token_endpoint": "http://server:9000/application/o/token/",
  "userinfo_endpoint": "http://server:9000/application/o/userinfo/",
  "jwks_uri": "http://server:9000/application/o/wedeo/jwks/"
}
```

<br>

그러나 이 URL들은 브라우저 입장에서 접근이 불가능함:
- 브라우저 → server:9000 → Docker 내부 DNS → 접근 불가 (브라우저는 내부 컨테이너 네트워크를 인식하지 못함)
- <span style = "color:red">브라우저는 반드시 auth.localhost 와 같은 public-facing 도메인을 통해 접근해야 한다.</span>

<br>

---

<br>

## ✏️ 원인
NextAuth.js는 wellKnown를 통해 OIDC 서버 메타데이터를 자동 수집함.

- wellKnown 응답에 포함되는 모든 엔드포인트가 상대 경로가 아닌 절대 경로로 반환됨.
- Authentik은 이 절대 경로를 PUBLIC_URL 기준으로 계산함 → 현재는 내부 DNS(server:9000) 기준으로 URL을 생성.

따라서, Authorization URL → 브라우저 접근 실패
Token URL → docker 내부 호출 시 Connection refused

특히, 만약 wellKnown에 `auth.localhost`를 넣더라도 문제가 발생하는데:

Authorization URL은 정상작동하나
이후 토큰 교환 과정에서 Next.js 서버가 auth.localhost에 접근하려다 → ECONNREFUSED 발생 (docker 내부에서 외부 도메인으로 연결 불가)

결국 브라우저용 엔드포인트와 서버용 엔드포인트가 충돌하는 문제 발생.


<br>

---

<br>

## ✏️ 해결방법
> wellKnown 자동 요청을 완전히 차단

- wellKnown: null로 설정하여 NextAuth.js가 OIDC 서버 메타데이터를 자동으로 가져오지 않도록 만듦
- 모든 OIDC 엔드포인트를 명시적으로 수동 지정

```typescript
AuthentikProvider({
  id: 'authentik',
  name: 'authentik',
  authorization: {
    url: 'http://auth.localhost/application/o/authorize/',
    params: { scope: 'openid email profile offline_access' },
  },
  clientId: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_SECRET,
  wellKnown: null, // 자동 wellKnown 사용 차단
  jwks_endpoint: 'http://server:9000/application/o/wedeo/jwks/',
  issuer: 'http://server:9000/application/o/wedeo/',
  token: 'http://server:9000/application/o/token/',
  userinfo: 'http://server:9000/application/o/userinfo/',
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
})
```

<br>
<br><br><br><br><br><br>

<div id="English"></div>

# Issue: Incorrect Public URL Resolution When Using Authentik as OIDC Provider in Docker with Next.js

In a Next.js project, Authentik was used as the OIDC Provider.
Inside a docker-compose setup, Authentik was internally exposed as `server:9000`.
During integration with NextAuth.js, Public URL resolution issues occurred due to how NextAuth.js retrieves OIDC metadata using the `wellKnown` mechanism, ultimately breaking the OAuth flow.

---

## ✏️ Problem Environment

The AuthentikProvider in NextAuth.js was configured as follows:

```typescript
wellKnown: 'http://server:9000/application/o/wedeo/.well-known/openid-configuration'
```

By inspecting the NextAuth.js library code directly:

* If `wellKnown` is specified, NextAuth.js sends an HTTP request to the provided endpoint.
* It dynamically retrieves the OIDC metadata such as `authorization`, `token`, `userinfo`, `jwks`, etc.

The returned metadata looked like this:

```json
{
  "authorization_endpoint": "http://server:9000/application/o/authorize/",
  "token_endpoint": "http://server:9000/application/o/token/",
  "userinfo_endpoint": "http://server:9000/application/o/userinfo/",
  "jwks_uri": "http://server:9000/application/o/wedeo/jwks/"
}
```

However, these URLs are **inaccessible from the browser**:

* Browser → `server:9000` → Docker internal DNS → unreachable (browsers have no knowledge of container-internal DNS)
* **The browser must always use a public-facing domain such as `auth.localhost`**.

<br>

---

<br>

## ✏️ Root Cause

* NextAuth.js automatically fetches OIDC server metadata using `wellKnown`.
* The OIDC server (Authentik) returns **absolute URLs** (not relative paths).
* Authentik generates these URLs based on its configured `PUBLIC_URL`, which in this case is incorrectly resolved to `server:9000`.

This causes:

* `authorization_endpoint` → Browser cannot reach `server:9000` → login fails.
* `token_endpoint` → When exchanging the token, server-to-server call to `server:9000` succeeds, but when switched to `auth.localhost`, it causes `ECONNREFUSED` inside Docker because containers must use Docker internal DNS.

> ⚠ Even if `wellKnown` is pointed to `auth.localhost`, problems remain:
>
> * Authorization URL works in browser.
> * But token exchange fails inside Docker since container cannot resolve external domain `auth.localhost`.

<br>

---

<br>

## ✏️ Solution

> **Fully disable automatic wellKnown discovery**

* Set `wellKnown: null` to prevent NextAuth.js from automatically requesting OIDC metadata.
* Manually define all OIDC endpoints to fully control internal vs public routing.

```typescript
AuthentikProvider({
  id: 'authentik',
  name: 'authentik',
  authorization: {
    url: 'http://auth.localhost/application/o/authorize/',
    params: { scope: 'openid email profile offline_access' },
  },
  clientId: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_SECRET,
  wellKnown: null, // disable automatic metadata fetching
  jwks_endpoint: 'http://server:9000/application/o/wedeo/jwks/',
  issuer: 'http://server:9000/application/o/wedeo/',
  token: 'http://server:9000/application/o/token/',
  userinfo: 'http://server:9000/application/o/userinfo/',
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
})
```
