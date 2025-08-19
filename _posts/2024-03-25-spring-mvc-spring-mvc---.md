---
title: "[Spring MVC] Spring MVC의 이해"
description: "Spring MVC의 구조와 동작원리를 파악해보자."
date: 2024-03-25T08:27:25.290Z
tags: ["MVC","Spring"]
slug: "Spring-MVC-Spring-MVC의-이해"
categories: Spring
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:39:02.475Z
  hash: "5725d8900e2804e2ff741619e01293db91eb31ddc9b1c7717d8179d921c5967e"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard">스프링 MVC</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>

---

## 들어가기 전에..
<a href= "https://velog.io/@jaewon-ju/Spring-MVC-MVC-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%EB%A7%8C%EB%93%A4%EA%B8%B0">이전 포스트</a>에서 직접 MVC 프레임워크를 구현해봤다.
스프링 MVC는 이전 포스트에서 만든 Version5의 MVC와 구조가 거의 똑같다!
지금부터 자세히 알아보도록 하자.

<br>

---

<br>


## ✏️ Spring MVC 구조
![](https://velog.velcdn.com/images/jaewon-ju/post/06cf894f-3da0-4cc4-98c3-755a65c7b477/image.png)

>#### Version5에서 바뀐 점<br>
1. FrontController의 이름이 <span style="color:skyblue">DispatcherServlet</span>으로 변경되었다.
<br>
2. Version5는 핸들러를 매핑하기 위해 Map 자료구조를 사용했지만, Spring MVC는 <span style="color:skyblue">```HandlerMapping```</span> 인터페이스를 사용한다.
<br>
3. Version5는 핸들러 어댑터를 매핑하기 위해 Map 자료구조를 사용했지만, Spring MVC는 <span style="color:skyblue">```HandlerMapping```</span> 인터페이스를 사용한다.
<br>
4. 핸들러 어댑터가 <span style="color:skyblue">```ModelAndView```</span> 객체를 반환한다.
```ModelAndView``` 객체는 스프링 부트가 이미 구현해놓았다.
<br>
5. 뷰의 논리적 이름을 viewPath로 바꾸는 과정을 <span style="color:skyblue">```viewResolver```</span> 인터페이스에서 담당한다.


<br>

---

<br>


## ✏️ 개발자가 해야하는 것
어디까지 스프링 MVC 프레임워크가 지원하고, 어디부터 개발자가 코드를 작성해야하는 것일까?

간단하다.
> 개발자는 핸들러(컨트롤러)만 작성하면 된다.

나머지는 다 스프링 MVC 프레임워크가 내부적으로 처리해줄 것이다.
처리 과정은 다음과 같이 진행된다.

>1. 클라이언트의 요청을 받는다. 
```URI: /spring-mvc/orders```
<br>
2. 스프링이 구현해놓은 <span style = "background-color: lightgreen; color:black">DispatcherServlet</span> 에서 해당 요청을 확인한다.
<br>
3. 스프링 빈 중에서 해당 요청을 담당하는 <span style = "background-color: lightblue; color:black">핸들러</span>가 있는지 찾는다.
핸들러를 스프링 빈으로 등록하는 것은 <span style = "background-color: lightblue; color:black">개발자의 몫이다.</span>
<br>
4. 스프링이 구현해놓은 <span style = "background-color: lightgreen; color:black"> 핸들러 어댑터</span> 중에서 핸들러에 맞는 어댑터가 있는지 찾는다.
<br>
5. 해당 어댑터의 ```handle()``` 메소드로 핸들러의 비즈니스 로직을 실행한다.
<br>
6. 핸들러의 리턴 값을 받아서 처리한 뒤 <span style = "color:lightgreen">```ModelAndView```</span> 객체로 DispatcherServlet에 반환한다.
<br>
7. DispatcherServlet은 스프링이 구현해놓은 <span style = " color:lightgreen">```viewResolver```</span> 인터페이스로 viewName을 viewPath로 바꾼다.
<br>
8. DispatcherServlet은 ```render()``` 메소드로 제어권을 view에 넘긴다.
<br>
9. view는 model에 저장된 데이터를 보고 클라이언트에게 응답한다.

개발자는 핸들러 클래스를 만든 뒤에 ```@Controller``` 어노테이션을 붙이고, 비즈니스 로직에 ```@RequestMapping``` 어노테이션을 붙이기만 하면 된다.

나머지 과정은 모두 스프링이 처리해준다!
하지만 오류가 발생했을 때 구조를 이해하고 있어야 해당 오류를 처리할 수 있으므로, Spring MVC의 구성 요소들을 하나하나 알아보도록 하자.

<br>

---

<br>


## ✏️ DispatcherServlet
DispatcherServlet은 이전 포스트에서 제작한 프레임워크의 FrontController 역할을 맡고 있다.

- DispatcherServlet은 스프링이 이미 구현해놓았다.
- DispatcherServlet도 HttpServlet을 상속 받고, 서블릿으로 동작한다.
- DispatcherServlet은 모든 경로(```urlPatterns="/"```)에 대해서 매핑된다.
즉, 모든 요청은 DispatcherServlet에 잡힌다.

<br>

### ■ 로직
1. 요청이 오면 DispatcherServlet에 잡힌다.
2. 서블릿이 호출되면 ```service()``` 메소드가 자동으로 호출된다.
3. ```service()``` 메소드 내부에서 ```doDispatch()``` 메소드를 실행한다.

<br>

### ■ doDispatch()
```doDispatch()``` 메소드는 DispatcherServlet의 핵심이다.

이 메소드는 이전 포스트에서 만들었던 ```service()``` 메소드와 매우 유사한 로직을 가지고 있다.

#### ```doDispatch()``` 메소드의 로직은 다음과 같다.

1. 요청을 처리할 수 있는 핸들러를 조회한다.
2. 핸들러에 맞는 핸들러 어댑터를 조회한다.
3. 핸들러 어댑터의 ```handle()``` 메소드를 실행한다. ```ModelAndView``` 객체를 반환한다.
4. ```ViewResolver``` 인터페이스로 뷰를 찾고 ```View``` 객체를 반환 받는다.
5. 뷰를 렌더링한다.


<br>

---

<br>

## ✏️ 핸들러 매핑
DispatcherServlet은 요청을 받으면, 해당 요청을 처리할 수 있는 핸들러를 조회한다.

> 핸들러는 개발자가 미리 매핑해두어야 한다!

그렇다면, 핸들러를 매핑할 수 있는 방법은 무엇이고 매핑은 어디에 하는걸까?

<br>

### 방법 1 - @RequestMapping
1. 메소드에 ```@RequestMapping``` 어노테이션 붙이기
```java
 @Controller
 public class SpringController {
 
 	@RequestMapping("/new-form")
    public ModelAndView process() {
        return new ModelAndView("new-form");
    }

}
```

<br>

__매핑 장소: ```RequestMappingHandlerMapping``` 구현객체 내부
매핑 형식: 【 key: url 패턴, value: 핸들러 】__

⚠️ 더 자세히 알고 싶다면, ```RequestMappingHandlerMapping``` 클래스의 ```registerMapping()``` 메소드를 찾아보자.

>핸들러 매핑 정보를 저장할 때는 사실 해당 클래스 단위로 핸들러를 저장한다기 보단 핸들러에 있는 메소드를 기준으로 저장한다.<br>
어차피 DispatcherServlet에 리턴되는 값은 어댑터가 처리해주기 때문이다.<br>
따라서, 메소드를 기준으로 핸들러를 등록하는 것도 가능하다.

<br>


### 방법 2 - HttpRequestHandler
2. ```HttpRequestHandler``` 인터페이스의 구현객체를 만들고 스프링 빈으로 등록하기
```java
@Component("/new-form")
public class MyHttpRequestHandler implements HttpRequestHandler {
	@Override
    public void handleRequest(HttpServletRequest request, 
    	HttpServletResponse response) throws ServletException, IOException {
         
        // 비즈니스 로직 실행
     }
}

// 빈의 이름: /new-form
```

<br>

__매핑 장소: ```BeanNameUrlHandlerMapping``` 구현객체 내부
매핑 형식: 【 key: url 패턴, value: 빈의 이름 】__

<br>

⚠️ 자세히 들어가보니 부모 클래스인 ```AbstractUrlHandlerMapping```에 url 패턴으로 빈의 이름을 조회하는 메소드 + url 패턴으로 핸들러를 조회하는 메소드가 둘 다 존재한다. 결과적으로 핸들러를 리턴한다는 것만 알고있으면 될 듯하다.

<br>

> 특정 Url로 요청이 오면, DispatcherServlet은 우선 ```RequestMappingHandlerMapping``` 구현객체에서 요청을 처리할 수 있는 핸들러가 있는지 찾는다.<br>
처리할 수 있는 핸들러가 없다면, ```BeanNameUrlHandlerMapping``` 구현객체에서 핸들러를 찾는다.<br>
우선순위가 존재함에 유의하자!

<br>


### 방법 3 - Controller 인터페이스

3. ```Controller``` 인터페이스의 구현객체를 만들고 스프링 빈으로 등록하기

- 과거에 주로 사용했던 방법이다.
- ```@Controller``` 어노테이션과는 전혀 다르다!!

```java
@Component("/oldController")
 public class OldController implements Controller {
     @Override
     public ModelAndView handleRequest(HttpServletRequest request,
     		HttpServletResponse response) throws Exception {
            
     	 // 비즈니스 로직 실행
         return null;
	} 
}

// 빈의 이름: /oldController
```

<br>

__매핑 장소: ```BeanNameUrlHandlerMapping``` 구현객체 내부
매핑 형식: 【 key: url 패턴, value: 빈의 이름 】__


<br>

위의 3가지 방법으로 핸들러를 매핑할 수 있다.
요청을 처리할 핸들러는 준비가 되었다.
이제, 핸들러에 맞는 어댑터를 조회하는 방법을 알아보자.

<br>

---

<br>


## ✏️ 어댑터 매핑
어댑터는 개발자가 구현할 필요 없이, 스프링에서 이미 다 구현을 해두었다.

```HandlerAdapter``` 인터페이스의 구현객체는 다음과 같은 종류가 있다. 
(실제로는 더 많다.)

|우선순위| 구현객체 | usage |
| - | - | - |
| 0 | RequestMappingHandlerAdapter | @RequestMapping 으로 매핑한 핸들러에 맞는 어댑터 |
| 1 | HttpRequestHandlerAdapter | HttpRequestHandler로 매핑한 핸들러에 맞는 어댑터 |
| 2 | SimpleControllerHandlerAdapter | Controller로 매핑한 핸들러에 맞는 어댑터 |

<br>

> DispathcerServlet은 미리 스프링에서 만들어놓은 핸들러 어댑터들을 가져와서 List<> 형태로 저장해놓는다.<br>
#### 요청 처리 과정
1. DispatcherServlet은 요청을 처리할 수 있는 핸들러를 가져온다.
2. 핸들러에 맞는 어댑터를 찾기위해 ```HandlerAdapter``` 구현객체들의 ```supports()``` 메소드를 실행하면서, ```supports()``` 메소드의 return 값이 true인 어댑터를 저장한다.
3. 해당 어댑터로 핸들러의 비즈니스 로직을 실행한다.



<br>

---

<br>

## ✏️ ViewResolver
스프링부트는 ```InternalResourceViewResolver```라는 뷰 리졸버 객체를 자동으로 등록한다.

>1. 핸들러 어댑터가 ```ModelAndView``` 객체를 반환하면 그 내부에 뷰의 논리적 이름이 저장되어 있다.
<br>
2. ```InternalResourceViewResolver```는 application.properties 에 등록된 코드를 바탕으로 뷰의 논리적 이름을 viewPath로 변환한다.
<br>
3. 그리고나서 viewPath를 가지고 있는 ```View``` 객체를 DispatcherServlet에 반환한다.
<br>
4. DispatcherServlet은 ```View``` 객체의 ```render()``` 메소드를 실행해서 제어권을 뷰로 넘긴다.

<br>

application.properties에 다음과 같은 코드를 추가한다.
```java
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp

// "/WEB-INF/views" + viewName + ".jsp" 와 동일한 기능이다.
```

<span style = "color:red">⚠️</span> ```InternalResourceViewResolver``` 는 jsp를 처리할 수 있는 ```InternalResourceView``` 객체를 반환한다. 

<span style = "color:red">⚠️</span> 다른 종류의 ViewResolver도 존재한다.
ex) ```BeanNameViewResolver```

