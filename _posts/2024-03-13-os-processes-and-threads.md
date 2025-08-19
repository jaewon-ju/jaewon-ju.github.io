---
title: "[OS] Processes and Threads"
description: "프로세스와 스레드에 대해서"
date: 2024-03-13T09:55:21.949Z
tags: ["OS"]
slug: "OS-Processes-and-Threads"
categories: OS
velogSync:
  lastSyncedAt: 2025-08-19T08:36:52.976Z
  hash: "bd56a8d03f7e3f544060ca0865a7656b6ab9d35af86ce3210173bab74fbcd986"
---

## ✏️ Process
> 프로세스란 실행 중인 프로그램이다.

<br>

### ■ MultiProgramming
> MultiProgramming이란, 하나의 CPU에서 여러개의 프로그램을 실행하는 기법이다.

⚠️ 사실은 동시에 실행하는 것이 아니다.
CPU가 매우 빠른 속도로 돌아가면서 프로그램을 실행하는 것이다.

- 병렬 VS 병행 
병렬 - 진짜 여러개가 동시에 실행
병행 - 논리적으로 동시에 실행

>MultiProgramming이 어떻게 가능한가?
➜ Dipatcher 사용
- Dispatcher는 현재 실행 중인 프로세스의 컨텍스트를 저장하고, 다음 프로세스의 컨텍스트를 로드하여 실행한다.<br>
![](https://velog.velcdn.com/images/jaewon-ju/post/150828b2-0b78-4279-8c9b-dec1da357a4b/image.png)
프로세스 A,B,C는 각각 자원을 따로따로 받는다.<br>
1. Process A 실행
PC: 5000번대
<br>
2. 5005번 라인 실행 중 타이머 인터럽트 왔음
<span style = "color:red">5005번 라인 끝내고</span> 5006을 스택에 push 한 뒤 인터럽트 서비스 루틴으로 점프
<br>
3. 서비스 루틴은 100번지 (Dispatcher)
A 프로세스의 내용을 보관해야됨 (Register 값들을 스택에 푸쉬)
100번지의 타이머 서비스 루틴 실행 한 뒤에 8000번대로 점프
<br>
4. 원래는 5000번대로 돌아가야 하지만, Dispatcher의 스케쥴링으로 인해서 B로 감
Process B 실행.
ProgramCounter는 8000번대 

- 실제로는 I/O 대기 시간이 대부분을 차지한다.
- 대부분의 프로그램은 사용 시간 대비 CPU 활용도가 5%도 안된다.
- 나머지는 I/O 대기 시간에 사용한다.
<br>

### ■ Process Lifecycle

__모든 프로세스는 init 프로세스의 자식이다.__

프로세스의 종료는 시스템 호출로 운영체제에게 부탁 해야한다. (exit 시스템 호출)
>► 프로세스의 종료도 <span style = "background-color: lightgreen; color:black">운영체제</span>가 담당한다.


<br>

| 자발적 종료 | 비자발적 종료 |
| - | - |
|normal exit(0번) | fatal error|
| Error exit| Killed by another process|

<br>

- normal exit: 정상 종료
- Error exit: 잘못된 입력 등

- fatal error: CPU가 실행할 수 없는 명령을 만나면 스스로 인터럽트를 걸어서 운영체제로 점프함
ex) Divide by 0, Null pointer Exception
- Killed by another process: 다른 프로세스가 kill signal을 보내서 죽임


<br>

