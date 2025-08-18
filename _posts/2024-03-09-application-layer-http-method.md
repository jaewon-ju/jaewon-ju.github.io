---
title: "[Application Layer] HTTP - Method"
description: "HTTP Method에 대해 알아보자."
date: 2024-03-09T13:13:53.572Z
tags: ["network"]
slug: "Application-Layer-HTTP-Method"
series:
  id: 286776ce-3b67-40a8-b62e-6932373b0109
  name: "Network"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:52.167Z
  hash: "814a0f818994c058d2a2e756fb485337edba0eac0e8fccd672b25cdca268b342"
---

## ✏️ HTTP API
단어 사전 API를 만들어보자.
필요한 기능은 다음과 같다.

1. 단어 목록 조회
2. 단어 조회
3. 단어 등록
4. 단어 수정
5. 단어 삭제

여기서 리소스는 <span style = "background-color: lightgreen; color:black">"단어"</span>이다.
URI API는 "단어"만 식별하도록 설계해야한다.

> __나쁜 URI 설계 예시__<br>
1. 단어 목록 조회: /read-words-list
2. 단어 조회: /read-word-by-id
3. 단어 등록: /create-word
4. 단어 수정: /edit-word
5. 단어 삭제: /delete-word <br>
위의 URI는 리소스만 식별하는 것이 아니라, 리소스 + 행위까지 식별하고 있다.

>__좋은 URI 설계 예시__<br>
1. 단어 목록 조회: /words
2. 단어 조회: /words/{id}
3. 단어 등록: /words/{id}
4. 단어 수정: /words/{id}
5. 단어 삭제: /words/{id}<br>
위의 URI는 리소스인 단어만 식별하고 있다.
조회, 등록, 수정, 삭제 등의 행위는 HTTP Method로 구분하면 된다.

<br>

HTTP의 주요 메소드
- GET: 리소스 조회
- HEAD: 리소스 조회(Response Body가 비어서 옴)
- POST: 리소스 처리(주로 등록할 때 사용)
- PUT: 리소스 대체(없으면 생성)
- PATCH: 리소스 부분 변경
- DELETE: 리소스 삭제

<br>

---

<br>

## ✏️ GET
GET Method는 리소스를 조회할 때 사용한다.
정적 데이터 조회: 리소스 경로 사용
동적 데이터 조회: 쿼리 파라미터를 통해서 조회하고자 하는 리소스를 서버에 전달한다.

> __Request 메시지__
```
GET /words/1020 HTTP/1.1
Host: localhost:8080
```


>__Response 메시지__
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 35<br>
```
```
{
	"word": "Hello",
    "meaning": "안녕하세요"
}
```

<br>

---

<br>

## ✏️ POST
POST Method는 요청한 리소스를 처리한다.
Request Body를 통해서 서버로 데이터를 전달한다.
전달받은 데이터는 주로 신규 리소스 등록, 프로세스 처리에 사용한다.

> __Request 메시지__
```
POST /words HTTP/1.1
Content-Type: application/json
```
```
{
	"word": "Hello",
    "meaning": "안녕하세요"
}
```

>__Response 메시지__
```
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 35
Location: /words/1020
```
```
{
	"word": "Hello",
    "meaning": "안녕하세요"
}
```

<br>

여기서 주목해야할 점은, Request 메시지에서 /words 라는 URI를 썼다는 것이다.
새로운 단어를 등록하기 위해서 POST Method를 사용했지만, 어떤 Path에 넣을 것인지는 지정하지 않았다.

서버는 자동으로 /words/1020 이라는 새로운 식별자를 생성해서 Response 메시지로 Client에게 전달했다.
<br>
#### POST Method를 사용해서 리소스를 처리한다!
중요한 것은, <span style = "color:red">리소스를 어떻게 처리할 것인지 서버측에서 지정해주어야 한다는 것이다. </span>
<br>

#### POST는 만능이다.

HTTP Method를 사용해서 API를 제작할 때 애매한 부분이 있다면 POST를 사용하자.

---

<br>

## ✏️ PUT
PUT Method는 요청한 리소스를 대체한다.
요청한 리소스가 없다면 새로 생성한다.
#### <span style = "color:red">⚠️</span> POST와의 차이점: PUT은 Client가 리소스의 위치를 알고 있어야 한다.

> __Request 메시지__
```
PUT /words/1020 HTTP/1.1
Content-Type: application/json
```
```
{
	"word": "Hello",
    "meaning": "안녕하세요"
}
```

> #### 신규 리소스 생성됨
```
/words/1020
{
	"word": "Hello",
    "meaning": "안녕하세요"
}
```

#### <span style = "color:red">⚠️</span> PUT Method는 리소스를 "완전히" 대체한다.

ex) 요청 메시지로 다음과 같이 보내면

```
{
	"meaning": "안녕"
}
```

/words/1020에 있는 리소스에서 ```"word": "Hello"```는 없어지고 ```"meaning": "안녕"```만 바뀐다.
```
{
    "meaning": "안녕"
}
```
<br>

개발자가 의도한 것은 이게 아닐 것이다.
리소스의 일부분만 변경하고 싶다면 어떻게 해야할까?

<br>

---

<br>

## ✏️ PATCH
PATCH Method를 사용하면 리소스의 일부만을 변경할 수 있다.


```
현재 /words/1020에 존재하는 리소스:

