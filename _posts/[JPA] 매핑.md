---
title: "[JPA] 매핑"
description: "다양한 Entity - Table 매핑 방법에 대해서"
date: 2024-06-30T12:41:11.026Z
tags: ["JPA"]
slug: "JPA-연관관계-매핑"
series:
  id: f3e01f5b-65b1-4f04-94dc-3fb49b49d1a7
  name: "Spring Boot"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:33.424Z
  hash: "405749ae47e63a3e78fdacefe1fe06a03d6b07f5ba8c50fed61ddbfa0bf6c03b"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/ORM-JPA-Basic">JPA 프로그래밍</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---

테이블은 외래키로 <span style = "color:red">Join</span>을 사용해서 연관된 테이블을 찾고, 객체는 <span style = "color:red">참조</span>를 사용해서 연관된 객체를 찾는다.

이러한 차이점을 해결하기 위해 연관관계 매핑을 사용한다.

<br>


## ✏️ 연관관계 매핑의 종류

1. N:1 (다대일) - ```@ManyToOne```
2. 1:N (일대다) - ```@OneToMany```
3. 1:1 (일대일) - ```@OneToOne```
4. N:M (다대다) - ```@ManyToMany```

<br>

<span style = "color:red">⚠️</span> 연관관계의 주인은 항상 외래 키를 가지고 있는 객체이다! (1:N 제외)
연관관계의 주인이 아니면, 단순히 조회만 가능하다.

<br>

---

<br>

## ✏️ N:1
```Issue```와 ```educationContent``` 클래스는 N:1 양방향 매핑이 되어있다.



```java
@Entity
public class Issue {
    @Id
    @Column(name = "issue_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long issueId;
    
    @ManyToOne
    @JoinColumn(name = "education_content_id", referencedColumnName = "content_id")
    EducationContent educationContent;
	
    ...
}
```

```java
@Entity
public class EducationContent {
    @Id
    @Column(name = "content_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long contentId;

    @OneToMany(mappedBy = "educationContent")
    List<Issue> issueList = new ArrayList<>();
    
    ...
}
```

- 만약 N:1 단방향 매핑이었다면, ```EducationContent``` 클래스에는 issueList 필드가 존재하지 않았을 것이다.


<br>

### ■ @JoinColumn
외래 키를 매핑할 때는 ```@JoinColumn``` 어노테이션을 사용한다.
위의 경우에는, 연관관계의 주인인 Issue 클래스의 필드에 ```@JoinColumn```을 적용했다.

```@JoinColumn```은 다양한 속성을 가지고 있다.

- ```name```: 매핑할 외래 키의 이름 설정

- ```referencedColumnNmae```: 외래 키가 참조하는 대상 테이블의 <span style = "color:red">컬럼명</span>
필드명이 아닌, 컬럼명임에 유의할 것
- ```foreignKey```: 외래 키 제약조건 지정

<br>

### ■ @OneToMany
1:N 단방향 관계를 매핑할 때 사용하는 어노테이션이다.

```@OneToMany``` 어노테이션의 속성은 다음과 같다.

- ```mappedBy```: 연관관계의 주인 <span style = "color:red">필드</span>를 선택한다.

- ```fetch```: 글로벌 페치 전략을 설정한다. - 기본값은 ```FetchType.LAZY```
- ```cascade```: 영속성 전이 기능 설정



<br>

---

<br>

## ✏️ 1:N
1:N 관계에서는 양방향 매핑이 존재하지 않는다!
단방향 매핑만 존재한다.

- 1:N 단방향 매핑은 엔티티가 관리하는 외래 키가 다른 테이블(N쪽 테이블)에 있다.
- 따라서, 연관관계 관리를 위해 추가로 UPDATE SQL을 실행해야 한다.
➜ 1:N 단방향 보다는 N:1 양방향을 사용하자!

<br>

---

<br>

## ✏️ 1:1
1:1 매핑의 경우, N:1 매핑처럼 외래 키가 있는 곳이 연관관계의 주인이다.

그럼 다음과 같은 2가지 경우가 발생할 수 있다.

> #### 1. 주 테이블에 외래 키가 있는 경우
- 주 객체에서 ```@JoinColumn``` 을 사용한다.
- 주 객체가 대상 객체의 참조를 가진다.
- <span style = "color:red">⚠️</span> 외래 키에 null을 허용하게 된다.

> #### 2. 대상 테이블에 외래 키가 있는 경우
- 대상 객체에서 ```@JoinColumn```을 사용한다.
- <span style = "color:red">⚠️</span> 지연 로딩이 불가능하다.

<br>

---

<br>

## ✏️ N:M
관계형 DB는 다대다 관계를 표현할 수 없다.
➜ 연결 테이블을 추가해서 1:N, N:1 관계로 풀어내야 한다.

