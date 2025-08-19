---
title: "[Spring Boot] Introduction"
description: "Spring Boot 시작!"
date: 2024-04-01T06:58:05.031Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-Introduction"
thumbnail: "/assets/posts/image.jpg"
categories: Spring Boot
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:07:13.717Z
  hash: "fc7a4cd929a21a4d8e25d0c4871e46cfd0a7366d1070f8d2e2ac3f1f63d7a498"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ Spring Boot
__스프링은 거대하다.__

원래는 3만줄 가량의 코드였으나, 많은 개발자들이 사용하고 기능들을 덧붙이면서 점점 기능이 많아지게 되었다. 그러다 보니, 스프링 프로젝트 시작에 필요한 설정이 점점 늘어나고 어려워졌다.

> 스프링 부트는 스프링을 쉽게 사용하기 위한 환경을 제공한다.

<br>

스프링 부트 또한 다양한 기능이 존재한다.
그 중에서도 김영한 개발자님은 스프링 부트의 핵심 원리를 아래의 5가지로 정의한다.

1. WAS
: Tomcat과 같은 웹 서버를 내장한다.
2. 라이브러리 관리
: 스프링 외부 라이브러리의 버전을 자동으로 관리해준다.
3. 자동 구성
: 프로젝트 시작에 필요한 스프링과 외부 라이브러리 빈을 자동 등록한다.
4. 외부 설정
: 개발 환경에 따라 외부 설정을 공통화한다.
5. 프로덕션 준비
: 모니터링을 위한 메트릭, 상태 확인 기능을 제공한다.

<br>

다음 포스트부터 스프링 부트의 핵심 원리에 대해서 알아보도록 하자.


<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용 - 김영한 개발자님</a>