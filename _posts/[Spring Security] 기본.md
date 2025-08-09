---
title: "[Spring Security] 기본"
description: "Spring Security 의 동작원리와 간단한 구현"
date: 2024-07-02T13:27:33.997Z
tags: ["Spring","spring security"]
slug: "Spring-Security-기본"
series:
  id: 866f07ed-1183-4166-8319-98e0b8faa1a1
  name: "Spring"
velogSync:
  lastSyncedAt: 2025-08-09T00:32:33.371Z
  hash: "8f7d0dd4850318a1ad7cd3094882f168dc8e34d1a8c6216315144d24143b3eca"
---

### 들어가기 전에..

프롬프트 엔지니어링 사이트를 제작하는 프로젝트에서, 필자는 교육용 페이지와 댓글, 마이페이지를 만드는 작업을 수행했다. login/register 기능은 다른 백엔드 팀원이 작업했다. 

하지만... 스프링 세큐리티에 대한 지식이 없던 나는 팀원이 작성한 코드를 전혀 이해하지 못했다.

적어도 본인이 한 프로젝트의 기능들은 모두 이해해야 한다고 생각하기 때문에, Spring Security를 따로 공부하면서 코드를 하나씩 이해해보려 한다.

<br>

<span style = "color:red">⚠️</span> 코드를 이해하려면 Spring과 JPA 지식이 필요합니다!

<br>

---

<br>

## ✏️ Spring Security
> #### Spring Security
: 애플리케이션에서 인증과 권한 부여를 관리하는 프레임워크

#### 인증(Authentication): 해당 사용자가 본인인지 확인하는 절차
#### 인가(Authorization): 인증된 사용자가 요청한 자원에 접근 가능한지 확인하는 절차
#### 권한 부여: 인증된 사용자가 애플리케이션의 기능을 사용할 수 있게 권한을 주는 것

<br>

### ■ 동작 원리
<a href="https://medium.com/@aprayush20/understanding-spring-security-authentication-flow-f9bb545bd77"> 이 사이트를 참고했습니다. </a>

>#### Spring Security를 사용하지 않으면?
➜ ```DispatcherServlet``` 이 HTTP 요청을 받아서 각 컨트롤러에 전달한다.

>#### Spring Security를 사용하면?
➜ ```DispatcherServlet``` 으로 전달되기 전에, Spring Security가 모든 요청을 intercept한다.


자세한 동작 원리는 다음과 같다.

