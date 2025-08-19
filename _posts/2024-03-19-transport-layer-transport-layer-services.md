---
title: "[Transport Layer] Transport Layer Services"
description: "Transport Layer의 기능을 알아보자."
date: 2024-03-19T05:00:33.497Z
tags: ["network"]
slug: "Transport-Layer-Transport-Layer-Services"
categories: Network
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:26.484Z
  hash: "8c4ee5338ad104906038eab48c8d6b9aba35fe2445ea344546d38a4188e00eb1"
---

# ✏️ Transport Services

>서로 다른 host에서 동작하는 application 간의 logical communication을 제공한다.

- TCP와 UDP가 존재한다.

## TCP
연결 설정 필요
reliable, congestion control, flow control

## UDP
unreliable
아무것도 안함

## 둘다 할 수 없는 것
delay 보장 (반드시 몇 초 안에 받을 수 있게 해줄게)
data rate 보장 (반드시 이 정도 속도로 받을 수 있게 해줄게)

IP 기반으로 동작하기 때문이다.

<br>

---

<br>

# ✏️ Port
Port 번호는 네트워크에서 데이터가 전송될 때 목적지 프로세스를 식별하는 데 사용된다.

Port 번호는 16bit로 표현된다.
- 0~1023: well known Port
- 1024~49151: registered Port
- 49152~65535: dynamic Port



<br>

---

<br>

# ✏️ UDP
- 연결이 없다.
- no congestion control
- 이전 계층에서 제공하는 IP 서비스는 unreliable하고 순서가 바뀔 수 있다.
- 포트 번호 체크, error checking w/checksum(에러가 있으면 걍 버림)

그럼에도 불구하고 사용하는 이유: 심플하기 때문에 real-time application에 적합함

보내는 데이터가 작고, 작은 용량의 header를 원하는 프로토콜에서 사용

DNS, SNMP, HTTP/3에서 사용한다.
multicast, broadcast 어플리케이션에서 사용

> UDP Message Format
![](/assets/posts/cfb961ec0227b19144de52af95773dbdde9d0f6ab346c5519b2e3eba5fe10347.png)


<br>

---

<br>

# ✏️ Reliability
TCP/UDP는 <span style = "color:red">bi-directional</span>:
송신자이면서 수신자이다.

<br>

## ■ Error
Reliability를 제공하기 위해서 에러를 처리해야 한다.
Error Example: bit값 변경, loss

<br>

### ▷ Error Correction의 종류
- __FEC (Forward Error Correction):__
송신측 - <span style = "color:red">송신 데이터</span>에 에러를 처리할 수 있는 비트를 넣어 보냄
수신측 - 오류 Detection & Correction
Real Time에 적합함
ex) 해밍코드

- __BEC (Backward Error Correction):__
송신측 - 재전송(Retransmission)
수신측 - Error Detection 
ex) TCP 프로토콜


지금부터 이야기할 것은 BEC이다.

<br>

## ■ Reliable Data Transfer
Transport 계층에서 Reliability를 제공할 수 있도록 프로토콜을 만들어보자.

- 아래 계층의 unreliable한 것들 (loss, corrupt, 순서 바뀜)을 처리해야 한다.

<br>

FSM (Finite state Machine)을 통해 그림으로 설명한다.
이벤트가 발생해서 StateA 에서 StateB로 넘어갈 때는 Action을 취하면서 넘어간다.
![](/assets/posts/05672fc8e11e31a9a2785bd4c23ac6b041b7e218b3aa138945ab25763f553912.png)

<br>

### ▷ V1 - ideal Case
> #### 가정
아래 층이 굉장히 reliable 하다
- no bit error
- no loss of packets

![](/assets/posts/82a8639ceff4c6072e3ecb9493e48ba169f695691e72bcc5f22b72ebe5e60539.png)

>#### 송신측 Transport
State 개수: 1
S-State1: 상위 계층의 요청 대기 상태<br>
#### S-State1 ➜ S-State1 (LOOP)
Event ① 
: 상위 계층으로부터 데이터 받음 
Action ①
: 하위 계층으로 데이터 내려 보냄



