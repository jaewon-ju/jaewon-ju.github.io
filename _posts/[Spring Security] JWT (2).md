---
title: "[Spring Security] JWT (2)"
description: "Spring Security에서 JWT를 구현하는 방법"
date: 2024-07-04T12:37:18.496Z
tags: ["Spring","spring security"]
slug: "Spring-Security-JWT-2"
thumbnail: "https://velog.velcdn.com/images/jaewon-ju/post/8abff33a-12e9-48e9-bad2-1c7ecf25b7a8/image.png"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:33.254Z
  hash: "bb082443d32454f4afef579836d71f29e3f72415a03b4eb49573badc13691af4"
---

## ✏️ JWT With Spring Security
Spring Security의 기본 로그인 방식은 세션(FormLogin)을 사용하는 것이다. 
(Spring Security의 OAuth2도 기본적으로는 세션을 사용한다. 하지만, 세션 대신 JWT를 사용하도록 변경할 수 있다.)

따라서, Spring Security에서 JWT 기능을 구현하려면 여러가지 작업들이 필요하다.
<br>

> #### Spring Security에서 JWT를 사용하기 위해 필요한 작업들
1. Spring Security의 기본 기능들 막기
   - 세션을 사용하지 못하게 막는다.
   - HTTP Basic(쿠키나 세션을 사용하지 않고, username과 password로 인증하는 방식)을 사용하지 못하게 막는다.
   - FormLogin(POST로 사용자의 데이터를 전달해 인증하는 방식)을 막는다. 
<br>
2. 회원가입 로직 구현하기
<br>
3. 로그인 로직 구현하기
<br>
4. 검증 로직 구현하기


<br>

#### 결론적으로 개발자가 구현해야/처리해야 하는 클래스들은 무엇인가?

각 과정에서 처리해야 하는 클래스들을 정리해보았다.

>#### 과정 1. Spring Security의 기본 기능들 막기
관련 클래스: ```SecurityConfig```<br>
Spring Security는 기본적으로 세션을 기반으로 인증을 진행한다.
따라서, JWT를 사용하려면 이러한 기본 값들을 모두 막아줘야 한다.


>#### 과정 2. 회원가입 로직 구현하기
관련 클래스: ```User```, ```UserDetails``` 구현객체<br>
회원가입 로직은 세션을 사용할 때와 동일하다.

>#### 과정 3. 로그인 로직 구현하기
관련 클래스: ```LoginFilter``` , ```JwtUtil``` (토큰 발급 및 검증)<br>
- 과정 1에서 FormLogin을 막으면 ```UsernamePasswordAuthenticationFilter```가 동작하지 않게 된다. 따라서, 해당 필터를 대체해줄 커스텀 필터(```LoginFilter```)를 만들어줘야 한다.
<br>
- 로그인 성공시 클라이언트에게 JWT 토큰을 반환해야 한다. 이를 처리하는 ```JwtUtil``` 클래스를 만들어줘야 한다.

>#### 과정 4. 검증 로직 구현하기
관련 클래스: ```JwtFilter```<br>
- 클라이언트로부터 받은 JWT를 검증하기 위한 커스텀 필터(```JwtFilter```)를 구현해야 한다.


이제, 각 과정에서 필요한 클래스들을 구현하여 보자.

<br>

---

<br>

## ✏️ 1. Spring Security의 기본 기능들 막기
Spring Security는 기본적으로 세션을 기반으로 인증을 진행한다.
따라서, JWT를 사용하려면 이러한 기본 값들을 모두 막아줘야 한다.

1. 세션 사용을 막는다.

2. HTTP Basic을 막는다.
3. FormLogin을 막는다.

>- HTTP Basic: 쿠키나 세션을 사용하지 않고, 요청 메시지에 username과 password을 포함시켜서 인증하는 방식
<br>
- FormLogin: POST로 사용자의 데이터를 전달해 인증하는 방식

<br>

```SecurityConfig``` 클래스에서 위의 3가지 기능을 막도록 설정한다.
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf((auth) -> auth.disable());

		//From 로그인 방식 disable
        http.formLogin((auth) -> auth.disable());
		
        //http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());

		//세션 설정
        http.sessionManagement((session) -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            
		//경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth
			.requestMatchers("/login", "/", "/join").permitAll()
            .requestMatchers("/admin").hasRole("ADMIN")
			.anyRequest().authenticated());

        return http.build();
    }
}
```

<br>

---

<br>

## ✏️ 2. 회원가입 로직 구현하기

회원가입 로직은 세션을 사용했을 때와 똑같은 코드를 사용한다.

```java
@PostMapping("/register")
    // user는 폼에 입력한 정보를 통해 바인딩
	public String register(User user) {
		String rawPassword = user.getPassword();
		String encPassword = bCryptPasswordEncoder.encode(rawPassword); // 비밀번호 암호화
		user.setPassword(encPassword);
		user.setRole("ROLE_USER");
		userRepository.save(user);
		return "redirect:/";
	}
