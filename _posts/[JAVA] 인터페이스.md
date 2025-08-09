---
title: "[JAVA] 인터페이스"
description: "자바의 인터페이스에 관한 스터디 메모"
date: 2024-01-18T14:28:11.212Z
tags: ["Java"]
slug: "JAVA-인터페이스"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:35.823Z
  hash: "0132e69aac0779c9a286763cd3f584c1727127d00b432e780245d34bccfd1f4e"
---

## ✏️ 인터페이스란?
> 인터페이스란 객체의 사용 방법을 정의한 자료형이다.

인터페이스는 해당 인터페이스를 구현한 클래스가 특정 동작을 하도록 <span style = "background-color: #0B3B39">강제</span>한다.
<br>
### 인터페이스의 의의
협업을 하는 경우에서 한 명은 TV 클래스를 작성하고 다른 한명은 실행 클래스를 작성한다고 해보자. TV 클래스가 작성이 끝날 때까지, 실행 클래스를 작성하는 사람은 아무것도 하지못한다.
왜? 그냥 막 작성하다가는 메소드의 매개변수, 필드 이름 등이 TV클래스의 그것과 다를 수 있기 때문이다.

인터페이스는 이런 상황을 타파하도록 도와준다. 

예를 들어, RemoteControl이란 인터페이스가 존재한다고 하자.
RemoteControl을 구현한(implement) TV 클래스는, 반드시 RemoteControl 인터페이스에서 선언한 메소드를 구현해야한다.
실행 클래스를 구현하는 개발자는 RemoteControl 인터페이스에 적혀있는대로 메소드를 사용하면서 코드를 작성해나갈 수 있다.

<br>

### 인터페이스의 특징
- 인터페이스는 .java 형태의 소스 파일로 작성된다.
- 인터페이스는 interface 키워드로 선언한다.
- 인터페이스는 <span style = "background-color: #0B3B39">상수 필드와 추상 메소드</span>만을 구성 멤버로 가진다. 
- <span style = "color: red">인터페이스는 객체로 생성할 수 없다.</span> 따라서, 생성자를 가질 수 없다.

---
<br>

## ✏️ 상수 필드와 추상 메소드

앞서 설명했듯이, 인터페이스는 상수 필드와 추상 메소드만을 구성 멤버로 가진다.


**인터페이스의 상수 필드와 추상 메소드는 다음과 같은 특성을 갖는다.**

> 1. 인터페이스에서 선언된 필드는 모두 public static final의 특성을 갖는다.
--> 따라서, public static final을 생략하더라도 컴파일 과정에서 자동으로 붙는다. <br><br>
2. 인터페이스에서 선언된 추상 메소드는 모두 public abstract의 특성을 갖는다.
--> 따라서, public abstract를 생략하더라도 컴파일 과정에서 자동으로 붙는다.

```java
public interface RemoteControl{
	public static final int MAX_VOLUME = 10;
    // public int MAX_VOLUME = 10; 과 동일하다.
    
    public abstract void turnOn();
    // public void turnOn(); 과 동일하다.
    
    public abstract void setVolume(int volume);
	// public void setVolume(int volume); 과 동일하다.
}
```

---
<br>

## ✏️ 구현 클래스
> 인터페이스를 구현(implement)한 클래스를 구현 클래스라고 한다.

- 구현 클래스는 반드시 추상 메소드의 실체 메소드를 작성해야 한다.
- 구현 클래스는 여러 인터페이스를 implements할 수 있다.
- 여러 인터페이스를 inplements 한 경우, 모든 추상 메소드의 실체 메소드를 작성해야 한다.

```java
// RemoteControl을 구현한 클래스 TV
public class TV implements RemoteControl{
	private int volume;
    
    @Override
    public void turnOn(){
    	System.out.println("TV ON");
    }
    
    @Override
    public void setVolume(int volume){
    	if(volume > RemoteControl.MAX_VOLUME){
        	this.volume = RemoteControl.MAX_VOLUME;
        } else {
        	this.volume = volume;
        }
    }
}
```
```java
// RemoteControl을 구현한 클래스 Audio
public class Audio implements RemoteControl{
	private int volume;
    
    @Override
    public void turnOn(){
    	System.out.println("Audio ON");
    }
    
    @Override
    public void setVolume(int volume){
    	if(volume > RemoteControl.MAX_VOLUME){
        	this.volume = RemoteControl.MAX_VOLUME;
        } else {
        	this.volume = volume;
        }
    }
}
```

구현 클래스를 작성했으면, new 연산자로 구현 객체를 생성할 수 있다.
```java
TV tv = new TV();
```
하지만 위의 코드는 <span style = "color: red">인터페이스를 사용한 것이 아니다.</span>
인터페이스를 사용하려면, 인터페이스 자료형 변수에 구현 객체를 대입해야 한다.

