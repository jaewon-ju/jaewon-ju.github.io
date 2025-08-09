---
title: "[React] 무작정 시작"
description: "React를 무작정 시작해보자"
date: 2024-11-28T14:54:03.215Z
tags: ["React"]
slug: "React-무작정-시작"
series:
  id: cbbed83d-4e7c-46da-a2a5-e557556d12bb
  name: "프론트엔드"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:32.177Z
  hash: "8b2544362ae05695432c277aa0a496e1f9629e1d382f8b45f293ddd86d9cf655"
---

# React를 무작정 시작해보자

React는 프론트엔드 개발에서 가장 널리 사용되는 라이브러리 중 하나이다. 
이번 포스팅에서는 React를 처음 접하는 사람들을 위해 디렉토리 구조와 주요 개념들을 알아보겠다.

<br>

---

<br>

## ✏️ 디렉토리 구조

React 프로젝트의 디렉토리는 다음과 같이 구성할 수 있다:
```
src/
├── components/
│   ├── Header/
│   │   ├── Header.js
│   │   └── Header.css
│   └── UserCard/
│       ├── UserCard.js
│       └── UserCard.css
├── pages/
│   ├── Home.js
│   └── About.js
├── styles/
│   ├── global.css
│   ├── Home.css
│   └── About.css
public/
assets/
```

- **public**: `index.html`에서 직접 사용하는 파일들 (예: 파비콘).
- **assets**: 컴포넌트 내부에서 사용하는 파일들 (예: 이미지).
- **components**: `pages` 내부에서 정의하기에는 코드가 긴 컴포넌트들로, 컴포넌트 폴더 안에 `.js`와 `.css` 파일을 포함한다.
- **pages**: 라우팅이 적용되는 컴포넌트들.
- **services**: API 로직을 처리하는 곳.
- **utils**: 공통 함수를 모아 놓은 곳.
- **styles**: 전역 스타일 및 페이지별 스타일 `.css` 파일들.


<br>

---

<br>

## ✏️ 용어 정리

### ■ 컴포넌트
>#### 컴포넌트
: React에서 UI를 구성하는 독립적인 단위이다. 

- React 애플리케이션은 컴포넌트의 조합으로 이루어져 있으며, 각각의 컴포넌트는 화면의 특정 부분을 담당한다.
- 재사용 가능하며, 자신만의 상태와 생명주기를 가질 수 있다. 
- 함수형 컴포넌트와 클래스형 컴포넌트로 나뉘지만, 최근에는 함수형 컴포넌트와 훅(Hooks)을 사용하는 것이 일반적이다.


<br>

### ■ 훅
> #### 훅
: 함수형 컴포넌트에서 상태 관리와 생명주기 메서드와 같은 React의 기능을 사용할 수 있게 해주는 기능이다. 

- 훅을 사용하면 클래스형 컴포넌트 없이도 상태와 React의 기능을 구현할 수 있어 코드가 더 간결해진다. 
- 대표적인 훅으로는 `useState`, `useEffect` 등이 있으며, 이를 통해 상태 관리와 사이드 이펙트를 처리할 수 있다.

<br>

### ■ State
> #### State
: 컴포넌트의 상태를 나타내는 객체

- <span style="color:red">State의 상태가 변경되면 해당 컴포넌트는 자동으로 다시 렌더링된다.</span> 
- 사용자의 입력이나 네트워크 요청 결과 등에 따라 변할 수 있으며, 이를 통해 동적인 UI를 구현할 수 있다.



<br>

---

<br>


## ✏️ API 호출

React에서 API를 호출할 때는 Fetch API나 Axios를 주로 사용한다. 

- Fetch API는 브라우저에 내장된 함수로, 별도의 설치 없이 사용할 수 있다. 다만, <span style="color:red">응답 처리나 에러 처리가 다소 복잡</span>할 수 있다.
- Axios는 별도의 설치가 필요한 라이브러리이지만, <span style="color:red">JSON 데이터를 자동으로 처리</span>하며 에러 처리와 인터셉터 등의 추가 기능을 제공한다. 

다음은 두 방법의 사용 예시이다:

**Fetch 사용 예시**
```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    // 데이터 처리 로직
  })
  .catch(error => {
    // 에러 처리 로직
  });
```
**Axios 사용 예시**


```javascript
import axios from 'axios';

axios.get('https://api.example.com/data')
  .then(response => {
    // 데이터 처리 로직
  })
  .catch(error => {
    // 에러 처리 로직
  });
```

<br>

---

<br>

## ✏️ React 컴포넌트와 태그 반환
>React 컴포넌트는 하나의 태그를 반환해야 한다. 만약 여러 개의 요소를 반환하려면 부모 요소로 감싸주어야 한다. 

부모 요소로 `<div>`를 사용할 수도 있고, <span style="color:red">불필요한 DOM 노드를 줄이기 위해 React Fragment를 사용할 수도 있다.</span>

예시:

```javascript
function App() {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  );
}
```

<br>

---
  
<br>


## ✏️ CSS Module

CSS Module은 클래스 이름을 고유화하여 <span style="color:red">전역 네임스페이스 충돌을 방지</span>한다. CSS 파일명을 `Component.module.css`로 지정하고 컴포넌트에서 `import`하여 사용하면 된다. 이를 통해 <span style="color:red">클래스 이름이 해시값으로 변환</span>되며, 스타일 충돌을 방지할 수 있다.

**CSS 파일 예시**

```javascript
/* Button.module.css */
.primaryButton {
  background-color: blue;
}
```

**JS 파일 예시**

```javascript
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primaryButton}>Click Me</button>;
}

export default Button;
```