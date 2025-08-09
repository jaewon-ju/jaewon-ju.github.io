---
title: "[UniCircle] 백엔드 개발 기초"
description: "백엔드 개발의 기초 정리"
date: 2024-10-03T11:50:04.098Z
tags: ["프로젝트"]
slug: "UniCircle-백엔드-개발-기초"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:53.245Z
  hash: "26f942af5eeef4a3793d1ef22133104434dfb54d7feac22504f9d6b83deb17c5"
---

## ✏️ 폴더 구조
폴더 구조는 다음과 같다.

```css
project-root/
└── src/
    └── main/
        └── java/
            └── com/
                └── yourcompany/
                    └── yourproject/
                        ├── config/
                        │   ├── AppConfig.java
                        │
                        ├── controller/
                        │   ├── UserController.java
                        │   ├── ...
                        │
                        ├── entity/
                        │   ├── User.java
                        │   ├── ...
                        │
                        ├── dto/
                        │   ├── UserDto.java
                        │   ├── ...
                        │
                        ├── repository/
                        │   ├── UserRepository.java
                        │   ├── ...
                        │
                        ├── service/
                        │   ├── UserService.java
                        │   ├── ...
                        │
                        └── Application.java
```

- ```config``` 폴더
: configuration 파일들 저장
- ```controller``` 폴더
: 사용자 요청을 처리하는 컨트롤러들을 저장. @Controller를 사용하여 HTTP 요청을 처리

- ```entity``` 폴더
: 엔티티 클래스들을 저장. 
데이터베이스 테이블과 매핑되는 객체들이 포함됨

- ```dto (Data Transfer Object)``` 폴더
: 데이터 전송 객체들을 저장. 
entity를 직접 전달할 수도 있지만, 민감한 기능이 노출될 수 있으므로 DTO를 사용한다.

- ```repository``` 폴더
: 데이터베이스와의 상호작용을 담당하는 클래스들을 저장. 
JpaRepository를 확장하여 데이터 조회, 저장 등의 작업을 함.

- ```service``` 폴더
: 비즈니스 로직을 처리하는 서비스 클래스들을 저장. 


<br>

---

<br>

## ✏️ 개발 순서
Entity -> DTO -> repository -> service -> controller 순으로 개발한다.

예를 들어, 댓글 기능을 개발한다고 했을 때, 개발 순서는 다음과 같다.

1. Comment 클래스 구현
2. CommentDTO 클래스 구현
3. CommentRepository 클래스 구현
4. CommentService 클래스 구현
5. CommentController 클래스 구현

<br>

### 1. Comment 클래스 구현 (Entity)
- **담당 기능**: 데이터베이스의 `Comment` 테이블과 매핑되는 엔티티 클래스이다. 
- **주요 역할**: JPA와 같은 ORM 프레임워크에서 데이터베이스와 연동을 위해 사용되며, 데이터의 상태를 유지하고 데이터베이스와 상호작용

```java
@Getter // getter를 알아서 만들어줌
@Entity // @Entity 어노테이션을 꼭 작성해야 한다! 어노테이션을 작성해야 JPA가 DB에 연동시켜줌
public class Comment {

    @Id // @Id 어노테이션으로 이 필드가 PK임을 표시
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 값 자동 증가를 위한 어노테이션
    private Long commentId; // PK는 의미 없는 값이어야 개발할 때 편하다.
    
    // 댓글은 여러 개가 하나의 게시글(Post)에 속할 수 있으므로, Post와의 다대일(Many-to-One) 관계를 설정한다.
    // 여기서 Post 클래스를 사용함으로써 각 댓글이 어떤 게시글에 속해 있는지를 명확히 나타낼 수 있다. 
    // 아래의 어노테이션들은 이러한 연관관계를 나타내기 위해 필요하다.
    // 솔직히 굉장히 어려운 부분이라 직접 경험하면서 배우는 것이 빠를듯...
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String content;
    private String visibility; // 공개 범위 (예: "author_only", "everyone")
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder // 빌더 패턴 적용
    public Comment(String commentId, Post post, User user, String content, String visibility, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.commentId = commentId;
        this.post = post;
        this.user = user;
        this.content = content;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
```

- Entity에는 setter를 작성하지 않는다.
   - setter는 의도가 불분명하고, 변경하면 안되는 값임에도 변경가능한 값으로 착각할 수 있다.
   - 따라서, Entity에는 Builder 패턴을 사용한다.
   - Builder 패턴이 무엇인지에 대한 설명은 <a href="https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%EB%B9%8C%EB%8D%94Builder-%ED%8C%A8%ED%84%B4-%EB%81%9D%ED%8C%90%EC%99%95-%EC%A0%95%EB%A6%AC">여기에</a> 자세히 적혀 있다.
   - Builder 패턴은 이후에 Service 레이어에서 사용하게 된다.

<br>

### 2. CommentDTO 클래스 구현 
__담당 기능__: 클라이언트와 서비스 간의 데이터 전송을 위한 객체. 
클라이언트와의 상호작용 시 필요한 정보만을 포함하여 사용됩니다.

