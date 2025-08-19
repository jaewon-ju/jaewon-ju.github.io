---
title: "[TroubleShooting] EC2가 터지는 오류, Github Secret 오류"
description: "EC2 인스턴스가 멈취버리는 오류와 Github Secrets 인식 오류"
date: 2024-11-26T14:09:34.006Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-EC2가-터지는-오류-Github-Secret-오류"
categories: TroubleShooting
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T11:38:59.942Z
  hash: "f3a0093b19c36bc3eeb566b6491687200d8124d892a6e6973dcef3f8f2bbaa26"
---

플랑크톤 해커톤을 진행하던 중에 발생한 두 오류에 대해서 설명하고자 한다.

---

### 1. EC2 인스턴스가 터지는 오류

>Github Action을 통해서 자동 배포를 설정해두었다.
그런데 자동 배포를 할 때마다 EC2 인스턴스가 멈춰버리는 현상이 발생했다.

<br>

<원인>
원인은 단순히 __RAM 용량 부족__이었다.
프리티어에서 제공하는 인스턴스는 RAM 용량이 매우 작다..

<br>

<해결>
EC2 인스턴스의 SWAP 공간을 늘려주었다.

>1. SWAP 파일 생성
`sudo dd if=/dev/zero of=/swapfile bs=128M count=16`
<br>
2. 스왑 파일의 읽기 및 쓰기 권한을 업데이트
`sudo chmod 600 /swapfile`
<br>
3.    Linux 스왑 영역을 설정.
`sudo mkswap /swapfile`
<br>
4.    스왑 공간에 스왑 파일을 추가하여 스왑 파일을 즉시 사용할 수 있도록 함.
`sudo swapon /swapfile`
<br>
5.    절차가 성공적으로 완료되었는지 확인.
`sudo swapon -s`
<br>
6.    부팅 시 /etc/fstab 파일을 편집하여 스왑 파일을 시작.
`sudo vi /etc/fstab` 후 다음 새 줄을 추가 `/swapfile swap swap defaults 0 0`


<br>

---

<br>

### 2. GitHub secrets에 넣은 yml 파일의 일부가 누락되는 오류
> 자동 배포를 위해 Github Secrets에 `application-prod.yml` 파일을 넣어두었다.
그런데 이 파일을 제대로 인식하지 못하는 오류가 발생했다.


<원인>
`{$}` 형식을 인식하지 못해서 발생하는 오류였다.

- `${...}` 형식의 변수 참조는 Spring에서 환경 변수를 설정할 때 유용하게 사용된다.
- 하지만 GitHub Secrets에서는 해당 형식을 인식하지 않으며, 환경 변수 값을 직접 입력해야 한다.
<br>

<해결>
`${...}` 형식 대신, 필요한 값을 직접 GitHub Secrets에 입력하였다.






