---
title: "[QuantHelper] 개요"
description: "Multi Agent를 활용한 주식 어플리케이션"
date: 2024-08-13T14:23:05.342Z
tags: ["프로젝트"]
slug: "QuantHelper-개요"
categories: 프로젝트
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:39:00.843Z
  hash: "ab760a73ad014249d592e1a7189155a6f9a7bb937ac5e3add5ac11e19b0490a3"
---

기존의 [ 주식 분석 어플리케이션 ] 프로젝트는 chatGPT의 GPTs를 활용하여 플러그인 형태로 개발했다.
이번 프로젝트는 기존 것을 데스크톱 애플리케이션으로 확장시키고 multi-agent를 추가하려고 한다.

<br>

<br>

## ✏️ What is QuantHelper
QuantHelper는 AI를 통해 주식 데이터를 분석하고 인사이트를 제공하는 주식 분석 시스템이다. Autogen을 이용한 Multi-Agent 구조로, 사용자 질문에 최적화된 결과를 생성한다.

<br>

### 동작 로직 및 에이전트 구성
1. 사용자가 질문을 입력하면, 이 질문은 User Proxy Agent로 전달된다.

2. User Proxy Agent는 질문을 Manager Agent에 넘기고, Manager Agent는 질문을 그룹챗 내에서 관리하며, 필요한 에이전트에게 순서대로 작업을 할당한다.
3. 각 에이전트는 Java Spring 서버의 API를 호출하여 필요한 데이터를 수집하고 분석한다:
   - News Agent는 종목과 관련된 최신 뉴스를 서버 API로부터 가져온다.
   - Stock Agent는 주가, 이동평균선, 시가, 종가 등의 정보를 API를 통해 수집한다.
   - Financial Statement Agent는 PER, ROE 등 재무 관련 정보를 API 호출로 수집한다.
4. 수집한 정보는 그룹챗 내에서 공유되며, Conclusion Agent는 모든 정보를 종합해 사용자에게 전달할 결론을 생성한다.
5. Prompt Agent는 각 에이전트에게 명령 프롬프트를 전달하여 그룹챗이 원활히 진행되도록 한다.


<br>

### 서버 구성
Java Spring 서버는 한국투자증권 오픈 API와 전자공시 시스템을 통해 최신 주가 및 재무 데이터를 수집하며, quantHelper 에이전트들이 이를 활용해 분석 결과를 제공한다.

quantHelper는 에이전트 협업을 통해 종합적이고 유용한 주식 정보를 제공하는 AI 기반 주식 분석 시스템이다.

<br>

---

<br>

## ✏️ Multi-Agent
> #### Multi-Agent System
여러개의 에이전트들이 상호작용하며 작동하는 시스템

- 각 에이전트는 자율적으로 행동한다.
- 각 에이전트는 환경을 인식하고 결정을 내린다.
- 집단적인 목표를 달성할 수도 있고, 서로 경쟁하기도 한다.

```그냥 GPT를 사용하면 되지 않나?``` 라고 생각할수도 있다.
하지만, GPT는 생각보다 멍청하다.
여러가지 작업을 한번에 지정하면, 어떤 작업은 품질이 떨어지기도 하고 아예 수행하지 않는 경우도 있다.
또한, 마음에 드는 결과가 한 번에 나오지 않는 경우가 많다.

예를 들어, 다음과 같은 상황을 생각해보자.

>1. GPT에게 ```서핑을 하는 한국 사람을 그려줘``` 라고 명령한다.
2. 생성된 사진에서 사람의 손가락이 어색한 것을 발견했다.
3. GPT에게 ```손가락이 이상해. 다시 그려줘``` 라고 명령한다.
4. 손가락은 잘 수정되었지만 이전에는 괜찮았던 다른 부분에서 어색한 점이 발견된다.
5. 다시 수정 - 반복

이렇게 반복적인 작업을 해야한다.

하지만, Multi-Agent를 사용한다면 위의 작업을 자동화해서 사용자는 제대로된 결과를 한 번에 얻을 수 있다.

