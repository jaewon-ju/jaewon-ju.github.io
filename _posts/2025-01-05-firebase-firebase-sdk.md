---
title: "[Firebase] Firebase SDK"
description: "Firebase Software Development Kit의 종류와 특징"
date: 2025-01-05T02:41:38.091Z
tags: []
slug: "Firebase-Firebase-SDK"
series:
  id: 865cd188-a04a-42fd-a30d-e7606b6f29f2
  name: "Firebase"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:02.497Z
  hash: "85d9454da0edc50942468fb0956c9c2ee1337cfc31b9706b2b003ff57392ea08"
---

#### Firebase란 
Google에서 제공하는 백엔드 서비스 플랫폼이다.
Firebase를 사용하면 개발자는 <span style = "color:red">서버를 직접 구축하지 않아도</span>, 앱의 핵심 기능을 빠르게 개발하고 배포할 수 있다.

---

<br>

## ✏️ Firebase SDK
>Firebase SDK는 Firebase 서비스와 앱을 연결하여 다양한 기능을 쉽게 구현할 수 있도록 돕는 **Software Development Kit(SDK)**이다.

- Admin SDK와 Client SDK가 존재한다.
   - Admin SDK는 백엔드에서 Firebase 서비스를 관리하는 도구이다.
   - Client SDK는 프론트엔드에서 Firebase 서비를 관리하는 도구이다.
   
<br>

### ■ Firebase Admin SDK
#### 특징

1. **권한 제어**:
    - Admin SDK는 Firebase 프로젝트에 대해 관리자 권한을 갖는다.
    - 인증 없이 모든 Firestore 데이터, Authentication 사용자 정보, Cloud Storage 파일 등에 접근할 수 있더,
2. **서버 사이드 환경 전용**:
    - Admin SDK는 Node.js 서버에서 실행되도록 설계되었다.
    - 클라이언트 브라우저 환경에서는 사용할 수 없다.
3. **서비스 계정 사용**:
    - Admin SDK는 Firebase 서비스 계정을 사용하여 프로젝트와 상호작용한다.

<br>

#### 코드 예제 (Admin SDK)

```tsx
import * as admin from "firebase-admin";

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Firestore 인스턴스
const db = admin.firestore();

// Firestore 데이터 읽기
const getDocument = async () => {
  const doc = await db.collection("users").doc("user_id").get();
  
  if (doc.exists) {
    console.log("Document data:", doc.data());
  } else {
    console.log("No such document!");
  }
};
```

<br>



### ■ Firebase Client SDK

#### 특징

1. **권한 제어**:
    - Client SDK는 보안 규칙(Firebase Security Rules)을 따른다.
    - 사용자의 인증 상태에 따라 접근 권한이 제한됩니다.
2. **프론트엔드 환경 전용**:
    - 웹 브라우저, React Native, iOS, Android 같은 클라이언트 환경에서 동작하도록 설계되었다.
3. **구성 및 초기화**:
    - Client SDK는 Firebase 프로젝트의 `apiKey`, `authDomain` 등을 사용하여 설정됩니다.

<br>

#### 코드 예제 (Client SDK)

```tsx
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase Client SDK 초기화
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
};

const app = initializeApp(firebaseConfig);

// Firestore 인스턴스
const db = getFirestore(app);

// Firestore 데이터 읽기
const getDocument = async () => {
  const docRef = doc(db, "users", "user_id");
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
};
```

<br>

### ■ 주요 차이점 비교

| **특징**            | **Admin SDK**                          | **Client SDK**                         |
|---------------------|---------------------------------------|---------------------------------------|
| **권한 제어**        | 모든 권한 (관리자 권한)                  | Firebase 보안 규칙에 의해 제한             |
| **환경**            | 서버 측 (Node.js, Cloud Functions 등)      | 클라이언트 측 (브라우저, 모바일 등)         |
| **인증 방식**        | 서비스 계정 (Service Account)            | Firebase 프로젝트 설정 파일                |
| **Firebase 서비스**   | Firestore, Authentication, Cloud Storage, FCM 등 모든 기능 | Firestore, Authentication, Cloud Storage 등 주요 기능 |
| **보안**            | 인증 없이 모든 데이터 접근 가능              | 보안 규칙에 따라 사용자 권한 제어             |
| **사용 목적**        | 관리 작업 (대량 처리, 관리자 기능)           | 사용자와의 직접적인 상호작용                 |
| **코드 초기화**       | `admin.initializeApp()`               | `initializeApp(firebaseConfig)`        |
