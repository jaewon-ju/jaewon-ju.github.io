---
title: "[CS 지식] System Call & Interrupt"
description: "운영체제를 공부하던 중, System Call과 Interrupt의 차이가 정확히 뭔지 모르겠어서 한번 찾아보았다."
date: 2024-04-18T13:56:44.549Z
tags: ["CS지식"]
slug: "CS-지식-System-Call-Interrupt"
velogSync:
  lastSyncedAt: 2025-08-19T08:36:52.153Z
  hash: "ae1403602c4fce8867066277500e94200702189b1ca582f67f3002480542a053"
---

운영체제를 공부하던 중, System Call과 Interrupt의 차이가 정확히 뭔지 모르겠어서 한번 찾아보았다.

교수님께서 매일 하시는 말씀이 있다.
>"프로세스 A는 입출력을 요구받으면 System Call을 해서 Interrupt를 건다."

이 말씀을 하실 때마다 나는 이게 무슨 말인지 전혀 이해를 하지 못했다.
이를 이해하기 위해서는 System Call과 Interrupt가 무엇인지 정확히 이해해야 한다.

<br>

### ■ System Call
>시스템 호출은, <span style = "color:red">User Program</span>이 자원이나 서비스를 받기 위해 운영체제에게 요청하는 것이다.

User Program이 시스템 호출을 하면 다음과 같이 동작한다.

1. User Program이 System Call
2. User Mode -> Kernal Mode
3. Kernal은 요청받은 System Call에 맞는 서비스 루틴을 호출한다.
4. 서비스 루틴을 처리한 뒤, User Mode로 복귀한다.

<br>

### ■ Interrupt
> 인터럽트는, 실행중인 프로세스에 이벤트가 발생한 경우 작업을 중단하고 이벤트를 처리한 뒤 다시 복귀하는 것이다.

인터럽트가 발생하는 이유는 단 2가지이다.

1. 외부에서 인터럽트를 요구한 경우
   - I/O, ^C, CPU 이상 등
2. 내부에서 인터럽트를 요구한 경우
   - <span style = "color:red">System Call</span>, 프로그램 오류 등
   
<br>

정리하자면, 인터럽트는 이벤트를 대처하기 위한 메커니즘(동작 방식)이다.
➜ 현재 작업 중단 후 이벤트를 대처하고 복귀하라

인터럽트를 실행시키기 위한 방법 중에 하나가 System Call인 것이다.

<br>

아까의 예시를 다시 한번 보자.
>1. User Program이 System Call <span style = "background-color: lightgreen; color:black">(이벤트 발생! -> Interrupt 처리 시작)</span>
2. User Mode -> Kernal Mode
3. Kernal은 요청받은 System Call에 맞는 서비스 루틴을 호출한다.
4. 서비스 루틴을 처리한 뒤, User Mode로 복귀한다. <span style = "background-color: lightgreen; color:black">(Interrupt 처리 끝)</span>

<br>

따라서, 모든 종류의 System Call은 Interrupt라 할 수 있다.