>#### 수신측 Transport
State 개수: 1
R-State1: 하위 계층의 요청 대기 상태<br>
#### R-State1 ➜ R-State1 (LOOP)
Event ① 
: 하위 계층으로부터 데이터 받음 
Action ①
: 상위 계층으로 데이터 올려 보냄

<br>


### ▷ V2.0 - bit errors
> #### 가정
비트 오류만 존재하고, 패킷 손실은 없다.
- bit error
- No loss of packets

![](/assets/posts/9a0c752f3ccd1aa34384590fde0c98ef94b03807e2529c1d97959e39dc2ca802.png)

- Checksum을 사용해서 bit error check
- Retransmission을 써서 error correction

- 수신자가 잘 받았는지 못받았는지 알려줘야 한다.
ACK(Acknowledgement) - 에러 없음 
NAK(Negative Acknowledgement) - 에러 있음

- 송신자가 하나만 보내고 ACK 또는 NAK를 기다린다. (Stop & Wait)
(Sliding Window의 아주 simple한 기법)

>#### 송신측 Transport
State 개수: 2
S-State1: 상위 계층의 요청 대기 상태
S-State2: ACK/NAK를 기다리는 상태<br>
#### S-State1 ➜ S-State2
Event ① 
: 상위 계층으로부터 데이터 받음 
Action ①
: 하위 계층으로 데이터 내려 보냄
#### S-State2 ➜ S-State2 (LOOP)
Event ②
: 수신측에서 NAK를 받음
Action ②
: Retransmisson
#### S-State2 ➜ S-State1
Event ③
: 수신측에서 ACK를 받음
Action ③
: NONE

>#### 수신측 Transport
State 개수: 1
R-State1: 하위 계층의 요청 대기 상태<br>
#### R-State1 ➜ R-State1 (LOOP)
Event ① 
: 하위 계층으로부터 데이터 받음 + ERROR 있음 
Action ①
: NAK를 송신자에게 보냄
#### R-State1 ➜ R-State1 (LOOP)
Event ②
: 하위 계층으로부터 데이터 받음 + Error 없음
Action ②
: 상위 계층으로 데이터 올려보냄 + ACK를 송신자에게 전송



#### 2.0의 심각한 문제
- ACK/NAK에 오류가 발생할 수 있다.

수신: 잘 받음 + ACK 보냄
송신: ACK에 오류가 있어서 NAK인 줄 알고 또 보냄
duplicate

#### 해결 방법
재전송 할 때 sequence number를 사용한다.
0번 받았는데 0번이 또 왔네?
-> 버림

<br>


### ▷ V2.1 - V2.0 개량
> #### 가정
비트 오류만 존재하고, 패킷 손실은 없다.
- bit error
- No loss of packets

![](/assets/posts/5e1621e07c65b3268b95296266375b8d199573cf0f11994a90c6f85b5b2399a4.png)




- V2.0에서 sequence number를 추가함

>#### 송신측 Transport
State 개수: 4
S-State1: 상위 계층의 요청 대기 상태 (0번 sequence)
S-State2: ACK/NAK를 기다리는 상태
S-State3: 상위 계층의 요청 대기 상태 (1번 sequence)
S-State4: ACK/NAK를 기다리는 상태<br>
#### ► S-State1 ➜ S-State2
Event ① 
: 상위 계층으로부터 데이터 받음, sequence number는 0번
Action ①
: 하위 계층으로 데이터 내려 보냄
#### ► S-State2 ➜ S-State2 (LOOP)
Event ②
: 수신측에서 NAK를 받음 <span style = "color:red">or 받은 ACK/NAK 패킷에 오류가 있음</span>
Action ②
: Retransmisson
#### ► S-State2 ➜ S-State3
Event ③
: 수신측에서 ACK를 받음 && 오류 없음
Action ③
: NONE
#### 나머지는 대칭

<br>

![](/assets/posts/916d69230b8ba4d8a56262fd9944bd5936d928ece14c9b92d04ccdfbf98801db.png)


