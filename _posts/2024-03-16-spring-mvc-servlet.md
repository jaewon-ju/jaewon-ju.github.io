---
title: "[Spring MVC] Servlet"
description: "Servlet에 대해 자세히 알아보자."
date: 2024-03-16T08:18:29.713Z
tags: ["MVC","Spring"]
slug: "Spring-MVC-Servlet"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:51.994Z
  hash: "4e06f2a1b4f93b8f6b56cea3d52cdda249e75dc20746e9381bb29dfb62f4c0f6"
---


<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard">스프링 MVC</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ Servlet
<a href= "https://velog.io/@jaewon-ju/Spring-MVC-Web-Application-Server">이전 포스트</a>에서 Servlet에 대해서 간단하게 알아봤다.

>Servlet이란 Java를 사용한 동적 웹 페이지 제작 기술이며, 클라이언트의 요청을 쉽게 처리할 수 있는 환경을 제공한다.


<br>

### ■ 스프링부트 서블릿 환경 구성
>스프링부트 없이 서블릿을 사용하는 것도 가능하다.
톰캣 같은 WAS를 설치하고, 그 위에 서블릿 코드를 클래스 파일로 빌드해서 올리면 된다.<br>
하지만, 스프링부트는 톰캣 서버를 내장하고 있으므로 더 편리하게 서블릿 환경을 구성할 수 있다.

스프링부트에서 서블릿을 사용하기 위해서는 ```@ServletComponentScan``` 어노테이션을 ```main()``` 메소드를 가진 클래스에 붙여줘야 한다.

```@ServletComponentScan``` 어노테이션은 ```@WebServlet``` 이 붙은 서블릿 클래스들을 자동으로  등록한다.
<br>

### ■ 서블릿 등록

| 클래스를 서블릿으로 등록하기 위해 필요한 요소 |
| - | 
| ```@WebServlet``` 어노테이션 |  
| HttpServlet 을 상속해야함 |  
| service 메소드를 오버라이드 해야 함 |  


다음과 같이 ```BasicServlet``` 클래스를 서블릿으로 등록할 수 있다.
```java
@WebServlet(name = "basicServlet", urlPatterns = "/basic")
public class BasicServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Servlet test");
    }
}
```
<br>

서버의 /basic 리소스에 요청이 오면, 자동으로 ```service()``` 메소드가 실행된다.


<br>

---

<br>


## ✏️ HttpServletRequest
```service()``` 메소드의 파라미터로 ```HttpServletRequest``` 타입의 변수가 존재한다.

> ```HttpServletRequest```는 HTTP 요청 메시지를 편리하게 사용할 수 있도록 HTTP 요청 메시지를 파싱하고, 결과를 ```HttpServletRequest``` 타입의 객체(request)에 담아서 제공한다.


<br>

```
HTTP 요청 메시지

POST /basic HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

title=myPost&name=Ju
```

위의 요청 메시지가 들어오면, ```HttpServletRequest``` 객체는 메시지를 파싱해서 개발자가 다음과 같은 기능들을 사용할 수 있도록 제공한다.

| 구분 | detail |
| - | - |
| Start Line | HTTP Method, URL, Query String, Scheme 조회 |
| Header | 헤더 조회 |
| Body | form 파라미터 형식 조회, Body의 데이터 조회|

<br>

### ■ 기본 사용법

1. Start-Line 정보 가져오기
```java
@Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {

        // Start-Line Parsing
        System.out.println("request.getMethod() = " + request.getMethod());
        System.out.println("request.getProtocol() = " + request.getProtocol());
        System.out.println("request.getScheme() = " + request.getScheme());
        System.out.println("request.getRequestURL() = " + request.getRequestURL());
        System.out.println("request.getRequestURI() = " + request.getRequestURI());
        System.out.println("request.getQueryString() = " + request.getQueryString());
        System.out.println("request.isSecure() = " + request.isSecure());
```

<br>

2. Header 전체 가져오기

```java
        // Header Parsing
        request.getHeaderNames().asIterator().forEachRemaining(
        	headerName -> System.out.println("headerName = " + request.getHeader(headerName)));
            
        /*
        참고로 forEachReaming은 다음과 같이 생겼다.
        
        default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
        }

        action.accept가 람다식으로 표현되어 있고, 인수인 next()가 headerName 파라미터로 들어간다.
         */

```

