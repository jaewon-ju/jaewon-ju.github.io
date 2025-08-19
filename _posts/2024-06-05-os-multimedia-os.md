---
title: "[OS] Multimedia OS"
description: "Multimedia에 대해서"
date: 2024-06-05T04:51:11.936Z
tags: ["OS"]
slug: "OS-Multimedia-OS"
categories: OS
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:39:01.448Z
  hash: "b2e3c6d05c31dcb08496541933e8a87f0bcdcb31a4daee341c9b0c19d225372e"
---

## ✏️ Multimedia System
> Multimedia
: 미디어가 여러개 섞여 있는 데이터 (텍스트, 그래픽, 음성, 영상 등)

<br>

### ■ 네트워크 구성
Video server가 있고, 그 서버의 내용을 빠르게 전송할 수 있는 network가 필요하다.

- network는 광섬유 망을 사용
- 광섬유로 온 빛 신호를 전기 신호로 바꾸는 Junction box가 필요
- 예전에는 케이블 선을 사용했지만, 현재는 LAN 선 사용
![](https://velog.velcdn.com/images/jaewon-ju/post/f0338217-f28f-47d9-820d-527f05f3ad5f/image.png)


<br>

### ■ Multimedia의 특징

1. High data rate
: 데이터 양이 매우 많다.

2. real-time playback
: real-time을 요구한다.
   - Video, audio, 자막 등의 미디어를 싱크를 맞춰서 데이터를 전송해야 한다.
   - 빠르게 감기 용으로 미리 장면들을 만들어 놓는 Fast Forward도 필요하다.

<br>

---

<br>

## ✏️ Encoding

### ■ Video Encoding
Analog 방식을 사용하고, 노이즈에 민감하다.

- interlacing: 홀수 라인을 모두 그린 뒤에 짝수라인을 그림 (초당 24번)
- progressive: 순서대로 라인을 그림

<br>

### ■ Audio Encoding
sin(아날로그) 신호를 디지털 신호로 변환한다.
변환 방식은 2가지가 존재한다.

1. sampling + Quantizing
: 연속적인 아날로그 신호를 특정 간격으로 측정하여 이산적인 데이터 포인트로 변환하는 과정
   - sampling 한 결과를 4 bit로 저장하면 최대 16개 level로 저장할 수 있다.
   - 양자화(Quantizing) 잡음: 아날로그를 디지털로 바꿨을 때 발생하는 노이즈

<br>

2. Fourier Transformation
: 주어진 신호를 주파수 단위로 분할한 뒤, 각 주파수 성분의 세기를 저장하는 것 
   - 무한한 주파수가 존재하므로, 세기가 센 것들만 저장한다.
   - 주파수 성분의 세기를 통해 아날로그와 비슷한 파형으로 복원할 수 있다.

<br>

### ■ JPEG
> 이미지를 압축하여 블록 단위로 저장하는 방식

예전에는 RGB 신호를 사용했지만, 현재는 YIQ 신호를 사용한다.

- Y: 명암 (제일 중요)
   - Y 성분은 해상도를 그대로 유지
- I,Q: 색상 정보
   - I,Q 성분은 해상도를 반으로 줄여서 저장
   - ex) ```640 * 480``` 이미지에서, Y는 ```640 * 480``` 해상도, I,Q는 ```320 * 240``` 해상도로 저장
<br>

>#### JPEG 인코딩 과정
1. 블록 분할
: 이미지를 8 bit * 8 bit 블록 단위로 분할
2. 주파수 성분 분할
: 각 블록을 구성하는 픽셀값들의 명암을 주파수 성분으로 변환
3. 주파수의 세기 저장
: 모든 주파수 세기를 다 저장하기에는 너무 많기 때문에, 일부만 저장한다.
낮은 주파수 성분(전체 윤곽)은 중요, 높은 주파수 성분(디테일)은 중요하지 않다.<br>
```DCT coefficient / Quantization table = Quantized coefficient```
Quantized coefficient에서 0이 아닌 것만 저장한다.

