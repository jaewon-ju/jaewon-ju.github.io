---
title: "[Auth] Authentik 비밀번호 복구 기능, email 환경 설정"
description: "Authentik에서 비밀번호 복구 기능을 추가하는 방법에 대해서 알아보자"
date: 2025-04-15T05:48:19.148Z
tags: ["Auth","Authentik"]
slug: "Auth-Authentik-비밀번호-복구-기능-email-환경-설정"
categories: Auth
velogSync:
  lastSyncedAt: 2025-08-18T06:18:44.456Z
  hash: "256dd9f9a6cd0b23d5ec131a770d8ed33b5e5fca50d188ac3ada76dccff815f8"
---

## ✏️ Authentik Password Recovery 설정 가이드
이 문서는 **Authentik에서 비밀번호 재설정** 기능을 구성하는 과정을 설명한다. 
비밀번호 재설정을 구현하기 위해 필요한 요소는 다음과 같다:

<br>

- **메일 발송 환경 구성**: 비밀번호 재설정 링크를 사용자에게 이메일로 전송하기 위한 SMTP 설정
- **Password Policy**: 비밀번호에 대한 최소 요구 조건 (문자 길이, 특수문자 포함 등)
- **Identification Stage**: 사용자 식별 단계 (이메일 또는 사용자명 입력)
- **Email Stage**: 비밀번호 재설정 링크를 이메일로 발송하는 단계
- **Recovery Flow**: 위 스테이지들을 순차적으로 실행하기 위한 흐름 구성
- **Password Prompt 및 Write Stage**: 사용자가 새 비밀번호를 입력하고 적용하는 단계
- **Attach To Authentication Flow**: Authentication Flow에 비밀번호 복구 기능 추가


<br>

---

>### 1. 메일 전송 설정 (.env 파일)
SendGrid를 사용하는 경우 `.env` 파일에 아래 항목 추가:

```env
AUTHENTIK_EMAIL__HOST=smtp.sendgrid.net
AUTHENTIK_EMAIL__PORT=587
AUTHENTIK_EMAIL__USERNAME=apikey
AUTHENTIK_EMAIL__PASSWORD=SG.패스워드내용
AUTHENTIK_EMAIL__USE_TLS=true
AUTHENTIK_EMAIL__USE_SSL=false
AUTHENTIK_EMAIL__FROM=이메일주소
```

---

>### 2. Password Policy 생성
1. 왼쪽 메뉴에서 **Policies** 클릭
2. **Create** 버튼 클릭
3. **Type**: `Password Policy` 선택
4. 특수문자 포함, 길이 제한 등 조건 설정

---

>### 3. Email Identification Stage 생성
1. 왼쪽 메뉴에서 **Stages** 클릭
2. **Create** 버튼 클릭
3. **Type**: `Identification Stage` 선택
4. User Fields: `username`, `email` 지정

---

>### 4. Email Recovery Stage 생성
1. **Stages** 메뉴에서 **Create** 클릭
2. **Type**: `Email Stage` 선택
3. Template: `Password Reset` 선택

---

>### 5. Recovery Flow 생성
1. **Flows** 메뉴에서 **Create** 클릭
2. 이름: 원하는 이름 지정 (예: `password-recovery-flow`)
3. Designation: `Recovery` 선택

---

>### 6. Flow에 스테이지 바인딩
1. 생성한 `password-recovery-flow` 클릭
2. **Stage Binding** 클릭 → **기존 스테이지 바인딩** 클릭
   - Stage: `email identification stage`
   - Order: `10`
3. 다시 **기존 스테이지 바인딩** 클릭
   - Stage: `email recovery stage`
   - Order: `20`
4. 다시 **기존 스테이지 바인딩** 클릭
   - Stage: `default-password-change-prompt`
   - Order: `30`
5. 다시 **기존 스테이지 바인딩** 클릭
   - Stage: `default-password-change-write`
   - Order: `40`

---

>### 7. Password Prompt Stage 설정
1. `Stages` 메뉴에서 `default-password-change-prompt` 편집
2. Validation 항목에 이전에 생성한 `Password Policy` 지정

---

>### 8. 인증 플로우에 복구 기능 추가
1. `Flows` 메뉴에서 `default-authentication-flow` 클릭
2. 스테이지 바인딩 - `default-authetication-identification` 편집 버튼 클릭
3. 플로우 설정에서 복구 플로우: recovery(방금 생성한 복구 플로우) 지정

---

이로써 사용자는 이메일을 통해 비밀번호 재설정 링크를 받고, 정책에 맞춘 새 비밀번호로 변경할 수 있게 된다.
