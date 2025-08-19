---
title: "[Spring MVC] MVC 프레임워크 만들기"
description: "MVC 패턴의 단점을 하나씩 고쳐나가면서 Spring MVC 프레임워크를 이해해보자."
date: 2024-03-22T05:59:11.586Z
tags: ["MVC","Spring"]
slug: "Spring-MVC-MVC-프레임워크-만들기"
categories: Spring
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:07:22.826Z
  hash: "e7735959e4643a785cc27af2e2df06d26dcfe82cfbbcf943e5f712e5cc2085ca"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard">스프링 MVC</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>

<br>

---

<br>

## 들어가기 전에..
이전 포스트에서 기본 MVC 패턴의 단점에 대해서 알아봤다.
이번 포스트에서는 해당 단점들을 하나씩 해결해나가며 프레임워크를 구축해보고, 결과적으로 Spring MVC를 이해하고자 한다.

<br>

---

<br>

## ✏️ Version1 - FrontController
먼저, 공통 처리의 어려움을 해결해보자.
해결방법은 FrontController를 도입하는 것이다.

> FrontController는 클라이언트로부터 오는 모든 요청을 받고, 각 요청에 맞게 컨트롤러를 지정해주는 역할을 한다.

- FrontController는 서블릿이다.
- FrontController를 제외한 모든 컨트롤러는 서블릿을 사용하지 않아도 된다.

<br>

### ■ 전제 조건
각 urlPattern과 Controller 구현객체를 매핑해두어야 한다.

매핑은 Map 클래스를 사용한다.
```Map<String, ControllerV1>```
-  ```/front-controller/v1/orders/new-form``` 으로 요청이 오면
```OrderFormControllerV1``` 구현객체를 호출한다.

-  ```/front-controller/v1/orders/save``` 으로 요청이 오면
```OrderSaveControllerV1``` 구현객체를 호출한다.


-  ```/front-controller/v1/orders``` 으로 요청이 오면
```OrderListControllerV1``` 구현객체를 호출한다.


<br>

### ■ 구조
![](/assets/posts/image.png)


요청 받음


1. 매핑된 컨트롤러 찾아옴
```get(requestURI)```

2. 해당 컨트롤러의 비즈니스 로직 실행
```ControllerV1.process```

3. 컨트롤러는 view로 제어권을 넘김
```dispatcher.forward()```

4. view에서 응답을 보냄

<br>


### ■ ControllerV1 인터페이스
>FrontController를 제외한 모든 컨트롤러는 ControllerV1 인터페이스를 구현해야 한다.

```java
public interface ControllerV1 {
    void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException;
    // ControllerV1 타입의 구현객체는 항상 process를 구현해야 함
    // process는 비즈니스 로직이다.
}
```


<br>

### ■ FrontController

```java
// FrontController 구현

@WebServlet(name = "frontControllerServletV1", urlPatterns = "/front-controller/v1/*")
public class FrontControllerServletV1 extends HttpServlet {

    private Map<String, ControllerV1> controllerMap = new HashMap<>();
	// Map은 ControllerV1의 구현객체들을 저장한다.

    public FrontControllerServletV1() {
        controllerMap.put("/front-controller/v1/orders/new-form", new OrderFormControllerV1());
        controllerMap.put("/front-controller/v1/orders/save", new OrderSaveControllerV1());
        controllerMap.put("/front-controller/v1/orders", new OrderListControllerV1());       
    }

    @Override 
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        /* 요청 URI 분석 */
        String requestURI = request.getRequestURI();
        
        /* 해당 리소스의 컨트롤러 조회*/
        ControllerV1 controllerV1 = controllerMap.get(requestURI);
        if(controllerV1 == null){
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
		
        /* 컨트롤러의 비즈니스 로직 호출 */
        controllerV1.process(request,response);
    }
}
```

<br>


### ■ ControllerV1 구현객체
```java
// 주문 관리 폼
public class OrderFormControllerV1 implements ControllerV1 {

    @Override
    public void process(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
            
        String viewPath = "/WEB-INF/views/new-form.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request,response);
    }
}
```
<br>

```java
// 주문 저장
public class OrderSaveControllerV1 implements ControllerV1 {

    OrderRepository orderRepository = OrderRepository.getInstance();

    @Override
    public void process(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
            
        String product = request.getParameter("product");
        int count = Integer.parseInt(request.getParameter("count"));

        Order order = new Order(product, count);
        orderRepository.save(order);

        request.setAttribute("order",order);

        String viewPath = "/WEB-INF/views/save-result.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request,response);
    }
}
```

