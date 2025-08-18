---
title: "[Network] Wireless & Mobile Network"
description: "무선 네트워크와 모바일 네트워크에 대해서"
date: 2024-06-14T02:50:58.918Z
tags: ["network"]
slug: "Network-Wireless-Mobile-Network"
categories: Network
velogSync:
  lastSyncedAt: 2025-08-18T06:18:46.371Z
  hash: "538d788553b8b3428722669c895de6389019452a2b25a12b74c5efc8db3065c3"
---

# ✏️ Introduction
## ■ wireless network 의 구성요소

![](https://velog.velcdn.com/images/jaewon-ju/post/b01164f8-aad9-4279-806a-74e705d64874/image.png)

| 요소 | 설명 |
| - | - |
| Wired Network Infrastructure | 무선 네트워크가 연결되고 통신할 수 있는 기반 시설  |
| Access Point & Base Station | 네트워크 내의 무선 장치들과 통신을 연결하는 장치 |
| Wireless Link | host와 BS, AP를 연결하는 경로<br>wireless link 자체를 backbone으로 사용 가능하다.<br>(ex. 미국의 경우, 땅이 커서 무선 link를 backbone으로 사용한다.) |


- Wireless link는 multiple access가 가능하다.
➜ 충돌(Collision) 발생 가능 
➜ MAC 프로토콜을 사용해서 해결한다.

- 무선의 경우, 주파수 대역마다 특징이 다르다.

<br>

---

<br>

## ■ Network Mode
### 1. infrastructure mode
>Base Station/Access Point를 사용하는 네트워크 모드

- 예시로, Wifi, Cellular 등이 존재한다.
   - 이 경우, single hop 연결을 사용한다. (Base Station에 직접 연결)
   <br>
- Wireless Mesh Network(WMN)도 존재한다.
   - 이 경우, multi hop 연결을 사용한다. (여러 노드를 거쳐 목적지에 도달)

<br>

---

<br>

### 2. ad hoc mode
>Base Station을 사용하지 않고, 노드들끼리 네트워크를 구성하는 모드

- Bluetooth가 하나의 예시이다.
   - single hop 방식 사용
- VANET(Vehicular Ad hoc Network), MANET(Mobile Ad hoc Network)
   - multi hop 방식 사용 (ex. 군대 무전 통신)



<br>

---

<br>

# ✏️ Wireless
## ■ Wireless link의 특성
- 신호 세기가 유선보다 약함
- 간섭 문제가 발생 가능 (2.4GHz의 경우 Wifi, Cellular 등에서 사용)
- multipath propagation (object 들에 반사되어 목적지에 시차를 두고 도착하는 현상)

<br>

- SNR (Signal-to-Noise Ratio) 값이 클수록 좋다.
- BER (Bit Error Rate) 값이 작을수록 좋다.
```10^-1 : 10 bit 전송하면 1 bit 오류```
```10^-7: 10^7 bit 전송하면 1 bit 오류```

<br>

### ► SNR, BER Tradeoff

>#### 1. Encoding 기법이 주어진 경우 (ex. QAM)
power을 세게 하면 
➜ SNR이 커지고
➜ BER이 작아진다.

<br>

>#### 2. SNR이 주어진 경우
BER 요구 사항을 충족하기 위해 인코딩 기술을 조정할 수 있다.
➜ ex) Encoding 기법을 바꾸고 BER을 낮춘다.

특히, Mobile 에서는 SNR이 빠르게 바뀌므로 무선 통신은 매우 어렵다!

<br>

### ► Hidden Terminal
A와 B는 서로 전송 반경 안에 있다.
A와 C는 전송 반경 밖에 있다.
B와 C는 서로 전송 반경 안에 있다.

A가 B에게 전송했을 때, C는 A가 B한테 전송한다는 사실을 알지 못한다.
-> Hidden Data
C도 B한테 보냄
-> 충돌 발생

CSMA/CA 의 RTS(broadCast)와 CTS(나 A랑 통신할거야 BroadCast)를 사용해서 해결한다.

장애물 뿐만 아니라, 신호가 약해서 Hidden Terminal 문제가 발생할 수 있다.




<br>

---

<br>

## ■ Cellular
이동통신은 3GPP에서 표준화한다.

- 4G는 완전히 IP를 기반으로 한다. (All IP): Enhanced Packet Core

wired internet과 공통점
1. 이동통신에서는 edge/core below to same carrier
2. Tunneling을 많이 사용한다.

차이점
1. wireless link layer
2. 이동성을 중요하게 여김
3. 유저 식별을 위해 IP를 사용하는게 아니라 SIM card를 사용
-> IMSI(International Mobile Subscriber)
4. home network가 존재
-> roaming


<br>

### ► 구성요소

| 블록 | 기능 |
| - | - |
|  |  |
| HSS(Home Subscriber Service) | Home Network와 관련된 정보를 기록한다.<br>우리나라<br>MME와 함께 Authentication 제공 |
| Gateway | Serving Gateway: <br>PDN Gateway: NAT 서비스 제공 |
| MME | Authentication과 관련된 서비스 제공<br>Tunneling 관여 |

<br>

### ► Data & Control plane
Data: GPRS Tunneling Protocol을 사용한다.

UE - BS assocation을 맺는다.
BS가 broadcast 

<br>

energy saving을 위해서 sleep을 한다.

deep sleep은 다시 association을 맺어야 한다.


control: mobility 관리, security, authentication

<br>

---

<br>

## ■ 5G
4세대에 비해서 10배 좋아짐

coverage는 작지만, 훨씬 빠름
4세대랑 호환 불가.



<br>

---

<br>

# ✏️ Mobility


단말이 너무 많기 때문에,
단말이 router에게 나 여기 있어~ 라고 알리지 않음
대신에 indirect routing을 한다. (기본)
근데 overhead가 크니까 direct로 할 수도 있다~

indirect rouing: 상대방과 나 사이에 home network를 사용
direct routing: 상대방 위치를 알아내서 직접 통신

home network 이외의 다른 network를 visited network라고 함.
다른데서 방문한 애를 지원해줌


<br>

---

<br>

## ■ Mobile IP
내가 사용하는 핸드폰에 IP가 들어가야 되는 것이 최대 단점이다.

indirect routing
home network
tunneling

Cellular랑 똑같이 사용한다.

>wireless 와 mobility가 상위 계층에는 어떤 영향을 주는가?
TCP에 큰 영향을 줌
: 무선 congestion - window를 줄인다고 해결되는 문제가 아님

<br>

---

<br>

# REFERENCE
Computer Networking, A Top Down Approach - JAMES F.KUROSE