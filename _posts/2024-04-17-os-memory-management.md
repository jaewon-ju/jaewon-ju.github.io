---
title: "[OS] Real Memory System"
description: "운영체제의 메모리 관리 시스템에 대하여"
date: 2024-04-17T06:51:20.550Z
tags: ["OS"]
slug: "OS-Memory-Management"
categories: OS
velogSync:
  lastSyncedAt: 2025-08-19T08:36:52.178Z
  hash: "57160c9ac9f01c3bdd6331c052780d31e68ebc814f6e7c77453263425294e566"
---

## ✏️ Real Memory System 
>프로그램의 모든 주소가 DRAM의 physical address와 1:1로 매핑된다.
➜ NO Memory Abstraction(가상 메모리를 사용하지 않음)


![](https://velog.velcdn.com/images/jaewon-ju/post/f914d346-d11e-4b73-8472-87919378830c/image.png)


Real Memory System을 구현하기 위한 3가지 모델이 존재한다.

- (a): OS의 주소를 0번지 부터, 나머지 프로그램은 그 위에 올린다.
- (b): 사용불가하다. 대부분의 CPU들은 0번지부터 I/O 벡터 테이블이 존재해야 함.
- (c): 초기 PC에서 사용한 방식.

<br>

### ■ Single program
>프로그램 메모리는 반드시 연속적인 주소 공간을 사용해야 한다. 

하지만, DRAM은 메모리를 이산적으로 적재할 수 있다.
∴ program 메모리 크기 < system 메모리 크기


컴파일러는 코드 데이터의 주소(MIN_address - MAX_address)를 만들어서 메모리에 적재한다.
- Real Memory System에서 코드 데이터의 주소는 반드시 메모리의 주소와 일치해야 한다.
- program address == System address
![](https://velog.velcdn.com/images/jaewon-ju/post/464ff7d4-f231-4b3a-85de-3333d7ac8e18/image.png)


위의 문제는 프로그램 주소에 맞게 DRAM에 적재하면 해결된다.
하지만, 여러 프로그램이 DRAM에 적재되는 경우 문제가 발생한다.

<br>

### ■ Multi Program
Real Memory System에서 Multi Program을 구현하기 위한 2가지 방법이 존재한다.

1. memory relocation
Memory Relocation: 프로세스의 주소를 DRAM내에서 욺기는 작업

2. Partitioning
Partitioning: 미리 프로세스가 적재될 DRAM 영역을 지정해놓음

<br>

---

<br>

## ✏️ Memory Relocation & Partitioning
>#### Multi Program  W/ Memory Relocation 
- Process A: 0번지부터 100번지 사용
- Process B: 0번지부터 200번지 사용<br>
<문제>
Memory Relocation을 사용해서 B에 100-300번지를 할당하면, 
program address != System address 이므로 오류 발생


<br>


> Fixed Partitioning의 종류
1.  Equal size partitioning(partition 크기 같음)
2. Unequal size partitioning(partition 크기 다름)
<br>
#### Fixed Partitioning 방법을 사용해서 Multi Program 구현
- Process A: 100-200번지까지 쓸거야.
- Process B: 200-400번지까지 쓸거야.(이 경우 Unequal size partitioning)<br>
<문제>
1. <span style = "background-color: lightgreen; color:black">다른 Partition으로 이동 불가능!</span>
2. 프로그램은 Partition보다 작아야함.
∴ 반드시 안쓰는 부분이 존재하게 됨 <span style = "background-color: lightgreen; color:black">(Internal fragmentation)</span>

Memory Relocation, Partition 방식을 각각 따로 사용하면 문제가 발생하고 효율적이지 못하므로, 두 방식을 혼합하여 사용한다.


<br>


### ■ Dynamic Program Relocation
>지정된 Partition에 프로세스를 넣기 위해서, 프로세스 실행중에 CPU가 프로세스 주소를 Relocation 한다.

프로세스 A 주소: 0-500번지
DRAM Partition 주소: 1000 - 1500번지
- CPU에서 실행될 때 주소가 Dynamic하게 변경된다.
- CPU는 <span style = "color:red">Limit Register</span>로 Memory Exception 검사
   - 500번지를 초과해서 접근하는 경우 Memory Exception
- CPU는 <span style = "color:red">Base Register</span>로 프로세스의 메모리 주소에 1000을 더한다.
- A는 DRAM의 1000 - 1500번지에 저장된다.

<br>

Relocation의 문제와 Partition의 문제를 해결했다.

1. Process A와 B가 동일한 주소를 사용해도 Base Register로 변경가능하다.
2. Base Register 값만 바꾸면 다른 partition으로도 이동 가능하다.

Dynamic Relocation을 사용하면, Partition 각각에 존재했던 Ready Queue를 하나로 만들 수 있다.
![](https://velog.velcdn.com/images/jaewon-ju/post/b705f110-748f-4ad3-b9ea-c309f9a2d811/image.png)


<br>

### ■ Dynamic Partitioning
Dynamic Relocation보다 더 발전된 방식이다.
> #### Dynamic Partitioning
빈공간에 프로세스를 Relocation하는 방법. 
프로세스 == Partition
(더이상 Partition을 미리 지정하지 않아도 된다.)

- 프로세스의 주소 크기가 곧 Partition의 크기이다!
- 프로세스 A를 DRAM에 적재한 후에 I/O 인터럽트가 발생하면, DRAM에서 A의 수행 이미지를 내보낸다.
   - 그럼 빈 공간이 생기는데, 해당 위치에 다른 프로세스 B를 적재한다. <span style = "color:red">(B의 크기 ≤ A의 크기)</span>
   - B의 크기가 A와 정확하게 일치하는 경우는 거의 없으므로, Fragmentation(단편화)이 발생한다.
<br>

Partition을 차지하고 있던 프로세스가 DRAM에서 나가면, 빈 공간이 생긴다.
새로운 프로세스를 빈 공간에 넣어야 하는데, 어떤 공간이 가장 효율적일까?

> #### Placement Algorithm
![](https://velog.velcdn.com/images/jaewon-ju/post/cb994054-8665-47c5-90cd-a5d555c3afac/image.png)
새로운 프로세스를 어디에 적재할 것인가? 
- First fit: 넣을 수 있는 공간 중 첫번째 공간
- Best fit: 넣을 수 있는 공간 중 fragmentation이 가장 적게 발생하는 공간
- Next fit: 이전에 프로그램을 적재한 위치(Last allocated)에서부터 탐색해서, 그 다음 공간에 적재

<br>

#### Best가 진짜 최선이고, Worst가 최악인 것일까?
- Best fit로 넣으면 정말 쓸데 없는, 자투리 공간이 생김
- Worst fit로 넣으면 쓸 수 있는 약간의 공간이 생길 수도 있음

예를 들어, 크기가 500인 프로세스 A를 넣는다고 가정해보자.

1. Best fit: 크기가 550정도인 Partition
2. Worst fit: 크기가 1000정도인 Partition

Best fit에 넣으면 50정도가 남는다. 50은 정말 어떤 프로그램도 들어가지 못할정도로 쓸데 없는 빈 공간이다.
Worst fit에 넣으면 500정도가 남는다. 500이면 다른 작은 프로그램을 넣을 수도 있다.

<br>

#### 가장 빠르게 적재할 수 있는 방법은 무엇일까?
First fit/Next fit가 빠르고, Best/Worst가 느리다.
- First fit/Next fit: 탐색해서 발견하는 첫 위치에 적재
- Best fit/Worst fit: 빈 공간을 다 탐색한 뒤에 최적의 공간을 찾아서 적재

<br>

---

<br>

## ✏️ Solution for Fragmentation
Dynamic Program Relocation/ Dynamic Partitioning을 사용하면 Fragmentation(단편화)이 발생한다.
이것을 어떻게 해결할 수 있을까?

### ■ Coalescing (병합)
![](https://velog.velcdn.com/images/jaewon-ju/post/0848b114-48b9-4709-80fb-2cb690026b75/image.png)

<br>

### ■ Compaction (통합)
>#### Compaction(통합)의 조건:
Dynamic relocation이 가능해야 한다.

>#### Compaction
: 프로그램 주소들을 이동시켜서 연속된 주소를 가지게 한다.
➜ 큰 빈공간이 생긴다.

![](https://velog.velcdn.com/images/jaewon-ju/post/2d8d2279-0c3c-47cb-8f36-9c2e4a680d21/image.png)

- java Virtual Machine에서 Compaction을 한다.
(Garbage Collection)

<br>

| Compaction이 발생하는 상황  |
| - |
| Utilization이 일정 수준 이하로 떨어졌을 때 |  
| Memory Allocation이 실패했을 때 |  
| 주기적으로 |  

<br>

#### Compaction의 문제
- Compaction은 굉장히 비싼 동작이다.
<span style = "background-color: lightgreen; color:black">Compaction 하는 동안 시스템이 멈춘다.</span>
- Optimal Compaction을 찾기 어렵다.
>Optimal Compaction: 어떤 프로세스의 주소를 옮겨야 가장 효율적인가?
![](https://velog.velcdn.com/images/jaewon-ju/post/d1eae248-2ba0-4b9f-84f4-d1397e3da900/image.png)



<br>

---

<br>

## ✏️ Swapping
Real Memory System을 사용하려면, DRAM에 프로세스의 모든 정보(코드, 데이터, 힙, 스택)이 저장되어야 한다.
하지만, DRAM은 비싸다.
∴ HDD에 프로세스를 적재하는 방법을 사용하자.

>#### Swapping
: 운영 체제가 메모리에 로드된 프로세스를 일시적으로 보조 기억 장치로 이동시키는 것
HDD의 일부분을 SWAP영역으로 잡는다.

프로세스 A,B,C가 HDD의 SWAP 영역에서 실행중이다.

1. A가 I/O interrupt로 인해서 block된다.
2. A의 수행 이미지를 적고 SWAP 영역에서 쫒아낸다. (Swap Out)
3. 그 위치에 D를 넣는다. (Swap In)

<br>

동적으로 메모리가 커질 때도 Swapping을 사용한다.

ex) 500-1000 주소 공간을 사용중인 프로세스 A의 크기가 동적으로 커진다.
➜ A가 더 커지고 싶은데 1500번지부터는 B가 사용중이다.
➜ B를 쫒아낸다. (Swap out)



<br>

---

<br>

## ✏️ Overlay
DRAM보다 큰 프로세스는 적재될 수 없다.
➜ 프로세스의 코드 데이터 힙 스택은 분리될 수 없기 때문이다.

<span style = "background-color: lightgreen; color:black">하지만, Overlay를 사용하면 메모리보다 더 큰 프로세스를 적재할 수 있다.</span>

>Overlay는 프로세스를 모듈 단위로 쪼개서, 메모리 공간이 부족하면 이미 메로리에 존재하는 모듈 위에 새로운 모듈을 적재하는 방법이다.

<br>

ex) Program P를 실행한다.

- P는 모듈1(Function A)을 호출한다.
   - 모듈1은 P의 메모리 위에 적재된다.
- P는 모듈2(Function B)를 호출한다.
   - 메모리에 공간이 없는 경우, 모듈1에 Overlay한다.
   
>모듈2가 필요한 코드와 데이터가 이미 메모리에 로드된 모듈1 위에 덧붙여져서 실행된다.
따라서 메모리의 일부가 모듈1의 코드와 데이터를 가리키고 있으며, 그 위에 모듈2의 코드와 데이터가 추가된다. 
이런 식으로 Overlay를 사용하여 메모리에 여유 공간이 없는 상황에서도 프로세스를 실행할 수 있다.


<br>

---

<br>



## ✏️ Bitmap
>메모리 관리를 위해 각각의 메모리 단위마다 Bitmap이 존재한다.

ex)메모리 단위가 1KB
- 1KB마다 비트가 1개씩 존재한다. (1이면 사용중, 0이면 비어 있음)
- 메모리가 너무 크면 linkedlist를 사용해서 나타낸다.<br>
[ Process | 0 | 5 ] -> [ Hole | 5 | 3 ] -> [ Process | 8 | 6 ] -> ...
0부터 5개는 사용중, 5부터 3개는 빈 공간, 8부터 6개는 사용중 ...


<br>

---

<br>




## REFERENCE
📚 Modern Operating Systems, Third Edition - Andrew S. Tanenbaum