---
title: "[Spring Boot] Before Spring Boot"
description: "Spring Boot가 없던 시절, 웹 애플리케이션을 어떻게 만들었을까?"
date: 2024-04-01T11:43:40.706Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-Before-Spring-Boot"
series:
  id: f3e01f5b-65b1-4f04-94dc-3fb49b49d1a7
  name: "Spring Boot"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:05.115Z
  hash: "eed4782bfba589c2f347fa268ca6de45dd44448dadf3a8a38ece69957a034abc"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ Before Spring Boot
>Spring Boot가 나오기 전에는 어떻게 웹 애플리케이션을 개발했을까?

1. 톰캣 같은 WAS를 설치한다.
2. 개발한 웹 애플리케이션 코드를 WAR 형식으로 빌드해서 war 파일을 만든다.
3. war 파일을 WAS에 전달해서 배포한다. 

<br>

>그럼 Spring Boot를 사용하면 무엇이 좋아질까?

- Spring Boot는 톰캣을 내장하고 있다.
- 개발한 웹 애플리케이션 코드를 JAR 형식으로 빌드해서 실행하면 WAS도 함께 실행된다.
- 간편해졌다!!


<br>

---

<br>

## ✏️ 먼 옛날 방법
추상적으로 설명하니, Spring Boot를 사용하기 이전 방법이 그닥 어려워 보이지 않는다.
그럼 WAR 형식으로 빌드해서 WAS에 전달하는 옛날 방법을 한번 사용해보자.

<br>

그 전에, 웹 애플리케이션 서버의 동작 과정을 복습해보자.

1. ```localhost:8080/products```에 요청이 온다.
2. DispatcherServlet이 해당 요청을 받고 핸들러 어댑터에 전달한다.
3. 핸들러 어댑터는 핸들러로 요청을 처리하고 뷰로 보낸다.
4. 뷰는 클라이언트에게 응답한다.

Spring Boot를 사용하면 DispatcherServlet도 알아서 만들어주고, 스프링 빈으로 등록된 핸들러들까지 알아서 서블릿 컨테이너와 연결해준다.

Spring Boot를 사용하지 않으면, 이러한 작업을 개발자가 코드로 작성해서 WAR 파일로 만들어야 한다.

<br>



### ■ 초기화
>WAS를 실행하는 시점에 서블릿을 등록하고, 스프링 컨테이너를 만들고, 서블릿과 스프링을 연결하는 DispatcherServlet도 등록해야 한다.

먼저, 초기화를 해보자.
WAS에는 서블릿 컨테이너가 존재한다.


- WAS를 실행할때, ```ServletContainerInitializer``` 라는 인터페이스를 구현한 구현객체가 자동으로 실행된다. (```resources/META-INF/services/jakarta.servlet.ServletContainerInitializer``` 
이 경로에 구현객체를 등록 해야 한다. )

- ```ServletContainerInitializer```의 구현객체는 <span style = "background-color: lightgreen; color:black">서블릿 컨테이너를 초기화 한다.</span>
<span style = "color:red">서블릿 컨테이너를 초기화 했다고 해서, 서블릿들이 등록된 것은 아니다!</span>

- 서블릿을 등록하기 위해서는 ```ServletContainerInitializer```의 구현객체에서 ```AppInit```을 구현한 구현객체의 메소드를 실행해야 한다.

<br>


```java
// ServletContainerInitializer의 구현객체

@HandlesTypes(AppInit.class) // AppInit 인터페이스를 구현한 객체를 다룰 것이다.
public class MyInitializer implements ServletContainerInitializer {
	
    @Override
	public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
		for (Class<?> appInitClass c){
        	try{
            	AppInit appInit = (AppInit) appInitClass.getDeclaredConstructor().newInstance();
                appInit.onStartup(ctx);
                // AppInit 구현객체의 메소드 실행
                
            } catch (Exception e) {
            	throw new RuntimeException(e);
            }
        }    
    }    
}
```

- ```@HandlesTypes``` 어노테이션으로 애플리케이션 초기화 인터페이스(```AppInit```)를 지정해야 한다.

<br>

```java
// AppInit의 구현객체
// 서블릿 등록 및 서블릿에 리소스 할당
public class AppInitServlet implements AppInit {

     @Override
     public void onStartup(ServletContext servletContext) {
		ServletRegistration.Dynamic textServlet = 
        	servletContext.addServlet("TelloServlet", new TestServlet());
        testServlet.addMapping("/test-servlet");
	 } 
}
```



<br>

작동 방식은 다음과 같다.

1. WAS 실행
2. WAS는 서블릿 컨테이너 초기화 클래스(```MyInitializer```) 실행
3. ```MyInitializer```는 서블릿 컨테이너에 서블릿을 등록하는 클래스(```AppInitServlet```)를 실행한다.