<br>

---

<br>

## ✏️ Spring MVC Controller V1
이전 포스트에서 만들었던 MVC 프레임워크를 Spring MVC를 사용해서 만들어보자.

앞서 말했듯이, Spring MVC에서 개발자가 구현해야 할 것은 핸들러 뿐이다!
<br>

- 주문 관리 폼
```java
// @Controller 어노테이션을 사용하면 해당 클래스를 스프링 빈으로 등록할 수 있다.
// 스프링에서 핸들러로 인식한다.
@Controller
public class OrderFormControllerV1 {

    @RequestMapping("/springmvc/v1/orders/new-form")
    public ModelAndView process() {
        return new ModelAndView("new-form");
    }
}
```

<br>

- 주문 저장

```java
@Controller
public class OrderSaveControllerV1 {

    OrderRepository orderRepository = OrderRepository.getInstance();
    
    @RequestMapping("/springmvc/v1/orders/save")
    public ModelAndView process(HttpServletRequest request, HttpServletResponse response) {
        String product = request.getParameter("product");
        int count = Integer.parseInt(request.getParameter("count"));

        Order order = new Order(product, count);
        orderRepository.save(order);

        ModelAndView mv = new ModelAndView("save-result");
        //mv.getModel().put("order",order);
        mv.addObject("order",order);

        return mv;
    }
}
```