하지만, 객체는 ```@ManyToMany``` 어노테이션을 사용해서 다대다 관계를 표현할 수 있다.

<br>

> #### ```@ManyToMany```는 실무에서 사용하면 안된다!
```@ManyToMany``` 를 사용하면 연결 테이블을 자동으로 만들어준다.
하지만, 연결 테이블이 단순한 연결 뿐만 아니라 추가적인 정보를 가질 수 있기 때문에 쿼리가 복잡해질 수 있다.

따라서, 관계형 DB가 N:M을 1:N, N:1 로 풀어내는 것처럼 ```@ManyToMany``` 을 ```@OneToMany```, ```@ManyToOne```으로 풀어내야 한다.

연결 테이블 전용 엔티티를 추가하여 위의 동작을 수행하면 된다.
 
<br>

---

<br>

## ✏️ 상속관계 매핑
관계형 DB에는 상속 관계가 존재하지 않는다.
하지만, 슈퍼타입 - 서브타입 관계가 객체의 상속이 유사하다.
따라서, 객체의 상속 구조와 슈퍼타입 - 서브타입 구조를 매핑할 수 있다.

상속 구조를 구현하기 위한 3가지 방법이 존재한다.

1. 조인 전략
2. 단일 테이블 전략
3. 구현 클래스마다 테이블 전략

<br>

### 1. 조인 전략
각 엔티티를 모두 테이블로 만들고, 부모의 기본키를 기본키+외래키로 사용한다.
조회할 때는 조인을 사용한다.
![](https://velog.velcdn.com/images/jaewon-ju/post/592f4af8-6b48-4564-92fb-1d5fd7bb31cc/image.png)

- 단, 테이블에는 타입 개념이 없으니 ```DTYPE``` 컬럼을 추가하여 각 서브타입을 구분해줘야 한다.
- ```@Inhereitance(strategy = InheritanceType.JOINED)```를 사용한다.
<br>


위와 같은 테이블 구조를 객체로 구현하려면, 다음과 같이 설계하면 된다.

```java
@Entity
@Inhereitance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn // 기본이 DTYPE
public abstract class Item{
	@Id
    @GeneratedValue
    private Long id;
    
    private String name;
    ...
}
```

```java
@Entity
@DiscriminatorValue("Switch")
public class Ipad extends Item{
	private String camera;
}
```


<br>

- 장점: 저장공간을 효율적으로 사용, 외래키 참조 무결성 제약조건 활용 가능
- 단점: 조회 쿼리가 복잡

<br>


### 2. 단일 테이블 전략
테이블을 하나만 사용하고, 자식 테이블은 DTYPE을 사용하여 구분하는 전략이다.

- ```@Inhereitance(strategy = InheritanceType.SINGLE_TABLE)```을 사용한다.
- 자식 테이블마다 컬럼이 다르기 때문에, null 값이 많다.

<br>

- 장점: 조회 쿼리가 단순하다.
- 단점: 자식 엔티티가 매핑한 컬럼은 모두 null을 허용해야 한다. 테이블이 크다.

<br>


### 3. 구현 클래스마다 테이블 전략
<span style = "color:red">⚠️</span> 사용하면 안된다!!
자식 테이블이 부모 테이블의 컬럼들을 포함하는 구조이다.

- ```@Inhereitance(strategy = InheritanceType.TABLE_PER_CLASS)``` 를 사용한다.
- 상속 개념이 없는 구조이다.

<br>

- 장점: not null 제약조건을 사용할 수 있다.
- 단점: 상속 개념이 없어서, 자식 테이블을 통합해서 쿼리하는 것이 힘들다.

<br>

---

<br>

## ✏️ @MappedSuperclass
위의 상속관계 매핑 방법들은 부모 & 자식 엔티티를 DB의 테이블과 매핑하였다.
```@MappedSuperclass``` 어노테이션을 사용하면 부모 클래스는 테이블에 매핑하지 않아도 된다.

- ```@MappedSuperclass``` 어노테이션을 사용한 클래스는 <span style = "color:red">엔티티가 아니다.</span>
- 따라서, 조회나 검색이 불가능하다.

<br>

예를 들어, ```Menu```와 ```Issue``` 테이블에 id, subject 라는 컬럼이 공통적으로 존재한다면, 다음과 같이 ```BaseEntity``` 클래스를 사용할 수 있다.

```java
@MappedSuperclass
public abstract class BaseEntity {
	@Id @GeneratedValue
    private Long id;
    
    private String subject;
}
```

```java
@Entity
public class Menu extends BaseEntity {
	// id와 subject 필드를 상속받는다.
    
    private String title;
    
    ...
}
```


<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/ORM-JPA-Basic">자바 ORM 표준 JPA 프로그래밍 - 김영한 개발자님</a>
