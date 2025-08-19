---
title: "[OS] Virtual Memory System"
description: "운영체제의 Virtual Memory System에 대해서"
date: 2024-05-07T01:47:33.205Z
tags: ["OS"]
slug: "OS-Virtual-Memory-System"
categories: OS
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:18.085Z
  hash: "7220de5d859122d1e99454da151666fb30b3d6a74fa5c2e15cfd3e693dfb9ecf"
---

## ✏️ Virtual Memory System
Real Memory System은 DRAM의 크기에 너무 의존한다.
메모리를 풍족하게 사용하고 싶어!
➜ Virtual Memory System

>#### Virtual Memory System
: 각 프로세스는 가상의 메모리 주소를 혼자서 사용중이라고 생각한다.

<br>

### ■ Virtual Address Space
각 프로세스는 0 ~ 2^n - 1 bit 만큼의 가상 주소를 가지고 있다.

- 32bit CPU -> 2^32 bit 만큼의 Virtual Address Space
- 64bit CPU -> 2^64 bit 만큼의 Virtual Address Space

### ■ MMU
현재 대부분의 CPU에는 MMU가 존재한다.
MMU(Memory Managment Unit)는 가상 메모리를 구현한 회로이다.

- 가상 주소를 물리 주소로 변환한다.
- 페이지가 물리적 메모리에 존재하지 않을 때 페이지 폴트를 발생시킨다.

<br>

---

<br>

## ✏️ Paging System
> #### Paging
:프로세스를 일정한 크기의 고정된 블록인 페이지(Page)로 나누어 관리하는 방법

<br>

Paging 과정은 다음과 같다.

1. 프로세스의 가상 주소 공간을 0번지부터 동일한 크기의 페이지로 나눈다.
>![](/assets/posts/33885d0dff3bc870fb07e5e5ae9bce9b20ece0ae7c57498958cafb5622ea1ec9.png)
32bit CPU에서, 가상 주소를 표현할 때는 다음과 같은 체계를 사용한다.
상위 20bit -> 페이지 번호, 하위 12bit -> offset
![](/assets/posts/4b6583cbeed484a51826cde5d2ff6e1bf035a1401f1255724ad33fbc3f99157d.png)

2. DRAM도 똑같이 0번지부터 동일한 크기의 페이지로 나눈다.
이를 Frame이라 부른다.
3. Page를 Frame에 매핑한다.

<br>

### ■ 페이징의 특징

- 프로세스 수행 이미지의 일부는 디스크 SWAP 영역에 있고, 나머지는 DRAM에 넣고 실행한다.

- 가상 이미지 안에서는 메모리 주소가 연속적이어야 하지만, DRAM에 연속적으로 매핑할 필요가 없다. 프로그램은 연속적으로 주소 공간을 사용했다고 생각하기 때문이다.
- 페이지 넘버와 프레임 넘버는 다를 수 있지만, Offset은 동일하다.

- 외부 단편화는 없다.
   - 즉, DRAM에 사용하지 못하는 공간이 존재하지 않는다.
- 내부 단편화는 존재한다.
   - 즉, Vitual Address에서 프로세스가 페이지의 공간을 다 쓰지 못하는 상황은 발생할 수 있다.
   ex) 10KB의 프로세스가 4KB의 페이지 3개를 사용할 때, 페이지의 공간이 조금씩 남는 상황
<br>

### ■ Page Table
Paging은 Page Table을 사용해서 구현할 수 있다.
- Page Table은 <span style = "color:red">프로세스마다 하나씩 존재한다!!</span>
- Page Table은 Page ➜ Frame 매핑 정보를 가지고 있다.


><Page Table 사용 예시>
CPU가 프로그램 A를 실행시키려 한다.<br>
1. 가상 메모리의 p번째 Page를 실행.
2. Page Table을 본다 (p번째 page가 f번째 frame에 매핑되어 있음)
3. DRAM에서 f번째 Frame을 찾아간다.
4. f Frame + Offset 위치에 있는 명령을 실행한다.


<br>

#### Page Table의 구조

Table에는 Flag와 frame number가 존재한다.
![](/assets/posts/b2e291b2b3fae374e3614efa837c6f34de0306e43392f0dff310cb42da71fd18.png)

각 flag는 정보를 담고있다.