<br>

### ■ MPEG
>동영상을 <span style = "background-color: lightgreen; color:black">JPEG의 연속</span>으로 처리허여 차이점만 저장하는 방식

MPEG의 구성요소는 다음과 같다.

1. Intracoded Frame
: 독립적으로 JPEG 이미지처럼 압축되는 프레임

2. Predictive Frame
: 이전 프레임과의 차이점만을 저장하는 프레임

3. Bidirectional Frame
: 앞 뒤 프레임과의 차이점을 저장하는 프레임


<br>

>#### MPEG의 특징
MPEG은 비디오의 재생 순서와 다르게 데이터를 디코딩한다. 
예를 들어, 1번과 3번 프레임을 먼저 디코딩한 후, 이 정보를 사용하여 2번 프레임을 재구성한다.


<br>

### ■ Audio Compression
오디오 압축은, 아날로그 데이터를 주파수 성분으로 분해하고 중요한 성분만 저장한다.

Threshold of audibility (가청 주파수)
- 가청 주파수 범위에서 벗어나는 것은 저장할 필요 없다.
- 센 신호 옆에 있는 작은 신호는 저장할 필요 없다.

<br>

---

<br>


## ✏️ Real-Time Scheduling
Real-Time Scheduling의 특징은 다음과 같다.

1. 각 프로세스는 Periodic하다.
: 일정 주기마다 한 번씩 실행해줘야 한다.

2. 각 프로세스마다 실행하는 시간이 정해져 있다.

<br>

Real-Time Schedling 방식은 2가지가 존재한다.

1. Rate Monotonic Scheduling
2. Earliest Deadline First

<br>

### ■ Rate Monotonic Scheduling
> 실행 주기가 짧을수록 작업에 높은 우선순위를 부여하는 방식
또는, ```Rate = 1/주기```  이므로 Rate가 높을수록 우선순위를 높게 주는 방식이라 말 할 수도 있다.

<br>

#### RMS의 조건

1. 각 프로세스는 자신의 주기 안에 반드시 끝난다. 
2. 프로세스간 dependency 는 없다.
3. 프로세스의 수행 시간은 일정하다.
4. Non real time task는 비어있는 시간에 실행한다.
5. Context Switching 비용은 <span style = "color:red">0이라고 가정한다.</span>

<br>

RMS의 유효성 검사를 위해서는 schedulability Test가 필요하다.
모든 Task가 deadline을 미스하지 않고 아무 문제 없이 실행할 수 있을지 판단하는 과정이다.

- 수식을 통한 테스트
- 예제를 통한 테스트

> #### 수식을 통한 테스트
프로세스의 Utilization 값의 총합이 특정 값보다 작으면, 반드시 Scheduling이 가능하다.
```Utilization = 실행 시간 / 실행 주기```<br>
프로세스가 1개인 경우 ```Utilizaion < 1``` 이면 Test 통과
프로세스가 2개인 경우 ```Utilizaion 총합 < 0.828``` 이면 Test 통과
프로세스가 3개인 경우 ```Utilizaion 총합 < 0.779``` 이면 Test 통과

<br>

