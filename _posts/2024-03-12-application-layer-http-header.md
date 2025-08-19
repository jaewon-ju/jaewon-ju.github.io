---
title: "[Application Layer] HTTP - Header"
description: "HTTP 메시지 Header의 종류와 역할"
date: 2024-03-12T07:24:46.691Z
tags: ["network"]
slug: "Application-Layer-HTTP-Header"
categories: Network
velogSync:
  lastSyncedAt: 2025-08-19T08:36:53.000Z
  hash: "b5c0a6f968a1bce3b11d8bcfb2a565244922e2aa9e8d7a6550f52eb48cde83c6"
---

## ✏️ HTTP Header
> HTTP Header는 HTTP 메시지 구성 요소 중 하나이다.

<a href= "https://velog.io/@jaewon-ju/Application-Layer-HTTP-Intro">이전 포스트</a>에서 HTTP 메시지 구성 요소를 학습했다.
Header도 메시지 구성 요소 중에 하나이다.

- Header는 HTTP 전송에 필요한 모든 부가정보를 포함한다.
- 메시지 바디의 내용, 크기, 요청 클라이언트의 정보 등을 포함한다.

<br>

### ■ 최신 HTTP 표준
RFC7230

HTTP Message는 "표현"을 전달한다.

> 표현 = 표현 메타 데이터 + 표현 데이터

Header에서 표현 헤더(표현 데이터를 해석할 수 있는 정보)를 전달하고
Body에서 표현 데이터를 전달한다.

⚠️ 표현 헤더는 표현 메타 데이터를 포함한다.
⚠️ 표현 헤더는 요청과 응답 모두에 사용한다.

<br>

---

<br>

## ✏️ 표현 헤더의 종류

### 1. Content-Type
표현 데이터의 형식을 설명한다.

ex) text/html; charset=UTF-8
application/json


```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 3847

{"Title":"newPost" ...}
```

<br>

### 2. Content-Encoding
표현 데이터를 압축하기 위해 사용한다.

- 데이터를 <span style = "color:red">전달하는 곳</span>에서 압축 후 인코딩 헤더를 추가한다.
- 데이터를 읽는 쪽은 인코딩 헤더를 바탕으로 표현 데이터를 압축 해제한다.

ex) gzip
deflate

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding:gzip
Content-Length: 348

3l4123h439e9feih0ef0ei
```

<br>

### 3. Content-Language
표현 데이터의 자연 언어를 나타낸다.

ex) ko
en
ko-KR

```
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Content-Language: ko
Content-Length: 343

