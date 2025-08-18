---
title: "[git] Actions "
description: "github Actions를 활용한 CI/CD"
date: 2024-07-28T10:10:56.644Z
tags: ["git"]
slug: "git-Actions"
velogSync:
  lastSyncedAt: 2025-08-18T06:18:45.953Z
  hash: "2ec6462e3e3e8263a9baca5045deaf4364aa252e6d459a23477f830ced5769bc"
---

CI/CD란?
CI/CD는 소프트웨어 개발 프로세스를 자동화하여 코드 변경 사항을 지속적으로 통합(Continuous Integration, CI)하고, 이를 자동으로 테스트하고 배포(Continuous Deployment, CD)하는 방법론입니다.

GitHub의 CI/CD 도구: GitHub Actions
GitHub Actions는 GitHub에서 제공하는 CI/CD 도구입니다. 이를 사용하면 코드 리포지토리에서 직접 빌드, 테스트, 배포 파이프라인을 설정할 수 있습니다. GitHub Actions는 YAML 파일을 사용하여 워크플로우를 정의하고, 특정 이벤트(예: 코드 푸시, 풀 리퀘스트 등)가 발생할 때 이를 트리거하여 실행합니다.


error 발생
```
Run docker-compose exec -T api ./gradlew test
  
Downloading https://services.gradle.org/distributions/gradle-8.8-bin.zip
.............10%.
Error: Process completed with exit code 137.
```
오류 코드 137은 일반적으로 프로세스가 메모리(RAM)를 다 사용한 경우 발생

따라서, 작업을 3파트로 구분하여 다시 작성했다.

<br>

### 1. backend-build
이 작업은 백엔드 애플리케이션을 빌드합니다.

```yml
jobs:
  backend-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
```
- 실행 환경: ubuntu-latest
- 리포지토리 체크아웃:
actions/checkout@v2 액션을 사용하여 리포지토리를 클론합니다.

<br>

```yml
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: "21"
          distribution: "temurin"
```
- JDK 설정: 
actions/setup-java@v2 액션을 사용하여 Temurin 배포판의 JDK 21을 설정합니다.

<br>

```yml
      - name: Cache Gradle packages
        uses: actions/cache@v2
        with:
          path: ~/.gradle/caches
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-
```
- Gradle 패키지 캐시:
actions/cache@v2 액션을 사용하여 Gradle 패키지를 캐시하여 이후 빌드를 빠르게 합니다.

<br>

```yml
      - name: Cache Gradle wrapper
        uses: actions/cache@v2
        with:
          path: ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-wrapper-${{ hashFiles('**/gradle/wrapper/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-wrapper-
```
- Gradle 래퍼 캐시:
actions/cache@v2 액션을 사용하여 Gradle 래퍼 파일을 캐시합니다.

<br>

```yml
      - name: Make application-prod.yml
        if: contains(github.ref, 'main')
        run: |
          cd ./backend/src/main/resources
          touch ./application-prod.yml
          echo "${{ secrets.YML_PROD }}" > ./application-prod.yml
        shell: bash
```
- application-prod.yml 생성:
backend/src/main/resources 디렉터리에 application-prod.yml 파일을 생성하고 YML_PROD 시크릿의 내용을 파일에 씁니다.

<br>

```yml
      - name: Build the project
        working-directory: backend
        run: ./gradlew build --no-daemon
```

- 프로젝트 빌드:
backend 디렉터리에서 Gradle 빌드 명령(./gradlew build --no-daemon)을 실행합니다.

<br>

---

<br>

### 2. backend-test
이 작업은 백엔드 애플리케이션의 테스트를 실행합니다.

의존 작업: backend-build (이 작업은 backend-build가 성공적으로 완료된 후에만 실행됩니다)

<br>

```yml
      - name: Run Tests
        working-directory: backend
        run: ./gradlew test --no-daemon
```  
- 테스트 실행:
backend 디렉터리에서 Gradle 테스트 명령(./gradlew test --no-daemon)을 실행합니다.

<br>

---

<br>

### 3. backend-deploy
이 작업은 Docker Compose를 사용하여 백엔드 애플리케이션을 배포합니다.

의존 작업: backend-test (이 작업은 backend-test가 성공적으로 완료된 후에만 실행됩니다)

<br>

```yml
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
```
- Docker Buildx 설정:
docker/setup-buildx-action@v2 액션을 사용하여 Docker Buildx를 설정합니다. Buildx는 멀티 아키텍처 Docker 이미지를 빌드하는 도구입니다.

<br>

```yml
      - name: Build and run Docker Compose
        working-directory: backend
        run: |
          docker-compose up --build -d
```
- Docker Compose 빌드 및 실행:
backend 디렉터리로 이동하여 docker-compose up --build -d 명령을 실행하여 애플리케이션을 빌드하고 백그라운드 모드로 실행합니다.

<br>

```yml
      - name: Tear down Docker Compose
        working-directory: backend
        run: docker-compose down
```

- Docker Compose 중지:
배포 후 docker-compose down 명령을 실행하여 컨테이너, 네트워크 및 볼륨을 중지하고 제거합니다.

<br>

---

<br>

### 전문
```yml
on:
  push:
    branches:
      - main

jobs:
  backend-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: "21"
          distribution: "temurin"
          
      - name: Cache Gradle packages
        uses: actions/cache@v2
        with:
          path: ~/.gradle/caches
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Cache Gradle wrapper
        uses: actions/cache@v2
        with:
          path: ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-wrapper-${{ hashFiles('**/gradle/wrapper/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-wrapper-
          
      - name: Make application-prod.yml
        if: contains(github.ref, 'main')
        run: |
          cd ./backend/src/main/resources
          touch ./application-prod.yml
          echo "${{ secrets.YML_PROD }}" > ./application-prod.yml
        shell: bash

      - name: Build the project
        working-directory: backend
        run: ./gradlew build --no-daemon
        
  backend-test:
    runs-on: ubuntu-latest
    needs: backend-build
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: "21"
          distribution: "temurin"
          
      - name: Cache Gradle packages
        uses: actions/cache@v2
        with:
          path: ~/.gradle/caches
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Cache Gradle wrapper
        uses: actions/cache@v2
        with:
          path: ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-wrapper-${{ hashFiles('**/gradle/wrapper/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-wrapper-
      
      - name: Run Tests
        working-directory: backend
        run: ./gradlew test --no-daemon
        
  backend-deploy:
    runs-on: ubuntu-latest
    needs: backend-test
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build and run Docker Compose
        working-directory: backend
        run: |
          docker-compose up --build -d

      - name: Tear down Docker Compose
        working-directory: backend
        run: docker-compose down
```
