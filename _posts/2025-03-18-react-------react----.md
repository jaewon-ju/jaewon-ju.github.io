---
title: "[React] 백엔드 개발자를 위한 React 간단 정리"
description: "맨날 까먹는 React 개념"
date: 2025-03-18T07:43:49.028Z
tags: ["React"]
slug: "React-백엔드-개발자를-위한-React-간단-정리"
series:
  id: cbbed83d-4e7c-46da-a2a5-e557556d12bb
  name: "프론트엔드"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:52.592Z
  hash: "5b77b3a43ef6dbede7c11043d5e3aca604a714702916bdff6d8d6542684dbc04"
---

## ✏️ React의 핵심 개념: Element, Component, Props

> #### 3줄 요약
1. **Element** - React에서 가장 작은 UI 단위이며, 객체라고 생각하면 된다.
2. **Component** - 여러 개의 Element를 조합하여 하나의 UI 단위를 만든다. Element를 반환하는 역할을 한다.
3. **Props** - Component에 데이터를 전달하는 읽기 전용 값이다.


<br>

### 1. Element
> Tip: 객체라고 생각하면 편하다.

- **Element**는 React에서 가장 작은 UI 단위이다.
- 일반적으로 **JSX** 문법을 사용하여 작성하며, React 내부적으로 객체로 변환된다.
- 예제:
  ```jsx
  const element = <h1>Hello, world!</h1>;
  ```
  위 코드는 React 내부에서 다음과 같은 객체로 변환된다.
  ```js
  const element = {
    type: 'h1',
    props: {
      children: 'Hello, world!'
    }
  };
  ```
- 즉, **Element는 단순한 객체이며, UI를 정의하는 역할**을 한다.

<br>

---

<br>

### 2. Component
> Tip: 객체(Element)를 만들어내는 역할을 한다.

- **Component(컴포넌트)**는 여러 개의 Element를 조합하여 하나의 재사용 가능한 UI 단위를 만든다.
- Component는 두 가지 방식으로 만들 수 있다.
  1. **함수형 컴포넌트** (추천)
  2. **클래스형 컴포넌트** (예전 방식)
- 예제 (함수형 컴포넌트)
  ```jsx
  function Greeting() {
    return <h1>Hello, world!</h1>;
  }
  ```
  - 이 함수형 컴포넌트는 `Greeting()`을 호출하면 `Element`를 반환한다.
  - 즉, **Component는 Element를 반환하는 함수**라고 생각하면 된다.

<br>

---

<br>

### 3. Props 
>Tip: 단순하게 전달하는 데이터라고 생각하면 된다.

- **Props(Properties)**는 Component에 데이터를 전달하는 역할을 한다.
- 함수의 매개변수와 비슷하며, Component 외부에서 값을 주입할 수 있다.
- 예제:
  ```jsx
  function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
  }
  const element = <Greeting name="Alice" />;
  ```
  - `Greeting` 컴포넌트는 `props.name` 값을 받아서 동적으로 UI를 생성한다.


<br>

---

<br>

> #### 요약하자면,
1. 상위 컴포넌트가 **Props(데이터)**를 하위 컴포넌트에 전달한다.
2. 하위 컴포넌트는 **Props를 기반으로 Element(객체)**를 생성한다.
3. 생성된 **Element(객체)**는 React의 가상 DOM을 거쳐 실제 클라이언트 화면에 렌더링된다.


<br>

---

<br>

## ✏️ Hook

리액트 훅의 정의는 다음과 같다
: 함수형 컴포넌트에서 상태(state)와 생명주기(lifecycle) 기능을 사용할 수 있도록 하는 도구

리액트를 배워본 적 없는 백엔드 개발자 입장에서 이 정의를 읽으면 이게 뭔소린가 싶다.

> #### 단순히 말하자면
앞서 말했듯이 컴포넌트에는 __[ 함수형, 클래스형 ]__ 이렇게 두 종류가 있다.
함수형 컴포넌트는 단순해서 쓰기 편한데, 클래스형에 비교해서 몇가지 빠진 기능이있다.
해당 기능을 채워주는 도구가 바로 Hook이다.

<br>

#### 그래서 어떤 기능이 빠졌는데?
1. #### 상태 관리
함수형 컴포넌트는 기본적으로 한 번 실행되고 나면 끝이다.
즉, 내부에서 어떤 값을 변경하더라도 컴포넌트가 다시 실행되면 원래 상태로 초기화된다.
하지만, 어떤 값을 유지하고 싶다면? 그때 필요한 것이 바로 State(상태) 관리이다.

2. #### 생명주기
React에서 컴포넌트는 생성 → 업데이트 → 소멸 과정을 거친다.
이 과정에서 특정 시점에 실행할 코드를 넣는 것이 생명주기 관리이다.
   - 컴포넌트가 처음 나타날 때 (데이터 불러오기, API 호출)
   - 값이 변경될 때 (다시 계산하기, 애니메이션 실행)
   - 컴포넌트가 사라질 때 (정리 작업, 이벤트 제거)

<br>

Hook은 함수형 컴포넌트에서 위의 두 기능을 사용할 수 있게 도와준다.
