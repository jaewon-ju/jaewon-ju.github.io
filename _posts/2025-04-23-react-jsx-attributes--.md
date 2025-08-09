---
title: "[React] JSX Attributes 정리"
description: "React에서 자주 쓰이는 주요 속성들인 ref, key, className, onClick, style, children"
date: 2025-04-23T06:21:55.881Z
tags: ["React","프론트엔드"]
slug: "React-JSX-Attributes-정리"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:52.408Z
  hash: "b11e17b71be347ca4f2253613b0849e3ad45807c281eaca9120c0f9a2fe96f67"
---

## React JSX 속성 정리

React에서 자주 쓰이는 주요 속성들인 `ref`, `key`, `className`, `onClick`, `style`, `children`에 대해 정리한 문서이다.


---

<br>

## 1. ref

### ◼︎ 역할
- 특정 **DOM 요소에 직접 접근**할 수 있게 해준다.
- `focus`, `scroll`, `style` 등을 **직접 조작**할 때 사용

<br>

### ◼︎ 사용 예
```tsx
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}
```
> `ref`는 일반적인 props와는 달리, 실제 HTML 요소를 참조하는 **특수한 prop**입니다.

---

## 2. `key`

### ◼︎ 역할
- React가 리스트를 렌더링할 때, **각 항목을 고유하게 식별**할 수 있게 해줍니다.
- 어떤 요소가 변경, 추가, 삭제되었는지를 빠르게 파악할 수 있게 하여 **성능 향상**에 중요합니다.

<br>

### ◼︎ 어떻게 작동하나요?
React는 리스트 요소들을 다시 그릴 때, `key`를 기준으로 "이전 요소와 같은지" 판단합니다. `key`가 같으면 **재사용**, 다르면 **다시 렌더링**합니다.

<br>

### ◼︎ 사용 예
```tsx
const fruits = [
  { id: 'a1', name: '🍎 사과' },
  { id: 'b2', name: '🍌 바나나' },
  { id: 'c3', name: '🍇 포도' },
];

return (
  <ul>
    {fruits.map((fruit) => (
      <li key={fruit.id}>{fruit.name}</li>
    ))}
  </ul>
);
```
> ❗ 단순히 `index`를 key로 사용하는 것은 항목의 순서가 바뀌는 경우 **예기치 않은 렌더링 문제가 생길 수 있으므로 주의**해야 합니다.

---

## 3. `className`

### ◼︎ 역할
- HTML의 `class` 대신 **React에서는 `className`을 사용**해야 합니다. (JS 예약어 `class`와 충돌 방지)

<br>

### ◼︎ 사용 예
```tsx
<div className="card-container">Hello</div>
```

---

## 4. `onClick`, `onChange`, `onSubmit` 등

### ◼︎ 역할
- **이벤트 처리 함수**를 등록하는 속성입니다.
- 반드시 camelCase로 작성해야 합니다 (`onclick` ❌ → `onClick` ✅)

<br>

### ◼︎ 사용 예
```tsx
<button onClick={() => alert("눌렀어요!")}>Click Me</button>
<input onChange={(e) => console.log(e.target.value)} />
```

---

## 5. `style`

### ◼︎ 역할
- 인라인 스타일을 적용할 때 사용합니다.
- 객체 형태로 작성하며, CSS 속성은 `camelCase`로 표기합니다.

<br>

### ◼︎ 사용 예
```tsx
<div style={{ backgroundColor: 'skyblue', padding: '20px' }}>
  스타일이 적용된 박스
</div>
```

---

## 6. `children`

### ◼︎ 역할
- 컴포넌트 태그 안에 **들어가는 모든 요소**를 의미합니다.
- 부모 컴포넌트가 자식 콘텐츠를 유연하게 구성할 수 있게 해줍니다.

<br>

### ◼︎ 사용 예
```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>제목</h2>
  <p>내용입니다</p>
</Card>
```

<br>

---

<br>

## props vs attributes 차이점

### 1. attributes 

### 정의:
HTML 태그에서 사용하는 전통적인 속성. 브라우저가 직접 해석해서 동작합니다.

```html
<!-- HTML에서의 attributes -->
<input type="text" placeholder="이름을 입력하세요" />
```

- `type`, `placeholder`, `disabled`, `checked`, `value` 등은 HTML이 해석하는 속성입니다.

---

### 2. props (React 속성)

### 정의:
컴포넌트에 데이터를 전달하는 수단입니다. JavaScript 객체의 형태로 전달되며, **JS 내부에서 자유롭게 사용**할 수 있습니다.

```tsx
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

<Welcome name="민수" />
```

- `name`은 `props`이며, 함수의 인자로 전달되어 **컴포넌트 내부 로직**에 활용됩니다.

---

## 주요 차이점 비교

| 항목 | attributes | props |
|------|------------|-------|
| 정의 위치 | HTML | React 컴포넌트 내부 |
| 사용 목적 | HTML 요소 제어 | 컴포넌트 데이터 전달 |
| 처리 주체 | 브라우저 | React 렌더링 엔진 |
| 데이터 흐름 | 단방향 | 단방향 (상위 → 하위) |
| 커스터마이징 가능 여부 | 제한적 | 완전 자유 |

<br>

## $ prefix로 props와 HTML attributes 구분하기
### ◼︎ 문제 상황
React에서는 props가 실제 DOM 요소에도 전달될 수 있는데,
HTML 태그가 인식하지 못하는 props가 그대로 전달되면 경고가 발생합니다.

```tsx
const Box = styled.div<{ highlight: boolean }>`
  background-color: ${(props) => (props.highlight ? "yellow" : "white")};
`;

<Box highlight={true}>강조된 박스</Box>
```

⚠️ 경고: React does not recognize the 'highlight' prop on a DOM element

highlight는 HTML의 표준 속성이 아니므로, <div highlight="true">처럼 DOM에 남게 되면 React가 경고를 띄웁니다.

### ◼︎ 해결 방법: $ prefix 사용
styled-components에서 $로 시작하는 prop은
DOM으로 전달되지 않고 스타일 계산에만 사용됩니다.

```
const Box = styled.div<{ $highlight: boolean }>`
  background-color: ${(props) => (props.$highlight ? "yellow" : "white")};
`;
  
<Box $highlight={true}>강조된 박스</Box>
```
  
✅ 결과:

$highlight는 오직 styled-components 내부에서만 사용됨
실제 HTML에는 전달되지 않음 → 경고 없음, DOM 깔끔하게 유지

