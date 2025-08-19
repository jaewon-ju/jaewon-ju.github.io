---
title: "[코딩테스트] Backtracking"
description: "파이썬으로 백트래킹을 구현하는 방법"
date: 2025-08-17T13:42:44.287Z
tags: ["코딩테스트"]
slug: "코딩테스트-Backtracking"
categories: 코딩테스트
velogSync:
  lastSyncedAt: 2025-08-19T08:36:49.290Z
  hash: "4b629302935adf7b3984f836cca567896c2cbca1bf83a5c7f9c4886b025178c2"
---

이 시리즈의 목표는, 코딩테스트에서 자주 사용되는 핵심 문법들을 템플릿 형태로 정리하고, 이를 빠르게 외워서 실전 문제에 바로 적용할 수 있도록 만드는 것이다.

## ✏️ 백트래킹 (Backtracking)

### ■ 핵심 개념
모든 경우의 수를 탐색하는 과정에서, 해답이 될 수 없는 경우는 더 이상 탐색하지 않고 되돌아가는 방법.
DFS를 기반으로 하며, 가지치기를 통해 탐색 효율을 높임.

<br>

### ■ 한줄 요약


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