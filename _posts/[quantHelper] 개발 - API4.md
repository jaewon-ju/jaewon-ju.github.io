---
title: "[quantHelper] 개발 - API4"
description: "10일차"
date: 2024-05-03T13:51:35.125Z
tags: ["프로젝트"]
slug: "주식-분석-어플리케이션-10일차"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.120Z
  hash: "da8da980816e115ceee37786580014d720cb7b41d43a26c0f6d8db7d0e32fe75"
---

### ■ 구현 내용

1. StockPriceRepository의 ```findStockPriceByStockAndDate()``` 메소드
2. StockPriceService의 ```getStockPriceDTOByStockIdAndDate()``` 메소드
   - stockId와 조회하려는 날짜를 받아서, DB에서 해당 주식의 가격 정보(StockPrice)를 검색
   - ```StockPriceDTO``` 형식으로 반환



3. 기간별 주식 가격 조회 기능 추가
   - 이전에는 특정 날짜(ex.20240415)의 가격 정보만 조회 가능했음
   - startDate ~ endDate까지의 가격 정보를 한꺼번에 조회할 수 있도록 기능 추가
   - <span style = "background-color: lightgreen; color:black">DB에 이미 가격 정보가 존재하는 경우</span>, KIS 서버에 요청하지 않고 DB에서 직접 가져온다.
   
``` java
   public ResponseEntity<ArrayList<StockPriceDTO>> stockPrice(@RequestBody GetStockPriceRequest request) throws JsonProcessingException {
        ... 생략

        // 조회하려는 데이터 중에, DB에 없는 날짜가 하나라도 포함되어 있다면? -> Kis 서버에 새로 요첨
        // 조회하려는 데이터가 모두 DB에 있다면? -> DB에서 가져와서 stockPriceDTOs에 넣어줌
        boolean findFromDB = true;

        for(LocalDate date : dates){
            if(!stockPriceService.isStockPriceExistByStockIdAndDate(stockId, date)){
                // DB에 존재하지 않는다면
                findFromDB = false;
                break;
            }
        }

        if(findFromDB){
            // 조회하려는 데이터가 모두 DB에 존재
            for(LocalDate date : dates) {
                StockPriceDTO stockPriceDtoDB = stockPriceService.getStockPriceDTOByStockIdAndDate(stockId, date);
                log.info("stockId: {},Date: {} data already exists in DB. Got Data From DB", stockId, date);
                stockPriceDTOs.add(stockPriceDtoDB);
            }
        } else {
            // 조회하려는 데이터 중, DB에 존재하지 않는 날짜가 하나라도 포함되어 있다면
            // startDate ~ endDate의 주식 정보 조회
            String stockPriceResponse = kisService.getStockPriceByCodeAndDate(stockCode, request.getStartDate(), request.getEndDate()).block();

            ... 중략
            
            }
        }
        return ResponseEntity.ok().body(stockPriceDTOs);

    }
```

<br>

