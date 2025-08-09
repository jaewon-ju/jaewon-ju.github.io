---
title: "[Spring Security] JWT (1)"
description: "JWT란 무엇인가"
date: 2024-07-04T06:56:09.726Z
tags: ["Spring","spring security"]
slug: "Spring-Security-JWT"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:54.010Z
  hash: "e39e3d488537f20e3474f95fc162a4c6b090ebce1ca69a733bc53bb4ad0578bb"
---

## ✏️ Cookie & Session
JWT를 이해하기 전에, 먼저 쿠키와 세션에 대해서 알아야 한다.

사용자가 애플리케이션을 사용할 때, 각 기능을 호출할 때마다 인증을 받는 것은 매우 귀찮을 것이다. HTTP는 Stateless 하기 때문에, 매 호출마다 인증을 받아야 한다.

위와 같은 문제점을 해결하기 위해 쿠키와 세션을 사용한다.
<br>

### ■ Cookie
>#### 쿠키란?
<span style = "color:red">웹 브라우저</span>에 저장되는 작은 데이터 조각

- 클라이언트 상태정보를 쿠키로 웹 브라우저에 저장해놓는다.
- 쿠키로 사용자 인증을 유지할 수 있다.
- 쿠키는 브라우저를 종료해도 <span style = "color:red">없어지지 않는다!</span>
   - 만료시점이 지나면 자동으로 삭제된다.
   
   <br>

쿠키는 다음과 같은 과정으로 작동한다.

1. 클라이언트가 서버에 페이지를 요청
2. 서버에서 쿠키 생성
3. HTTP Header에 쿠키를 포함시켜서 응답
4. 클라이언트는 웹 브라우저에 해당 쿠키를 보관
5. 다음 요청부터는 쿠키를 넣어서 보냄

<br>

### ■ Session
> #### 세션이란?
<span style = "color:red">서버에서 관리되는</span> 사용자와의 대화 상태

세션은 쿠키를 기반으로 작동한다!

- 서버는 <span style = "background-color: lightgreen; color:black">세션 ID</span>를 쿠키에 넣어서 클라이언트에 전달한다.
- 웹 브라우저가 해당 세션 ID를 가지고 서버에 요청하면, 서버는 세션 ID를 통해 인증을 한다.
- 세션은 브라우저가 종료되면 삭제된다.

<br>

세션은 다음과 같은 과정으로 작동한다.

1. 클라이언트가 서버에 페이지를 요청
2. 서버에서 쿠키 생성 With 세션 ID
3. HTTP Header에 쿠키를 포함시켜서 응답
4. 클라이언트는 웹 브라우저에 해당 쿠키(세션 ID가 들어있음)를 보관
5. 다음 요청부터는 쿠키를 넣어서 보냄

<br>

### ■ Cookie VS Session
가장 큰 차이점은, 사용자 정보의 저장 위치이다.

- Cookie: 사용자 정보가 브라우저(클라이언트)에 저장되어 있음
- Session: 사용자 정보가 서버에 저장되어 있음. 브라우저는 세션 ID만 쿠키 내에 갖고 있음

<br>

라이프 사이클도 다르다.

- Cookie: 만료 시점까지 삭제되지 않음
- Session: 브라우저 종료 시 삭제


<br>

---

<br>


## ✏️ Session의 한계

