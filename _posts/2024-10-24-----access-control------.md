---
title: "[네트워크 보안] Access Control 및 클라우드 보안"
description: "Access Control와 클라우드 보안에 관하여"
date: 2024-10-24T01:13:45.327Z
tags: ["네트워크 보안"]
slug: "네트워크-보안-Access-Control-및-클라우드-보안"
categories: Network
velogSync:
  lastSyncedAt: 2025-08-18T06:18:45.094Z
  hash: "acb86dc83c682c4a6def6c675a40b60f6bb9c266ae09825fc36c875dcac4d01d"
---

## ✏️ NAC (Network Access Control)

>Network Access Control(NAC)
: 사용자가 네트워크에 로그인하는 것을 인증하고, 사용자가 어떤 데이터에 접근하고 어떤 행동을 할 수 있는지를 결정하는 시스템이다.

<br>

### ■ NAC의 주요 요소

- **접근 요청자 (Access Requestor)**
   - 네트워크에 접근을 시도하는 노드
   - NAC이 관리하는 모든 장치

- **정책 서버 (Policy Server)**
   - 접근 요청자의 상태와 기업의 정의된 정책에 기반하여 접근 허가 여부를 결정
   - AR의 백엔드 시스템(안티바이러스, 패치 관리 등)을 고려하여 결정

- **네트워크 접근 서버 (Network Access Server)**
   - 사용자가 네트워크에 연결할 때 항상 거쳐야 하는 장치
   - Media Gateway, RAS(Remote Access Server)로도 불림
   - 자체 인증 서비스를 갖추거나, 정책 서버로부터 인증을 받음

> 인증이 성공하면 클라이언트와 인증 서버 간에 세션 키(Session Key)를 교환하며, 정책 서버와 적합성 서버가 포함된 Quarantine Network를 통해 패치 관리, 안티바이러스 등의 확인 과정을 거친다.

<br>

### ■ 접근 강화 방법

- **IEEE 802.1X**
   - 포트에 IP 주소를 할당하기 전에 인가(Authorization)를 수행하는 링크 계층 프로토콜
   - EAP(Extensible Authentication Protocol)를 사용하여 인증 절차 수행

- **VLAN**
   - 네트워크를 다수의 논리적 세그먼트로 분리
   - NAC 시스템은 어떤 LAN에 AR을 연결할지 결정
   - 동적 생성 가능하며, AR은 하나 이상의 VLAN에 속할 수 있음

- **Firewall**
   - 네트워크 트래픽을 허용하거나 거부하여 NAC를 수행

- **DHCP 관리**
   - 서브넷과 IP 할당을 기반으로 IP 계층에서 NAC 수행
   - 설치와 구성이 간단하지만, IP Spoofing에 취약함

<br>

---

<br>

## ✏️ EAP (Extensible Authentication Protocol)

>#### EAP
: 네트워크 접근 및 인증 프로토콜을 위한 프레임워크로, 다양한 인증 방법을 제공한다.

### ■ 주요 특징

- **RFC 3748**에 정의됨
- AR과 인증 서버(AS) 간 다양한 인증 방법 수행
- 네트워크, 링크 계층 장치에서 작동

