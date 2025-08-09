---
title: "[Spring Security] JWT (3)"
description: "Refresh 토큰 발급을 통한 보안 강화"
date: 2024-10-13T14:19:48.708Z
tags: ["Spring","spring security"]
slug: "Spring-Security-JWT-3"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:32.385Z
  hash: "95a8bb9998e1a443096d39bfa942c00307fc41b4738898ff621c054cbe8d8669"
---

이전 포스트에서 JWT 단일 토큰을 사용한 인증 방법을 알아보았다.
단일 토큰을 사용하는 것은 위험성이 존재하기 때문에 Access/Refresh Token 두 개의 토큰을 사용하는 것이 좋다.


---

<br>

## ✏️ 보안을 위한 JWT의 진화
회원 CRUD, 게시글/댓글 CRUD 등 권한이 필요한 요청은 서비스에서 자주 발생한다.
클라이언트가 권한이 필요한 요청을 보낼 때마다 JWT는 서버로 전송된다.

해커가 XSS를 사용하거나 HTTP 통신을 가로채서 토큰을 훔칠 수 있기 때문에 탈취되었을 경우를 대비한 로직이 필요하다.

<br>

### ■ refresh 토큰
위의 문제를 대비하기 위해 Access/Refresh 토큰 개념이 등장한다.

> Refresh 토큰은 Access 토큰을 재발급 받기 위한 토큰이다.

- Access 토큰의 생명주기는 짧다. (약 10분)
- Refresh 토큰의 생명주기는 길다. (24시간 이상)

<br>

#### 인증 로직은 다음과 같이 변화한다.

1. 사용자가 로그인 시, Access & Refresh 토큰을 함께 발급한다.
2. 권한이 필요한 모든 요청은 Access 토큰을 사용해서 요청한다.
3. Access 토큰이 만료되면, Refresh 토큰을 사용해서 새로운 Access 토큰을 발급 받는다.

<br>

### ■ Refresh Token Rotate
Access 토큰의 생명주기를 짧게 하고 생명주기가 긴 Refresh 토큰을 도입해서, Access 토큰이 탈취 당했을 때를 대비한다.
>### But! 
Refresh 토큰 자체가 탈취될 위험도 있다!
➜ Refresh 토큰을 가지고 Access 토큰 재발급을 진행할 때, Refresh 토큰도 갱신하여 해결한다.

위의 방식을 <span style = "background-color: lightgreen; color:black">Refresh Token Rotate</span>라 한다.

<br>

### ■ Refresh Token BlackListing
JWT를 발급하면, 서버에는 주도권이 존재하지 않는다.
해당 토큰이 탈취되었더라도 서버가 할 수 있는 것은 생명주기가 끝나길 기다리는 것 뿐이다.

위 문제의 해결법은 Refresh Token을 트래킹 하는것이다.


- 로그아웃을 진행하거나 탈취에 의해 피해가 진행되는 경우, 서버측 저장소에서 해당 토큰을 삭제하는 방법

- 이를 <span style = "background-color: lightgreen; color:black">Refresh Token BlackListing</span>이라 한다.

<br>

---

<br>

## ✏️ 구현
이전 포스팅에서 JWT를 구현하는 방법을 알아보았다.
해당 코드에 Refresh 토큰 관련 로직을 추가하려면 다음과 같은 사항들을 변경/추가해야 한다.

> #### 변경 사항
1. 로그인 성공 시, Access & Refresh 토큰을 응답하도록 변경
   - `LoginFilter` 클래스의 `successfulAuthentication` 메소드 수정
   <br>
2. 두 토큰을 구분할 수 있게 JWT 토큰에 구분자를 추가
   - `JwtUtil` 클래스에서 JWT를 생성할 때 `category` 필드 추가
   <br>
3. JWT 토큰 인증 시, 토큰의 만료 여부와 Access인지 Refresh인지 확인하는 로직 추가
   - `JwtFilter` 클래스에 토큰 만료 여부 판단 로직 추가
   - `JwtFilter` 클래스에 토큰이 Access인지 확인하는 로직 추가
   <br>
4. 새로운 Access 토큰을 발급해주는 엔드포인트 추가
   - Refresh 토큰을 받아서 새로운 Access 토큰을 발급하는 엔드포인트(`/refresh`) 추가
   - Refresh Rotate도 함께 구현
<br>
5. Refresh 토큰 저장 로직 구현
   - 새로운 Entity 정의
   - 로그인 시 발급되는 Refresh 토큰을 서버측에서도 저장할 수 있게 `LoginFilter` 수정
   - `/refresh` 엔드포인트에서 토큰을 재발급할 때, DB의 내용과 비교하는 로직 추가
   
   