<html>
자연 언어는 한국어입니다.
</html>
```

<br>

### 4. Content-Length
표현 데이터의 길이를 나타낸다.

- 바이트 단위로 나타낸다.
- Transfer-Encoding에서는 Content-Length를 사용할 수 없다.

<br>

---

<br>


## ✏️ Content Negotiation
> Content Negotiation이란 클라이언트와 서버 간에 가장 적합한 콘텐츠 형식을 선택하기 위한 프로세스이다.

- <span style = "color:red">요청시에만 사용한다.</span>

- 클라이언트가 요청 메시지에 선호하는 표현 방식을 넣어서 보낸다.
- Content Negoitation 헤더의 종류
Accept: 클라이언트가 선호하는 미디어 타입 전달
Accept-Charset: 클라이언트가 선호하는 문자 인코딩 방식 전달
Accept-Encoding: 클라이언트가 선호하는 압축 인코딩 방식 전달
Accept-Language: 클라이언트가 선호하는 자연 언어 전달

예를 들어 보자.
> 아마존 서버에 접속했더니 영어로 적힌 html 파일을 내려주었다.
클라이언트 A는 한국어로 구성된 사이트를 원한다.
클라이언트 A는 Content Negotitation을 사용해서 서버에게 자신의 선호 형식을 알릴 수 있다.<br>
```
GET /goods HTTP/1.1
Host: www.amazon.com
Accept-Language: ko
```
해당 요청 메시지를 받은 서버가 한국어를 지원한다면, 한국어로 된 html 파일을 내려준다.

<br>

### ■ 우선순위
더 복잡한 예시를 살펴보자.
> 마찬가지로 클라이언트 A가 CD PROJEKT 서버에 접속한다.
CD PROJEKT 서버는 영어와 폴란드어, 독일어만 지원한다.
클라이언트 A는 한국어를 선호한다는 요청 메사지를 보낸다.
```
GET /games HTTP/1.1
Host: www.cdprojektred.com
Accept-Language: ko
```
하지만 서버는 한국어를 지원하지 않으므로 독일어로 된 html 파일을 내려준다.<br>
A는 독일어를 전혀 모르지만, 영어는 조금 알고있다.
1순위는 한국어, 2순위를 영어로 지정하려면 어떻게 해야할까?

<br>

- Quality Values 값을 사용한다.
- 0 ~ 1, 클수록 높은 우선순위이다.
- 생략했을 때는 1로 처리한다.

```
GET /games HTTP/1.1
Host: www.cdprojektred.com
Accept-Language: ko-KR;ko;q=0.9,en-US;q=0.8
```

<br>

Accept-Language에서만 적용되는 것은 아니다.
Accept 등에서도 사용가능하다.

```
GET /games HTTP/1.1
Host: www.cdprojektred.com
Accept: text/*, text/plain, text/plain;format=flowed
```

위의 경우, 구체적인 것이 우선으로 동작한다.
1 순위 - text/plain;format=flowed
2 순위 - text/plain
3 순위 - text/*

<br>

---

<br>


## ✏️ 전송 방식
메시지를 전달할 때, 전송할 수 있는 방식이 여러가지 존재한다.

### 1. 단순 전송
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 3847

{"Title":"newPost" ...}
```

<br>

### 2. 압축 전송
표현 데이터를 압축해서 전송한다.
Header에서는 Content-Encoding을 활용해서 어떤 압축 방식을 사용했는지 나타낸다.

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
Content-Length: 328

1321kqwefbj44jbadjk
```
<br>

### 3. 분할 전송
표현 데이터를 분할해서 전송한다.
<span style = "background-color: lightgreen; color:black">Content-Length를 같이 사용할 수 없다.</span>
용량이 매우 큰 응답을 할 때 사용한다.
```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

7
my name
2
is
2
Ju
0
/r/n
```


<br>

### 4. 범위 전송
이미지를 전송하다가 중간에 연결이 끊긴 경우, 다시 처음부터 전송하는 것은 매우 비효율적이다.
전송이 안된 범위만 전송할 수 있는 방식이 존재한다.

```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Range: bytes 500-1000 / 1000

sdfhdjhfjdhjfdj...
```

500 바이트부터 1000 바이트까지만 전송한다.

<br>

---

<br>


## ✏️ 일반 정보
Header에는 일반 정보도 넣을 수 있다.

| 헤더 | 요청/응답 | 특징|
| - | - | - |
| From | 요청 | 유저 에이전트의 이메일 정보 |
| Referer | 요청 | 이전 웹 페이지 주소|
| User-Agent | 요청 | 유저 에이전트의 애플레케이션 정보 |
| Server | 응답 | 오리진 서버의 소프트웨어 정보|
| Date | 응답 | 메시지가 생성된 날짜 |
<br>

---

<br>


## ✏️ 특수 정보
Header에 넣을 수 있는 특수한 정보들이 존재한다.

| 헤더 | 요청/응답 | 특징|
| - | - | - |
| Host | 요청 | 클라이언트가 원하는 호스트(서버) 정보 |
| Location | 응답  | 페이지 리다이렉션|
| Allow | 응답 | 허용 가능한 HTTP 메소드  |
| Retry-After | 응답 | 유저 에이전트가 다음 요청을 하기까지 기다려야 하는 시간|

<br>

### ■ Host
Host는 요청 헤더에서 작성해야 할 <span style = "background-color: lightgreen; color:black">필수 요소</span>이다!

왜 필요한가??
> 하나의 IP 주소에 여러개 이름이 존재할 수 있다. (가상 호스팅)<br>
예를 들어, IP: 200.12.05.26 인 서버에 3개 도메인이 존재할 수 있다.
a.com
b.com
c.com
클라이언트가 다음과 같이 요청 메시지를 보낸다면, 서버는 어떤 도메인에 요청하는 것인지 알 수 없다.
```
GET /goods HTTP/1.1
```
따라서, 다음과 같이 Host를 넣어줘야 한다.
```
GET /goods HTTP/1.1
Host: a.com
```

<br>

### ■ Location
300번대 Status Code 응답 메시지에 Location 헤더가 존재하면, Location 위치로 자동 리다이렉트한다.

```
HTTP/1.1 301 Moved Permanently 
Location: velog.io/@jaewon-ju/my_posts
```

클라이언트는 velog.io/@jaewon-ju/my_posts 로 자동 리다이렉트 한다.


<br>

### ■ Allow
405 Method Not Allowed 에서 응답에 포함해야 한다.
특정 Method만 요청으로 허용됨을 응답에서 알려준다.

```
HTTP/1.1 405 Method Not Allowed
Allow: GET, PUT
```


<br>

### ■ Retry-After
503 Service Unavailable에서 서비스가 사용 불가함을 알려주면서, 언제 다시 사용 가능할 지를 나타낼 수 있다. (선택)

```
HTTP/1.1 503 Service Unavilable
Retry-After: 120
```

120초 뒤에 다시 시도하라는 뜻이다.


<br>

---

<br>

## ✏️ 쿠키
Header를 사용해서 클라이언트와 서버 간에 쿠키를 사용할 수 있다.
쿠키에 대한 자세한 설명은 <a href = "https://velog.io/@jaewon-ju/Application-Layer-HTTP-Intro#%E2%96%A0-cookie">이전 포스트</a>를 참고하자.

응답 - ```Set-Cookie```로 서버가 클라이언트에게 쿠키 값을 전달한다.
요청 - ```Cookie```로 클라이언트가 서버에게 자신의 정보(쿠키)를 전달한다. 

>요청
```
POST /login HTTP/1.1
Host: www.amazon.com
```
```
{ "name":"Ju" }
```

클라이언트는 일단 아무런 헤더가 없이 요청을 보낸다.

>응답
```
HTTP/1.1 200 OK
Set-Cookie: sessionId=ju1020
```

요청을 받은 서버는 ```Set-Cookie```로 해당 클라이언트의 쿠키 값을 보낸다.

>요청
```
GET /goods HTTP/1.1
Host: www.amazon.com
Cookie: ju1020
```

응답을 받은 클라이언트는 자신의 쿠키 값을 저장하고, 다음부터 해당 서버로 보내는 모든 요청에 쿠키 정보를 자동으로 포함한다.

<br>

- 네트워크 트래픽을 추가로 유발한다.
- 보안에 민감한 데이터는 쿠키로 저장해서는 안된다.

<br>

### ■ 쿠키 유효기간
__서버__는 응답 헤더에 쿠키의 유효기간을 설정할 수 있다.

```Set-Cookie: sessionId=ju1020; expires=TUE, 12-MAR-2024 21:16:33 GMT```
```Set-Cookie: sessionId=ju1020; max-age=7200```

날짜 단위, 초 단위로 유효기간 설정이 가능하다.

- 만료 날짜를 생략하면 브라우저 종료시 까지만 유지된다. (세션 쿠키)
- 만료 날짜를 입력하면 해당 날짜까지 유지된다. (영속 쿠키)

<br>


### ■ 도메인
도메인을 명시하면, 명시한 도메인 + 서브 도메인 모두 쿠키에 접근할 수 있다.

```Set-Cookie: sessionId=ju1020; max-age=7200; amazon.com```
amazon.com 도 쿠키를 사용할 수 있고, ex.amazon.com 도 쿠키를 사용할 수 있다.

도메인을 명시하지 않으면 Host 주소에서만 쿠키를 사용할 수 있다.

<br>

### ■ 경로
경로를 명시하면, 명시한 경로를 포함한 하위 경로 페이지만 쿠키를 접근할 수 있다.
```Set-Cookie: sessionId=ju1020; max-age=7200; path=/```

<br>

### ■ 보안
Secure 속성을 적용하면 https인 경우에만 쿠키를 전송한다.
```Set-Cookie: sessionId=ju1020; max-age=7200; Secure```


<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#reviews">개발자를 위한 HTTP - 김영한 개발자님</a>