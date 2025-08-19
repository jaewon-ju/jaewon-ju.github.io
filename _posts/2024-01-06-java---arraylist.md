---
title: "[JAVA] 배열"
description: "JAVA의 배열에 관한 스터디 메모"
date: 2024-01-06T14:59:04.917Z
tags: ["Java"]
slug: "JAVA-배열과-Arraylist"
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:31.678Z
  hash: "d6b3249d0ced87b040d50e8c44566f2f73064e2056769cce61b023701c24b073"
---

## 1. 배열의 정의
> 배열 (Array)이란 <span style = "color:red">같은 타입</span>의 여러 변수를 하나의 묶음으로 다루는 것이다.
 JAVA의 배열은 <span style = "color:red">객체</span>이다.

## 2. 선언 방법
int형 배열의 선언 방식은 2가지가 있다.
```java
int[] s; // s는 int형 데이터의 주소값을 저장한다.
int s[];
```
자료형[] 이름;
----또는----
자료형 이름[];

위의 과정으로 배열의 <span style = "color:skyblue">참조 변수</span> 공간을 메모리에 할당했다. JAVA에서 참조 변수란, 실제 데이터의 값이 저장되는 것이 아니라 주소가 저장되는 변수이다. 참조 변수를 선언했다고 해서 배열이 생성된 것은 아니다. 실제 배열은 new 연산자를 사용하여 생성한다.

## 3. 배열의 생성
```java
s = new int[10];
```
int 형 변수 10개만큼의 크기가 메모리에 할당되었다. 참조 변수 s는 할당된 메모리의 시작주소를 갖고 있다.

## 4. 배열의 초기화
위의 과정으로 int형 변수의 배열을 생성하면, 모든 요소들은 <span style = "color:red">0으로 초기화 된다.</span> 문자열 배열은 null, boolean 배열은 false로 초기화된다.
0이 아닌 다른 값으로 초기화 하는 방법은 다음과 같다.
```java
int[] s = {10,20,30,40,50}; // 방법 1 - 생성과 동시에 초기화
int[] s = new int[]{10,20,30,40,50}; // 방법 2 - 생성과 동시에 초기화

//방법 3 - 반복문을 사용한 초기화
int[] s;
s = new int[5];
for(int i=0;i<5;i++){
	s[i] = (i+1) * 10;
}
```

## 5. 배열의 사용
배열 각각의 요소는 인덱스 번호로 접근할 수 있다.
```java
String[] members = {"ju","kim","kang"};

//members에는 배열의 시작 주소 값이 저장된다.
//members[i]은 시작 주소에서 각각의 오프셋을 통해 해당 값을 찾아간다.

for(int i=0;i<members.length;i++){
	System.out.println(members[i]+" is selected");
}

```
for-each 문법을 사용하면, for문 보다 쉽게 코드를 짤 수 있다.
```java
for(String e : members){ // e에 배열 요소를 차례대로 담는다.
	System.out.println(e +" is selected");
}
```

## ※ 다차원 배열
다차원 배열이란 2차원 이상의 배열을 의미한다.

자바에서 다차원 배열을 공부하면서, 나는 당연히 자바의 다차원 배열도 C언어와 비슷하게 동작할 것이라고 예상했다(메모리 관리적인 부분에서). 하지만, <span style = "background-color: #0A3B24">실제 메모리를 사용하는 방식이 달랐다.</span>

이 부분에 대해서 더 조사를 하다보니 Java는 포인터를 지원하지 않는다는 것을 알게되었다! Java는 개발자가 메모리에 직접 접근하는 것을 제한한다. 이 부분에 관해서는 다른 포스팅에서 자세히 설명하도록 하고, 이번 포스팅에서는 C언어와 Java에서 2차원 배열을 생성할 때의 차이점을 살펴보자.

> C언어에서 2차원 배열은 다음과 같이 선언 및 생성한다.
```c
int scores[2][3] = {{1,2,3},{4,5,6}};
```
scores는 2차원 배열의 첫번째 배열요소 scores[0]의 주소이다.
C언어에서 배열은 연속적으로 메모리에 할당된다. 
배열의 시작주소를 0x00이라 가정하자. scores는 0x00을 가리키고 scores[1]은 0x0c를 가리킨다.
![](/assets/posts/6c98fdb208b034324be71da7387ff0b0822cfc4e5ee51f06b4b44e02b62837b9.jpeg)
동적할당된 배열이 아니므로, 스택 메모리에 할당된다.

> Java에서 2차원 배열은 다음과 같이 선언 및 생성한다.
```java
int[][] scores = new scores[2][3];
```
위의 코드를 실행하면, 총 <span style = "background-color: #0A3B24">3개의</span> 배열 객체를 생성한다.
![](/assets/posts/5e94912927320dac572993ce5ec1e84e8e799122a1b634e11e6699166d59c6d4.jpeg)
<span style = "color: green">STACK</span> | 배열 변수 scores: 참조 변수로서, 배열 A를 참조한다.
<span style = "color: red">HEAP</span> | 배열 객체 A: scores[0]와 scores[1]를 참조하는 배열. 
<span style = "color: red">HEAP</span> | 배열 객체 B(scores[0]): 길이가 3인 배열  
<span style = "color: red">HEAP</span> | 배열 객체 C(scores[1]): 길이가 3인 배열
<br>
Java에서도 배열은 연속적으로 메모리에 할당된다. 하지만, 직접적인 메모리 주소는 확인할 수 없다. Java는 메모리 관리를 추상화하여 안전성을 높였기 때문이다.
```java
public class Main {
    public static void main(String[] args) {
        int[][] scores = {{1, 2, 3}, {4, 5, 6}};
        // scores 배열의 참조 출력
        System.out.println("Reference of scores array: " + scores);
        // scores[0] 배열의 참조 출력
        System.out.println("Reference of scores[0] array: " + scores[0]);
        // scores[1] 배열의 참조 출력
        System.out.println("Reference of scores[1] array: " + scores[1]);
    	}
    }
```
위의 코드로는 배열의 참조만 확인할 수 있으며, 실제 메모리 주소를 나타내지 않는다.




### 공부를 하다가 생긴 의문점
1. C언어에서, 배열명도 메모리의 공간을 차지하는가? --> 결론: 차지 안함
https://stackoverflow.com/questions/51215235/does-the-array-name-also-takes-a-space-in-memory-in-c

2. Java와 C의 메모리 사용방식 차이 + Java는 왜 포인터를 지원하지 않는가?
https://velog.io/@jaewon-ju/JAVA-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%82%AC%EC%9A%A9-%EC%98%81%EC%97%AD

4. 메모리 주소의 연산이 이해되지 않음.
