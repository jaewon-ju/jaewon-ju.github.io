---
title: "[Spring MVC] 응답 관련 기본 기능"
description: "Spring MVC의 응답 관련 기본 기능에 대해서 알아보자"
date: 2024-03-30T07:58:58.331Z
tags: ["MVC","Spring"]
slug: "Spring-MVC-응답-관련-기본-기능"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:05.187Z
  hash: "844d24bf7e22365f8b8bc99a8388a691dbfde7884df9475bf5c80903d268d7e4"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard">스프링 MVC</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ HTTP 응답의 종류
스프링에서 응답 데이터를 만드는 방법은 크게 3가지이다.

### 1. 정적 리소스
디렉토리에 존재하는 리소스를 그대로 전달한다.

- 스프링 부트는 다음 디렉토리에 있는 정적 리소스를 제공한다.
```/static```, ```/public```, ```resource```, ```/META-INF/resources```
<br>

### 2. 뷰 템플릿
뷰 템플릿을 거쳐서 HTML을 생성되고, 뷰가 응답을 만들어서 전달한다.
> #### 뷰 템플릿 VS 뷰
뷰 템플릿은 웹 페이지의 구조와 디자인을 정의하는 파일이다.
즉 new-form.jsp 파일 같이, HTML의 구조를 정의하고 있는 파일이다.<br>
뷰는 ```view.render()``` 메소드로 모델 데이터를 뷰 템플릿에 전달하여 최종 HTML 페이지를 생성하는 객체이다.<br>
뷰는 뷰 템플릿을 사용해서 HTML 페이지를 만들고 응답을 만들어서 클라이언트에 전송한다.

- 스프링 부트는 기본 뷰 템플릿 경로를 제공한다.
```src/main/resources/templates```

<br>

뷰 템플릿이 호출되는 경우는 3가지가 존재한다.

1. 핸들러에서 ```ModelAndView``` 객체를 반환하는 경우
```ModelAndView``` 객체에 저장된 뷰의 논리적 이름으로 뷰 리졸버를 통해 viewPath를 알아내고
해당 viewPath에 존재하는 뷰 템플릿을 호출한다.

2. 핸들러에서 String을 반환하는 경우
반환된 문자열을 뷰의 논리적 이름으로 판단하고, 뷰 리졸버로 viewPath를 알아내고
해당 viewPath에 존재하는 뷰 템플릿을 호출한다.

3. 핸들러에서 void를 반환하는 경우
요청 URL을 뷰의 논리적 이름으로 사용하는 방법이다. (권장 X)

<br>


### 3. HTTP 메시지
HTTP API를 제공하는 경우, HTML이 아니라 데이터를 응답으로 전달한다.

아래에서 더 자세히 알아보도록 하자.

<br>

---

<br>

## ✏️ HTTP 메시지
응답을 할 때, 정적 리소스나 동적 HTML을 제공하는 것이 아닌 HTTP 메시지를 전달하는 경우가 있다.
이 경우, <span style = "background-color: lightgreen; color:black">HTTP Message Body</span>에 JSON 같은 형식으로 데이터를 실어 보낸다.

> 물론, HTML이나 뷰 템플릿을 사용해도 HTTP Message Body에 HTML 데이터를 담아서 전달한다.
여기서 설명하는 것은, HTML이나 뷰 템플릿을 거치지 않고 바로 메시지 바디에 데이터를 담는 경우를 말한다.

<br>

HTTP Message Body에 응답 데이터를 직접 담아서 전달하는 방법은 여러가지가 있다.

| TEXT 데이터 전달 | JSON 데이터 전달 |
| - | - |
| response.getWriter().write("message") | ResponseEntity<>(객체, HttpStatus.OK) |
| ResponseEntity<>("message", HttpStatus.OK) | @ResponseBody |
| @ResponseBody |  |

<br>

### ■ TEXT 데이터 전달