> #### 예제를 통한 테스트
프로세스(Task) A, B, C가 존재한다.
- A는 30ms마다 한 번씩 실행해야 한다. 한번에 10ms 실행한다.
- B는 40ms마다 한 번씩 실행해야 한다. 한번에 15ms 실행한다.
- C는 50ms마다 한 번씩 실행해야 한다. 한번에 5ms 실행한다.
![](https://velog.velcdn.com/images/jaewon-ju/post/19e27516-56f6-42e7-ad59-6fc7c55d459d/image.png)
위의 경우, 테스트 통과
프로세스 주기들의 <span style = "background-color: lightgreen; color:black">최소 공배수</span>까지 테스트를 실행해봐야 한다!

<br>




<span style = "color:red">⚠️</span> Real-Time system에서는 우선순위가 최고이다!
우선순위 높은 프로세스가 생기면 무조건 Context Switching. (위의 그림에서 100ms 대를 살펴보자)


<br>

### ■ Earliest Deadline First
>Deadline이 빠른 작업부터 실행하는 방식

- Deadline이 똑같은 경우, 실행하고 있던 것이 더 높은 우선순위를 갖는다.

<br>

---

<br>


## ✏️ Priority Inversion
Real-Time System에서는 Priority Inversion이 발생할 수 있다.
Priority Inversion은 <a href= "https://velog.io/@jaewon-ju/%EC%9A%B0%EC%84%A0-%EC%88%9C%EC%9C%84-%EC%97%AD%EC%A0%84">이전 포스팅</a>을 참고하자.

- Real-Time System에서는 우선순위가 정말 중요하다.
- 우선순위 상속을 통해 우선순위 역전 문제를 해결할 수 있다.

<br>

---

<br>

## ✏️ Multimedia File System
### ■ 서버의 유형
1. pull server
: client가 요청을 하면 데이터를 보내준다.
여러 데이터를 받으려면 여러번 요청을 보내야 한다.

2. push server
: 한 번 요청을 보내면, 지속적으로 데이터를 보내준다.

<br>

### ■ Near Video On Demand
서버에 존재하는 영화 하나를 1000명의 client가 보고있다면, 1000개의 스트림이 필요하다.
왜냐하면, 1000명의 클라이언트가 시청하고 있는 장면이 다르기 때문이다.
어떻게 하면 스트림 수를 줄일 수 있을까?

<br>

>영화의 런닝타임이 2시간인 경우
➜ 영화를 5분 단위로 잘라서, 24개의 스트림을 만든다.
➜ 각 클라이언트는 24개의 스트림 중 하나를 선택해서 시청한다.


⚠️ client가 5분 단위 스트림 말고, 특정 시간의 스트림을 원하는 경우?

1. <span style = "color:red">셋톱박스</span>를 사용한다.
셋톱박스는 이전 스트림을 캐싱해서 저장하고 있다.

2. User1는 조금씩 느리게 플레이, User2는 조금씩 빠르게 플레이해서 스트림을 맞춘다.
결국 24개 스트림으로 merge하게 된다.

<br>

### ■ 데이터 저장
Disk에 파일 형태로 video, audio, text를 저장해야한다.
- video, audio, text를 각각 다른 파일에 저장한다면, Disk가 매우 바빠진다.
- 따라서, 하나의 파일에 여러개의 media(multimedia)를 저장한다.

<br>

멀티미디어를 위한 File Organization Strategy는 <span style = "color:red">블록의 크기</span>로 분류할 수 있다.

1. 블록의 크기를 작게 설정하는 전략
   - 블록의 크기를 작게 하면, 하나의 mutlimedia 프레임을 저장할 때 블록을 여러개 써야한다.
   - 이 경우, <span style = "background-color: lightgreen; color:black">Frame Index</span>를 사용한다.
ex) 첫 프레임은 i번 블록부터 n개를 차지한다.

2. 블록의 크기를 크게 설정하는 전략
   - 블록 크기를 크게 하면, 하나의 블록에 여러개 multimedia 프레임이 저장된다.
   - 이 경우, <span style = "background-color: lightgreen; color:black">Block Index</span>를 사용한다.
   ex) 첫 블록에는 i번 프레임부터 n개의 프레임이 존재한다.
   - 블록의 크기가 크면, Splitting이 발생한다.
➜ 블록의 빈 공간에 들어가지 않는 프레임이 존재하면
➜ 그 부분을 쓰지 않거나, 프레임을 잘라서 두 개의 블록에 저장 (Splitting)
<br>


Frame Index 크기는 크다.
Block Index 크기는 작다.




<br>

---

<br>

## REFERENCE
📚 Modern Operating Systems, Third Edition - Andrew S. Tanenbaum