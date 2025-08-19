---
title: "[Network Layer] Control Plane"
description: "Network Layer의 Control Plane에 대해서"
date: 2024-05-21T03:48:53.207Z
tags: ["network"]
slug: "Network-Layer-Control-Plane"
categories: Network
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:39:01.592Z
  hash: "d2a12230b21470183b8c55125b4f4a42099581664f6092906b25e47a85f111f4"
---

>Data Plane이 Forwarding을 담당하고, Control Plane을 Forwarding을 어떤 경로로 해야하는지 결정하는 역할을 한다.

- 즉, Control Plane 은 Source - Dest의 경로를 찾고 router에 알려주는 역할을 한다.

<br>

---


# ✏️ Routing Protocols
> Routing이란 Source에서 Destination 까지의 경로를 찾는 기술이다.

Routing Protocol의 동작 과정

1. Routing 정보 수집
2. 정보를 기반으로 경로 결정
3. 결정된 경로에 해당하는 Routing Table 작성

<br>

⚠️ Internet은 hop-by-hop Routing 방식을 사용한다.

<br>

## ■ Classification
Routing Protocol을 정보를 수집하는 방식을 기준으로 구분하면, 다음과 같이 나누어질 수 있다.

| 구분 | Detail |
| - | - |
| Global | 자신의 router 정보를 특정 네트워크에 존재하는 모든 router에 전송한다.<br>router는 범위 내에 존재하는 모든 router의 정보를 가지고 있다.<br>link state algorithm [OSPF] |
| Decentralized | 자신의 router 정보를 <span style = "color:red">인접한</span> 라우터와 교환한다.<br>distance vector algorithm [RIP]|


<br>

Routing 알고리즘의 실행 주기로 구분

| 구분 | Detail |
| - | - |
| Static | 경로가 잘 안바뀜(계산을 자주하지 않음) |
| Dynamic | 경로가 자주 바뀜 |

- OSPF, RIP는 Dynamic이다.

<br>

---

<br>

## ■ link State
>Link State란 Routing Protocol의 일종으로, 네트워크 내 각 라우터가 자신과 직접 연결된 모든 링크의 상태 정보를 유지하고 이를 네트워크의 다른 라우터들과 공유하는 방식이다.

link State 프로토콜의 예시
- OSPF (Open Shortest Path First): 인터넷 프로토콜(IP) 네트워크에서 가장 널리 사용되는 링크 상태 라우팅 프로토콜 중 하나입니다. OSPF는 빠른 수렴 시간과 효율적인 네트워크 자원 사용을 제공합니다.

- IS-IS (Intermediate System to Intermediate System): 주로 대규모 통신망에서 사용되며, OSPF와 유사한 기능을 제공합니다.

<br>

### ► <span id = "OSPF">OSPF</span>
>#### OSPF
: Open Shortest Path First

OSPF의 동작 과정은 다음과 같다.

#### 1. 라우팅 정보 수집

- LSA(Link State Advertisement)를 broadCast 한다. 
- 이 때, flooding을 사용해서 broadCast 한다.
- Flooding은 각 라우터가 받은 LSA를 자신의 모든 인접 라우터에게 재전송하는 과정이다.

