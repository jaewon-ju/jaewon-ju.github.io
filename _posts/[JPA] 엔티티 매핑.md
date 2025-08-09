---
title: "[JPA] 엔티티 매핑"
description: "엔티티를 테이블에 매핑하는 방식에 대해서"
date: 2024-06-30T10:01:32.598Z
tags: ["JPA"]
slug: "JPA-엔티티-매핑"
series:
  id: f3e01f5b-65b1-4f04-94dc-3fb49b49d1a7
  name: "Spring Boot"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:33.446Z
  hash: "0df70d897985be00646f04d8a295f9a1dd364d366d62dba0a6225439dfc1f50f"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/ORM-JPA-Basic">JPA 프로그래밍</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ 엔티티 매핑
실제로 필자가 프로젝트에서 사용했던 코드를 바탕으로 엔티티 매핑 방식을 알아보자.

```java
@Table(name = "education_content")
@Entity
public class EducationContent {
    @Id
    @Column(name = "content_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long contentId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String contents;

	@ManyToOne
    @JoinColumn(name = "menu_id", referencedColumnName = "menu_id")
    Menu menu;
    
    @OneToMany(mappedBy = "educationContent")
    List<Issue> issueList = new ArrayList<>();
    
    ...
}
```

위의 엔티티는 ```education_content``` 라는 테이블에 매핑된다.

- 엔티티로 등록하기 위해서는 ```@Entity``` 어노테이션을 클래스에 붙여야 한다.
- <span style = "color:red">⚠️</span> 기본 생성자 필수
- <span style = "color:red">⚠️</span> final, enum, interface, inner 클래스 사용이 불가능하다.

<br>

### ■ DDL 생성 기능
DDL(Data Definition Language)은 애플리키에션 실행 시점에 자동으로 생성된다.
즉, 테이블 생성 쿼리는 실행 시점에 자동으로 생성된다.

- ```@Column``` 어노테이션을 사용해서 제약조건을 추가할 수 있다.
ex) ```@Column(nullable = false, length = 10)```
- ```@Table``` 어노테이션의 옵션을 통해 유니크 제약조건을 추가할 수 있다.




<br>

---

<br>

## ✏️ 필드와 컬럼 매핑

| 어노테이션 | 기능 |
| - | - |
| @Column | 컬럼 매핑 |
| @Temporal | 날짜 타입 매핑 - java8에서는 생략 가능(LocalDate, LocalDateTime 타입 사용) |
| @Enumerated | enum 타입 매핑 |
| @Lob | BLOB, CLOB 매핑 |
| @Transient | 특정 필드를 컬럼에 매핑하지 않음 |

<br>

### ■ @Column 의 속성
```@Column```에는 다양한 속성이 존재한다.

- ```name```: 필드명과 DB 컬럼명을 다르게 설정
- ```updatable```: update 쿼리가 나갈 때 해당 컬럼을 반영할 것인지 여부
- ```nullable```: NULL 값이 들어가도 되는지 여부
- ```length```: 문자 길이 제약 조건

<br>

### ■ @Enumerated 의 속성
```@Enumerated``` 에는 단 두가지 속성만 존재한다.
DB에는 Enumerate Type이 없음에 주의해야 한다!

- ```EnumType.ORDINAL```: enum <span style = "background-color: lightgreen; color:black">순서</span>를 DB에 저장 - 기본값
- ```EnumType.STRING```: enum <span style = "background-color: lightgreen; color:black">이름</span>을 DB에 저장

<br>

<span style ="color:red">⚠️</span> ```EnumType.ORDINAL``` 속성을 사용하면 안된다!!
새로운 Enum Type이 추가될 수 있기 때문에, 순서가 변경될 가능성이 있다.




<br>

---

<br>

## ✏️ 기본키 매핑
기본키를 매핑할 때는 ```@Id``` 어노테이션을 사용한다.
코드를 살펴보자.

```java
@Table(name = "education_content")
@Entity
public class EducationContent {
    @Id
    @Column(name = "content_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long contentId;
    
    ...
}
```

<br>

기본키를 매핑할 때, ```@GeneratedValue```라는 어노테이션을 사용할 수 있다.
> #### ```@GeneratedValue```
: 기본키를 직접 할당하지 않고 자동으로 생성되도록 만드는 어노테이션

자동 생성 전략은 총 4가지가 존재한다.

<br>

### 1. IDENTITY
기본키 생성을 DB에 위임한다.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
Long contentId;
```
<br>

이 전략을 사용하면, ```em.persist()``` 시점에 즉시 INSERT 쿼리를 실행한다.
➜ 그래야 기본키를 알 수 있기 때문이다.

<br>

### 2. SEQUENCE
DB 시퀀스 오브젝트를 사용해서 기본키를 자동 생성한다.

```java
@Entity
@SequenceGenerator(
	name = "EDUCATION_SEQ_GEN",
    sequenceName = "EDUCATION_SEQ",
    initalValue = 1,
    allocationSize = 1
)
public class EducationContent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE
    				generator = "EDUCATION_SEQ_GEN)
    Long contentId;
    
    ...
}
```

<br>

```em.persist()``` 시점에 DB 시퀀스를 사용해서 식별자를 조회한다.

<span style ="color:red">⚠️</span> allocationSize의 기본값은 50이기 때문에, DB 시퀀스가 하나씩 증가하도록 설정되어 있다면 allocationSize 값도 1로 맞춰줘야 한다.


<br>

### 3. TABLE
키 생성용 테이블을 사용한다.

- 모든 DB에 적용가능
- 성능이 나쁘다


<br>

### 4. AUTO
방언에 따라 위의 3가지 방법 중 하나를 자동으로 지정한다.





<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA 프로그래밍 - 김영한 개발자님</a>