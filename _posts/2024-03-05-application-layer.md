---
title: "[Application Layer] Introduction"
description: "Application Layer 소개"
date: 2024-03-05T01:49:27.456Z
tags: ["network"]
slug: "Application-Layer"
series:
  id: 286776ce-3b67-40a8-b62e-6932373b0109
  name: "Network"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:52.332Z
  hash: "22d16eff16cea4b2e1d47d39602fd77539ee8dee08113bfd1933035bb3b32cf5"
---

각 End System(사용자, 서버 등)은 Application을 가진다.

> Application Layer는 이러한 Application들과 Application을 위한 Protocol이 모여있는 계층이다.

---

<br>

## ✏️ Application Architecture

Application Architecture는 2가지가 존재한다.

1. Client-Server
2. Peer to Peer

<br>

### ■ Client - Server

클라이언트 - 서버간의 통신

![](https://velog.velcdn.com/images/jaewon-ju/post/79f0279a-6f18-4185-8492-03fba14d1697/image.png)


- 클라이언트간 통신은 불가능하다.
- 서버는 <span style = "color:red">항상 켜져있다.</span>
- 클라이언트의 IP 주소는 동적으로 변한다. (DHCP 사용)
- 서버의 IP 주소는 고정이다.

Client - Server 방식의 Protocol은 HTTP, IMAP, FTP 등이 존재한다.

<br>

### ■ Peer to Peer

Peer간의 통신

- Always On Server가 존재하지 않는다.
- Peer 각각이 Client이자 Server이다.
- IP 주소 할당이 필요하지만, DHCP를 사용하지 않고 수동으로 하는 편이다.

<br>

---

<br>

## ✏️ Socket
TCP/IP 5계층 모델에서 하위 4계층은 운영체제에 구현되어 있다.

그렇다면 Application Layer에서 생성되는 메시지를 어떻게 운영체제로 내려보낼 수 있을까?
➜ Socket을 사용한다.

>Socket이란 IPC(Inter-Process Communication)의 한 종류로, Application Layer와 Transport Layer의 중간 다리 역할을 한다.

- 서로 다른 host의 프로세스간 통신을 위해 사용된다.
- 프로세스는 Socket이 제공하는 API나 함수로 통신한다.



<br>

---

<br>

