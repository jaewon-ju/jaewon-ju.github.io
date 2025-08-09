---
title: "[TroubleShooting] Sequelize 상속 오류"
description: "sequelize에서 상속을 사용할 때 발생하는 오류"
date: 2024-08-17T14:04:15.546Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-Sequelize-상속-오류"
series:
  id: 3530ae60-5e2d-416b-9327-13c5e62bf4c7
  name: "TroubleShooting"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:32.942Z
  hash: "fb31f363a93ab56967c977512f38cdd4796dec8822a683ecea9efe5886b6102d"
---

게시판을 구현하던 중, 각각의 게시판마다 코드를 따로 작성하는 것이 번거로워서 부모 클래스를 하나 만들기로 결심했다.

부모 클래스인 Board를 생성하고, InfoBoard, CodingBoard, FreeBoard는 Board를 상속받아서 불필요한 코드 작성을 줄이고자 했다.
```javascript
class Board extends Sequelize.Model {
    static initiate(sequelize) {
        Board.init(
            {
                post_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                user_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: "Boards",
                tableName: "boards",
                underscored: true,
                timestamps: true,
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
}
module.exports = Board;
```

부모 클래스는 위와 같이 정의했다.
자식 클래스는 다음과 같은 방식으로 정의했다.
```javascript
class CodingBoard extends Board {
    static initiate(sequelize) {
        CodingBoard.init(
            {},
            {
                sequelize,
                modelName: 'CodingBoard',
                tableName: 'coding_boards',
            }
        );
    }

    static associate(db) {
        db.CodingBoard.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id' });
        db.CodingBoard.hasMany(db.CodingBoardComment, { foreignKey: 'post_id', sourceKey: 'post_id' });
    }
}

module.exports = CodingBoard;
```

<br>

### ⚠️ 오류 발생
```
TypeError: Cannot read properties of undefined (reading 'field')
    at HasMany._injectAttributes 
```
이 오류는 ```hasMany``` 연관관계를 설정할 때, 'sourceKey'로 사용된 필드가 해당 테이블에 존재하지 않아서 발생하는 오류이다.

> #### First Try
처음에는 외래키의 설정이 잘못된 줄 알았다. 그래서 ```hasMany``` 메소드의 옵션을 수정했다.
foreignKey를 수정하기도 하고 sourceKey도 수정해보았지만 여전히 똑같은 결과가 나왔다.

> #### Second Try
아무리 설정을 바꾸어도 작동하지 않길래, DB를 직접 확인해보았다. 그 결과, 테이블에 아무런 필드도 생성되지 않았다는 것을 발견했다.
```javascript
CodingBoard.init(
            {},
  			...
```
이 코드의 의미는 상위 클래스인 Board에서 정의된 필드만을 사용하겠다는 뜻이다.
하지만, 이 코드가 정상적으로 작동하지 않아서 아무런 필드도 상속하지 못했던 것이다.<br>
아래와 같은 코드로 수정함으로써 문제를 해결했다.

```javascript
class CodingBoard extends Board {
    static initiate(sequelize) {
        CodingBoard.init(
            {
            	...Board.rawAttributes,
           	},
            {
                sequelize,
                modelName: 'CodingBoard',
                tableName: 'coding_boards',
            }
        );
    }
```

```...Board.rawAttributes```를 사용하면, 부모 클래스 Board에서 정의된 모든 필드가 CodingBoard 모델에 복사된다.