```java
RemoteControl rc 
rc = new TV();
rc = new Audio();
```

인터페이스 변수를 사용하면, 해당 인터페이스를 구현한 모든 클래스의 인스턴스를 참조할 수 있다. 
--> 다형성

---

<br>

## ✏️ 타입 변환과 다형성
이전 포스팅 https://velog.io/@jaewon-ju/JAVA-%EC%83%81%EC%86%8D 에서 설명했듯이, 다형성은 하나의 사용법으로 다양한 실행결과가 나오도록하는 성질이다.

인터페이스의 다형성은 구현 객체를 교체함으로서 실현된다.

### 1. 자동 형 변환
- <span style = "background-color: #0B3B39">구현객체 --> 인터페이스 변수</span>로의 형 변환은 자동적으로 발생한다.

```java
RemoteControl rc = new TV();
```
---
<br>

### 2. 필드의 다형성
Room이라는 클래스는 TV 객체 2개를 필드로 가지고 있다.

```java
public class Room{
	RemoteControl rc1 = new TV();
    RemoteControl rc2 = new TV();
    
    void turn(){
    	rc1.turnOn();
        rc2.turnOn();
    }
}
```
Room 객체를 사용하다보니, 리모콘 하나를 TV 말고 Audio를 조작하도록 만들고 싶어졌다.
rc2가 Audio의 구현 객체를 참조하게 함으로써, 간단하게 위의 문제를 해결할 수 있다.

```java
public class ExecuteClass(){
	public static void main(String[] args){
    	Room myRoom = new Room();
		
        myRoom.turn();
        
        myRoom.rc2 = new Audio();
        myRoom.turn(); // 결과가 달라짐
    }
}
```

이것이 바로 필드의 다형성이다.

---
<br>

### 3. 매개 변수의 다형성
매개변수의 타입을 인터페이스로 하고, 인수로 구현 객체를 주면 자동으로 형 변환된다.
```java
public class PowerOn(){
	public void PowerOn(RemoteControl rc){
    	rc.turnOn();
    }
}

// new TV(), new Audio()
// 둘 중 어떤 객체를 인수로 보내는지에 따라서 결과가 달라진다.
```

---
<br>

### 4. 강제 형 변환
구현 객체가 인터페이스 자료형으로 자동 형 변환되면, <span style = "color: red"> 인터페이스에 선언된 메소드만 사용 가능하다.</span>

다시 구현 객체의 모든 메소드에 접근하고 싶다면 강제 형 변환이 필요하다.
```java
RemoteControl rc = new TV();
TV television = (TV) rc;
```

---
<br>

## ✏️ 인터페이스의 상속
인터페이스도 다른 인터페이스를 상속할 수 있다.
인터페이스는 클래스와는 달리 다중 상속을 허한다.

```java
public class InterfaceA{
	public int methodA();
}

public class InterfaceB{
	public int methodB();
}

public class InterfaceC extends InterfaceA, InterfaceB{
	public int methodC();
}
```
MyClass가 InterfaceC의 구현 클래스이다.
MyClass는 A,B,C의 모든 추상 클래스를 구현해야 한다.
```java
public class MyClass implements InterfaceC{
	// A,B,C 의 추상 클래스를 모두 구현해야 한다.
    
    public int methodA(){
    	System.out.println("A");
    }
    
    public int methodB(){
    	System.out.println("B");
    }
    
    public int methodC(){
    	System.out.println("C");
    }
}
```
실행 클래스 ExecuteClass
```java
public class ExecuteClass{
	public static void main(String[] args){
    	MyClass mine = new MyClass();
        
        InterfaceA ia = mine; // 구현 객체 mine을 InterfaceA로 형 변환
        // ia는 methodA만 사용 가능
        
        interfaceC ic = mine;
        // ic는 methodA, B, C 사용 가능
    }
}
```
---
<br>

## ✏️ 인터페이스 VS 추상클래스
인터페이스와 추상클래스를 모두 학습하고, 이러한 의문점이 들었다.
> 인터페이스와 추상클래스 모두 메소드의 재정의를 강제하는 도구인데, 두개가 뭐가 다른거지??

### 인터페이스, 추상클래스의 공통점:
1. 메소드의 재정의를 강제하는 추상 메소드를 멤버로 가짐
2. 객체로 생성 불가능 


### 인터페이스, 추상클래스의 차이점:
| 차이점 | 추상클래스 | 인터페이스 |
| - | - | - |
| 목적 | 상속을 통한 기능의 확장 | 동일한 기능의 강제 |
| 메소드 | 일반 메소드, 추상 메소드 모두 선언 가능 | 추상 메소드만 선언 가능|
| 필드 | 일반 클래스와 동일 | 상수만 사용 가능 |
| 다중 상속 | 불가능 | 가능 |

---
<br>

## REFERENCE
혼자 공부하는 자바
