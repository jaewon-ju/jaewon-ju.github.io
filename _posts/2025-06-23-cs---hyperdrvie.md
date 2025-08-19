---
title: "[CS 지식] HyperDrvie"
description: "Cloudflare의 기능중 하나인 HyperDrive에 대해서"
date: 2025-06-23T08:12:42.138Z
tags: ["CS 지식"]
slug: "CS-지식-HyperDrvie"
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:05:54.834Z
  hash: "ae5ead9f5b05945b4ed545f8ac0d2c6d5449b964588548cfef90a1f0f1d81e2c"
---

### Cloudflare Workers 
환경에서 PostgreSQL 데이터베이스에 접근할 때 가장 큰 병목 중 하나는 TCP 연결 시간이다. Workers는 요청마다 콜드스타트를 동반하며, 매번 TCP 핸드셰이크를 수행해야 한다. 이로 인해 단순 SELECT 쿼리조차 평균 500ms 이상의 지연이 발생하는 경우가 많다.

이를 해결하기 위해 Cloudflare Hyperdrive를 적용했고, 그 결과 단순 조회는 평균 10ms 내외, INSERT는 약 200ms 수준까지 응답 속도를 줄이는 데 성공했다. 이 글은 Hyperdrive의 개념부터 적용 방법, 그리고 성능 개선 결과까지 정리한 실전 도입 사례다.

<br>

---

## ✏️ Hyperdrive란?

### ◻️ 개요
>#### HyperDrive
: Cloudflare에서 제공하는 SQL 연결 최적화 레이어다. 

- PostgreSQL 또는 MySQL과 같은 전통적인 관계형 데이터베이스는 TCP 소켓을 통해 통신하는데, 이때 매 요청마다 발생하는 연결 지연을 Hyperdrive가 해결한다.
- Hyperdrive는 전역에 배포된 Cloudflare 인프라 내에서 연결을 사전 생성 및 풀링하고, 쿼리를 캐싱 및 릴레이하여 요청-응답 시간을 최소화한다. 

<br>

### ◻️ 기존 구조의 문제점
- Workers는 상태 없는 실행 환경이기 때문에 매번 새로운 TCP 핸드셰이크가 발생
- PostgreSQL 드라이버는 TLS 설정 등으로 인해 초기 연결에 수백 ms 소요
- 하나의 함수에서 두 번 이상 DB 접근 시, 두 번째 요청부터는 커넥션이 재사용되어 속도는 빨라지지만 첫 요청의 지연은 불가피

<br>

### ◻️ Hyperdrive는 이 문제를 다음과 같이 해결한다.

1. Cloudflare 네트워크 상에 전역으로 배포된 노드에서 DB 연결을 <span style="color:red">풀링</span> 및 유지
2. 자주 수행되는 쿼리에 대해 <span style="color:red">스마트 캐싱</span> 전략을 활용하여 RTT를 제거

<br>

---

<br>

## ✏️ Hyperdrive 적용 방법

#### 1. Hyperdrive 설정 생성

```bash
npx wrangler hyperdrive create hyperdrive-config \
  --connection-string="postgres://USER:PASSWORD@HOST:5432/DB"
```

이 명령을 실행하면 Hyperdrive 설정 ID가 출력된다.

<br>


#### 2. wrangler.toml 파일에 바인딩 추가
```json
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-08-21"
compatibility_flags = ["nodejs_compat"]

[hyperdrive]
binding = "HYPERDRIVE"
id = "<생성된 Hyperdrive ID>"
```

<br>

#### 3. 타입 선언 파일 생성
```bash
npx wrangler types
```

<br>

#### 4. Worker 코드 수정
```ts
import postgres from 'postgres'

export default {
  async fetch(request, env, ctx) {
    const sql = postgres(env.HYPERDRIVE.connectionString)

    const data = await sql`SELECT * FROM users LIMIT 1`;
    return new Response(JSON.stringify(data));
  }
}
```

<br>

#### 5. 배포
```bash
npx wrangler deploy
```

<br>