- valid/invalid bit
: valid bit가 0이면, 해당 페이지가 프레임에 매핑되어 있지 않다는 뜻 (DRAM에 적재 안됨)<br>
이 경우, 프로세스는 스스로 인터럽트를 걸어서 서비스 루틴으로 점프한다.
➜ Page에 매핑될 Frame을 찾아서 Page Table을 수정한다.
<span style = "background-color: lightgreen; color:black">page fault handling</span>이라 부른다.

- dirty bit (modified)
: 이 매핑 정보가 최근에 쓰여졌으면 1

- reference bit
: 주소 변환(Page to Frame)하면 1로 세팅된다.

<br>


> #### Translation Lookaside Buffer
CPU 내부에 존재하는 페이지 테이블의 캐시이다.<br>
- 최근에 사용한 매핑 정보를 CPU에 넣는다.
- 페이지 테이블을 다 CPU에 넣는 것은 너무 오버헤드가 크기 때문에, 일부만 넣는다.
- 문맥교환 발생 시 TLB도 다 리셋되기 때문에 한동안 TLB Miss가 많이 발생한다.<br>
page p의 매핑정보를 찾는경우
➜ TLB에서 찾아.
➜ 없으면 Page Table을 직접 찾아감.
➜ 액세스 한 다음에는 해당 Mapping을 TLB에 저장한다.


>#### Mips CPU의 TLB
32bit virtual address 가 존재할 때, A Page의 코드를 실행하는 과정<br>
1. TLB 조회 - 【 A Page ➜ B Frame 】 
2. A Page가 TLB에 존재하면, B Frame으로 바로 이동 (<span style = "background-color: lightgreen; color:black">TLB Hit</span>)
3. B Frame이 캐시 메모리에 존재하는지 확인
4. 캐시 메모리에 없으면 DRAM에서 조회

<br>

---

<br>

## ✏️ Protection and Sharing
![](/assets/posts/8fc0fede8e55a60f8cc2f80c43d59a85ddda5a935c34b81673daf8b1c334878d.png)

Page Table은 다음 두 비트를 통해 보호 기능을 제공한다.

- protection bit
: 특정 페이지에 대한 접근 권한을 제어(RWX)
- modified bit
: 해당 페이지의 내용이 프로세스에 의해 수정되었는지 여부를 표시

<br>

### ■ Protection bit
> Protection bit는 특정 페이지에 대한 접근 권한을 제어한다.

- Read, Write, Execute 비트가 존재한다.
- CPU가 권한이 없는 동작을 수행하는 경우, OS로 점프한다.

예를들어, CPU가 해당 페이지를 실행하려는데 Execution bit가 꺼져있으면 CPU가 운영체제로 점프해버린다.

<br>

>#### Copy on Write
Copy On Write는 두 개의 프로세스가 하나의 메모리 영역을 공유하는 방식이다.
- 메모리 페이지가 수정되어야 할 필요가 있을 때까지 기존의 메모리 페이지를 공유한다.
- Protection bit의 <span style = "color:red">write 권한</span>을 꺼놓는다.
- 해당 메모리 페이지가 공유되고 있을 때 임의의 쓰기 작업으로 인해 데이터의 무결성이 손상되는 것을 방지한다.


<br>

### ■ Modified bit
> 메인 메모리에 할당된 후에 페이지가 수정되었는지 여부를 나타낸다.

페이지 수정 후 메모리에 write
➜ CPU가 Page Table, TLB의 modified bit를 1로 설정
➜ modified bit가 1이면, 변경이 발생했다는 뜻이므로 해당 페이지를 swap 영역에 저장한다.




<br>

---

<br>

## ✏️ Page Table 사이즈 문제
페이지 테이블의 사이즈가 너무 크다는 문제점이 발생했다.

<해결방법>

1. Multilevel Paging
2. Inverted Page Table

<br>

### ■ Multilevel Paging
페이지를 계층적으로 구조화 한다. 

![](/assets/posts/791c9d648c47b7319b02c4420658a9a31b52f8e9042f99f65dd9d846016c896b.png)

- 상위 10 bits: Top Level Page Table의 index
- 중간 10 bits: Second Level Page Table의 index 
- 하위 12 bits: Offset

![](/assets/posts/3c9c426d8dea76c4a90d3d22e1b971a09466533cb995e8b2b8aa5471be058dcc.png)