1. ```response.getWriter().write()``` 사용
```java
@Controller
@RequestMapping("/response-body")
public class responseController {

    @RequestMapping("/text/v1")
    public void process1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().write("ok");
    }
```

<br>

2. ```ResponseEntity<>``` 객체 사용
```java
    @RequestMapping("/text/v2")
    public ResponseEntity<String> process2(){
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
    // ResponseEntity 객체를 반환하면 스프링이 응답 메시지 바디에 "ok" 를 넣어준다.
```
- ```ResponseEntity<>``` 객체는 ```HttpEntity<>``` 클래스를 상속받았다.
- ```ResponseEntity<>``` 객체는 응답 코드를 설정할 수 있는 확장 기능을 제공한다. 

<br>

3. ```@ResponseBody``` 어노테이션 사용
```java
    @ResponseBody
    @RequestMapping("/text/v3")
    public String process3() {
        return "ok";
    }
    // @ResponseBody를 붙이면 리턴한 문자열을 응답 메시지의 바디에 넣어준다.
```
- 뷰를 사용하지 않고, HTTP Message Converter를 통해서 HTTP 메시지를 직접 입력한다.

<br>

### ■ JSON 데이터 전달

1. ```ResponseEntity<>``` 객체 사용
```java
	@RequestMapping("/json/v1")
    public ResponseEntity<Order> process4(){
        Order order = new Order();
        order.setProduct("speaker");
        order.setCount(1);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
```

<br>

2. ```@ResponseBody``` 어노테이션 사용
```java
    @ResponseBody
    @RequestMapping("/json/v2")
    public Order process5() {
        Order order = new Order();
        order.setProduct("speaker");
        order.setCount(1);
        return order;
    }
```
<br>

---

<br>

## ✏️ Return Value Handler
>이전 포스트에서 Argument Resolver에 대해서 학습했다.
Argument Resolver는 핸들러를 위한 다양한 객체들을 생성해서 어댑터에 넘겨주는 기능을 한다.
Argument Resolver는 HTTP 메시지와 관련된 객체는 HTTP Message Converter에게 생성을 요청한다.

핸들러 메소드의 다양한 파라미터를 지원하는 것이 Argument Resolver라면, 다양한 리턴 타입을 지원하는 것은 Return Value Handler이다.


- 문자열, ```ResponseEntity<>```, ```ModelAndView``` 등, 핸들러는 다양한 타입의 변수/객체를 반환한다.
- Return Value Handler는 반환 타입에 맞게 추가적인 처리를 해서 어댑터에 전달한다.

![](https://velog.velcdn.com/images/jaewon-ju/post/1615cc00-d97a-46b1-b365-8ed30e856e50/image.png)

<br>

> ex) 핸들러 메소드가 문자열을 반환하면, 이 문자열은 뷰의 논리적 이름으로 판단한다. ReturnValueHandler는 이 문자열을 사용하여 ModelAndView 객체를 생성하고, 설정된 뷰 리졸버를 사용하여 뷰를 찾고 렌더링합니다.

<br>

### ■ HTTP Message Converter
이전 시간에 학습한 HTTP Message Converter는 응답에서도 사용된다.

- Return Value Handler가 핸들러의 리턴 값을 처리할 때, ```ResponseEntity<>```, ```@ResponseBody``` 같이 HTTP 응답과 관련된 내용이 있으면 HTTP Message Converter를 호출한다.


<br>

핸들러의 메소드에 ```@ResponseBody``` 가 붙어있거나 핸들러에 ```@RestController``` 이 붙어 있으면 , 반환값은 HTTP 응답의 본문으로 직접 변환된다. 
이때 메시지 컨버터가 작동하여 클라이언트가 Accept 헤더를 통해 요청한 형식(예: JSON, XML)으로 데이터를 변환한다.

<br>

---

<br>



## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard">스프링 MVC 1편 - 김영한 개발자님</a>
