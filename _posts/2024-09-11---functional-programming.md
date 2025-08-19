---
title: "[프로그래밍언어론] Functional Programming"
description: "함수형 프로그래밍에 대해서"
date: 2024-09-11T02:41:11.654Z
tags: ["프로그래밍언어론"]
slug: "프로그래밍언어론-Functional-Programming"
velogSync:
  lastSyncedAt: 2025-08-19T08:36:50.736Z
  hash: "afd9e47f59f7a64bf499948d78f96e8f2159e698714041ad55b2292fb04cec94"
---

## ✏️ Concept of variable


### ■ Math에서의 변수
- 실제 값 그 자체를 의미함

<br>

### ■ Imperative Programming Language에서의 변수
- 값을 저장하고 있는 **memory location**을 의미  
- **assignment statement**를 통해 변수를 새로운 값으로 reset 가능

<br>

### ■ Functional Programming에서의 변수
- **Mathematical한 변수를 채택**하여, 값 자체를 의미하며, **memory location**이 아님  
- `x = x + 1`과 같은 표현은 <span style="color:red">불가능</span>  
- Loop를 사용하지 못하고 **Recursion**을 사용하며, **internal state**가 존재하지 않음

<br>

---

<br>

## ✏️ Pure Functional Programming


### ■ Referential Transparency란?
> 함수의 결과가 인수들의 값에만 의존하는 속성

- 동일한 매개변수가 주어지면 **항상 동일한 결과**를 생산한다.
- gcd는 참조 투명성을 가진다.
- rand는 참조 투명성을 가질 수 없다.
- 매개변수가 없는 참조 투명한 함수는 항상 같은 값을 반환해야 한다.
- 참조 투명성을 가지려면 side effect가 없어야 한다.

<br>

>#### side effect
```c
result1 = (fun(a) + b) / (fun(a) - c);
temp = fun(a);
result2 = (temp + b) / (temp - c);
```
- **Side effects(부작용)**이 존재할 때
  - 함수 내부에서 매개변수 외부의 값을 변경하는 경우
if the function fun has no side effects, result1 and result2 will be equal because the expressions assigned to them are equibalent
Suppose fun has the side effect of adding 1 to either b or c result1 would not be equal to result2
This side effects violate the Referential transparency

<br>


### ■ Pure Functional Programming
Pure Functional Programming을 만족하기 위한 조건:

1. **모든 과정**이 함수로 이루어져 있다.
2. **Referential Transparency**
2. **Assignment**가 없다.
3. **Loop**가 없고, 대신 **Recursion**을 사용한다.
4. 함수의 결과 값은 오로지 **매개변수에 의존**한다.
5. **함수는 일급 객체**로 취급되며, 매개변수나 리턴 값으로 사용할 수 있다.


<br>

---

<br>

## ✏️ Scheme
Scheme은 Lisp 계열의 함수형 프로그래밍 언어로, 매우 간결하고 유연한 문법을 가지고 있다. 

- **Scheme**의 문법은 **extended Backus-Naur form (EBNF)** 표기법으로 표현된다.

- Scheme의 모든 프로그램과 데이터는 **expression**으로 이루어져 있다.
<br>

### ■ Expression
 Scheme에서의 **expression**은 크게 두 가지로 나눌 수 있다.

1. **Atoms**
   - **원자적 데이터**를 나타내며, **숫자(number)**, **문자열(string)**, **심볼(symbol)**, **문자(character)**, **부울(boolean)**을 포함한다.

<br>

2. **Parenthesized expression** (괄호로 감싼 표현식)
   - **리스트 구조**로, **연산자**와 **피연산자**들을 **괄호**로 감싼 형태이다.
   - 예시: `(operator operand1 operand2 ...)`

<br>

### ■ Elements of Scheme
>#### List
: Scheme에서의 **리스트**는 순차적으로 연결된 데이터 구조로, **빈 리스트**인 `'()`도 유효한 리스트로 간주된다. 
- Scheme에서 괄호로 감싼 표현식은 단순히 계산할 수 있는 표현이 아니라 데이터 구조로도 활용된다.
- 리스트는 다음과 같은 방법으로 생성할 수 있다.
   - ```(quote (2.1 2.2 3.1))``` 
   - ```'(2.1 2.2 3.1)```
   - ```(list 2.1 2.2 3.1)```
   
>#### Evaluation Rule
1. **Applicative order evaluation**
   - Scheme에서는 **applicative order** 평가 방식을 사용하며, 이는 함수가 호출되기 전에 **모든 피연산자**를 먼저 평가하는 방식이다.
<br>
2. **Delayed evaluation**
   - 특정 조건이 충족될 때까지 표현식을 평가하지 않고 **지연**시킨다. 

