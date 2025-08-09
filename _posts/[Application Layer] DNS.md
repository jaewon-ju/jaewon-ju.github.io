---
title: "[Application Layer] DNS"
description: "DNS란 무엇인가?"
date: 2024-03-05T09:53:39.791Z
tags: ["network"]
slug: "Application-Layer-DNS와-URI"
thumbnail: "https://velog.velcdn.com/images/jaewon-ju/post/c096bc81-3aa4-4d5a-9d74-c31e28ff9c72/image.png"
series:
  id: 286776ce-3b67-40a8-b62e-6932373b0109
  name: "Network"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:35.280Z
  hash: "1444ae00976794352e09885f23e874f6490e6507832bd29d9ebf26de0ac2c8a0"
---

## ✏️ DNS
>DNS(Domain Name System)는 Name ↔︎ IP address를 매핑하는 시스템이다.

ex) [www.naver.com](www.naver.com) ↔︎ 192.89.02.11

- Distributed & hierarchical 구조로 정보를 저장하는 DB이다.
- HTTP/SMTP 등의 사용자가 제공한 host name을 IP address로 바꿔준다.

<br>

---

<br>

## ✏️ DNS 구조
DNS는 Distributed & hierarchical 구조를 가지고 있다.

![](https://velog.velcdn.com/images/jaewon-ju/post/c096bc81-3aa4-4d5a-9d74-c31e28ff9c72/image.png)

| 구분 | 특징 |
| - | - |
| Root Server | name resolve가 불가능하다.(최후의 수단) |
| TLD(Top Lebel Domain) Server | .com, .net, .kr 같은 Top Level Domain을 담당한다. |
| Authoritative Server | <span style = "background-color: lightgreen; color:black">실제 Name ↔︎ IP address가 매핑되어 있는 DNS Server</span> |
| Local Server | host의 DNS query를 받고 name resolution을 한 뒤 host에게 전달|

<br>

---

<br>

## ✏️ Name Resolution
Name에 대응되는 IP 주소를 찾아라!
![](https://velog.velcdn.com/images/jaewon-ju/post/5e8738c5-ee71-4e1b-8ec4-1e828a92603b/image.png)

1. Host가 Local에 DNS query 전송
Q: 【 jaewon-ju.velog.com 주소 어디야? 】

2. Local이 Root에 요청, Root가 Local에 응답
Q: 【 jaewon-ju.velog.com 주소 어디야? 】
A: 【 .com 관리하는 DNS 주소 알려줄게 】

3. Local이 TLD에 요청, TLD가 Local에 응답
Q: 【 jaewon-ju.velog.com 주소 어디야? 】
A: 【 .velog 관리하는 DNS 주소 알려줄게 】

4. Local이 Authoritative에 요청, Authoritative가 Local에 응답
Q: 【 jaewon-ju.velog.com 주소 어디야? 】
A: 【 192.05.01.11 】

5. Local이 Host에 답장
A: 【 192.05.01.11 】


<br>

DNS에 대한 더 자세한 정보는 <a href= "https://github.com/jaewon-ju/Study-Notes/tree/master/DATA_COMMUNICATION/Application%20Layer">Application Layer 스터디 노트</a> 참고