<span style = "color:red">⚠️</span> 결과적으로 단일 페이징과 사이즈가 동일하다
> #### 그럼 싱글 페이징보다 무엇이 좋은가?
싱글 페이징의 경우, page table이 모두 실제로 존재해야한다.
사실은 주소공간을 다 쓰지는 않아도, 모두 존재해야한다.<br>
반면에, multilevel paging의 경우 <span style = "background-color: lightgreen; color:black">Top Level은 무조건 존재</span>해야되지만, <span style = "background-color: lightgreen; color:black">Second Level 중 안쓰는 공간은 존재하지 않아도 된다</span>.

- 64bit CPU의 경우 4 level page table을 사용한다.


<br>

### ■ Inverted page table
> Inverted Page Table은 시스템에 <span style = "background-color: lightgreen; color:black">단 한개</span>만 존재한다.

- Inverted Page Table의 엔트리 개수 == 메모리에 존재하는 Frame 수
- Inverted Page Table에는 Process Id(PID)와 Page number가 존재한다.
- Inverted Page Table의 인덱스가 Frame의 위치 정보이다.
- 순차검색이 아니라 hashing을 사용한다.
![](/assets/posts/cb0ccbe9697e9891d19a328ea7f20929f89969159eac53410c2fd7f2ed8483ad.png)

<br>

---

<br>


## ✏️ Virtual Memory Performance
가상 주소 공간의 성능을 알아보자.

- Memory 접근 시간: 100ns
- Disk 접근 시간: 25ms
- Page fault(mapping되지 않은 페이지에 접근)의 발생 확률: p

![](/assets/posts/a4ac35f4101b9dbe937d7fba52a166f616a95909ef2144b4031276789286c8c5.png)

``` Effective Access Time = (1-p) * Memory 접근 시간 + p * Disk 접근 시간```


<br>

---

<br>


## ✏️ Demand Paging
> Demand Paging이란, 프로세스가 실행되는 동안 필요한 페이지만 메모리에 적재하고, 필요하지 않은 페이지는 Swap 영역에 저장하여 메모리를 절약하는 방법이다.

명령어 A를 실행하려는데 valid bit가 0인 경우

➜ Page fault 발생
➜ CPU는 인터럽트를 걸어서 운영체제로 점프
➜ OS가 해당 페이지를 메모리에 적재 후, 페이지 테이블 수정
➜ valid bit = 1
➜ 리턴 후 CPU는 A부터 실행

<br>

위의 인터럽트를 <span style = "background-color: lightgreen; color:black">Page fault Interrupt</span>라 한다.

- 일반 Interrupt가 걸리면 명령어 A를 다 끝낸 다음에 OS로 점프한다.
- 하지만, Page fault Interrupt는 인터럽트가 걸린 시점의 명령어(A)부터 다시 실행한다.

<br>

<br>

---

<br>


## ✏️ Page Replacement Algorithm
새로운 페이지를 메모리에 적재해야 하는데 저장공간이 부족한 경우, 어떤 것을 쫒아낼 것인가?
➜ 다시 사용안될 가능성이 큰 메모리를 쫒아내야 한다.

<br>

| 알고리즘 | 설명 |
| - | - |
| FIFO | 가장 오래전에 <span style = "background-color: lightgreen; color:black">적재된</span> 페이지를 버린다. |
| Second chance | FIFO를 약간 보완한 방식이다.<br>페이지의 reference bit를 사용하여 최근에 사용된 페이지에 "두 번째 기회"를 제공한다. |
| Clock | Second Chance를 원형으로 적용한 알고리즘이다. |
| Optimal Page Replacement(OPT) | 이론적인 모델<br>미래에 가장 오랫동안 사용되지 않을 페이지를 버린다. |
| LRU(Least Recently Used) | 가장 오래전에 <span style = "background-color: lightgreen; color:black">참조된</span> 페이지를 버린다.<br>__제일 많이 사용하는 알고리즘이다.__|
| NRU(Not Recently Used) | 가장 낮은 우선순위의 클래스에서 페이지를 선택하여 버린다. |
| NFU(Not Frequently Used) | Aging 알고리즘과 같이 사용하여 LRU를 근사적으로 구현<br>각 페이지에 대한 참조 횟수를 계산하여 메모리에서 가장 적게 사용된 페이지를 버린다. |

- 성능: OPT > LRU > CLOCK > FIFO 