<br>

- 주문 목록 조회

```java
@Controller
public class OrderListControllerV1 {

    OrderRepository orderRepository = OrderRepository.getInstance();
    
    @RequestMapping("/springmvc/v1/orders")
    public ModelAndView process() {
        List<Order> all = orderRepository.findAll();

        ModelAndView mv = new ModelAndView("orders");
        mv.addObject("orders",all);
        //mv.getModel().put("orders",all);

        return mv;
    }
}

```

<br>

위의 세 핸들러를 살펴보자.

#### 공통점
- ```ModelAndView``` 객체를 반환한다.
- 핸들러가 스프링 빈으로 등록되었다.
- 핸들러가 ```RequestMappingHandlerMapping``` 객체에 매핑되었다.

#### 차이점
- 비즈니스 로직의 <span style = "color:red">파라미터가 각각 다르다!</span>
핸들러의 메소드가 주입받을 수 있는 파라미터 종류는 매우 다양하다!
<a href= "https://www.inflearn.com/questions/668600/requestmapping%EC%9C%BC%EB%A1%9C-%EB%93%B1%EB%A1%9D%EB%90%9C-controller%EC%97%90%EB%8A%94-%EC%96%B4%EB%96%A4-%EC%9D%B8%EC%9E%90%EB%93%A4%EC%9D%B4-%EB%93%A4%EC%96%B4%EC%98%A4%EB%82%98%EC%9A%94">이 질문글을 참고하자.</a>


