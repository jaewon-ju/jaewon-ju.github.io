---
title: "[Spring Boot] 외부 설정과 프로필"
description: "스프링 부트의 외부 설정에 대해서"
date: 2024-05-03T06:37:49.124Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-외부-설정과-프로필"
series:
  id: f3e01f5b-65b1-4f04-94dc-3fb49b49d1a7
  name: "Spring Boot"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.144Z
  hash: "b72d4faeffeb2e6f7f6bd411ad9f831a1a7e134924ad8a770a53f071d5ab7462"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---

## ✏️ 외부 설정이란?
하나의 애플리케이션을 여러 다른 환경에서 사용해야 할 때가 있다.

예를 들어, 현재 개발중인 【 주식 분석 어플리케이션 】 에서는 다음 두 가지의 환경이 존재할 수 있다.

- 개발 환경: 개발 서버, 개발 DB 사용
- 운영 환경: 운영 서버, 운영 DB 사용

<br>

> #### <문제>
개발 DB에 접근하려면 ```dev.db.com``` 에 접속해야 하고,
운영 DB에 접근하려면 ```prod.db.com```에 접속해야 한다.

위의 문제를 해결하려면 어떻게 해야될까?

1. 개발용, 운영용 코드를 각각 빌드한다.
   - 이 경우, 검증 문제가 발생할 수도 있고 유연성도 떨어진다.
   
2. 설정 값(db URL)을 실행 시점에 주입한다.
   - 빌드도 한번만 하면 되고, 새로운 환경이 추가되어도 유연하게 대처할 수 있다.
 
<br>

2번 해결책과 같이, 실행 시점에 설정값을 주입하는 방법을 <span style = "background-color: lightgreen; color:black">외부 설정</span>이라 한다.

<br>

### ■ 외부 설정 방법
외부 설정은 일반적으로 다음 4가지 방법이 존재한다.

1. OS 환경 변수
2. 자바 시스템 속성
3. 자바 커맨드 라인 인수
4. 외부 파일

<br>

---

<br>

## ✏️ OS 환경 변수
>OS 환경 변수는 해당 OS를 사용하는 <span style = "color:red">모든 프로그램</span>에서 읽을 수 있는 설정값이다.

애플리케이션에서 OS 환경 변수를 읽을 때는 다음과 같은 메소드를 사용한다.
- ```System.getenv()```: OS 환경 변수를 Map으로 조회
- ```System.getenv(key)```: OS 환경 변수의 값을 String으로 조회

```java
@Slf4j
public class externalSet{
	public static void main(String[] args){
    
    	Map<String, String> envMap = System.getenv();
        for(String key : envMap.keySet()){
        	// 환경 변수 사용
        }
        
    }
}
```
<br>

OS 환경변수는 <span style = "color:red">모든 프로그램</span>에서 접근할 수 있다는 장점이자 단점을 가지고 있다.


<br>

---

<br>

## ✏️ 자바 시스템 속성
> 자바 시스템 속성은 <span style = "color:red">실행한 JVM</span> 안에서 접근 가능한 외부 설정이다.

자바 시스템 속성은 다음과 같이 자바 프로그램을 실행할 때, ```-D``` 옵션을 통해 설정한다.

- ```java -Durl=dev.db.com -jar myApplication.jar```
- 반드시 ```-D``` 옵션이 ```-jar``` 옵션보다 먼저 와야 한다.

<br>

어플리케이션에서 해당 속성을 사용하려면, 다음과 같은 메소드를 사용한다.
- ```System.getProperties()```: 자바 시스템 속성을 ```Properties``` 클래스로 반환
- ```System.getProperties(key)```: 특정 속성 값을 조회

```java
@Slf4j
public class externalSet{
	public static void main(String[] args){
    
    	Properties properties = System.getProperties();
        for(Object key : properties.keySet()){
        	// 시스템 속성 사용
        }
        
    }
}
```

<br>

---

<br>

## ✏️ 커맨드 라인 인수
> 커맨드 라인 인수는 애플리케이션 실행 시점에, 외부 설정 값을 ```main()``` 메소드의 파라미터로 넘기는 외부 설정이 방법이다.

커맨드 라인 인수는 다음과 같이 자바 프로그램을 실행할 때, 파라미터로 넘겨준다.

- ```java -jar myApplication.jar url=dev.db.com```

주의해야 할 점은, ```url=dev.db.com```이 단어 1개로 처리된다는 것이다.
➜ <span style = "color:red">Key=Value로 파싱하는 것은 개발자가 직접 해야한다.</span>

<br>

```java
@Slf4j
public class externalSet{
	public static void main(String[] args){
        for(String arg : args) {
        	// 커맨드 라인 인수 사용
        }
    }
}
```

<br>

### ■ 커맨드 라인 옵션 인수
>커맨드 라인 인수를 ```Key=Value``` 형식으로 파싱해주는 <span style = "background-color: lightgreen; color:black">스프링</span>만의 표준 방식이다.

- ```--key=value``` 형식으로 사용한다.
- ```java -jar myApplication.jar --url=dev.db.com```
- 해당 인수는 ```DefaultApplicationArguments``` 클래스를 통해 파싱할 수 있다.
<br>

```java
@Slf4j
public class externalSet{
	public static void main(String[] args){
		ApplicationArguments appArgs = new DefaultApplicationArguments(args);
        
        List<String> url = appArgs.getOptionValues("url");
        // --url=dev.db.com 을 자동으로 파싱한다.
        // 하나의 키에 여러 값을 포함할 수 있기 때문에 List로 반환한다.
    }
}
```

