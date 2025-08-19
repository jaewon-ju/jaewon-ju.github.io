---
title: "[Spring MVC] Servlet, JSP, MVC 패턴"
description: "Servlet, JSP의 단점과 MVC 패턴을 사용하게 된 배경"
date: 2024-03-18T13:59:20.534Z
tags: ["Spring"]
slug: "Spring-MVC-Servlet-JSP-MVC-패턴"
categories: Spring
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:07:25.121Z
  hash: "648bd95478086b7f6f98129f8fbdb12fe998189e13f4ffe140be12a2ecedacc1"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard">스프링 MVC</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning-SpringMVC>jaewon-ju Github Address</a></center>


---

## 들어가기 전에..

본 포스트에서는 실제로 주문 관리 웹 애플리케이션을 제작해보면서, Servlet과 JSP의 한계에 대해서 알아보고 MVC 패턴에 대해서 학습하려 한다.

주문 관리 웹 애플리케이션의 요구사항부터 살펴 보도록 하자.


<br>

---

<br>

## ✏️ 주문 관리 웹 애플리케이션 요구사항
### ■ 주문 정보
- 물품 이름: product
- 물품 개수: count


```java
// 주문 정보 객체 Order

@Getter @Setter
public class Order {
    
    private Long id;
    private String product;
    private int count;
    
    public Order() {
        
    }
    
    public Order(String product, int count){
        this.product = product;
        this.count = count;
    }
}
```

id는 주문의 식별자로서, ```Order``` 객체를 저장소에 저장할 때 저장소가 할당한다.

<br>

### ■ 기능 요구사항
- 주문 저장
- 주문 목록 조회

```java
// 회원 저장소 객체 Order Repository

public class OrderRepository {
    private static Map<Long, Order> repository = new HashMap<>();
    private static long sequence = 0L;

    private static final OrderRepository orderRepository = new OrderRepository();

    public static OrderRepository getInstance(){
        return orderRepository;
    }

    private OrderRepository(){}
```
회원 저장소 객체는 싱글톤 패턴을 적용했다. 스프링을 사용한다면 스프링 빈으로 등록해서 자동적으로 싱글톤 패턴을 적용시킬 수 있지만, 순수 서블릿만으로 일단 구현해보려 한다.

싱글톤 패턴을 위해 생성자를 private으로 막고, ```getInstance()``` 메소드로만 객체를 얻을 수 있도록 설정했다.

<br>

```java
    public Order save(Order order){
        order.setId(++sequence);
        repository.put(order.getId(), order);
        return order;
    }

    public Order findById(Long id){
        return repository.get(id);
    }

    public List<Order> findAll(){
        return new ArrayList<>(repository.values());
        // repository에 존재하는 주문 정보들로 리스트를 만들어서 리턴
    }

    public void clear(){
        repository.clear();
    }

}
```
저장소의 기능을 추가했다.

<br>

---

<br>

## ✏️ 웹 애플리케이션 만들기 - Servlet
이제, Servlet을 사용해서 웹 애플리케이션을 만들어보자.

<br>

### ■ 주문 등록 폼
가장 먼저, 클라이언트들이 주문을 등록하기 위한 HTML 폼을 만들어야 한다.
HTML 폼도 서블릿으로 만들 수 있다.
```/servlet/orders/new-form``` 으로 요청이 오면, HTML 폼을 응답으로 전송하면 된다.

```java
@WebServlet(name = "orderFormServlet", urlPatterns = "/servlet/orderss/new-form")
public class OrderFormServlet extends HttpServlet {
	@Override
	protected void service(HttpServletRequest request, 
		HttpServletResponse response) throws ServletException, IOException {
        
    response.setContentType("text/html");
    response.setCharacterEncoding("utf-8");

    PrintWriter w = response.getWriter();
    w.write("<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Title</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "<form action=\"/servlet/members/save\" method=\"post\">\n" +
            "    productname: <input type=\"text\" name=\"product\" />\n" +
            "    count:      <input type=\"text\" name=\"count\" />\n" +
            " <button type=\"submit\">전송</button>\n" + "</form>\n" +
            "</body>\n" +
            "</html>\n");
    } 
}
```
순수한 서블릿으로 애플리케이션을 만드려면, 자바 코드로 HTML을 제공해야 한다.
<span style = "color:red">매우 복잡하다!</span>


<br>