```

단순하게 구현했다.
실제로 사용할 때는, DTO를 사용하고 Controller 레벨에서는 Repository 대신 Service를 호출하도록 구현하도록 하자.
<br>

---

<br>

## ✏️ 3. 로그인 로직 구현하기
과정 1에서 FormLogin을 막으면 ```UsernamePasswordAuthenticationFilter```가 동작하지 않게 된다. 
따라서, 해당 필터를 대체해줄 커스텀 필터(```LoginFilter```)를 만들어줘야 한다.

- ```LoginFilter``` 는 ```UsernamePasswordAuthenticationFilter``` 를 상속해야 한다.

- ```LoginFilter``` 는 다음과 같은 기능을 수행한다.
   - 클라이언트 요청에서 username, password 추출
   - 추출한 username과 password를 ```AuthenticationToken```에 저장
   - 토큰을 ```AuthenticationManager``` 에게 전달
   - 로그인 성공시 ```JwtUtil``` 을 통해 JWT 토큰 발급
- ```UsernamePasswordAuthenticationFilter``` 대신 ```LoginFilter``` 를 사용하도록 ```SecurityConfig```를 수정해야 한다.

![](https://velog.velcdn.com/images/jaewon-ju/post/8abff33a-12e9-48e9-bad2-1c7ecf25b7a8/image.png)

위의 그림은 ```UsernamePasswordAuthenticationFilter``` 의 동작과정이다.
아래의 그림은 ```LoginFilter```와 ```JwtUtil```을 사용했을 때의 동작과정이다.
![](https://velog.velcdn.com/images/jaewon-ju/post/fcde8a79-2ee6-4421-a0aa-cff4d1c833ec/image.png)


```UsernamePasswordAuthenticationFilter``` 자리를 대체할 ```LoginFilter``` 클래스를 구현해야 한다.
인증이 완료되면 ```JwtUtil```로 JWT 토큰을 발급해서 다음 필터로 전달한다.

<br>

### ■ SecurityConfig 수정
```SecurityConfig``` 클래스에 다음과 같은 코드를 추가한다.

```java
// AuthenticationManger를 빈으로 등록
// LoginFilter 클래스에서 사용된다.
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
	return configuration.getAuthenticationManager();
} 
```
```java
// LoginFilter를 필터 체인에 등록
http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration)), UsernamePasswordAuthenticationFilter.class);
```

<br>

### ■ JwtUtil
- ```JwtUtil``` 클래스는 JWT 토큰 발급 및 검증을 수행한다.
- ```LoginFilter``` 클래스에서 JwtUtil의 메소드들을 호출한다.

```java
@Component
public class JwtUtil {

    private SecretKey secretKey;
	// 서버의 비밀 키
    
    public JwtUtil(@Value("${spring.jwt.secret}")String secret) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        // JwtUtil 클래스가 생성될 때 application.yml 로부터 키 값을 주입받는다.
    }

	
    // ============= JWT 토큰 발급 메소드 ===================
	public String createJwt(String username, String role, Long expiredMs) {

        return Jwts.builder()
                .claim("username", username)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }
    // ===================================================
    
    
    
    // ================ JWT 토큰 검증 메소드 ==================
    public String getUsername(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }
	// ===================================================
}
```

<br>

<span style = "color:red">⚠️</span> ```JwtUtil```에서 사용되는 secret key는 ```application.yml``` 에서 주입받는다. 

```application.yml```에 다음과 같은 코드를 추가한다.
```yaml
spring:
  jwt:
    secret: 충분히 긴 secret key 값 아무거나
