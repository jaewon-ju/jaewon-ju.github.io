---
title: "[Auth] IDP(Identity Provider)"
description: "What is IDP #Auth"
date: 2025-03-06T06:44:59.626Z
tags: ["Auth","CS 지식"]
slug: "CS-지식-IDPIdentity-Provider"
series:
  id: 6499233e-ce0d-46f5-97c0-3565082c0f25
  name: "Auth"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:02.359Z
  hash: "557afd44372b88e1c2b9a4d8076f60e15a3e9fb2b0d825ff9ff3350cf98dc41d"
---

## ✏️ IDP란?
> #### IDP(Identity Provider)
: 사용자가 웹사이트나 앱에 로그인할 때, 그 사용자가 누구인지 확인해 주는 시스템이다. 
쉽게 말해, IDP는 사용자의 신원을 증명해 주는 역할을 한다.

예를 들어, 어떤 웹사이트에서 "Google 계정으로 로그인" 버튼을 눌렀다고 가정해 보자. 그러면 Google이 사용자의 신원을 확인하고, 해당 웹사이트에 "이 사람은 인증된 사용자입니다"라고 알려준다. 이때 Google이 바로 IDP의 역할을 하는 것이다.

<br>

---

<br>

## ✏️ IDP의 역할

- **사용자 인증(Authentication):** 사용자가 입력한 아이디와 비밀번호가 맞는지 확인한다.
- **권한 부여(Authorization):** 사용자가 특정 서비스나 기능을 사용할 수 있는 권한이 있는지 결정한다.
- **싱글 사인온(SSO, Single Sign-On):** 한 번 로그인하면 여러 서비스에 자동으로 로그인할 수 있도록 해 준다.
- **다중 인증(MFA, Multi-Factor Authentication):** 보안을 강화하기 위해 비밀번호 외에도 OTP, 지문 인식 등 추가 인증 방식을 사용할 수 있다.
- **사용자 계정 관리:** 새 계정을 만들거나 삭제하는 등의 기능을 제공한다.
- **로그 및 보안 감시:** 누가 언제 로그인했는지 기록하고, 이상한 로그인 시도를 감지한다.

<br>

### ◼︎ OAuth와 무엇이 다른가?

OAuth는 IDP와 다르게, 인증(Authentication)이 아니라 **권한 부여(Authorization)**를 담당하는 프로토콜이다. 
쉽게 말해, OAuth는 사용자가 특정 애플리케이션이 자신의 데이터에 접근할 수 있도록 허용하는 데 초점을 맞춘다.

| 비교 항목 | IDP (Identity Provider) | OAuth (Open Authorization) |
| --- | --- | --- |
| 목적 | 사용자의 신원을 확인 (로그인) | 애플리케이션이 사용자 데이터에 접근할 권한 부여 |
| 사용 예시 | Google 계정 로그인, SSO | Google이 사용자 대신 YouTube API에 접근 허용 |
| 역할 | 인증 및 사용자 관리 | 인증은 수행하지 않고, 인증된 사용자에 대한 권한 부여 |
| 대표 프로토콜 | SAML, OpenID Connect (OIDC) | OAuth 2.0 |
| 로그인 기능 포함 여부 | 포함됨 | 포함되지 않음 (OIDC 필요) |


>즉, **IDP는 "누구인지"를 확인하고, OAuth는 "무엇을 할 수 있는지"를 결정하는** 차이가 있다.


<br>

### ◼︎ 자체 제작하는 로그인 기능과 무엇이 다른가?

| 비교 항목 | Java Controller + DB 로그인 | IDP 사용 |
| --- | --- | --- |
| 인증 방식 | 직접 DB에서 사용자 확인 | IDP가 인증 담당 |
| 보안 수준 | 개발자가 직접 관리 | 보안 전문가들이 설계한 검증된 시스템 |
| SSO 지원 | ❌ | ✅ |
| MFA 지원 | 직접 구현해야 함 | 기본 제공 (OTP, 지문, 보안 키 등) |
| 유지보수 | 직접 개발 및 유지보수 필요 | 외부 서비스 활용 가능 |
| 확장성 | 개별 서비스마다 인증 구현 필요 | 여러 서비스에서 쉽게 인증 가능 |
| 표준 준수 | 개발자가 직접 구현 필요 | SAML, OAuth, OIDC 같은 표준 지원 |


>
- **보안성 강화**
- **SSO 및 MFA 같은 기능을 쉽게 추가 가능** 