### ■ 주문 저장
위의 폼을 작성해서 전송하면, ```/servlet/members/save```에 파라미터 형식으로 요청이 온다.
해당 파라미터들을 받아서 저장해보자.

```java
@WebServlet(name = "orderSaveServlet", urlPatterns = "/servlet/orders/save")
public class OrderSaveServlet extends HttpServlet {

    private OrderRepository orderRepository = OrderRepository.getInstance();
    
    @Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
        
        String product = request.getParameter("product");
        int count = Integer.parseInt(request.getParameter("count"));

        Order order = new Order(product, count);
        orderRepository.save(order);
        
        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");
        PrintWriter w = response.getWriter();
        w.write("<html>\n" +
                "<head>\n" + " <meta charset=\"UTF-8\">\n" + "</head>\n" +
                "<body>\n" +
                "성공\n" +
                "<ul>\n" +
                "    <li>id=" + order.getId() + "</li>\n" +
                "    <li>product=" + order.getProduct() + "</li>\n" +
                " <li>count=" + order.getCount() + "</li>\n" + "</ul>\n" +
                "<a href=\"/index.html\">메인</a>\n" + "</body>\n" +
                "</html>");
        
        // HTML 중간에 자바 코드를 넣는 것도 가능하다.
        // 베이스가 자바 코드이기 때문에 가능하다.
    }
}
```
파라미터를 조회해서 order 객체를 만들고, 해당 객체를 저장소에 저장했다.
결과 화면은 HTML 응답 메시지로 전송했다.
여전히 HTML을 사용하는 것은 복잡하다.

<br>

### ■ 주문 목록 조회
요구사항 중 주문 목록을 조회하는 기능을 작성해보자.

```java
@WebServlet(name = "orderListServlet", urlPatterns = "/servlet/orders")
public class OrderListServlet extends HttpServlet {
    private OrderRepository orderRepository = OrderRepository.getInstance();

    @Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
        
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");

        List<Order> orders = orderRepository.findAll();

        PrintWriter w = response.getWriter();
        w.write("<html>");
        ...
        w.write("   </html>");
    }
}
```
타이핑 치는 것이 정말 힘들었다.

<br>

>지금까지 서블릿과 자바만으로 웹 애플리케이션을 만들어보았다.
가장 힘들었던 것은 HTML 응답 메시지를 작성하는 것이었다.
동적으로 HTML을 작성할 수 있는 것은 좋지만, 자바 코드로 HTML을 작성하는 것이 너무 힘들었다.<br>
지금까지는 자바 코드를 기반으로 HTML을 작성했다.
그렇다면, 반대로 HTML 기반에서 동적으로 작성해야 하는 부분만 자바 코드로 넣는 것은 어떻까?<br>
이것이 바로 템플릿 엔진이다.
템플릿 엔진에는 JSP, Thymeleaf, Velocity 등이 있다.

<br>

---

<br>

## ✏️ 웹 애플리케이션 만들기 - JSP
템플릿 엔진인 JSP를 사용해서 똑같은 웹 애플리케이션을 만들어보자.

서블릿을 사용했을 때 주문 등록, 주문 저장, 주문 목록 조회 기능을 구현한 코드에서는 <span style = "background-color: lightgreen; color:black">자바 코드 안에 HTML을 넣었다</span>.
반대로, JSP를 사용할 때는 <span style = "background-color: lightgreen; color:black">HTML이 메인이다</span>.

```html
// 주문 등록
// 주문 등록은 별 다른 처리 없이 HTML 폼만 응답 메시지로 보내면 된다.

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
 <html>
 <head>
     <title>Title</title>
 </head>
<body>
<form action="/jsp/orders/save.jsp" method="post">
    product: <input type="text" name="product" />
    count: <input type="text" name="count" />
    <button type="submit">전송</button>
 </form>
 </body>
 </html>
```

<br>

```html
// 주문 저장
<%
    OrderRepository orderRepository = OrderRepository.getInstance();
    System.out.println("save.jsp");
    String product = request.getParameter("product");
    int count = Integer.parseInt(request.getParameter("count"));

    Order order = new Order(product,count);
    orderRepository.save(order);
%>

<html>
<head>
    <meta charset="UTF-8">
</head>
<body> 성공
<ul>
     <li> id=<%=order.getId()%></li>
     <li>product=<%=order.getProduct()%></li>
     <li>count=<%=order.getCount()%></li>
</ul>
<a href="/index.html">메인</a>
</body>
</html>
```
주문 저장 기능은 요청 파라미터를 분석하는 로직이 필요하다.
해당 로직은 ```<% %>``` 태그 안에 작성하면 된다.


