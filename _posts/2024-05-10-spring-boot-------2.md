---
title: "[Spring Boot] 외부 설정과 프로필 2"
description: "@Value, @ConfigurationProperties 등 외부 설정을 객체에 주입하는 방법을 알아보자."
date: 2024-05-10T05:33:26.084Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-외부-설정과-프로필-2"
categories: Spring Boot
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:12.998Z
  hash: "170ae6192f3ccc018cd056aa9f20a1087ccd835efd2a94f7788e1163833bb24c"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ 외부 설정과 스프링 빈
이전 포스트에서 배운 ```Environment``` 클래스로 외부 설정을 조회할 수 있다.

>외부 설정 자체를 하나의 스프링 빈으로 등록하면 더 편하게 사용할 수 있을 것이다!

외부 설정 자체를 하나의 클래스로 만들어서 사용하는 방법을 알아보자.
일단, 외부 설정을 주입받을 클래스 ```MySetting``` 클래스를 정의한다.

```java
@Slf4j
@Getter
public class MySetting {
	private String appKey;
    private String appSecretKey;
    private int maxConnection;
    private Duration timeout;
    
    public MySetting(String appKey, String appSecretKey, int maxConnection, Duration timeout) {
    	this.appKey = appKey;
        this.appSecretKey = appSecretKey;
        this.maxConnection = maxConnection;
        this.timeout = timeout;
    }
}
```

<br>

외부 설정은 ```application.properties``` 파일에 존재한다.
```java
my.app-key=thisIsAppkey
my.app-secret-key=thisIsAppSecretKey
my.etc.max-connection=1
my.etc.timeout=3000ms
```

<br>

이제 ```MySetting``` 클래스에 외부 설정을 주입하는 방법에 대해서 알아보자.

<br>

---

<br>

## ✏️ Environment
```Environment``` 클래스를 사용해서 외부설정을 ```MySetting``` 클래스에 주입할 수 있다.

- ```Environment``` 클래스를 스프링 빈으로 등록한다.
- ```Environment``` 클래스를 사용해서 외부 설정을 읽어온다.
- 읽어온 데이터를 ```MySetting``` 	클래스에 직접 주입한다.

```java
@Slf4j
@Configuration
public class MyConfig {
    private final Environment env;

    public MyConfig(Environment env){
        this.env = env;
    }

    @Bean
    public MySetting mySetting(){
        String appKey = env.getProperty("my.app-key");
        String appSecretKey = env.getProperty("my.app-secret-key");
        int maxConnection = env.getProperty("my.max-connection", Integer.class);
        Duration timeout = env.getProperty("my.timeout",Duration.class);

        return new MySetting(appKey,appSecretKey,maxConnection,timeout);
    }
}
```

<br>

추가로, Application에 ```@Import``` 어노테이션을 작성해야 한다.
```java
@Import(MyConfig.class)
@SpringBootApplication
public class MyApp{
	public static void main(String args[]){
    	SppringApplication.run(MyApp.class, args)
    }
}
```

<br>

### ■ 단점

1. ```Environment``` 로 주입받고, ```env.getProperty()```로 꺼내는 작업을 반복해야 한다.
2. ```env.getProperty()```로 받은 데이터를 각 타입에 맞게 파싱해야 하는 번거로움이 있다.

<br>

---

<br>

## ✏️ @Value
<a href="https://velog.io/@jaewon-ju/%EC%A3%BC%EC%8B%9D-%EB%B6%84%EC%84%9D-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-9%EC%9D%BC%EC%B0%A8">【 주식 분석 어플리케이션 】</a> 프로젝트를 진행할 때, ```@Value``` 어노테이션을 사용했었다.
```@Value``` 어노테이션을 사용해서 외부 설정 값인 app_key, app_secret_key 등을 주입받은 경험이 있다.
<br>

- ```@Value```도 내부에서는 ```Environment``` 클래스를 사용한다.
- ```@Value("${key}")```로 외부 설정을 주입받을 수 있다.

<br>

```java
@Slf4j
@Configuration
public class MyConfig {

	@Value("${my.app-key}")
    private String appKey;

    @Value("${my.app-secret-key}")
    String appSecretKey;

    @Value("${my.etc.max-connection}")
    int maxConnection;

    @Value("${my.etc.timeout}")
    Duration timeout;

    @Bean
    public MySetting mySetting(){
        return new MySetting(appKey, appSecretKey, maxConnection, timeout);
    }
}
```

