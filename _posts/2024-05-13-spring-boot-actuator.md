---
title: "[Spring Boot] Actuator"
description: "애플리케이션 관리를 위한 Actuator에 대해서"
date: 2024-05-13T12:43:23.636Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-Actuator"
categories: Spring Boot
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:11.873Z
  hash: "92d54237c8ba6c9a497e0778f0eef699bf613840f8702ee6e2e696b7e0e43ea4"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ 프로덕션 운영
애플리케이션을 개발할 때, 기능 요구사항만을 개발하는 것은 아니다.
개발자는 서비스에 문제가 없는지 모니터링 해야하고, 운영에 필요한 요소들을 포함시켜야 한다.

다음은 운영에 필요한 기능들이다.
- 지표(metric)
- 추적(trace)
- 감사(auditing)
- 모니터링

> Spring Boot가 지원하는 Actuator는 위와 같은 기능들을 편리하게 사용할 수 있도록 도와준다.

<br>

---

<br>

## ✏️ Actuator
우선, Actuator를 사용하기 위해서는 라이브러리를 추가해야 한다.

```java
// build.gradle
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

라이브러리를 추가한 뒤에, 웹 애플리케이션을 실행한다.
```http://localhost:8080/actuator``` 에 접속하면 Actuator 기능을 사용할 수 있다.

<br>

Actuator의 기능을 EndPoint라고 부르며, 종류가 매우 다양하다.
그 중 중요한 몇가지를 살펴보자.

| 엔드포인트 | 기능 |
| - | - |
| beans | 등록된 빈을 모두 보여준다. |
| configprops | @ConfigurationProperties 를 보여준다. |
| env | Environment 정보를 보여준다. |
| health | 애플리케이션 헬스 정보를 보여준다. |
| httpexchanges | HTTP 호출 응답 정보를 보여준다.<br>HttpExchangeRepository를 구현한 빈을 별도로 등록해야 한다.|
| info | 애플리케이션 정보를 보여준다. |
| loggers | 애플리케이션의 logger 설정을 보여준다. 변경도 가능하다! |
| metrics | 애플리케이션의 메트릭 정보를 보여준다. |
| mappings | @RequestMapping 정보를 보여준다. |
| shutdown | 애플리케이션을 종료한다.<br>비활성화가 Default이다.|

<br>

EndPoint를 사용하기 위해서는, ```http://localhost:8080/actuator/{Endpoint}``` 로 접속하면 된다.
ex) ```http://localhost:8080/actuator/beans```

<br>

---

<br>

## ✏️ EndPoint 설정
기능(EndPoint)을 사용하기 위해선, <span style = "background-color: lightgreen; color:black">활성화</span>와 <span style = "background-color: lightgreen; color:black">노출</span>이 필요하다.

- EndPoint 활성화
: 해당 기능을 사용할지 말지 on, off를 결정하는 것

- EndPoint 노출
: 활성화된 EndPoint를 HTTP에 노출할지, JMX에 노출할지 선택하는 것

<br>

### ■ 활성화

shutdown을 제외한 대부분의 EndPoint는 기본으로 활성화되어 있다.
EndPoint를 활성화하기 위해서는 ```application.yml```에 다음과 같이 작성하면 된다.

```
management:
  endpoint:
    shutdown:
      enabled: true
```

<br>

### ■ 노출
EndPoint를 활성화하기 위해서는 ```application.yml```에 다음과 같이 작성하면 된다.

```
management:
  endpoints:
    web:
      exposure:
        include: "health,info"
```
web에 health, info EndPoint를 노출시킨다.

모든 EndPoint를 노출시키기 위해서는 와일드카드 ```"*"```를 사용하면 된다.

<br>

---

<br>

## ✏️ EndPoint 설명
### ■ health
- 애플리케이션이 요청에 응답을 할 수 있는지 판단한다.
- 데이터베이스가 응답하는지도 체크할 수 있다.
- 디스크 사용량 또한 확인할 수 있다.

<br>

health 정보를 더 자세히보려면 다음 옵션을 지정하면 된다.
```
management:
  endpoint:
    health:
      show-details: always
```

<br>

health 컴포넌트 중에 하나라도 문제가 있으면 status는 DOWN이 된다.

<br>

### ■ info
- 애플리케이션의 기본 정보를 보여준다.
- java: 자바 런타임 정보
- os: OS 정보
- env: Environment에서 info.으로 시작하는 정보
- build: 빌드 정보, ```META/build-info.properties``` 파일이 반드시 필요하다.
- git: git 정보, ```git.properties``` 파일이 필요하다.

env, java, os는 기본으로 비활성화 되어 있다.

<br>

<span style = "color:red">⚠️</span> info EndPoint를 활성화 하는 것은 일반적인 방법과 다르다.
다음과 같이, managment 다음에 바로 info가 나온다.

```
management:
  info:
    java:
      enabled: true
    os:
      enabled: true
```


<br>

### ■ loggers
- 로깅과 관련된 정보를 확인할 수 있다.
- 로그 레벨을 변경할 수 있다.

loggers EndPoint를 사용하면, 애플리케이션을 다시 시작하지 않아도 <span style = "color:red">실시간으로</span> 로그 레벨을 변경할 수 있다.
<br>

예를 들어, 특정 클래스의 Log Level을 Trace로 변경하고 싶은 경우,
```http://localhost:8080/actuator/loggers/{클래스}``` 에 POST로 다음과 같이 요청을 보낸다.
```
{
	"configuredLevel": "TRACE"
}
```


<br>

### ■ httpexchanges
- HTTP 요청과 응답을 기록한다.
- ```HttpExchangeRepository``` 인터페이스의 구현체를 빈으로 등록해야 한다.


<br>

---

<br>

## ✏️ 보안
Actuator가 제공하는 기능들은, 애플리케이션 내부 정보를 노출시킨다.
따라서, 외부 인터넷에 EndPoint를 공개시키는 것은 보안상 좋지 앟ㄴ다.

∴ 외부 인터넷에서 EndPoint에 접근하는 것을 막아야 한다.

<br>

### ■ 포트변경

Actuator의 포트를 변경해서 보안을 향상시킬 수 있다.
외부에는 서버에 접속하기 위한 8080포트만을 노출시키고, Actuator는 다른 포트를 설정하는 것이다.

다음과 같이, Actuator의 포트를 8082로 설정할 수 있다. ```management.server.port=8082```


<br>

---

<br>



## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용, 김영한 개발자님</a>