<br>

```html
// 주문 목록 조회
<%
    OrderRepository orderRepository = OrderRepository.getInstance();
    List<Order> orders = orderRepository.findAll();
%>

<html>
<head>
    <meta charset="UTF-8">
</head>
<body> 성공
<a href="/index.html">메인</a>
<table>
    <thead>
    <th>id</th>
    <th>product</th>
    <th>count</th>
    </thead>
<tbody>
<%
    for (Order order: orders) {
        out.write("<tr>");
        out.write("<td>"+order.getId()+"</td>");
        out.write("<td>"+order.getProduct()+"</td>");
        out.write("<td>"+order.getCount()+"</td>");
        out.write("</tr>");
    }
%>
    </tbody>
</table>
</body>
</html>
```
<br>


Servlet으로 작성된 코드를 JSP로 바꿔보았다.

### ■ 한계점
JSP를 사용하면 HTML 작업을 깔끔하게 할 수 있고, 동적으로 변경이 필요한 부분만 자바를 사용하면 된다.
하지만, 여전히 JSP에도 한계점이 존재한다.
><span style="color:red">비즈니스 로직과 뷰 영역이 하나의 파일안에 존재한다.</span>

<br>

위의 코드에서는 JSP가 너무 많은 역할을 하고있다.
비즈니스 로직에 문제가 생겨도 JSP를 고치고, 뷰 영역을 바꾸고 싶어도 JSP를 고쳐야 한다.

JSP는 목적에 맞게 뷰 영역에 집중하도록 하고, 비즈니스 로직은 서블릿처럼 다른 곳에서 처리할 수 없을까?
➜ MVC의 등장

<br>

---

<br>

## ✏️ MVC 패턴
MVC: Model View Controller
>서비스를 제공하기 위한 과정들을 역할별로 Model, View, Controller 영역으로 나누어서 처리하는 패턴이다.

MVC 패턴을 사용한 웹 애플리케이션의 동작과정을 살펴보자.

1. 클라이언트의 요청을 Controller가 받아서 파라미터를 분석한다.
2. Controller는 Service에서 비즈니스 로직을 처리한 후 결과를 Model에 저장한다.
3. View는 Model의 데이터를 참조해서 화면을 그리고 클라이언트에게 응답한다.
<br>

### ■ Model
Controller ➜ View 방향으로 데이터 전달을 담당한다.

<br>

### ■ View
Model에 담겨있는 데이터를 참조해서 화면을 그린다.

<br>

### ■ Controller
HTTP 요청을 받아서 파라미터를 검증한다.
- 비즈니스 로직을 Controller에 둘 수도 있지만, Controller에 부담을 주게 된다.
- 따라서, 비즈니스 로직은 서비스라는 계층을 별도로 만들어서 처리한다.






<br>

---

<br>

## ✏️ MVC 패턴의 적용
그렇다면, Servlet과 JSP로 만들었던 코드에 MVC 패턴을 적용해보자.

<br>

### ■ 주문 등록 폼
1. /servlet-mvc/orders/new-form에 요청이 들어온다.
2. 로직을 실행할 것이 없으므로 Controller는 바로 View로 제어권을 넘긴다.
3. View는 HTML로 화면을 그린다.

<br>

```java
// Controller

@WebServlet(name="mvcOrderFormServlet", urlPatterns = "/servlet-mvc/orders/new-form")
public class MvcOrderFormServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, 
    		HttpServletResponse response) throws ServletException, IOException {
            
        String viewPath = "/WEB-INF/views/new-form.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request, response);
    }
}
```
- ```dispatcher.forward()```는 다른 서블릿이나 JSP로 이동할 수 있는 기능이다.

>Redirect는 클라이언트까지 응답이 나갔다가 클라이언트가 다른 리소스(Location)로 요청을 보내지만, ```dispatcher.forward()```를 사용하면 서버 내부에서 호출이 다시 발생한다. 

- /WEB-INF 폴더의 리소스는 <span style = "background-color: lightgreen; color:black">외부에서 호출할 수 없다</span>.

<br>

```html
// View

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
 <html>
 <head>
     <title>Title</title>
 </head>
<body>
<form action="/save.jsp" method="post">
    product: <input type="text" name="product" />
    count: <input type="text" name="count" />
    <button type="submit">전송</button>
 </form>
 </body>
 </html>
```

