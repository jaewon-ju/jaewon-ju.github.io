---
title: "[Nodejs] Sequelize"
description: "Sequelize 연결 방법 및  사용 방법"
date: 2024-08-11T03:37:42.664Z
tags: ["nodejs"]
slug: "Nodejs-Sequelize"
categories: Nodejs
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:06:23.149Z
  hash: "bd5509d89499bba6445ffc55611c8401e59e6467a408f5fbb0c5cfce92eb32ce"
---

## 들어가기 전에..
필자는 Java 환경에서 JPA를 사용해본 경험이 있다.
따라서, Sequelize를 JPA에 빗대어 설명하는 부분이 있을 수 있다.
JPA에 관해 공부하고 싶다면 <a href="https://velog.io/@jaewon-ju/Spring-JPA-JPA-%EC%86%8C%EA%B0%9C">JPA 포스트</a>를 참고하면 좋을 듯 하다.

---

<br>

## ✏️ Sequelize 란

>#### Sequelize
: Node.js 환경에서 사용하는 ORM(Object-Relational Mapping) 라이브러리

- 데이터베이스의 테이블을 객체처럼 다룰 수 있다.
- SQL 쿼리를 작성하지 않고도 데이터베이스 작업을 수행할 수 있다.

<br>

### ■ 기능

Sequelize는 다음과 같은 기능을 제공한다.

1. 모델 정의: 데이터베이스 테이블을 모델로 정의한다. 모델은 자바스크립트 객체처럼 다룰 수 있으며, 각 모델은 테이블의 컬럼과 매핑된다.

2. 쿼리 작성: SQL 쿼리를 자바스크립트 코드로 작성할 수 있다. <span style = "color:red">CRUD 작업을 위한 메서드를 제공한다</span>. (JPA의 ```JpaRepository``` 와 비슷한 기능이다!)

3. 관계 설정: 테이블 간의 관계(일대일, 일대다, 다대다)를 설정할 수 있다. 

4. 마이그레이션: 데이터베이스 스키마 변경을 관리할 수 있는 마이그레이션 기능을 제공.

<br>

### ■ JPA와의 차이점

| 차이점 | JPA | Sequelize |
| - | - | - |
| 객체 생성 | ```@Entity``` 어노테이션을 사용하여 엔티티 클래스를 정의 | 모델을 정의 |
| 관계 설정 | @OneToMany, @ManyToOne 등의 어노테이션 사용 | .hasMany, .belongsTo 같은 관계형 메소드 사용 |
| CRUD | JpaRepository를 상속받아서 CRUD 작업 수행 | 각 모델이 CURD 메서드를 포함하고 있음 |

이 밖에도 다양한 차이점이 존재한다.

<br>

---

<br>

## ✏️ 사용방법
JPA의 경우, 아래와 같은 순서로 개발을 진행한다.

> #### JPA
1. 프로젝트 설정
1. Entity 정의
2. DTO 정의 (생략 가능)
3. Repository 정의
4. Service 정의
5. Controller 연결

<br>

Sequelize는 어떨까?
Sequelize는 다음과 같은 순서로 개발이 진행된다.

> #### Sequelize
1. DB 연결 설정
2. 모델 정의
3. Service 정의
4. Controller 연결
5. 라우팅 설정
6. 애플리케이션 설정

각 과정을 더 자세히 알아보도록 하자.

### 1. DB 연결 설정
Node.js 프로젝트를 설정하고 Sequelize 패키지를 설치한다.
```
npm init -y
npm install sequelize sequelize-cli mysql2

```

그런 다음, 데이터베이스 설정 파일(ex: config/database.js)을 생성한다.
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
```

<br>

### 2. 모델 정의
User 모델을 생성한다.
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = User;
```

DTO를 생성하는 것은 일단 생략한다.

<br>

### 3. Service 정의
비즈니스 로직을 처리하는 서비스 계층을 정의한다.
```javascript
const User = require('../models/User');

class UserService {
  async createUser(data) {
    const user = await User.create(data);
    return user;
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
    return user;
  }

...

}
  
module.exports = new UserService();
```
Sequelize는 CRUD 작업을 위한 메서드를 제공한다.
제공되는 메소드는 다음과 같다.
<br>

| 메소드 | 인수 | 반환 값 |
| - | - | - |
| create | 생성할 레코드의 데이터 객체 | 생성된 레코드의 모델 인스턴스|
| findByPK | 조회할 레코드의 기본 키 값, [options: 조회 시 포함할 옵션 객체] | 조회된 모델의 인스턴스|
| findAll | [options] | 조회된 레코드의 배열|
| findOne | [options] | 조회된 레코드 모델의 인스턴스|
| update | 업데이트할 데이터 객체, [options] | 업데이트된 레코드 수|
| destroy | [options] | 삭제된 레코드의 수 |

