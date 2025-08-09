---
title: "[Spring Boot] 자동구성"
description: "스프링 부트의 핵심 기능중 하나인 자동 구성에 대해서 알아보자."
date: 2024-04-05T01:34:40.587Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-자동구성"
series:
  id: f3e01f5b-65b1-4f04-94dc-3fb49b49d1a7
  name: "Spring Boot"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.522Z
  hash: "222225757f260d12c51452a8de53db85cc57381631997933f61884c90d640ba4"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ 스프링 부트의 자동 구성
>스프링 부트는 자동 구성이라는 기능을 제공하는데, 일반적으로 자주 사용하는 스프링 빈들을 자동으로 등록해주는 기능이다.

- 스프링 부트는 ```spring-boot-autoconfigure```라는 프로젝트 안에서 자동 구성을 제공한다.

예를 들어, 스프링 부트는 ```JdbcTemplate```, ```DataSource```, ``` TransactionManager``` 등의 빈을 자동으로 등록한다.

스프링 부트가 제공하는 자동 구성 기능을 이해하려면, 두 가지 개념을 이해해야 한다.

1. ```@Conditional```
2. ```@AutoConfiguration```


<br>

---

<br>

## ✏️ @Conditional
```@Conditional``` 어노테이션은 특정 조건이 참일 때만 해당 빈이 등록되도록 제어한다.

- ```@Conditional(조건 클래스)```에서 조건 클래스가 참일 때 빈으로 등록된다.
- 조건 클래스는 ```Condition``` 인터페이스를 구현한 구현 클래스이어야 한다.
- ```Condition``` 인터페이스에는 ```boolean matches()``` 메소드가 존재한다.

```java
// Condition 인터페이스
public interface Condition {
	boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata);
}
```
```java
// 조건 클래스
public class MyCondition implements Condition {
	@Override
    boolean matches(ConditionContext context,AnnotatedTypeMetadata metadata) {
    	// 쉘에서 실행할 때 매개변수를 주면 context 변수로 들어온다.
        // ex) java -Dturn=on -jar myProject.jar
        String condition = context.getEnvironment().getProperty("turn");
        return "on".equals(condition);
    }
}
```
```java
// 설정 정보 클래스
@Configuration
@Conditional(MyCondition.class)
// MyCondition 클래스의 matches 리턴값이 true일 때만 이 클래스가 설정정보로 적용된다.
public class AppConfig{
	@Bean
    public MemoryRespository memoryRepository() {
    	return new MemoryRepository();
    }
}
```

<br>

### ■ ConditionalOnXxx
> 스프링은 ```Conditional```과 관련해서 개발자가 편리하게 사용할 수 있도록 ```ConditionalOnXxx```를 제공한다.

- ```ConditionalOnClass```
클래스가 존재하는 경우 동작한다.

- ```ConditionalOnBean```
빈으로 등록되어 있는 경우 동작한다.

- ```ConditionalOnProperty```
환경 정보가 있는 경우 동작한다.

- ```ConditionalOnResource```
리소스가 있는 경우 동작한다.

- ```ConditionalOnWebApplication```
웹 애플리케이션인 경우 동작한다.

<br>

---

<br>

## ✏️ AutoConfiguration
외부 라이브러리를 사용해서 웹 애플리케이션을 개발한다고 가정해보자.
외부 라이브러리에는 다양한 클래스가 존재하고, 그 중에서 필요한 클래스들을 스프링 빈으로 등록해야할 것이다.


```java
// 예를 들어 게시판 라이브러리를 가져왔다고 해보자.

@Configuration
public class AppConfig(){
	@Bean
    public Board board(){
    	return new Board();
    }
    
    @Bean
    public PostRepository postRepository(){
    	return new PostRepository();
    }
}
```

>#### 라이브러리 적용 방법
위의 게시판 라이브러리를 빌드해서 ```board.jar``` 파일을 만들었다고 가정해보자.
- 라이브러리를 적용할 프로젝트에서 ```libs``` 폴더를 생성한 뒤에 ```board.jar``` 파일을 붙여넣는다.
- 프로젝트의 ```build.gradle```에 ```implementation files('libs/board.jar')``` 코드를 추가한다.


- 개발자는 해당 프로젝트에 필요한 클래스들을 라이브러리 파일에서 찾아서 설정정보 등록해야 한다.
- 라이브러리가 복잡해지면 이러한 작업은 매우 힘들어질 것이다.


<br>

### ■ 자동 구성 라이브러리
라이브러리를 사용할 고객들을 위해, 라이브러리를 추가만 하면 필요한 빈들이 자동으로 등록되도록 설정할 수 있다.

>이 때 필요한 것이 바로 ```@AutoConfiguration```이다.


```java
@AutoConfiguration
@ConditionalOnProperty(name = "board", havingValue = "on")
public class AppAutoConfig(){

	@Bean
    public Board board(){
    	return new Board();
    }
    
    @Bean
    public PostRepository postRepository(){
    	return new PostRepository();
    }
}
```

<br>

- ```@AutoConfiguration``` 어노테이션을 적용한 설정정보 클래스를 만든 뒤에, <span style = "background-color: lightgreen; color:black">자동 구성 대상</span>을 지정해줘야 한다.

- ```src/main/resources/META-INF/spring/``` 위치에
```org.springframework.boot.autoconfigure.AutoConfiguration.imports``` 파일을 추가한다.
- 해당 파일에 ```AppAutoConfig``` 를 지정해준다. (패키지도 포함해야 한다.)

<br>

이제 빈을 직접 등록할 필요 없이, 라이브러리만 땡겨오면 필요한 빈을 자동으로 등록해준다!

<br>

### ■ 동작 원리
- 스프링부트는 ```@SpringBootApplication``` 어노테이션에서 시작한다.
- ```@SpringBootApplication``` 안에는 ```@EnableAutoConfiguration```이 존재한다.
- ```@EnableAutoConfiguration```에는 ```@Import(AutoConfigurationImportSelector.class)``` 어노테이션이 존재한다.

```@Import``` 어노테이션은 스프링 설정 정보를 포함할 때 사용한다.
하지만! ```@Import```의 속성으로 들어가있는 ```AutoConfigurationImportSelector```는 설정정보가 아닌 selector 클래스이다.


<br>

>```@Import```에 설정 정보를 추가하는 방법은 2가지가 있다.<br>
1. ```@Import(설정정보 클래스)```
2. ```@Import(ImportSelector의 구현객체)```<br>
ImportSelector의 구현객체는 설정정보를 String 타입으로 반환한다.
즉, 설정 대상을 동적으로 선택할 수 있다.


스프링 부트는 ```@Import(AutoConfigurationImportSelector.class)``` 어노테이션을 통해, 다음 경로에 있는 파일을 읽어서 자동 구성으로 사용한다.
```src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports``` 


<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용 - 김영한 개발자님</a>