<br>

```java
// 주문 목록 조회
public class OrderListControllerV1 implements ControllerV1 {

    OrderRepository repository = OrderRepository.getInstance();
    
    @Override
    public void process(HttpServletRequest request, 
    	HttpServletResponse response) throws ServletException, IOException {
        	
        List<Order> orders = repository.findAll();

        request.setAttribute("orders",orders);

        String viewPath = "/WEB-INF/views/orders.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request,response);
    }
}
```

<br>

### ■ 개선할 점
모든 컨트롤러에서 뷰로 이동하는 부분에 중복이 존재한다.
```java
String viewPath = "/WEB-INF/views/orders.jsp";
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request,response);
```

<br>

---

<br>

## ✏️ Version2 - MyView
Version1에서 발생한 "뷰로 이동하는 코드 중복" 문제를 해결해보자.

>기존 - 컨트롤러 구현객체에서 view로 제어권 넘김
개선 - 컨트롤러 구현객체에서 바로 제어권을 넘기지 않고, viewPath가 담긴 ```MyView``` 객체를 FrontConroller에 반환한다.



<br>

### ■ 구조
![](/assets/posts/image.png)

요청 받음

1. 매핑된 컨트롤러 찾아옴
```get(requestURI)```

2. 해당 컨트롤러의 비즈니스 로직 실행
```ControllerV2.process```

3. 컨트롤러는 viewPath가 담긴 ```MyView``` 객체를 반환함

4. 컨트롤러에서 ```MyView.render(request, response)```로 view로 제어권을 넘김

5. view에서 응답


<br>

### ■ MyView
```java
public class MyView {
    private String viewPath;

    public MyView(String viewPath) {
        this.viewPath = viewPath;
    }

    public void render(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        RequestDispatcher requestDispatcher = request.getRequestDispatcher(viewPath);
        requestDispatcher.forward(request,response);
    }
}
```

- ```MyView``` 객체는 viewPath를 담을 수 있다.
- 이전의 공통된 로직이었던 부분을 ```render()``` 메소드로 처리한다.
<br>


### ■ ControllerV2 인터페이스
#### 수정 사항
- ```void process()``` ➜ ```MyView process()```
process 메소드의 리턴 타입이 ```MyView```로 변경

<br>

### ■ FrontController
#### 수정 사항
- ...V1으로 작성된 변수명들 모두 ...V2로 변경
- 컨트롤러에서 바로 view로 제어권을 넘기지 않고, MyView를 리턴한다.

```java
// 이전 코드
controllerV1.process(request, response);
```
```java
// 개선된 코드
MyView myView = controllerV2.process(request, response);
myView.render(request,response);
```

<br>


### ■ ControllerV2 구현객체
#### 수정 사항

- 모든 구현객체의 다음 코드가 변경됨
```java
// 이전 코드
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request,response);
```
```java
// 개선 코드
return new MyView(viewPath);
```
<br>

Version1에서 발생한 "뷰로 이동하는 코드 중복" 문제를 해결하였다!

<br>

### ■ 개선할 점

- 컨트롤러 구현객체의 ```HttpServletRequest, HttpServletResponse``` 가 중복된다.

- viewPath ```/WEB-INF/views```와 ```.jsp```가 중복된다.

<br>

---

<br>

## ✏️ Version3 - ModelView
Version2에서 발생한 "```HttpServletRequest, HttpServletResponse```  중복 문제"와 viewPath 중복문제를 해결해보자.

>#### 1. ```HttpServletRequest, HttpServletResponse```  중복 
요청 파라미터의 정보는 FrontController가 분석해서 구현객체에 넘겨주면 된다.
```Map<String, String>``` 형식으로 파라미터 이름과 내용을 넘겨준다.<br>
더이상 request, response를 컨트롤러에 넘겨주지 않아도 된다.
이렇게 하면, 구현객체는 서블릿 기술과 무관하게 작동한다.


>#### 2. viewPath 중복
컨트롤러 구현객체에서 뷰의 논리적 이름을 반환한다.<br>
ex) 주문 관리 폼 -> new-form
주문 저장 -> save-result
주문 목록 -> orders<br>
FrontController는 이름에 prefix와 postfix를 추가한다.
```"/WEB-INF/views/" + viewName + ".jsp"```
그런 다음 myView에 저장하면 된다.

<br>

### ■ 구조
![](/assets/posts/image.png)

요청 받음

1. 매핑된 컨트롤러 찾아옴
```get(requestURI)```

