---
title: "[TroubleShooting] Firebase Storage 403 오류 - downloadUrl"
description: "firebase storage admin sdk downloadURL 403 error. #adminsdk, #nodejs, #downloadURL, #storage 403, #download token"
date: 2025-02-20T00:59:42.389Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-Firebase-Storage-403-오류-downloadUrl"
categories: TroubleShooting
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:11:53.480Z
  hash: "09ae6dcc804bdce3e64b54cfad55ffb03b9b1b97bd701e532fb02ce7eac93a33"
---

Firebase Storage에 이미지를 업로드 한 뒤, 해당 이미지를 다운받을 수 있는 url을 요청하는 과정에서 403 에러가 나는 것을 확인했다.
에러 메시지는 다음과 같다.
```
Unhandled error Error: Unknown error code: undefined.
```


---

<br>

### ✏️ 오류 발생 코드
Firebase 공식 문서에서는 아래와 같은 방식으로 url을 받을 수 있다고 작성되어 있다.
```typescript
import admin from 'firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';

const bucket = admin.storage().bucket('your-storage-bucket-url.appspot.com');
const file = bucket.file('path');
const downloadUrl = await getDownloadURL(file);

console.log(downloadUrl);
```

<br>

#### 하지만...
이 코드를 그대로 사용하면 오류가 발생한다.

<br>

---

<br>

### ✏️ 원인
<a href = "https://github.com/firebase/firebase-admin-node/issues/1352">github issue</a>에서도 확인할 수 있듯이, 많은 백엔드 개발자분들이 위의 오류를 겪었다. 
프론트에서는 잘 작동하는 코드가 admin-sdk (node.js)에서는 오류를 발생시킨다는 것이다.

Firebase 자체의 오류이고, <span style ="color:red">"downloadURL을 사용하지 말라!"</span>가 결론인 것 같다.

<br>

---

<br>

### ✏️ 해결방법

github issue에서 한 개발자가 다음과 같은 방식으로 downloadURL을 대체할 수 있다고 소개했다.

```ts
const storage = admin.storage();
const ref = storage.bucket(`gs://${bucket}`).file(pathToFile);
const [metadata] = await ref.getMetadata();

const token = metadata.metadata.firebaseStorageDownloadTokens;
const link = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    pathToFile
)}?alt=media&token=${token}
```

하지만, 이 방식을 사용하려면 파일을 업로드 할 때 token을 metadata로 함께 넣어줘야 한다.
token을 넣어주지 않으면 `const token = metadata.metadata.firebaseStorageDownloadTokens;` 이 부분에서 다시 에러가 발생한다.


<br>

토큰은 `metadata: { metadata: {firebaseStorageDownloadTokens: token }}` 이런 방식으로 넣어주면 된다.
```ts
async function uploadBase64Image(base64String: string, fileNameWithExtension: string) {
  // Base64 문자열을 Buffer로 변환
  const buffer = Buffer.from(base64String, 'base64');

  // Firebase Storage 경로 설정
  const filePath = `assets/${fileNameWithExtension}`;
  const token = uuidv4();

  // 파일 저장
  await bucket.file(filePath).save(buffer, {
    metadata: {
      contentType: 'image/png', // 이미지 유형 설정
      metadata: {
        firebaseStorageDownloadTokens: token,
      }
    },
  });

  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

```

<br>

최종 코드는 다음과 같다.

```ts
...파일을 storage에 업로드 한 뒤

const storageFilePath = `assets/${fileNameWithExtension}`
const ref = bucket.file(storageFilePath);

const [metadata] = await ref.getMetadata();
console.log(metadata); // 오류가 발생하는 사람은 metadata를 출력해서 token이 들어있는지 확인해보길 권한다.
const token = metadata.metadata.firebaseStorageDownloadTokens;
const link = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storageFilePath)}?alt=media&token=${token}` 
// 이 link가 downloadURL이다.
```