![](https://velog.velcdn.com/images/jaewon-ju/post/5c6560f5-6b01-4c55-84c6-7d2f9c77a3ec/image.png)

1. HTTP 요청이 들어온다. (로그인)

2.  ```UsernamePasswordAuthenticationFilter```가 사용자의 이름과 비밀번호를 캡쳐하고, ```AuthenticationManager``` 에 넘긴다.

3. ```AuthenticationManager``` 는 해당 인증을 처리할 수 있는 ```AuthenticationProvider``` 에게 넘긴다.

4. ```AuthenticationProvider```가 ```UserDetailsService```를 통해 사용자 정보를 로드하고 검증한다.

5. 인증 성공시 ```Authentication``` 객체가 ```SecurityContextHolder```에 저장된다.

<br>

### ■ UserDetailService
>```AuthenticationProvider```는 ```UserDetailsService```를 통해 사용자 정보를 로드하고 검증한다.

- ```UserDetailService``` 는 DB에서 사용자 정보를 로드한다.
- DB에서 로드된 사용자 정보는 ```UserDetails```  타입으로 리턴된다.


<br>

그렇다면, ```UserDetailService``` 는 어떻게 사용자 정보를 로드하는 걸까?

➜ ```UserDetailService``` 인터페이스를 구현한 구현객체는 ```UserDetails``` 타입을 반환하는 메소드를 오버라이딩한다.

➜ ```UserDetailService``` 는 해당 메소드를 호출해서 DB에 있는 사용자 정보를 ```UserDetails``` 타입으로 반환한다.

<br>

---

<br>

## ✏️ 간단한 구현
```build.gradle``` 이나 DB 연결 설정이 완료되어 있다는 가정 하에 Spring Security를 사용하는 방법을 알아보자.

우선, 간단한 컨트롤러를 하나 만들어보자.
```java
@Controller
public class SimpleController {
	@GetMapping("/")
	public @ResponseBody String index() {
		return "인덱스 페이지";
	}

	@GetMapping("/user")
	public @ResponseBody String user()
		return "유저 페이지";
	}

	@GetMapping("/admin")
	public @ResponseBody String admin() {
		return "어드민 페이지";
	}
	
	@GetMapping("/manager")
	public @ResponseBody String manager() {
		return "매니저 페이지";
	}

	@GetMapping("/loginForm")
	public String login() {
		return "loginForm";
	}

	@GetMapping("/register")
	public String register() {
		return "register";
	}
 }
```

현재의 컨트롤러는 아무런 기능이 없다.
그냥 각 페이지에 대한 설명을 return할 뿐이다.

<br>

>여기에 Spring Security를 적용해보자!

우선, Config 파일을 하나 만들어줘야 한다.
- Config 파일을 통해서 보안 정책을 구성할 수 있다.

```java
@Configuration // 이 클래스가 스프링 설정 클래스임을 나타냅니다.
@EnableWebSecurity // 필터체인에 등록
public class SecurityConfig {

	@Bean
	public BCryptPasswordEncoder encodePwd() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf().disable();
		// CSRF(Cross-Site Request Forgery) 보호를 비활성화합니다.
		http.authorizeRequests()
				.antMatchers("/user/**").authenticated()
				// 위 경로의 모든 요청은 인증된 사용자만 접근할 수 있습니다.
				.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
				// 위 경로의 요청은 ROLE_ADMIN 또는 ROLE_USER 권한을 가진 사용자만 접근할 수 있습니다.
				.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
				// ROLE_ADMIN 권한을 가진 사용자만 위 경로에 접근할 수 있습니다.
				.anyRequest().permitAll()
				/* 나머지 모든 요청은 인증 없이 접근할 수 있습니다. */
				.and()
				.formLogin()
				.loginPage("/loginForm")
				/* 로그인 페이지의 URL을 설정. 사용자가 로그인하지 않은 상태에서 인증이 필요한 페이지에 접근하면 이 페이지로 리다이렉트된다. */
				
		return http.build();
	}
}
```

위의 설정을 통해 Spring Security는 지정된 URL 패턴에 따라 접근 권한을 관리할 수 있게 되었다.

<br>

### ■ 회원가입
간단한 회원가입 페이지를 만들어보자.
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원가입 페이지</title>
</head>
<body>
<h1>회원가입 페이지</h1>
<hr/>
<form action="/register" method="post">
	<input type="text" name="username" placeholder="Username"/> <br/>
	<input type="password" name="password" placeholder="Password"/> <br/>
	<input type="email" name="email" placeholder="Email"/> <br/>
	<button>회원가입</button>
</form>
</body>
</html>
```

```java
@GetMapping("registerForm")
public String registerForm(){
	return "registerForm";
}
```


<br>

위의 폼에 내용을 입력한 뒤, 버튼을 누르면 ```/register``` URL로 POST 요청을 보낸다.
컨트롤러는 해당 요청을 받아서 회원가입을 진행해야 한다.

이때, 한 가지 주의해야 할 사항이 있다.
> <span style = "color:red">⚠️</span> 비밀번호를 DB에 그대로 저장하면 안된다!!!

비밀번호가 암호화되지 않으면, 시큐리티로 로그인을 할 수 없다.
∴ Config 파일에서 빈으로 등록한 ```BCryptPasswordEncoder```을 사용해서 비밀번호를 암호화 해야 한다.

<br>

회원가입을 위해 사용자 정보를 DB에 저장하는 코드는 다음과 같다.

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

<br>

### ■ 로그인
앞서 설명했듯이, Spring Security는 ```UserDetailService``` 를 통해 DB에서 사용자 정보를 로드한다.

```UserDetailService``` 는 인터페이스이기 때문에, 이를 구현한 구현객체를 만들어줘야 한다.
또한, ```UserDetails``` 인터페이스를 구현하여 사용자 정보를 캡슐화해야 한다.

```java
public class PrincipalDetails implements UserDetails {

    private User user;

    public PrincipalDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
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
@Service
public class PrincipalDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new PrincipalDetails(user);
    }
}
```

이제 사용자 검증을 수행할 비즈니스 로직들은 다 작성했다.
그렇다면, 로그인을 처리하기 위한 컨트롤러는 어떻게 구현해야 할까?

> 컨트롤러는 구현할 필요가 없다!

Spring Security에서 자동적으로 로그인을 처리하도록 만들어주면 된다.

<br>

Config 파일의 ```http.authorizeRequests()``` 에 다음과 같은 코드를 추가하면 된다.
```java
	.loginProcessingUrl("/login") // 이 URL로 요청이 오면 시큐리티가 로그인을 처리해준다.
    .defaultSuccessUrl("/") // login 이후 리다이렉트 될 위치
```

<br>

---

<br>

## ✏️ 권한 처리
Config 파일에 ```@EnableGlobalMethodSecurity(securityEnabled = true)``` 어노테이션을 추가하면, 간편한 권한 처리가 가능하다.

<br>

예를 들어, ```/info``` URL로 들어오는 요청을 제한하고 싶다면, 아래와 같은 어노테이션을 추가해주기만 하면 된다.

```java
@Secured("ROLE_ADMIN")
@GetMapping("/info")
public @ResponseBody String info() {
	return "info";
}
```
이제, ```/info``` URL로 접속하려면 ADMIN 권한이 필요하다.

<br>

다른 방법으로는 다음과 같은 어노테이션을 사용할 수도 있다.
```java
@PreAuthorize("hasRole(ROLE_ADMIN)")
@GetMapping("/info")
public @ResponseBody String info() {
	return "info";
}
```

<br>

## REFERENCE
<a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0/dashboard">스프링부트 시큐리티 & JWT 강의</a>