<br>

3. Header 요소 각각 가져오기
```java
        // Header Parsing - detail
        System.out.println("request.getServerName() = " + request.getServerName());
        
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println(cookie.getName() + ": " + cookie.getValue());
            } 
        }
        
        System.out.println("request.getContentType() = " + request.getContentType());
        System.out.println("request.getContentLength() = " + request.getContentLength());
        System.out.println("request.getCharacterEncoding() = " + request.getCharacterEncoding());
    }
```

<br>

---

<br>


## ✏️ 요청 데이터 처리

요청 메시지는 다음과 같이 3종류가 존재한다.

#### 1. GET - 쿼리 파라미터
메시지 바디 없이, URL의 쿼리 파라미터에 데이터를 포함해서 전달한다.
```
GET /goods?product=speaker&count=1 HTTP/1.1
Host: localhost:8080
```
<br>

#### 2. POST - HTML Form
메시지 바디에 쿼리 파라미터 형식으로 데이터를 전달한다.

```
POST /goods HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

product=speaker&count=1
```

#### 3. HTTP Message Body
HTTP Message Body에 직접 데이터를 담아서 전달한다.

```
POST /goods HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{"product": "speaker", "count": 1}
```

<br>

### ■ 쿼리 파라미터로 받은 데이터 처리
쿼리 파라미터를 조회하는 4가지 메소드가 존재한다.

```java
String product = request.getParameter("product");
// 특정 파라미터 하나 조회
```


```java
Enumeration<String> parameterNames = request.getParameterNames();
// 모든 파라미터의 이름 조회

request.getParameterNames().asIterator().forEachRemaining(람다식);
// 이 패턴으로 더 많이 사용한다.
```


```java
Map<String, String[]> parameterMap = request.getParameterMap();
// Key, Value 형태로 모든 파라미터 조회
// Value는 중복될 수 있다
```


```java
String[] products = request.getParameterValues("product")
// 파라미터 value에 중복이 존재하는 경우, 하나의 키 값에 해당되는 모든 value를 조회
```

<br>

실제 코드로 더 자세히 알아보자.

```java
@WebServlet(name="parameterHandlingServlet", urlPatterns = "/goods")
public class ParameterHandlingServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
            
        String product = request.getParameter("product");
        System.out.println("product = " + product);
        // product 파라미터의 값 조회

        request.getParameterNames().asIterator().forEachRemaining(paramName -> System.out.println("paramName = " + paramName));
        // 모든 파라미터 이름 조회

        String[] products = request.getParameterValues("product");
        for(String productName : products) {
            System.out.println("product = " + productName);
        }
        // product 파라미터에 값이 중복되는 경우 모두 조회
    }
}
```
<br>

### ■ HTML Form으로 받은 데이터 처리
POST의 HTML Form을 전송하면, 웹 브라우저는 다음 형식으로 HTTP 메시지를 작성한다.
```
action="/formServlet" 인 경우

POST /formServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

product=speaker&count=1
```

- ```Content-Type: application/x-www-form-urlencoded```
- ```product=speaker&count=1```

위의 두 포인트를 잘 기억하자.
<br>

메시지 Body의 ```product=speaker&count=1```는 GET 쿼리 파라미터로 작성한 요청 메시지와 동일한 형태이다.
∴ 똑같은 조회 메소드를 사용할 수 있다.

<br>

### ■ Message Body로 받은 데이터 처리
Message Body로 받은 데이터를 ```request.getInputStream```을 사용해서 직접 읽을 수 있다.

```java
ServletInputStream inputStream = request.getInputStream();
String wholeBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
System.out.println("wholeBody = " + wholeBody);
```

<br>

Message Body로 데이터를 보내는 경우, 대부분 JSON 형식을 사용한다.
<span style="color:red">JSON도 결국은 텍스트일 뿐이다!!</span>

SpringBoot에서 제공하는 ObjcetMapper 클래스를 사용해서, 텍스트 형식의 JSON을 파싱해서 객체로 변환할 수 있다.
```java
@Getter @Setter
public class JsonData {
    private String product;
    private int count;
}
```

