---
title: "[Link Layer] MPLS, DCN"
description: "MPLS, DSN"
date: 2024-06-11T05:07:36.177Z
tags: ["network"]
slug: "Link-Layer-MPLS-DCN"
categories: Network
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:06:41.916Z
  hash: "8e3665c5053f1477061fbd0189eaadeef6fdea637f2bb3fad122348e421a36ca"
---

## ✏️ MPLS
> #### MPLS (Multiprotocol Label Switching)
: 스위칭 속도를 빠르게 만드는 기술

<br>

### ■ 특징

1. direct indexing이 가능함

2. IP datagram은 그대로 유지하고 MPLS 헤더를 중간에 끼워 넣음
```Ethernet Packet = Ethernet header + MPLS header + IP datagram```

3. path를 결정 하는 알고리즘은 router마다 다르다.


<br>

### ■ MPLS Header
![](/assets/posts/image.png)

- label
: VCID 역할 ➜ Direct Indexing이 가능하다

- Exp
: 여유 bit

- S(stack)
: label의 중첩을 위한 bit

- TTL


<br>


### ■ MPLS 라우터
일반 라우터: Dest IP address만 보고 경로를 결정한다.
MPLS 라우터: MPLS 헤더를 보고 데이터를 전송한다.


<br>

- MPLS 라우터는 IP Datagram을 까보지 않는다.
: <span style = "background-color: lightgreen; color:black">Flexibility</span>

- MPLS 라우터는 동일한 목적지도 다른 route로 전송이 가능하다.
: Traffic Engineering이 가능하다. (priority 제공)

- link 실패시 미리 백업된 경로로 우회 가능하다.

<br>

### ■ Signaling protocol
> 어떤 경로를 통해 데이터를 보낼지 결정하는 프로토콜

MPLS는 Signaling Protocol로 <span style = "background-color: lightgreen; color:black">RSVP-TE</span>를 사용하고, Routing Protocol로 OSPF를 사용한다.

<br>

---

<br>

## ✏️ DCN
> #### DCN (Data Center Networks)
: 수 만개의 host가 근접하여 연결되어 있는 network

### ■ 구성
![](/assets/posts/image.png)


| 요소 | 설명 |
| - | - |
| host | 하나의 Computer, 각 host는 locally unique한 IP 주소를 부여받는다. |
| TOR(Top Of Rack) Switch | 하나의 Rack에 존재하는 host간 통신을 위해 사용하는 Switch |
| Tier-2 Switch  | TOR Switch들을 연결하는 스위치 |
| Tier-1 Switch | Tier-2 Switch들을 연결하는 스위치 |
| Border Router | 외부와 DCN을 연결하는 라우터 |


<br>

### ■ 프로토콜
DCN에서 사용되는 프로토콜, 관리 방법 등은 다음과 같다.

| 계층 | 프로토콜 |
| - | - |
| link Layer | RoCE(Remote DMA over Converged Ethernet) |
| Transport Layer | ECN (Congestion Control 할 때 사용한다) |

- Routing 관리는 SDN으로 한다.


<br>

---

<br>

## REFERENCE
Computer Networking, A Top Down Approach - JAMES F.KUROSE