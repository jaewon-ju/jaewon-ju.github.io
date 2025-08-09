---
title: "[Network] Introduction"
description: "네트워크 입문"
date: 2024-03-05T04:42:21.084Z
tags: ["network"]
slug: "Network-Introduction"
series:
  id: 286776ce-3b67-40a8-b62e-6932373b0109
  name: "Network"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:05.760Z
  hash: "9acf6d952c63ea309602e9f33a9eda6abbfcf24a1f4156eac55b475c505ca1fa"
---

## ✏️ 네트워크의 종류

- Network edge: end system
- Network core: packet/circuit switching, internet structure
- Access Network

<br>

### ■ Network Edge
>Network Edge란 end system, 즉 클라이언트와 서버를 뜻한다.

<br>

### ■ Network Core
>Network Core은 end system을 연결하는 역할을 한다.

서로 연결되어 있는 라우터의 집합체이다.

>#### Network Core의 주요 기술
Routing & Switching(forwarding)<br>
- Routing - Protocol 존재
어디로 라우팅할 것인지 Algorithm이 존재한다.<br><br>
- Switching - Protocol 없음
그저 정해진 위치로 보내기만 할 뿐

Network Core에서 패킷을 전달하는 방식은 2가지가 존재한다.

>#### 1. Circuit Switching
전화에서 주로 사용하는 방식이다. <br>
- Connection-Oriented: 자원을 할당한다.
- Dedicated: 특정 사용자와 통신할 때 전용 선로를 사용한다.

>#### 2. Packet Swtiching
인터넷에서 주로 사용하는 방식이다.<br>
- Connectionless: 자원을 할당하지 않는다.
- NonDedicated: 여러 Packet과 링크를 공유한다.
- Queue: Router에 Datagram을 저장한 후에 전달한다.
⚠️ 하나의 Datagram 전체를 다 받아야지만 Forwarding 할 수 있다.
- RSVP: 멀티미디어 통신을 위한 Signaling Protocol (가상의 연결을 위한 Protocol)

#### ※ Virtual Circuit
Circuit + Packet의 하이브리드 방식이다.
ATM에서 사용하는 방식이다.

<br>


### ■ Access Network
> Access Network는 end system과 Network Core의 중간다리 역할을 하는 네트워크이다.

The network that physically connects an end system to the first router.

ex) 인터넷 망에 접속하기 위해서 사용하는 랜선


<br>

---

<br>

## ✏️ 네트워크의 구성 요소

1. computing devices: end hosts
2. Packet switches: router, switch
3. Communication Links: 유/무선 통신 링크
4. Networks: 네트워크가 모여 더 큰 네트워크가 된다

<br>

---

<br>

## ✏️ Internet
>Internet: a logical network of physical networks

host는 ISP를 통해서 Internet과 연결될 수 있다.
ISP는 IXP로 서로 연결된다.

<br>

---

<br>

## ✏️ Network Performance
네트워크의 성능은 Delay와 Loss, Throughput으로 판단한다.

### ■ Delay
> Packet Switching 방식의 Delay
= Transmission + Propagation + Queueing + Processing

![](https://velog.velcdn.com/images/jaewon-ju/post/ee2527a2-faa7-464c-9ab9-da31a60f4261/image.png)

1 == 최대 용량의 Traffic 부하
부하가 걸릴수록 delay가 기하급수적으로 증가한다.
-> Congestion Control이 중요하다.
<br>

Delay의 측정은 무엇으로 하는가? 
__➜ Traceroute Program__

- end to end 통신을 할 때 각 라우터에서 발생하는 지연 시간을 측정하는 프로그램이다.
- ICMP를 사용한다.



<br>

### ■ Loss
Router: First In First Out (우선순위 개념이 없다.)
- Queue Scheduling을 진행한다.
- 가득 찬 Queue에 도착한 패킷은 자동 drop 된다 == Packet Loss.
- loss Packet은 재전송(retransmission)을 통해서 해결된다.
<br>

#### TCP/IP 3계층에서 Loss 해결
: neighbor node가 알아채고, Previous node에서 재전송

#### TCP/IP 4계층에서 Loss 해결
: source에서 재전송하는 것이 TCP, 재전송을 하지 않는 것이 UDP이다.

<br>

### ■ Throughput
> Throughput =  bits / time [bps]
단위 시간당 처리되는 비트 수

파이프가 넓을수록 Throughput이 높다.



<br>

---

<br>

## ✏️ TCP/IP 5계층
OSI 7계층 모델은 네트워크 통신을 7개의 계층으로 나누어 설명하였다.
하지만, OSI 7계층 모델은 매우 복잡하여 현재는 TCP/IP 4계층 (또는 5계층) 모델이 더 자주 사용되고 있다.

TCP/IP 5계층 모델의 구조는 다음과 같다.

| TCP/IP 5계층 모델 |
| - |
| Application Layer |
| Transport Layer |
| Network Layer |
| DataLink Layer |
| Physical Layer |

<br>

---

<br>


## ✏️ Security
각 계층에서 보안을 고려한다!

ex) 3계층: IPSEC
5계층: HTTPS = HTTP + TLS

### ■ malware
__Virus__
 - 자기 복제 기능을 가진 악성 코드. 
- User Interaction이 발생해야 감염된다.

<br>

__Worm__
- 네트워크를 통해 자체적으로 전파되는 악성 코드. 
- User Interaction이 발생하지 않아도 전파된다.

<br>

### ■ DOS
__DDOS(Distributed Denial Of Service)__ 
- 대규모 트래픽을 발생시켜 서버를 마비시키는 공격
- Server가 Client 와 맺을 수 있는 TCP 연결 수는 제한이 있다. 
- 대량의 감염된 Client들이 동시에 Server에 요청을 하면 Server가 다운된다.

<br>


### ■ Packet Interception
__Packet Sniffing:__ broadcasting으로 전송된 Packet을 훔쳐보는 방법 
__Packet Spoofing:__ Packet을 보낸 Source를 속이는 방법


<br>

---

<br>


## REFERENCE
Computer Networking, A Top Down Approach - JAMES F.KUROSE