```

<br>


### ■ LoginFilter
- ```LoginFilter``` 는 ```UsernamePasswordAuthenticationFilter``` 을 대신하여 로그인을 진행한다.
- 로그인이 완료되면, ```JwtUtil``` 클래스를 사용하여 토큰을 발급 한 후 다음 필터로 전달한다.
- ```LoginFilter``` 는 ```"/login"``` URL로 접속했을 때만 동작한다. 다른 경로로 접속했다면, 이 필터는 통과하지 않는다.
```java
@Component
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
		//필터를 통과할 때 실행되는 메소드
        //클라이언트 요청에서 username, password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        //username과 password를 토큰으로 담음
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        // 토큰을 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }



    //로그인 성공시 실행하는 메소드 (JWT 발급)
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        // 사용자 인증 정보에서 CustomUserDetails 객체를 가져옴
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        // 사용자 이름을 가져옴
        String username = customUserDetails.getUsername();

        // 사용자의 권한 목록을 가져옴
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // 권한 목록의 iterator를 생성
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        // 첫 번째 권한을 가져옴
        GrantedAuthority auth = iterator.next();

        // 권한의 이름(역할)을 가져옴
        String role = auth.getAuthority();

        // JWT 토큰을 생성함 (username, role, 유효기간 10시간)
        String token = jwtUtil.createJwt(username, role, 60 * 60 * 10L);

        // 응답 헤더에 "Authorization" 헤더를 추가하고, 값으로 생성된 JWT 토큰을 설정함
        response.addHeader("Authorization", "Bearer " + token);
    }



    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
		response.setStatus(401);
    }
}
```

<br>

```LoginFilter``` 코드를 읽다가 이해되지 않는 부분이 하나 생겼다.
```java
CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
```
>JWT는 세션을 사용하지 않는데, 어떻게 authentication 객체에서 사용자 정보를 꺼낼 수 있는가?

➜ JWT에서는 일시적인 세션을 사용해서 사용자 정보를 ```authentication``` 객체에 저장 해 둔다.
이 세션은 요청이 끝날 시 삭제된다.

<br>

---

<br>

## ✏️ 4. 검증 로직 구현하기
클라이언트로부터 전달받은 요청 헤더의 ```Authorization``` 에 JWT가 존재하는 경우, JWT를 검증하고 <span style = "color:red">임시적인 세션을 생성하여</span> 사용자 인증 토큰을 저장해놓는다.

<span style = "color:red">⚠️</span> 사용자 인증 토큰은 JWT과는 무관하다.
<span style = "color:red">⚠️</span> 세션은 요청이 끝나면 없어진다.

- JWT 검증은 ```JwtFilter``` 에서 ```JwtUtil```의 메소드를 호출해서 진행된다.


<br>

### ■ SecurityConfig 수정
```SecurityConfig```에 다음과 같은 코드를 추가한다.
```java
http.addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class);
```

- ```JwtFilter```를 필터체인에 등록한다.

<br>

### ■ JwtFilter
```java
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {

            System.out.println("token null");
            filterChain.doFilter(request, response);

            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        System.out.println("authorization now");
        //Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split(" ")[1];

        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {	
                
            System.out.println("token expired");
            filterChain.doFilter(request, response);

            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        //토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        //userEntity를 생성하여 값 set
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setPassword("temppassword");
        userEntity.setRole(role);

        //UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

}
```

- ```JwtFilter```는 HTTP 요청 헤더에 포함된 JWT 토큰을 검증하고 임시 세션을 생성하여 사용자 정보를 담는다.

<br>

```JwtFilter``` 코드를 읽다가 또 이해가 되지 않는 부분이 생겼다.

> JWT 토큰을 validate 하는 코드가 없는데?

클라이언트로부터 받은 토큰이 진짜 서버가 발행한 것인지 검증하는 코드는 어디있을까?
➜ 해당 코드는 ```JwtUtil``` 의 ```isExpired``` 메소드 안에 포함되어 있다.
```java
public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
        		.parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }
    // verifyWith(secretKey) 는 서버의 비밀키를 사용해서 JWT의 서명을 검증한다.
    // 이 과정에서 JWT의 무결성을 보장한다.
    // 즉, JWT가 서버에서 발급된 것임을 확인한다.