- 파라미터에서 직접 주입받을 수도 있다.
- 주입받을 외부 설정이 없는 경우, Default 값을 설정할 수 있다.
   - ```@Value("${my.app-key:defaultAppKey}")```: app-key 설정 값이 없는 경우, defaultAppKey를 주입한다.


### ■ 단점
- ```@Value```를 하나하나 입력하는 부분이 번거롭다.

∴ 설정 데이터를 하나의 묶음으로 가져오는 방법을 고안해야 한다.

<br>

---

<br>

## ✏️ @ConfigurationProperties
### ■ Type-safe Configuration Properties
>외부 설정의 묶음을 <span style = "color:red">객체</span>로 변환하는 기능이다.

- 잘못된 타입이 입력되는 문제를 방지할 수 있다.
- 객체를 다양하게 활용할 수 있다.

```java
// 외부 설정으로부터 정보를 묶음으로 가져오는 MyProperties 클래스
// @ConfigurationProperties 어노테이션으로 묶음의 시작점을 표기해야 한다.

@Data
@ConfigurationProperties("my")
public class MyProperties {
    private String appKey;
    private String appSecretKey;
    private Etc etc = new Etc();

    @Data
    public static class Etc {
        private int maxConnection;
        private Duration timeout;
    }
}
```

- 기본 주입 방식은 자바빈 프로퍼티 방식이므로, <span style = "color:red">Getter, Setter</span>가 필요하다!

<br>

```MyProperties``` 클래스로 설정 정보를 묶음으로 가져온 다음, ```MySetting``` 클래스에 주입한다.

```java
@Slf4j
@EnableConfigurationProperties(MyProperties.class)
public class MyConfig {
    private final MyProperties properties;

    public MyConfig(MyProperties properties){
        this.properties = properties;
    }

    @Bean
    public MySetting mySetting(){
        return new MySetting(
                properties.getAppKey(),
                properties.getAppSecretKey(),
                properties.getEtc().getMaxConnection(),
                properties.getEtc().getTimeout()
        );
    }
}
```

- ```@EnableConfigurationProperties``` 어노테이션을 지정해야 한다.

<br>

### ■ 장점
- 타입을 잘못 입력하면 오류를 발생시켜준다.
   - ex) ```my-connection=hello```를 입력하면 오류 발생
- 외부 설정을 하나의 객체로 땡겨온다.

<br>

### ■ 주의할 점
```MyProperties``` 클래스는 Setter를 가지고 있다.
➜ 누군가 값을 변경할 수 있다.

- 외부 설정 값은 어플리케이션 내부에서 변경되어선 안된다!
- 따라서, Setter를 제거하고 생성자를 사용하는 방법이 존재한다.



<br>

---

<br>

## ✏️ YAML
> 스프링은 설정 데이터를 사용할 때, ```application.properties``` 뿐만 아니라 ```application.yml```이라는 형식도 지원한다.

__YAML(YAML Ain't Markup Language)__
: 사람이 읽기 좋은 데이터 구조

<br>

>#### Application.properties 예시
```java
spring.application.name=springmvc
my.app-key=thisIsAppkey
my.app-secret-key=thisIsAppSecretKey
my.etc.max-connection=1
my.etc.timeout=3000ms
```

<br>

위의 텍스트를 yml 파일로 바꾸면, 다음과 같이 읽기 좋은 데이터 구조로 만들 수 있다.

>#### Application.yml 예시
```java
spring:
  application:
    name: springmvc
my:
  app-key: thisIsAppkey
  app-secret-key: thisIsAppSecretKey
  etc:
    max-connection: 1
    timeout: 3000ms
```

- YAML은 공백으로 계층 구조를 만든다. 
   - 보통 2칸을 사용한다.
- 구분 기호로 : 를 사용한다.

<br>

---

<br>

## ✏️ @Profile
외부설정을 사용하면, 각 환경마다 설정 값을 다르게 적용시킬 수 있다.

> 만약, 환경마다 <span style = "color:red">각각 다른 빈</span>을 등록해야 한다면 어떻게 해야할까?

이럴 때는, ```@Profile``` 어노테이션을 사용하면 된다.

<br>

```java
@Slf4j
@Configuration
public class MyConfig {
	@Bean
    @Profile("default")
    public LocalDB localDB(){
    	return new LocalDB();
    }
    
    @Bean
    @Profile("prod")
    public ProdDB prodDB(){
    	return new ProdDB();
    }
}
```

실행 시점에 ```--spring.profile.active=prod``` 를 적용하면, prod 프로필이 활성화되고, ```prodDB``` 빈만 등록된다.

아무 프로필도 활성화하지 않으면, default 프로필이 활성화된다.

<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용, 김영한 개발자님</a>
