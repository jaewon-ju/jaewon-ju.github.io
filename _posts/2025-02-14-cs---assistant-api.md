---
title: "[CS 지식] Assistant API"
description: "OpenAi의 Assistant API에 대해서"
date: 2025-02-14T06:40:13.632Z
tags: ["CS지식"]
slug: "CS-지식-Assistant-API"
thumbnail: "https://velog.velcdn.com/images/jaewon-ju/post/e84e75c7-fc85-46a9-bfbc-2eff246bf02f/image.png"
velogSync:
  lastSyncedAt: 2025-08-19T08:36:49.953Z
  hash: "1da3daf9e7cbb7db9da8262f130f15c801fcc2dfc07bbe5c4dc7cc2978149ca8"
---

해커톤, 팀 프로젝트 등에서 Assistant API를 자주 사용했다.

하지만, Assistant API를 사용할 때마다 기능이나 작동 방식을 까먹어서 글로 정리해두려 한다.

<br>

---

<br>

## ✏️ Assistant API란?

OpenAI 공식 문서나 다른 개발 사이트에서는 Assistant API를 어렵게 설명하고 있으나, 쉽게 말하면 

>**일반 채팅 API의 업그레이드 버전**이다.  

- **문맥 이해 가능**  
- **도구(tool) 사용 가능**  
- **instruction 적용 가능** (예: "You are a helpful assistant that answers programming questions")

이 API는 사용자의 데이터를 기억하거나, 특정 작업을 호출하고, 사전 정의된 instruction을 활용할 수 있기 때문에, AI 챗봇을 애플리케이션에 통합하려는 개발자에게 매우 유용하다.

<br>

---

<br>

## ✏️ Assistant API의 차별점
Assistant API는 크게 세 가지 특징을 가지고 있다.

### 1. 문맥 이해 가능

기존 AI Chat API는 사용자가 이전에 했던 대화를 기억하지 못한다. 
>예를 들어, 사용자가 “이제부터 한국어로 대답해”라고 말하면, AI는 “알겠습니다.”라고 답하지만, 이후 대화에서 또 영어로 대답할 것이다.

하지만, Assistant API는 **스레드(Thread)** 기능을 사용한다.  
**Thread**는 어시스턴트와 사용자 간의 대화 세션을 의미하며, 메시지를 저장한다.
따라서, 이전 대화 내용을 기억하고 문맥을 이해한 후 응답할 수 있다.

<br>

### 2. 도구 사용 가능

Assistant API는 다음과 같은 도구들을 지원하여 다양한 작업을 처리할 수 있다:

- **File Search**: 파일을 검색하고 처리하는 내장 RAG 도구  
- **Code Interpreter**: Python 코드를 작성하고 실행하며, 다양한 데이터와 파일을 처리  
- **Function Calling**: 사용자 정의 함수를 사용하여 애플리케이션과 상호작용

<br>

### 3. instruction 작성 가능

Assistant를 생성할 때 **instruction**을 미리 작성하여 AI의 성격이나 행동을 정의할 수 있다. 
예를 들어, "You are a helpful assistant that answers programming questions"와 같은 instruction을 설정하여, AI가 특정 역할을 수행하도록 할 수 있다.

<br>

---

<br>

## ✏️ 사용 방법

Assistant API를 사용하여 AI의 응답을 받기 위해서는 다음과 같은 절차를 거쳐야 한다.
>
1. Create Assistant
2. Create Thread
3. Create Message
4. Create Run
5. Get Message From Thread


![](https://velog.velcdn.com/images/jaewon-ju/post/e84e75c7-fc85-46a9-bfbc-2eff246bf02f/image.png)


<br>

### 1. **어시스턴트 생성**

AI 어시스턴트를 생성하기 위해서는 먼저 어시스턴트를 정의하고, 이를 통해 사용자와 상호작용할 수 있는 환경을 마련해야 한다.

### 2. **스레드 생성**

스레드는 어시스턴트와 사용자 간의 대화를 기록하고 관리하는 단위이다. 스레드를 생성하면, 이후 대화에서 이전의 메시지를 기억하고 문맥을 이해할 수 있다.

### 3. **메시지 생성**

메시지는 스레드에 추가되는 대화의 단위이다. 사용자의 질문이나 어시스턴트의 응답을 메시지로 추가하며, 이를 통해 대화가 지속된다.

### 4. **런 생성**

런(Run)은 스레드에서 어시스턴트를 호출하는 과정이다. 런을 생성하면, 어시스턴트가 주어진 작업을 실행하고 결과를 반환한다. 예를 들어, 함수 호출이나 특정 작업을 처리할 수 있다.

### 5. **메시지 조회**

메시지 조회는 스레드 내에서 이전의 대화 기록을 확인하는 과정이다. 이를 통해 어시스턴트는 사용자의 이전 입력을 기반으로 응답을 생성할 수 있다.


<br>

자세한 사용 예제는 OpenAi 공식 문서 참고
https://platform.openai.com/docs/api-reference

<br>

---

<br>

## ✏️ Assistant API W/Streaming



