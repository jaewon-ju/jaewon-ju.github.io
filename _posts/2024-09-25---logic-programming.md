---
title: "[프로그래밍언어론] Logic Programming"
description: "논리 프로그래밍에 대해서"
date: 2024-09-25T03:27:09.958Z
tags: ["프로그래밍언어론"]
slug: "프로그래밍언어론-Logic-Programming"
velogSync:
  lastSyncedAt: 2025-08-18T06:18:45.437Z
  hash: "a8bb823a3d10a7e4f5b1bc5f29b65ed43202f357fb88927d29c0197bafdea87b"
---

## ✏️ Logic Programming
> **Logic Programming**은 논리적 규칙을 기반으로 문제를 해결하는 프로그래밍 패러다임이다.

- 주어진 명제가 참인지, 거짓인지 **추론**하는 방식으로 작동한다.
- 로직 프로그래밍은 수학적 논리 체계를 기반으로 하며, 특히 **1차 술어 논리(first-order predicate calculus)**를 사용하여 논리적 문장을 공식화한다.
- **규칙(axioms)**과 **질의(query)**를 사용하여 프로그램이 진리값을 추론한다.


예를 들어:
```python
father(john, mary).  # "존은 메리의 아버지이다"라는 사실을 나타내는 규칙.
?- father(john, mary). # 존이 메리의 아버지인지 묻는 질의. 이를 통해 참 또는 거짓을 확인.
```

<br>


로직 프로그래밍의 핵심 개념은 **추론 규칙(inference rules)**을 통해 새로운 명제를 도출하는 것이다.

추론 규칙: 주어진 명제로부터 새로운 명제를 도출하는 논리적 규칙

<br>

### ■ First-Order Predicate Calculus
>#### First-Order Predicate Calculus
: 논리적 진술을 수학적으로 공식화하고, 이들 간의 관계를 추론하는 데 사용되는 체계

First-Order Predicate Calculus의 요소는 다음과 같다.

| 요소 | 설명 | 예시 |
|------|------|------|
| 상수 (Constant) | 객체나 이름을 나타냄 | 0, john |
| 술어 (Predicate) | 객체들 간의 관계를 표현 | natural(x): "x가 자연수이다" |
| 함수 (Function) | 논리적 연산을 나타냄 | successor(x): "x의 후속" |
| 변수 (Variable) | 아직 정해지지 않은 값을 나타냄 | x |
| 연산자 (Connective) | 논리적 관계를 나타냄 | AND(∧), OR(∨), NOT(¬), IMPLIES(→) |
| 양화사 (Quantifier) | 전칭 양화사(∀), 존재 양화사(∃) | ∀x P(x): "모든 x에 대해 P(x)가 참이다" |


<br>

### ■ Horn Clause
>#### Horn Clause
: 로직 프로그래밍에서 First-Order Predicate Calculus를 간단하게 표현하는 방법이다.

- **형태**: a1 AND a2 AND ... AND an → b (a1부터 an까지가 모두 참이면 b도 참이다)
- **조건**: a1부터 an까지는 **단순한 문장**이어야 하며, ```OR 연산자```나 ```quantifier```는 허용되지 않음.

Horn 절은 first-order logic의 간단한 형태로 사용된다.

<br>

예를 들어, ```"모든 x에 대해서, x가 자연수이면 x 다음의 수도 자연수이다."``` 라는 문장을 두 방식으로 표현하면 다음과 같다.

```python
# First-order logic: 
for all x, natural(x) → natural(successor(x))
 

# Horn clause:
natural(x) → natural(successor(x))
```

quantifier ```for all x```가 빠진 것을 볼 수 있다!

<br>

### ■ Inference Rules
>#### Inference Rules
: 주어진 명제들로부터 새로운 명제를 도출하거나 증명하는 방법

- 예: a → b와 b → c가 주어졌을 때, a → c를 도출할 수 있다.
- **정리(Theorem)**: 증명을 통해 참임이 밝혀진 명제.

<br>

### ■ Resolution
> #### Resolution
: Horn Clauses를 위한 inference rule

- **Resolution**은 주어진 명제들을 통해 새로운 명제를 도출하는 논리적 방법이다.

-  Horn 절을 이용하여 논리적으로 결론을 도출합니다. 

예를 들어, 다음과 같은 절이 있을 때:

```python
parent(x, y) AND parent(y, z) → grandparent(x, z)
parent(john, mary)
parent(mary, lisa)
```

이때 Resolution을 통해 ```grandparent(john, lisa)```라는 결론을 도출할 수 있다. 즉, 주어진 규칙과 사실들을 결합하여 새로운 명제를 유도해내는 것입니다.

<br>

> #### Resolution의 과정
1. 질의(Query) 변환: 증명하고자 하는 질의를 부정하여 기존의 절들과 결합시킨다.
2. 절 결합: 서로 모순된 두 절을 찾아 새로운 절을 유도한다.
3. 반복: 결합된 절을 다시 기존 절과 결합하여 모순이 발생하거나 원하는 결론을 얻을 때까지 반복한다.
4. 결론 도출: 모든 절이 모순될 경우, 원래 질의가 참임을 증명할 수 있다.


### Unification
변수가 없을 때는 resolution
변수가 있을때는 unification

---

이와 같은 개념을 기반으로 Logic Programming은 문제를 논리적으로 표현하고, 주어진 규칙을 통해 참/거짓을 도출하는 과정을 수행한다. 이를 통해 복잡한 문제를 논리적으로 해결할 수 있으며, 로직 프로그래밍 언어(Prolog 등)가 이러한 개념을 구현하고 있다.