<br>

### ■ Second Chance
- FIFO를 보완한 알고리즘이다.
- FIFO와 동일하게 큐를 사용한다.
- 쫒아내려는 페이지의 reference bit가 1인 경우, 쫒아내지 않고 reference bit를 0으로 만든 후에 큐의 마지막으로 옮긴다.
- 해당 페이지는 새로 적재된 페이지로 판단한다.

![](/assets/posts/2f47f63bce8c38e8a51654eaecb41742121598cc4352104be4d707d6bfe70846.png)

<br>

### ■ Clock
- Second Chance의 큐를 원형으로 배치시킨다.
- Reference bit가 0이면 쫒아내고, Reference bit가 1이면 0으로 만든 다음 hand를 전진시킨다.

![](/assets/posts/c8df760bbddcd11a8834d1fba4ecfd8130aaf492f5a3d02fae7572922ba85290.png)

<br>

### ■ LRU
- Least Recently Used
- 제일 오래 전에 참조된 페이지를 버린다.
- 스택으로 구현하는 경우
   - 참조되는 페이지를 스택의 제일 위로 올린다. (Most Recently Used)
   - 제일 오래전에 참조된 것은 자연스럽게 스택 제일 아래에 배치된다.
![](/assets/posts/b3f08e99a0f63233f6e126761e9c753968ad6ed8442eab3b5e67fff0867b48dd.png)
<br>
- 행렬로 구현하는 경우
   - 참조되는 페이지의 행을 다 1로 만들고, 열을 다 0으로 만든다.
ex) 0번 페이지가 참조되면 0번 행을 다 1로 만든 다음, 0번 열을 다 0으로 만듦
ex) 1번 페이지가 참조되면 1번 행을 다 1로 만든 다음, 1번 열을 다 0으로 만듦
   - 행을 봤을 때 0이 제일 많은 페이지를 버린다.
![](/assets/posts/6c511f201494cd5f7b677475fa0db4f58aacd7724a5ae88f1f124cc3723c9e26.png)

<br>

하드웨어적으로 LRU를 구하는건 거의 불가능하다.
따라서 approximation을 사용한다.

1. NRU
2. NFU


### ■ NRU
- Not Recently Used
- 우선순위별로 클래스를 만들어서, 우선순위가 작은 클래스에 존재하는 페이지 중 하나를 버린다.
   - class 0. Not Referenced, Not Modified
   - class 1. Not Referenced, Modified
   - class 2. Referenced, Not Modified
   - class 3. Referenced, Modified

- class 0의 페이지부터 쫒아낸다.
  Modified인 경우 SWAP에 적고 쫒아낸다.

<br>

### ■ NFU
- Not Frequently Used
- 시스템 시작 시 모든 페이지의 카운터를 0으로 초기화한다. 페이지가 참조될 때마다 해당 페이지의 카운터가 1씩 증가한다.
- 카운터 값이 가장 낮은 페이지를 버린다.


<br>

>#### Aging 알고리즘
- NFU에 Aging 알고리즘을 더하여 LRU를 approximate 할 수 있다.
- 페이지가 참조될 때마다 카운터의 가장 높은 비트에 1을 설정한다.
- 카운터는 주기적으로 Right Shift 된다.
- 특정 시간에 확인했을 때, 2진수 값이 가장 작은 페이지를 버린다.
![](/assets/posts/713994f28804961b9ca69b8b56b8ad82091a62c746caf0ed147f2cb0f5a67d11.png)
- 참조 시간 + 참조 횟수까지 고려한 방법이다.

<br>

### ■ Working Set 알고리즘
> Working Set이란, 한동안 참조하는 페이지들의 집합이다.

- 어떤 페이지를 사용할지는 알 수 없다. 따라서 과거를 통해 예측한다.
- 【 t ~ 현재 시간 】 사이에 사용된 페이지이면, Working Set으로 판단한다.
- 페이지를 참조하면, Reference Bit를 1로 만든다.

<br>

발생할 수 있는 경우의 수는 3가지 존재한다.

1. 페이지의 reference bit가 1이면, reference bit를 0으로 + Last Time Used를 현재 Virtual Time으로
2. 페이지의 reference bit가 0이고 working set에 소속되어 있지 않다면 버린다.
3. 페이지의 reference bit가 0이고 working set에 소속되어 있다면, 일단 Last Time Used를 기록한다.
   - 모든 페이지가 working set에 소속되어 있는 경우, Last Time Used가 가장 오래된 페이지를 버린다.


