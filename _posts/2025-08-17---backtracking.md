---
title: "[코딩테스트] Backtracking, Two Pointers, 최단거리"
description: "백트래킹, 투포인터, 최단거리 알고리즘 정리"
date: 2025-08-17T13:42:44.287Z
tags: ["코딩테스트"]
slug: "코딩테스트-Backtracking"
categories: 코딩테스트
toc: true
velogSync:
  lastSyncedAt: 2025-08-26T01:20:15.546Z
  hash: "3abac56808b9157280c4a21daf330616d37cdf68ab0f29fb43442250e62d7e65"
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

<br>

---

<br>

## ✏️ 최단거리 알고리즘

### ■ 핵심 개념

그래프에서 두 정점 사이의 최소 거리를 구하는 알고리즘. 
다양한 방법이 있으며, 문제의 조건(음수 가중치 여부, 전체 경로 탐색 필요 여부)에 따라 알고리즘이 달라진다.

* **Dijkstra 알고리즘**: 음수 가중치가 없는 경우, 우선순위 큐(힙)을 이용하여 가장 짧은 경로를 탐색.
* **Bellman-Ford 알고리즘**: 음수 가중치가 있어도 사용 가능하며, 음수 사이클 탐지 가능.
* **Floyd-Warshall 알고리즘**: 모든 정점 쌍의 최단거리를 구하는 알고리즘.

<br>

### ■ 템플릿 요약

1. 시작 노드의 거리를 0으로 초기화, 나머지는 무한대(INF)로 설정
2. 최단 거리 후보 중 가장 작은 값을 가진 노드를 선택
3. 선택한 노드를 거쳐가는 경로가 더 짧다면 거리 갱신
4. 모든 노드가 처리될 때까지 반복

<br>

### ■ 구현 템플릿 (Dijkstra)


다익스트라는 <span style="color:red">가장 가까운 노드부터 차례대로 확장</span>해 나가는 방식이다.
- 이때, heapq는 탐색할 후보 노드를 저장한다.

```py
import heapq

def dijkstra(start, graph, n):
    INF = int(1e9)
    distance = [INF] * (n+1)
    distance[start] = 0
    queue = []
    heapq.heappush(queue, (0, start))

    while queue:
        # heap에서 가장 짧은 거리(dist)를 가진 노드(now)를 꺼낸다.
        # heapq는 최소힙이므로, 지금까지 발견된 "가장 가까운 후보"가 나온다.
        dist, now = heapq.heappop(queue)

        # 이미 더 짧은 경로로 방문한 적이 있다면 무시한다.
        if distance[now] < dist:
            continue

        # 현재 노드에 연결된 모든 인접 노드 탐색
        for next, cost in graph[now]:
            # 현재 노드까지의 거리(dist)에다, 간선 비용(cost)을 더한 값
            # 즉, start → ... → now → next 경로의 총 비용
            new_dist = dist + cost

            # 만약 이 경로가 기존에 기록된 next까지의 최단거리보다 짧다면,
            # distance[next]를 갱신하고, 우선순위 큐에 새로운 후보로 추가한다.
            if new_dist < distance[next]:
                distance[next] = new_dist
                # heap에는 "next까지의 최신 최단거리 후보"를 넣는다.
                heapq.heappush(queue, (new_dist, next))

    return distance
```

<br>

Dijkstra 알고리즘은 **음수 가중치가 없는 경우**에 적합하며, BFS와 유사하게 동작하지만 우선순위 큐를 활용해 효율적으로 최단 경로를 찾는다.
