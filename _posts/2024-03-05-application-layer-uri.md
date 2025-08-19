---
title: "[Application Layer] URI"
description: "URI의 정의와 URL 문법"
date: 2024-03-05T09:56:16.115Z
tags: ["network"]
slug: "Application-Layer-URI"
categories: Network
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:27.893Z
  hash: "ee3fd54a11e4f29ecc9d4c69f22c6f703467f584689c51796cfd90f59a3b6b86"
---


## ✏️ URI
> URI(Uniform Resource Identifier)는 인터넷 자원의 고유 식별자이다.

URI는 URL과 URN을 포함한다.

- URL: Uniform Resource Locator
리소스의 경로 정보(문자열)를 식별자로 활용

- URN: Uniform Resource Name
리소스에 이름을 식별자로 활용

URN은 보편적으로 사용되지 않는다.


<br>

---

<br>

## ✏️ URL의 문법
URL은 다음과 같은 문법을 가지고 있다.

<center>scheme://[userinfo@]host[:port][/path][?query][#fragment]
<br></center>
<center>ex) https://www.google.com/search?q=SMTP&hl=ko</center>

<br>
URL은 

1. schme (프로토콜)
2. host (호스트명)
3. :port (포트 번호)
4. /path (경로)
5. ?query (쿼리 파라미터)

를 순서대로 작성해야 한다.

### ■ scheme
<center><span style = "background-color:skyblue; color:black">scheme</span>://[userinfo@]host[:port][/path][?query][#fragment]</center><br>
<center>ex) <span style = "background-color:skyblue; color:black">https</span>://www.google.com/search?q=SMTP&hl=ko</center>

주로 프로토콜을 사용한다.

- 어떤 프로토콜을 사용해서 리소스에 접근해야 하는지 알려준다.
- 대소문자를 구분하지 않는다.


<br>

### ■ userinfo
<center>scheme://<span style = "background-color:skyblue; color:black">[userinfo@]</span>host[:port][/path][?query][#fragment]</center><br>
<center>ex) https://www.google.com/search?q=SMTP&hl=ko</center>

- URL에 사용자 정보를 포함할 때 사용하지만, 주로 생략한다.

<br>

### ■ host
<center>scheme://[userinfo@]<span style = "background-color:skyblue; color:black">host</span>[:port][/path][?query][#fragment]</center><br>
<center>ex) https://<span style = "background-color:skyblue; color:black">www.google.com</span>/search?q=SMTP&hl=ko</center>

- 접근하려는 리소스를 가지고 있는 호스트 명
- 도메인명 또는 IP 주소를 직접 사용 가능하다.

<br>

### ■ port
<center>scheme://[userinfo@]host<span style = "background-color:skyblue; color:black">[:port]</span>[/path][?query][#fragment]</center><br>
<center>ex) https://www.google.com/search?q=SMTP&hl=ko</center>

- 서버가 열어 놓은 접속 포트 번호를 작성한다.
- 일반적으로 생략, 생략 시 https는 443으로 자동 입력됨
<br>

### ■ path
<center>scheme://[userinfo@]host[:port]<span style = "background-color:skyblue; color:black">[/path]</span>[?query][#fragment]</center><br>
<center>ex) https://www.google.com<span style = "background-color:skyblue; color:black">/search</span>?q=SMTP&hl=ko</center>

- 리소스의 경로를 나타낸다.
- /를 사용하여 계층적으로 나타낸다.
ex) /home/files/file1.jpg

<br>

### ■ query
<center>scheme://[userinfo@]host[:port][/path]<span style = "background-color:skyblue; color:black">[?query]</span>[#fragment]</center><br>
<center>ex) https://www.google.com/search<span style = "background-color:skyblue; color:black">?q=SMTP&hl=ko</span></center>

- 요청에 필요한 파라미터를 서버에 전달하기 위해 작성한다.
- key = value의 형태로 작성
- ?로 시작하고 &로 파라미터를 추가할 수 있다.

<br>

### ■ fragment
<center>scheme://[userinfo@]host[:port][/path][?query]<span style = "background-color:skyblue; color:black">[#fragment]</span></center><br>
<center>ex) https://www.google.com/search?q=SMTP&hl=ko</center>


- 리소스의 특정 부분을 가리키기 위해 사용한다.
- 서버에 전송되지 않는다.

<br>

---

<br>

## REFERENCE

<a href= "https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC/dashboard">HTTP 강의 - 김영한 개발자님</a>

