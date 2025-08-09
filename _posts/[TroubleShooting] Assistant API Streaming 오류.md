---
title: "[TroubleShooting] Assistant API Streaming 오류"
description: "Error When Using Assistant API Streaming With Typescript"
date: 2025-02-12T08:18:36.317Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-Assistant-API-Streaming-오류"
series:
  id: 3530ae60-5e2d-416b-9327-13c5e62bf4c7
  name: "TroubleShooting"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:32.064Z
  hash: "72cdf72701e4cac4a51dbcb0811354f6300760844fb34c768da5f99f64bbc43d"
---

TypeScript를 활용하여 Assistant API 호출을 streaming 하는 과정에서 오류가 발생했다.


>#### 오류 메시지
```
Property 'text' does not exist on type 'MessageContentDelta'.
Property 'text' does not exist on type 'ImageFileDeltaBlock'.
```

---

<br>

### ✏️ 오류 발생 코드 
```typescript
export const streamAIResponse = regionalFunctions.https.onRequest(async (req, resp) => {
	...
  
    // OpenAI Thread ID가 없으면 새로 생성
    const threadId = clientThreadId ?? (await openai.beta.threads.create({})).id;

    // 사용자 메시지 생성
    await openai.beta.threads.messages.create(threadId, {
    	role: 'user',
	    content: prompt,
	});

	const stream = await openai.beta.threads.runs.create(
    	threadId,
    	{ assistant_id: assistantId, stream: true }
  	);
	
  	// !!!! 오류 발생 !!!!
  	for await (const event of stream) {
      if(event.event === 'thread.message.delta') {
        console.log(event.data.delta.content[0].text.value)
      } 
    }
  
  ...

);
```

<br>

---

<br>

### ✏️ 원인

> 오류는 `event.data.delta.content[0]`의 타입인 `MessageContentDelta` 타입이 여러 가지 타입 중 하나일 수 있는 **유니언 타입**으로 정의되어 있기 때문에 발생했다. 

```typescript
export type MessageContentDelta =
  | ImageFileDeltaBlock
  | TextDeltaBlock
  | RefusalDeltaBlock
  | ImageURLDeltaBlock;
```

`MessageContentDelta`가 여러 타입 중 하나일 수 있기 때문에, TypeScript는 이 객체가 항상 `TextDeltaBlock`일 것이라고 추론할 수 없다. 각 타입마다 속성이 다를 수 있기 때문이다.

따라서, 아래와 같은 코드에서 문제가 발생한다.

```typescript
for await (const event of stream) {
  if (event.event === 'thread.message.delta') {
    console.log(event.data.delta.content[0].text.value); // 오류 발생
  }
}
```

<br>

---

<br>

### ✏️ 해결 방법: 명시적 타입 캐스팅
가장 간단한 해결책은 특정 타입으로 **명시적으로 캐스팅**하는 것이다.

```typescript
for await (const event of stream) {
  if (event.event === 'thread.message.delta') {
    const delta = event.data.delta.content[0] as TextDeltaBlock;
    console.log(delta.text.value);
  }
}
```
이 방법을 사용하면 TypeScript는 "이 데이터는 `TextDeltaBlock`이다"라고 이해하게 된다. 그러나, 만약 다른 타입의 데이터가 들어온다면 런타임 에러가 발생할 수 있다.


