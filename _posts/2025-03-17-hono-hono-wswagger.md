---
title: "[Hono] Hono W/Swagger"
description: "Hono와 Swagger를 통합하는 방법. #Hono_Framework #Hono_with_swagger #Hono_OpenAPI"
date: 2025-03-17T06:20:22.516Z
tags: ["Hono","Swagger"]
slug: "Hono-Hono-WSwagger"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:52.614Z
  hash: "daf8936d289f3da3177b29b82bf843b8d39bfca9aec3fcc98c101623d6ceeb5e"
---

## ✏️ Hono에 Swagger 통합하기  
`@hono/zod-openapi`를 사용하면 `zod` 스키마를 활용하여 쉽게 API 문서를 작성할 수 있다.

> #### zod란?
: TypeScript 및 JavaScript에서 스키마 검증과 타입 안전성을 제공하는 라이브러리이다. 
주로 API 요청/응답 데이터 검증, 폼 데이터 유효성 검사, TypeScript 타입 유추 등에 사용된다.

<br>

### ◼︎ 아키텍쳐

현재 프로젝트 구조는 다음과 같다.
```
my-hono-app/
│── src/
│   ├── controllers/
│   ├── routes/
│   	  ├── index.ts
│   	  ├── users-route.ts
│   	  ├── teams-route.ts
│   	  ├── ...
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── index.ts
│── package.json
│── tsconfig.json
```

이 프로젝트에는 약 90개 이상의 API가 존재하므로, 하나의 파일에서 API 명세를 다 작성하는 것은 가독성이 떨어진다.
따라서, 기능별 route 파일 내에서 관련 API 명세를 각각 정의하도록 구성한다.


<br>

### ◼︎ Swagger 적용 방법

**API End Point는 이미 만들어져 있다고 가정한다. 즉, 비즈니스 로직은 이미 작성됨**

1. `@hono/zod-openapi` 패키지 설치
2. `zod-openapi`를 사용하여 요청 및 응답 스키마를 정의
3. 기존 API 엔드포인트에 OpenAPI 문서화 코드 적용
4. Swagger UI를 통해 OpenAPI 문서를 확인할 수 있도록 엔드포인트 추가

아래에서 자세히 알아보자.

<br>

---

<br>

#### 1. 패키지 설치  

```sh
npm install @hono/zod-openapi
```

<br>

---

<br>

#### 2. 요청 및 응답 스키마 정의
현재 files 관련 router와 controller는 아래와 같이 구성되어 있다.

```ts
// files-route.ts
const filesRouter = new Hono();

filesRouter.get('/:fileId', getFileByFileId);
```
```ts
// files-controller.ts
export const getFileByFileId = async (c: Context) => {
  try {
    const fileId = c.req.param('fileId');

    const response: DefaultResponse =
      await FilesService.getFileByFileId(fileId);
    return c.json(response);
  } catch (error) {
    return c.json({
      code: '500',
      message: 'Internal server error',
    });
  }
};

// FilesService.getFileByFileId에는 비즈니스 로직이 작성되어 있음
```


getFileByFileId를 호출하기 위해서는 `fileId`가 파라미터로 전달되어야 한다.

zod를 사용하여 요청 스키마와 응답 스키마를 정의한다.

```ts
import { z } from '@hono/zod-openapi'

export const FileRequestSchema = z.object({
  fileId: z.string().openapi({ example: "abc123" }),
});

export const FileResponseSchema = z.object({
  code: z.string().openapi({ example: "200" }),
  message: z.string().openapi({ example: "Success" }),
  data: z.any().openapi({ description: "파일 객체" }),
});
```

<br>

---

<br>


#### 3. OpenAPI 문서화 코드 적용

기존에 `route/files-route.ts`에 존재하던 `filesRouter.get('/:fileId', getFileByFileId);` 코드를 삭제하고 아래와 같이 OpenAPI와 통합된 코드를 작성한다.

```typescript
// routes/files-route.ts
...

const filesRouter = new OpenAPIHono();

const getFileRoute = createRoute({
  method: "get",
  path: "/:fileId",
  request: {
    params: FileRequestSchema,
  },
  responses: {
    200: {
      description: "파일 정보를 반환",
      content: {
        "application/json": {
          schema: FileResponseSchema,
        },
      },
    },
    404: {
      description: "파일을 찾을 수 없음",
      content: {
        "application/json": {
          schema: z.object({
            code: z.string().openapi({ example: "404" }),
            message: z.string().openapi({ example: "File not found" }),
          }),
        },
      },
    },
    500: {
      description: "서버 오류",
      content: {
        "application/json": {
          schema: z.object({
            code: z.string().openapi({ example: "500" }),
            message: z.string().openapi({ example: "Internal server error" }),
          }),
        },
      },
    },
  },
});

// OpenAPI 문서화 및 라우팅 적용
filesRouter.openapi(getFileRoute, getFileByFileId); // 매개변수[0]: OpenAPI 스키마가 포함된 API 엔드포인트 정의, 매개변수[1]: 핸들러


```

<br>

---

<br>

#### 4. Swagger UI 엔드포인트 추가

```ts
// routes/index.ts
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})
```

이제 `/doc` 엔드포인트에 접근하면 문서화된 API 명세를 확인할 수 있다.
Swagger UI를 통해 확인/테스트를 하고 싶다면 다음과 같이 SwaggerUI 설정을 추가한다.

```ts
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

app.get('/swagger', swaggerUI({ url: '/doc' }))
```

<br>

>#### Authentication을 추가하고 싶다면?
```ts
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
app.get('/swagger', swaggerUI({ url: '/doc' }))
```



