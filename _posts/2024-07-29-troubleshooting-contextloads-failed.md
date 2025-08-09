---
title: "[TroubleShooting] contextLoads() FAILED
"
description: "test 오류"
date: 2024-07-29T08:23:05.982Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-contextLoads-FAILED"
series:
  id: 3530ae60-5e2d-416b-9327-13c5e62bf4c7
  name: "TroubleShooting"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:53.828Z
  hash: "6ea19b2ee5d945963ab307a43fab3a52aca682946a10ffddf9e4f738ffabb116"
---

## 오류
Github Actions를 통해서 CI/CD 작업을 수행하기 위해 yml 파일을 작성했다.
근데 실행시키면 test 쪽에서 오류가 발생했다.

```
AppApplicationTests > contextLoads() FAILED
    java.lang.IllegalStateException at DefaultCacheAwareContextLoaderDelegate.java:180
        Caused by: org.springframework.beans.factory.BeanCreationException at AbstractBeanFactory.java:326
            Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException at ConstructorResolver.java:795
                Caused by: org.springframework.beans.factory.BeanCreationException at ConstructorResolver.java:648
                    Caused by: org.springframework.beans.BeanInstantiationException at SimpleInstantiationStrategy.java:177
                        Caused by: org.springframework.boot.autoconfigure.jdbc.DataSourceProperties$DataSourceBeanCreationException at DataSourceProperties.java:186
```

<br>

>#### 난 테스트 작성도 안했는데?

오류 메시지에 DataSource 와 관련된 내용이 있어서, postgreSQL 문제인줄 알고 그 쪽을 해결하려 했다.

현재 개발 환경은 postgreSQL(Docker), JDK21, gradle 이다.
시도해 본 것들은 다음과 같다.

- ```application-test.yml``` 파일 생성해서 DataSource 업데이트
- ```build.gradle```에 의존성 추가
- docker-compose 수정...

하지만, 모두 실패했다.
그러다가 정말 어처구니 없는 해결방법을 발견했다.


<br>

## 해결방법
Spring Boot 어플리케이션을 처음 생성하면 ```...ApplicationTests``` 라는 클래스를 자동적으로 생성해주고 ```@SpringBootTest``` 어노테이션을 붙여놓는다.


```@SpringBootTest``` <span style = "background-color: lightgreen; color:black">어노테이션을 없애기만 하면 해결된다!</span>
물론, 단위 테스트를 아무것도 작성하지 않았을 때만 가능한 해결방법이다.