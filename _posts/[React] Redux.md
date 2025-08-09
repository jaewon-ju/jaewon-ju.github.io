---
title: "[React] Redux"
description: "Redux: 상태 관리 라이브러리 #Redux #createAsyncThunk #createSlice #ReduxToolKit"
date: 2025-04-16T02:09:48.928Z
tags: ["React"]
slug: "React-Redux"
series:
  id: cbbed83d-4e7c-46da-a2a5-e557556d12bb
  name: "프론트엔드"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:31.730Z
  hash: "0d6015e7a5b6ef68910713612e072a8cb8d7d61161d593e9867112a030ff9589"
---


>#### Redux  
: **애플리케이션의 상태(state)를 예측 가능하게 관리**하기 위한 자바스크립트 상태 관리 라이브러리이다.  
주로 React와 함께 사용되며, 전역 상태를 중앙에서 관리함으로써 복잡한 컴포넌트 간의 데이터 전달 문제를 해결한다.

<br>

---

<br>

## ✏️ 왜 사용하는가?

### 1. 중앙 집중형 상태 관리
React는 컴포넌트 단위로 상태(state)를 관리한다. 
상위 컴포넌트의 상태를 하위 컴포넌트까지 전달하려면 계속 props를 넘겨야 한다.

얘를 들어, App 컴포넌트의 `user` state를  하위 하위 컴포넌트인 Child에서 사용하려면, `user`를 props로 계속 전달해야한다.

```tsx
// 최상위 App 컴포넌트
function App() {
  const [user, setUser] = useState({ name: 'Jin' });
  return <Parent user={user} />;
}

// App의 하위 컴포넌트 Parent
function Parent({ user }) {
  return <Child user={user} />;
}

// Parent의 하위 컴포넌트 Child
function Child({ user }) {
  return <p>Hello, {user.name}</p>;
}
```

<br>

>#### Redux를 사용한다면? 

Redux는 state를 전역에서 관리하는 기능을 제공한다.
따라서, `user` state를 하나의 파일에서 관리하고 어떤 컴포넌트든 직접 접근해서 사용할 수 있게 만들어준다.

<br>

### 2. State 변경 추적
React에서 state는 컴포넌트 내부에서 변경되며, 상태 변경이 많아질수록 언제 어떤 이유로 상태가 바뀌었는지 파악하기 어려워진다.

>#### Redux를 사용한다면?

Redux는 모든 상태 변경이 reducer를 거쳐 이루어지기 때문에, 상태 변경의 흐름이 명시적이고 예측 가능하다.


<br>

---

<br>

## ✏️ Redux의 주요 요소
Redux는 세 가지 핵심 개념을 중심으로 State를 관리한다:

| 구성 요소 | 설명 |
|-----------|------|
| **Store** | 애플리케이션의 모든 State를 하나로 모아놓은 전역 저장소 |
| **Action** | State를 어떻게 바꿀지를 설명하는 객체 (type, payload) |
| **Reducer** | Action에 따라 State를 실제로 바꾸는 함수들의 모음 |

<br>


코드를 통해 주요 요소들을 알아보자.

### ◼︎ Store, Action, Reducer
#### 1. Store
`store/index.ts` 에 다음과 같이 저장소를 정의한다.

