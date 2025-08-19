---
title: "[Spring Boot] Monitoring"
description: "서비스 모니터링을 위해 필요한 요소들"
date: 2024-05-21T06:04:38.239Z
tags: ["Spring","Springboot"]
slug: "Spring-Boot-Monitoring"
categories: Spring Boot
velogSync:
  lastSyncedAt: 2025-08-19T08:36:51.753Z
  hash: "0fb4396acf782a71633e90ed7aa6298093166b9e9faa0e3c0b73b50e32641118"
---

<center>본 포스트는 김영한 개발자님의 <a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트</a> 강의를 듣고 정리한 것입니다.<br> ※ 코드는 강의에서 사용된 것과 다릅니다.<br> <a href = https://github.com/jaewon-ju/Learning_Spring>jaewon-ju Github Address</a></center>


---


## ✏️ Micrometer
서비스를 운영할 때, 애플리케이션의 CPU, 메모리 사용, 요청 수 등의 지표(Metric)를 모니터링하는 것이 중요하다.


> Micrometer란 해당 지표들을 측정하여 추상화 시켜주는 표준화 도구이다.


- Micrometer가 없다면, 해당 지표들을 측정한 뒤에 각 모니터링 툴에 맞게 변환해야 한다.
   - 사용하는 모니터링 툴이 변경되면, 재변환이 필요하다.
- Micrometer를 사용하면, 모니터링 툴이 변경되더라도 구현체만 변경하고 코드는 그대로 유지할 수 있다.

<br>

---

<br>

## ✏️ 지표(Metric) 수집
CPU 사용량, 메모리 사용량, 요청 수 등의 지표를 수집해서 Micrometer에 등록해야 한다.
➜ Micrometer의 수집 기능 사용 or SpringBoot Actuator 사용

Micrometer와 Actuator가 기본으로 제공하는 지표는 다음과 같은 종류가 있다.

| Metric | 기능 |
| - | - |
| JVM metric | 메모리 및 버퍼 풀 세부 정보 제공 |
| System metric | CPU 지표, 가동 시간, 가용 디스크 공간 정보 제공| 
| Spring MVC metric | 스프링 MVC 컨트롤러가 처리하는 모든 요청 정보 제공 |
| Datasource metric | Datasource, 커넥션 풀에 관한 정보 제공|
| Log metric | logback 로그에 관한 정보 제공|
| ... |

<br>

---

<br>

## ✏️ 프로메테우스와 그라파나
> __프로메테우스__
: 메트릭을 지속해서 수집하고 저장하는 DB

> __그라파나__
: 프로메테우스에 존재하는 데이터를 그래프로 표시하는 도구

<br>

