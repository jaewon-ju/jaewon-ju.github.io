---
title: "[quantHelper] 개발 - Repository"
description: "3일차"
date: 2024-04-07T14:46:06.344Z
tags: ["프로젝트"]
slug: "프로젝트-3일차"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.476Z
  hash: "6200fa4c17111de0a40af49ec7bfa37eb3466f98d4831784d23223a7af2787fd"
---

## 기능 추가

### 1. 주식 정보 받아서 저장

유저에게 
- StockId
- StockName
- price
- theme
- stockPriceIndex
- status

정보를 받아서 StockDTO 객체로 만든다.
만든 객체를 Entity로 바꾸어서 stockRepository에 저장한다.
== Stock 테이블에 저장한다.

하지만 여기서 문제가 발생한다.
DTO를 Entity로 바꿀 때 ```toEntity``` 메소드를 호출하는데, 그 내용은 다음과 같다.
```java
    public Stock toEntity(){
        return Stock.builder()
                .stockName(stockName)
                .price(price)
                .theme(theme)
                .stockPriceIndex(stockPriceIndex)
                .status(status)
                .build();
    }
```

stockId에 관한 내용이 빠져있다.
즉 Entity를 만들때 stockId를 주입하지 않는다는 것이다.
stockId는 PK이므로 반드시 필요하다.

그래서, Entity인 ```Stock``` 클래스의 builder 메소드를 수정하고, DTO도 아래와 같이 수정했다.
```java
    public Stock toEntity(){
        return Stock.builder()
        		.stockId(stockId)
                .stockName(stockName)
                .price(price)
                .theme(theme)
                .stockPriceIndex(stockPriceIndex)
                .status(status)
                .build();
    }
```


<br>

### 2. 주식 정보를 주식 이름으로 조회
이전 포스트에서 JPA Repository를 extends한 리포지토리 인터페이스는 내용을 작성하지 않아도 된다고 했었다.
> 그럼 repository의 기능을 추가하고 싶다면 어떻게 해야할까?

"그냥 내가 새로운 메소드를 만들면 되지 않을까?" 했었는데, 생각해보니 리포지토리는 인터페이스였다...
그럼, 어떤 방식으로 확장할 수 있을까?

개발자가 "특정 형식"에 맞춰서 메소드를 정의하기만 하면, JPA가 알아서 메소드 내용을 구현해준다.

- Prefix: 메소드 이름의 첫 부분에는 접두사(prefix)가 있다. 접두사는 find, read, get, count, exists, delete, remove 등이 있다.
- By: 이후에는 By 키워드가 온다. 이는 필드명을 기준으로 조건을 지정할 때 사용된다.
- Entity Field: 그 다음에는 엔티티의 필드명이 온다.
- Optional Condition: 필드명 다음에는 선택적인 조건이 온다. 이 조건은 And, Or 등의 키워드를 사용하여 여러 필드를 조합할 수 있다.

<br>

주식이름(StockName)을 넣으면 해당 주식 정보를 저장한 StockDTO를 반환하는 코드를 작성하고, 테스트했다.

```java
    public StockDTO findByStockName(String stockName){
        Stock stock = stockRepository.findByStockName(stockName);
        return StockDTO.builder()
                 .stockId(stock.getStockId())
                 .stockName(stock.getStockName())
                 .price(stock.getPrice())
                 .theme(stock.getTheme())
                 .stockPriceIndex(stock.getStockPriceIndex())
                 .status(stock.getStatus())
                 .build();
    }
```