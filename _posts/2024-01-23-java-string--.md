---
title: "[JAVA] String 클래스"
description: "자바의 String 클래스에 관한 스터디 메모"
date: 2024-01-23T06:39:00.938Z
tags: ["Java"]
slug: "JAVA-String-클래스"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:56.291Z
  hash: "1fd6ddea040d701eeb2782dc3e31b2e6114606e1badd67db2f09e2c94e5f86c1"
---

## ✏️ String 클래스
> String 클래스는 Object 클래스를 상속하는 클래스로, 자바의 문자열은 String 클래스의 인스턴스로 관리된다.

<br>

---

## ✏️ String 생성자

- 문자열 리터럴은 String 객체로 자동 생성된다.
- 매개변수의 타입에 따라 사용하는 String 클래스의 생성자가 달라진다.

```java
// 1. 매개변수: byte 배열 --> 해당 bytes 배열을 문자열로 디코딩하여 저장함
String str = new String(byte[] bytes);

// 매개변수: byte 배열, 문자열 --> 해당 bytes 배열을 지정한 문자셋(ex. UTF-8)으로 디코딩
String str = new String(byte[] bytes, String charsetName);

// 그 외에도 offset과 length를 지정해서 원하는만큼만 문자열로 디코딩하는 방법도 있음
String str = new String(byte[] bytes, int offset, int length);
```

<br>

다음 예제는 키보드로부터 읽은 바이트 배열을 문자열로 변환하는 코드이다.
```java
public class KeyboardToString{
	public static void main(String[] args){
    	byte[] bytes = new byte[100]; // 배열 생성
        
        int readByte = System.in.read(bytes) // 키보드로부터 읽어서 bytes 배열에 저장. readByte는 읽은 바이트 수
        
        String str = new String(bytes, 0, readByte-2);
        // readByte에서 2를 뺀 이유는, 엔터를 눌렀을 때 캐리지리턴(/r)+ 라인피드(/n)가 입력되기 때문이다.
        System.out.println(str); 
    }
}
```

<br>

---

## ✏️ String 메소드

### ■ charAt
**리턴 타입:** char
**메소드 이름:** charAt
**매개변수 타입:** int
**기능:** 특정 위치의 문자를 리턴한다.
```java
기본형: char 참조변수.charAt(int index)
```
```java
String subject = "java";
char charValue = subject.charAt(3); // a 리턴
```
<br>

### ■ equals
**리턴 타입:** boolean
**메소드 이름:** equals
**매개변수 타입:** Object
**기능:** 두 객체가 저장하는 문자열을 비교하여, 같으면 true 다르면 false를 리턴한다.
```java
기본형: boolean 참조변수.equals(Object object)
```
```java
String str1 = "java";
String str2 = "hello";
boolean result = str1.equals(str2); // false 리턴
```
<br>

### ■ getBytes
**리턴 타입:** byte[]
**메소드 이름:** getBytes
**매개변수 타입:** 없음
**기능:** 문자열을 바이트 배열로 변환(인코딩)
```java
기본형: byte[] 참조변수.getBytes()
```
```java
String subject = "java";
byte[] bytes = subject.getBytes(); // 기본 문자셋으로 인코딩하여 반환
//byte[] bytes = subject.getBytes(UTF-8); // UTF-8로 인코딩하여 반환
```
<br>


### ■ indexOf
**리턴 타입:** int
**메소드 이름:** indexOf
**매개변수 타입:** String
**기능:** 객체의 문자열 내에서 매개변수 문자열의 인덱스를 찾아서 반환한다.
<span style = "color:red">찾는 문자열이 없으면 -1을 반환한다.</span>
```java
기본형: int 참조변수.indexOf(String str)
```
```java
String subject = "java Programming";
int index = subject.indexOf("Programming"); // 5 반환
```
<br>

### ■ length
**리턴 타입:** int
**메소드 이름:** length
**매개변수 타입:** 없음
**기능:** 문자열의 길이 리턴
```java
기본형: int 참조변수.length();
```
```java
String subject = "java";
int length = subject.length(); // 4 리턴
```
<br>

### ■ replace
**리턴 타입:** String
**메소드 이름:** replace
**매개변수 타입:** String, String
**기능:** 첫 번째 매개변수의 문자열을 찾아서 두 번째 매개변수의 문자열로 대치함
```java
String 참조변수.replace(String old, String new);
```
```java
String subject = "java Programming";
String newSub = subject.replace("java","JAVA");
// String 객체의 문자열은 변경이 불가능하다.
// 따라서, replace가 리턴하는 객체는 수정된 String 객체가 아니라 완전히 새로운 객체이다.
```
<br>

### ■ substring
**리턴 타입:** String
**메소드 이름:** substring
**매개변수 타입:** int
**기능:** 문자열을 잘라냄(슬라이싱)
```java
String 참조변수.substring(int index);
```
```java
String subject = "java Programming";
String sliced1 = subject.substring(4); //index 0에서부터 3까지를 새로운 문자열 객체로 리턴함
String sliced2 = subject.substring(5,9); //index 5에서부터 8까지를 새로운 문자열 객체로 리턴함
```

### ■ valueOf
**리턴 타입:** String
**메소드 이름:** valueOf
**매개변수 타입:** 기본형
**기능:** 기본형 값을 문자열로 변환해서 반환함
```java
String String.valueOf(기본형); // static, 즉 정적 메소드이다.
```
```java
String str1 = String.valueOf(10);
String str2 = String.valueOf(10.5);
String str3 = String.valueOf(true);
```

<br>

---

## REFERENCE
혼자 공부하는 자바