2. FrontController에서 요청 파라미터 분석

3. 해당 컨트롤러의 비즈니스 로직 실행
```ControllerV3.process```
<span style = "color:red">인수는 ```request, response```가 아닌, parameterMap을 준다.</span>

4. 컨트롤러는 viewName을 저장한 ```ModelView``` 객체를 반환

5. FrontController에서 뷰의 논리적 이름을 viewPath로 변경 +
```MyView.render(modelView.getmodel(), request, response)```로 view로 제어권을 넘김

6. view에서 응답


<br>

### ■ ModelView

ModelView는 뷰에 전달할 데이터를 저장하는 객체이다.
- 뷰의 논리적 이름 - viewName
- 뷰에 전달할 데이터 - model

```java
@Getter @Setter
public class ModelView {

    private String viewName;
    private Map<String, Object> model = new HashMap<>();

    public ModelView(String viewName){
        this.viewName = viewName;
    }
}
```

<br>

### ■ MyView

#### 수정 사항
version2에서는 컨트롤러 구현객체에서 ```request.setAtrribute()```로 직접 모델에 데이터를 입력했다.

하지만, version3에서는 구현객체에서 ```HttpServletRequest```를 더이상 사용할 수 없고, ```ModelView``` 객체에 데이터를 넣어서 전달한다.

따라서, ```render()``` 로 뷰에 제어권을 넘길 때, ```ModelView``` 에 저장된 데이터를 뷰가 볼 수 있는 저장소에 넣어주어야 한다.

```java
    public void render(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        // model에는 화면을 만들기 위한 정보들이 key:value로 저장되어 있음
        // JSP는 request.getAttribute()로 데이터를 조회하기 때문에, request.setAttribute()로 데이터를 담아줘야 한다.

        model.forEach((key, value) -> request.setAttribute(key, value));
        RequestDispatcher requestDispatcher = request.getRequestDispatcher(viewPath);
        requestDispatcher.forward(request,response);
    }
```

<br>


### ■ ControllerV3 인터페이스
#### 수정 사항

- 컨트롤러 구현객체는 ModelView를 반환한다.

```java
ModelView process(Map<String, String> parameterMap);
```

<br>

### ■ FrontController
#### 수정 사항

이전:
- 요청 파라미터 분석은 컨트롤러 구현객체 각각 따로 진행한다.
- 컨트롤러 구현객체는 viewPath를 저장하고 있는 ```MyView``` 객체를 반환한다.
- ```render()``` 메소드에 ```request, response``` 를 인수로 전달한다.

<br>

이후:
- 요청 파라미터 분석을 FrontController에서 한 뒤 Map 객체로 구현객체에 넘겨준다. 
- 컨트롤러 구현객체는 뷰의 논리적 이름과 모델을 저장하는 ```ModelView``` 객체를 반환한다.
- ```ModelView``` 객체에 저장된 뷰의 논리 이름으로 viewPath를 만들어서 ```MyView``` 객체에 저장한다.
- ```render()``` 메소드에 ```modelView.getModel(), request, response```를 인수로 전달한다.

<br>

```java
		// 생략
        
        ...
        
        // 파라미터를 분석해서 컨트롤러에 넘겨줘야 함.
        Map<String, String> parameterMap = createParameterMap(request);

        ModelView modelView = controllerV3.process(parameterMap);

        String viewPath = viewResolve(modelView.getViewName());
        MyView myView = new MyView(viewPath);
        myView.render(modelView.getModel(), request, response);
    }

    private String viewResolve(String viewName) {
        return "/WEB-INF/views/" + viewName + ".jsp";
    }

    private Map<String, String> createParameterMap(HttpServletRequest request) {
        Map<String, String> parameterMap = new HashMap<>();

        request.getParameterNames().asIterator().forEachRemaining(paramName -> parameterMap.put(paramName, request.getParameter(paramName)));
        return parameterMap;
    }
```

<br>


### ■ ControllerV3 구현객체
#### 수정 사항

- 모든 구현 객체가 ```ModelView``` 객체를 반환하도록 변경
- 모든 구현 객체가 서블릿과 무관하게 작동하도록 변경
- 뷰에 전달할 데이터는 ```modelView.getModel().put()```을 사용한 뒤 ```ModelView``` 객체를 반환

<br>

### ■ 개선할 점
- 각 컨트롤러 구현객체에서 ```ModelView``` 객체를 리턴하는 것이 번거롭다.

<br>

---

<br>

