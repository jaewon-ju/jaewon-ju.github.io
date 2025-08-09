---
title: "[Spring Security] OAuth2"
description: "Spring Security를 통해 OAuth2 기능을 사용하는 방법"
date: 2024-07-03T13:53:01.924Z
tags: ["Spring","spring security"]
slug: "Spring-Security-OAuth2"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:54.041Z
  hash: "26b789f7ebe6011cf46ddd1eeec8a146b837f5c5027f6c804f1716ddc2401109"
---

## ✏️ OAuth
>#### OAuth (Open Authorization)
: 사용자(Resource Owner)가 자신의 비밀번호를 제공하지 않고도 서비스(Client)가 사용자를 대신하여 다른 서비스(Resource Server)의 자원에 접근할 수 있도록 권한을 위임하는 프로토콜

OAuth에 대한 설명과 동작원리는 <a href="https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-OAuth-20-%EA%B0%9C%EB%85%90-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC"> 이 사이트</a>에서 자세히 설명되어 있으니 참고하도록 하자.

간단하게 동작 과정을 설명하자면

1. __사용자 승인__: 사용자는 애플리케이션(Client)에서 로그인 요청을 받습니다.

2. __인증 서버 요청__: Client는 Authorization Server에 사용자 승인 요청을 보냅니다.
3. __승인 코드 발급__: Authorization Server는 사용자 승인을 받으면 인증 코드를 발급합니다.
4. __토큰 요청__: Client는 이 코드를 Authorization Server에 제출하여 Access Token을 요청합니다.
5. __Access Token 발급__: Authorization Server는 인증된 Client에게 Access Token을 발급합니다.
6. __리소스 서버 접근__: Client는 이 Access Token을 사용해 Resource Server의 보호된 리소스에 접근합니다.

<br>

이제, 이 OAuth를 Spring Security가 어떻게 사용하는지 알아보도록 하자.

<br>

### ■ W/Spring Security
Spring Security가 OAuth2 프로토콜을 어떻게 지원하는지 알아보자.
일단, build.gradle에 의존성을 추가해야 한다.

```java
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
}
```

<br>

의존성을 추가하면, <span style = "color:red">새로운 필터가 등록되어</span> OAuth2 인증을 처리한다!
- ```OAuth2LoginAuthenticationFilter```
: 로그인 시 OAuth2 인증 흐름을 처리하는 필터

- ```BearerTokenAuthenticationFilter```
: 리소스 서버에서 요청을 받을 때 액세스 토큰을 검증하는 필터


<br>

로그인 필터는 다음과 같이 동작한다.

1. 리디렉션: 사용자가 보호된 리소스에 접근 시, ```OAuth2LoginAuthenticationFilter```는 OAuth2 제공자의 로그인 페이지로 리디렉션한다.
2. 인증 완료: 사용자가 OAuth2 제공자에서 인증을 완료하면, 인증 서버가 클라이언트 애플리케이션에 <span style = "color:red">인증 코드</span>를 반환한다.
3. 액세스 토큰 요청: 클라이언트 애플리케이션은 인증 코드를 사용해 인증 서버에 액세스 토큰을 요청
4. 액세스 토큰 수신: 클라이언트 애플리케이션이 액세스 토큰을 받은 후, 보호된 리소스에 접근 가능


<br>

---

<br>

## ✏️ 구현 방법
리소스 서버인 Google을 활용한 OAuth2 로그인 기능을 구현해보자.
```build.gradle```에 의존성이 추가되어 있다고 가정한다.

### 1. Google OAuth2 가입
<a href="https://console.cloud.google.com">google API Console </a>사이트에 접속한 뒤, OAuth2 client-id,client-secret을 발급 받는다.

그런 다음, ```application.yml``` 파일에 다음과 같은 정보를 추가한다.
```yml
security:
  oauth2:
    client:
      registeration:
        google:
          client-id: 발급받은 client-id
          client-secret: 발급받은 client-secret
        scope:
        - email
        - profile  #사용하려는 기능들 적기
```

<br>

---

<br>

