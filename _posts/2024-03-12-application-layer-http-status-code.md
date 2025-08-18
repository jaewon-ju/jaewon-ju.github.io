---
title: "[Application Layer] HTTP - Status Code"
description: "HTTP Status Code의 종류와 특징"
date: 2024-03-12T05:31:11.932Z
tags: ["network"]
slug: "Application-Layer-HTTP-Status-Code"
series:
  id: 286776ce-3b67-40a8-b62e-6932373b0109
  name: "Network"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:52.144Z
  hash: "8ad10d455f5be994bd8eac18bf51aece485144a2908ca7ed45b8008f55258752"
---

## ✏️ HTTP Status Code
> HTTP Status Code란 클라이언트가 보낸 요청의 처리 상태를 <span style = "background-color: lightgreen;color:black">응답 메시지의 Status Line로</span> 알려주는 기능이다.

#### 응답 메시지 Status Line 구조: <br>HTTP Version (공백) <span style= "color:red">Status-Code</span> (공백) Reason-Phrase (엔터)

<br>

처리 상태를 숫자로 나타낸다.

- 1xx: 요청이 수신됨 (Informational) 
- 2xx: 정상 처리 됨 (Successful)
- 3xx: 요청 처리를 위해 추가 행동 필요 (Redirection)
- 4xx: 클라이언트 오류
- 5xx: 서버 오류

100번대는 거의 사용되지 않으므로 생략한다.

<br>

---

<br>


## ✏️ 200번대 - Successful
> 200번대 Status Code는 요청이 정상적으로 처리되었음을 뜻한다.

- 200 OK
: 요청 성공

- 201 Created
: 요청이 성공해서 새로운 리소스가 생성됨 <br>
ex) POST로 새로운 단어 등록 요청
새로운 리소스가 정상적으로 생성되면 201 Created 반환

- 202 Accepted
: 요청이 접수되었으나 처리 중임

- 204 No Content
: 요청이 정상적으로 처리되었으나 Body에 넣을 데이터가 없음

<br>

---

<br>


## ✏️ 300번대 - Redirection
> 300번대 Status Code는 요청을 완료하기 위해 <span style= "color:red">클라이언트 측</span>에서 추가 조치가 필요함을 뜻한다.

- 300 Multiple Choices
- 301 Moved Permanently
- 302 Found
- 303 See Other
- 304 Not Modified
- 307 Temporary Redirect
- 308 Permanent Redirect

<br>

### ■ Redirection
여기서 Redirection이란 300번대 Status Code가 붙여진 응답 메시지에 Location 헤더가 존재하면, 해당 Location 위치로 자동으로 이동하는 것을 뜻한다.

예를 들어 보자.

>현재 벨로그 주소는 https://velog.io/@jaewon-ju/posts 이다.
근데 벨로그 주소를 https://velog.io/@jaewon-ju/my_posts 로 이전했다.<br>
나의 친구 A는 내 벨로그의 옛날 주소만 알고 있다.
나는 친구 A가 옛날 주소로 접근해도 현재 주소로 이동시키려 한다.<br>
옛날 주소로 접근하면 다음과 같은 응답 메시지를 보낸다.
```
HTTP/1.1 301 Moved Permanently
Location: https://velog.io/@jaewon-ju/my_posts
```
Status Code 301과 Location 헤더가 존재하기 때문에 해당 메시지를 받은 <span style = "color:red">클라이언트는</span> 자동적으로 새로운 URL을 요청한다. 
이것이 바로 Redirection이다.

Redirection은 3가지 종류가 존재한다.
- 영구 Redirection: 특정 리소스의 URI가 영구적으로 이동
ex) 위의 예시

- 일시 Redirection: 일시적으로 변경
ex) 주문 완료 후 주문 내역 화면으로 이동

- 특수 Redirection: 결과 대신 캐시를 사용
  
<br>

### ■ 영구 Redirection
특정 리소스의 URI가 영구적으로 이동

#### 301 Moved Permanently
➜ 리다이렉트 요청 메소드가 GET으로 변하고, 본문이 제거될 수 있음

>요청 메시지1 - <span style = "background-color: lightgreen;color:black">POST Method</span>, 본문 존재
```
POST /posts HTTP/1.1
Host: velog.io/@jaewon-ju
```
```
title=newPost&Content=hello
```

응답으로 301 Moved Permanently 를 받음
새로운 URL로 리다이렉트

>요청 메시지2 - <span style = "background-color: lightgreen;color:black">GET Method</span>로 변경, 본문 삭제
```
GET /my_posts HTTP/1.1
Host: velog.io/@jaewon-ju
```

<br>

#### 308 Permanent Redirect
301과 기능은 같지만, 요청 메소드와 본문 내용이 유지된다.

<br>

### ■ 일시 Redirection
리소스의 URI가 일시적으로 변경

왜 필요할까?
> 쿠팡에서 음료수를 1개 주문한다.
장바구니 페이지에서 HTML Form(POST)으로 ```상품명: 사이다, 개수: 1``` 을 입력하고 주문하기 버튼을 누른다.<br>
만약 200 OK 를 응답하면 어떻게 될까?
주문을 한 뒤에 새로고침을 하면, 똑같은 주문 [```상품명: 사이다, 개수: 1```]이 다시 전달될 것이다.<br>
따라서 이러한 경우 주문 결과 화면을 GET Method로 리다이렉트해야 한다.


<br>

#### 302 Found
- 리다이렉트시 요청 메소드가 GET으로 변하고, 본문이 제거될 수 있음
<br>

#### 307 Temporary Redirect
- 302와 기능은 동일
- 리다이렉트시 요청 메소드, 본문 유지

<br>


#### 303 See Other
- 302와 기능은 동일
- 리다이렉트시 요청 메소드만 GET으로 변경


<br>

### ■ 특수 Redirection

#### 304 Not Modified
- 클라이언트에게 리소스가 수정되지 않았음을 알려준다.
- 캐시로 리다이렉트한다.
- 응답에 BODY를 포함하지 않는다.

이후의 포스트 참고 <a href= "https://velog.io/@jaewon-ju/Application-Layer-HTTP-header2">HTTP - Header(캐시)</a>

<br>

---

<br>


## ✏️ 400번대 - 클라이언트 오류
> 400번대 Status Code는 클라이언트의 잘못으로 오류가 발생했음을 뜻한다.

- 똑같은 요청으로 재시도를 해도 반드시 실패한다.
- 요청 구문, 메시지 등이 오류가 났을 때 발생한다.

<br>

- 401 Unauthorized: 클라이언트가 해당 리소스에 대한 인증이 필요함
- 403 Forbidden: 서버가 승인을 거부함
- 404 Not Found: 요청 리소스를 찾을 수 없음



<br>

---

<br>


## ✏️ 500번대 - 서버 오류
>500번대 Status Code는 서버의 문제로 오류가 발생했음을 뜻한다.

- 똑같은 요청으로 재시도 하면 성공할 수도 있다.

<br>

- 503 Service Unavailable: 서비스 이용 불가
서버가 일시적인 과부하 또는 예정된 작업으로 잠시 요청을 처리할 수 없음

<br>

---

<br>


## REFERENCE
<a href = "https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#reviews">개발자를 위한 HTTP - 김영한 개발자님</a>