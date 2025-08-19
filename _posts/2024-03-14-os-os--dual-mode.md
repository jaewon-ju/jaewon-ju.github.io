---
title: "[OS] OS와 Dual Mode"
description: "운영체제를 자세히 이해하기 위한 사전 지식과 Dual Mode에 관해서"
date: 2024-03-14T13:48:26.757Z
tags: ["OS"]
slug: "OS-OS와-Dual-Mode"
categories: OS
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:39:02.632Z
  hash: "30e06f8f5d8ec3a7f1398411eacf9d0b9d0b9c2fab8a93aeb1d74a6efb96475b"
---

## ✏️ 운영체제를 이해하기 위한 사전지식


### ■ Processes 
>프로세스는 트리의 구조로 생성된다.

- 최초의 프로세스는 부팅할 때 실행된다.
- 최초의 프로세스는 모든 프로세스의 부모이다.

ex) 그래픽 쉘에서 크롬을 클릭
➜ 쉘 프로그램의 자식 프로세스로 크롬 프로세스 실행
➜ 크롬에서 다른 프로그램 실행
➜ 크롬의 자식 프로세스로 실행됨

<br>

### ■ Files
>파일은 트리 구조로 구성된다.
디렉토리 또한 파일이다.

<span style = "color:red">디렉토리와 파일은 구조가 똑같다.</span>
디렉토리에는 하위 파일들의 정보가 테이블 형태로 있을 뿐이다.

- 리눅스에서는 다른 디스크에 존재하는 파일에 입출력하려면, Root 디렉토리 아래에 마운트시켜야 한다.
- 초기 유닉스에서는 파일을 사용해서 프로세스간 정보를 전송했다. (Inter Process Communication)
   - 프로세스 A가 파이프 파일에 적고 B가 읽어간다


<br>

### ■ System Call
>System Call은 사용자 프로세스가 운영 체제의 커널에 서비스를 요청하는 방법 중 하나이다.

| 프로세스 관리를 위한 System Calls |
| - |
| pid = fork() | 
| pid = waitpid(pid, &statloc, options) | 
| s = execve(name, argv, environp) | 
| exit(status) |

<br>

| 메모리 관리를 위한 System Calls |
| - |
| fd = open(file, how) | 
| s = close(fd) | 
| n = read(fd, buffer, nbytes) | 
|n = write(fd, buffer, nbytes)|
|position = lseek(fd, offset, whence)|

<a href="https://velog.io/@jaewon-ju/CS-%EC%A7%80%EC%8B%9D-System-Call-Interrupt">System Call과 Interrupt가 헷갈릴 경우</a>

<br>

### ■ Virtual Machine
>Virtual Machine이란, 컴퓨터 하나를 그대로 Ammulate한 뒤에 운영체제를 설치하는 것이다.

각각의 가상머신마다 CMS 운영체제를 올리고 사용하게 하면, 다중 사용자 지원할 수 있다.

- 가상 머신 프로그램을 Hypervisor라고 부른다.
- 호스트의 OS 위에 직접 설치되는 네이티브 Hypervisor와, 일반 운영체제에서 실행되는 애플리케이션 형태의 호스트형 Hypervisor가 존재한다.

<br>

#### Virtual Machine의 문제점
네이티브 Hypervisor의 경우, Windows, Linux는 User Mode이고 Hypervisor(OS)는 kernel Mode이다.

- 입출력하려면 interrupt 걸어서 Hypervisor로 점프해야한다.
- 마치 Windows, Linux 등의 OS가 입출력을 처리한 것 처럼 세팅되어야 한다.


<br>

---

<br>

## ✏️ 운영체제의 구조


### ■ Monolithic System
가장 초기에 개발된 운영체제 아키텍쳐

- 운영체제의 모든 구성 요소를 커널에 포함시켰다.
- 3가지 구성 요소로 나뉜다.
   - 메인 프로그램: 서비스 프로시저를 호출
   - 서비스 프로시저: 시스템 호출을 수행
   - 유틸리티 프로시저: 서비스 프로시저를 지원

<br>

### ■ Layered System
THE 운영체제에서 사용된 아키텍쳐
- 유사한 기능을 수행하는 요소들을 그룹으로 묶어서 하나의 Layer로 만들었다.

| Layer | Function |
| - | - |
| 5 | 사용자 프로그램 Operator |
| 4 | User programs |
| 3 | I/O 관리 |
| 2 | Operator-process communication |
| 1 | Memory & Drum 관리 |
| 0 | Processor allocation & multiprogramming |

<br>

### ■ Microkernels
운영체제가 너무 방대하니, 모듈 단위로 쪼개서 관리하는 아키텍쳐

- 기타 운영체제의 기능은 프로그램으로 만들어서 프로세스로 돌린다.
- 핵심 기능(interrupt, scheduling, IPC)은 Microkernel로 만든다.

- 운영체제의 유지 보수가 쉬워진다.
ex) 운영체제 기능 중에서 파일 시스템만 바꾸고 싶다?
➜ 파일 시스템만 바꿔서 다시 실행시키면 된다.



<br>

#### 문제점
모든 요청을 메시지로 송수신 해야한다.
∴ 기존 Monolithic에 비해서 성능이 떨어진다.


<br>

### ■ Client-Server Model
분산 운영체제 아키텍쳐

- 마이크로커널이 발전한 형태이다.
-
마이크로커널은 하나의 컴퓨터에서 작동하지만, Client Server는 운영체제의 기능을 각각의 컴퓨터에서 작동시킨다.

- 각 기계마다 제공해주는 운영체제의 서비스가 다르다.
- 각 컴퓨터는 네트워크로 연결되어 있다.

<br>



<br>

---

<br>

## ✏️ Dual Mode

### ■ User Mode
- User Program이 실행되는 모드이다.
- 특권 명령 (Privileged Instruction)을 실행할 수 없다.

> 특권 명령이란?<br>
I/O 명령
Processor 상태 조정 명령
특권 메모리 영역에 접근하는 명령

- Interrupt를 사용해서 Kernel Mode로 넘어갈 수 있다.
<br>


### ■ Kernel Mode
- 특권 명령을 실행할 수 있다.
- Interrupt Return 명령을 사용해서 User Mode로 돌아갈 수 있다.


