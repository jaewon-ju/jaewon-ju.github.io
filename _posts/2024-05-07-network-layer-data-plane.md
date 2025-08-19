---
title: "[Network Layer] Data Plane"
description: "Network 계층의 Data plane 영역에 대해서"
date: 2024-05-07T03:47:18.931Z
tags: ["network"]
slug: "Network-Layer-Data-Plane"
categories: Network
velogSync:
  lastSyncedAt: 2025-08-19T08:36:52.049Z
  hash: "b82b05a81bb2bc3fa23b7a1cc27648f55bf31d3224772c4de0d633bee0b1e8fa"
---

# ✏️ Network Layer functions
Network Layer의 기능은 2가지가 존재한다.

1. __Forwarding__
   - 하나의 라우터 내에서 입력 포트에서 출력 포트로 데이터를 전송하는 과정
   - Data Plane (데이터 평면) 영역에 해당된다.

2. __Routing__
   - 출발지에서 목적지까지의 경로를 결정하는 과정
   - Control Plane (컨트롤 평면) 영역에 해당된다.

<br>

## ■ Data Plane
- 각 라우터의 개별적으로 수행되는 function이다.
- IP 헤더 정보를 바탕으로 패킷을 어느 방향으로 전송할지 결정한다.

Data Plane 영역에서 Forwarding은 <span style = "background-color: lightgreen; color:black">Routing Table에 적혀있는대로</span> 작동한다.
Routing Table을 작성하는 것은 Control Plane 영역에서 담당한다.

<br>

## ■ Control Plane
- 두 가지 라우팅 방식이 존재한다.
   - Traditional: 라우터끼리 메세지를 주고받아서 최적의 경로 설정
      - 라우터 내에 라우팅 알고리즘 내장
      - Distributed
      <br>
   - SDN(Software-Defined Networking): 중앙 서버가 경로를 계산하고,  라우터는 서버의 지시에 따라 패킷 전송
      - 라우팅 알고리즘은 서버에 내장되어 있음
      - Centralized
     

<br>

---

<br>

# ✏️ Network Service Model
>#### Service Model
: 데이터 전송과 관련된 성능, 신뢰성 및 기타 품질 보증을 정의하는 규격

요구사항

1. 각각의 Datagram에 대해서
   - 전송 보장
   - 전송 시간 보장

2. 일련의 Datagram flow에 대해서
   - 순서 보장
   - 최소 bandwidth 보장
   - datagram 간의 시간 간격 보장

<br>

| 아키텍쳐 | Service Model | Detail |
| - | - | - |
| internet | best effort | FIFO 방식을 사용한다.<br>Bandwidth, Loss, Order 아무것도 보장 못함|
| internet | Intserv Guaranteed | Bandwidth, Loss, Order 모두 보장, but Router의 부담이 커진다.
| internet | Diffserv | Bandwidth, Loss, Order을 보장 할 수는 있음 |
| ATM(Asynchronous Transfer Mode) | CBR(Constant Bit Rate) | Switch 사용. Bandwidth, Loss, Order 모두 보장 |
| ATM(Asynchronous Transfer Mode) | ABR(Available Bit Rate) | 일부 보장|

<br>

---

<br>