### 2. OAuth2 로그인 설정
Google 로그인을 위한 URL 경로는 <span style = "background-color: lightgreen; color:black">고정되어 있다!</span>
Google OAuth2 경로: ```/oauth2/authorization/google```

로그인 화면에 다음과 같은 링크를 추가해준다.
```html
<a href = "/oauth2/authorization/google">구글 로그인</a>
```
<br>

<span style = "color:red">⚠️</span> 사용자가 해당 링크로 접속하면, 404가 뜰 것이다!
➜ ```SecurityConfig``` 클래스에서 OAuth2 클라이언트를 설정하지 않았기 때문이다.
<br>

>Spring Security는 자동으로 OAuth2 로그인 필터를 구성해주지만, 보안 설정 클래스에서 이를 명시적으로 지정해야 한다.

<br>

이전 포스팅에서 작성했던 ```SecurityConfig``` 클래스에 다음과 같은 내용을 추가해준다.
```java
.and()
.oauth2Login() // OAuth2 로그인을 활성화
.loginPage("/loginForm") // 사용자가 OAuth2 로그인을 시도할 때 이 URL로 리디렉션
```

<br>

전체 ```SecurityConfig``` 클래스의 내용은 다음과 같다.

```java
@Configuration 
@EnableWebSecurity 
public class SecurityConfig {

	@Bean
	public BCryptPasswordEncoder encodePwd() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.authorizeRequests()
				.antMatchers("/user/**").authenticated()
				.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
				.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
				.anyRequest().permitAll()
				
                .and()
				.formLogin()
				.loginPage("/loginForm")
                .loginProcessingUrl("/login")
				.defaultSuccessUrl("/")
                
				.and()
                .oauth2Login()
                .loginPage("/loginForm")
		return http.build();
	}
}
```

<br>

이제, ```/oauth2/authorization/google``` 링크를 누르면 Google 로그인 페이지가 뜰 것이다.
사용자는 해당 페이지에서 자신의 Google 아이디로 로그인 하면 된다.

<br>

> 일반적으로, 로그인을 완료하면 Google은 사용자에게 <span style = "color:red">AuthorizationCode</span>를 반환한다.
애플리케이션(client)은 AuthorizationCode를 사용해서 Access Token을 요청해야 한다.<br>
### 하지만!
Spring Security는 이 과정을 자동으로 처리해서, Access Token과 사용자 프로필 정보를 가져온다! 


<br>

---

<br>

### 3. 사용자 정보 추출
> OAuth2 로그인이 완료되면, ```OAuth2LoginAuthenticationFilter``` 는 자동으로 ```OAuth2UserService``` 를 호출하도록 동작한다.

∴ ```OAuth2UserService``` 에서 사용자 정보를 추출할 수 있다.

<br>

```SecurityConfig``` 클래스에 다음과 같은 코드를 추가한다.
```java
.userInfoEndpoint()
.userService(customOAuth2UserService); // 사용자 정보를 처리할 커스텀 서비스를 설정
// customOAuth2UserService 는 DefaultOAuth2UserService를 상속한다.
```

이제, 로그인이 완료된 후 ```CustomOAuth2UserService```의 ```loadUser()``` 라는 메소드가 자동으로 호출된다.

<br>

우선, ```CustomOAuth2UserService``` 을 구현해서 사용자 정보를 추출해보자.

```java
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
	    // userRequest는 Access Token 및 사용자 정보를 가지고 있다.
        // userRequest는 Spring Security에 의해 자동적으로 주입된다.
        
        OAuth2User oauth2User = super.loadUser(userRequest); 
        // userRequest에서 사용자 정보를 추출
        
        return oauth2User;
    }
}
```

- ```userRequest``` 는 Access Token 및 사용자 정보를 가지고 있다.
- ```super.loadUser(userRequest)``` 메소드를 통해 사용자 정보를 ```OAuth2User``` 타입으로 추출할 수 있다.
- Google 로그인 후에 받은 사용자 정보는 다음과 같은 요소들로 구성되어 있다.