```ts
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

- `store`는 모든 State가 모여 있는 중앙 저장소이다.
- `authReducer`는 사용자 관련 State를 관리하는 reducer이며, 이 저장소에 auth라는 이름으로 등록된다.

<br>

#### 2. Action
Action은 “State를 어떻게 바꿀 것인지”를 설명하는 객체다.
기본적으로 type 속성이 필수이며, payload를 통해 전달할 데이터를 담을 수 있다.

```ts
{
  type: 'SET_USER',
  payload: { name: 'Jin' }
}
```

<br>

#### 3. Reducer
Reducer는 현재 State와 Action을 받아서 → 새로운 State를 만드는 함수들의 모음이다.

```ts
// store/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  
  // 여기에 함수들을 정의한다.
  reducers: {
    
    // 이 함수는 dispatch(setUser(payload))가 실행됐을 때 동작한다.
    // user state의 값에 payload의 값을 대입한다.
    setUser(state, action) {
      state.user = action.payload;
    },
    
    // 이 함수는 dispatch(updateCurrentTeam(payload))가 실행되었을 때 동작한다.
    updateCurrentTeam: (state, action) => {
      state.user.currentTeam = action.payload;
    },
    ...
    
  },
});
```

<br>

### ◼︎ 구현 방법
예를 들어, `user` state에 `JIM` 이라는 값을 대입하는 과정을 생각해보자.
State 중앙 관리소에 `user` State를 등록해두고, `user` State를 변경하는 함수를 reducer에 저장한다.
그리고, `user`에 값을 대입하고자 하는 컴포넌트에서 Action을 통해 State를 변경한다.


<br>

#### 1. authSlice.ts – 상태 정의 및 reducer 작성
```ts
// store/slices/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    // user 상태를 바꾸는 동기 Action
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
```


<br>

#### 2. store/index.ts – Store 생성
```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

<br>

#### 3. 컴포넌트에서 호출
```ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <p>User: {user}</p>
      <button onClick={() => dispatch(setUser('JIM'))}>Set User</button>
    </div>
  );
}
```

- 상태를 조회할 때는 useAppSelector() 훅을 사용한다.
- 상태를 변경할 때는 useDispatch() 훅을 사용한다.

아래에서 Redux Hook을 더 자세히 알아보자.


<br>

---

<br>

## ✏️ Redux Hook
Redux에서 컴포넌트와 Store를 연결할 때는 두 가지 핵심 훅을 사용한다:

### 1. useAppSelector

전역 State에서 필요한 값을 가져올 때 사용하는 훅이다.
```ts
const user = useAppSelector((state) => state.auth.user);
```

<br>

### 2. useAppDispatch
reducer에 Action을 전달(=dispatch)하여 State를 변경하고 싶을 때 사용하는 훅이다.

```ts
const dispatch = useDispatch();
dispatch(setUser('JIM'));
```



<br>

---

<br>

## ✏️ 비동기 액션
Redux의 Action에는 동기 액션과 비동기 액션이 있다.

- 동기 액션은 createSlice의 reducers 안에 정의하며, 실행되자마자 즉시 State를 변경한다.
- 반면, 비동기 액션은 네트워크 요청처럼 결과가 바로 나오지 않는 작업을 처리할 때 사용된다.

<br>

### ◼︎ 비동기 액션이란?
비동기 액션은 예를 들어 다음과 같은 작업들을 처리할 때 사용된다:

- API 호출
- 일정 시간 후 실행되는 타이머
- 파일 업로드/다운로드 등

이처럼 결과를 기다려야 하는 작업은 Redux 안에서 바로 처리할 수 없기 때문에, 비동기 액션을 사용해야 한다.
비동기 액션은 `createAsyncThunk()`를 통해 정의할 수 있다.

```ts
// 예시: Action 내부에서 백엔드 API 호출 함수인 getUSer()를 사용하는 경우
// 비동기 함수를 정의한다.
export const setUser = createAsyncThunk(
  'auth/setUserStatus',
  async (currentUser, { rejectWithValue }) => {
    const result = await getUser(...);
    return result.data.user;
  }
);
```

<br>


>#### createAsyncThunk를 사용해 만든 비동기 액션은 세 가지 단계의 State를 자동으로 생성한다


| 상태        | 설명 |
|-------------|------|
| `pending`   | 비동기 작업이 시작될 때 자동 실행됨 (로딩 중 상태 표시 등에 사용) |
| `fulfilled` | 비동기 작업이 성공적으로 끝났을 때 실행됨 (데이터 저장, UI 갱신) |
| `rejected`  | 비동기 작업이 실패했을 때 실행됨 (에러 처리, 에러 메시지 표시) |


이 세 가지 상태를 통해, 로딩 중인지, 성공했는지, 실패했는지를 컴포넌트에서 명확하게 구분할 수 있다.
