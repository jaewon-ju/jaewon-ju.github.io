---
title: "[TroubleShooting] IllegalStateException, HttpMediaTypeNotSupportedException"
description: "IllegalStateException과 HttpMediaTypeNotSupportedException"
date: 2024-10-03T12:56:03.982Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-IllegalStateException-HttpMediaTypeNotSupportedException"
categories: TroubleShooting
velogSync:
  lastSyncedAt: 2025-08-19T08:36:50.497Z
  hash: "e825716962bebaad053f04fbbbe997a43626c39a7a3b9e2267bf09325b40b702"
---

### 1. IllegalStateException
>java.lang.IllegalStateException: Cannot resolve parameter names for constructor


해결방법: DTO에 @NoArgsConstructor 넣기

- 즉, 기본 생성자를 만들어준다.
- ```@ModelAttribute```는 기본 생성자로 객체를 만들고 값을 set하는 방식이다.
따라서, DTO에 기본 생성자가 존재해야 ```@ModelAttribute```를 사용할 수 있다. 

<br>

### 2. HttpMediaTypeNotSupportedException
```java
@PostMapping
    public ResponseEntity<String> uploadPhoto(@RequestPart("file") MultipartFile file, @RequestBody PhotoRequest request) {
        try {
            UUID id = UUID.fromString(request.getId());
            ...
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload file: " + e.getMessage());
        }
    }
```

위의 uploadPhoto 메소드를 실행했더니 다음과 같은 오류가 발생했다.
```
Resolved [org.springframework.web.HttpMediaTypeNotSupportedException:
Content-Type 'multipart/form-data;boundary=--------------------------440780948424522369548408;
charset=UTF-8' is not supported]
```


<br>

해결방법: ```@RequestBody```를 ```@ModelAttribute```로 변경하고, `MultipartFile` 을 `PhotoRequest` 의 매개변수로 넣는다.

- 파일 업로드와 함께 JSON 데이터를 동시에 처리하는 요청을 보낼 때 ```@RequestBody```를 통해 데이터를 받을 수 없다.
- ```@RequestBody```는 HTTP 요청 본문을 하나의 JSON 객체로 처리하는 반면, 파일 업로드는 multipart/form-data 형식을 사용하기 때문이다.

- 반면 ```@ModelAttribute``` 는 multipart/form-data를 포함하여 모든 폼 데이터를 객체에 바인딩할 수 있는 메커니즘을 제공한다.
