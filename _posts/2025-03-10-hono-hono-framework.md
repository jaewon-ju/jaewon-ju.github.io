---
title: "[Hono] Hono Framework"
description: "웹 프레임워크인 Hono에 대한 소개. #Hono, #Hono_Framework, #Hono_Cloudflare_workers"
date: 2025-03-10T02:20:17.222Z
tags: ["Hono"]
slug: "Hono-Hono-Framework"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:52.660Z
  hash: "6127d9517c24f1cacd2240a222ba189dbfa02cbe5f5e53dbf688af2c6b30f0b1"
---

## ✏️ Hono: 초고속 웹 프레임워크

### ◼︎ Hono란?
> #### Hono 
: 웹 프레임워크로, **Cloudflare Workers 환경**에서 최적화되어 있다. 
Express.js와 유사한 API 스타일을 제공하지만, 더 가볍고 빠르게 동작한다.

<br>

#### 주요 특징
- **빠른 성능**: Express, Koa보다 훨씬 빠른 요청 처리 속도를 자랑함.
- **서버리스 & Edge 최적화**: Cloudflare Workers, Vercel Edge, Deno Deploy 등에서 원활히 실행 가능.
- **Express와 유사한 API**: 익숙한 `app.get()`, `app.post()` 등의 방식으로 개발 가능.
- **초소형 패키지**: 기본 패키지 크기가 **10KB 이하**로 매우 가볍다.
- **TypeScript 지원**: 기본적으로 TypeScript로 작성되어 있으며 강력한 타입 안전성을 제공함.

<br>

### ◼︎ 프로젝트 폴더 구조

```
my-hono-app/
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── index.ts
│── wrangler.toml
│── package.json
│── tsconfig.json
```

- **`src/controllers/`** → 요청을 처리하는 컨트롤러 정의
- **`src/routes/`** → 라우트 설정 파일
- **`src/services/`** → 비즈니스 로직을 담당하는 서비스 계층
- **`src/middleware/`** → 인증, 로깅 등의 미들웨어 정의
- **`src/utils/`** → 데이터 검증 등의 유틸리티 함수
- **`src/index.ts`** → 애플리케이션 엔트리 파일

<br>

이제 create user api를 예시로, 각 폴더에서 어떤 작업을 수행해야 하는지 알아보자.

#### `src/index.ts`
```ts
import { Hono } from 'hono'
import userRoute from './routes/userRoute'
import { authMiddleware } from './middleware/auth'

const app = new Hono()

app.use('/user/*', authMiddleware)
app.route('/user', userRoute)

export default app
```

<br>

#### `src/utils/validator.ts` 
```ts
export const validateUser = (data: any) => {
  if (!data.name || typeof data.name !== 'string') {
    return { success: false, error: 'Invalid name' }
  }
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Invalid email' }
  }
  return { success: true }
}
```


<br>


#### `src/services/user-service.ts`
```ts
import { validateUser } from '../utils/validator'

export const createUser = (data: any) => {
  // 비즈니스 로직 작성
  const validation = validateUser(data)
  if (!validation.success) {
    return { success: false, error: validation.error }
  }
  return { success: true, data }
}
```

<br>

#### `src/controllers/user-controller.ts` 
```ts
import { Context } from 'hono'
import { createUser } from '../services/user-service'
// Context는 HTTP 요청과 응답을 처리할 때 사용되는 객체이다.
// request parameter나 header 값을 가져올 때 사용할 수도 있고
// Json 또는 text 응답을 하도록 설정할 수도 있다.

export const createUserController = async (c: Context) => {
  const body = await c.req.json()
  const result = createUser(body)

  if (!result.success) {
    return c.json({ error: result.error }, 400)
  }

  return c.json({ message: 'User created successfully', user: result.data })
}
```

<br>

#### `src/routes/user-route.ts`
```ts
import { Hono } from 'hono'
import { createUserController } from '../controllers/user-controller'

const userRoute = new Hono()

userRoute.post('/', createUserController)

export default userRoute
```

<br>

#### `src/middleware/auth.ts` 
```ts
import { MiddlewareHandler } from 'hono'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
}
```



<br>

---

<br>

## ✏️ Hono W/Cloudflare Workers


### ◼︎ 프로젝트 설정
#### 1. `wrangler` CLI 설치
Cloudflare Workers에서 Hono를 사용하려면 `wrangler` CLI를 먼저 설치해야 한다.
```sh
npm install -g wrangler
```

#### 2. 프로젝트 생성
새로운 Cloudflare Workers 프로젝트를 생성한다.
```sh
wrangler init my-hono-app --type=javascript
cd my-hono-app
```

#### 3. Hono 설치
Hono 패키지를 프로젝트에 추가한다.
```sh
npm install hono
```

<br>

### ◼︎ Hono 애플리케이션 작성

#### 1. 기본 Hono 서버 코드
`src/index.ts` 또는 `src/index.js` 파일을 수정하여 Hono 애플리케이션을 생성한다.
```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello from Cloudflare Workers!')
})

export default app
```

#### 2. `wrangler.toml` 설정
Cloudflare Workers의 설정 파일인 `wrangler.toml`을 수정하여 프로젝트를 구성한다.
```toml
name = "my-hono-app"
compatibility_date = "2024-03-10"
```

<br>

### ◼︎ 로컬 테스트 및 배포

#### 1. 로컬 실행
Cloudflare Workers 환경에서 로컬로 실행하려면 다음 명령어를 실행한다.
```sh
wrangler dev
```

#### 2. Cloudflare Workers에 배포
```sh
wrangler publish
```
배포가 완료되면 제공된 URL을 통해 애플리케이션을 확인할 수 있다.

<br>