개발자가 서비스를 모니터링하는 구조는 다음과 같이 이루어진다.
![](https://velog.velcdn.com/images/jaewon-ju/post/1004ba13-19e3-49a8-940e-c166cb758f29/image.png)

개발자는 그라파나의 그래프를 보고 서비스를 모니터링할 수 있다.

<br>

### ■ 프로메테우스
프로메테우스가 애플리케이션의 메트릭을 수집하도록 연동해보자.

1. 애플리케이션 설정
   - build.gradle에 다음과 같이 코드 추가
   ```'io.micrometer:micrometer-registry-prometheus'```
   
   - Spring Boot와 액츄에이터가 자동으로 마이크로미터 프로메테우스 구현체를 등록해서 동작하도록 설정해준다.
   - http://localhost:8080/actuator/prometheus 엔드포인트가 생성된다.
2. 프로메테우스 설정
   - ```prometheus.yml``` 파일에 다음과 같은 내용 추가
```
- job_name: "spring-actuator"
  metrics_path: '/actuator/prometheus'
  scrape_interval: 1s
  static_configs:
	- targets: ['localhost:8080']
```

<br>

이제, http://localhost:9090/targets 에 들어가보면 연동된 metric을 확인할 수 있다.

<br>

### ■ 그라파나
그라파나는 DataSource만 연동하면 바로 사용할 수 있다.
DataSource를 Prometheus로 설정해야 한다. (http://localhost:9090)
<br>

- Pannel을 생성한 뒤에, 원하는 metric을 추가해서 모니터링 할 수 있다.
- https://grafana.com/grafana/dashboards 사이트에 접속해서 미리 만들어진 공개 대시보드를 다운받을 수 있다.
 
<br>

---

<br>

## ✏️ 사용자 정의 metric
특정 지표를 모니터링하고 싶다면, 직접 메트릭으로 등록하는 방법을 사용할 수 있다.

예를 들어, 도서관 좌석 관리 애플리케이션에서 좌석 예약, 반납, 남은 좌석 수를 메트릭으로 등록하는 경우를 생각해보자.

- 예약 수, 반납 수는 계속 증가하는 값이므로 카운터를 사용한다.
- 남은 좌석 수는 증가하거나 감소하므로 게이지를 사용한다.


> #### 카운터와 게이지
메트릭은 크게 카운터와 게이지 두 종류로 분류할 수 있다.
- 카운터: 단순하게 증가하는 단일 누적 값
- 게이지: 임의로 오르내릴 수 있는 값

<br>

```LibraryService``` 인터페이스
```java
public interface LibraryService {
    void reserveSeat();
    void returnSeat();
    AtomicInteger getSeats();
}
```

<br>

### ■ V0 - 좌석 예약, 반납 구현

```LibraryServiceV0``` 구현 클래스
```java
@Slf4j
@RequiredArgsConstructor
public class LibraryServiceV0 implements LibraryService {
    private final MeterRegistry registry;
    private AtomicInteger seats = new AtomicInteger(10);

    @Override
    public void reserveSeat() {
        log.info("예약");
        seats.decrementAndGet();
        
        // 카운터 메트릭으로 등록
        Counter.builder("my.reserve")
   				.tag("class", this.getClass().getName)
                .tag("method", "reserveSeat")
                .register(registry) // 만든 카운터를 MeterRegistry에 등록
                .increment(); // 카운터의 값을 하나 증가시킨다.
                
    }

    @Override
    public void returnSeat() {
        log.info("반납");
        seats.incrementAndGet();
        
        // 카운터 메트릭으로 등록
        Counter.builder("my.return")
   				.tag("class", this.getClass().getName)
                .tag("method", "returnSeat")
                .register(registry) // 만든 카운터를 MeterRegistry에 등록
                .increment(); // 카운터의 값을 하나 증가시킨다.
    }

    @Override
    public AtomicInteger getSeats() {
        return seats;
    }
}
```

- 위의 과정을 통해 좌석 예약과 반납 서비스 호출을 카운터 메트릭으로 등록했다.
- 메트릭을 관리하는 로직이 비즈니스 개발 로직에 침투했다.
➜ 스프링 AOP를 사용해서 해결 가능하다.

<br>

### ■ V1 - V0 개량
```LibraryServiceV1``` 구현 클래스
```java
...
    @Counted("my.reserve")
    @Override
    public void reserveSeat() {
        log.info("예약");
        seats.decrementAndGet();
    }

    @Counted("my.reserve")
    @Override
    public void returnSeat() {
        log.info("반납");
        seats.incrementAndGet();
    }
...
```

- ```@Counted("메트릭 이름")``` 을 적용했다.
- tag에 method를 기준으로 자동으로 분류되어 적용된다.
    - /reserve 호출 시 reserve 카운터 증가
    - /return 호출 시 return 카운터 증가
- 이 경우, ```LibraryServiceV1```를 빈으로 등록하는 Config 클래스에서 다음과 같은 코드를 추가해야 한다.
```java
@Bean
public CountedAspect countedAspect(MeterRegistry registry) {
	return new CountedAspect(registry);
}
```

<br>

### ■ V2 - 남은 좌석 수 구현
남은 좌석 수는 게이지로 구현한다.
게이지는 값의 현재 상태를 보는데 사용한다.

```java
	@PostConstruct
    public void init(){
        Gauge.builder("my.seat", libraryService, service ->{
            log.info("seat guage call");
            return service.getSeats().get();
        }).register(registry);
    }
```



<br>

---

<br>


## REFERENCE
<a href = "https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%ED%95%B5%EC%8B%AC%EC%9B%90%EB%A6%AC-%ED%99%9C%EC%9A%A9">스프링 부트 - 핵심 원리와 활용, 김영한 개발자님</a>