옵션 객체는 다양한 메소드에 인수로 전달되어 쿼리의 동작을 제어하는 데 사용된다.
옵션 객체를 통해 조건, 관계, 페이징 등을 설정할 수 있다.

- 조건 설정
```javascript
const users = await User.findAll({
  where: {
    username: 'janedoe'
  }
});
// SELECT * FROM Users WHERE username = 'jonedoe';
```

- 관계 설정
```javascript
// User 테이블과 Post 테이블이 FK로 연결되어 있는 경우
const users = await User.findAll({
  include: [Post]
});

/*
** SELECT Users.*, Posts.* FROM Users
** LEFT JOIN Posts ON Users.id = Posts.userId;
*/
```

<br>

### 4. Controller 연결
요청을 처리하고 서비스 계층을 호출하는 컨트롤러 정의
```javascript
const userService = require('../services/userService');

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  ...
  
}

module.exports = new UserController();
```
<br>

### 5. 라우팅 설정
Express를 사용하여 라우팅 설정
```javascript
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
...

module.exports = router;
```

<br>

### 6. 애플리케이션 설정
```app.js``` 파일을 설정하여 전체 애플리케이션을 초기화하고 실행한다.
```javascript
const express = require('express');
const { sequelize } = require('./models'); // Sequelize 인스턴스를 가져옵니다.
const userRoutes = require('./routes/userRoutes'); // 사용자 정의 라우터를 가져옵니다.

const app = express();

app.use(express.json()); // JSON 형식의 요청 본문을 파싱합니다.

app.use('/api', userRoutes); // 라우팅 설정

const PORT = process.env.PORT || 3000;

// 데이터베이스 동기화 및 서버 시작
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
```

여기서, ```sequelize.sync()``` 부분을 자세히 살펴보자.
```sequelize.sync()``` 는 DB와 모델간의 동기화를 처리하는 기능을 한다.
JPA의 ```hibernate.hbm2ddl.auto``` 설정과 유사하지만, 명시적으로 호출하여 동기화를 수행한다.

>#### ```sequelize.sync()```의 옵션
- force: 기존 테이블 삭제 후 새로 생성
- alter: 테이블을 삭제하지 않고, 기존 테이블의 구조를 변경하여 모델과 일치시킴
- logging: 동기화 과정에서 실행되는 SQL 쿼리 로깅

<br>

---

<br>

## ✏️ 연관 관계 매핑
JPA는 ```@OneToMany```, ```@ManyToOne``` 등의 어노테이션 사용해서 연관관계 매핑을 하고,
Sequelize는 ```.hasMany```, ```.belongsTo``` 같은 관계형 메소드 사용한다.

예를 들어, User 테이블과 Post 테이블을 1:N 관계로 매핑하려면 다음과 같이 설정하면 된다.
```javascript
const User = require('./User');
const Post = require('./Post');

// User는 여러 개의 Post를 가질 수 있습니다.
User.hasMany(Post, { foreignKey: 'userId' });

// Post는 하나의 User에 속합니다.
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Post };
```

<br>

### ■ 옵션
연관관계를 설정할 때 다양한 옵션을 사용할 수 있다.

1. foreignKey
: 자식 모델에 설정될 외래 키를 지정한다.
```javascript
User.hasMany(Post, {
  foreignKey: 'userId'
});
// Post 테이블에 존재하는 userId 필드를 FK로 사용하겠다.
```

<br>

2. sourceKey
: 부모 모델의 어떤 키를 왜래 키로 사용할지 지정한다.
```javascript
User.hasMany(Post, {
  foreignKey: 'userId',
  sourceKey: 'id'
});
// Post 테이블에 존재하는 userId 필드를 FK로 사용하겠다.
// Post 테이블의 userId 필드는 User 테이블의 id와 연결된다.
```


<br>

3. as
: 관계에 대한 별칭을 지정한다.
```javascript
User.hasMany(Post, {
  as: 'Articles'
});
```


<br>

4. targetKey
: 자식 모델이 참조할 부모 모델의 키를 지정한다.
sourceKey는 ```hasMany``` 메소드에서 사용되고, targetKey는 ```belongsTo``` 메소드의 옵션으로 사용된다.
```javascript
Post.belongsTo(User, {
  foreignKey: 'UserId',
  targetKey: 'id',
});
```