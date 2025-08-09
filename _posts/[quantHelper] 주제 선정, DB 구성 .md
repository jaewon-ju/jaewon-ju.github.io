---
title: "[quantHelper] 주제 선정, DB 구성 "
description: "사이드 프로젝트 시작"
date: 2024-04-04T13:53:03.644Z
tags: ["프로젝트"]
slug: "프로젝트-주식-분석-어플리케이션"
thumbnail: "https://velog.velcdn.com/images/jaewon-ju/post/4e4a0074-c4e0-4828-86e4-a19867f0f274/image.png"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:34.593Z
  hash: "2f4fc04d97b2b231bddf06fb28eb335c8e866777ce629b4bf064b6d02ce86154"
---

첫 프로젝트에 대한 기록
## 📋 주제: 주식 투자를 위한 데이터 수집 및 분석

### ■ 기술 스택,
- 백엔드 서버, DB, 서버, 크롤링 서버(임시)

- 백엔드: spring boot	
	- MVC, LomBok, 0slf4j, hibernate, JPA
    - DB: postgresql, 객체 DB (aws s3, mongoDB)
    - 서버: 개인 노트북, EC2, GCP
    - 크롤링 서버: python(fastapi)
     
일정: 화요일 저녁 8시 => 중간 점검 형태 => 진행 상황, 못한 부분, 완료 사항 적어오기 


### ■ DB 구성
User
- PK user_id
- password
- status
- permission
- stock_list
- interested_stock_list
- budget
- Authentication => O 

Stock
- PK stock_id
- stock_name
- price
- theme
- stock_price_index
- status
   
Corperate_Information
- PK id  
- FK stock_id
- corporation_name
- foundation_date
- market_capitalization
- max_price_year
- min_price_year

financial statement
- PK id
- FK ci_id
- year
- quarter
=> TODO

Stock_price
- FK stock_id
- date
- max_price_day
- min_price_day
- open_price
- close_price
- trading_volume

News
- FK stock_id
- title
- content
- is_공시 Boolean
- created_at

Closed_day
- year
- closed_days => List json




python으로 크롤링해오기
API 있는지 확인해보기

토요일 1시 30분
Google meet

### ■ 주가 예상 방법
사용성을 3가지 중 하나로

1. 기업 가치 분석 
재무제표 분석: PER  10 이상,ROE, ROA, 영업이익, 단기 순 이익, 매출액
뉴스 키워드 잡기

2. 차트 분석 - 이동평균선 200일 선 위에있는 것, 거래량
3. 둘 다 분석

>단기인지 중기인지 장기인지 선택한 후,
그 안에서 기업 가치 분석인지 차트 분석인지 정하도록 하자.
차트 분석을 사용한다면, 이동퍙군선 3개정도 설정하고 정배열인지 역배열인지 분석하기
