---
title: "[JAVA] java.lang 패키지"
description: "자바의 lang 패키지에 관한 스터디 메모"
date: 2024-01-22T14:48:44.316Z
tags: ["Java"]
slug: "JAVA-java.lang-패키지"
velogSync:
  lastSyncedAt: 2025-08-18T06:08:52.776Z
  hash: "f6546fb64a9565bee6bf22e181ceadc6854bc609d5b9404eca2151b8b09aaa0a"
---

>java.lang 패키지는 자바의 기본적인 클래스를 담고 있는 패키지이다.

java.lang 패키지에 있는 클래스는 import 없이 사용할 수 있다.
java.lang 패키지에 속하는 주요 클래스는 다음과 같다.

| 클래스 |	용도 |
| - | - |
|Object| 자바 클래스의 최상위 클래스로 사용
|System| 표준 입력 장치로부터 데이터를 입력받을때 사용 - 표준 출력 장치로 출력하기 위해 사용
|Class|	클래스를 메모리로 로딩할때 사용
|String| 문자열을 저장하고 여러 가지 정보를 얻을 때 사용
|StringBuffer, StringBuilder|문자열을 저장하고 내부 문자열을 조작할 때 사용
|Wrapper| 기본 타입의 데이터를 갖는 객체를 만들때 사용
|Math | 수학 함수를 이용할 때 사용

---

## ✏️ Object 클래스
> Object는 자바의 최상위 부모 클래스이다.

- 모든 클래스는 Object 클래스의 자식 또는 자손 클래스이다.
- extends 키워드로 상속하지 않아도 자동적으로 java.lang.Object 클래스를 상속한다.

<br>

### ■ Object 클래스의 메소드
<br>

#### 1. equals()
```java
public boolean equals(Object obj){ }
```

- equals() 메소드의 매개변수는 Object 타입이다. 즉 다형성에 의해 모든 객체가 저장될 수 있다.
- Object 클래스의 equals() 메소드는 비교 연산자인 == 과 동일한 결과를 리턴한다.
<br>

> #### 동일성 VS 동등성
동일성은 두 객체가 완전히 같다는 것을 의미한다.
동등성은 두 객체가 갖고 있는 정보가 같은 것을 의미한다.
<br>
Object 클래스의 equals() 메소드와 비교 연산자 == 은 객체의 <span style = "color:red">"동일성"</span>을 판단한다.
즉, 두 객체가 완전히 같은지를 판단하여 true/false로 리턴한다.
<br>
반면에 String 클래스의 equals() 메소드는 객체의 <span style = "color:red">"동등성"</span>을 판단한다.
즉, 두 객체가 저장하고 있는 데이터가 같은지를 판단하여 true/false로 리턴한다.

String 클래스는 Object 클래스의 equals() 메소드를 오버라이딩하여 동등성을 판단한다.
```java
String s1 = new String("hello");
String s2 = new String("hello");

System.out.println(s1 == s2); // false. 동일성 판단
System.out.println(s1.equals(s2)); // true. 동등성 판단
```
<br>

동등성을 판단하는 equals() 메소드를 직접 만들어보자.

```java
public class Member{
	// Object 클래스를 자동 상속
    // 문자열을 저장하는 객체의 동등성 비교
    
	public String id;
    
    public Member(String id){
    	this.id = id;
    }
    
    @Override
    public boolean equals(Object obj){
    	if(obj instanceof Member){
        	Member member = (Member) obj; // 강제 형 변환
            
            if(obj.id == member.id)	return true; // 객체의 타입도 같고 값도 같은 경우 동등
        } else {
        	return false;
        }
    }
}
```
하지만, 동등성을 판단할 때 equals 메소드만을 사용하는 것은 아니다.
hashcode 메소드의 리턴 값까지 일치해야 비로소 두 객체가 동등하다고 할 수 있다.
<br>

---


 2학년 2학기 때 자료구조 시간에 배웠던 해시 테이블에 대해서 되짚어보자.
해시 테이블은 key, value 형태로 데이터를 저장한다.
해시 함수를 이용하여 key 값에 대응되는 고유한 식별 값인 해시 값을 만들고, 그것을 버킷에 저장한다.
하지만, 해시 테이블의 크기는 한정적이기 때문에 충돌이 발생할 수 있다.