![](https://velog.velcdn.com/images/jaewon-ju/post/b0075905-7c2c-4b7c-a72b-456f5ee7d0bc/image.png)

<br>

### ■ 스프링 컨테이너
이제, WAS 내부에 스프링 컨테이너를 만들고 서블릿 컨테이너와 연결해보자.

다음과 같은 과정이 필요하다.

1. 스프링 컨테이너 만들기
2. 스프링 MVC 컨트롤러(핸들러)를 빈으로 등록하기
3. 서블릿 컨테이너에 DispatcherServlet을 만들어서 스프링 빈(핸들러)과 연결하기
4. DispatcherServlet을 서블릿 컨테이너에 등록

1, 3, 4번 과정은 애플리케이션을 초기화하는 과정이다. 
따라서, ```AppInitServlet``` 객체에서 실행되어야 한다!
2번 빈 등록은 설정 정보 클래스에서 처리된다.

<br>

```java
// AppInitServlet 객체 내부 onStartup 메소드

// 1. 스프링 컨테이너 만들기
AnnotationConfigWebApplicationContext appContext
	= new AnnotationConfigWebApplicationContext();

// ------------------------------

// 2. 컨트롤러를 빈으로 등록하기
appContext.register(configClass.class); 
// configClass를 설정정보로 새로운 스프링 컨테이너를 만들었다.
// configClass에는 미리 만들어둔 핸들러 TestHander1, TestHandler2를 스프링 빈으로 저장하는 코드가 있다.
// ------------------------------
 
// 3. DispatcherServlet을 만들어서 스프링과 연결
DispatcherServlet dispatcher = new DispatcherServlet(appContext);
// ------------------------------

// 4. DispatcherServlet을 서블릿 컨테이너에 등록
ServletRegistration.Dynamic servlet = servletContext.addServlet("dispatcher",dispatcher);
// ------------------------------

servlet.addMapping("/test")
```

<br>

### ■ 스프링 MVC 활용
위의 과정을 통해, WAS가 실행될 때 서블릿을 등록하고 서블릿과 스프링 컨테이너가 연결되도록 설정했다.
스프링 MVC에서는 위의 과정을 조금 더 간단하게 만들 수 있다.
> 스프링 MVC를 사용하면 서블릿 컨테이너 초기화 코드를 작성하지 않아도 된다.
즉, MyInitializer를 구현하지 않아도 된다.

서블릿 컨테이너 초기화 코드는 스프링 MVC에서 작업해주므로, 개발자는 ```WebApplicationInitializer``` 라는 인터페이스의 구현객체에 <span style = "background-color: lightgreen; color:black">웹 애플리케이션 초기화 코드</span>만 작성하면 된다.

```java
// AppInit 클래스 대신 이걸 사용하면 된다.
public class AppInitSpringMVC implements WebApplicationInitializer { ... }
```

<br>

---

<br>


## ✏️ 조금 옛날 방법
먼 옛날에는 WAR 파일을 만들어서 WAS 위에 올려서 사용했다.
이 방법은 다음과 같은 단점이 존재한다.

- WAS를 별도로 설치해야 한다.
- 개발 환경 설정이 복잡하다.
- WAS의 버전을 변경하려면 재설치 해야한다.

위의 단점들을 해결하기 위해 고안한 것이 <span style = "background-color: lightgreen; color:black">내장 서버</span>이다.

<br>

### ■ 내장 서버
>내장 서버 방식은, 애플리케이션 JAR 안에 WAS를 라이브러리로 내장하는 방식이다.

- main 메소드를 실행할 때 서버 객체를 생성한다.
- main 메소드 안에서 스프링 컨테이너를 생성하고, DispatcherServlet을 생성해서 스프링 컨테이너와 연결하고, DispatcherServlet을 WAS와 연결한다.
- 일반 JAR 파일로 압축하면 오류가 발생한다!
<span style = "color:red">JAR 파일은 JAR 파일을 포함할 수 없다.</span>
따라서, 톰캣 같은 라이브러리 역할을 하는 JAR 파일을 포함할 수 없다.

<br>

그러면, Spring Boot는 어떻게 톰캣 서버를 내장해서 JAR 파일로 만들 수 있는걸까?

<br>

---

<br>


## ✏️ Spring Boot
Spring Boot는 새로운 JAR 파일을 정의해서 위의 문제를 해결했다.
또한, main 메소드 안에서 서버 객체를 생성하고 초기화 하는 등의 작업을 자동으로 해준다.

[start.spring.io](start.spring.io)에서 Spring Boot 프로젝트를 만들고 코드를 보자.

```java
 @SpringBootApplication
 public class BootApplication {
     public static void main(String[] args) {
         SpringApplication.run(BootApplication.class, args);
	}
}
```
<br>

```SpringApplication.run()``` 메소드는 

1. 톰캣 객체를 만들어서 연결

2. ```BootApplication``` 클래스를 설정정보로 스프링 컨테이너를 생성

3. DispatcherServlet을 생성해서 스프링 컨테이너와 연결

4. DispatcherServlet을 서블릿 컨테이너에 등록

의 과정을 거쳐서 웹 애플리케이션을 실행한다.

<br>

### ■ JAR
스프링 부트가 새로 정의한 JAR 파일의 구조를 살펴보자.

- META-INF 디렉토리 
    - MANIFEST.MF 파일
    
<br>

- BOOT-INF 디렉토리
    - classes 디렉토리
    - lib 디렉토리

>일반 JAR 파일과 다른점은 무엇일까?

JAR 파일을 실행하면 MANIFEST.MF 파일의 Main-Class를 읽어서 실행한다.
```Main-Class: org.springframework.boot.loader.JarLauncher```로 설정되어 있으므로 JarLauncher 클래스를 실행하는데, 이 클래스는 Spring Boot가 만든 클래스이다.

JarLauncher 클래스가 JAR 압축 파일 내부의 JAR 파일들을 읽어들이는 기능을 한다.


## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용 - 김영한 개발자님</a>