<br>

⚠️ Working Set에 소속있다 == Last Time Used 시간이 【 t ~ 현재 시간 】 사이이다.




<br>

---

<br>

## ✏️ Paging System의 issue
Paging System에 존재하는 Issue들에 대해서 알아보자.

1. Local VS Global Page Replace
2. Load Control
3. Page Size
4. Separate Instruction and Data Space
5. Shared Page and Shared Library
6. File Mapping
7. Cleaning Policy
8. Virtual Memory Interface


<br>

### 1. Local VS Global Page Replace

>#### Local Page Replace
프로세스의 페이지를 적재하기 위해서는 <span style = "color:red">해당 프로세스가 참조</span>하고 있던 공간 중에 하나를 버려야 한다.

- Windows 운영체제에서 사용한다.
- 프로세스마다 프레임 할당 개수를 세팅해줘야 한다.
- 프레임을 적게 할당 받으면 Thrasing이 발생할 수 있다.
- 프레임을 많이 할당 받으면 메모리 낭비가 발생할 수 있다.
- 적당한 프레임 개수 할당을 위해 PFF 그래프를 사용한다.
![](/assets/posts/1d4df633e8a8f2c26e2969598209ee3dcf74176ae9380031805cfa680d92da23.png)


<br>

>#### Global Page Replcae
프로세스의 페이지를 적재하기 위해서는 <span style = "color:red">전체 공간</span> 중에 하나를 버려야 한다.

- Linux 운영체제에서 사용한다.
- 프로세스들 간 무한 경쟁이 발생한다. 
➜ Page fault를 많이 내면 공간을 많이 사용할 수 있다.

<br>

### 2. Load Control
>####  Thrashing(외울 것)
Trashing은 연속적으로 Page Fault가 발생하는 상황을 의미한다.

프로세스에게 할당하는 메모리 프레임의 개수가 작은 경우 
➜ 자기의 working set을 다 넣을 수 없음
➜ 모든 프로세스가 계속 page fault 발생


<br>

- Thrashing이 발생하면 시스템이 다운된다.
   - 멀티 프로세싱에서는 최대한 많은 프로세스를 메모리에 적재하려 한다. 
   ➜ CPU utilization 증가
   - 하지만, 한계를 넘어가면 Thrashing이 발생한다.
   ➜ utilization이 급격히 하락
- Thrashing에서 빠져나오기 위해서는 <span style = "background-color: lightgreen; color:black">Swapping</span>을 사용해야 한다.
   - 해당 프로세스의 수행 이미지를 Swap 영역에 적고, 메모리에서 쫒아낸다.
   - 회수한 메모리를 다른 프로세스에게 할당해서 Working set을 다 올릴 수 있게 한다.

이러한 방식으로 Load Control(적재 페이지 조절)을 해야한다.

<br>

### 3. Page Size
- 보통 페이지와 프레임의 크기는 4KB이다.
- 페이지의 크기에 따라서 Overhead가 달라진다.
   - overhead: 쓰지 않고 낭비되는 공간 
- 책의 저자는 아래와 같은 Overhead 공식을 만들었다.

![](/assets/posts/f327765ada7eecf4e24795bfec0e86a598c7987e317996dc763800f7f35e3964.png)

- Overhead가 최소가 되는 페이지 사이즈를 위와 같이 정의했다.

   
<br>

### 4. Separate Instruction and Data Space
Virtual Address Space는 4GB

➜ 너무 작아!
➜ CPU 64bit로 구조를 바꿔야 하는데 오래걸린다. 임시방편 필요 
➜ address space를 Instruction space와 Data Space로 분리하자.

Instruction Space에 4GB 제공, Data Space에도 4GB 제공


<br>

### 5. Shared Page and Shared Library
>#### Shared Page
서로 다른 두 페이지가 하나의 메모리 공간을 공유할 수 있다.<br>
ex) Unix의 Copy On Write 기법
- fork - exec을 사용하여 새로운 프로세스를 만든다.
- 부모 자식이 메모리 공간을 공유한다. (Instruction space)
- Data Space는 메모리를 Write할 때 따로 가지게 한다. (Protection bit의 write bit를 켜줌)