<br>

### ■ 개선할 점
```@RequestMapping``` 어노테이션이 메소드 단위로 적용되었다.
따라서, 컨트롤러(핸들러) 클래스를 하나로 통합할 수 있다!

<br>

---

<br>

## ✏️ Spring MVC Controller V2
V1의 세 핸들러를 하나로 통합해보자.

```java
@Controller
@RequestMapping("/springmvc/v2/orders")
public class SpringOrderControllerV2 {

    OrderRepository orderRepository = OrderRepository.getInstance();
	
    // ------------주문 관리 폼-------------
    @RequestMapping("/new-form")
    public ModelAndView newForm() {
        return new ModelAndView("new-form");
    }
    // ----------------------------------
```
```java
    // ------------주문 저장-------------
    @RequestMapping("/save")
    public ModelAndView save(HttpServletRequest request, HttpServletResponse response) {
        String product = request.getParameter("product");
        int count = Integer.parseInt(request.getParameter("count"));

        Order order = new Order(product, count);
        orderRepository.save(order);

        ModelAndView mv = new ModelAndView("save-result");
        //mv.getModel().put("order",order);
        mv.addObject("order",order);

        return mv;
    }
	// ----------------------------------
```
```java
	// ------------주문 목록 조회-------------
    @RequestMapping
    public ModelAndView orders() {
        List<Order> all = orderRepository.findAll();

        ModelAndView mv = new ModelAndView("orders");
        mv.addObject("orders",all);
        //mv.getModel().put("orders",all);

        return mv;
    }
    // ----------------------------------
}

```

