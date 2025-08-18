---
title: "[CS 지식] Spring HTTP 응답 직렬화"
description: "HTTP Response에 객체를 넣었을 때 JSON으로 직렬화 하는 방법"
date: 2024-12-11T14:44:12.430Z
tags: ["CS지식"]
slug: "CS-지식-Spring-HTTP-응답-직렬화"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:49.527Z
  hash: "bfbdcb4b473c501bb61ff56672be710b92fd00d2098879e82e6b49f6707d44d1"
---

Controller를 구현할 때 HTTP Response Body를 채우는 과정에 궁금증이 생겨서 포스트를 작성하게 되었다.

API를 구현하면 보통 JSON 형식으로 HTTP 응답을 보낸다.
이때, `ResponseEntity<>`를 주로 사용하는데 `<>` 제너릭에 객체를 집어넣으면 자동으로 JSON으로 직렬화해서 HTTP 응답을 보내준다.


> #### 근데 가끔 JSON으로 직렬화가 안될 때가 있다.

이유가 무엇일까?
우선 HTTP Response를 보낼 때 주로 사용하는 방법을 알아보자.

<br>

---

### ■ HTTP 응답 방식

<br>

__1. `@ResponseBody` 또는 `@RestController`__
- `@ResponseBody`를 메서드 레벨에 사용하거나, 클래스 레벨에 `@RestController`를 붙이면 메서드의 반환값이 **자동으로 JSON으로 직렬화**됨.
- Spring은 Jackson(ObjectMapper)을 사용하여 Java 객체를 JSON으로 변환함.

**예제:**
```java
@RestController
public class MyController {
    @GetMapping("/example")
    public MyResponse getExample() {
        return new MyResponse("example", 123);
    }
}

class MyResponse {
    private String name;
    private int value;

    // 생성자, getter, setter
}
```
<br>

__2. `ResponseEntity`__
- 응답의 HTTP 상태 코드, 헤더, 바디를 명시적으로 제어하고 싶을 때 사용.
- `ResponseEntity<T>`를 사용하면 **T**가 JSON으로 직렬화됨.

**예제:**
```java
@GetMapping("/response-entity")
public ResponseEntity<MyResponse> getResponseEntity() {
    MyResponse response = new MyResponse("response", 456);
    return ResponseEntity.ok(response);
}
```

<br>

- `ResponseEntity<?>`를 사용하면 다양한 응답 타입을 처리할 수 있음. 상황에 따라 객체, 문자열, 리스트 등을 반환 가능.

**예제:**
```java
@GetMapping("/generic-response")
public ResponseEntity<?> getGenericResponse(@RequestParam boolean returnObject) {
    if (returnObject) {
        return ResponseEntity.ok(new MyResponse("generic", 789));
    } else {
        return ResponseEntity.ok("This is a plain text response");
    }
}
```

<br>

---

<br>

### ■ 직렬화 실패의 원인

직렬화가 실패하는 일반적인 원인은 다음과 같다.

- **Getter가 없음**: Jackson은 기본적으로 getter 메서드를 통해 필드에 접근함. 필요한 getter가 없으면 해당 필드가 JSON에 포함되지 않음.

- **필드가 `transient` 또는 `static`**: Jackson은 기본적으로 `transient` 또는 `static` 필드를 직렬화하지 않음.

- **순환 참조**: 객체 간의 순환 참조가 존재하면 `StackOverflowError`가 발생할 수 있음.

- **Jackson이 지원하지 않는 타입**: 특정 타입(Java 객체)이 기본적으로 JSON으로 변환될 수 없는 경우. (예: `Optional`, `Object` 타입)

<br>

---

<br>

### ■ 정리
| 사용법             | 직렬화 동작             | 사용 목적                       |
|-------------------|-----------------------|--------------------------------|
| `@ResponseBody`   | 자동 JSON 직렬화        | 간단한 응답 생성                 |
| `@RestController` | 자동 JSON 직렬화        | API 개발 시 주로 사용             |
| `ResponseEntity`  | 자동 JSON 직렬화 (직접 제어 가능) | 상태 코드, 헤더 제어 필요할 때       |
| `ResponseEntity<?>` | 동적 응답 처리 가능     | 응답 타입이 상황에 따라 달라질 때     |


