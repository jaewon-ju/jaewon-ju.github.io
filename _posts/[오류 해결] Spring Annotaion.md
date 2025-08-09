---
title: "[오류 해결] Spring Annotaion"
description: "Annotaion 기술을 포함한 WAS 서버가 안돌아갈 때"
date: 2024-03-29T07:32:17.297Z
tags: ["오류"]
slug: "오류-해결-Spring-Annotaion"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.742Z
  hash: "453569c10038fd672da17a44db60a5db2748f54f7929dfb92bae32484214e643"
---

오랜만에 새로운 스프링 프로젝트를 생성하고 돌려봤더니
```
2024-03-29T16:28:20.557+09:00  INFO 54183 --- [springmvc] [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2024-03-29T16:28:20.557+09:00  INFO 54183 --- [springmvc] [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2024-03-29T16:28:20.558+09:00  INFO 54183 --- [springmvc] [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms
```

이러한 로그만 뜨고, localhost에서는 404가 응답된다.

어노테이션도 바꿔보고, 폴더 위치도 변경해봤지만 작동하지 않았다.

<br>

## 해결 방법

간단하다.
애초에 어노테이션을 사용할 것이라고 Intellij에서 설정하지 않았던 것.
Settings - Annotaion Processors - Enable annotation processing 체크

문제 해결!