<br>

### ■ 중복 제거

V1에서는 핸들러를 매핑할 때 중복이 존재했다.

```RequestMapping("/springmvc/v2/orders/new-form")```
```RequestMapping("/springmvc/v2/orders/save-result")```
```RequestMapping("/springmvc/v2/orders")```

<br>

핸들러를 하나로 합침으로써 중복을 제거할 수 있다.

핸들러 자체: 
```RequestMapping("/springmvc/v2/orders")```

각 메소드마다:
```RequestMapping("/new-form")```
```RequestMapping("/save-result")```
```RequestMapping```


<br>

### ■ 메소드 명
핸들러를 합칠 때 주의사항이 존재한다.

각 핸들러마다 비즈니스 로직을 실행하는 메소드가 존재했는데, 그 메소드의 이름이 겹치면 안된다!

따라서, 메소드 명을 각각 ```newForm()```, ```save()```, ```orders()```로 변경했다.

<br>

### ■ 개선할 점
- ```ModelAndView``` 객체를 만들어서 반환해야 하는 것이 번거롭다.
그냥 뷰의 논리 이름만 반환하게 만들 수는 없을까?


<br>

---

<br>

## ✏️ Spring MVC Controller V3
이전 포스트에서 Version3 -> Version4 로 프레임워크를 업그레이드할 때, 뷰의 논리적 이름만 반환해도 잘 동작하도록 개선했었다.

>이번에도 똑같이 해당 사항을 개선함과 동시에 몇가지 편의 사항도 추가해보자.
- 요청을 URL로만 구분하는 것이 아니라, HTTP Method로도 구분할 수 있도록 코드를 수정해보자.
<br>
- 요청 파라미터를 비즈니스 로직에서 분석하는 것이 아니라, 메소드의 매개변수로 바로 받을 수 있도록 만들어보자. 

<br>

```java
@Controller
@RequestMapping("/springmvc/v3/orders")
public class SpringOrderControllerV3 {

    OrderRepository orderRepository = OrderRepository.getInstance();

	// ------------주문 관리 폼-------------
    @GetMapping("/new-form")
    public String newForm() {
        return "new-form";
    }
	// ----------------------------------
```
```java
    // ------------주문 저장-------------
    @PostMapping("/save")
    public String save(@RequestParam("product") String product, @RequestParam("count") int count, Model model) {
        Order order = new Order(product, count);
        orderRepository.save(order);

        model.addAttribute("order",order);
        
        return "save-result";
    }
	// ----------------------------------
```
```java
    // ------------주문 목록 조회-------------
    @GetMapping
    public String orders(Model model) {
        List<Order> all = orderRepository.findAll();

        model.addAttribute("orders",all);

        return "orders";
    }
    // ----------------------------------
}

```

<br>

### ■ 변경사항
- ```@RequestMapping``` ➜ ```@GetMapping```, ```@PostMapping``` 
리소스 URI + Http Method까지 일치해야 핸들러에서 처리한다.

- 리턴 타입이 String으로 바뀌었다.

- 요청 파라미터를 <span style = "background-color: lightgreen; color:black">매개변수로 주입받는다!</span>
```@RequestParam("요청 파라미터 key")``` 를 사용해서 요청 파라미터를 주입받을 수 있다.

- ```Model``` 객체를 사용해서 뷰에 넘길 데이터를 저장한다.



<br>

---

<br>


## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard">스프링 MVC 1편 - 김영한 개발자님</a>