<br>

>#### Shared Library
- 프로세스의 Virtual Address에서는 라이브러리 코드를 작성하지 않는다.
- 메모리에 이미 적재되어 있는 Library 코드를 page에 매핑하여 자신의 코드인 것 처럼 사용한다.
- <span style = "background-color: lightgreen; color:black">Position Independent</span>
프로그램 카운터 + x 이런식으로 사용하기 때문에 어디에 위치해 있던지 잘 동작한다.

<br>

### 6. File Mapping
>#### MMAP(Memory Mapped File) - 외워야 함
파일 자체를 메모리에 매핑해서 Read/Write하는 방식이다.

파일의 데이터를 읽어오려면?
➜ file open, read, close
➜ 더블 버퍼링 발생<br>
가상 메모리에서는 파일 A를 가상 주소 중 빈 공간에 매핑하고, 해당 페이지를 프레임에 매핑한다.
➜ 자기의 코드에 파일이 존재하는 것으로 인식한다.
➜ 포인터만 사용하면 파일 데이터를 읽을 수 있음

<br>

<span style = "color:red">⚠️ </span>파일의 크기는 키울 수 없다는 단점이 존재한다!


<br>

### 7. Cleaning Policy
Page fault가 발생하면, Page Replcement 알고리즘 중 하나를 사용하여 페이지를 쫒아내야 한다.

근데 Page Fault가 발생하고 문제를 해결하려 하면 시간이 오래걸린다.
∴ Cleaning Policy를 사용한다: 미리미리 쫒아내자! 

<br>

- Unix 운영체제에서는 Cleaning Policy로 Two-Handed Clock을 사용한다.
   - one hand clock은 한바퀴 도는데 너무 오랜 시간이 걸린다.
   - reference bit가 다 1이 되어져버리는 문제가 발생
   <br>
- Front hand는 reference bit를 0으로 clear
- 일정시간 동안 프로세스 실행
- back hand는 reference bit가 0인 페이지를 쫒아낸다.
   - reference bit가 1이면 0으로 clear

<span style = "color:red">⚠️ </span>결정권은 back hand에게 존재한다.

<br>

### 8. Virtual Memory Interface

>#### Message Passing
Process A의 내용을 Process B에 Copy 해서 메시지를 전달하는 것은 overhead가 너무 크다.<br>
따라서, B의 한 페이지가 A의 프레임을 가리키게 한다.
➜ A는 매핑을 끊는다.
➜ 그럼 해당 프레임은 B의 것이 된다.
➜ 적은 Overhead로 메시지를 전달할 수 있다.

<br>

>#### Distributed Shared Memory
모든 컴퓨터가 하나의 큰 가상 주소 공간을 공유한다.
- 각 컴퓨터는 네트워크로 연결되어 있다.
- 각 컴퓨터의 DRAM은 큰 가상 주소의 일부를 넣고 실행한다.


<br>

---

<br>

## ✏️ Page Fault Handling
명령어 A를 실행하려는데 valid bit가 0인 경우, 즉 페이지 매핑이 안되어 있는 경우

1. Page fault 발생
2. CPU는 인터럽트(Page fault interrupt)를 걸어서 운영체제로 점프 - Fault를 일으킨 주소는 스택에 저장
3. CPU 내부의 레지스터들도 스택에 저장
4. OS가 SWAP에 존재하는 페이지를 메모리에 적재 후, 페이지 테이블 수정(valid bit = 1)
5. 리턴 후 CPU는 A부터 실행

위와 같은 과정을 <span style = "background-color: lightgreen; color:black">Page Fault Handling</span>라 한다.

- 일반 Interrupt가 걸리면 명령어 A를 다 끝낸 다음에 OS로 점프한다.
- 하지만, Page fault Interrupt는 인터럽트가 걸린 시점의 명령어(A)부터 다시 실행한다.

<br>

---

<br>

## ✏️ Insturction Backup 과 Page Lock

### ■ Instruction Backup
>```MOVE.L #6(A1), 2(A0)```
이 명령어는 몇개의 Fault를 발생시킬까?
- Move 명령을 Patch해야 함
   - 코드가 메모리에 적재 안되어 있으면 fault
- A1을 가져와야 됨
   - A1이 메모리에 적재 안되어 있으면 fault
