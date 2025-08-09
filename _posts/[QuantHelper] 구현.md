---
title: "[QuantHelper] 구현"
description: "멀티 에이전트를 사용해서 주식 어플리케이션을 구현해보자"
date: 2024-08-14T14:53:31.753Z
tags: ["Multi-Agent","프로젝트"]
slug: "quantHelper-구현"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:32.967Z
  hash: "47c9f079a217624a012dbe78c161fba4a1ec4b0e9d45f8dcf2bef05c40b7a518"
---

## ✏️ 구현
- 각 Agent는 Assistant API로 구현한다.
- Conversation Pattern은 Group Chat 으로 설정한다.

<br>

### ■ Assistant API in Autogen
Autogen에서 Assistant API Agent를 생성하는 방법을 알아보자.
W/Function Calling

다음과 같은 과정을 진행한다.

1. Function 정의
2. Function을 Schema로 서술
3. 해당 Schema를 assistant_config의 내부에 삽입
4. GPTAssistantAgent 생성
   - ```assistant_config``` 파라미터에 3번에서 생성한 assistant_config를 대입
5. 해당 Agent에 Function을 등록

```python
from autogen.function_utils import get_function_schema
from spring_api_functions import call_news

# 1번 과정 - Function 정의
def getNews(query: str) -> dict:
    '''
    retrieves query and search news with query
    param:
    query (string) : The query to search for news
    return:
    Union[str, dict]: A dictionary with news details
    '''
    response = call_news(query)
    return {
        "query": query,
        "news": response,
    }
# ===========================================================================
```
```python
# 2번 과정 - Schema 서술
api_schema = {
    "name" : "getNews",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to search for news",
            },
        },
        "required": ["query"],
    },
    "description": "This is an API endpoint allowing users to input query and search news",
}
# ===========================================================================
```
```python
# 3번 과정 - assistant_config 생성
assistant_config = {
    "tools": [
        {
            "type": "function",
            "function": api_schema,
        }
    ],
}
# ===========================================================================
```
```python
def main():
    llm_config = {
        "config_list": [{"model": "gpt-4o", "api_key": os.environ.get("OPENAI_API_KEY")}]
    }

    # 4번 과정 - GPTAssistantAgent 생성
    # 뉴스를 검색해서 받아오는 Spring API를 호출
    news_agent = GPTAssistantAgent(
        name="news_agent",
        llm_config={
            "config_list": [{"model": "gpt-4o", "api_key": os.environ.get("OPENAI_API_KEY")}],
        },
        assistant_config=assistant_config,
        instructions="you are a assistant which retrieves query and search news with query. Use function to retrieve news information." +
                     "if you call getNews function, you can get json object which includes the result of searching." +
                     "analyze news titles and figure out that status for stock is positive or negative"
    )
	# ===========================================================================
 ```
 ```python
    # 5번 과정 - Agent에 Function 등록
    news_agent.register_function(
        function_map={
            "getNews" : getNews,
        }
    )
	# ===========================================================================
```

<br>

news agent와 대화를 실행하면, 함수를 잘 호출하는 것을 볼 수 있다.
![](https://velog.velcdn.com/images/jaewon-ju/post/7fd62fe0-706b-42c6-aa12-de87acca725f/image.png)

<br>

### ■ Conversation Structure
대화 구조를 구현해보자.

어려운 점: 질문이 너무 다양함.
어떤 경우는 news만 호출해도 되고, 어떤 경우는 news, stock까지 다 봐야함. 

#### Version 1
![](https://velog.velcdn.com/images/jaewon-ju/post/2003be22-526a-44fe-a1a8-d4896e06cd10/image.png)

[ user_proxy_agent ->  prompt agent]
: 사용자의 질문을 토대로 프롬프트를 생성

[ user_proxy_agent -> manager_agent]
: 프롬프트를 전달

[group chat]
: Input으로 받은 프롬프트를 쪼개서 알맞은 Agent에게 해당 프롬프트를 전송해야한다.

<span style = "color:red">⚠️</span> 문제 - 프롬프트 3개를 어떻게 news, stock, fs agent에게 따로 전달할것인가?


<br>

#### Version 2
![](https://velog.velcdn.com/images/jaewon-ju/post/10c3fb87-723c-4d13-a3b8-192f60c13a67/image.png)
prompt agent를 Group Chat 내부에 두고, prompt agent가 프롬프트를 1개씩 생성하도록 변경했다.

<span style = "color:red">⚠️</span> 문제 - 다시 prompt agent로 돌아온다는 보장이 없음.

<br>

#### Version 3
![](https://velog.velcdn.com/images/jaewon-ju/post/f6b39c2c-867e-474b-882d-c118311d1e3d/image.png)

Version 1의 문제는 "chat manager의 프롬프트 분배"였다.
사용자가 질문을 하면 그 질문에 답하기 위한 프롬프트를 여러개 생성한다.
그리고 생성된 프롬프트를 각 에이전트에게 전달해야 한다.

예를 들어, 사용자가 ```"삼성전자 주가가 고평가 되었다고 생각해?"``` 라고 묻는다면 

1. "삼성전자"를 키워드로 뉴스를 검색해줘
2. "삼성전자"의 현재 주가를 알려줘
3. "삼성전자"의 PER 값을 알려줘

이런식으로 3개의 프롬프트를 생성하고 각각 news, stock, financial statement agent에게 전달해야한다.

하지만 group chat manager는 위와 같이 프롬프트를 분배해서 전달하는 능력은 가지고 있지 않다. manager는 단지 다음 그룹 챗의 순서를 정해줄 뿐이다. 프롬프트를 분배하지 않고 한꺼번에 전달하면 AI 응답의 품질이 떨어지거나 순서가 뒤죽박죽이 되는 등 예상하지 못한 문제가 발생한다.

따라서 위와 같은 구조를 고안했다.

- 하나의 agent(analysis agent)에 한꺼번에 여러개의 프롬프트를 전달한다.
- 해당 agent는 function call로 하위 agent들과 소통할 수 있다.
function call을 할 때, 매개변수로 프롬프트를 넣어주면 된다.

이렇게 하면 한꺼번에 프롬프트를 전달해도 agent가 프롬프트를 알맞게 분배할 수 있다.

각각의 agent들과 소통한 후에는 rule check를 진행한다.
사용자가 설정한 rule에 맞게 분석이 진행되었는지 확인하고, 분석 결과가 사용자의 rule에 저촉된다면 다시 analysis agent에게 분석을 의뢰한다.

rule checking까지 완료되면 conclusion agent를 호출해서 사용자에게 응답할 결론을 생성한다.

<br>

## 실험
각 구조의 성능을 비교하기 위해서 실험을 진행한다.
실험의 평가 기준은 다음과 같다.

1. Agent의 순서가 원하는 대로 동작하는지
2. 동일한 질문을 날렸을 때 결과물 비교

발행한 주식의 총 수 API 추가
```PER = 시가총액/당기순이익 = (시가총액/주식수) / (당기순이익/주식수) = 주가 / EPS```

현재 데이터: 유동자산, 비유동자산, 자산총계, 유동부채, 비유동부채, 부채총계, 자본금, 이익잉여금, 자본총계, 매출액, 영업이익, 법인세차감전 순이익, 당기순이익, 주식 수, 주당 배당금

- ```ROE = (당기순이익/자본총계) * 100```
- ```부채비율 = (부채총계/자본총계) * 100```
- ```유동비율 = (유동자산/유동부채) * 100```


<br>

### 결론
Version 2에서 각 프롬프트에게 호출 제한을 거는 구조.
News, Stock, FS Agent는 Prompt Agent만 호출할 수 있다.