세션의 동작 과정을 더 자세히 알아보자.
> #### Session ID 발급 과정
![](https://velog.velcdn.com/images/jaewon-ju/post/cc2d1793-e3c0-4e73-8221-53ad7a45ba16/image.png)
1. 클라이언트가 서버에 페이지를 요청
2. 서버는 세션 ID를 생성하고, 사용자 정보를 저장할 공간을 미리 만들어 둔다.
3. 세션 ID가 포함된 쿠키를 Header에 넣어서 응답
4. 클라이언트는 웹 브라우저에 세션 ID가 들어있는 쿠키를 보관

> #### 로그인 과정
![](https://velog.velcdn.com/images/jaewon-ju/post/0b5d522a-9d5e-4732-8b24-5557512de94d/image.png)
1. 클라이언트가 서버에 로그인 요청
2. 서버는 사용자가 회원가입이 되어있는지 확인(인증)
3. 인증된 사용자라면, 해당 사용자의 정보를 세션 ID와 함께 저장
4. 응답 - 메인페이지로 이동

<br>

위의 두 과정을 거치면, 세션 ID만 있어도 인증을 받을 수 있다.

예를 들어, 사용자 정보를 요청하는 HTTP Request를 세션 ID와 함께 서버에 보내면, 서버는 세션 영역에서 해당 세션 ID에 맞는 사용자 정보를 찾는다.

<br>

### ■ 문제점
>만약, 서버가 여러대라면?

수강신청 서버 A, B, C가 존재한다.
로드밸런싱을 사용해서 각 서버에 적절하게 부하를 분산시킨다고 가정해보자.

1. 철수가 수강신청을 하기 위해 서버 B에 로그인 했다.
2. 철수의 정보는 서버 B의 세션 영역에 저장된다.
3. 로그인을 완료한 철수가 "수강신청" 버튼을 눌렀는데, 로드밸런싱에 의해 서버 A로 요청이 전송되었다.
4. 서버 A의 세션 영역에는 철수의 세션 정보가 없기 때문에, 다시 로그인을 해야하는 상황이 발생한다!!


<br>

이러한 문제점을 해결하기 위해서 다음과 같은 방법들을 사용할 수 있다.

| 해결방법 | 기능 |
| - | - |
| Session Stickiness | 로드 밸런서가 특정 사용자의 요청을 항상 같은 서버로 전달하도록 설정<br>예를 들어, 철수가 서버 B에 로그인하면, 이후의 모든 요청은 서버 B로 전달된다.|
| 세션 정보 중앙 저장 | 세션 정보를 중앙 저장소에 저장하여 모든 서버가 동일한 세션 정보를 공유하도록 한다.<br><br>- DB 중앙 저장소: 매 로그인마다 I/O가 필요해서 성능이 낮음<br>- 인메모리 중앙 저장소(Redis): DB 저장소보다 빠름 |

<br>

그리고, 해결 방법이 한 가지 더 있다.
바로 JWT를 사용하는 것이다.


<br>

---

<br>


## ✏️ JWT
>#### JWT (JSON Web Token)
: JSON 형식의 정보를 사용하여 클라이언트와 서버 간에 안전하게 정보를 전송하는 데 사용되는 표준 웹 토큰

### ■ JWT의 구조
JWT는 점(.)으로 구분된 세 부분으로 구성된다.

| 구성요소 | 설명 |
| - | - |
| Header | 아래와 같은 정보를 포함한다.<br>- 토큰의 유형: JWT<br>- 사용된 해싱 알고리즘: ex) HMAC SHA256 |
| Payload | 토큰에 포함될 실제 데이터(claim) |
| Signature | Header와 Payload를 인코딩한 후 비밀키로 해싱한 값 |

위의 3가지 요소들을 Base64로 인코딩 하면 다음과 같은 결과가 나온다.
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

이것이 바로 JWT 토큰이다.

<br>

### ■ 무결성
JWT는 서명(Signature)을 통해 무결성을 보장한다.
즉, 서명을 통해 토큰이 생성된 이후 변경되지 않았음을 보장한다.<br>
- Header와 Payload를 Base64로 인코딩한 다음, 서버의 비밀키를 포함해서 HS256으로 암호화한다.
- ```Signature = HS256(Base64(Header) + "." + Base64(Payload) + secret)```
- Header,Payload,Signature 를 각각 Base64로 인코딩한 결과를 합쳐서 JWT 토큰을 만든다.

<br>

클라이언트가 JWT 토큰을 보내면, 서버는 토큰을 생성할 때와 똑같은 방식으로 Signature를 만들어내고 JWT 토큰 내부에 존재하는 Signature와 비교한다.

<br>

### ■ 동작 방식
1. 로그인: 사용자가 로그인을 하면 서버는 사용자의 인증 정보를 검증한 후 JWT를 생성하여 클라이언트에게 반환한다.
2. 저장: 클라이언트는 받은 JWT를 로컬 저장소(ex: LocalStorage)에 저장.
3. 요청: 클라이언트가 서버에 요청할 때 JWT를 HTTP 헤더에 포함시켜 전송.
4. 검증: 서버는 클라이언트로부터 받은 JWT를 검증하여 유효성을 확인한 후 요청을 처리.


<br>

Spring Security를 활용하여 JWT를 구현하는 것은 다음 포스트에서 알아보자.

<br>

---

<br>

## REFERENCE
<a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0/dashboard">스프링부트 시큐리티 & JWT 강의</a>