### ■ Process State 
![](https://velog.velcdn.com/images/jaewon-ju/post/3a251242-f1f0-427e-ba5f-a9477d8fb189/image.png)
- Running:
프로세스 실행 상태
종료하면 Exit 상태가 된다. (Running과 Exit 사이를 Zombie 상태라 부른다)

- Blocked: 
실행 중에 입출력 명령을 호출해서 프로세스를 실행할 수 없는 상태
입출력이 끝나면 Ready 상태로 돌아감

- Ready:
Blocked 상태에서 입출력이 종료되거나, Running 상태에서 스케줄링된 시간이 끝나면 Ready 상태가 된다.

<br>

추가로, Suspend라는 상태도 존재한다.
- Suspend: 
프로그램 실행을 잠깐 멈춘 상태

![](https://velog.velcdn.com/images/jaewon-ju/post/222e80e0-0572-4aed-a1d3-e6cd1c1de3ae/image.png)

- Ready, Block 상태의 프로그램을 Suspend로 만들 수 있다.<br>
Blocked 상태에서 중지하면 Blocked/Suspend
Running, Ready 상태에서 중지하면 Ready/Suspend<br>
Block Suspend ➜ Ready: Activate + I/O 끝 
Ready Suspend ➜ Ready: Activate

- 프로세스가 너무 많으면 OS가 프로세스를 Suspend로 만들어버릴 수 있다.





<br>

### ■ Scheduling
- Scheduling은 Queue로 구현된다.
- Scheduling을 담당하는 Scheduler는 OS가 갖고 있다.

> #### Scheduling Example
1. Ready Queue의 제일 첫번째 프로그램(<span style="color:red">A</span>)을 dispatch해서 CPU(Processor)가 실행
2. 시간이 지남
3. <span style="color:red">A</span>가 Ready Queue의 제일 끝으로 들어감
4. 그 다음 프로그램을 dispatch ...
<br>
#### If, <span style="color:red">A</span> 실행 중에 I/O가 발생한다면?
1. 입출력 호출 시 해당되는 입출력 장치 Queue로 들어간다. (block 상태 - Ready Queue로 못감)
2. Ready Queue에서 다음 프로그램(<span style="color:skyblue">B</span>)를 dispatch해서 실행
3. <span style="color:skyblue">B</span> 실행 중에 <span style="color:red">A</span> 입출력이 끝남
4. 일단  <span style="color:skyblue">B</span> 를 끝냄
5. 인터럽트가 걸림
6. Event Queue에서 기다리고 있던 <span style="color:red">A</span>를 Ready Queue 제일 뒤에 넣음
<br>
#### If, 프로세스를 종료하고 싶다면?
exit 시스템 호출 시 좀비 상태가 된 다음에 자원을 반납하고 종료된다.


<br>

---

<br>


## ✏️ Process의 구현
OS는 프로세스를 관리하기 위해 <span style = "background-color: lightgreen; color:black">Process Table</span>을 사용한다.

- Process Table은 OS의 핵심적인 자료구조이다.
- 프로세스 하나당 하나의 Process Controll Block을 차지한다.
- 블록에 저장되는 것은, 【 Ready, Blocked ➜ Running 】 을 위해 필요한 정보이다.

<br>

Process Controll Block에 저장되는 것들

|프로세스 관리 정보| 메모리 관리 정보| 파일 관리 정보|
| - | - | - |
| 레지스터 값| 메모리 - 텍스트 영역 정보| Root Dir|
| PC 값| 메모리 - 데이터 영역 정보|  Working Dir
| Stack Pointer 값 | 메모리 - 스택 영역 정보| File Descriptors|
| Process State | ... | UID, GUID|
| Signal | | ...|
| PID |
| Process 시작 시간 |
| ... |

<br>

---

<br>


## ✏️ Thread
> 스레드는 프로세스 내의 실행 단위이다.
모든 스레드가 종료될 때 프로세스가 종료된다.

- 자원은 프로세스에게 주고, 스케쥴링은 Thread를 함
- <span style = "color:red">스케쥴링의 단위는 Thread이다!!</span>

<br>

### ■ Multi Thread
스레드를 여러개 만들 수 있다.
운영체제가 스레드를 병행 실행 해준다.

>#### Multi Thread Example - Web Server
웹 서버를 멀티 스레드로 구현할 수 있다.
dispatcher Thread + worker Threads<br>
1. dispatcher Thread가 요청을 받음 
2. worker Thread 지정, dispatcher Thread는 다시 대기 상태로
3. worker가 캐시를 확인하고 응답을 보냄


- <span style = "background-color: lightgreen; color:black">멀티 스레드는 자원을 공유한다.</span>
- 동기화가 필요하다.

<br>

> #### If, 멀티 스레드가 지원이 안되면?
멀티 프로세스로 만들면 되긴 한다.
dispatcher: fork() 해서 자식 프로세스 만들고 각 자식 프로세스가 exec 하면 된다.<br>
But, 너무 오버헤드가 크다

<br>

### ■ Classic Thread Model
옛날 컴퓨터 시스템은 프로세스의 실행의 흐름이 하나였다. (Single Thread)
➜ main 함수를 실행하고 끝난다.

그러다 불편하니까 멀티 스레드를 만들게됨
스레드는 자원을 공유한다.
But! 상태는 각자 다르다.
<br>

| 공유하는 자원 | 개인 자원 |
| - | - |
| 주소 공간 | PC|
| 전역 변수| Register|
| 오픈된 파일| Stack|
| 자식 프로세스| State|
| signal| |



<br>

### ■ Posix Thread
>POSIX Thread란 Poix 표준에서 정의된 스레드 라이브러리이다. 
POSIX 스레드는 유닉스 계열 운영 체제에서 표준 스레드 라이브러리로 사용된다.

| Thread Call | Description |
| - | - |
| Pthread_create | 새로운 스레드를 만듦|
| Pthread_exit| 스레드 종료 |
| Pthread_join| 특정 스레드가 종료될 때까지 기다림|
| Pthread_yield| 다른 스레드를 위해 양보함 (프로세스는 양보하지 않음)|
| Pthread_attr_init| 스레드의 속성 구조 만듦|
| Pthread_attr_destroy| 스레드의 속성 구조 없앰|

<br>

---

<br>

## ✏️ Thread 구현
~~ 먼 옛날 ~~
MultiThread 필요해
► OS가 모두 Single Thread라 다 뜯어 고쳐야돼. 오래 걸려
► 일단 User-Level Thread 패키지로 간이 Multi Thread를 구현하자


<br>

### ■ User-Level Thread
> #### 사용자 수준 스레드(User-Level Thread)
사용자 수준 스레드(User-Level Thread)는 운영 체제 커널의 개입 없이 사용자 공간에서 구현되는 스레드이다.

- 멀티 스레드가 프로세스 내부의 Run-time system 을 사용해서 구현된다.
Run-time System: POSIX Thread 같이 스레드를 관리해주는 프로시저의 모음
Run-time System은 Thread Table을 가지고 있다.
➜ 각 프로세스는 자신만의 스레드 테이블 가짐

- 커널은 스레드 존재를 모르고, 프로세스만 스케줄링함. 

- 스레드가 유저 스페이스에서 관리됨

<br>

### ■ 하이브리드
User level thread package + multiThread

가격 비교
프로세스 여러개 만들기 > 스레드 여러개 만들기
커널이 스레드 여러개 만들기 > 스레드가 User level Threads 만들기

∴ 멀티 스레드가 각자 User level Threads 를 만들어서 사용함

<br>


### ■ Single Threaded Code to MultiThreaded
~~ C언어는 multithread를 생각하지 않고 만들었다. ~~
► Multi Thread를 사용하려고 하니까 오류가 나네
► 시스템 호출하고 나서 errno에 에러 정보를 세팅해줌, 근데 Thread가 여러개면 각 스레드가 errno를 적음

► 어떻게 하지?
► 글로벌 변수(errno)도 스레드마다 따로 가지게 하자.

<br>

~~ 리눅스는 멀티 스레드를 생각하지 않고 만들었다.~~
► 우리도 지원해야 하는데... 어떻게 하지?
► Thread 포크해서 code data heap만 같이 쓰게 하자. stack만 따로 쓰게 하자.
► 간이 멀티 Thread 구현 완성

<br>

---

<br>

## REFERENCE
📚 Modern Operating Systems, Third Edition - Andrew S. Tanenbaum