<br>

### ■ 주문 저장
1. /servlet-mvc/orders/save에 요청이 들어온다.
2. Controller에서 파라미터를 분석하고 비즈니스 로직을 실행한다. 
(Service 미사용 예제)
3. Model에 데이터를 보관한 뒤 View로 제어권을 넘긴다.
3. View는 Model의 데이터를 참조해서 HTML로 화면을 그린다.

```java
// Controller

// 앞부분 생략

// ------ 파라미터 분석 -------
String product = request.getParameter("product");
int count = Integer.parseInt(request.getParameter("count"));
// -------------------------


// -----비즈니스 로직 실행------
Order order = new Order(product,count);
orderRepository.save(order);
// -------------------------


//---- Model에 데이터 보관 ----
// key, value 형태로 보관한다
request.setAttribute("order",order);
// -------------------------


// ----- View로 넘기기 ------
String viewPath = "/WEB-INF/views/save.jsp";
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request, response);
// -------------------------
``` 
- ```request.setAttribute()```로 Model에 데이터를 저장할 수 있다.
- View로 제어권을 넘기는 부분에서 앞서 사용했던 코드가 재사용되었다.

<br>

```html
// View

<html>
<head>
    <meta charset="UTF-8">
</head>
<body> 성공
<ul>
     <li>id=${order.Id}</li>
     <li>product=${order.product}</li>
     <li>count=${order.count}</li>
</ul>
<a href="/index.html">메인</a>
</body>
</html>
```
- ```${ }```는 JSP에서 제공한는 문법이다. 해당 문법을 사용하면 Model에 담긴 데이터를 쉽게 꺼낼 수 있다.



<br>

### ■ 주문 목록 조회
1. /servlet-mvc/orders에 요청이 들어온다.
2. Controller에서 파라미터를 분석하고 비즈니스 로직을 실행한다. 
(Service 미사용 예제)
3. Model에 데이터를 보관한 뒤 View로 제어권을 넘긴다.
3. View는 Model의 데이터를 참조해서 HTML로 화면을 그린다.

```java
// Controller

// 앞부분 생략

// ------ 파라미터 분석 ------
List<Order> orders = orderRepository.findAll();
// -----------------------


// ------ Model에 저장 ------
request.setAttribute("orders",orders);
// -----------------------

// ----- View에 제어권 넘김 -----
String viewPath = "/WEB-INF/views/orders.jsp";
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request, response);
// ------------------------
```

- ```request.setAttribute()```로 Model에 데이터를 저장할 수 있다.
- View로 제어권을 넘기는 부분에서 앞서 사용했던 코드가 재사용되었다.

```html
// View
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body> 성공
<a href="/index.html">메인</a>
<table>
    <thead>
    <th>id</th>
    <th>product</th>
    <th>count</th>
    </thead>
<tbody>
<c:forEach var="item" items="${orders}">
    <tr>
        <td>${item.id}</td>
        <td>${item.product}</td>
        <td>${item.count}</td>
    </tr>
</c:forEach>
    </tbody>
</table>
</body>
</html>
```

- <c: forEach> 문법을 사용했다.

<br>

---

<br>

## ✏️ MVC 패턴의 한계
MVC 패턴을 적용하면, Model, View, Controller의 역할을 명확하게 구분할 수 있다.
그러나, 단점 또한 존재한다.

1. View로 제어권을 넘기는 코드가 중복된다.
```java
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request, response);
```

2. ViewPath 자체도 중복된다.
```java
String viewPath = "/WEB-INF/views/orders.jsp";
// prefix 중복: /WEB-INF/views
// postfix 중복: .jsp
```

3. 사용하지 않는 코드
```HttpServletRequest request, HttpServletResponse response```를 사용하지 않을 때가 있다.

4. 공통 처리가 어렵다.
위의 프로그램에서 컨트롤러는 모두 서블릿으로 만들었다.
각 컨트롤러는 ```WebServlet(urlPatterns = " ... ")```로 해당 리소스에 요청이 오면 ```HttpServletRequest request, HttpServletResponse response```를 생성해서 요청과 응답을 처리한다. 이러한 작업을 컨트롤러 각각마다 하는 것은 매우 비효율적이다.

이러한 단점들을 어떻게 해결할 수 있을까?
다음 포스트에서 알아보도록 하자.
<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard">스프링 MVC 1편 - 김영한 개발자님</a>
