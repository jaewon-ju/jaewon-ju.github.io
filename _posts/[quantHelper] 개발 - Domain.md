---
title: "[quantHelper] 개발 - Domain"
description: "domain을 개발했다."
date: 2024-04-06T14:56:08.293Z
tags: ["프로젝트"]
slug: "quantHelper-개발-Domain"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.502Z
  hash: "1b27d36fa4756b160b373f7127475446f3de957ed352cec30a9794844e8ca0a3"
---

## ■ 프로젝트 생성
start.spring.io 에서 프로젝트를 생성했다.
Dependency는 Spring MVC, Lombok, Postgresql 정도.

### 리포지토리 구성
- controller
- DTO
- domain
- repository
- service

<br>

### Docker
처음으로 도커를 사용해봤다.
>도커는 Virtual Machine과 비슷한 개념이지만, 하드웨어적으로 훨씬 가볍다.
Virtual Machine은 내 컴퓨터 위에 완전히 새로운 디바이스(w/OS)를 올리는 개념이라면, Docker는 docker Engine과 함께 컨테이너를 올리는 것이다.

개발자는 자신의 컴퓨터 환경에서 코드를 작성하고 서버에 올린다.
하지만, 자신의 컴퓨터 환경과 서버의 환경은 다르다. 따라서, 종속성 문제가 발생할 수 있다.

Docker는 이를 해결하기 위해 완전히 독립된 환경을 제공한다.

- Docker File로 나의 어플리케이션에서 필요한 모든 정보를 담는다.
- Docker Image로 그 환경을 하나의 템플릿으로 만든다.(일종의 클래스 같이)
- Docker Container는 Image로 찍어낸 하나의 환경이다.

Docker Contianer 각각은 완전히 독립된 환경이다.
따라서, 내 컴퓨터던 서버던 똑같이 동작하는 것을 보장해준다.

동료가 Dockerfile과 docker-compose.yml을 작성해서 보내주면, 다음과 같이 실행하면 된다.
#### docker 시작하는 방법
처음일 때: docker-compose build + docker-compose up -d
- docker-compose build: docker-compose.yml 파일을 구성 정보로 빌드
- docker-compose up -d: docker-compose.yml 파일에서 정의된 서비스들에 대한 컨테이너를 빌드


<br>

---

<br>

## ■ 2일차 내용

### 1. 삽질
Spring MVC만 공부하다가 처음으로 JPA를 다루어보았다.
로컬 메모리 저장소만 사용하다가 ORM 개념을 처음 접하니 머리가 빙빙 돌았다.

Spring MVC 강의를 듣고 Controller 개념을 빠삭하게 이해해서, 난 이제 웹 애플리케이션을 개발할 수 있을 줄 알았는데 아니었다.
갑자기 Spring Web Layer 개념도 나오고, DTO, domain 등 모르는 개념이 속출했다.

무지성 구글링을 하다가, 안되겠다 싶어서 JPA 강의를 바로 질렀다.
JPA와 ORM 개념을 어느정도 이해할 수 있었지만, 바로 실전에 적용할 수 있는 내용은 아니었다.

그래서 다른 사람이 만든 게시판 프로젝트를 읽어보면서 domain부터 천천히 따라가보았다.


<br>

### 2. Spring Web Layer

![](https://velog.velcdn.com/images/jaewon-ju/post/71e215d9-e67b-4996-b40b-e75cd5624f7d/image.png)

![](https://velog.velcdn.com/images/jaewon-ju/post/35b45425-d116-4836-a9f7-2f3d416a03bb/image.png)

우리가 만드는 것: 주식 분석 및 예측 프로그램

>Domain: 해결하고자 하는 문제 영역, 요구사항. 즉 우리의 도메인은 뉴스, 주식, 재무제표, 기업 등이다.

- Domain model: 특정 도메인을 개념적으로 표현한 것(Entity)
- Repository: 데이터 액세스 관리
- Service: 트랜잭션, 도메인 간 순서 보장.
- DTO: 다른 계층 간 교환을 위한 객체. 도메인 모델(객체)을 직접 전달할 수도 있지만, 민감한 기능이 노출될 수 있다.
- Web: Controller, View Template 등

<br>

### 3. 구현
오늘 실제로 구현한 것이다.

- domain
   - CorporateInformation 클래스
   - FinancialStatement 클래스
   - Stock 클래스

- repository
   - CorporateInformationRepository 클래스
   - FinancialStatementRepository 클래스
   - StockRepository 클래스

>여기서, 모든 Repository는 JpaRepository를 상속하는 인터페이스이다.<br>
내용은 채우지 않아도 된다.
스프링 부트가 자동으로 다음과 같은 메소드들은 생성하도록 설계해주기 때문이다.
- findAll(), findAllById(), 
- saveAll()
- getOne(), findById()
- flush(), saveAndFlush()
- count(), existsById()
- delete, deleteById, deleteAll()

- DTO
   - CorporateInformationDTO클래스
   - FinancialStatementDTO 클래스
   - StockDTO 클래스

- 테스트코드
   - stockRepository 테스트 코드를 Junit으로 작성해서 postgresql과 잘 연동되었는지 확인했다.

- Service
   - StockService 클래스: 만들다가 Controller와 어떻게 연결해야 될지 모르겠어서 계속 찾아보는중. 아마 월요일에 마저 할듯

<br>

### 4. 배운 것
1. Entity에는 setter를 작성하지 않는다.
setter는 의도가 불분명하고, 변경하면 안되는 값임에도 변경가능한 값으로 착각할 수 있다.
따라서, setter대신 setter와 비슷한 메소드를 만들어서 사용한다.
https://skatpdnjs.tistory.com/13

2. Spring Web Layer

3. ORM을 사용하면 쿼리 작성을 안해도 된다.

4. application.yml에서 아래의 코드를 작성하면 hibernate가 작성한 쿼리를 볼 수 있다.
```
show_sql: true
format_sql: true
```

6. Docker 개념

<br>

### 5. 발생했던 오류들
1. 단위 테스트할 때, 빌더 패턴을 사용해서 stock 객체를 만들고 테이블로 쐈다.
근데 오류가 발생했다.
알고보니, 빌더 패턴에서 제외되었던 ```stockId``` 필드가 입력되지 않아서 발생한 오류였다.

2. postgresql 연결
version 2.25.0 이상부터는 docker-compose.yml에서 version 라인을 없애야 동작한다.

3. 잡다한 오류들
enable annotaion processing
SQL Warning Code: 0, SQLState: 00000
build and Run using Intellij 등..

<br>


### 6. 공부해야 할 것
1. 도커 사용법
2. JPA + 스프링부트 동작 방식
3. 관계형 DB
4. Service, DTO, Controller 등을 어떻게 연결해야 하는가?

<br>

확인이 필요한 부분: FinancialStatement 의 year 변수
DTO 저렇게 쓰는 거 맞는지
Service에 비즈니스 로직 쓸건지



잠자기 직전에 <a href="https://velog.io/@thovy/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8%EC%99%80-AWS%EB%A1%9C-%ED%98%BC%EC%9E%90-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EC%9B%B9%EC%84%9C%EB%B9%84%EC%8A%A4-%EB%94%B0%EB%9D%BC%ED%95%98%EA%B8%B0-7">좋은 레퍼런스</a> 사이트를 발견했다,..... 내일 봐야겠다.


