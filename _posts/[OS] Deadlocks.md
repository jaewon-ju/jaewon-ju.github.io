---
title: "[OS] Deadlocks"
description: "Deadlock의 발생 조건과 방지법에 대해서"
date: 2024-05-30T12:39:38.268Z
tags: ["OS"]
slug: "OS-Deadlocks"
series:
  id: 68b31a47-60e2-4f31-a1a1-36f9e262527e
  name: "OS"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:33.659Z
  hash: "3c9a75bf10cd3426a0ad1bddb63fb5c31ed3c2548bae02e506261c0e060545b1"
---

## ✏️ Deadlock
> #### Deadlock
: A set of processes is deadlocked if each process in the set is waiting for an event that only another process in the set can cause<br>
다수의 프로세스가 특정 프로세스가 점유하고 있는 자원을 서로 기다릴 때 무한 대기에 빠지는 상황을 의미한다.

<br>

예를 들어, Tape1에서 Tape2로 카피 하는 경우를 생각해보자.
프로세스 A가 Tape 자원을 사용하려면 Tape semaphore down ➜ up 을 해야한다. Tape1과 Tape2 자원을 사용해야 하므로 semaphore를 2개 흭득해야 한다.

<br>

>- 1번 상황: A는 Tape1 부터 사용, B도 Tape1 부터 사용
   - A: ```resource1 down, resource2 down```
   - B: ```resource1 down, resource2 down```
동시에 실행하는 경우, Dead lock이 없다.

resource1을 흭득하지 못한 프로세스는 resource1에 대해서 대기하기 때문이다.
<br>

>- 2번 상황: A는 Tape1 부터 사용, B는 Tape2 부터 사용
   - A: ```resource1 down, resource2 down```
   - B: ```resource2 down, resource1 down```
동시에 실행하는 경우, Dead lock이 발생할 수 있다.



<br>

### ■ Deadlock의 조건
조건 4개가 <span style = "background-color: lightgreen; color:black">모두</span> 만족해야 deadlock이 발생한다.

1. Mutual Exclustion
2. Hold and Wait (하나의 자원을 가지고 있고, 다른 자원을 요구함)
3. No preemption (중간에 포기하지 않음)
4. Circular wait 

<br>

![](https://velog.velcdn.com/images/jaewon-ju/post/29e1419b-ba6a-4e76-b0f7-846a2fffd12f/image.png)

<span style = "color:red">⚠️</span> Deadlock의 조건이 만족되더라도, Deadlock이 걸리지 않을 수도 있다.


<br>

---

<br>

## ✏️ Deadlock 대응법
1. 무시 (타조 전략)
: Deadlock이 발생하면 껐다 키자

2. Detection & Recovery 
: Cycle Detection 또는 banker's algorithm으로 Detection 후 Recovery

3. Avoidance (회피)
: 자원을 요청해달라고 요구했을 때 Deadlock에 걸릴 가능성이 있는지 확인한다.
(자원을 줬다고 가정하고 Detection 실행)
   
4. Prevention 
: Deadlock의 조건 중 하나를 없애버린다.

현재 시스템은 2,3,4를 혼합해서 사용한다.

<br>

### ■ Detection & Recovery
2가지 방법으로 Deadlock Detection을 할 수 있다.

1. Cycle Detection
   - Resource Allocation Graph를 그린다. 
   - 그래프에서 사이클이 발견되면 데드락이 존재하는 것으로 간주한다.

<br>

2. Banker's algorithm
   - 각 프로세스가 작업을 위해 필요한 자원의 양과 시스템이 가진 총 자원의 양을 비교하여 deadlock의 발생 가능성을 판단한다.
> 남은 자원 수 R1: 3개, R2: 3개, R3: 3개
![](https://velog.velcdn.com/images/jaewon-ju/post/15329738-ba2c-498a-ae86-e81af38c9754/image.png)
B ➜ D ➜ C ➜ A
다음과 같은 순서로 자원을 할당하고, 끝난 작업의 자원을 회수해서 재분배하면 Deadlock을 피할 수 있다.
   - Deadlock을 피할 수 있는 자원 할당 순서를 <span style = "background-color: lightgreen; color:black">safe order</span>라고 한다.
   - safe order가 단 하나라도 존재하는 상태를 safe state라 한다.

<br>

Deadlock Recovery는 세가지 방법을 사용할 수 있다.

1. Preemption
: 데드락 상태를 해결하기 위해 자원을 강제로 회수

2. Rollback
: 프로세스를 이전 체크포인트로 되돌려 자원을 반납시키고 다시 시작

3. Kill Process
: 해결이 어려운 경우, 일부 프로세스를 종료하여 자원을 회수


<br>

### ■ Avoidance
자원을 줬다고 가정한 뒤에 Banker's algorithm을 적용해본다.

- safe order가 존재하면 요청을 수락한다.
- safe order가 없으면 요청을 거부한다.

현실적으로 적용하기는 어렵다.

<br>

### ■ Prevention
Deadlock이 아예 존재하지 않도록, 4가지 조건중 하나를 없앤다.

>1. Mutual Exclusion 제거<br>
- 독점 자원을 공유할 수 있는 자원으로 변경한다.
- 예를 들어, 프린터를 spooling 함으로써 공유 자원으로 변경한다.
- 프로세스가 출력할 것이 있으면 file로 적고, spooling Daemon한테 부탁한다.


>2. Hold and Wait 제거<br>
- 필요한 리소스를 모두 할당 받고 시작하거나 할당 받지 못하면 아예 시작하지 못하도록 한다.
- 실제로는 불가능한다.
   - 이유1: 웹 브라우저 같은 프로그램은 자기 자신이 어떤 리소스가 필요한지 모른다.
   - 이유2: starvation 발생 가능

>3. No preemption 제거
- 이미 할당된 자원을 강제로 빼앗을 수 있도록 만든다.

>4. Circular Wait
- 자원마다 고유 번호 부여
- 프로세스는 번호가 낮은 자원부터 요청함으로써 Circular Wait를 방지
<br>
   - 작은 번호부터 높은 번호 순서로 할당 받게 한다.
   
<br>

---

<br>

## ✏️ Deadlock의 issue
### ■ Two-Phase locking
DB에서 사용하는 방식으로, A통장에서 B 통장으로 돈을 전송하는 경우 A에 락을 걸고 이후 B에 락을 걸어 전송을 진행
 
 - 만약 A lock 성공 후, B lock을 실패 한다면 A lock을 해제함

하나라도 락을 획득하지 못할 경우 모든 락을 해제하는 방식
<br>

### ■ Communication Deadlocks
> Deadlock의 한 형태로, 여러 장치들이 Network를 사용해서 서로 통신하려고 할 때 발생한다.

A, B, C, D 네 컴퓨터와 네 개의 네트워크 카드가 각각 데이터를 전송하려 할 때 동시에 데드락 발생 가능

<br>

### ■ Live Lock
데드락과 유사한 상황에서 발생하며, 루프를 걸며 계속 기다리는 상태.

<span style = "color:red">⚠️</span> 데드락은 대기 상태(sleep)이지만, 라이브 락은 계속 시도하며 루프(loop)를 돈다.
➜ CPU 자원을 소비하므로 데드락보다 더 안좋다.


<br>

---

<br>

## REFERENCE
📚 Modern Operating Systems, Third Edition - Andrew S. Tanenbaum