---
title: "[Spring MVC] Introduction"
description: "WAS, Servlet이란 무엇인가?"
date: 2024-03-15T02:00:56.064Z
tags: ["MVC","Spring"]
slug: "Spring-MVC-Web-Application-Server"
categories: Spring
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:07:26.600Z
  hash: "077759332bc07b393331f38f11333a48a81769a999586eb4e267aacb7391d3b1"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard">스프링 MVC</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---

<br>

### 들어가기 전에..
<a href="https://velog.io/@jaewon-ju/Application-Layer-HTTP-Intro">HTTP 포스트</a>를 정독하는 것을 추천한다. 
<br>

---

## ✏️ Web Server <span style = "color:red">VS</span> Web Application Server
Web Server와 Web Application Server(WAS)...
둘 다 서버인데 무엇이 다른 것일까?

일단 둘 다 서버이므로 공통점이 존재한다.

| 공통점 |
| - |
| HTTP 기반으로 동작한다. |
| 정적 리소스를 제공한다. |

<br>

그렇다면 차이점은 무엇일까?
> Web Application Server는 애플리케이션 로직을 실행할 수 있다!

즉, WAS는 정적 리소스만을 제공하는 것 뿐만 아니라, 동적 HTML, HTTP API 등을 전달할 수 있다.

JAVA는 Servlet Container 기능을 제공하면 WAS로 칭한다.

<br>

---

<br>

## ✏️ Web 시스템의 구성
Server와 DB를 사용하면 웹 시스템을 구성할 수 있다.

### ■ WAS + DB
WAS는 Web Server의 기능을 포함하고 있으므로, WAS + DB 만으로 웹 시스템을 구성할 수 있다.
![](/assets/posts/image.png)

하지만 이렇게 구성한다면 WAS가 정적 리소스, 애플리케이션 로직을 모두 담당하게 된다.
➜ 서버 과부하의 우려가 있다.
➜ WAS 장애시 오류 화면 노출도 불가능하다.

<br>

### ■ Web Server + WAS + DB
위의 문제점을 해결하기 위해, Web Server를 구성에 추가한다.
![](/assets/posts/image.png)

정적 리소스 -  Web Server가 관리
동적 리소스(애플리케이션 로직 등) -  WAS가 관리

위의 구조로 웹  시스템을 구성한다면 효율적으로 리소스를 관리할 수 있다.
ex) 정적 리소스 트래픽 증가 -> Web Server 증설
동적 리소스 트래픽 증가 -> WAS 증설

또한, WAS 장애시 WEB Server가 오류 화면을 제공할 수 있다.


<br>

---

<br>

## ✏️ Servlet
> Servlet이란 Java에서 동적 웹 페이지를 만드는 기술이다.

서버가 클라이언트와 통신하는 상황을 가정해보자.
> 1. Server TCP/IP 대기, 소켓 연결
2. HTTP 요청 메시지 읽기
2-1. HTTP Method는 무엇인지
2-2. Content-Type은 무엇인지
3. HTTP 메시지 Body 읽기
4. <span style = "color:red">비즈니스 로직 실행</span>
5. HTTP 응답 메시지 생성
6. TCP/IP에 응답 전달
7. 소켓 종료

이렇게 많은 과정을 처리해야 한다.
하지만, 백엔드 개발자가 신경써야 할 부분은 【 4. <span style = "color:red">비즈니스 로직 실행</span> 】 뿐이다.
Servlet은 이 모든 환경을 제공한다!

Servlet을 사용하면, 개발자는 비즈니스 로직에만 집중할 수 있다.

<br>

### ■ Servlet의 특징
다음의 Servlet 객체를 한번 보자.
```java
@WebServlet(name = "basicServlet", urlPatterns = "/basic")
public class BasicServlet extends HttpServlet {
    
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) 
    	throws ServletException, IOException {
        
        System.out.println("Servlet test");
    }
}
```

서버의 리소스인 ```"/basic"``` 에 요청이 오면, 서블릿 코드가 실행된다.

요청 메시지는 ```request``` 객체로 저장되고, 응답 메시지를 작성하고 싶다면 ```response``` 객체에 입력하면 된다.

그렇다면, 위의 두 객체 ```request``` 와 ```response```를 생성해주는 주체는 무엇일까? 
➜ Servlet Container

```BasicServlet``` 클래스의 ```service()``` 메소드를 실행하는 주체는 무엇일까?
➜ Thread


<br>