<br>

위의 순서대로 코드를 수정하면 된다.
포스팅에서는 각 클래스별로 어떤 부분을 수정해야 하는지 알아보겠다.

### 1. LoginFilter
`LoginFilter` 클래스에서 작업해야 하는 내용은 다음과 같다.

- 로그인 성공 시 호출되는 메소드 `successfulAuthentication` 을 수정하여 AccessToken 뿐만 아니라 RefreshToken도 발급하게 만든다.
- Refresh 토큰을 DB에 저장하는 로직을 추가한다.

```java
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        // 사용자 인증 정보에서 CustomUserDetails 객체를 가져옴
        PrincipalDetails customUserDetails = (PrincipalDetails) authentication.getPrincipal();

        // 사용자 이름을 가져옴
        // 하지만 이름은 중복될 수 있으므로 email을 받을거임
        // getUsername은 오버라이딩된 메소드라서 이름을 바꿀 수 없음
        String email = customUserDetails.getUsername();

        // 사용자의 권한 목록을 가져옴
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // 권한 목록의 iterator를 생성
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        // 첫 번째 권한을 가져옴
        GrantedAuthority auth = iterator.next();

        // 권한의 이름(역할)을 가져옴
        String role = auth.getAuthority();

        // JWT 토큰을 생성함 Access Token(username, role, 유효기간 1시간), Refresh Token(username, role, 유효기간 24시간)
        String accessToken = jwtUtil.createJwt("access", email, role, accessTokenExpireTime);
        String refreshToken = jwtUtil.createJwt("access", email, role, refreshTokenExpireTime);

        //Refresh 토큰 저장
        addRefreshEntity(email, refreshToken, 86400000L);

        //응답 설정
        response.setHeader("access", accessToken);
        response.addCookie(createCookie("refresh", refreshToken));
        response.setStatus(HttpStatus.OK.value());
    }
```

완전한 코드는 포스트의 가장 아래 목록에서 확인하자.

<br>

### 2. JwtUtil
`JwtUtil` 클래스에서 작업해야 하는 내용은 다음과 같다.

- Access와 Refresh를 구분하기 위한 `category` 필드를 JWT에 추가한다.
- `getCategory` 메소드를 추가한다.

```java
    // ============= JWT 토큰 발급 메소드 ===================
    public String createJwt(String category, String email, String role, Long expiredMs) {

        return Jwts.builder()
                .claim("category", category)
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }
    // ===================================================
    
    ...
    
        public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

	...
```
<br>

### 3. JwtFilter
`JwtFilter` 클래스에서 작업해야 하는 내용은 다음과 같다.

- 토큰 만료 여부 판단 로직 추가
- 토큰이 Access인지 확인하는 로직 추가

```java
// 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
```

<br>

### 4. Controller
현재 작업중인 프로젝트에서 인증을 담당하는 `AuthController` 클래스에서 작업해야 하는 내용은 다음과 같다.

- Refresh 토큰을 받아서 새로운 Access 토큰을 발급하는 엔드포인트(/refresh) 추가
- 토큰을 재발급할 때, DB의 내용과 비교하는 로직도 포함
- Refresh Rotate 구현

```java
    public ResponseEntity<String> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("refresh")){
                refresh = cookie.getValue();
            }
        }

        if(refresh == null){
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        try{
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e){
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //DB에 저장되어 있는지 확인
        Boolean isExist = refreshTokenRepository.existsByTokenContent(refresh);
        if (!isExist) {

            //response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }


        String email = jwtUtil.getEmail(refresh);
        String role = jwtUtil.getRole(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", email, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", email, role, 86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshTokenRepository.deleteByTokenContent(refresh);
        addRefreshEntity(email, newRefresh, 86400000L);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(newAccess, HttpStatus.OK);
    }
```


<br>

---

<br>

지금은 Swagger를 통해서 회원가입, 로그인, 토큰 재발급을 함
사실은 Spring Security를 사용하면 login은 알아서 처리해줄거임.

그렇다면?
login을 완전히 똑같이 만들어두면됨
Postman이랑 비교해서 완전히 똑같이 리턴하는지 확인이 필요함

현재 토큰 재발급은 Cookie에 들어있음
따라서 Swagger로는 테스트 불가능




## REFERENCE
<a href="https://www.youtube.com/watch?v=SxfweG-F6JM&list=PLJkjrxxiBSFATow4HY2qr5wLvXM6Rg-BM&index=1">스프링 JWT 심화 - 개발자 유미</a>