>- Manager Agent - 사진의 평가를 담당하고 사용자에게 최종 결과물을 제출하는 Agent
- Serfing Agent - 서핑하는 사진이 맞는지 판단하는 Agent
- Finger Agent - 사진에서 사람의 손가락이 정확하게 표현되었는지 판단하는 Agent
- Upscale Agent - 사진의 품질을 평가하는 Agent
- Generate Agent - 사진을 생성하는 Agent<br>
Manager Agent는 Generate Agent에게 프롬프트를 보내서 사진을 생성한다.
그 다음 Serfing Agent를 호출해서 평가를 받는다.
평가가 부정적이면, Manager Agent는 프롬프트를 수정해서 다시 Generate Agent를 호출한다.
이런식으로 수정과 평가를 반복한 뒤에 사용자에게 결과물을 제출하면, 보다 고품질의 결과를 얻을 수 있다.

<br>

---

<br>

## ✏️ Autogen


> #### Autogen
Microsoft에서 개발한 도구로, 다양한 언어 모델을 자동화된 방식으로 생성하고 관리할 수 있도록 설계된 시스템이다.

<br>

Autogen을 사용해서 Multi-Agent를 구현하는 방법에 대해서 자세히 알아보자.

### 1. 채팅 종료 방법
- ```initiate_chat``` 에서 파라미터 설정하기
   - ```max_turns``` 파라미터를 설정해서 라운드의 횟수 제한

- Agent를 생성할 때 제한 설정
   - ```max_consecutive_auto_reply```: 자동 응답 횟수를 제한
   - ```is_termination_msg```: 특정 메시지를 받으면 종료

<br>

### 2. 인간의 개입
에이전트가 작업 도중 인간의 피드백을 받은 수 있는 방법
- ```ConversableAgent``` 클래스에서 ```human_input_mode``` 파라미터를 통해 개입 여부 설정 가능
   - NEVER: 차단
   - TERMINATE: 특정 조건에서만 개입
   - ALWAYS: 항상 개입
   
<br>

### 3. 코드 실행기
에이전트는 Python 코드나 셸 스크립트를 실행하고 결과를 반환할 수 있다.
실행기는 로컬 환경 또는 Docker 컨테이너를 사용할 수 있다.

로컬 환경 코드 실행기 생성 방법:
```python
import tempfile

from autogen import ConversableAgent
from autogen.coding import LocalCommandLineCodeExecutor

# 코드 파일을 저장할 temp Directory 생성
temp_dir = tempfile.TemporaryDirectory()

# 로컬 커맨드라인 실행기 생성
executor = LocalCommandLineCodeExecutor(
    timeout=10,  # 10초 타임아웃 설정
    work_dir=temp_dir.name,
)

# 에이전트 생성
code_executor_agent = ConversableAgent(
    "code_executor_agent",
    llm_config=False,  # LLM 사용 안함
    code_execution_config={"executor": executor}, 
    human_input_mode="ALWAYS",
)
```

실행 방법:
```python
message_with_code_block = 
	"""
	This is a message with code block.
	The code block is below:
	```python
	import numpy as np
	import matplotlib.pyplot as plt
	x = np.random.randint(0, 100, 100)
	y = np.random.randint(0, 100, 100)
	plt.scatter(x, y)
	plt.savefig('scatter.png')
	print('Scatter plot saved to scatter.png')
	```
	This is the end of the message.
	"""

reply = code_executor_agent.generate_reply(messages=[{"role": "user", "content": message_with_code_block}])
print(reply)
```

<br>

### 4. Tool
Tool은 Agent가 사용할 수 있는 pre-defined function이다.
웹 서칭, 계산, 파일 Read/Write, 또는 API 호출 등을 수행할 수 있다.