```
```JwtFilter```는 ```JwtUtil```의 ```isExpired``` 메소드를 호출해서 토큰 검증을 진행한다.

<br>

---

<br>

## ✏️ 정리

간단하게 로직을 정리하자면 다음과 같다.
>#### 로그인 로직
1. 클라이언트가 로그인 요청
2. ```LoginFilter``` 가 동작해서 로그인 처리
3. 로그인이 성공하면 ```LoginFilter```는 ```JwtUtil```을 사용하여 JWT 발급

>#### 검증 로직
1. 클라이언트가 권한이 필요한 주소에 요청을 보냄
2. ```JwtFilter``` 가 동작해서 요청 header에 토큰이 있는지 확인
3. 토큰이 들어있으면 ```JwtFilter```는 ```JwtUtil```의 메소드를 호출해서 검증을 수행
4. 검증이 완료되면 다음 필터로 이동

<span style = "color:red">⚠️</span> ```LoginFilter```는 ```"/login"``` URL로 요청이 들어왔을 때만 동작한다.
따라서, 권한이 필요한 다른 URL로 접속했을 때는 ```LoginFilter```가 동작하지 않는다.


<br>

---

<br>

## ✏️ 최종 코드
```java
// SecurityConfig
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JwtUtil jwtUtil) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf((auth) -> auth.disable());

        //Form 로그인 방식 disable
        http.formLogin((auth) -> auth.disable());

        //http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());

        //세션 설정
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class);

        // 로그인 필터 추가 - 인증 처리 단계에서 실행
        http.
                addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class);

        //경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/login", "/", "/register","/swagger-ui/**", "/api-docs/**").permitAll()
                //.requestMatchers("/admin").hasRole("ADMIN")
                .anyRequest().authenticated());

        return http.build();
    }
}
```

```java
// LoginFilter
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        //필터를 통과할 때 실행되는 메소드
        //클라이언트 요청에서 username, password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        //username과 password를 토큰으로 담음
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        // 토큰을 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }



    //로그인 성공시 실행하는 메소드 (JWT 발급)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        // 사용자 인증 정보에서 CustomUserDetails 객체를 가져옴
        PrincipalDetails customUserDetails = (PrincipalDetails) authentication.getPrincipal();

        // 사용자 이름을 가져옴
        String username = customUserDetails.getUsername();

        // 사용자의 권한 목록을 가져옴
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // 권한 목록의 iterator를 생성
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        // 첫 번째 권한을 가져옴
        GrantedAuthority auth = iterator.next();

        // 권한의 이름(역할)을 가져옴
        String role = auth.getAuthority();

        // JWT 토큰을 생성함 (username, role, 유효기간 10시간)
        String token = jwtUtil.createJwt(username, role, 60 * 60 * 10L);

        // 응답 헤더에 "Authorization" 헤더를 추가하고, 값으로 생성된 JWT 토큰을 설정함
        response.addHeader("Authorization", "Bearer " + token);
    }



    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}
```

```java
// JwtFilter
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);

            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        System.out.println("authorization now");
        //Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split(" ")[1];

        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {

            System.out.println("token expired");
            filterChain.doFilter(request, response);

            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        //토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String roleString = jwtUtil.getRole(token);

        Role role;
        try {
            role = Role.valueOf(roleString);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid role in token");
            filterChain.doFilter(request, response);
            return; // 유효하지 않은 역할이면 필터 종료
        }

        //user를 생성하여 값 set
        User user = User.builder()
                .name(username) // 여기서는 이메일 대신 사용자 이름을 설정했는데, 상황에 맞게 수정 가능
                .password("temppassword") // 임시 비밀번호 설정
                .roles(role) // 역할 설정
                .build();

        //UserDetails에 회원 정보 객체 담기
        PrincipalDetails customUserDetails = new PrincipalDetails(user);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                customUserDetails, null, customUserDetails.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

}
```
```java
// PrincipalDetails - UserDetails의 구현객체
public class PrincipalDetails implements UserDetails {

    private User user;

    public PrincipalDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRoles().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // 일반적으로 getUsername() 메서드는 사용자 식별자를 반환해야 한다.
        // name은 중복될 수 있으므로 email을 사용한다.
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
```
```java
// PrincipalDetailsService
@Service
public class PrincipalDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // overriding을 위해 loadUserByUsername 이라는 메소드명을 사용했지만, 이메일로 식별할거임
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not Found"));

        return new PrincipalDetails(user);
    }
}

```

<br>

### Swagger 사용시

```java
// OpenApiConfig
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        // OpenAPI 객체를 생성하고, Swagger 문서에 대한 설정을 추가합니다.
        return new OpenAPI()
                // Swagger 문서에서 사용할 보안 스키마를 정의하는 Components 객체를 설정합니다.
                .components(new Components()
                        .addSecuritySchemes("bearer-key", // 보안 스키마의 이름을 "bearer-key"로 정의합니다.
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP) // 보안 방식의 타입을 HTTP로 설정합니다.
                                        .scheme("bearer") // HTTP 인증 방식으로 "Bearer" 토큰을 사용함을 나타냅니다.
                                        .bearerFormat("JWT"))) // Bearer 토큰의 형식을 명시적으로 "JWT"로 설정합니다.
                // 모든 API 엔드포인트에 대해 정의된 보안 요구 사항을 추가합니다.
                .addSecurityItem(new SecurityRequirement().addList("bearer-key")) // 각 요청에서 "bearer-key" 스키마를 요구하도록 설정합니다.
                // Swagger UI에 표시될 API 정보(제목, 설명 등)를 설정합니다.
                .info(apiInfo()); // API의 메타데이터를 설정합니다. 'apiInfo()'는 해당 정보를 담고 있는 메서드입니다.
    }

    private Info apiInfo() {
        return new Info()
                .title("UniCircle")
                .description("University Of Seoul Circle Application")
                .version("0.1.0");
    }
}
```

<br>

---

<br>
## REFERENCE
<a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0/dashboard">스프링부트 시큐리티 & JWT 강의</a>
<a href="https://www.youtube.com/watch?v=7B6KHSZN3jY&t=3s">스프링 시큐리티 JWT - 개발자 유미</a>