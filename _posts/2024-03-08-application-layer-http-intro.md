---
title: "[Application Layer] HTTP - Intro"
description: "HTTP - Introduction"
date: 2024-03-08T01:54:45.068Z
tags: ["network"]
slug: "Application-Layer-HTTP-Intro"
series:
  id: 286776ce-3b67-40a8-b62e-6932373b0109
  name: "Network"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:05.632Z
  hash: "27d14c49bc556dd243eaba244880e44c6dac491520567ab804cd1c93e7202418"
---

HTTP: Hyper Text Transfer Protocol
>HTTP는 Web Application의 Application Layer Protocol이다.

HTTP 메시지로 거의 모든 형태의 데이터를 전송 가능하다.
ex) HTML, TEXT, IMG, JSON, XML
<br>

---

<br>

## ✏️ HTTP의 특징

- HTTP는 Client/Server 방식으로 동작한다.
- TCP를 사용한다. (버전 1,2의 경우)
- 서버가 클라이언트의 상태를 보존하지 않는다. <span style = "background-color: lightgreen; color:black">Stateless</span>
- 연결을 유지하지 않는다. <span style = "background-color: lightgreen; color:black">Connectionless</span>

<br>

## ✏️ Stateless
HTTP는 무상태(Stateless) 프로토콜이다.

Stateless란 서버가 클라이언트의 상태를 보존하지 않는 것을 뜻한다.
즉, 모든 request는 독립적이다.

> Stateful VS Stateless
>
Stateful은 서버가 클라이언트의 상태를 보존하는 것이고, Stateless는 서버가 클라이언트의 상태를 보존하지 않는 것이다.

>
<span style = "color: red">Stateful의 문제점</span>
Stateful 프로토콜을 사용해서 클라이언트 A와 서버 S1와 통신을 하고 있었다. 
>
【 A: 글 작성 하고싶어】
【 S1: 제목은? 】
【 A: Title1 】
【 S1: 글 내용은? 】
>
그러다 갑자기 S1 서버가 다운이 되어 S2 서버를 사용해야 하는 상황이 발생했다.
서버 S2는 클라이언트 A의 이전 요청 내역을 알지 못한다.
A가 이전 요청과 연관된 새로운 요청을 보내면 S2는 처리할 수 없다.
>
【 A: Content1 】
【 S2: ??? 】

>
<span style = "color: green">해결 - Stateless</span>
Stateless 프로토콜의 각 request는 독립적이다.
따라서, A는 각 요청을 독립적으로 작성해야 한다.
A의 요청은 독립적이므로 이전의 요청과 관계없이 처리할 수 있다.
>
【 A: 글 작성. 제목은 Title1, 내용은 Content1 】
【 S2: OK 】

- Stateless는 응답 서버를 쉽게 바꿀 수 있다.
- request를 더 상세하게 작성해야 하므로 데이터가 더 많이 소모된다.

<br>

###  ■ Cookie
HTTP는 Stateless하다.
➜ 모든 request가 독립적이다.
➜ 불편해!
➜ Cookie를 사용하자.

>Cookie는 클라이언트와 서버 사이의 transaction 정보를 저장하는 데이터이다.
Cookie는 Statful하다.

<br>

Cookie의 동작 과정은 다음과 같다.

1. Client가 Server에 요청
Server는 DB에 쿠키(정수값)를 생성해서 저장한다.

2. Server가 Client에 응답
응답할 때 쿠키값을 같이 보낸다.

3. Client가 Cookie를 파일로 저장
다음 요청부터는 Server가 Client를 특정할 수 있다.

<br>

⚠️ 보안 문제가 발생할 수 있다.


<br>

## ✏️ Connectionless
HTTP는 기본적으로 연결을 유지하지 않는 모델이다.
즉, Client - Server가 통신할 때마다 TCP/IP 연결을 맺는다.

서버 자원을 매우 효율적으로 사용할 수 있다.
<span style = "color:red">하지만</span>, 3 way handshake 시간이 낭비된다.

#### 【 해결 - Persistent HTTP】
HTML, CSS, JS 파일 각각을 보낼 때마다 연결을 맺지 않고, 하나의 Connection으로 object 여러개를 보낸다.

![](https://velog.velcdn.com/images/jaewon-ju/post/11dabec8-4858-4246-9d82-36b7bf46f3d1/image.png)


<br>

---

<br>

## ✏️ HTTP 메시지

HTTP 메시지의 구조는 다음과 같다.

| HTTP Message |
| - |
| Start Line / Status Line |
| Header |
| Empty Line |
| Message Body|


<br>

### ■ Request Message
【 /search?q=SMTP&hl=ko 】 을 GET Method로 요청한다고 가정해보자.

> #### Start Line
Method (공백) request-target (공백) HTTP-version (엔터)
#### ex) GET /search?q=SMTP&hl=ko HTTP/1.1<br>
- Method는 서버가 수행해야 할 동작을 지정한다.
- request-target은 요청하는 리소스를 지정한다.


>#### Header
field-name: field-value
#### ex) Host: www.google.com<br>
- Header는 HTTP 전송에 필요한 모든 부가정보를 나타낸다.
- Client의 정보, Body의 내용, Body의 크기 등

>#### Empty Line

>#### Message Body
- Message Body를 통해 HTML, JSON 등등 byte로 표현할 수 있는 모든 데이터를 전송 가능
- GET Method로 request를 할 때, Body를 사용해서 데이터를 전달할 수 있지만, 지원하는 곳이 많지 않음
- POST Method를 사용하는 경우, Body를 사용해서 데이터를 전달한다.

<br>

| Request Message |
| - |
| GET /search?q=SMTP&hl=ko HTTP/1.1 |
| Host: www.google.com |
|  |
| |



<br>

### ■ Response Message
앞선 Request Message에 응답을 해보자.

> #### Status Line
HTTP Version (공백) Status-Code (공백) Reason-Phrase (엔터)
#### ex) HTTP/1.1 200 OK<br>
- HTTP Status-Code는 요청의 성공/실패 등을 나타낸다.
자세한 설명은 이후의 포스트에서~
- Reason-Phrase는 Status-Code를 설명하는 짧은 글이다.


>#### Header
field-name: field-value<br>
#### ex) Content-Type: text/html;charset=UTF-8<br>Content-Length: 3512
- Header는 HTTP 전송에 필요한 모든 부가정보를 나타낸다.
- Client의 정보, Body의 내용, Body의 크기 등

>#### Empty Line

>#### Message Body
- Message Body를 통해 HTML, JSON 등등 byte로 표현할 수 있는 모든 데이터를 전송 가능
- ex) GET Method로 요청받은 리소스를 HTML에 담아서 보낼 수 있다.
#### &lthtml&gt<br>...<br>&lt/html&gt


| Request Message |
| - |
| HTTP/1.1 200 OK |
| Content-Type: text/html;charset=UTF-8<br>Content-Length: 3512 |
|  |
| &lthtml&gt<br>...<br>&lt/html&gt|


<br>

---

<br>

## REFERENCE
Computer Networking, A Top Down Approach - JAMES F. KUROSE
<a href= "https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC/dashboard">HTTP 강의 - 김영한 개발자님</a>