간단한 Tool을 제작하고 등록하는 방법에 대해서 알아보자.
```python
# 계산 Tool
from typing import Annotated, Literal

Operator = Literal["+", "-", "*", "/"]

def calculator(a: int, b: int, operator: Annotated[Operator, "operator"]) -> int:
    if operator == "+":
        return a + b
    elif operator == "-":
        return a - b
    elif operator == "*":
        return a * b
    elif operator == "/":
        return int(a / b)
    else:
        raise ValueError("Invalid operator")
```
```python
# Agent를 생성
import os
from autogen import ConversableAgent

# 사용자와 대화하는 Agent
assistant = ConversableAgent(
    name="Assistant",
    system_message="You are a helpful AI assistant. "
    "You can help with simple calculations. "
    "Return 'TERMINATE' when the task is done.",
    llm_config={"config_list": [{"model": "gpt-4", "api_key": os.environ["OPENAI_API_KEY"]}]},
)

# Tool을 호출하는 Agent
user_proxy = ConversableAgent(
    name="User",
    llm_config=False,
    is_termination_msg=lambda msg: msg.get("content") is not None and "TERMINATE" in msg["content"],
    human_input_mode="NEVER",
)
```
```python
# Tool 등록
register_function(
    calculator,
    caller=assistant,  # The assistant agent can suggest calls to the calculator.
    executor=user_proxy,  # The user proxy agent can execute the calculator calls.
    name="calculator",  # By default, the function name is used as the tool name.
    description="A simple calculator",  # A description of the tool.
)
```
```python
# 대화 시작
user_proxy.initiate_chat(assistant, message="What is (44232 + 13312 / (232 - 32)) * 5?")
```

<br>

### 5. 대화 패턴
Agent 간의 대화 패턴은 3종류가 있다.

1. Two-agent chat: 두 에이전트가 서로 대화하는 가장 간단한 형태의 대화 패턴

2. Sequential chat: 두 에이전트 간의 대화가 일련의 연속된 대화로 연결되며, 이전 대화의 요약이 다음 대화의 맥락으로 전달되는 방식.

3. Group chat: 두 명 이상의 에이전트가 참여하는 단일 대화. 

>그룹 채팅에서 중요한 질문은 "다음에 누가 말을 할 것인가?"이다.
다음 에이전트를 선택하는 전략들:
- round_robin(순환 방식)
- random(랜덤)
- manual(수동 선택, 사람이 선택)
- auto(자동, 기본값, LLM을 사용하여 결정)

<span style = "color:red">⚠️</span> Group chat에는 항상 GroupChatManager가 존재한다.


Group chat에 대해 더 자세히 알아보자.

Group chat manager에게 각 Agent의 Description을 줘서 다음 Agent를 선택하는데 도움을 줄 수 있다.
이 방식은 manager만이 각 Agent의 기능을 알 수 있다.
Group chat을 생성할 때 ```send_introductions=True``` 옴션을 주면 각 Agent가 무슨일을 하는지 서로 알 수 있다.


<br>

### 6. Summarize
```initiate_chat``` 으로 시작된 대화가 종료되면 agent 간의 채팅 내역은 chat summarizer에게 넘어간다.
- summarizer는 채팅 내역을 요약한다.
- summarizer는 채팅의 토큰 사용량을 계산한다.

>채팅의 요약 방법은 2가지가 존재한다.
```initiate_chat``` 메소드의 파라미터로 전달하면 요약 방법을 선택할 수 있다.
<br> 
```python
1. initiate_chat(summary_method = "last_msg")
# 디폴트 값이다. 마지막 채팅 내역을 출력한다.
```
```python
2. initiate_chat(summary_method = "reflection_with_llm")
# llm이 채팅 내역을 요약해서 출력한다.
```


<br>

---

<br>

## 개발
Group chat을 사용
필요한 Agent:

1. Manager Agent - 사용자와 상호작용, LLM, 프롬프트 생성
2. News Agent - 뉴스 분석, LLM, 백엔드 서버와 통신
3. Stock Price Agent - 주식 가격 분석, LLM, 백엔드 서버와 통신
4. Financial Statement Agent - 재무제표 분석, LLM, 백엔드 서버와 통신
5. Rule Agent - 사용자의 주식 거래 패턴을 삽입

<br>

<span style = "color:red">⚠️</span> 각 Agent 들의 답변은 적당한 길이로 만들어야 한다.
➜ 다음 Agent의 Input으로 들어갈 수 있기 때문이다.

<span style = "color:red">⚠️</span> 각 Agent의 분석은 철저해야 한다.

자세한 개발 과정은 다음 포스팅으로~



