---
title: "[Firebase] Firestore"
description: "NoSQL 데이터베이스인 Firestore에 대해서"
date: 2025-02-11T01:17:13.096Z
tags: ["Firebase"]
slug: "Firebase-Firestore"
categories: Firebase
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:11:53.779Z
  hash: "8dc3dfd5405dba17b8b50d34fd4fcd40feafc1efcf0a5c10f5dd7a73d201a45d"
---

#### Firestore란?

Firestore는 Google Firebase에서 제공하는 NoSQL 클라우드 데이터베이스이다. Firestore는 클라이언트 SDK 및 Admin SDK를 통해 접근할 수 있으며, 서버리스 환경에서도 쉽게 사용할 수 있도록 설계되었다.

---

## ✏️ Firestore의 특징

1. **NoSQL 문서 기반 데이터베이스**  
   - 데이터는 컬렉션(Collection)과 문서(Document)로 구성된다.  
   - 관계형 데이터베이스처럼 테이블과 행을 사용하는 것이 아니라 JSON 구조의 문서 형태로 저장됩니다.

2. **실시간 동기화**  
   - Firestore는 데이터 변경을 실시간으로 감지하고 클라이언트에 자동으로 반영할 수 있다.

3. **트랜잭션 지원**  
   - 여러 문서를 원자적으로 읽고 수정하는 트랜잭션 기능을 제공한다.

5. **보안 및 접근 제어**  
   - Firebase Authentication과 연동하여 사용자 기반의 보안 규칙을 설정할 수 있다.

<br>

---

<br>

## ✏️ Firestore 접근법

### 1. Client SDK를 사용한 Firestore 접근

>#### Firestore 인스턴스 초기화

```tsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    FIREBASE_CONFIGURATION
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```


<br>

>#### **문서 생성 - Client SDK**

```tsx
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
// 자동 생성되는 문서 ID
await addDoc(collection(db, "collection명"), {
    field1: "content1",
    field2: "content2"
});
// 특정 문서 ID 지정
await setDoc(doc(db, "collection명", "문서ID"), {
    field1: "content1",
    field2: "content2"
});
```

<br>

>#### **문서 조회 - Client SDK**

```tsx
import { doc, getDoc } from "firebase/firestore";

const docRef = doc(db, "cities", "SF");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
} else {
    console.log("No such document!");
}
```

<br>

>#### **문서 수정 - Client SDK**

```tsx
import { setDoc, doc, updateDoc } from "firebase/firestore";

// 전체 업데이트
await setDoc(doc(db, "collection명", "문서ID"), {
    field1: "newContent",
    field2: "newContent2"
});

// 부분 업데이트
await updateDoc(doc(db, "collection명", "문서ID"), {
    field1: "updatedContent"
});
```

<br>

>#### **문서 삭제 - Client SDK**

```tsx
import { deleteDoc, doc } from "firebase/firestore";

await deleteDoc(doc(db, "collection명", "문서ID"));
```

<br>

---

<br>

### 2. Admin SDK를 사용한 Firestore 접근
Admin SDK는 서버에서 Firestore를 제어할 때 사용한다.

```tsx
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

const userQuerySnapshot = await db
    .collection("users")
    .where("email", "==", "user@example.com")
    .get();
```

<br>

---

<br>

## ✏️ Reference VS. Snapshot

### **1. Reference (참조)**
- Firestore에서 특정 컬렉션 또는 문서를 가리키는 **포인터** 역할을 한다.
- 데이터를 직접 포함하지 않고, CRUD 작업을 수행하는 메서드를 제공한다.

```tsx
const docRef = db.collection('users').doc('user123');
await docRef.update({ isActive: true });
const docSnapshot = await docRef.get();
```

<br>

### **2. Snapshot (스냅샷)**
- 특정 시점의 문서 또는 컬렉션의 **데이터와 메타정보를 포함**한 객체이다.
```tsx
const docSnapshot = db
	.collection('users')
	.where('uid','==',uid);
	.get();

const userData = docSnapshot.docs[0].data();
console.log("유저 이름: ", userData.name);
```

<br>

---

<br>

## ✏️ `arrayUnion`을 사용한 배열 업데이트
Firestore의 `arrayUnion`은 배열 필드를 업데이트할 때 중복을 방지하면서 안전하게 값을 추가하는 메서드이다.

```tsx
import { FieldValue } from "firebase-admin";
const docRef = db.collection("users").doc("user123");

await docRef.update({
    hobbies: FieldValue.arrayUnion("reading", "coding")
});
```

<br>

---

<br>

## ✏️Firestore의 불편한 점

- Firestore에서 문서를 추가할 경우, `WriteResult` 객체를 반환하며, 여기에 마지막 업데이트 시간만 포함된다.
- 새 문서를 생성한 후 생성된 객체를 프론트엔드에 즉시 반환하기 어려운 구조이다.
- 반면, JPA 등의 관계형 데이터베이스에서는 `create()`를 호출하면 새로 생성된 객체를 바로 반환할 수 있다.