#### 2. hashcode()
>hashcode() 메소드는, 객체의 메모리 번지를 key 값으로 사용하여 해시 값을 만들고 리턴한다.

하지만, hashcode() 메소드의 결과 값이 같아도 다른 객체일 수 있다. 충돌이 발생할 수 있기 때문이다. 따라서 equals() 메소드로 한번 더 값을 검사해야 한다.

자바의 동등성 판단 과정: ![](https://velog.velcdn.com/images/jaewon-ju/post/9dfe00db-c199-4c64-ba23-eef5e4aa131c/image.png)

따라서, equals() 메소드를 재정의 할 때는 hashcode()도 재정의 해야 한다.

```java
public class Member{
	// Object 클래스를 자동 상속
    // 문자열을 저장하는 객체의 동등성 비교
    
	public String id;
    
    public Member(String id){
    	this.id = id;
    }
    
    @Override
    public boolean equals(Object obj){
    	...
    }
    
    @Override
    public int hashcode(){
    	return number;
    }
}
```

<br>

#### equals()만 재정의한 경우:
```java
Set<Member> member = new HashSet<>();

member.add(new Member("Java"));
member.add(new Member("Java"));

/* 
중복이라서 저장되면 안됨. 
HashSet은 hashCode() 리턴값 검사 후 equals()의 리턴값을 검사함.
하지만, hashCode()가 재정의 되어 있지 않음.
hashCode()의 리턴값이 다르므로 다른 객체로 판단함.
중복임에도 불구하고 저장됨
false positive

따라서 hashCode()도 Override 해줘야 함.
*/
```

<br>

#### hashCode()만 재정의한 경우:
```java
Set<Member> member = new HashSet<>();

member.add(new Member("1"));
member.add(new Member("hello"));

/* 
중복이 아니므로 저장되어야 함
HashSet은 hashCode() 리턴값 검사 후 equals()의 리턴값을 검사함.

만약, 1과 Hello의 hashCode가 같은데 hashCode()만 Override한 경우?
hashCode() 결과 값이 같으니 equals() 판단으로 넘어감.
equals()를 재정의 하지 않았으니, == 로 객체의 참조 비교.
객체의 hashCode() 결과가 같으니 == 결과가 true.
동등객체로 판단하여 저장되지 않음
false negative

따라서, equals()도 Override 해줘야 함.
*/
```


따라서, 동등성 비교를 위해서 equals()와 hashcode()는 같이 재정의 되어야 한다.

<br>

---
#### 3. toString()
> toString() 메소드는 객체를 문자열로 표현한 "문자 정보"를 리턴한다.

- Object 클래스의 toString() 메소드는 '클래스이름@16진수해시코드'를 리턴한다.
- toString() 메소드는 주로 재정의 되어 사용됨

```java
public class SmartPhone{
	private String company;
    private String os;
    
    public SmartPhone(String company, String os){
    	this.company = company;
        this.os = os;
    }
    
    // Object 클래스의 toString() 메소드 오버라이딩
    @Override
    public String toString(){
    	return company + ", " + os;
    }
}
```
```java
public class Execute{
	public static void main(String[] args){
    	SmartPhone myPhone = new SmartPhone("Google, Android");
        
        String s = myPhone.toString();
        System.out.println(s); // Google, Android 출력
    }
}
```
<br>
System.out.println()의 인수로 객체를 주면, 객체의 toString 메소드를 호출하여 리턴 값을 출력한다.

```java
System.out.println(myPhone); // Google, Android 출력
```
<br>

---

## ✏️ System 클래스
자바 프로그램은 운영체제에서 바로 실행되는 것이 아니라 JVM 위에서 실행됨
➜ 운영체제의 모든 기능을 직접 이용하기는 어렵다.
> System 클래스를 사용하면 운영체제의 일부 기능을 이용할 수 있다.

- System 클래스의 모든 필드와 메소드는 <span style = "background-color: skyblue; color:black">static으로 선언되어 있다.</span>

<br>

### ■ System 클래스의 메소드
| 메소드 | 매개변수 | 기능 |
| - | - | - |
| exit | int 종료상태값 | 현재 프로세스를 강제 종료 (정상 종료인 경우 인수 0) |
| currentTimeMillis | X | 현재 시간을 long 타입의 밀리세컨드 단위로 반환 |
| nanoTime() | X | 현재 시간을 long 타입의 나도세컨드 단위로 반환 |



<br>

---
## ✏️ Class 클래스
> Class 클래스는 메타 데이터를 관리한다.

- 메타 데이터란 클래스와 인터페이스의 이름, 생성자 정보, 필드 정보, 메소드 정보를 뜻한다.
- Class 객체를 통해 메타 데이터에 접근할 수 있다.
<br>

### ■ Class 객체 얻기
```java
1. Class clazz = 클래스이름.class;
2. Class clazz = Class.forName("패키지...클래스이름");
3. Class clazz = 참조변수.getClass();


ex)
Class clazz = String.class;
Class clazz = Class.forName("java.lang.String");

String str = "ju";
Class clazz = str.getClass();
```

### ■ 클래스의 메타 데이터 접근하기
```java
Class clazz = Member.class;

System.out.println(clazz.getName()); // 패키지.클래스이름 출력
System.out.println(clazz.getSimpleName()); // 클래스이름 출력
```
<br>

---

## ✏️ String 클래스
내용이 많아서 다음 포스팅으로~
https://velog.io/@jaewon-ju/JAVA-String-%ED%81%B4%EB%9E%98%EC%8A%A4
<br>

---

## ✏️ Wrapper 클래스
>Wrapper 클래스는 기본형 데이터를 객체로 다루기 위해서 사용하는 클래스이다.

- Wrapper 객체는 기본형 데이터를 내부에 저장한다.
- Wrapper 객체 안에 있는 기본형 데이터는 <span style = "color:red">외부에서 변경할 수 없다.</span>
<br>

### ■ Wrapper 클래스의 종류

| Wrapper 클래스 | 저장하는 데이터의 타입 |
| - | - |
| Byte | byte |
| Character | char |
| Short | short |
| Integer | int |
| Long | long |
| Float | float |
| Double | double |
| Boolean | boolean |

<br>

### ■ Boxing/Unboxing
> Boxing이란, 기본형 데이터를 Wrapper 객체로 만드는 과정을 뜻한다.
Unboxing이란, Wrapper 객체에서 기본형 데이터를 얻어내는 과정을 뜻한다.

Boxing:
```java
1. 생성자 사용
Byte obj = new Byte(10); // 10을 객체로 저장
Integer obj = new Integer(100); // 100을 객체로 저장
Double obj = new Double(4.5); // 4.5를 객체로 저장

2. valueof() 사용
Byte obj = Byte.valueof(10);
```

Unboxing:
```java
기본형Value() 메소드 이용
num = obj.byteValue(); // 10 저장
```
<br>

### ■ 자동 Boxing/Unboxing
- Wrapper 타입 변수에 기본값 대입 --> 자동 Boxing
- 기본형 데이터에 Wrapper 객체 대입 --> 자동 Unboxing

```java
자동 Boxing:
Integer num = 100;

자동 UnBoxing:
Integer obj = new Integer(100);
int num = obj;
```
<br>

### ■ 문자열 to 기본형
Wrapper 클래스를 사용하여, 주어진 문자열을 원하는 자료형으로 바꿀 수 있다.

><center>변수 = Wrapper클래스.parse + Wrapper클래스<br>ex) num = Byte.parseByte("10")</center>

<br>

### ■ equals() 메소드
Wrapper 클래스의 equals() 메소드는, String 클래스와 마찬가지로 Object 클래스의 메소드를 재정의 했다.
Wrapper 클래스의 equals() 메소드는 객체가 저장하는 값을 비교한다.

<br>

---

## ✏️ Math 클래스
> Math 클래스는 수학 계산에 사용할 수 있는 메소드를 제공한다.

- Math 클래스의 메소드는 모두 <span style = "color:red">static 메소드이다.</span>

| 리턴 타입 | 메소드 | 매개변수 타입| 기능 |
| - | - | - | - |
| int/double| abs | int/double | 절대값 반환 | 
| double | ceil  | double | 올림값 반환  |
| double | floor | double | 내림값 반환 |
| int | max,min | int, int | 두 정수 중 최대값/최소값 반환 |
| double | max,min | double, double | 두 실수 중 최대값/최소값 반환 |
| double | random | X | 0 이상 1 미만의 임의의 실수 반환  |
| double | rint | double | 매개변수와 가장 가까운 정수의 실수값 반환 |
| long | round | double | 반올림값을 long 타입으로 반환 |