| key | value | 설명 | 
| - | - | - |
| sub | 1234985749 | google에서 사용자의 식별 번호 |
| name  | 주재원 | 이름 |
| given_name | 재원 | first name|
| family_name | 주 | last name|
| email | myEmail@gmail.com | 이메일 정보 |
| locale | ko | 지역 정보 |



<br>

---

<br>

### 4. 자동 회원가입
```CustomOAuth2UserService``` 에서 추출한 정보를 바탕으로 자동 회원가입 기능을 구현할 수 있다.

다음과 같이, google에서 받은 사용자 정보를 재구성해서 DB에 사용자를 저장(회원가입)할 것이다.

- username 
ex) google_1234985749

- password
ex) 암호화(특정문자열)

- email
ex) myEmail@gmail.com

- role
ex) ROLE_USER

- provider
ex) google

- providerId
ex) 1234985749


<br>

자동 회원가입 로직을 ```loadUser()``` 메소드 안에 넣어준다.
```java
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	...
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest); 
        // userRequest에서 사용자 정보를 추출
        
        OAuth2UserInfo oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        // GoogleUserInfo 는 따로 구현해줘야 함
        
        
        Optional<User> userOptional = userRepository.findByProviderAndProviderId(
        		oAuth2UserInfo.getProvider(), oAuth2UserInfo.getProviderId());
                
        User user;
        
		if (userOptional.isPresent()) {
        	// 이미 회원가입이 되어 있음
            
			user = userOptional.get();
			user.setEmail(oAuth2User.getEmail());
			userService.save(user);
		} else {
        	// 회원가입이 안되어 있음
            
			user = User.builder()
					.username(oAuth2UserInfo.getProvider() + "_" + oAuth2UserInfo.getProviderId())
					.email(oAuth2UserInfo.getEmail())
					.role("ROLE_USER")
					.provider(oAuth2UserInfo.getProvider())
					.providerId(oAuth2UserInfo.getProviderId())
					.build();
			userService.save(user);
		}
        
        return ???
}
```


회원가입 로직을 다 작성했다.
- userRequest에서 사용자 정보를 추출했다.
- 회원가입이 되어있는 경우는 Email만 업데이트 하도록 만들었다.
- 회원가입이 되어있지 않으면, 새로운 User 객체를 만들어서 DB에 저장했다.

> #### 무엇을 return 해야 할까?
loadUser 메서드에서 ```OAuth2User``` 타입의 객체를 반환해야 한다.
반환된 객체는 ```SecurityContextHolder``` 에 저장된다.<br>

그렇다면, ```OAuth2User``` 타입 객체인 ```oauth2User``` 를 반환하면 되지 않을까?

<br>

<span style = "color:red">⚠️</span> 예상치 못한 오류가 발생할 수 있다!!!

<br>

---

<br>

## 5. 회원가입 문제 해결
```oauth2User``` 를 그냥 반환하면 어떤 오류가 발생할까?

사실, 반환하는 것 자체로 오류가 발생하지는 않는다.
하지만, 애플리케이션의 다른 로직을 작성할 때 많은 영향을 준다.

<br>

지금 우리의 애플리케이션에는 2가지 로그인 방법이 존재한다.

1. 일반 로그인
2. OAuth2 기반 로그인

일반 로그인은 <a href="https://velog.io/@jaewon-ju/Spring-Security-%EA%B8%B0%EB%B3%B8">이전 포스트</a>에서 구현했다.
일반 로그인을 완료한 후에는 ```UserDetails``` 타입의 객체인 ```PrincipalDetails``` 가 ```Authentication``` 에 저장된다.

