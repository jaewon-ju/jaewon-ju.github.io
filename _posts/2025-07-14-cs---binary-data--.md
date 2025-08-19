---
title: "[CS 지식] Binary Data 총정리"
description: "ArrayBuffer, Buffer, Uint8Array 등 Binary Data에 대한 정리본"
date: 2025-07-14T08:56:15.439Z
tags: ["CS 지식"]
slug: "CS-지식-Binary-Data-총정리"
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:11:50.358Z
  hash: "891fc959d6a15ed82c3fc07ca9b8a5b0d711a70764daa690e41716fb526a929b"
---

>현대 웹과 Node.js 애플리케이션에서는 이미지, 영상, 오디오, 압축 파일 등 다양한 **바이너리 데이터**를 다루는 일이 흔하다. 이러한 데이터는 기본적인 문자열로는 표현할 수 없기 때문에, 자바스크립트는 이를 처리하기 위한 다양한 저수준 타입들을 제공한다.

`Buffer`, `Blob`, `Uint8Array`...
프론트-백 API 연동을 할 때 항상 헷갈리는 것들이다.
Binary Data의 타입은 어떤 것들이 있고, HTTP로 전송할 때는 어떤 방식을 사용해야하는지 정리해보자.


<br>

---

<br>

## ✏️ 바이너리 데이터란?

바이너리 데이터(Binary Data)란 사람이 읽을 수 있는 텍스트가 아닌 비트와 바이트로 구성된 순수 데이터를 의미한다.

대표적인 예시:

- 이미지: PNG, JPG
- 오디오: MP3, WAV
- 영상: MP4, TS
- 압축 파일: ZIP, RAR
- PDF, 바이너리 로그 파일 등

<br>

---

<br>


## ✏️ 타입 구조도
자바스크립트에서 바이너리 데이터를 다루는 주요 타입들은 다음과 같은 계층 구조를 이룬다.

```ts
┌────────────┐
│ ArrayBuffer│  ← 원시 메모리
└────┬───────┘
     │     
     │                   		
 TypedArray (ex: Uint8Array)   
          │
     ┌────┴────┐
     │         │
  Buffer     Blob/File
(Node.js)   (브라우저)
```

<br>

### ◼︎ ArrayBuffer
> 고정 길이의 메모리 덩어리이다.

- 직접 값을 읽거나 쓸 수 없으며, 보통 Uint8Array와 함께 사용한다.
- 말 그대로 "빈 메모리 공간"이다.

```ts
const buffer = new ArrayBuffer(8)
```

<br>

### ◼︎ TypedArray (예: Uint8Array)
>ArrayBuffer 위에 구조를 입힌 배열 타입이다.

- 각 요소는 고정된 크기의 정수 또는 실수이다.
- 바이너리 데이터를 가장 널리 다룰 수 있는 방식이다.

```ts
const arr = new Uint8Array([72, 101, 108, 108, 111]) // Hello
```


<br>

### ◼︎ Buffer (Node.js 전용)
Uint8Array를 확장한 Node.js 전용 바이너리 타입이다.

- 파일, 네트워크, 스트림 등과의 빠른 IO 처리를 위해 설계되었다.
- 대부분의 Node API에서 기본적으로 사용된다.

```ts
const buf = Buffer.from('Hello')
```

<br>


### ◼︎ Blob (브라우저 전용)
바이너리 대용량 데이터를 추상적으로 감싼 컨테이너이다.

- 내부 내용을 직접 수정할 수 없으며, 읽기 전용이다.
- type(MIME 타입)을 지정할 수 있다.

```ts
const blob = new Blob([Uint8Array], { type: 'image/png' })
```

<br>

### ◼︎ File (브라우저 전용)
Blob을 확장한 구조로, 파일명과 수정일 등 메타데이터를 포함한다.

- 보통 사용자가 입력한 파일을 다룰 때 사용된다.

```ts
const file = new File([blob], 'image.png', { type: 'image/png' })
```

<br>

---

<br>


## ✏️ Binary Data의 직렬화

⚠️⚠️⚠️ <span style="color:red">바이너리 데이터는 JSON.stringify를 통해 직렬화가 되지 않는다.</span>

```ts
JSON.stringify(new ArrayBuffer(8)) // 결과: {}
```

왜냐하면 ArrayBuffer나 Buffer, Uint8Array는 메모리 주소만 가지며, 구조화된 정보를 담지 않기 때문이다.
직렬화를 위해서는 Array<number\> 형태로 변환하거나, base64 문자열로 인코딩하는 방법을 사용해야 한다.

<br>

---

<br>


## ✏️ FormData와 바이너리 전송 시 고려할 점
바이너리 데이터를 API로 전송할 때는 일반적으로 두 가지 방식이 사용된다:

1. FormData를 사용하는 방식 (multipart/form-data)
2. 바디에 바이너리 자체를 넣는 방식 (application/octet-stream 혹은 base64/JSON 변환)


<br>

### ◼︎ FormData
FormData는 파일 업로드에 특화된 구조이며, 여러 필드와 함께 파일을 함께 전송할 수 있다.

>#### 장점
- 브라우저 fetch, axios, form 등과 호환성이 높다.
- 파일 이름, 타입 등 메타데이터를 포함할 수 있다.
- 문자열, 숫자 등의 부가 정보도 함께 전송 가능하다.

>#### 주의할 점
Node.js에서 FormData를 생성할 경우, form-data, formdata-node, undici, formdata-polyfill 등 환경별 라이브러리 호환 이슈가 발생할 수 있다.

<br>

### ◼︎ 직접 바이너리 전송 (application/octet-stream)
파일 하나만 전송하거나, 간단한 API 설계를 원할 경우 request body에 바이너리를 직접 담아 전송할 수 있다.

>#### 장점
- 간결하다. form 구조 없이 곧바로 버퍼를 전송할 수 있다.
- 서버 측에서 메모리 사용량을 줄이고 스트리밍 처리하기 좋다.

>#### 주의할 점
- 파일 외의 추가 메타데이터(fileId, userId 등)를 함께 보내기 어렵다.
- 다중 파일 업로드에는 적합하지 않다.

```ts
fetch('/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/octet-stream' },
  body: fileBuffer,
})
```