>#### 수신측 Transport
State 개수: 2
R-State1: 하위 계층의 0번 sequece 요청 대기 상태
R-State2: 하위 계층의 1번 sequece 요청 대기 상태<br>
#### R-State1 ➜ R-State2 
Event ① 
: 하위 계층으로부터 데이터 받음 + ERROR 없음 + <span style = "color:red">sequence 0번 받음</span>
Action ①
: 데이터를 상위로 올려보냄 + cheksum을 포함한 ACK 패킷 송신자에게 보냄
#### R-State2 ➜ R-State2 (LOOP)
Event ②
: 하위 계층으로부터 데이터 받음 + Error 있음
Action ②
: checksum을 포함한 NAK 패킷 송신자에게 보냄
#### R-State2 ➜ R-State2 (LOOP)
R-State2는 1번 sequence를 대기하는 중임
Event ③
: 하위 계층으로부터 데이터 받음 + <span style = "color:red"> 에러 없음 + sequence 0번 받음</span>
Action ③
: 데이터 버림 + checksum을 포함한 <span style = "color:red"> ACK </span> 패킷 송신자에게 보냄


<br>

수신측에서 Event ③가 발생하는 이유는 다음과 같다.

1. 송신자: 0번 패킷 전송
수신자: 0번 패킷 잘 받고 ACK 전송

2. ACK 패킷이 전달되던 중 에러 발생

3. 송신자: ACK 패킷을 받았더니 에러 발견(송신 Event ②)
수신자: 1번 패킷 기다리는 중

4. 송신자: 0번 패킷 다시 보냄
수신자: 1번 패킷 기다리고 있는데 왜 0번 패킷 보내? (수신 Event ③)
데이터는 버리고, 0번 패킷 ACK 전송 

5. 송신자: 아 0번 패킷 잘 갔었구나, 1번 보낼 준비 할게
수신자: 1번 패킷 기다리는 중

<br>

### ▷ V2.2 - NAK 없음
> #### 가정
비트 오류만 존재하고, 패킷 손실은 없다.
- bit error
- No loss of packets


![](/assets/posts/693bd1d6e6bc54f061988e04a8661ba9db9579292e9d546352add01ac06d850c.png)


- V2.1에서 NAK 없이 ACK만 사용한다.
- NAK 대신 <span style = "color:red">잘 받은 마지막 패킷의 sequence number</span>를 ACK에 넣어서 보낸다.

>#### 송신측 Transport
State 개수: 4
S-State1: 상위 계층의 요청 대기 상태 (0번 sequence)
S-State2: ACK(0번)를 기다리는 상태
S-State3: 상위 계층의 요청 대기 상태 (1번 sequence)
S-State4: ACK(1번)를 기다리는 상태<br>
#### S-State1 ➜ S-State2
Event ① 
: 상위 계층으로부터 데이터 받음, sequence number는 0번
Action ①
: 하위 계층으로 데이터 내려 보냄
#### S-State2 ➜ S-State2 (LOOP)
Event ②
: <span style = "color:red">ACK(sequence 1번)를 받음</span> or 받은 패킷에 오류가 있음
Action ②
: Retransmisson
#### S-State2 ➜ S-State3
Event ③
: <span style = "color:red">ACK(sequence 0번)를 받음</span>  && 오류 없음
Action ③
: NONE
#### 나머지는 대칭

<br>

![](/assets/posts/4ea5313d7407f84c88ccd64d58f85a96d362a9849a974802698bb34c29300c9d.png)


>#### 수신측 Transport
State 개수: 2
R-State1: 하위 계층의 0번 sequece 요청 대기 상태
R-State2: 하위 계층의 1번 sequece 요청 대기 상태<br>
#### R-State1 ➜ R-State2 
Event ① 
: 하위 계층으로부터 데이터 받음 + ERROR 없음 + <span style = "color:red">sequence 0번 받음</span>
Action ①
: 데이터를 상위로 올려보냄 + cheksum을 포함한 ACK(0) 패킷 송신자에게 보냄
#### R-State2 ➜ R-State2 (LOOP)
R-State2는 sequnce 1번 패킷을 기다리는 상태
Event ②
: 하위 계층으로부터 데이터 받음 + (Error 있음 || <span style = "color:red">sequence 0번 받음</span>)
Action ②
: ACK(0: 마지막으로 잘 받은 패킷 sequence) 패킷을 송신자에게 보냄
#### 나머지 대칭