## ✏️ Version4
Version4는 Version3와 큰 차이는 없다.
컨트롤러 구현객체가 ```ModelView``` 객체를 반환하지 않고, 뷰의 논리적 이름을 반환할 뿐이다.

<br>

### ■ ControllerV4 인터페이스

- FrontController에서 요청 파라미터를 분석한 ```parameterMap```과 뷰에 전달할 데이터를 담을 ```model``` 객체를 전달한다.

```java
public interface ControllerV4 {
    String process(Map<String, String> parameterMap, Map<String, Object> model);
}
```

<br>

### ■ FrontController
#### 수정 사항

컨트롤러에 넘겨줄 인자가 2개로 늘어남.
모델을 FrontController에서 생성해서 넘겨준다.

```java
// 모델을 새로 생성해서 컨트롤러에 넘겨줘야 함.
Map<String, Object> model = new HashMap<>();

String viewName = controllerV4.process(parameterMap, model);
```

<br>


### ■ ControllerV4 구현객체
#### 수정 사항


- 뷰에 전달할 데이터를 ```model``` 객체에 저장한다.
- 반환하는 것은 뷰의 논리적 이름이다.

```java
// 주문 저장
model.put("order",order);
return "save-result";
```
```java
// 주문 목록
model.put("orders",all);
return "orders";
```

<br>

---

<br>

## ✏️ Version5
Version4까지는 각 로직은 하나의 컨트롤러를 구현했다.
즉, 주문 저장은 Version3로 하고, 주문 목록 조회는 Version4로 할 수는 없었다.

컨트롤러 인터페이스를 혼용해서 사용하고 싶다면 어떻게 해야할까?
➜ Adapter Pattern을 사용한다.

<br>

>#### Adapter Pattern
어댑터 패턴이란, 호환되지 않는 인터페이스를 가진 객체들이 서로 협업할 수 있도록 해주는 구조적 디자인 패턴이다.

version4의 구조에서 "핸들러 어댑터"를 추가한다.
- 컨트롤러 ➜ 핸들러
핸들러란 컨트롤러 구현객체를 뜻한다. 조금 더 넓은 의미로 변화되었다.

- 핸들러 어댑터는 인터페이스이다.
해당 인터페이스의 구현객체는 반드시 ```supports()```와 ```handle()``` 메소드를 오버라이딩해야 한다.
핸들러 어댑터의 ```handle()``` 메소드로 각 핸들러(컨트롤러)의 비즈니스 로직을 호출할 수 있다.

> 핸들러 어댑터가 없다면?<br>
요청이 들어옴
-> version 체크
-> if문으로 version에 맞는 컨트롤러 제공
-> version이 100개가 넘어간다면?
-> 코드가 복잡해진다.

<br>

### ■ 구조
![](/assets/posts/image.png)

요청 받음

1. 매핑 정보에서 <span style = "color:red">핸들러</span> 찾아옴
```get(requestURI)```

2. 갖고 있는 Adapter Map에서 핸들러에 맞는 어댑터를 찾아옴

3. 해당 핸들러 어댑터로 ```handle()``` 메소드 호출

4. 어댑터는 핸들러의 비즈니스 로직 실행

5. 핸들러가 어댑터에 리턴 (<span style = "background-color: lightgreen; color:black">핸들러의 리턴 타입은 각자 다르다!</span>)

6. 핸들러 어댑터는 리턴된 값을 잘 사용해서 ```ModelView``` 객체를 만들어 반환

7. FrontController에서 MyView 객체 생성

8. ```myView.render()```

9. view에서 응답

<br>

### ■ 핸들러 어댑터 인터페이스
모든 핸들러 어댑터는 다음과 같은 인터페이스를 구현해야 한다.

```java
public interface MyHandlerAdapter {
    boolean support(Object handler);

    ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException, IOException;
}
```

- ```support()``` 메소드는 어댑터가 해당 핸들러(컨트롤러)를 처리할 수 있는지 판단한다.
- ```handle()``` 메소드는 실제 핸들러를 호출하고 그 결과로 ```ModelView```객체를 반환한다.
핸들러가 ```ModelView``` 객체를 반환하지 않더라도, 만들어서라도 반환해야한다.

<br>

### ■ 핸들러 어댑터 구현객체
```java
//Controller Version3 Adapter

public class ControllerV3Adapter implements MyHandlerAdapter{
    // V3 전용 어댑터
    @Override
    public boolean support(Object handler) {
        return (handler instanceof ControllerV3);
        // 컨트롤러가 version3 이어야만 지원한다.
    }

    @Override
    public ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException, IOException {
        ControllerV3 controllerV3 = (ControllerV3) handler;

        // 파라미터를 분석해서 컨트롤러에 넘겨줘야 함.
        Map<String, String> parameterMap = createParameterMap(request);

        ModelView modelView = controllerV3.process(parameterMap);
        // V3는 modelView를 반환하므로 그냥 리턴하면 된다.
        return modelView;
    }
}
```