![EAP 구조](https://velog.velcdn.com/images/jaewon-ju/post/f68a40f5-5ad3-4895-abe5-5446c85a8dcf/image.jpeg)

<br>

### ■ EAP 방법

- **EAP-TLS**
- **EAP-TTLS**
- **EAP-GPSK**
- **EAP-IKEv2**

EAP는 인증 방법의 큰 틀을 제공하며, 다양한 인증 시나리오에 활용 가능하다.

![EAP 동작 방식](https://velog.velcdn.com/images/jaewon-ju/post/3add46ec-ebf5-4c6d-90f4-3b2894f78a40/image.png)

<br>

### ■ 주요 구성 요소

- **Peer**: 클라이언트 역할
- **Authenticator**: 네트워크 접근을 허용하기 전에 EAP 인증을 요구하는 AP 또는 NAS
- **Authentication Server**: Peer와 특정 EAP 방식 협상 및 인증 정보(Credential) 검증 후 네트워크 접근 인가 (일반적으로 RADIUS 서버)

EAP는 <span style = "background-color: lightgreen; color:black">Pass Through Mode</span>로 동작한다.

<br>

---

<br>

## ✏️ IEEE 802.1X Access Control

>#### IEEE 802.1X
: 포트 기반의 Access Control 프로토콜로, LAN 환경에서 작동한다.

### ■ Port의 정의

포트는 Authenticator 내에 정의된 **논리적(Logical)** 엔티티이다.

| **통제된 포트** | **통제 안 된 포트** |
|------------------|-------------------|
| 요청자가 인증된 후 요청자와 AS 간의 PDU 교환 | 인증 여부와 무관하게 시스템 간 PDU 교환 |

![IEEE 802.1X 구조](https://velog.velcdn.com/images/jaewon-ju/post/cbfae655-4abb-4b3f-a303-cc74977e2dd3/image.png)

<br>

### ■ EAPOL (EAP over LAN)
EAPOL은 네트워크 계층에서 동작하며, 링크 계층은 IEEE 802 LAN을 사용한다.



#### EAPOL 프레임 유형

| **프레임**       | **설명**                                           |
|------------------|---------------------------------------------------|
| EAPOL-EAP        | EAP 패킷을 포함한 프레임                         |
| EAPOL-Start      | Peer가 Authenticator에게 통신 시작 요청          |
| EAPOL-Logoff     | Peer가 Authenticator에게 통신 종료 알림          |
| EAPOL-Key        | 키 교환을 위한 프레임                            |

<br>

---

<br>

## ✏️ 클라우드 컴퓨팅

클라우드 컴퓨팅은 어디서나 존재하며, 평범하게 자원 공유가 가능한 **Shared Pool**의 개발이다.

- **Broad Network Access**: 넷프워크를 통해 광범위한 액세스 제공
- **Rapid Elasticity**: 필요에 따라 자원을 빠른 확장/축소 가능
- **Measured Service**: 사용한 자원에 따라 가루가 되는 목록
- **On-demand Self-service**: 사용자가 지역적인 요청과 관리 가능
- **Resource Pooling**: 자원을 공유 풀로 관리하여 힘을 개선

<br>

### ■ 클라우드 서비스 모델

| 모델 | 설명|
| - | - |
| SaaS | 사용자는 CP가 클라우드에 올려놓은 응용 프로그램을 이용|
| Paas | 사용자는 CP가 제공하는 언어나 도구로 어플리케이션을 deploy<br>클라우드가 미들웨어 형태의 서비스를 제공(AWS)|
| IaaS     | 사용자가 가상화된 클라우드의 자원을 이용 |

<br>

### ■ 클라우드 배포 모델

| **모델**        | **설명**                       |
|-----------------|---------------------------------|
| Public Cloud    | CSP(Cloud Service Provider)가 소유 |
| Private Cloud   | 하나의 기관이 단독 운영         |
| Community Cloud | 여러 기관이 공용                |
| Hybrid Cloud    | 두 개 이상의 클라우드 조합       |

<br>

### ■ 클라우드 보안

클라우드 환경에서 발생할 수 있는 보안 문제와 이를 해결하기 위한 방안을 정리

- 클라우드 컴퓨팅 오용 및 비도더적 활용
- 안전하지 않은 인턴페이스와 API
- 악의적 내부자 문제
- 공용 기술 문제
- 계약 및 서비스 하이재킹

<br>

---

<br>

## ✏️ 클라우드 보안 서비스 (SecaaS)

SecaaS(Security as a Service)는 클라우드 서비스 제공자가 제공하는 보안 서비스 패키지를 의미한다.

- 보안 책임이 기업이 아니라 클라우드 서비스 제공자에게 있음
- SaaS의 일반적인 방식으로 활용하며, 클라우드 보안을 강화하는 주요 방식