커맨드 라인 옵션 인수는 자바의 표준 기능이 아니라, 스프링의 편의 기능임을 기억하자!


<br>

---

<br>

## ✏️ 통합
위에서 알아본 3가지 방법을 떠올려 보자.

1. OS 환경변수
2. 자바 시스템 속성
3. 커맨드 라인 인수

위의 방법들은 모두 ```key=value```로 외부 설정을 가져온다.
```key=value```를 사용한다는 것을 같지만, <span style = "color:red">사용하는 메소드</span>는 각각 다르다!
➜ 불편해

<br>

이러한 불편함을 해결하기 위해, 스프링은 ```Environment```라는 인터페이스로 모든 설정 정보를 조회할 수 있는 기능을 제공한다.

> 1. OS 환경변수
➜ ```ResourcePropertySource``` 클래스에 저장
2. 자바 시스템 속성
➜ ```SystemEnvironmentPropertySource``` 클래스에 저장
3. 커맨드 라인 옵션 인수
➜ ```CommandLinePropertySource```  클래스에 저장
<br>
```Environment``` 인터페이스로 각 클래스에 접근해서 ```key=value``` 방식으로 외부 설정을 조회할 수 있다.

이후에 배울 【 외부 파일 】 방식에도 똑같이 적용가능하다.

<br>

```java
@Slf4j
@RequiredArgsConstructor
@Component
public class testClass {
    
    private final Environment env;
    
    @PostConstruct
    public void init() {
        String url = env.getProperty("url");
        log.info("env url={}", url);
    } 
}

// OS, 커맨드 라인, 시스템 설정, 외부 파일 등 어떤 방식을 사용하더라도 Environment로  조회 가능
```



<br>

---

<br>

## ✏️ 외부 파일
앞서 배운 방법들은, 설정하는 ```key=value``` 값들이 늘어날수록 사용하기 불편해진다.
➜ 설정들을 외부 파일로 분리한 다음, 애플리케이션 로딩 시점에 해당 파일을 읽어오는 방식을 사용한다.

<br>

> #### 개발서버 application.properties 파일
```
url = dev.db.com
```

> #### 운영 서버 application.properties 파일
```
url = prod.db.com
```

- 각 서버에서 위와 같이 ```application.properties``` 파일을 생성한 뒤, 똑같은 key(url) 값에 다른 value를 넣어놓는다.
- 해당 파일을 빌드된 jar 파일 ```myApplication.jar```과 동일한 위치에 놓는다.

- 애플리케이션을 실행한 뒤에 ```application.properties```를 읽는다.
- ```Environment``` 인터페이스를 사용한다.

<br>

#### 단점
1. 외부 설정 파일 자체를 관리하기가 번거롭다
2. 설정 값의 변경 이력을 확인하기 어렵다.

<br>

### ■ 내부 파일
설정 파일을 외부에서 관리하는 것은 상당히 번거롭다.
➜ 설정 파일 자체를 프로젝트 내부에 포함해서 빌드한다.

```main/resources```에 다음 파일을 추가한다.

> #### application-dev.properties 파일
```
url = dev.db.com
```

> #### application-prod.properties 파일
```
url = prod.db.com
```

애플리케이션 실행 시점에 내부에서 설정 파일을 선택한다.

<br>

<span style = "color:red">⚠️</span> 대신, 외부에서 개발 환경인지, 운영 환경인지는 프로필을 통해 알려줘야 한다.
ex) dev 프로필이 넘어오면 ```application-dev.properties```를 설정 정보로 사용

프로필은 다음과 같은 방법으로 애플리케이션에 넘길 수 있다.
- ```--spring.profiles.active=dev```
- ```-Dspring.profiles.active=prod```

<br>

### ■ 내부 통합 파일
내부 설정 파일을 하나의 물리적인 파일로 통합할 수 있다.

> #### application.properties 파일
```
url = local.db.com
#---
spring.config.active.on-profile=dev
url = dev.db.com
#---
spring.config.active.on-profile=prod
url = prod.db.com
```

- ```#---``` 을 사용해서 논리적으로 파일을 분리할 수 있다.
   - ```!---```도 가능하다.
   - yml 파일에서는 ```---```로 분리한다.
<br>   
- 프로필을 지정하지 않으면 ```default``` 라는 이름의 프로필이 활성화 된다.
   - ```spring.config.active.on-profile```를 지정하지 않으면 ```default``` 프로필로 인식된다.


<br>

---

<br>


## ✏️ 우선순위
아래로 갈수록 우선순위가 높다.

1. 설정 데이터(```application.properties```)
2. OS 환경변수
3. 자바 시스템 속성
4. 커맨드 라인 옵션 인수
5. ```@TestPropertySource```

<br>

설정 데이터 내부에서는 다음과 같이 우선순위가 적용된다.

1. jar 내부 ```application.properties```
2. jar 내부 프로필 적용 파일 ```application-{profile}.properties```
3. jar 외부 ```application.properties```
4. jar 외부 프로필 적용 파일 ```application-{profile}.properties```

<br>

> #### 우선순위의 규칙
1. 더 유연한 것이 우선권을 가진다.
2. 범위가 좁은 것이 우선권을 가진다.

<br>

---

<br>



## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용, 김영한 개발자님</a>
