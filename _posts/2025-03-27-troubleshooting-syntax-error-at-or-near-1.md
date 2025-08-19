---
title: "[TroubleShooting] syntax error at or near $1"
description: "TroubleShooting - syntax error at or near $1"
date: 2025-03-27T07:22:39.246Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-syntax-error-at-or-near-1"
categories: TroubleShooting
velogSync:
  lastSyncedAt: 2025-08-19T08:36:49.734Z
  hash: "a2dd8f35c06c225f87bfd12254d516544a32a62342699a8f5e93cfd245a973bc"
---

### 오류 상황

Cloudflare Workers 환경에서 PostgreSQL을 `postgres(c.env.SUPABASE_TRANSACTION_URL)` 방식으로 연결해 사용 중, 결제 목록을 정렬해서 가져오는 API에서 예상치 못한 SQL 오류가 발생했다.

---

### ✏️ 오류 발생 코드

```ts
const payments: paymentsRowType[] = await sql`
  SELECT * FROM payments
  ORDER BY created_at ${sort === 'asc' ? 'ASC' : 'DESC'}
`;
```

<br>

---

<br>

### ✏️ 원인

`postgres` SQL 클라이언트에서 템플릿 리터럴 내 `${}`는 **값(value)**을 바인딩하는 용도이며, SQL 키워드(예: `ASC`, `DESC`)나 컬럼명을 이 자리에 넣으면 실제 쿼리에서는 `$1`, `$2` 등으로 치환된다.

즉, 위 코드는 아래와 같은 형태로 실행된다.

```sql
SELECT * FROM payments ORDER BY created_at $1
```

PostgreSQL에서는 `$1` 자리에 `ASC`나 `DESC` 같은 키워드를 넣는 것을 허용하지 않기 때문에, `syntax error at or near "$1"` 오류가 발생한다.

<br>

---

<br>

### ✏️ 해결방법

조건 분기를 통해 템플릿 리터럴 자체를 분기 처리하면 바인딩 오류를 방지할 수 있다.

```ts
const payments: paymentsRowType[] =
  sort === 'asc'
    ? await sql`SELECT * FROM payments ORDER BY created_at ASC`
    : await sql`SELECT * FROM payments ORDER BY created_at DESC`;
```

- `${}`를 사용하지 않고 정적인 SQL로 처리한다.
- `sql.raw`, `sql.unsafe` 등은 사용하지 않아도 된다.

<br>

>최종 코드

```ts
const payments: paymentsRowType[] =
  sort === 'asc'
    ? await sql`SELECT * FROM payments ORDER BY created_at ASC`
    : await sql`SELECT * FROM payments ORDER BY created_at DESC`;
```


