---
title: "[JPA] JPA 소개"
description: "JPA란 무엇인가?"
date: 2024-06-29T07:31:34.375Z
tags: ["JPA"]
slug: "Spring-JPA-JPA-소개"
series:
  id: f3e01f5b-65b1-4f04-94dc-3fb49b49d1a7
  name: "Spring Boot"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:54.254Z
  hash: "b37ae88c4a1067919b525142062d2d12a4116f9e174770caa919fae0f0633c2b"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/ORM-JPA-Basic">JPA 프로그래밍</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ JPA
객체를 관계형 데이터베이스에 저장할 때 발생하는 여러가지 문제점들이 존재한다.


| 문제점(차이점) | 설명 |
| - | - |
| 상속 | 객체에는 상속이 존재하지만, RDB에는 존재하지 않는다. |
| 연관관계 | 객체는 참조를 사용하지만, RDB는 FK를 사용한다. |
| 데이터 타입 | 객체와 RDB에 존재하는 데이터 타입이 다르다. |
| 데이터 식별 방법 | 객체 - 주소를 통한 식별, RDB - PK를 통한 식별 |

<br>

위와 같은 문제를 해결하기 위해선 ORM 기술이 필요하다.

>#### ORM (Object-Relational Mapping)
: 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑해 주는 기술

>#### JPA (Java Persistence API)
: 자바 진영의 ORM 기술 표준

- JPA는 인터페이스이다.
- JPA의 구현체로는 Hibernate, EclipseLink 등이 존재한다.

<br>

### ■ JPA 동작 방식
애플리케이션과 JDBC 사이에서 동작, SQL을 객체로 자동 변환
![](https://velog.velcdn.com/images/jaewon-ju/post/cb17fb65-b316-416b-b551-45eb57a16440/image.png)


<br>

### ■ JPA의 이점

1. 1차 캐시와 동일성 보장
: 같은 트랜잭션 안에서는 같은 엔티티를 반환한다!

2. 트랜잭션을 지원하는 쓰기 지연 기능
: 트랜잭션을 커밋할 때까지 쿼리를 모은 다음, 한꺼번에 전송한다.

3. 지연 로딩과 즉시 로딩 옵션
   - 지연 로딩: 객체가 실제 사용될 때 로딩
   - 즉시 로딩: JOIN SQL로 한번에 연관된 객체까지 미리 조회

4. JPA는 특정 데이터베이스에 종속되지 않는다.
: 각 데이터베이스의 방언에 맞게 SQL을 생성한다.

<br>

---

<br>

## ✏️ JPA의 구동 방식
구동 방식을 이해하기 전에, 3가지 요소를 알아야 한다.

<br>

>#### 1. ```Persistence.xml```
DB 설정에 필요한 정보를 기술해둔 파일
JPA는 이 파일을 바탕으로 DB의 정보를 가져온다.

- ```Persistence.xml``` 파일에는 '옵션' 속성들이 존재한다.
- 옵션에 존재하는 ```ddl.auto``` 속성은 다음 5가지 값을 가질 수 있다.
   - create: 기존 테이블 삭제 후 재생성
   - create-drop: create와 동일하나, 종료시 테이블 drop
   - update: 변경된 부분만 수정
   - validate: entity ⇔ table이 정상적으로 매핑되었는지만 확인
   - none: 사용 X

<span style="color:red">⚠️</span> create, create-drop, update는 운영 서버에서는 사용하면 안된다!!!!

<br>

>#### 2. EntityManager
엔티티의 CRUD를 담당하는 인터페이스
엔티티와 관련된 모든 서비스를 담당한다.
- EntityManager의 작업은 <span style="color:red">트랜잭션 단위</span>로 처리해야 한다.
- EntityManager는 쓰레드간에 공유되지 않는다.

<br>

>#### 3. EntityMangerFactory
EntityManager를 생성하는 공장 역할 수행
- EntityManagerFactory는 ```Persistence.xml``` 파일의 정보를 토대로 생성한다.
- EntityManagerFactory는 DB당 하나씩만 생성한다.


<br>

이제, JPA의 구동 방식에 대해서 알아보자.

1. ```Persistence.xml``` 설정정보로 ```EntityManagerFactory``` 생성
2. ```EntityManagerFactory```는 필요할 때마다 ```EntityManager``` 생성
3. ```EntityManager```를 통해서 DB에 접근


<br>

---

<br>

## ✏️ JPQL
> #### JPQL (Java Persistence Query Language)
: 엔티티 객체를 조회하는 <span style="color:red">객체 지향</span> 쿼리

<span style="color:red">⚠️</span> JPQL은 테이블을 대상으로 쿼리를 하지 않고, 객체를 대상으로 쿼리를 한다.

<br>

- JPQL은 SQL을 추상화한 객체 지향 쿼리 언어이다.
- 특정 DB에 종속되지 않는다.

JPQL에 대해서는 이후에 더 자세히 설명하겠다.

<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA 프로그래밍 - 김영한 개발자님</a>

