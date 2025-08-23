---
title: "[코딩테스트] Backtracking"
description: "파이썬으로 백트래킹 & 투포인터를 구현하는 방법"
date: 2025-08-17T13:42:44.287Z
tags: ["코딩테스트"]
slug: "코딩테스트-Backtracking"
categories: 코딩테스트
toc: true
velogSync:
  lastSyncedAt: 2025-08-23T01:16:47.538Z
  hash: "11b757155f4d0535ef93018642ce6b49eacf818dd5a1f25baf89a93ec4900531"
---

이 시리즈의 목표는, 코딩테스트에서 자주 사용되는 핵심 문법들을 템플릿 형태로 정리하고, 이를 빠르게 외워서 실전 문제에 바로 적용할 수 있도록 만드는 것이다.

## ✏️ 백트래킹 (Backtracking)

### ■ 핵심 개념
모든 경우의 수를 탐색하는 과정에서, 해답이 될 수 없는 경우는 더 이상 탐색하지 않고 되돌아가는 방법.
DFS를 기반으로 하며, 가지치기를 통해 탐색 효율을 높임.

<br>

### ■ 템플릿 요약

1. 현재 노드를 탐색
2. 조건 충족 시 다음 단계 DFS 재귀 호출
3. 조건 불충족 또는 끝까지 탐색 시 이전 단계로 되돌아감

<br>

### ■ 구현 템플릿

```py
def backtrack(depth, path):
    # 종료 조건
    if depth == 목표_깊이 or 조건_만족:
        결과 처리()
        return

    for 다음_선택 in 가능한_선택지:
        path.append(다음_선택)
		dfs(depth+1, path)
        path.pop()  # 백트래킹 (되돌리기)
```


<br>

dfs를 활용한 예시

```py
def backtrack(node, graph, visited):
    # 종료 조건
    if (종료조건):
        return
    
    for next in graph[node]:
        if visited[next] == 0:
            visited[next] = 1       # 방문 처리
            backtrack(next, graph, visited)
            visited[next] = 0       # 방문 해제 (rollback)
```


<br>

---

<br>

## ✏️ 투 포인터 (Two Pointers)

### ■ 핵심 개념
하나의 배열에서 두 개의 인덱스를 움직여 조건을 만족하는 구간을 찾는 기법.


<br>

### ■ 템플릿 요약

1. 오른쪽 포인터로 확장
2. 조건 위반 시 왼쪽 포인터로 축소
3. 정답 갱신


<br>

### ■ 구현 템플릿

```py
def two_pointers(arr):
	n = len(arr)
    left = 0
    state = {} # 윈도우 상태관리
    
    # 1. 윈도우 자동 확장
    for right in range(n):
        
        # 2. 조건 위반 시 왼쪽 축소
        while 조건위반():
        	left += 1
        
        # 3. 정답 갱신
        answer = max(answer, right - left)
```

<br>

예시: 서로 다른 문자 종류가 최대 K개인 부분문자열의 최대 길이를 구하라.

```py
from collections import defaultdict

N = len(string) # 주어진 문자열 길이

freq = defaultdict(int)
left = 0
maximum = 0

for right, element in enumerate(N):
	freq[element] += 1
    
    while(len(freq) > K):
    	freq[string[left]] -= 1
        left += 1
  	
    maximum = max(maximum, right - left + 1)
```