# ✏️ Router
라우터는 다음과 같이 구성되어 있다.
![](https://velog.velcdn.com/images/jaewon-ju/post/bb013b2b-5a45-4ff5-bcc1-e3cfc6eb37bc/image.png)

- Control plane 보다 Data plane이 빠르다.
- Control plane은 소프트웨어 영역이고, Data plane은 하드웨어 영역이다.
<br>


## ■ Input Port
Input Port의 기능

1. Physical Layer(1계층) 처리
2. Link Layer(2계층) 처리
3. Network Layer(3계층) 처리
   - IP header 필드의 값을 사용해서 output port로 forwarding
      - destination-based forwarding
      - generalized forwarding

> Destination-based __VS__ Generalized
- Destination-based forwarding은 목적지의 IP 주소만 확인한다.
- Generalized forwarding은 IP 주소뿐만 아니라, 다른 필드의 값도 확인한다.

<br>

### ► Longest Prefix Matching
destination-based forwarding에서 사용하는 lookup 방식이다.

- entry 가 들어왔을 때, prefix가 Destination address와 가장 길게 매칭되는 Output Port로 fowarding.

- 예시) 다음과 같이, 라우터에 Destination Address가 존재할 때
![](https://velog.velcdn.com/images/jaewon-ju/post/70d5c161-d479-47b9-99a5-04d7c379407f/image.png)
Entry: 11001000 00010111 00011000 10101010
Link 1,2와 둘 다 매칭되지만, 1이 더 길게 매칭된다.
➜ 1번 Output Port로 fowarding

- Tenary Content Addressable Memories(TCAMs)를 사용해서 각 Destination Address 마다 비교 회로를 하나씩 넣을 수 있다.

<br>

## ■ Switching Fabric
> #### Switching Fabric
: Input Port로 들어온 패킷을 Output Port로 switching한다.

Switching fabric 방식은 3가지 존재한다.

1. Memory Buffer - 속도 느림
2. Bus - 속도 느림
3. Interconnection network - 속도 빠름, 대규모

<br>

### ► Interconnection network 
Interconnection network의 구현 방식은 다양하다.

- Cross bar로 구현 
- Multistage switch로 구현
: 소규모 cross bar를 다중으로 연결한 형태

<span style = "color:red">⚠️</span> CRS Router처럼 MultiStage Switch를 다중으로 사용하는 형태도 있다.

<br>

### ► Input port Queuing

Switching Fabric이 input port 속도보다 느리면 Input Port에 큐를 설치한다.

- buffer overflow로 인한 loss가 발생할 수 있다.
- Head-of-the-Line(HOL) blocking이 발생할 수 있다.

<br>

## ■ Output Port
>Switching Fabric을 통해 Forwarding 받은 패킷을 큐에 저장한 뒤, 다음 link로 내보낸다.

- Transmission Rate보다 Fabric으로부터 수신하는 속도가 빠를 때 Output Port의 큐에서 Buffering 한다.

- 큐가 가득차면 데이터를 Drop한다.
- Congestion을 알리기 위한 Marking 작업을 한다.
   - ECN: Explicit Congestion Notification
   - RED: Random Early Detection


<br>

---

<br>

# ✏️ Packet Scheduling

## ■ FCFS
>FCFS(First Come First Served)

- Internet의 best effort 모델에서 사용한다.
- Queue에 들어온 순서대로 내보내는 방식


<br>

## ■ Priority Scheduling 
>multiple queue를 사용해서 우선순위를 구분한다.

- 각각의 Queue 내에서는 FCFS를 사용한다.
- IP datagram Header를 보고 클래스를 구분한다.
- 2개의 데이터가 Transmission을 대기중인 경우, 우선순위가 높은 데이터부터 내보낸다.

<br>

## ■ Round Robin Scheduling
>Multiple Queue를 반복적으로 순환한다. 

<br>

### ► WFQ(Weighted Fair Queueing)
> Generalized Round Robin 방식이다.

각 큐마다 가중치 Weight를 부여하고, Weight가 Priority 역할을 한다.

- Minimum Bandwidth를 보장한다.
- Internet의 best-effort는 Bandwidth를 보장하지 못했다.
   - WFQ를 적용하면 위의 문제를 해결할 수 있다.


<br>

---

<br>

# ✏️ IP
## ■ IP Datagram format

![](https://velog.velcdn.com/images/jaewon-ju/post/34b9ecf3-09b6-473b-afcb-0896b9fb49f0/image.png)

| format | Detail |
| - | - |
| __Version__ | IPv4: 0100<br>IP |
| __Head Leangth__ | Option + 고정헤더의 값을 나타낸다.<br>고정헤더는 20 Bytes<br>데이터의 시작이 언제인지 알려준다. |
| __TOS(Type Of Service)__ | Intserv. Diffserv 등 서비스 모델을 표기 |
| __Length__ | Datagram의 사이즈는 최대 2^16-1이다.<br>Ethernet 프레임의 사이즈에도 제한이 있으므로 보통 크게 만들지는 않음 |
| __TTL__ | 데이터그램이 살아있을 수 있는 시간이다.<br><span style = "background-color: lightgreen; color:black">hop</span> 수로 카운팅한다.|
| __Upper Layer__ | 상위 계층의 프로토콜이 무엇인지를 알려준다. |
| __Header Checksum__ | Header의 에러를 체킹할 수 있는 비트이다. |
| __Options__ | time stamp, record, source route 등의 기능<br>|

<br>

### ► 추가 정보

>#### Fragmentation 관련 bit들
Datagram의 사이즈가 큰 경우, 여러개로 나눠서 Fragment로 만든다.
각 Fragment는 독립된 Datagram으로 여겨진다.
<br>
- Fragment는 순서가 뒤바뀌어서 도착할 수 있고 다른 경로를 통해 이동할 수 있다.
- 하나의 Datagram을 나눈 Fragment들은 source IP가 같다.
- Fragment를 합칠 때 <span style = "color:red">identifier</span> 값이 필요하다.  
- <span style = "color:red">offset</span>은 Fragment의 순서를 나타내기 위해 존재한다.
- <span style = "color:red">flag</span>에는 more라는 플래그가 존재하는데, more가 0인 Fragment는 가장 끝 Fragment임을 의미한다.
   

>#### TTL
- 데이터그램이 살아있을 수 있는 시간이며, hops 수로 카운팅한다.
- Forwarding할 때 TTL 값을 감소시킨다.
- 0이 되었을 때도 목적지가 아니면 ICMP(Error를 source에 전송)
![](https://velog.velcdn.com/images/jaewon-ju/post/114d13fe-0367-4637-a007-75620c22d64b/image.png)
- 나한테 제일 가까운 서버를 찾을 때도 사용한다. 

> #### Upper Layer
- header 다음에 존재하는 데이터는 TCP segment 또는 UDP Segment이다.
- Upper Layer bit는, 상위 계층의 프로토콜이 무엇인지 알려준다.

> #### Header Checksum
- 16 bit로 Header의 에러를 체킹할 수 있다.
- <span style = "color:red">Data에 대해서는 Error Check를 하지 않는다!</span>
- 라우터한테는 굉장히 Overhead가 큰 bit이다.
   - TTL이 변경되면 Header Checksum을 Router가 바꾸어 줘야 한다.
     ➜ IPv6에서는 Header Checksum을 삭제했다.


>#### Options
인터넷의 기본 routing은 hop-by-hop이지만, Option bit를 설정하여 바꿀 수 있다.
- 옵션에 source route을 지정하면, 특정 라우터를 반드시 거쳐가도록 설정할 수 있다.
   - ex) a,b,c,d,가 있을 때 a와 c는 거쳐서 가라
   - 또는 a,b,c,d를 모두 거쳐서 가라.
- IPv6에서는 없어졌다.
   
<br>

---

<br>

## ■ IP Addressing
IP Address는 32 bit 식별자이다.
- interface마다 하나의 ip가 할당된다.
- 라우터는 interface를 여러개를 가지고 있다. 따라서 ip가 여러개 할당된다.
- subnet이란, <span style = "color:red">라우터를 거치지 않고</span> 서로 direct하게 통신이 가능한 노드들의 interface이다.

<br>

### ► CIDR
Original IP 주소 체계는 주소를 Network와 Host Portion으로 구분해서 classful 하게 사용했다.


_Network Portion: 네트워크 구분
Host Portion: 동일 네트워크 내 디바이스 식별_

  - Class A, B, C: unicast 용 IP 주소
      - class A: network portion 1 Byte
      - class B: network portion 2 Byte
      - class C: network portion 3 Byte
   - Class D: multicast 용 IP 주소
   - Class E: experimental (사설용 IP 주소)

<br>

이렇게 사용하다보니, class B의 IP 주소가 바닥나는 상황이 발생했다!
➜ 다른 방법을 찾자

<br>


> __CIDR__(Classless InterDomain Routing)
: 클래스 대신 subnet을 사용하는 IP 주소 체계

- 이름에 Routing이 들어가지만, routing 기술은 아니다.
- subnet의 bit 수를 표기하는 방식이다.
ex) 192.35.36.7/24
➜ 24는 subnet의 비트 수를 의미한다.

현재의 IP 주소 체계: subnet + host


<br>


<br>

### ► 주소 부여
주소를 어떻게 부여받을 것인가?

host와 network는 각각 다른 방식으로 주소를 부여받는다.

<br>

host가 주소를 부여받는 방법 

1. Config 파일에 고정으로 설정할 수 있음(주소 낭비)
2. DHCP(Dynamic Host Configuration Protocol)로 동적으로 할당
    - DHCP 서버로부터 동적으로 IP 주소를 받아온다.
    - 최대 사용 기한이 존재한다.
    - ![](https://velog.velcdn.com/images/jaewon-ju/post/d2391f7e-292c-42f9-86e7-56f6e59c4a96/image.png)
    - ![](https://velog.velcdn.com/images/jaewon-ju/post/be53fa37-6743-436c-8300-7afea280c476/image.png)
    - First-hop router, DNS 서버의 이름/IP 주소, subnet 마스크 등도 같이 제공한다.
    
<br>

Network가 주소를 부여받는 방법
   - ISP로부터 받아온다.
   - ISP는 자신이 갖고 있는 IP 주소 공간 중에 하나를 Network에 부여한다.

IP 주소 부여의 계층
host <- DHCP <- ISP <- ICANN

<br>

### ► Hierarchical addressing
Route aggregation
- aggregation 한 IP 주소를 상위 라우터에 전달한다.
![](https://velog.velcdn.com/images/jaewon-ju/post/6f3d087b-3eca-4e76-a375-ec60c246f34c/image.png)
- 상위 계층의 router에서는 목적지와 <span style = "color:red">가장 길게 매치되는</span> IP 주소로 보낸다. 
<br>

- 만약 ISP를 이동한다면 상위 Router에 정보를 보내줘야한다.
![](https://velog.velcdn.com/images/jaewon-ju/post/5d5ce49e-2060-4132-849a-a67774372228/image.png)new Entry가 Routing Table에 생성된다.


<br>

---

<br>

## ■ NAT
>NAT(Network Address Translation)
: 공인 IP로 들어온 패킷을 사설 IP 주소로 변환해서 전달하는 <span style = "color:red">라우터의 기능</span>

- Globally Uniuqe IP address를 각 PC 마다 가지기에는 IP 주소가 부족하다.
➜ 라우터 하나만 Globally Unique address를 받고, locally Unique address를 각 PC에 할당한다.

- 그럼 외부에서 local PC로 데이터를 보낼 때 공인 IP를 가진 라우터로 패킷을 전송하는데, 라우터는 무엇을 보고 local PC를 특정하는가?
➜ Port 번호를 사용한다.


<br>

### ► Port
![](https://velog.velcdn.com/images/jaewon-ju/post/cada9087-84a6-4b5d-8290-710c8a705275/image.png)
내부 ➜ 외부로 패킷을 보내는 경우

【 source IP address, source port number】 를
➜ 【 router IP address, new port number】 로 변경한다.


<br>

외부 ➜ 내부로 패킷을 보내는 경우

【 router IP address, new port number】 를
➜ 【 Dest(Network 내부) IP address, Dest port number】 로 변경한다.

<br>

### ► NAT의 특징
- 내부에서 각 local Device는 IP 주소를 변경해도 된다.
- ISP가 변경되더라도 Local 쪽에서는 상관이 없다.
- 보안이 좋다.

<br>

### ► NAT의 문제점
라우터는 3계층까지만 보지만, Port 번호는 4계층에 존재한다.
➜ end-to-end violation이 발생한다.

∴ IPv6를 사용해야 한다.

<br>

---

<br>

## ■ IPv6
>IPv6
: IPv4의 주소공간 문제를 해결 + 헤더 사이즈 40Byte로 고정해서(Option 필드를 삭제해서) 속도  개선

<br>

![](https://velog.velcdn.com/images/jaewon-ju/post/989652eb-2696-49c7-a527-2092ea3f7f07/image.png)

| format | Dtail |
| - | - |
| Version | IPv6: 0110 |
| Flow Label |Speical handling을 요구하는 일련의 패킷들을 처리해준다. |
| Priority(Traffic Class) | IPv4의 TOS<br>Intserv. Diffserv 등 서비스 모델을 표기 |
| Payload Length | PayLoad의 길이 |
| next header | IPv4의 Upper Layer<br>상위 계층의 프로토콜이 무엇인지를 알려준다.|
| Hop Limit| IPv4의 TTL|


- No Fragmentation
- No Header Checksum
- No Options

payLoad에 extenstion header가 있으면 next header도 같이 들어있다.

<br>

### ► IPv4와의 차이점

- IPv4의 fixed header: 20 Bytes
- IPv6의 fixed header: 40 Bytes

고정 헤더의 크기는 IPv6가 크지만, IPv4의 field가 훨씬 많다.
즉 기능이 많다.
➜ 라우터가 할 일이 많다.

∴ IPv6에서는 크기가 커지고 속도가 빨라졌다.

<br>

### ► Tunneling
하루아침에 모든 Router를 IPv6로 바꿀 수는 없다.
∴ 아직 대부분의 router들이 IPv4만 지원한다.

> #### Tunneling
: IPv6로 들어온 Datagram을 IPv4 로 인식되도록 만드는 기술

- IPv6를 IPv4 header로 encapsulate.
![](https://velog.velcdn.com/images/jaewon-ju/post/cf719be5-511a-46ba-94fb-b9e260528de1/image.png)




<br>

---

<br>

# ✏️ SDN
>SDN(Software Defined Network)
: 네트워크를 중앙에서 관리하고 제어할 수 있도록 하는 네트워크 아키텍처

SDN을 사용하면, Generalized Forwarding이 가능하다.

Original(Destination-based Forwarding): IP의 dest를 보고 루트 결정
Generalized Forwarding: header의 여러 필드를 보고 루트 결정 

⚠️ 이때, header는 4계층 뿐만 아니라 어느 계층도 될 수 있다.

<br>

## ■ OpenFlow
OpenFlow는 SDN을 구현한 프로토콜이다.

- Match 된 패킷에 대한 Action을 각각 지정할 수 있다.
- 다양한 기능들을 OpenFlow의 match-action으로 구현할 수 있다.
   - Router 기능 (match: longest prefix, action: forward)
   - Switch 기능 (match: destination MAC, action: forward)
   - FireWall 기능 (match: IP 주소/Port 번호, action: permit/deny)


<br>

---

<br>

# ✏️ Middlebox
> source host와 dest host사이의 path에서 Forwarding 뿐만 아니라 추가적인 기능을 수행하는 기기들

다음과 같은 기능들도 Middlebox의 예시로 볼 수 있다.
- NAT
- Firewall
- Load Balancer
- Cache

<br>

---

<br>


# REFERENCE
Computer Networking, A Top Down Approach - JAMES F.KUROSE