### ■ Servlet Container
>Servlet을 지원하는 WAS를 Servlet Container라고 한다.

사실 WAS는 Web Server + Servlet Container로 구성된다.

>위의 코드의 작동 과정을 알아보자. 
![](/assets/posts/image.png)
1. ```/basic``` 리소스 요청이 발생한다.
2. WAS가 ```basicServlet``` 객체를 생성한다.
3. WAS가 ```request```, ```response``` 객체를 생성한다.
4. ```request```, ```response``` 객체를 ```basicServlet``` 객체에 전달한다.
5. ```basicServlet``` 객체는 애플리케이션 로직을 실행해서 응답 메시지를 작성하고 ```response``` 객체에 넣는다.
6. 응답 메시지를 Client에 전송한다.

Servlet Container는 다음과 같은 역할을 한다.
 - 서블릿 객체를 생성, 초기화, 호출, 생명주기 관리
 - 서블릿 객체를 싱글톤으로 관리
 - 동시 요청 처리를 위한 멀티 쓰레드 지원



<br>

---

<br>

## ✏️ Multi Thread
>WAS는 서블릿 객체를 생성하고 관리하지만, 실제로 요청을 처리하는 것은 Thread이다. 

- Thread는 서블릿 객체를 호출한다.
- Thread는 요청과 응답을 처리한다.

<br>

### ■ 단일 Thread
만약, WAS가 스레드를 한 개만 사용하면 어떻게 될까?

1. Client A와 B가 WAS 서버에 요청을 한다.
2. Thread가 A의 요청을 처리하는 동안, B는 기다려야 한다.

따라서, 스레드를 한 개만 사용하는 것은 현대 웹 구조상 불가능하다. 

<br>

### ■ Multi Thread
그렇다면, 요청이 발생할 때마다 스레드를 생성한다고 해보자.

위와 똑같은 상황에서 Client B는 더이상 기다릴 필요가 없다.
새로운 스레드를 생성해서 요청을 처리하면 된다.

__<span style = "color:red">하지만, </span>__요청 마다 스레드를 생성하는 것은 단점이 존재한다.

<br>

| 요청마다 스레드를 생성하는 것의 단점|
| - |
| 스레드 생성 비용이 비싸다. |
| Context Switching 비용이 발생한다. |
| 스레드 생성에 제한이 없으므로, 요청이 너무 많으면 하드웨어 임계점을 넘어서 서버가 죽을 수 있다. |

<br>

### ■ Thread Pool
위의 단점들을 해결하기 위한 것이 Thread Pool이다.

> Thread Pool은 제한된 개수의 Thread를 생성하고, 요청 하나 당 Thread를 한 개씩 할당하는 방식이다.

예를 들어, Thread Pool의 개수를 100개로 설정했다고 하자.

1. 클라이언트 1-100번이 동시에 서버에 요청을 전송한다.
2. 1-100번 클라이언트는 Thread Pool에서 스레드를 한 개씩 할당받는다.
3. 101번 클라이언트의 요청이 들어오면, 대기하거나 거절된다.

※ Tomcat은 Thread Pool의 Thread 개수를 200개로 기본 설정한다.

<br>

- 스레드가 미리 생성되어 있으므로, 스레드 생성/종료 비용이 절약된다.
- 생성 가능한 스레드의 최대치가 설정되어 있으므로, 많은 요청이 들어와도 안전하게 처리할 수 있다.


<br>

> WAS의 주요 튜닝 포인트는 최대 스레드 수이다.<br>
너무 낮음 ➜ 서버 여유로움, but 클라이언트 응답 지연
너무 높음 ➜ 클라이언트 응답 빠름, but 서버 다운의 우려가 있음

<br>

► 개발자는 마치 싱글 스레드 프로그래밍을 하듯이 소스 코드를 작성하면 된다.
► 멀티 스레드는 WAS가 관리한다!

<br>

---

<br>

## ✏️ SSR & CSR
### ■ SSR (Server Side Rendering)
- HTML 최종 결과를 서버에서 만들어서 웹 브라우저에 전달한다.
- 주로 정적인 화면에 사용한다.
- 관련기술: JSP, 타임리프

<br>

### ■ CSR (Client Side Rendering)
- HTML 결과를 자바스크립트를 사용해 웹 브라우저에서 동적으로 생성해서 사용한다.
- 주로 동적인 화면에 사용한다.
- 관련기술: React, Vue.js



<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard">스프링 MVC 1편 - 김영한 개발자님</a>
