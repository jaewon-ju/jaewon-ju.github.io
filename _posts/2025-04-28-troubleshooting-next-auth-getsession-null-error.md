---
title: "[TroubleShooting] next-auth getSession null error"
description: "next-auth getSession cookie issue #NextAuthError #SessionNullError #GetSessionProblem #ServerSessionIssue"
date: 2025-04-28T05:04:25.915Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-next-auth-getSession-null-error"
categories: TroubleShooting
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:38:59.419Z
  hash: "e96d932cd8295ffb9dd7849a5a3b91b5ec3db4826424a1f6b1ff0442152545a1"
---

## 오류 상황
Next.js 13 App Router 환경 

>`middleware.ts` 파일 안에서 `getServerSession(authOptions)`을 사용해 세션을 가져오려 했지만, session 값이 `null`인 문제가 발생했다. 

<br>

---

<br>

### ✏️ 오류 발생 코드
```ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log(session); // 항상 null
}
```

<br>

---

<br>

### ✏️ 원인

<a href="https://github.com/nextauthjs/next-auth/issues/4042">Github Issue</a>

>NextAuth의 `getServerSession()`은 내부적으로 `req.headers.cookie`를 읽으려 한다.
그런데 Next.js 미들웨어의 request.headers는 일반적인 객체가 아니라 <span style="color:red">`Headers`</span> 타입이다.
`Headers` 객체는 cookie라는 필드로 접근할 수 없고, `get("cookie")` 메서드를 통해서만 쿠키에 접근할 수 있다.

따라서, 헤더에 담긴 쿠키를 수동으로 읽어와서, 임시 request 객체를 만들어 `getSession({ req: 임시객체 })`로 넘겨주면 정상적으로 세션을 복원할 수 있다.

<br>

---

<br>

### ✏️ 해결 방법
NextRequest로부터 쿠키를 수동으로 추출해 `getSession()`에 넘겨줄 수 있는 request 객체를 만들어준다.

```ts
import { getSession } from "next-auth/react";

export async function middleware(request: NextRequest) {
  const requestForNextAuth = {
    headers: {
      cookie: request.headers.get("cookie"),
    },
  };

  const session = await getSession({ req: requestForNextAuth });
  const token = session?.accessToken;
  
  console.log(session);
  console.log(token);
}
```
- request.headers.get("cookie")를 통해 클라이언트로부터 전달된 쿠키를 가져온다.
- 가져온 쿠키를 포함하는 임시 req 객체를 만들어 getSession({ req })에 넘긴다.

<br>

#next-auth getSession null
#next-auth getServerSession null
#next-auth app router getSession
#next-auth app router middleware
#next-auth session not found
#next-auth getSession cookie issue
#next-auth nextrequest getSession
#next-auth next.js 13 app router session
#next-auth middleware token 가져오기
#next-auth getSession edge runtime
#next-auth getSession nextrequest
#next-auth getServerSession request headers
#next-auth session 복구 오류
#next-auth middleware 인증 문제
#next-auth app router 인증 처리
#next-auth session token 직접 전달