<br>


### ▷ V3.0 - bit errors + loss
> #### 가정
비트 오류, 패킷 손실이 존재한다.
- bit error
- loss of packets

Loss: 데이터를 보냈는데 ACK가 돌아오지 않는다.
Loss를 해결하기 위해 추가로 timer를 사용한다.


![](/assets/posts/3b62df27a3736abd818fabdb334f743f44353326c2cbc9ebfaf86d531e4a4161.png)


>#### 송신측 Transport
State 개수: 4
S-State1: 상위 계층의 요청 대기 상태 (0번 sequence)
S-State2: ACK(0번)를 기다리는 상태
S-State3: 상위 계층의 요청 대기 상태 (1번 sequence)
S-State4: ACK(1번)를 기다리는 상태<br>
#### S-State1 ➜ S-State2
Event ① 
: 상위 계층으로부터 데이터 받음, sequence number는 0번
Action ①
: 하위 계층으로 데이터 내려 보냄 + <span style = "background-color: lightgreen; color:black">타이머 start</span>
#### S-State2 ➜ S-State2 (LOOP)
Event ②
: 수신측에서 (1번을 받았다고 ACK를 보냄 || 받은 패킷에 오류가 있음)
Action ②
: <span style = "color:red">NONE</span>
#### S-State2 ➜ S-State2 (LOOP)
Event ③
: <span style = "background-color: lightgreen; color:black">Time out</span>
Action ③
: Retransmission + <span style = "background-color: lightgreen; color:black">타이머 start</span>
#### ► S-State2 ➜ S-State3
Event ④
: 수신측에서 ACK(0) 받음 && 오류 없음
Action ④
: <span style = "background-color: lightgreen; color:black">타이머 stop</span>
#### ► S-State1 ➜ S-State1 (LOOP)
Event ⑤
: 이미 Time out 처리한 패킷이 옴
Action ⑤
: NONE
#### 나머지는 대칭

Event ③에서 Time out이 발생하는 경우

1. 송신자가 보낸 패킷이 Loss
2. 송신자가 보낸 패킷을 수신자가 받고, 수신자가 보낸 ACK가 Loss
3. 송신자가 보낸 패킷을 수신자가 받고, 수신자가 ACK를 보냈는데 늦게 도착

<br>

Receiver는 V2.2와 동일
중복 수신은 위로 올리지 않고 버린다!

<br>


## ■ Stop And Wait의 단점
위에서 설명한 방식을 Stop And Wait이라고 하는데, 효율성이 좋지 않다.

![](/assets/posts/3c846b8cf208eae95f7263af9cb115668a1faa14c94d61660ff940f42c6459f6.png)

>송신자가 link를 쓴 시간 = Transmission time(L/R)
나머지 시간(2𝜏 == RTT)은 대기


<br>

이러한 비효율성을 해결하기 위해서 sliding window 방식을 고안했다.
sliding window: 1RTT 내에 여러개의 패킷을 보내자.

<br>

### ▷ Sliding Window를 구현하기 위해 필요한 것
window size: N __(N * Transmission Time < 1 RTT)__
- sequence number 필드: k bits 
- sequence number: 0~2^k-1
- 버퍼
송신: 재전송을 위한 버퍼
수신: 순서를 맞추기 위한 버퍼

<span style = "color:red">⚠️</span> Stop And Wait도 Sliding Window의 일종이다. window가 매우 작을 뿐

<br>

### ▷ Example - N이 3일 때
효율: 사용시간/전체 시간 = Transmission time * 3 / (RTT + Transmission Time)

Stop and Wait 방식보다 3배 효율이 증가한다.

> #### 그럼 window 크기를 계속 늘리면 되나?
실제로는 제한이 있어서, <span style = "background-color: lightgreen; color:black">TCP는 window 크기를 늘렸다 줄였다 한다.</span>

<br>

## ■ Sliding Window