{
	"word": "Hello",
    "meaning": "안녕하세요"
}
```

> __Request 메시지__
```
PATCH /words/1020 HTTP/1.1
Content-Type: application/json
```
```
{
    "meaning": "안녕"
}
```

<br>

위의 Request 메시지에는 words 필드가 존재하지 않는다.
PATCH Method를 사용하면 words 필드는 바뀌지 않고, meaning 필드만 "안녕"으로 변경된다.

<br>

```
변경된 /words/1020 리소스:

{
	"word": "Hello",
    "meaning": "안녕"
}
```
<br>

---

<br>

## ✏️ GET/POST + HTML FORM 
HTML FORM을 사용해서 데이터를 전송할 수 있다.
HTML FORM을 통한 데이터 전송은 <span style = "color:red">GET</span>과 <span style = "color:red">POST</span>만 지원한다.

### ■ GET FORM
GET Method에 대해서 공부할 때, 정적 데이터는 리소스 경로를 사용해서 조회하고 동적 데이터는 쿼리 파라미터를 사용해서 조회한다고 학습했다.

HTML FORM을 사용하면 입력한 정보를 바탕으로 <span style = "color:red">쿼리 파라미터를 작성해서 </span>요청을 자동으로 생성해준다.
```html
<form action = "/words" method="get">
  	<input type = "text" name = "word">
  	<input type = "text" name = "meaning">
	<button type = "submit">전송</button>
</form>
```
>word에 hello
meaning에 안녕하세요
입력한 후에 전송버튼 누름

<br>

생성된 HTTP request message
```
GET /words?word=hello&meaning=안녕하세요 HTTP/1.1
Host: localhost:8080
```

<span style = "color:red">word=hello&meaning=안녕하세요</span> 쿼리 파라미터를 자동으로 생성했다.

<br>

### ■ POST FORM
GET FORM은 입력한 정보를 쿼리 파라미터로 작성해줬다면, POST FORM은 입력한 정보를 Body에 넣어준다. 

```html
<form action = "/save" method="post">
  	<input type = "text" name = "word">
  	<input type = "text" name = "meaning">
	<button type = "submit">전송</button>
</form>
```
>word에 hello
meaning에 안녕하세요
입력한 후에 전송버튼 누름

<br>

생성된 HTTP request message

```
POST /save HTTP/1.1
Host: localHost:8080
Content-Type: application/x-www-form-urlencoded

word=hello&meaning=안녕하세요
```
```Content-Type: application/x-www-form-urlencoded```을 사용한다.
바이너리 데이터를 전송하는 경우 ```Content-Type: multipart/form-data```을 사용한다.

<br>

---

<br>

## ✏️ HTTP Method의 속성
HTTP Method 각각은 서로 다른 속성을 가지고 있다.

| Method | safe 속성 | idempotent 속성 | cacheable 속성 |
| - | - | - | - | 
| GET | O | O | O |
| POST | X | X |  O |
| PUT | X | O | X |
| PATCH | X | X | O |
| DELETE | X | O | X | 

<br>

### ■ safe
Safe Method
== 리소스를 변경하지 않는 Method

ex) GET은 리소스를 조회만 할 뿐 변경하지 않는다.
POST, PUT, PATCH, DELETE는 모두 리소스를 변경하는 Method이다.

<br>

### ■ idempotent(멱등)
idempotent Method
== 요청 횟수에 상관없이 결과가 같은 Method
한 번 호출하든 n번 호출하든 결과가 같다.

ex) request1: POST로 단어 "Book" 전달 
➜ 새로운 단어로 처리

request2: POST로 단어 "BOOK" 전달 
➜ 이미 있으므로 다르게 처리됨

∴ POST는 idempotent Method가 아니다.


<br>

### ■ cacheable
cacheable Method
== 응답 결과 리소스를 캐시해도 되는 Method


<br>

---

<br>

## ✏️ 리소스의 종류
리소스의 타입을 명확하게 알기 위해서 다음과 같은 4가지 방식으로 리소스를 구분한다. 

### 1. document
: 단일 개념(파일 하나, 객체 인스턴스)
ex) /words/1020

<br>

### 2. collection & Store


POST Method로도 리소스 등록을 할 수 있고, PUT Method로도 리소스 등록을 할 수 있다.<br>
POST는 <span style = "color:red">서버</span>가 리소스의 URI를 관리하고, 
PUT은 <span style = "color:red">클라이언트</span>가 리소스의 URI를 관리한다.<br>
서버가 관리하는 리소스 디렉토리를 Collection이라 하고,
클라이언트가 관리하는 리소스 저장소를 Store라 한다.

<br>

### 3. Controller
명사만 가지고 API를 설계하기 어려울 때가 있다.

예를 들어, HTML FORM을 사용하여 단어 사전 API를 설계해보자.
HTML FORM은 GET과 POST만 지원한다.

>1. 단어 목록 조회: /words
2. 단어 조회: /words/{id}
3. 단어 등록: /words/{id}
4. 단어 수정: /words/{id}
5. 단어 삭제: /words/{id}

Json을 사용하면 조회, 등록, 수정, 삭제를 각각 GET, POST, PATCH, DELETE에 대응시키면 되겠지만, HTML FORM은 GET과 POST만 지원한다.

이러한 제약을 해결하기 위해 <span style = "background-color: lightgreen; color:black">"동사"</span> 경로를 사용한다.

>1. 단어 목록 조회: /words
2. 단어 조회: /words/{id}
3. 단어 등록: /words/new
4. 단어 수정: /words/{id}/edit
5. 단어 삭제: /words/{id}/delete

이러한 URI를 Control URI라고 부른다.

<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#reviews">개발자를 위한 HTTP - 김영한 개발자님</a>