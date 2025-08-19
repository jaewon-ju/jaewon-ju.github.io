---
title: "[TroubleShooting] Cloudflare Workers-JOSEError"
description: "jOSEError - Expected 200 OK from the JSON Web Key Set HTTP response"
date: 2025-05-19T06:38:31.555Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-Cloudflare-Workers-JOSEError"
categories: TroubleShooting
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:11:50.487Z
  hash: "d701881bed49f38dd6ec12fceb47362b6bc4421c03d4cf21790ee21e1397285b"
---

Cloudflare Workers에서 jose를 사용해 JWT를 검증하는 도중, JWKS 키셋을 불러오는 요청에서 200 OK가 오지 않아 JOSEError가 발생했다.

에러 메시지는 다음과 같다.

```bash
"error_message": "Expected 200 OK from the JSON Web Key Set HTTP response"
```
---

<br>

### ✏️ 오류 발생 코드

Authentik에서 발급된 JWT를 `jose` 라이브러리로 검증하기 위해, 아래와 같이 `createRemoteJWKSet`으로 JWKS URL을 설정하였다.

```ts
const AUTHENTIK_JWKS_URL = c.env.AUTHENTIK_JWKS_URL;
const JWKS = createRemoteJWKSet(new URL(AUTHENTIK_JWKS_URL));

const { payload } = await jwtVerify(token, JWKS, {
  issuer: c.env.AUTHENTIK_ISSUER,
});
```

<br>

하지만...
.dev.vars에 분명 JWKS URL을 올바르게 입력했음에도, 여전히 JOSEError: Expected 200 OK... 에러가 발생했다.

<br>

### ✏️ 원인
결론부터 말하자면, 환경변수 덮어쓰기 이슈였다.

로컬 개발 중 npx wrangler dev를 실행했을 때, 예상과는 다르게 c.env.AUTHENTIK_JWKS_URL 값이 .dev.vars의 로컬 값이 아닌, wrangler.toml의 [vars] 혹은 [env.production.vars]에 설정된 값으로 덮어쓰이고 있었던 것이다.

즉, 로컬 개발인데도 배포용 환경변수가 로드되어 localhost 대신 접근 불가능한 URL로 요청을 보내고 있었던 것이다.

<br>

### ✏️ 해결방법
환경별 변수를 명확하게 분리하고, 로컬 개발 환경에서 올바른 환경변수가 로드되도록 설정한다.


wrangler dev 실행 시 반드시 --env 옵션을 명시한다.

```
npx wrangler dev --env dev
```


이후에는 문제없이 JWKS URL에 fetch 요청이 성공했고, jwtVerify도 정상적으로 동작하였다.