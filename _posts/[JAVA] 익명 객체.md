---
title: "[JAVA] 익명 객체"
description: "자바의 익명 객체에 관한 스터디 메모"
date: 2024-01-21T13:12:08.874Z
tags: ["Java"]
slug: "JAVA-익명-객체"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:35.776Z
  hash: "aa726766ce553cb93295d07064c8a3caed218fe4d7c1be7c42663c246c9c891e"
---

## ✏️ 익명 객체
> 익명 객체는 이름이 없는 객체를 뜻한다.

- 익명 객체는 반드시 <span style = "background-color: skyblue; color: black">클래스를 상속한 객체</span>이거나 <span style = "background-color: skyblue; color: black">인터페이스의 구현 객체</span>이어야 한다.
- 자식 클래스를 재사용하지 않고, 한 번만 사용하는 경우 익명 자식 객체를 생성하는 것이 편하다.
- 구현 클래스를 재사용하지 않고, 한 번만 사용하는 경우 익명 구현 객체를 생성하는 것이 편하다.

---
<br>

## ✏️ 익명 자식 객체
```java
부모클래스 변수 = new 부모클래스() { 
	// 필드와 메소드
}

Parent field = new Parent() {
	int childField;
    
    void childMethod(){ }
}
```
익명 자식 객체를 만들 때는, 생성자를 선언할 수 없다.
위의 예시에서 field는 Parent 자료형이고, Parent의 자식 객체를 참조한다.
따라서, field 변수는 부모 객체의 필드와 메소드에만 접근 가능하다.

```java
public class Person{
	void wake(){
    	System.out.print("wake up");
    }
}
```

```java
public class Weekday{
	// person 변수는 익명 객체를 참조한다. 
	Person person = new Person(){
    	void work(){
        	System.out.println("work");
        }
        
        // 부모 클래스인 Person의 wake 메소드를 오버라이드
        @Override
        void wake(){
        	System.out.print("wake up");
            work();
        }
    }
}
```

```java
public class Execute{
	public static void main(String[] args){
    	Weekday weekday = new Weekday();
        
        weekday.person.wake(); // 익명 자식 객체의 wake 메소드 실행
    }
	
}
```
---
<br>

## ✏️ 익명 구현 객체
```java
인터페이스 변수 = new 인터페이스() { 
	// 추상 메소드의 실체 메소드 구현
	// 필드와 메소드
}

RemoteControl rc = new RemoteControl() {
	@Override
    void method(){ }
    
    int field;
}
```
익명 구현 객체에서는, 인터페이스에 선언된 모든 추상 메소드의 실체 메소드를 작성해야 한다.

```java
public class Button{
	// 중첩 인터페이스 OnClickListener
	static interface OnClickListener{
		void onClick(); // 구현 클래스는 반드시 onClick을 구현해야 한다.
	}
    
    OnClickListener listener;
    
    void setOnClickListener(OnClickListener listener){
    	this.listener = listener;
    }
    
    void touch(){
    	listener.onClick();
    }
}
```
```java
public class Window{
	Button btn = new Button();
 	
    // 인터페이스 변수 listener는 익명 구현 객체를 참조한다.
    Button.OnClickListener listener = new Button.OnClickListener() {
    	@Override
        public void onClick(){
        	System.out.println("call");
        }
    }
    
    Window(){
    	btn.setOnClickListener(listener);
    }
}
```
```java
public class Execute{
	public static void main(String[] args){
    	Window w = new Window();
        
        w.btn.touch();
    }
}
```



## REFERENCE
혼자 공부하는 자바