### ▷ Go-Back-N: Sender
window 사이즈: N
N = ACK를 받지 않고 전송할 수 있는 패킷 최대 개수
순서번호: 0 ~ 2^k-1 (Packet 당 하나씩)
modulo 2^k-1 연산을 사용한다.
![](/assets/posts/5c759d618f42a7122d9e82ae05478596ed5995102fb57f5bce0f8a73ef998258.png)
![](/assets/posts/02baee0ebfde9c90807d7c26a6bd61689a0f1024d006fbde5a22532a3433ecf3.png)

><span style = "color:red">⚠️</span> 데이터 하나 보내고 ACK 하나 받는 Stop And Wait과는 달리, Sliding Window에서는 ACK는 쌓여서 도착할 수 있다. (Cumulative ACK)
따라서, ACK(n)이 도착하면, sequence n 이전의 패킷은 모두 ACK 받은 것으로 판단한다.



- 재전송 타이머 <span style = "color:red">1개</span>를 사용한다.
ACK를 받지 못한 패킷 중 가장 오래된 것을 기준으로 타이머를 적용한다. 

- Time out이 발생하면 ACK를 받지 못한 패킷 모두를 재전송한다.
<span style = "background-color: lightgreen; color:black">따라서, 버퍼가 N개 만큼 필요하다.</span>

<br>

### ▷ Go-Back-N: Receiver
순서대로 오는 패킷만 accept.
순서대로 오지 않으면 discard.

>__Go-Back-N에서는 수신 버퍼가 없는게 기본 설계이다.__
따라서, 패킷 순서가 뒤섞여서 오면 처리하지 못하고 버린다.

- 수신자는 순서대로 잘 받은 패킷 중 가장 높은 순서번호로 ACK를 보낸다.
- 수신 윈도우의 크기는 1이다.

![](/assets/posts/52d348e02241504078d0d5c690d0fbb5b831044cf907bdb742ee19315be3a546.png)


<br>

### ▷ Selective Repeat: Sender
송신은 Go-Back-N과 거의 똑같다.
차이점은 다음과 같다.
- 타이머 개수가 <span style = "color:red">N개</span>
- ACK가 개별적으로 처리된다.

![](/assets/posts/634560f921c422b35fdf9668636ae81f56d43dea0f254ba8170142e30f420f67.png)


> #### ARQ
Automatic Repeat Request
자동 재전송

<br>

### ▷ Selective Repeat: Receiver
Go-Back-N에 비해서 수신측의 윈도우 크기가 N으로 늘어난다.
== 버퍼의 크기가 N개로 늘어난다.

- 순서대로 오지 않아도 그냥 Accept(buffering) 한다.
- 아직 안온거는 그냥 기다린다.
![](/assets/posts/2443d1eedcfddf4786bc304ae9a67c24112a246e559a430e91c483d1b8f6ed9d.png)

<br>

>#### Selective Repeat에서는 딜레마가 발생할 수 있다.
만약, 보내야 하는 패킷이 7개가 있고, 윈도우 크기를 3으로 설정했다고 가정해보자.
sequence Number는 2bit를 써서 0,1,2,3을 번갈아가며 사용한다.<br>
송신: pck0, pck1, pck2를 보낸다.
수신: ACK0, ACK1, ACK2를 보낸다.<br>
이 때, 모든 ACK가 Loss되는 상황이 발생한다.
하지만, 수신측은 ACK를 보냈으므로, 윈도우를 이동시켜서 pck3, pck0, pck2를 받을 준비를 한다.<br>
송신측은 ACK를 못받아서 Time out이 발생하고, pck0, pck1, pck2를 재전송한다.
수신측은 pck0이 새로운 패킷인줄 알고 받는다.<br>
이 딜레마를 해결하기 위해서는 윈도우 크기 N을 sequence Number 개수의 절반으로 해야 한다.

> Go-Back-N의 윈도우 크기: N = 2^k-1
Selective Repeat의 윈도우 크기: N = 2^(k-1)<br>
이 때, k는 sequence number 필드의 비트 수

<br>

## REFERENCE
Computer Networking, A Top Down Approach - JAMES F.KUROSE
