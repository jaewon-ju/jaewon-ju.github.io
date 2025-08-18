---
title: "[Application Layer] HTTP - header2"
description: "Cache header와 Conditional Get"
date: 2024-03-13T09:58:36.715Z
tags: ["network"]
slug: "Application-Layer-HTTP-header2"
categories: Network
velogSync:
  lastSyncedAt: 2025-08-18T06:18:47.791Z
  hash: "78204f71095bf0d9b1d451b26f41651d70e3d01ac709438bc1703f607fbc523c"
---

## ✏️ Header - Cache
> Web Cache란 Origin Server에 존재하는 object를 저장하는 저장소이다.

※ 본 포스트는 브라우저 Cache를 Cache라 칭하겠다.

<br>

Cache는 Origin Server에 존재하는 object를 브라우저 내 저장소에 저장한다.
새로고침을 할 때마다 Object를 요청할 필요 없이, 자신의 Cache 저장소에 있는 데이터를 가지고 오면 된다.

> Cache가 없다면?<br>
GET Method로 이미지 파일을 요청한다고 가정해보자.
응답 메시지에서 헤더는 0.1 M 이고, 이미지 파일(본문)은 1 M 이다.<br>
Cache가 없다면, 새로고침을 할 때마다 Origin Server에 파일을 요청해서 1.1M 의 트래픽을 발생시켜야 한다.

>Cache를 사용한다면?<br>
똑같은 방법으로 이미지 파일을 요청한다고 해보자.
하지만, 이번 응답 헤더에는 ```cache-control: max-age=360``` 이라는 필드가 존재한다.
```
HTTP/1.1 200 OK
Content-Type: image/jpg
cache-control: max-age=360
Content-Length: 5720
```
```
slfl2hjefh2e3fkljfe2
```
해당 응답을 받은 브라우저는 이미지 파일을 360초 동안 자신의 웹 브라우저에 저장한다.<br>
다음 요청 때는 자신의 브라우저 저장소에서 이미지를 찾아오면 된다.

- 캐시를 사용하면 네트워크 사용량을 줄일 수 있다.
- 로딩 속도가 매우 빠르다.

<br>

### ■ Cache 만료

Cache의 시간이 만료되면 어떻게 해야할까?

간단하다!
다시 똑같은 메시지로 요청하면 된다.
그러면 Origin Server도 똑같은 응답 메시지를 보내줄 것이다.

```
HTTP/1.1 200 OK
Content-Type: image/jpg
cache-control: max-age=360
Content-Length: 5720

slfl2hjefh2e3fkljfe2
```
- Cache 갱신, 360초간 유지
- 1.1M 의 네트워크 트래픽 발생

<br>

__하지만,__ 이것은 매우 비효율적일 수 있다.
Origin Server에 존재하는 이미지 파일이 __전혀__ 바뀌지 않았다면?<br>
➜ 기존 Cache를 연장해서 그대로 사용하면 네트워크 트래픽이 발생하지 않는다.


<br>

---

<br>


## ✏️ Conditional GET
앞선 문제를 비효율성을 개선하기 위한 방식이 바로 Conditional GET: 조건부 요청이다.

이전의 시나리오를 똑같이 생각해보자.

1. 클라이언트가 이미지 파일을 요청한다.
```
GET /image.jpg HTTP/1.1
Host: juju.com
```
<br>

2. Origin Server는 Cache의 유효 기간 + <span style = "color:red">최종 수정 시간</span>을 응답에 넣어 보낸다. (1.1 M)
```
HTTP/1.1 200 OK
Content-Type: image/jpg
cache-control: max-age=360
Last Modified: 2024-03-13 15:30:00
Content-Length: 5720

slfl2hjefh2e3fkljfe2
```
<br>


3. 클라이언트는 360초동안 Cache를 사용한다.

4. 360초가 지난 뒤에 클라이언트가 Origin Server에게 <span style = "color:red">최종 수정 시간</span> 변동이 있는지 묻는다.

```
GET /image.jpg HTTP/1.1
Host: juju.com
if-modified-since: 2024-03-13 15:30:00
```
<br>

5. 데이터가 수정되지 않았다면, __304 Not Modified__ 응답 메시지를 보낸다. 
추가로, 응답 메시지의 Body가 빈 상태로 보낸다.
```
HTTP/1.1 304 Not Modified
Content-Type: image/jpg
cache-control: max-age=360
Last Modified: 2024-03-13 15:30:00
Content-Length: 5720


```
- 메시지를 받은 클라이언트는 <span style = "background-color: lightgreen; color:black">Cache로 리다이렉트</span> 한다.
- Body가 비었으므로, 헤더만큼의 트래픽만 발생한다.

