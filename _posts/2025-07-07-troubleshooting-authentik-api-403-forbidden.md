---
title: "[TroubleShooting] Authentik API 403 Forbidden"
description: "Authentik API 403 Forbidden Error"
date: 2025-07-07T06:36:08.803Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-Authentik-API-403-Forbidden"
categories: TroubleShooting
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:05:54.807Z
  hash: "1aa9391d82ad3e0d1d78985dfe5cd96153b6c210a13d53ce06b4bfc230279ff4"
---

<a href="#English">English Version</a>

Next.js 프로젝트에서 Authentik 기반 OIDC 인증을 구성한 후, 로그인된 사용자 세션을 기반으로 WebAuthn 장치 정보를 가져오는 API(`/api/auth/webauthn`)에서 production 환경에서만 `403 Forbidden` 오류가 발생하는 문제가 있었다.

<br>

---

<br>

## ✏️ 오류 발생 환경

로그인 후, 다음과 같은 API를 통해 현재 사용자의 WebAuthn 장치 보유 여부를 확인하고자 했다:

```ts
const authentikRes = await fetch(
  `${process.env.NEXT_PUBLIC_AUTHENTIK_URL}api/v3/authenticators/webauthn/`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`, // 액세스 토큰으로 인증
    },
  },
);
```
그러나 production 환경에서 다음과 같은 에러가 발생했다:

```
GET https://app.wedeo.io/api/auth/webauthn 403 (Forbidden)
```
이때 사용한 accessToken은 NextAuth.js의 getToken() 함수로부터 추출한 OAuth2 Access Token이다.

<br>

---

<br>
## ✏️ 원인

Authentik의 공식 문서에서는 다음과 같이 명시되어 있다:

>### JWT Token
OAuth2 clients can request the scope goauthentik.io/api, which allows their OAuth Access token to be used to authenticate to the API.

- 즉, Access Token을 API 인증에 사용하려면 반드시 scope에 goauthentik.io/api가 포함되어 있어야 한다.

- 그러나 기존 설정에서는 scope 항목에 이 값이 누락되어 있었기 때문에, 발급받은 토큰이 API 접근 권한을 갖지 못했고, 그 결과 403 Forbidden 오류가 발생한 것이다.

<br>

---

<br>


## ✏️ 해결방법
OAuth2 인증 요청 시 scope에 goauthentik.io/api를 추가

NextAuth.js의 AuthentikProvider 설정을 다음과 같이 수정하였다:

```ts
const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    AuthentikProvider({
      id: 'authentik',
      name: 'authentik',
      authorization: {
        url: 'http://localhost:9000/application/o/authorize/',
        params: {
          scope: 'openid email profile offline_access goauthentik.io/api',
        },
      },
      clientId: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_SECRET,
      issuer: process.env.NEXT_PUBLIC_AUTHENTIK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
  ],
};
```

해당 설정 이후, 발급된 Access Token은 API 호출 시 Authorization: Bearer 헤더를 통해 인증 토큰으로 정상 인식되었고, 403 Forbidden 오류는 더 이상 발생하지 않았다.

<br> <br><br><br><br><br><br> 

<div id="English"></div>
Issue: 403 Forbidden on Authentik API Call via OAuth Access Token
In a Next.js project, we used Authentik as the OIDC provider.
After logging in, we attempted to query the current user’s WebAuthn devices via the following API:

---
```ts
const authentikRes = await fetch(
  `${process.env.NEXT_PUBLIC_AUTHENTIK_URL}api/v3/authenticators/webauthn/`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
);
```

However, in the production environment, the following error occurred:

```
GET https://app.wedeo.io/api/auth/webauthn 403 (Forbidden)
```

<br>

---

<br>

## ✏️ Root Cause
According to the Authentik documentation, JWT access tokens can only be used to authenticate against the API if the OAuth2 scope includes:

```bash
goauthentik.io/api
```

Without this scope, the access token lacks API privileges and is rejected with a 403 Forbidden response, even if the user is otherwise authenticated.

<br>

---

<br>


## ✏️ Solution
Add goauthentik.io/api to the OAuth2 scope when configuring the provider

We updated the AuthentikProvider configuration in NextAuth.js as follows:

```ts
AuthentikProvider({
  id: 'authentik',
  name: 'authentik',
  authorization: {
    url: 'http://localhost:9000/application/o/authorize/',
    params: {
      scope: 'openid email profile offline_access goauthentik.io/api',
    },
  },
  clientId: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_SECRET,
  issuer: process.env.NEXT_PUBLIC_AUTHENTIK_ISSUER,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
})
```

After including this scope, Authentik issued access tokens that were authorized to access the API.
As a result, the 403 Forbidden error was resolved.