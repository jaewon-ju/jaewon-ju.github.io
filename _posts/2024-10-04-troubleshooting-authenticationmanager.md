---
title: "[TroubleShooting] authenticationManager"
description: "JWT 구현중 발생한 오류"
date: 2024-10-04T14:21:44.193Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-authenticationManager"
categories: TroubleShooting
velogSync:
  lastSyncedAt: 2025-08-19T08:36:50.433Z
  hash: "dc1f5295d019be0b86682d57f088b3da2175066877020818b4426bbbb969340d"
---

### authenticationManager must be specified
---
JWT를 구현하던 중 다음과 같은 오류가 발생했다.
```
Caused by: java.lang.IllegalArgumentException: authenticationManager must be specified
```

<br>

문제의 원인은 LoginFilter에 있었다.

```java
// 수정 전 
@Component
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }
	...
```

<br>


>#### 해결방법: ```@Component```를 제거한다.

LoginFilter 클래스에 @Component가 붙어 있으면 Spring은 이 클래스를 자동으로 빈으로 등록한다.
동시에 SecurityConfig에서 new LoginFilter(...)를 통해 필터를 수동으로 추가하고 있다. 즉, 이로 인해 LoginFilter가 두 번 생성되게 되고, 하나는 Spring 컨텍스트에서 자동 생성한 빈이고 다른 하나는 수동으로 생성된 인스턴스이다.
이 과정에서 AuthenticationManager가 제대로 주입되지 않게 되어 오류가 발생한다.