<br>

6. 변경사항이 없으므로, 클라이언트는 Cache를 360초 연장해서 재사용한다.
<br>

> 5에서 데이터의 수정 사항이 발생하면?
➜  200 OK 와 함께 새로운 데이터 + 최종 수정 시간을 보내준다.
```
HTTP/1.1 200 OK
Content-Type: image/jpg
cache-control: max-age=360
Last Modified: 2024-03-13 20:30:00
Content-Length: 5359
```
```
dfjwbekfneo2ekfn
```

<br>

요청: if-modified-since
응답: Last-Modified

하지만, 위의 두 검증헤더에는 단점이 존재한다.
- 1초 미만 단위로 Cache 조정이 불가능하다.
- A에서 B로 바뀌었다가 다시 A로 바뀐 경우, 데이터는 동일하지만 수정 시간은 업데이트 되기 때문에 Cache가 업데이트 된다.
- 서버에서 별도로 Cache Logic을 관리할 수 없다.

위의 문제점을 해결하는 검증 헤더가 <span style = "background-color: lightgreen; color:black">ETag</span>이다.

<br>

---

<br>

## ✏️ ETag
ETag(Entity Tag)는 검증 헤더의 일종이다.

요청: If-None-Match
응답: ETag

- ETag는 Cache 데이터의 고유한 버전 이름이다.
- 데이터가 변경되면 ETag를 변경한다.
- ETag가 바뀌면 변경, 바뀌지 않으면 변경되지 않은 것이다.


1. 클라이언트가 이미지 파일을 요청한다.
```
GET /image.jpg HTTP/1.1
Host: juju.com
```
<br>

2. Origin Server는 Cache의 유효 기간 + <span style = "color:red">ETag</span>를 응답에 넣어 보낸다. 
```
HTTP/1.1 200 OK
Content-Type: image/jpg
cache-control: max-age=360
ETag: "version1"
Content-Length: 5720

slfl2hjefh2e3fkljfe2
```
<br>


3. 클라이언트는 360초동안 Cache를 사용한다.

4. 360초가 지난 뒤에 클라이언트가 Origin Server에게 <span style = "color:red">ETag</span> 변동이 있는지 묻는다.

```
GET /image.jpg HTTP/1.1
Host: juju.com
If-None-Match: "version1"
```
<br>

5. 데이터가 수정되지 않았다면, 성공(매치되는 것이 없음).
데이터가 수정되었다면 __304 Not Modified__ 응답 메시지를 보낸다. 
추가로, 응답 메시지의 Body가 빈 상태로 보낸다.

```
HTTP/1.1 304 Not Modified
Content-Type: image/jpg
cache-control: max-age=360
ETag: "version1"
Content-Length: 5720


```

<br>

- Cache 제어 로직을 서버에서 관리한다.
ex) 서버를 실험적으로 운영할 때는 ETag를 동일하게 유지, 실제 배포 때 ETag 갱신


<br>

---

<br>

## ✏️ Cache 관련 헤더
```Cache-Control``` 뿐만 아니라, Cache를 제어할 수 있는 여러 헤더들이 존재한다.

<br>

### ■ Cache-Control
```Cache-Control: max-age=360```
➜ 초 단위로 Cache의 유효 기간을 설정한다.

```Cache-Control: no-cache```
➜ 데이터는 캐시해도 되지만, 항상 Origin Server에 검증하고 사용
<span style = "color:red">⚠️</span> 캐시 해도 된다!!! 

```Cache-Control: no-store```
➜ 캐시하면 안됨

<br>


### ■ Pragma
HTTP 1.0 하위 호환을 위한 헤더이다.
HTTP 1.0 만을 지원하는 브라우저가 존재할 때 사용한다.

<br>

### ■ Expires
캐시 만료 시간을 지정한다.
HTTP 1.0 하위 호환을 위한 헤더이다.

```expires: WED, 13 MAR 2024 15:30:00 GMT```


<br>

---

<br>

## ✏️ Proxy Server
> Proxy Server란 Origin Server에 접속하지 않고 Client가 요청한 것을 응답하는 대리 서버이다.

한국에 거주하는 클라이언트 A가 Amazon 서버에 접속한다.
Amazon Origin Server는 미국에 존재하므로, 메시지를 송수신 하는데 시간이 오래 걸린다.<br>
이를 해결하기 위해, Proxy Server 가 존재한다.
Proxy Server는 Origin Server의 데이터를 캐시로 저장해 놓은 서버이다.<br>
한국에 Proxy Server를 두고 Amazon Origin Server의 데이터를 캐시로 저장하면?
➜ 한국에 거주하는 클라이언트들이 빠르게 서비스 이용 가능