- A2를 가져와야 됨
   - A2가 메모리에 적재 안되어 있으면 fault
   
만약, 명령어가 2개 페이지에 걸쳐 있으면? - Pantium CPU는 가능하다.
6번 Page fault가 발생할 수 있다.

Page fault는 생각보다 자주 발생한다!
∴ Insturction Backup이 필요하다.
각 명령어 전에 프로그램 카운터를 복사하여, 문제 상황을 빠르게 복구해야 한다.

<br>

### ■ Page Lock
페이지 테이블에는 Lock bit가 존재한다.

- Lock bit는 CPU와 관계없다.
- Lock bit는 OS만 신경쓰는 bit이다.
- Lock bit가 켜져있는 페이지는 절대로 교체하지 않겠다는 뜻이다.


<br>

---

<br>

## ✏️ Backing Store
Mips CPU - 적재가 안된 페이지는 Disk 주소를 가리키게 했음
Pantium CPU - 별개의 Disk Map을 따로 가짐.

<br>

---

<br>

## ✏️ Separation of Policy and Mechanism
> Policy 와 Mechanism은 분리되어야 한다!
Policy는 쉽게 변경되어야 하고, Mechanism은 변경되지 않아야 한다.<br>
- 페이지를 메모리에서 쫒아내는 알고리즘 - policy
- 페이지를 메모리에서 쫒아내는 행위 - Mechanism

Policy는 User Level Space에서 관리하고,
Mechanism은 Low Level MMU에 내장되어 있다.

<br>

### ■ 예시
<a href = "https://velog.io/@jaewon-ju/OS-OS%EC%99%80-Dual-Mode#%E2%96%A0-microkernels">Micro Kernel</a> 운영체제에서는 다음과 같이 Policy 와 Mechanism을 분리했다.

- Micro Kernel 안에 MMU를 넣어둔다.
- Policy는 External Pager에 존재하고, External Pager는 쉽게 교체할 수 있다.
- 사용자 프로세스가 실행하다가 Page fault가 발생하면 Fault Handler를 실행한다.


<br>

---

<br>

## ✏️ Segmentation
> Segmentation은 페이징 방식 이전에 사용했던 가상 메모리를 구현하는 방법이다.


- Code, Data, Stack 등의 <span style = "color:red">논리적 단위</span>를 하나의 Segment라고 생각하자.
   - 페이지는 물리적 단위로 자른 것이고, 세그먼트는 논리적 단위로 자른 것이다.
   - 각 세그먼트의 사이즈는 가변적이다.
   - 각 세그먼트마다 0번지에서부터 주소가 만들어진다.
<br>
- Segmentation은 External Fragmentation이 발생한다.
- Paging에서 각 프로세스의 가상 주소 공간은 1개이지만, Segmentation은 여러개이다.

<br>

### ■ Segmentation With Paging
Segment를 페이지 단위로 쪼개는 혼종이 발생했다.

- Segment를 페이지 단위로 쪼갬
- 마치 multi level page table처럼 동작한다.
- 이 경우, Addressing은 다음과 같은 구조로 되어있다.
   【 segment num, page num, offset 】

<br>

Segmentation With Paging 방식을 실행시키기 위해서는 CPU 안에 STBR(Segment Table Base Register)이 존재 해야 한다.

<br>

### ■ MULTICS
>MULTICS 운영체제에는 현대 컴퓨터에서 필요한 모든 스펙들이 다 담겨 있었고, 그 중에는 Segmentation With Paging 방식도 포함되어 있었다.

- 근데 하드웨어가 따라주질 못했음
- Page fault가 나면, Segment Table -> Page Table 순서로 데이터를 교체한다.
![](/assets/posts/a5b22c7ff974f7a9f0c4bb74037815a5c51edd5d3b6d048d2c05bccdf9443eac.png)
- 34bit를 사용
- CPU에 TLB를 내장했다.

<br>

### ■ Pentium
- selector register를 사용해서 가상 메모리를 구현
- selector로 segment table에 가서 base address + offset으로 linear Address를 가져옴

- Linear Address로 2단계 paging

mode가 4개임
User mode, kernel mode, System call, Shared Libraries

사실 이렇게까지는 필요없어서 User mode, kernel mode만 쓰게 되었음




<br>

---

<br>




## REFERENCE
📚 Modern Operating Systems, Third Edition - Andrew S. Tanenbaum