---
title: "[Auth] Authentik에 회원가입, Passkey 붙이기"
description: "Authentik에 Passkey를 붙이는 방법 #Authentik #Passkey"
date: 2025-04-14T05:07:39.364Z
tags: ["Auth","Authentik"]
slug: "Auth-Authentik에-Passkey-붙이기"
series:
  id: 6499233e-ce0d-46f5-97c0-3565082c0f25
  name: "Auth"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:02.067Z
  hash: "5b5b7cf5fdd9817bc46a478d00b7e4880f61cf96d1ea12e5d2c4c33f9160c07a"
---

## ✏️ Authentik에 회원가입 붙이는 방법
YouTube 영상 ["Authentik - Enrollment"](https://www.youtube.com/watch?v=mGOTpRfulfQ)의 내용을 바탕으로 Authentik에 Passkey를 적용하는 절차를 정리하였다.

<br>

>### 1. 디렉토리 - 그룹 생성
1. 왼쪽 메뉴에서 **디렉토리 > 그룹**으로 이동
2. **생성** 버튼 클릭
3. **이름**만 입력하고 생성

---

>### 2. 플로우 생성
1. 왼쪽 메뉴에서 **플로우** 클릭
2. **생성** 버튼 클릭
3. 아래와 같이 입력
   - 이름: 원하는 이름 (예: `main-page-enrollment`)
   - Title: `main-page-enrollment`
   - Slug: `main-page-enrollment`
   - Designation: `Enrollment`
   - 호환성 모드: 체크

---

>### 3. 스테이지 바인딩 설정
1. 생성한 `main-page-enrollment` 플로우 클릭
2. **스테이지 바인딩** 클릭 → **기존 스테이지 바인드** 클릭
   - 스테이지: `default-source-enrollment-prompt`
   - Order: `10`
3. 방금 바인딩한 스테이지 옆의 편집 아이콘 클릭
   - 필드에 `username`, `name`, `password`, `password_repeat` 추가
4. 다시 **기존 스테이지 바인드** 클릭
   - 스테이지: `default-source-enrollment-write`
   - Order: `20`
5. 방금 바인딩한 스테이지 편집
   - **Group** 항목에 앞서 생성한 그룹 선택 및 추가

---

>### 4. 기본 인증 플로우에 회원가입 플로우 연결
1. 플로우 메뉴에서 default-authentication-flow 클릭
2. 스테이지 바인딩 클릭
3. default-authentication-identification 스테이지 편집
   - 플로우 설정 > Enrollment Flow 항목에 main-page-enrollment 선택 후 저장

<br>

---

<br>

## ✏️ Authentik에 Passkey 붙이는 방법
YouTube 영상 ["How to enable passwordless login with Passkeys in authentik"](https://www.youtube.com/watch?v=aEpT2fYGwLw)의 내용을 바탕으로 Authentik에 Passkey를 적용하는 절차를 정리하였다.

>### 1. 관리자 계정으로 로그인
- Authentik 관리자 계정으로 로그인합니다.

---

>### 2. 인증 Flow 생성
1. 왼쪽 메뉴에서 `Flows` 선택
2. 오른쪽 상단의 **[생성]** 버튼 클릭
3. 아래와 같이 설정
   - **Name**: 원하는 이름 (예: `wedeo-passwordless`)
   - **Designation**: `Authentication`
   - **Title**: 원하는 제목
   - **Slug**: 자동 생성됨

---

>### 3. 스테이지 바인딩 설정
1. 방금 생성한 Flow를 클릭
2. **[스테이지 바인딩]** 클릭 → 바인드 스테이지 생성
   - **Name**: `wedeo Passkey Validation`
   - **Stage type**: `Authenticator Validation Stage`
   - **Device class**: `WebAuthn 인증기`
   - **Configuration**: `default-webauthn-setup`
   - **Order**: `10`

---

>### 4. 기존 로그인 스테이지 추가 바인딩
- 같은 Flow에서 다시 **[기존 스테이지 바인딩]** 클릭
   - **Stage**: `default-authentication-login`
   - **Order**: `20` (WebAuthn 이후 실행되도록 설정)
   
---

>### 5. Identification 스테이지 연결 변경
1. 좌측 메뉴에서 `Stages`로 이동
2. `default-authentication-identification` 스테이지 편집
3. 하단의 **Passwordless Flow 설정**을 다음과 같이 수정:
   - **Passwordless Flow**: `wedeo-passwordless` (앞에서 만든 Flow 선택)


<br>


이제 사용자는 WebAuthn 기반 Passkey 인증을 통해 비밀번호 없이 로그인할 수 있다.
>단, 이 기능은 사용자의 브라우저 또는 디바이스에 Passkey가 존재할 경우에만 작동한다다.

<br>

---

<br>

## ✏️ Passkey 등록 방법 (2가지)
### 1. Authentik UI에서 직접 등록
사용자가 https://auth.example.com/if/user-settings/ 페이지에서 로그인

MFA 디바이스 > Passkey 등록 메뉴 진입
디바이스 기반 생체 인증 (지문/Face ID 등)을 통해 Passkey 생성

<br>

### 2. 우리 서비스의 프론트엔드에서 등록 유도
사용자가 Generate Passkey 버튼을 클릭하면 Authentik의 Passkey 등록 Flow로 리디렉션

```
window.location.href = http://localhost:9000/if/flow/default-authenticator-webauthn-setup;
```