__주요 역할__: Entity와 구별하여, API 응답 시 전송할 필드만 포함하고 민감한 정보는 제외하는 등 데이터를 가공하거나 변환
```java
public class CommentDTO {
    private Long commentId;
    private Long postId;
    private Long userId;
    private String content;
    private String visibility;

    @Builder
    public Comment(Long commentId, Long postId, Long userId, String content, String visibility, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.content = content;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
```

- DTO에는 Entity의 PK였던 id 값을 뺀다.
   - 어차피 id는 의미없는 값이기 때문에 유저에게 필요하지 않다.
   - 그럼 id는 어디에 쓰냐? -> repository에서 ```findById``` 등의 메소드에서 사용한다.
- DTO에서는 ```Post post``` 대신 ```Long postId```를 사용한다.
   - Post post 객체를 그대로 포함하면, Post에 있는 모든 필드가 직렬화되어 전송될 가능성있다.
   - 즉, 이 댓글에 대한 정보를 전송할 때 Post 까지 조인해서 보내버리는 것은 매우 비효율적이기 때문에, postId까지만 전송

<br>

### 3. CommentRepository 인터페이스 구현
__담당 기능__: 데이터베이스와의 상호작용을 담당. 
Comment 엔티티를 데이터베이스에 생성, 조회, 수정, 삭제할 수 있도록 정의된 인터페이스이다.

__주요 역할__: JPA를 통해 데이터베이스에서 Comment 정보를 가져오거나 저장하는 등의 기능을 제공합니다.
```java
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> { }
```

- 내용은 채우지 않아도 된다. 스프링 부트가 자동으로 다음과 같은 메소드들은 생성하도록 설계해주기 때문이다.
   - ```findAll(), findAllById()```
   - ```saveAll()```
   - ```getOne(), findById()```
   - ```flush(), saveAndFlush()```
   - ```count(), existsById()```
   - ```delete(), deleteById,() deleteAll()```
   
<br>

### 4. CommentService 클래스 구현
__담당 기능__: 비즈니스 로직을 처리
예를 들어, 댓글 작성, 댓글 수정 등의 로직을 수행한다.

__주요 역할__: Repository와 Controller 사이에서 비즈니스 로직을 수행하며, 여러 Repository의 데이터들을 조합하는 등의 복잡한 작업을 처리한다.

```java
@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public CommentDTO getCommentByCommentId(Long commentId) {
        // commentId로 Comment 엔티티 조회
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        
        // 엔티티가 존재하지 않을 경우 예외 처리
        Comment comment = commentOptional.orElseThrow(() -> new IllegalArgumentException("Invalid comment ID"));

        // 조회한 Comment 엔티티를 CommentDTO로 변환하여 반환
        // 빌더 패턴을 여기서 사용한다
        return CommentDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUser().getId())
                .content(comment.getContent())
                .visibility(comment.getVisibility())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
```

- 기본적인 CRUD는 모두 만들어둬야 함.
   - CommentService의 경우 댓글 추가, 조회, 수정, 삭제 기능을 모두 구현해야 한다.
   
<br>

### 5. CommentController 클래스 구현
```java
@RestController // 이 클래스에서 리턴하는 문자열을 그대로 응답 메시지에 넣겠다는 의미의 어노테이션
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}") // /comments/{id} 에 GET 요청이 오면 실행됨
    public ResponseEntity<CommentDTO> getCommentByCommentId(@PathVariable Long id) {
        CommentDTO commentDTO = commentService.getCommentByCommentId(id);
        return new ResponseEntity<>(commentDTO, HttpStatus.OK);
    }
}
```

<br>

## ✏️ 추가 지식
### ■ Swagger
Swagger는 API 문서를 자동으로 구성하는 도구이다.
애플리케이션의 모든 End Point를 볼 수 있고, Postman 처럼 요청을 보내고 응답을 수신할 수 있다.

spring boot에서 Swagger를 사용하기 위해서는 다음의 과정을 거쳐야 한다.

1. 의존성 추가
```implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'```

2. SwaggerConfig 클래스 생성
```
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("API Test") // API의 제목
                .description("Swagger UI") // API에 대한 설명
                .version("1.0.0"); // API의 버전
    }
}
```

3. API를 사용하는 컨트롤러 생성
여기에 ```@Operation``` 어노테이션을 사용하여 각 API에 대한 설명을 추가할 수 있다.
```@ApiResponses``` 어노테이션을 사용하면 응답 코드에 대한 정보를 나타낼 수도 있다.

아래와 같은 방식으로 Controller에 붙여주면 된다.
```java
@RestController     
@Operation(
            summary = "댓글 추가",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful operation",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = SuccessResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Bad request",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Bad credentials",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}") // /comments/{id} 에 GET 요청이 오면 실행됨
    public ResponseEntity<CommentDTO> getCommentByCommentId(@PathVariable Long id) {
        CommentDTO commentDTO = commentService.getCommentByCommentId(id);
        return new ResponseEntity<>(commentDTO, HttpStatus.OK);
    }
}
```

<br>

### ■ docker
https://velog.io/@jaewon-ju/Docker