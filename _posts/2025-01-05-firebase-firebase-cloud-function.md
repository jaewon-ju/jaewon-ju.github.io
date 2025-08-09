---
title: "[Firebase] Firebase Cloud Function"
description: "Firebase 백엔드 서비스인 Cloud Function에 대해서"
date: 2025-01-05T03:14:38.415Z
tags: ["Firebase"]
slug: "Firebase-Firebase-Cloud-Function"
series:
  id: 865cd188-a04a-42fd-a30d-e7606b6f29f2
  name: "Firebase"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:52.811Z
  hash: "5d551189ca09ca09dc4d522326f837097064a68c751a48cebd6613e1f3b2027f"
---

#### Firebase Cloud Functions란 
Firebase에서 제공하는 서버리스(Serverless) 백엔드 서비스로, 개발자가 서버를 직접 관리하지 않고 클라우드에서 자동으로 확장 가능한 코드를 실행할 수 있도록 도와준다.

---

<br>

## ✏️ Firebase Cloud Functions 트리거

>Firebase Cloud Functions에서는 두 가지 트리거 방식을 제공한다.

<br>

### ■ `onCall()`
- **매개변수**: Handler function
  - 형식: `async (data, context) => {}`
  - **data**: 클라이언트에서 전달한 데이터
  - **context**: 인증 정보, 호출 메타데이터 등 포함

<br>

#### 정의 방법 - 백엔드
```tsx
export const getBillingKey = regionalFunctions.https.onCall(
  async (data: { authKey: string; customerKey: string }, context) => {
    const { authKey, customerKey } = data;
    
	...
    
    return { success: true, billingKey };
  }
);
```

<br>

#### 사용 방법 - 프론트엔드

```tsx
const getBillingKey = httpsCallable<
  { authKey: string; customerKey: string },
  { billingKey: string }
>(functions, 'getBillingKey');

const result = await getBillingKey({ authKey, customerKey });
```
<br>

---

### ■ `onRequest()`
- **매개변수**: Handler function
  - 형식: `async (req, res) => {}`
  - **req**: 요청 객체 (Express와 동일)
  - **res**: 응답 객체 (Express와 동일)

#### 정의 방법 - 백엔드

```tsx
const functions = require("firebase-functions");

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello, World!");
});
```

<br>

#### 사용 방법 - 프론트엔드

```tsx
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const addMessage = httpsCallable(functions, 'helloWorld');

await helloWorld();
```

<br>

---

### ■ onCall과 onRequest의 차이점

| **구분**      | **onCall**                                      | **onRequest**                                    |
|---------------|-------------------------------------------------|-------------------------------------------------|
| **호출 방식**  | 클라이언트의 `firebase.functions()`를 통해 호출 | 표준 HTTPS 클라이언트 (`fetch`, `Axios` 등) 사용 |
| **보안 처리**  | Firebase 인증 및 보안 규칙 자동 처리               | <span style = "color:red">⚠️</span> CORS 설정 필요                                    |
| **사용 목적**  | Firebase와의 간편한 통합                         | 일반적인 HTTP 엔드포인트                        |



<br>

>### <span style = "color:red">⚠️</span> CORS 문제
- **onCall**: CORS 설정 불필요 (Firebase가 자동 처리)
- **onRequest**: Express와 유사하게 별도의 CORS 설정 필요

<br>

---

<br>

## ✏️ Firebase Emulator
>Firebase Function은 Firebase Emulator를 통해 테스트해볼 수 있다.

아래는 Firebase Emulator로 Function을 테스트 하는 과정이다.

### 1. Firebase CLI 설정
1. **Firebase CLI 설치**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase 로그인**:
   ```bash
   firebase login
   ```

3. **Firebase 프로젝트 초기화**:
   ```bash
   firebase init
   ```
   - Functions 선택
   - TypeScript 사용 권장
   - Functions Emulator 활성화


<br>

### 2. Cloud Function 작성

#### HTTP 함수 예제
```typescript
import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello, World!");
});
```

#### Callable 함수 예제
```typescript
import * as functions from "firebase-functions";

export const addMessage = functions.https.onCall((data, context) => {
  return { text: `Message received: ${data.text || 'Hello'}` };
});
```


<br>


### 3. TypeScript 빌드
1. **functions 폴더로 이동**:
   ```bash
   cd functions
   ```

2. **컴파일 실행**:
   ```bash
   npm run build
   ```
   - `functions/src` 코드가 `functions/lib`로 변환됨


<br>

### 4. Firebase 설정 파일 확인 (`firebase.json`)
```json
{
  "functions": {
    "source": "functions"
  },
  "emulators": {
    "functions": {
      "port": 5001
    }
  }
}
```


<br>

### 5. Firebase Emulator 실행
```bash
firebase emulators:start
```
- HTTP 함수 테스트 URL:
  ```
  http://127.0.0.1:5001/{프로젝트ID}/{지역}/{함수이름}
  ```

<br>

---

<br>

## ✏️ Scheduling with Firebase Cloud Functions

>Firebase Cloud Functions는 Google Cloud의 Pub/Sub와 통합되어 **스케줄링 작업**을 수행할 수 있다.

<br>

### ■ 주요 개념
- **Pub/Sub**:
   - Publisher (발행자):
      - 메시지를 생성하고 특정 주제(Topic)에 발행.
      - 예: 사용자 이벤트, 로그 데이터, 상태 변경 등을 메시지로 발행.
      <br>
   - Subscriber (구독자):
      - 특정 주제를 구독하여 발행된 메시지를 수신.
      - 예: 데이터 처리, 알림 전송, 추가 작업 수행.
      
<br>

### ■ 예제 코드