![](https://velog.velcdn.com/images/jaewon-ju/post/346bcbf5-dff3-4825-bf71-20159fa7c174/image.png)
- 라우터의 정보를 중복 수신하는 경우, 해당 정보를 버린다.
- flooding의 Message Complexity는 ```O(n^2)```이다.
   - ```각 라우터가 다른 n-1개의 라우터에게 자신의 정보를 전달 * 라우터 n개``` <br>➜ ```O(n^2)```

<br>

#### 2. 정보 기반 경로 결정
Dijkstra의 shortest Path Algorithm을 사용해서 경로를 결정한다.

> Dijkstra의 Shortest Path Algorithm
- C(x,y): 【 노드 x ➜ 노드 y 】 의 <span style = "color:red">Direct</span> Link  Cost. 
(direct 경로가 없는 경우 무한대)
- D(v): 【 source ➜ 노드 v 】 의 총 비용
- P(v): 【 source ➜ 노드 v 】 경로에서 v의 이전 노드<br>

- ```D(v) = min(D(v), D(w) + C(w,v))```
```
【 source ➜ v 】 총 비용 = min(【 source ➜ v 】 비용, 【 source ➜ w ➜ v 】 비용)
```

<br>

- Dijkstra의 Shortest Path Algorithm Time Complexity는 ```O(n^2)```이다.
   - D(a), D(b), ... D(n) 계산
   - 노드를 하나씩 추가하면서 위의 계산을 총 n회 실행
   - 따라서, ```O(n^2)```


<br>

#### 3. routing Table 작성
- Previous Node 값을 토대로 next-hop을 판단한다.
- next-hop이 될 수 있는 노드는, 현재 라우터와 인접한 라우터이다.

<span style = "color:red">⚠️</span> Previous Node 값 자체가 next-hop이 되는건 아니다!


<br>


### ► Oscillations
Link State 방식의 단점은 Oscillations이다.

> #### Oscillations
: Link State 라우팅 프로토콜에서 네트워크 내 라우팅 경로가 자주 변경되는 현상

1. 네트워크의 트래픽이 증가하면 일부 링크의 비용이 변경됨
2. 네트워크 트래픽의 변동에 따라 두 노드 간의 최적 경로가 자주 변경
3. 네트워크 전체에 전파되어야 할 업데이트를 유발

따라서, LSA를 broadCasting 하는 작업, 즉 라우팅 정보 수집 과정을 자주하지 않는다.

<br>

---

<br>

## ■ Distance Vector
> Bellman-Ford 공식
D(x,y): x ➜ y 의 최소 비용
```D(x,y) = min(Cost(x, 이웃) + D(이웃, y))```

이웃도 다른 인접한 라우터에게서 받은 정보를 바탕으로 D 값을 계산하기 때문에, 이웃한테서 받은 정보 D(이웃, y)가 정확하다고는 보장할 수 없다.
➜ <span style = "color:red">Routing Loop</span>가 발생할 수 있다.

하지만, 시간이 지날수록 정확한 값으로 수렴한다.

<br>


### ► algorithm
```D(x,y) = min(Cost(x, 이웃) + D(이웃, y))```

> 슈도 코드
```
if( C(x, 이웃) 에 변화가 있다면 || D(이웃, y) 에 변화가 있다면 ) {
	D(v)를 다시 계산한다.
	재계산된 D(v)를 자신의 이웃에게 알려준다. 
}
```

C, D 값이 정확한 값으로 수렴되면 메시지를 주고 받을 일이 없어진다!

<br>

### ► Cost의 변환
Cost가 줄어드는 경우는 문제가 발생하지 않는다.
반면에, Cost가 증가하는 경우 <span style = "color:red">Count-to-Infinity</span> 문제가 발생할 수 있다.


> Link Cost가 줄어드는 경우
➜ 수렴이 빨리 된다.
![](https://velog.velcdn.com/images/jaewon-ju/post/11db1eaa-0b94-4b4f-b70f-f37b9e21780f/image.png)
1. y가 변환을 감지 ➜ D(y,x) 재계산: 1 ➜ 이웃들에게 전달
2. z가 y로부터 업데이트를 받음 ➜ D(z,x) 재계산: 2 ➜ 이웃들에게 전달
3. y가 z로부터 업데이트를 받음 ➜ D(y,x) 재계산: 변화 없음 ➜ <span style = "background-color: lightgreen; color:black">수렴 완료</span>

<br>

> Link Cost가 증가하는 경우
- <span style = "color:red">Count-to-Infinity</span> 문제 발생
➜ 수렴이 느리게 된다.
![](https://velog.velcdn.com/images/jaewon-ju/post/bb8b836f-b902-4bc2-ac91-efc07b828997/image.png)
현재 y가 갖고 있는 <span style = "color:red">D(z,x)는 5이다.</span>
1. y가 변환을 감지 
➜ D(y,x) 재계산 ```D(y,x) = min(C(y, x) + D(x,x), C(y,z) + D(z,x)) = min(60, 6) ```
따라서, D(y,x) = 6으로 판단 
➜ 이웃들에게 전달
<br>
2. z가 y로부터 업데이트를 받음 
➜ D(z,x) 재계산 ```D(z,x) = min(C(z, x) + D(x,x), C(z,y) + D(y,x)) = min(50, 7) ```
따라서, D(z,x) = 7로 판단 
➜ 이웃들에게 전달
<br>
3. y가 z로부터 업데이트를 받음 
➜ D(y,x) 재계산 ```D(y,x) = min(C(y,x) + D(x,x), C(y,z) + D(z,x)) = min(60, 8)```
따라서, D(y,x) = 8로 판단 
➜ 이웃들에게 전달
<br>
5. D(z,x) = 50이 될 때까지 반복


<br>

⚠️ 수렴이 발생하기 전, y에서 x로 보내는 패킷이 발생하면?
➜ y는 z에게, z는 y에게, y는 z에게 ...
➜ Routing Loop가 발생한다.

<br>

### ► Poisoned Reverse
Routing Loop를 해결하기 위한 방식
>z가 <span style = "color:red">y를 거쳐서</span> x로 간다면, z는 y에게 D(z,x)가 무한대라고 알려준다.

![](https://velog.velcdn.com/images/jaewon-ju/post/cf31fe45-b422-416b-90be-7fe1829cf763/image.png)
- Cost가 바뀌기 전, 실제 ```D(z,x) = 5``` 이다.
- 하지만, y를 거쳐서 가므로 y에게 ```D(z,x) = ∞``` 라고 알려준다.
 ➜ Cost가 60으로 바뀌어도 ```D(z,x) = ∞``` 이므로, ```D(y,x) = min(C(y, x) + D(x,x), C(y,z) + D(z,x)) = min(60, ∞) = 60```<br>
 ➜ D(z,x) 재계산 ```D(z,x) = min(C(z, x) + D(x,x), C(z,y) + D(y,x)) = min(50, 60) = 50```

바로 수렴된다!



<br>

---

<br>

## ■ LS 와 DV

> #### Time Complexity
- Link State: O(n^2)
- Distance Vector: O(n)
    - 각 노드에 연결된 이웃의 평균 개수가 k라 할 때, n개의 노드가 각각 k개씩 메시지를 보내므로 O(nk)이다. 따라서, O(n)이다.
    
Time Complexity는 Distance Vector가 더 좋다.

<br>



> #### 수렴 속도
- Link State: Oscillation이 생길 수 있지만, 바로 수렴된다.
- Distance Vector: count-to-infinity 문제 발생 가능

수렴 속도는 Link State가 더 좋다.



<br>

---

<br>

# ✏️ AS
#### AS (Autonomous System) : 하나의 주체가 관리하는 라우터들의 집합

즉, AS는 라우터 집합의 단위이다.
Routing은 2가지 종류로 구분할 수 있다.

>#### 1. intra-AS routing: AS 내부의 라우팅 
- OSPF, RIP 등의 프로토콜 사용 (각 관리 주체가 선택할 수 있음)
- 같은 도메인 내에서는 같은 라우팅 프로토콜을 사용해야 한다
- inter-AS routing을 전담하는 gateway router가 존재한다. 
   - forwarding table을 2개 가지고 있다.
   - intra 전용 table, inter 전용 table
   
<br>

>#### 2. inter-AS routing: AS와 AS 간의 라우팅 
- BGP 프로토콜 사용 (딱 하나만 존재)

<br>

---

<br>

## ■ intra-AS routing
intra-AS routing protocol은 다음과 같은 종류가 있다.

   - OSPF: link-state based
       - OSPF와 근본적으로 동일하지만, ISO에서 표준화 한 IS-IS 프로토콜도 있다.
   - RIP: Distance Vector based
   - EIGRP: Distance Vector based(Cisco 전용 프로토콜)
   
이 중에서 OSPF에 대해서 알아보자.

<br>

### ► OSPF
OSPF는 <a href = #OSPF>이전</a>에 설명을 했다.

#### 추가 정보
- OSPF에서 flooding: <span style = "color:red">AS 내부</span>에 존재하는 모든 라우터에게 자신의 정보를 보낸다.
- TCP나 UDP 등의 상위 레이어 서비스를 사용하지 않고, 직접 IP 프로토콜을 사용해서 메시지를 전달한다.
- hop 수 뿐만 아니라, bandwidth, delay 등을 기준으로 Link Cost를 설정할 수 있다. (RIP는 hop 수로만 가능하다)
- 보안성이 좋다. (RIP는 인증 개념이 없다)


<br>

#### ECMP
OSPF는 __ECMP(Equal Cost Multiple Path)__를 특징으로 가진다.

최소 비용 경로가 여러개 있을 때 골고루 사용한다.
➜ 트래픽이 골고루 분산된다!

<br>

### ► Hierarchical OSPF
OSPF를 2가지 계층으로 분리함으로써 확장성을 높일 수 있다.
![](https://velog.velcdn.com/images/jaewon-ju/post/0b323656-4e88-48de-87c3-40b04ba17247/image.png)

| 라우터 | 기능 |
| - | - |
| Boundary Router | 자신의 AS를 다른 AS와 연결하는 라우터 |
| Backbone Routers | Backbone 계층 내부에서 동작하는 라우터 |
| Area Border Routers | 자신의 Area 정보를 요약해서 Backbone 계층에 전달하는 라우터 |
| Local routers | Local Area 계층 내부에서 존재하는 라우터 |

<br>

- LSA는 각 local area 내부에서만 flooding 된다.
- Area Border Router는 자신의 Area에 존재하는 라우터들의 정보를 요약해서 backbone 계층에 알려준다.


<br>

---

<br>

## ■ inter-AS routing
>#### BGP (Border Gateway Protocol)
inter-AS routing에서 사용되는 유일한 프로토콜

- BGP에서는 최소 비용은 중요하지 않고, <span style = "background-color: lightgreen; color:black">Policy</span>가 중요하다.
- BGP는 Path Vector 방식을 사용한다.
- BGP는 TCP 기반으로 동작한다.

<br>

### ► eBGP와 iBGP

자신에게 찾아올 수 있게 하려면, 자신이 속한 AS 주소를 advertise 해야 한다.

![](https://velog.velcdn.com/images/jaewon-ju/post/2522dba8-3cde-4a81-b51b-5b4c5ffb5da4/image.png)

- eBGP (External BGP): 다른 AS에 속한 이웃(neighbor) 라우터에게 자신의 AS 정보를 알린다.
- iBGP (Internal BGP): 같은 AS 내의 다른 라우터들에게 라우팅 정보를 알린다.



<br>



### ► BGP Basics
BGP 기능을 가지고 있는 라우터를 peer라고 부른다.
두 peer 간 TCP 연결이 설정된다.

![](https://velog.velcdn.com/images/jaewon-ju/post/66aca03d-965b-46e0-8d08-f566a6dcd872/image.png)

- 이 연결은 semi-permanent 하다.

<br>

![](https://velog.velcdn.com/images/jaewon-ju/post/ba583b92-6c4b-4af9-9443-1d3a6d47c629/image.png)

1. 새로운 노드(New)가 AS3에 추가되면, AS3의 BGP router는 New로 가려면 AS3으로 보내라고 이웃들에게 알려준다.

2. iBGP로 내부에서 전달

3. AS2는 해당 Path Vector를 받아서 자신의 이웃들에게 전달한다.
(AS2,AS3,New): New로 보내려면, AS2 -> AS3를 거쳐야 한다.


<br>

### ► Path Attributes
>```BGP 메시지 = prefix + attributes```

Path Attributes에는 다음과 같은 종류가 있다.

- AS-Path: 데이터가 특정 목적지로 가기 위해 거쳐야 하는 AS들의 리스트
- Next-Hop: 특정 목적지로 가기 위한 다음 점프(라우터)의 주소

<br>

### ► Policy Based Routing
>BGP는 최소 비용 경로를 기준으로 라우팅하지 않고, 정책(Policy)에 기반하여 라우팅 결정을 한다. 

- 각 AS는 자신의 라우팅 정책에 따라 특정 경로를 수락하거나 거부할 수 있다.
ex. (AS1, X)라는 메시지가 AS2로 옴
➜ 받지 않음
➜ 그럼 절대 AS2를 통해 X로 갈 수 없다.

<br>

### ► BGP Messages

| 메시지 | 기능 |
| - | - |
| OPEN | TCP 세션을 설정 하는 메시지 |
| UPDATE | AS Path Attribute가 포함된 메시지<br><span style = "color:red">라우팅 정보를 가지고 있다.</span><br>새로운 경로 정보를 알려주거나 기존 정보 취소 |
| KEEPALIVE | Session을 유지하기 위해 보내는 Message (Semi-permanent로 유지)|
| NOTIFICATION | 1. Error가 있음을 알려주는 메시지<br>2. close 메시지 |

- ACK가 따로 없고, OPEN을 보내면 KEEPALIVE로 답장한다.

<br>

---

<br>

## ■ Other issues
### ► Hot Potato Routing
cost가 가장 작은(queue length가 가장 짧은) 인터페이스 쪽으로 내보낸다.

<br>

### ► ISP policy
![](https://velog.velcdn.com/images/jaewon-ju/post/8b5a0517-f845-4d4a-b471-b328d3cd21db/image.png)
>ISP는 다른 ISP가 자신의 네트워크를 "중간 경유지"로 사용하지 못하게 한다.

예를 들어, C는 A로 바로 데이터를 전송할 수 있지만, Bandwidth를 아끼기 위해 B를 경유하는 방식을 사용할 수 있다.
이러한 상황을 회피하기 위해, B는 아예 C에게 경로를 알려주지 않는다.
<br>


1. A가 【 A,w 】 를 B,C에 전달
2. B는 【 B,A,w 】 를 C에 전달하지 않음
➜ C에서 w로 갈 때는 절대 B를 통과하지 못함
3. C는 (C,A,w)를 통해 w로 접근

<br>

⚠️ customer network인 x가 B와 C 사이의 데이터 전달을 도울 수 있지만, 
x는 ISP가 아니기 때문에 해당 사항을 policy로 금지 해야 한다.


### ► route selection
> 여러개의 경로가 존재하는 경우, BGP Router는 다음과 같은 우선순위로 경로를 결정한다.

1. policy
2. shortest AS-PATH
3. hot potato(closest Next-Hop)
4. additional criteria

<br>

---

<br>

# ✏️ ICMP
>#### ICMP (Internet Control Message Protocol)
Source host에게 에러가 있음을 알려주는 protocol

<br>

- __source quench__
패킷이 큐에 일정 수준 이상 쌓여서 네트워크가 더 이상 처리할 수 없을 때 일부 메시지를 버린다.
이 때, Source Quench(Choke Packet) 메시지를 소스 호스트에게 보내서 데이터 전송량을 줄이도록 한다.



- ICMP 메시지는 IP datagram에 포함되어서 전송된다.

- ICMP message는 다음과 같이 구성되어 있다.
```type + code + 8 bytes IP datagram```

<br>

---

<br>



# REFERENCE
Computer Networking, A Top Down Approach - JAMES F.KUROSE