4. 이동평균선 추가
   - StockPrice 테이블에 5일, 10일, 20일 이동평균선 필드 추가
   - 주식 가격 조회를 할 때, 이동평균선도 같이 계산해서 StockPrice테이블에 저장
   - 로직이 복잡함
   >  10일 이동평균선의 경우, 【 해당 날짜 ~ 해당 날짜 - 9 】 가격의 평균을 구해야 함.
   <br>위의 가격 정보들이 모두 DB에 존재하면
   ➜ 이동평균선을 계산할 필요 없이, 레코드를 가져오면 됨
   <br>위의 가격 정보들 중, 하나라도 DB에 존재하지 않는 경우
   ➜ KIS 서버에서 100일전까지의 가격 정보를 모두 땡겨옴
   땡겨온 가격 정보 + 가지고 있는 가격 정보로 이동평균선 계산
   - 왜 하필 100일전까지의 가격 정보가 필요한가?
   ➜ 20일 이동평균선까지만 계산한다 하면, 20일 전까지의 가격정보만 필요하다. 하지만, 혹시 100일 이동평균선까지 추가하게 될 상황을 고려하여 100일전까지로 설정해놓음
   <br>
   - 재귀를 사용하는게 편하지 않나?
   ➜ 예를 들어, SK하이닉스의 【 20240415 - 20240430 】 가격 정보를 조회하는 경우를 생각해보자.
   <br>
   1. 4월 15일 ~ 4월 30일까지의 가격 정보를 조회한다.
   2. 가격 정보를 조회할 때는 이동평균선까지 계산해서 하나의 레코드로 만들어야 한다.
   3. startDate(4월 15일)의 5일 이동평균선을 계산하려면 4월 11일 ~ 4월 15일까지의 가격이 필요하다.
   4. 만약, 4월 11일 ~ 4월 15일까지의 가격 정보가 없다면 KIS 서버에서 요청한다.
   5. 재귀를 사용한다면, 4월 11일, 4월 12일, ... , 4월 15일의 5일 이동평균선을 각각 구하는 로직이 똑같이 들어가게 된다.
   6. 4월 11일의 5일 이동평균선을 구하기 위해서는 4월 7일 ~ 4월 11일의 가격 정보 조회,
   4월 7일의 5일 이동평균선을 구하기 위해서는 4월 3일 ~ 4월 7일의 가격 정보 조회 ....
   무한 루프에 걸리게 된다.
   <br>
   
5. KisAccessToken 23시간마다 자동 갱신
   - ```@Scheduled``` 어노테이션 사용
   - 23시간마다 accessToken 필드가 자동으로 갱신되게 설정
   - Application에 ```@EnableScheduling``` 어노테이션을 추가해야 한다.
```java
@Component
@Slf4j
@Getter
public class KisAccessToken {
    private String accessToken;
    private final WebClient webClient;
    private final String baseUrl;
    private final String appKey;
    private final String appSecretKey;

    /**
     * 한국 투자 증권 API에 접근하기 위한 Access Token를 받아와서 빈 내부에 저장
     */
    public KisAccessToken(WebClient webClient,
                          @Value("${spring.kis-api.endpoint-url}") String baseUrl,
                          @Value("${spring.kis-api.app-key}")String appKey,
                          @Value("${spring.kis-api.app-secret-key}") String appSecretKey) throws JsonProcessingException {
        this.webClient = webClient;
        this.baseUrl = baseUrl;
        this.appKey = appKey;
        this.appSecretKey = appSecretKey;
        refreshAccessToken();  // 초기 토큰 로드
    }

    // 23시간마다 자동 갱신
    @Scheduled(fixedRate = 82800000, initialDelay = 82800000)
    public void refreshAccessToken() throws JsonProcessingException {
        Map<String, String> bodyMap = new HashMap<>();
        bodyMap.put("grant_type", "client_credentials");
        bodyMap.put("appkey", appKey);
        bodyMap.put("appsecret", appSecretKey);

        String fullUrl = baseUrl + "/oauth2/tokenP"; // 호스트와 경로를 조합
        Mono<String> monoAccess = webClient.post()
                .uri(fullUrl) // 전체 URL을 명시적으로 지정
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(bodyMap))
                .retrieve()
                .bodyToMono(String.class);

        String accessTokenJson = monoAccess.block();
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> AccessTokenMap = objectMapper.readValue(accessTokenJson, Map.class);
        accessToken = AccessTokenMap.get("access_token");
        log.info(accessToken);
    }
}
```


<br>

---

<br>

### ■ 배운점



1. GPT plugin(myGPT) 만드는 법
   - Swagger에서 제공하는 API 명세서를 MyGPT의 Actions에 넣어준다.
   - <span style = "color:red">LocalHost</span> 에서는 작동하지 않는다.
   - 해당 API를 어떤 상황에서, 어떤 방식으로 사용하면 되는지 Instructions에 상세히 작성한다.
   <br>
   
2. ```@Scheduled``` 어노테이션
   - ```@Scheduled``` 어노테이션을 사용하면, 특정 시간마다 동작하는 스케줄러를 구현할 수 있다.
   <br>
3. DB를 최대한 활용하자
   - API로 요청하는 것은 오버헤드가 크다.
   - DB에 원하는 데이터가 있는지 먼저 찾아보도록 하자.