<br>

> Proxy Server는 클라이언트이자 서버이다.<br>
Origin Server에 요청하는 클라이언트이자,
Client에게 응답하는 서버이다.


- Proxy Server에 존재하는 Cache는 Public Cache이다.
- ```Cache-Control: max-age``` 대신, ```Cache-Control: s-maxage```를 사용한다.
- ```Age``` 라는 헤더는, Origin Server에서 응답 후 Proxy Server 내에 머문 시간을 초 단위로 제공한다.

<br>

---

<br>


## ✏️ Cache 무효화
주식 데이터 같은 경우는 Cache를 사용해서는 안된다!
Cache를 확실하게 사용하지 못하도록 하려면 어떻게 해야할까?
<br>

```Cache-Control: no-cache, no-store, must-revalidate```
※ ```Pragma: no-cache``` - 하위 호환
3가지 옵션을 모두 사용하면, 클라이언트가 Cache를 저장하지 못하게 확실히 막을 수 있다.

<br>

```must-revalidate``` 은 Cache 만료 후에 최초 조회 시 Origin Server에 반드시 검증해야 하는 옵션이다.

<br>

### no-cache VS must-revalidate
```Cache-Control: no-cache```
➜ 데이터는 캐시해도 되지만, 항상 Origin Server에 검증하고 사용

```Cache-Control: must-revalidate```
➜ 캐시 만료 후 Origin Server에 검증을 받아야 함 + Origin Server 접근 실패시 반드시 오류 발생

> - no-cache의 경우 
클라이언트 A, Proxy Server P, Origin Server O 가 존재한다.<br>
![](https://velog.velcdn.com/images/jaewon-ju/post/4b094076-5988-4766-8b38-23f2b32b2ed9/image.png)
no-cache 옵션만 적용되었을 때는, 데이터를 Origin Server에 검증 받은 뒤 캐시해도 된다.
따라서, 클라이언트 A는 데이터를 P에 요청하고, P는 O의 검증을 받는다.
![](https://velog.velcdn.com/images/jaewon-ju/post/3b61edd0-e077-403e-92bb-d97254a80046/image.png)
갑자기, O와 연결이 끊어졌다.
no-cache 이면 반드시 Origin Server의 검증을 받아야 하지만, O와 통신이 불가능한 상태이다.
이 경우, P는 오류가 나는 것보다는 오래된 데이터라도 보여주는 것을 선택한다.

> - must revalidate의 경우
마찬가지로, O와 연결이 끊어진 상황을 가정해보자.
![](https://velog.velcdn.com/images/jaewon-ju/post/8d942e76-5ca7-4bc7-a01d-1e3ddf68702d/image.png)
must-revalidate 는 Origin Server에 접근할 수 없는 경우, <span style="color:red">반드시 오류</span>가 발생해야 한다.
따라서, 이 경우에는 A에게 ```504 Gateway Timeout``` 이 응답으로 전달된다.

<br>

그런데 한가지 궁금증이 생겼다.
> ```Cache-Control: no-store``` 만으로도 충분하지 않나?

이 궁금증에 대한 답은 <a href= "https://www.inflearn.com/questions/112647/no-store-%EB%A1%9C%EB%8F%84-%EC%B6%A9%EB%B6%84%ED%95%A0-%EA%B2%83-%EA%B0%99%EC%9D%80%EB%8D%B0-no-cache-must-revalidate-%EB%8A%94-%EC%99%9C-%EA%B0%99%EC%9D%B4-%EC%B6%94%EA%B0%80%ED%95%98%EB%8A%94-%EA%B2%83%EC%9D%B8%EA%B0%80%EC%9A%94">여기서</a> 찾을 수 있었다.

요약하자면, ```Cache-Control: no-store```  만으로는 모든 Cache를 무효화 할 수는 없다.
예를 들어, 1월까지는 Cache 저장을 허용하다가, 2월부터 Cache를 저장하지 못하도록 
```Cache-Control: no-store```를 적용했다.

하지만, 이전에 저장된 Cache가 삭제되는 것은 아니다.

<br>

---

<br>

## REFERENCE
<a href = "https://www.inflearn.com/course/http-%EC%9B%B9-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC#reviews">개발자를 위한 HTTP - 김영한 개발자님</a>