```java
// Controller Version4 Adapter

public class ControllerV4Adapter implements MyHandlerAdapter{
    @Override
    public boolean support(Object handler) {
        return (handler instanceof ControllerV4);
    }

    @Override
    public ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException, IOException {
        ControllerV4 controllerV4 = (ControllerV4) handler;

        Map<String, String> parameterMap = createParameterMap(request);
        Map<String, Object> model = new HashMap<>();

        String viewName = controllerV4.process(parameterMap, model);
        ModelView modelView = new ModelView(viewName);
        modelView.setModel(model); // 반드시 모델을 세팅한 후에 넘겨줘야 한다.

        return modelView;
    }
}
```

- 각 컨트롤러마다 비즈니스 로직을 실행하기 위한 인수가 다르다.
- Version3의 컨트롤러는 ```ModelView``` 객체를 반환하므로, 그냥 리턴한다.
- Version4의 컨트롤러는 viewName만 반환하므로, ```ModelView``` 객체를 어댑터에서 만들어줘야 한다.
```ModelView``` 객체를 생성한 뒤, <span style = "color:red">model을 세팅해서 리턴한다!</span>

<br>

### ■ FrontController

- 매핑된 정보가 2개 존재한다.
1. Map<요청 URI , 핸들러>
2. List<핸들러어댑터>

- 요청 URI를 key로 핸들러 Map에 저장되어 있는 핸들러를 가져온다.
- 핸들러에 맞는 어댑터가 있으면 가져온다.
- 해당 어댑터로 비즈니스 로직을 실행하고, ModelView를 리턴받는다.

```java
	private final Map<String, Object> handlerMap = new HashMap<>();
    private final List<MyHandlerAdapter> handlerAdapters = new ArrayList<>();

    public FrontControllerServletV5(){
        initHandlerMap();
        initHandlerAdapters();
    }

    public void initHandlerMap() {
        handlerMap.put("/front-controller/v5/v3/orders/new-form", new OrderFormControllerV3());
        handlerMap.put("/front-controller/v5/v3/orders/save", new OrderSaveControllerV3());
        handlerMap.put("/front-controller/v5/v3/orders", new OrderListControllerV3());

        handlerMap.put("/front-controller/v5/v4/orders/new-form", new OrderFormControllerV4());
        handlerMap.put("/front-controller/v5/v4/orders/save", new OrderSaveControllerV4());
        handlerMap.put("/front-controller/v5/v4/orders", new OrderListControllerV4());
        // 프론트 컨트롤러가 생성될 때 handlerMap에 컨트롤러들을 저장
    }

    private void initHandlerAdapters(){
        handlerAdapters.add(new ControllerV3Adapter());
        handlerAdapters.add(new ControllerV4Adapter());
        // 프론트 컨트롤러가 생성될 때 handlerAdapters 리스트에 사용가능한 어댑터들 저장
    }
```
```java
    @Override
    protected void service(HttpServletRequest request, 
    	HttpServletResponse response) throws ServletException, IOException {
    
        // 요청 URI에 해당되는 컨트롤러 구현객체를 가져옴
        String requestURI = request.getRequestURI();
        Object handler = handlerMap.get(requestURI);
        if(handler == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        // ------------------------------------

        // 핸들러에 맞는 어댑터를 가져옴
        MyHandlerAdapter myHandlerAdapter = null;

        for(MyHandlerAdapter adapter : handlerAdapters){
            if(adapter.support(handler)){
                myHandlerAdapter = adapter;
            }
        }
        // ------------------------------------

        ModelView modelView = myHandlerAdapter.handle(request, response, handler);

        String viewPath = viewResolve(modelView.getViewName());
        MyView myView = new MyView(viewPath);
        myView.render(modelView.getModel(),request, response);
    }

```




<br>

---

<br>

## ✏️ 마무리

지금까지 작성한 코드는 스프링 MVC 프레임워크 핵심 코드의 축약 버전이다!
이제, 스프링 MVC 프레임워크의 구조를 이해할 수 있게 되었다.
다음 포스팅에서 스프링 MVC 프레임워크를 알아보도록 하자.

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard">스프링 MVC 1편 - 김영한 개발자님</a>