>#### Environment
: Scheme의 **environment**는 **symbol table**로, **식별자(identifier)**를 **값(value)**에 연관시키는 구조를 의미한다. 
즉, 각 식별자와 그에 할당된 값을 추적하며, **변수**가 정의되거나 참조될 때 이를 관리하는 역할을 한다. 

<br>

### ■ Binding

>#### let 바인딩
`let` 바인딩을 사용하면 지역 변수를 생성할 수 있다.

let의 기본 구문은 다음과 같다.
```
(let ((var1 val1)
	(var2 val2))
    expression)
```

- `let` 바인딩으로 생성된 변수들은 해당 `let` 구문의 내부 범위에서만 유효하다.


```
(let ((x 5)
      (y 10))
  		(+ x y))  ;; 결과: 15
```
<br>


>#### letrec 바인딩
letrec은 Scheme에서 재귀적 정의가 필요한 상황에서 사용되는 특별한 형태의 let 바인딩이다.


```
(letrec ((factorial
          (lambda (n)
            (if (= n 0)
                1
                (* n (factorial (- n 1)))))))
  (factorial 5))  ;; 결과: 120
```

<br>


>#### define 바인딩
`define` 구문을 사용해서 전역 변수 또는 함수를 선언할 수 있다.

```
(define variable-name value)
```

- define은 괄호를 쓰지 않는다. (let은 쓴다)


<br>

### ■ Dynamic Type Checking

<br>

### ■ lambda
> `lambda` 구문을 사용하면 익명 함수를 정의할 수 있다.

```
(lambda (arg1 agr2 ...)
		expression)
```

<br>

예시
```scheme
((lambda (x) (+ x 1)) 5)  ;; 결과: 6
```

- `let` 또는 `define`과 함께 써서 함수로 바인딩할 수 있다.

<br>

### ■ Tail and Non-Tail Recursion

#### Tail Recursion (꼬리 재귀)
Tail Recursion은 재귀 호출이 함수의 **마지막 연산**일 때 발생하는 재귀 호출이다. 즉, 함수가 재귀 호출을 한 후 더 이상의 계산 없이 결과를 반환하는 경우를 말한다.

```c
(define factorial
  (lambda (n result)
    (if (= n 1)
        result
        (factorial (- n 1) (* n result)))))

(factorial 5)
```

Tail recursion은 최적화되어 <span style = "color:red">반복(loop)처럼</span> 동작할 수 있다. 컴파일러나 인터프리터가 호출 스택을 재사용하여 새로운 스택 프레임을 만들지 않는다.

<br>

#### Non Tail Recursion (비 꼬리 재귀)
```c
(define factorial
  (lambda (n)
    (if (= n 1)
        1
        (* n (factorial (- n 1))))))

(factorial 5)
```

<br>

### ■ List Functions
- car: 리스트의 첫 번째 요소를 반환
- cdr: 리스트의 첫 번째 요소를 제외한 나머지 요소를 반환
- cons: 두 개의 인자를 받아 새로운 리스트를 생성

```c
(car '(1 2 3 4))
결과: 1
```
```c
(cdr '(1 2 3 4))
; 결과: (2 3 4)
```
```c
(cons 1 '(2 3 4))
; 결과: (1 2 3 4)
```

<br>

### ■ Predicate Functions
- eq?: 두 객체가 동일한 객체인지 비교
- null?: 주어진 인자가 빈 리스트인지 여부를 확인
- list?: 주어진 인자가 리스트인지 여부를 확인

```c
(eq? 'a 'a)
// 결과: #t (참, 같은 심볼)

(eq? 'a 'b)
// 결과: #f (거짓, 다른 심볼)

(null? '())
// 결과: #t (참, 빈 리스트)

(null? '(1 2 3))
// 결과: #f (거짓, 리스트가 비어있지 않음)

(list? '(1 2 3))
// 결과: #t (참, 리스트)

(list? 123)
// 결과: #f (거짓, 숫자는 리스트가 아님)

(list? '())
// 결과: #t (참, 빈 리스트도 리스트로 간주됨)
```

<br>

### ■ higher-order functions
> #### higher-order functions
: 함수 자체를 인자로 받거나 결과로 함수를 반환하는 함수

built-in higher order functions

<br>

### ■ Scoping
scoping은 변수의 유효 범위와 생명 주기를 정의하는 개념
Scheme은 주로 Static(lexical) scoping을 사용하며, 이는 변수가 정의된 위치에 따라 그 변수가 유효한 범위가 결정된다는 것을 의미한다. 

>#### Lexical Scoping
: 변수가 정의된 위치에 따라 그 변수가 유효한 범위 결정. 
즉, 변수가 정의된 블록(예: 함수 또는 let 블록) 내에서만 접근할 수 있다. 