```tsx
// 매일 자정에 실행되는 스케줄링 함수
exports.accountcleanup = onSchedule("every day 00:00", async (event) => {
  // 비활성 사용자 조회
  const inactiveUsers = await getInactiveUsers();

  // 비활성 사용자 삭제
  const promisePool = new PromisePool(
      () => deleteInactiveUser(inactiveUsers),
      MAX_CONCURRENT
  );
  await promisePool.start();

  logger.log("User cleanup finished");
});
```

<br>

---

<br>

## ✏️ Next.js + Cloud Function에 Swagger 적용

Next.Js를 사용해서 프로젝트를 진행하던 중 프론트엔드 개발자와 협업이 필요해서, Cloud Function을 API Document로 작성할 수 있는지 찾아보았다.

필자는 다음과 같은 방법으로 Cloud Function을 문서화했다.


>1. `function/src/**.js` : Cloud Function에 JSDoc 주석 작성
2. `scripts/swagger-config.js` : swagger-jsdoc 설정 (OpenAPI 정보, apis 경로 등)
3. `scripts/generate-swagger.js` : 위 설정을 사용해 swagger.json 생성하는 스크립트 작성
4. `package.json`에 스크립트 추가
5. `npm run generate:swagger`로 `public/swagger.json` 파일 생성
6. `src/app/swagger/page.tsx` : Swagger UI 페이지 작성
7. 브라우저에서 확인

<br>

### ■ 프로젝트 구조

아래와 같은 프로젝트 구조를 적용해서 Swagger를 적용했다.
```
project/
│
├─ firebase.json            // Firebase 프로젝트 설정 (emulator, hosting, functions 등)
│
├─ next.config.js           // Next.js 설정
│
├─ public/
│   └─ swagger.json         // JSDoc → Swagger 변환 후 생성되는 최종 문서 (배포 시 포함)
│
├─ scripts/
│   ├─ swagger-config.js    // swagger-jsdoc 설정 (OpenAPI 정보, apis 경로 등)
│   └─ generate-swagger.js  // 위 설정을 사용해 swagger.json 생성하는 스크립트
│
├─ src/
│   └─ app/                 // Next.js 13+ App Router
│       ├─ api-doc/
│       │   └─ page.tsx     // Swagger UI 페이지 (use client 또는 dynamic import)
│       └─ page.tsx         // 예시: 메인 페이지
│
└─ functions/
    ├─ package.json         // Firebase Functions 전용 package.json
    ├─ tsconfig.json        // Functions TS 설정
    └─ src/
        ├─ index.ts         // Firebase Functions entry
        ├─ (여러 API 모듈).ts
        └─ ...              // 기타 파일들
```

<br>

### ■ 주요 설정 및 코드

#### 1. API 주석 작성
```typescript
/**
 * @swagger
 * /addMessage:
 *   post:
 *     summary: "메시지 추가 API"
 *     description: "Firebase Database에 메시지를 추가합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: "추가할 메시지"
 *     responses:
 *       200:
 *         description: "메시지 추가 성공"
 */
export const addMessage = functions.https.onCall((data, context) => {
  const text = data.text || "Default message";
  return { text: `Message received: ${text}` };
});
```


#### 2. Swagger 설정 파일 (swagger-config.js)
```js
// scripts/swagger-config.js
module.exports = {
  // OpenAPI 기본 설정
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Firebase Functions API',
      version: '1.0.0',
    },
  },
  // API 정의 경로
  apis: ['functions/src/**/*.{ts,js}'],
};
```

#### 3. Swagger JSON 생성 스크립트
```js
// scripts/generate-swagger.js
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./swagger-config.js');

const swaggerSpec = swaggerJsdoc(config);

// Next.js 앱의 public 폴더에 swagger.json을 생성
const outputPath = './public/swagger.json';
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`✅ Swagger JSON 생성 완료: ${outputPath}`);
```

#### 4. Scripts 추가

프로젝트 루트의 `package.json`에 아래 스크립트를 추가:

```json
{
  "scripts": {
    "generate:swagger": "node scripts/generate-swagger.js",
    "dev": "next dev"
  }
}
```

#### 5. Swagger UI 페이지 설정 (Next.js)
```tsx
// src/app/swagger/page.tsx
'use client';
import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* public 폴더의 swagger.json은 /swagger.json으로 접근합니다 */}
      <SwaggerUI url="/swagger.json" />
    </div>
  );
}
```
#### 6. Swagger JSON 생성
```
npm run generate:swagger
```

#### 7. Swagger UI 확인
   ```bash
   firebase emulators:start
   브라우저에서 `http://localhost:{포트}/swagger`로 접속하여 API 문서를 확인.
   ```
   
<br>

### ◼︎ 인증을 추가하는 경우
firebase authentication을 적용한 firebase function을 swagger로 테스트하고 싶다면 다음과 같이 `swagger-config.ts`를 수정해주면 된다.

```typescript
module.exports = {
  // OpenAPI 기본 설정
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Firebase Functions API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5003/wedeoio/asia-northeast3', // 실제 local function url
      },
    ],
    // 추가: 보안 스키마 설정
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Firebase ID 토큰도 결국 JWT 구조
        },
      },
    },
    // 추가: 전역 보안 적용 (모든 엔드포인트에 bearerAuth 요구)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['functions/src/**/*.{ts,js}'],
};
```

<br>

- 이 때 firebase ID 토큰은 로그인 한 뒤 프론트 코드에서 받을 수 있다.
```typescript
// 프론트 코드
const userCredential = await _auth.signInWithEmailAndPassword(auth, email, password); 

// 로그인 성공 시, userCredential.user에서 ID 토큰 가져오기
const token = await userCredential.user.getIdToken(/* forceRefresh */ true);
```



