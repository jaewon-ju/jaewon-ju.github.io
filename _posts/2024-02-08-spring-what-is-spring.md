---
title: "[스프링 핵심 원리] What is Spring"
description: "스프링이란 무엇인가"
date: 2024-02-08T08:23:10.936Z
tags: ["Spring"]
slug: "Spring-What-is-Spring"
thumbnail: "https://velog.velcdn.com/images/jaewon-ju/post/608e1c39-0880-41a3-b1ed-5dba5422e071/image.png"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:06.030Z
  hash: "30cdeec333d942ece4451d90a43749b8b82c5c123342920bb43309f2946a4599"
---

김영한 개발자님의 스프링 로드맵을 수강해보기로 결정했다. 강의를 수강한 뒤 블로그에 이해한 내용을 작성하는 것은 가능하다고 하셔서, 각 포스트마다 출처를 밝힌 뒤에 게시물을 작성하고자 한다.

---

## ✏️ Spring은 왜 만들어졌는가
<br>

### EJB
EJB(Enterprise Java Beans)라는 자바 애플리케이션 표준 기술이 존재했었다.
EJB는 개발자가 비즈니스 로직에 집중할 수 있도록 돕는 다양한 기술을 지원했다. (분산 객체 시스템 등)

### 하지만...
프로젝트 자체가 EJB에 너무 의존하다보니 서비스를 구현하는 것보다 EJB를 설정하는 시간이 더 오래 걸린다는 문제점이 발생했다. 이는 시간이 지날수록 악화되었고, 이 때가 자바 개발의 겨울(winter)이라고 불렸다. 


### 봄(Spring)
위의 문제를 해결하기 위해 자바 개발자들은 새로운 기술을 찾기 시작했다.
그렇게 자바 개발의 봄(Spring)을 열게되는 두 기술이 등장한다.

1. 하이버네이트
게빈 킹이라는 개발자가 만든 기술로, EJB의 Entitiy Bean을 대체하게 된다. JPA는 하이버네이트를 계승한 기술이다.

2. 스프링
로드 존슨은 EJB의 문제점을 비판하는 책을 출간함과 동시에 약 3만줄의 기반 기술을 예제 기술로 공개했다. 이 3만줄의 코드는 스프링 프레임워크의 핵심 개념들이 담겨있는 코드였고, 이를 눈여겨 본 유겐 휠러와 얀 카로프가 로드 존슨에게 오픈 소스 프로젝트를 제안했다. 그렇게 탄생한 것이 Spring이다.

<br>

---

<br>

## ✏️ Spring은 무엇인가

Spring은 문맥에 따라 다르게 해석될 수 있다.

- 스프링 DI 컨테이너
- 스프링 프레임워크
- 스프링 생태계

스프링 생태계는 여러 기술들을 포함하고 있는데, 대표적으로 Spring Boot와 Spring Framework가 있다. 

### ■ Spring Framework
Spring Framework는 JAVA 언어 기반의 프레임워크이다.

> 프레임워크 VS 라이브러리
<br>
프레임워크, 라이브러리 모두 코드 작성에 도움을 주는 일련의 클래스 묶음 또는 틀이다. 차이점은 <span style = "color:red">제어권</span>이 누구에게 있는가이다. 프레임워크의 제어권은 프레임워크 자신에게 있고 라이브러리의 제어권은 개발자에게 있다.
비유를 통해 이해해 보자.
<br>
프레임워크 : 이미 지어져 있는 아파트에 이사를 간다. 나는 방 개수, 화장실의 위치 등을 바꿀 수 없다. 나는 이미 짜여진 구조안에서 집을 꾸미기 시작한다.
<br>
라이브러리: 내가 직접 구조를 설계하여 새로운 건물을 짓는다. 집을 꾸미기 위한 가구나 내가 직접 만들기 힘든 물건들을 라이브러리가 제공해준다.

스프링의 핵심은 <span style = "background-color: lightgreen; color:black">"객체 지향"</span>이다.
스프링은 좋은 객체 지향 애플리케이션을 개발할 수 있도록 도와주는 프레임워크이다.

<br>

### ■ Spring Boot
>Spring Boot는 Spring Framework를 편하게 쓸 수 있도록 돕는 기술이다.

Spring Boot가 등장하기 이전에는 Spring Framwork의 설정을 하는 것이 너무 오랜 시간이 걸렸다. 

Spring Boot는 톰캣 같은 웹 서버를 내장하고 있어서 웹 서버를 자동으로 연결해준다. 또한, Spring Boot를 통해 스프링 애플리케이션을 쉽게 생성할 수 있다. 이 밖에도 다양한 장점들이 존재한다.



<br>

---

<br>

#### 출처: <a href="https://www.inflearn.com/course/lecture?courseSlug=%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8&unitId=55327">스프링 핵심 원리 - 김영한 개발자님</a>

