---
title: "[Nodejs] Prisma"
description: "What is Prisma"
date: 2025-03-13T01:08:55.346Z
tags: ["nodejs","prisma"]
slug: "Nodejs-Prisma"
categories: Nodejs
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:05:57.726Z
  hash: "c1ea20e34dccf60fd9b0d76b7f33e702c030b77025839136d5e95b0c2c140ec6"
---

## 들어가기 전에..
필자는 Java 환경에서 JPA를 사용해본 경험이 있다.
따라서, Prisma를 JPA와 비교하여 설명하는 부분이 있을 수 있다.
JPA에 대해 공부하고 싶다면 [JPA 포스트](https://velog.io/@jaewon-ju/Spring-JPA-JPA-%EC%86%8C%EA%B0%9C)를 참고하면 좋을 듯하다.

---

<br>

## ✏️ Prisma 란

>#### Prisma
>: Node.js & TypeScript 환경에서 사용하는 ORM(Object-Relational Mapping) 라이브러리

- 데이터베이스의 테이블을 객체처럼 다룰 수 있다.
- SQL 쿼리를 작성하지 않고도 데이터베이스 작업을 수행할 수 있다.
- **TypeScript 지원**을 통해 타입 안전성이 뛰어나다.
- **Prisma Client**를 사용하여 간단한 API로 DB 조작 가능.

<br>

### ■ 기능

Prisma는 다음과 같은 기능을 제공한다.

1. **Schema 정의**: 데이터베이스 테이블을 Prisma 모델로 정의한다.
2. **자동 마이그레이션**: DB 스키마 변경을 자동화하여 유지보수를 용이하게 한다.
3. **CRUD 메서드 제공**: Prisma Client를 통해 SQL 없이 데이터를 조작할 수 있다. (JPA의 `JpaRepository`와 비슷한 기능이다!)
4. **관계 설정**: 1:1, 1:N, N:M 관계를 명확하게 설정 가능.
5. **데이터베이스 확장성**: PostgreSQL, MySQL, SQLite 등 다양한 DB를 지원한다.

<br>

### ■ JPA와의 차이점

| 차이점 | JPA | Prisma |
| - | - | - |
| 객체 생성 | `@Entity` 어노테이션을 사용하여 엔티티 클래스를 정의 | `schema.prisma` 파일에서 모델 정의 |
| 관계 설정 | `@OneToMany`, `@ManyToOne` 등의 어노테이션 사용 | `@relation`을 사용하여 관계 설정 |
| CRUD | `JpaRepository`를 상속받아 메서드 제공 | Prisma Client에서 `findMany`, `create` 등 메서드 제공 |
| 마이그레이션 | `hibernate.hbm2ddl.auto` 사용 | `prisma migrate` 명령어 사용 |

이 밖에도 다양한 차이점이 존재한다.

<br>

---

<br>

## ✏️ 사용방법
JPA의 경우, 아래와 같은 순서로 개발을 진행한다.

> #### JPA
1. 프로젝트 설정
2. Entity 정의
3. DTO 정의 (생략 가능)
4. Repository 정의
5. Service 정의
6. Controller 연결

<br>

Prisma는 어떨까? 다음과 같은 순서로 진행된다.

> #### Prisma
1. 프로젝트 설정
2. Schema 정의
3. Prisma Client 생성
4. Service 정의
5. Controller 연결
6. 애플리케이션 실행

각 과정을 자세히 알아보자.

<br>

### 1. 프로젝트 설정
Node.js 프로젝트를 설정하고 Prisma 패키지를 설치한다.

```bash
npm init -y
npm install @prisma/client prisma
```

그런 다음, Prisma 초기화를 수행한다.
```bash
npx prisma init
```

위 명령어를 실행하면 `prisma/schema.prisma` 파일이 생성된다.

<br>

### 2. Schema 정의
`schema.prisma` 파일에서 데이터 모델을 정의한다.

```sql
model User {
  id        Int     @id @default(autoincrement())
  username  String @unique
  email     String @unique
  posts     Post[]
}

model Post {
  id        Int    @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User   @relation(fields: [authorId], references: [id])
}
```

이제 Prisma CLI를 사용하여 데이터베이스를 마이그레이션한다.
```bash
npx prisma migrate dev --name init
```

<br>

### 3. Prisma Client 생성
Prisma Client를 사용하여 DB를 조작하기 위해 다음을 실행한다.
```bash
npx prisma generate
```
그리고 코드에서 Prisma Client를 불러온다.

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
```

<br>

### 4. Service 정의
비즈니스 로직을 처리하는 서비스 계층을 정의한다.

```typescript
import prisma from '../prisma';

class UserService {
  async createUser(data) {
    return await prisma.user.create({ data });
  }

  async getUserById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }
}