```java
private ObjectMapper objectMapper = new ObjectMapper();
// SpringBoot가 제공하는 JSON을 객체로 변환하기 위한 클래스

@Override
protected void service(HttpServletRequest request, 
		HttpServletResponse response) throws ServletException, IOException {
        
    ServletInputStream inputStream = request.getInputStream();
    String wholeBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
	// Message Body의 텍스트를 단순히 읽어옴


    JsonData jsonData = objectMapper.readValue(wholeBody, JsonData.class);
    System.out.println("jsonData.getProduct() = " + jsonData.getProduct());
    System.out.println("jsonData.getCount() = " + jsonData.getCount());
}
```

<br>

---

<br>


## ✏️ HTTPServletResponse
```service()``` 메소드의 파라미터로 ```HttpServletResponse``` 타입의 변수가 존재한다.

>```HttpServletResponse```는 HTTP 응답 메시지를 편하게 작성할 수 있도록 돕는다.

```HTTPServletResponse``` 타입 ```response``` 객체를 사용하여 응답 메시지의 정보를 컨트롤 하거나 클라이언트에게 전달할 데이터를 설정할 수 있다.

<br>

### ■ Status-Line
응답 메시지의 상태 코드를 설정할 수 있다.
```java
response.setStatus(HTTPServletResponse.SC_OK);
// HTTPServletResponse.SC_OK를 200으로 써도 무방하다. 하지만, 가독성을 위해 저렇게 하는 것이 좋다.
```

<br>

### ■ Header
응답 메시지의 헤더 정보를 조작할 수 있다.
- Content-Type
- Cache-Control
- Pragma
- Location
```java
response.setHeader("Content-Type", "text/plain;charset=utf-8");

// 또는 다음과 같이 설정할 수도 있다.
response.setContentType("text/plain"); 
response.setCharacterEncoding("utf-8");
```

```java
response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
response.setHeader("Pragma", "no-cache");
```

```java
response.setStatus(HttpServletResponse.SC_FOUND); // 302
response.setHeader("Location", "/redirect.html");

// 또는 다음과 같이 설정할 수도 있다.
response.sendRedirect("/redirect.html");
```
<br>

### ■ Message Body
클라이언트에게 전달할 메시지를 설정할 수 있다!
- 단순 텍스트 응답


```java
@WebServlet(name = "httpResponseServlet", urlPatterns = "/response")
public class HttpResponseServlet extends HttpServlet {

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
            
        PrintWriter writer = response.getWriter();

        writer.println("Response with simple Text");
 ```
 단순 텍스트 응답은 ```PrintWriter```의 인스턴스를 사용한다.
 ```PrintWriter```에 프린트 하면 자동으로 클라이언트에게 텍스트 형식으로 전달된다.
 
<br>

- HTML 응답

```java
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        // SetContentType 지정 필수

        writer.println("<html>");
        writer.println("<body>");
        writer.println(" <div>Response with HTML</div>");
        writer.println("</body>");
        writer.println("</html>");
```
HTML 응답도 마찬가지로 ```PrintWriter```의 인스턴스를 사용한다.
HTML의 태그를 일일이 ```println```으로 작성해야 한다는 단점이 존재한다.

<br>

- json 응답
```java
        response.setHeader("content-type", "application/json");
        // json은 utf-8 형식을 사용하도록 정의되어 있어서 characterEncoding을 지정할 필요 없다.

        JsonData jsonData = new JsonData();
        jsonData.setProduct("Speaker");
        jsonData.setCount(1);

        String result = objectMapper.writeValueAsString(jsonData);

        response.getWriter().write(result);
    }
}
```
【 json 형식의 텍스트 】 ➜ 【 객체 】로 변환할 때 쓰였던 ```ObjectMapper``` 클래스를 다시 사용한다.
```obejctMapper.writeValueAsString(객체)```를 사용하면 【 객체 】 ➜ 【 json 형식의 텍스트 】 로 바꿔준다.

<br>

---

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard">스프링 MVC 1편 - 김영한 개발자님</a>