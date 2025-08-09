---
title: "[JAVA] 열거형"
description: "자바의 열거형에 관한 스터디 메모"
date: 2024-01-15T15:45:42.266Z
tags: ["Java"]
slug: "JAVA-열거형"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:35.869Z
  hash: "5485ce953bf545456fbcdb41d0028ce33619e66c2c49f0630b7f3ba04946114c"
---

## ✏️ 열거형이란
> 열거형은 한정된 값인 열거 상수 중에서 하나의 상수를 저장하는 타입이다.

## ✏️ 열거형의 선언
- 열거형을 선언하기 위해서는, 열거형의 이름.java 소스파일을 생성해야 한다.
- public enum 키워드를 사용하여 선언한다.
```java
public enum Week{ MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY}
// MONDAY ~ SUNDAY를 열거 상수라고 한다
```

## ✏️ 열거형의 사용
- 열거형 변수는 <span style = "background-color: #0B3B24">참조형</span> 변수이다.
- 위의 코드를 실행하면 7개의 열거 객체가 생성된다.
- 각 열거 상수가 열거 객체를 참조한다. 

![](https://velog.velcdn.com/images/jaewon-ju/post/31fc8029-14a2-486b-b7de-db6fdcff5feb/image.jpeg)

```java
Week today = Week.SUNDAY;
```

열거형 변수인 today는 참조 변수이다. 열거 상수인 Week.SUNDAY가 참조하고 있는 객체를 today 또한 참조하게 된다.

## REFERENCE
혼자 공부하는 자바