![](https://velog.velcdn.com/images/jaewon-ju/post/92c704df-4943-401f-88da-948d90d329c9/image.png)

<br>

애플리케이션에서 기능을 구현할 때, 사용자 정보를 사용해야 한다면 ```Authentication``` 객체에서 ```PrincipalDetails``` 를 꺼내올 것이다.

이런식으로
```java
@GetMapping("/userInfo")
public @ResponseBody String userInfo(
					@AuthenticationPrincipal PrincipalDetails userDetails) {
                    
           userDetails.getUser();
           ...
}
```

<br>

>__만약__! ```loadUser``` 메서드에서 그냥 ```oAuth2User``` 객체를 반환하도록 작성했다면?

일반 로그인은 문제가 없다.
문제는 OAuth2로 로그인 했을 시에 발생한다.

<br>


```java
public @ResponseBody String userInfo(@AuthenticationPrincipal PrincipalDetails userDetails) 
```
이 코드에서 오류가 발생할 것이다.
➜ ```oauth2User``` 객체는 ```PrincipalDetails``` 타입으로 캐스팅 될 수 없기 때문이다.

<br>


> #### 정리하자면
1. Google 로그인 후 ```CustomOAuth2UserService``` 을 호출
2. ```loadUser()``` 메소드에서 ```OAuth2User``` 타입 객체를 반환
3. 해당 객체를 ```Authentication``` 내부에 저장
4. ```Authentication``` 을 활용할 때, 일반 로그인/ OAuth2 로그인을 따로 처리해야 한다는 문제 발생
   - 일반 로그인: ```Authentication``` 내부에 ```PrincipalDetail``` 타입이 저장되어 있음
   - OAuth2 로그인: ```Authentication``` 내부에 ```OAuth2User``` 타입이 저장되어 있음
   
   
따라서, 문제를 해결하려면 다음 2가지를 수정하면 된다.

1. ```PrincipalDetails``` 클래스가 ```UserDetails``` 뿐만 아니라, ```OAuth2User``` 인터페이스도 구현하도록 수정한다.
   - 이렇게 하면, 다형성에 의해 ```PrincipalDetails``` 객체는 ```OAuth2User``` 타입으로 저장될 수 있다.
   
   

2. ```loadUser()``` 는 ```PrincipalDetails``` 타입 객체를 return 하도록 한다.


<br>

---

<br>

## 6. 완성
위의 2가지 수정사항을 적용하면 OAuth2를 활용한 회원가입 기능이 완성된다.

```java
public class PrincipalDetails implements UserDetails, OAuth2User{
// OAuth2User도 구현하도록 수정

	private User user;
	private Map<String, Object> attributes;

	// 일반 로그인시 사용
	public PrincipalDetails(User user) {
		this.user = user;
	}
	
	// OAuth2 로그인시 사용
	public PrincipalDetails(User user, Map<String, Object> attributes) {
		this.user = user;
		this.attributes = attributes;
	}
    
    ...
```
```java
@Override
public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    // 회원 가입 로직
    return new PrincipalDetails(user, oAuth2User.getAttributes())
}
```

<br>

---

<br>

## ✏️ 정리
> Spring Security를 활용해서 로그인을 하면, 어떤 로그인 방식을 사용했던지 간에 ```SecurityContextHolder``` 내부의 ```Authentication``` 객체에 사용자 정보가 저장된다. <br>
이때, ```Authentication``` 객체에 저장될 수 있는 타입은 단 두 가지이다.
1. ```UserDetails``` 타입
2. ```OAuth2User``` 타입<br>
두 타입을 모두 구현한 ```PrincipalDetails``` 객체는 ```Authentication``` 에 저장될 수 있다.

일반 로그인을 사용했던, OAuth 기반 로그인을 사용했던지 간에, 사용자 정보는 ```PrincipalDetails``` 타입 객체로 저장된다.

애플리케이션에서 사용자 정보를 사용해야 할 때는 ```Authentication``` 에서 ```PrincipalDetails``` 객체를 꺼내와서 사용하면 된다.

<br>

OAuth2를 사용하는 Spring Security의 처리 로직은 다음과 같다.

1. 사용자 -> ```/oauth2/authorization/google``` 요청
2. Google 인증 완료 -> ```OAuth2LoginAuthenticationFilter``` 가 처리를 시작
3. ```OAuth2LoginAuthenticationProvider```가 ```CustomOAuth2UserService``` 호출
3. ```CustomOAuth2UserService```가 ```OAuth2User``` 타입 객체 ```PrincipalDetails```를 반환
5. SecurityContextHolder에 저장

사용자 인증 완료, 보호된 리소스 접근 가능

<br>

## REFERENCE
<a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0/dashboard">스프링부트 시큐리티 & JWT 강의</a>