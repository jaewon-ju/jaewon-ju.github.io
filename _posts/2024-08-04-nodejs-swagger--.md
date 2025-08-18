---
title: "[Nodejs] Swagger 연결"
description: "Swagger 연결 방법"
date: 2024-08-04T13:54:34.142Z
tags: ["nodejs"]
slug: "Nodejs-Swagger-연결"
series:
  id: fa4e953d-7f0e-45be-85cb-09bb3f09c5b5
  name: "Nodejs"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:50.347Z
  hash: "6784cbb17ad8b5c7f1d1af22746794471002e0eb23f3af3332d4ba4339997257"
---

Nodejs에서 Swagger를 사용하는 방법은 3가지가 있다.

1. 주석으로 작성하는 방법
2. ```swagger.json``` 파일을 사용하는 방법
3. swagger-autogen을 사용하는 방법

이 중에서 1,2번만 알아보도록 하자.

## ✏️ 주석 사용
```swagger-jsdoc```과 ```swagger-ui-express```를 사용하는 방법이다.

<br>

### 1. 패키지 설치
```
npm install express swagger-jsdoc swagger-ui-express
```

<br>

### 2. swagger 설정
swagger.js 파일을 다음과 같이 설정한다.
```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'A simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'], // API 문서화할 파일 경로
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
```

<br>

### 3. API 엔드포인트 설정
예를 들어, ```/board/info/posts``` 엔드포인트를 설정한다면, routes 폴더 아래에 ```infoBoardRoute.js``` 파일을 만들고 다음과 같이 작성한다.
```javascript
const express = require('express');
const infoBoardController = require('../controllers/infoBoardController');

const router = express.Router();

/**
 * @swagger
 * /board/info/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [InfoBoard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - title
 *               - content
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Name of the user
 *               title:
 *                 type: string
 *                 description: Title of the post
 *               content:
 *                 type: object
 *                 description: Content of the post
 *           examples:
 *             example1:
 *               summary: An example of a request body
 *               value:
 *                 user_name: "test_user"
 *                 title: "Test Title"
 *                 content: {"body": "Test Content"}
 *     responses:
 *       201:
 *         description: The post was successfully created
 *       500:
 *         description: Some server error
 */
router.post('/info/posts', infoBoardController.createPost);
```

<br>

### 4. Express 서버에 Swagger 통합
```javascript
const express = require('express');
const { swaggerUi, specs } = require('./swagger');
const app = express();
const PORT = process.env.PORT || 3000; // 기본 포트가 설정되어 있지 않으면 3000번 포트로 설정
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/board', infoBoardRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
```

<br>

---

<br>

## ✏️ swagger.json
미리 정의된 ```swagger.json``` 파일을 사용하여 API 문서를 제공하는 방법이다.

<br>

### 1. 패키지 설치
```shell
npm install swagger-ui-express
```

<br>

### 2. swagger.json 파일 작성
```swagger.json``` 파일을 사용하여 API 문서를 제공한다.
```swagger.json``` 파일을 원하는 위치에 생성하고, API 스펙을 정의한다.

```yml
{
  "openapi": "3.0.0",
  "info": {
    "title": "API Documentation",
    "version": "1.0.0",
    "description": "A simple API documentation"
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local server"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Retrieve a list of users",
        "responses": {
          "200": {
            "description": "A list of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "integer"
                      },
                      "name": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

<br>

### 3. app.js 설정
```swagger.json``` 파일을 읽어들여서 Swagger UI를 설정한다.

```javascript
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

// swagger.json 파일을 읽어들임
const swaggerFile = path.join(__dirname, 'swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

```