export default new UserService();
```

<br>

### 5. Controller 연결
Express를 사용하여 요청을 처리한다.

```typescript
import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {
  async createUser(req: Request, res: Response) {
    const user = await userService.createUser(req.body);
    res.json(user);
  }

  async getUserById(req: Request, res: Response) {
    const user = await userService.getUserById(parseInt(req.params.id));
    res.json(user || { message: 'User not found' });
  }
}

export default new UserController();
```

<br>

### 6. 애플리케이션 실행
`server.ts` 파일을 작성하여 Express 서버를 실행한다.

```typescript
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
```

이제 `npm run dev`를 실행하여 서버를 시작하면 Prisma ORM을 사용할 수 있다!

---

<br>

## ✏️ 연관 관계 매핑
JPA는 `@OneToMany`, `@ManyToOne` 어노테이션을 사용하고,
Prisma는 `@relation()`을 사용하여 관계를 정의한다.

### **1:N 관계 예시**
```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id      Int  @id @default(autoincrement())
  userId  Int
  user    User @relation(fields: [userId], references: [id])
}
```

이제 `prisma.user.findMany({ include: { posts: true } })`를 사용하여 데이터를 조회할 수 있다!

Prisma를 사용하면 간단하고 직관적으로 ORM을 활용할 수 있다. 

<br>

---

<br>

## ✏️ Prisma Query Extension

>Prisma의 **Query Extension**
: 기본적인 Prisma Client의 동작을 확장하고 수정할 수 있는 기능이다. 
이를 활용하면 특정 모델에 대한 쿼리를 가로채고, 추가적인 로직을 실행할 수 있다.


- **쿼리 실행 전후로 추가적인 로직을 실행할 수 있다.**
- **특정 모델에만 적용할 수 있다.**
- **Prisma의 기본 `findUnique`, `update`, `delete` 등의 동작을 커스텀할 수 있다.**

이 기능을 활용하면 Firestore의 `onUpdate` 트리거와 유사한 기능을 Prisma ORM에서 직접 구현할 수 있다.

<br>

### ◼︎ 기본 문법

Prisma Client의 `$extends()`를 사용하여 Query Extension을 정의할 수 있다.

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async findUnique({ args, query }) {
        console.log('Before fetching user:', args);
        
        const result = await query(args);
        
        console.log('After fetching user:', result);
        return result;
      },
    },
  },
});
```

- **`args`** → 원래 Prisma 메서드에 전달되는 매개변수
- **`query(args)`** → Prisma의 기본 동작 실행
- **쿼리 실행 전후로 추가적인 로직을 실행할 수 있음**

<br>

### ◼︎ Query Extension 활용 예시

#### 1. `findUnique` 실행 시 특정 필드 자동 포함

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async findUnique({ args, query }) {
        // 항상 email을 포함하도록 수정
        args.select = { ...args.select, email: true };
        return query(args);
      },
    },
  },
});
```

 **사용 예시**
```typescript
const user = await prisma.user.findUnique({ where: { id: '123' } });
console.log(user.email); // `email` 필드가 항상 포함됨
```

---

#### 2. `update` 실행 시 특정 필드 변경 감지 (Firestore `onUpdate` 대체)

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async update({ args, query }) {
        const beforeUpdate = await prisma.user.findUnique({ where: args.where });
        const updatedUser = await query(args);

        if (beforeUpdate?.isActive && !updatedUser.isActive) {
          await prisma.logs.create({
            data: {
              userId: updatedUser.id,
              message: 'User deactivated',
              createdAt: new Date(),
            },
          });
        }
        return updatedUser;
      },
    },
  },
});
```


---

#### 3. Soft Delete 구현

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async delete({ args, query }) {
        return prisma.user.update({
          where: args.where,
          data: { deletedAt: new Date() },
        });
      },
    },
  },
});
```

**사용 예시**
```typescript
await prisma.user.delete({ where: { id: '123' } });
// 실제로는 `deletedAt`이 업데이트될 뿐 데이터가 삭제되지 않음.
```

