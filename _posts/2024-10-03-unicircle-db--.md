---
title: "[UniCircle] DB 구성"
description: "DB 구성"
date: 2024-10-03T08:23:35.569Z
tags: ["프로젝트"]
slug: "UniCircle-DB-구성"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T00:55:53.290Z
  hash: "e866acb58d49ff0c60de7457c99f2f65f2e41e7dd162038c645ee7a818e6e99d"
---

## ✏️ 테이블 구조
Users
Board 
Comment
Circle
AdmissionForm
Hashtag


### 1. Users 테이블
| Column Name   | Data Type | Description               |
|---------------|-----------|---------------------------|
| user_id(PK)   | BIGINT   | 사용자 ID                |
| name          | VARCHAR   | 이름                      |
| nickname | VARCHAR | 닉네임 | 
| email         | VARCHAR   | 이메일                    |
| roles         | ENUM   | 사용자 구분(비회원, 입부 희망자, 입부 신청자, 동아리 관리자, 시스템 관리자)                    |
| password      | VARCHAR   | 비밀번호                  |
| created_at    | DATETIME  | 회원가입 날짜             |
| last_seen     | DATETIME  | 마지막 접속 시간          |
| circle_id (FK)    | BIGINT       | 동아리 ID (`Circle` 참조)   |

<br>

### 2. Board 테이블
| Column Name   | Data Type | Description                       |
|---------------|-----------|-----------------------------------|
| post_id  (PK)      | BIGINT   | 게시글 ID                         |
| user_id (FK)  | BIGINT       | 작성자 ID (`Users` 참조)          |
| circle_id (FK)  | BIGINT       | 동아리 ID (`Circle` 참조)           |
| title         | VARCHAR   | 게시글 제목                       |
| content       | TEXT      | 게시글 내용                       |
| visibility    | ENUM      | 공개 범위                         |
| hashtag_id (FK)| BIGINT      | 해시태그 ID (`Hashtag` 참조)     |
| is_notice     | BOOLEAN   | 공지사항 여부                     |
| created_at    | DATETIME  | 작성일                            |
| updated_at    | DATETIME  | 수정일                            |

<br>

### 2. Comment 테이블
| Column Name   | Data Type | Description                       |
|---------------|-----------|-----------------------------------|
| comment_id (PK)    | VARCHAR   | 댓글 ID                           |
| post_id (FK)  | BIGINT       | 게시글 ID (`Board` 참조)          |
| user_id (FK)  | BIGINT       | 작성자 ID (`Users` 참조)          |
| visibility    | ENUM      | 공개 범위                         |
| created_at    | DATETIME  | 작성일                            |
| updated_at    | DATETIME  | 수정일                            |

<br>

### 3. Circle 테이블
| Column Name       | Data Type | Description                       |
|-------------------|-----------|-----------------------------------|
| circle_id (PK)           | BIGINT   | 동아리 ID                         |
| name              | VARCHAR   | 동아리 이름                       |
| description       | TEXT      | 동아리 소개                       |
| created_at        | DATETIME  | 생성일                            |
| questions | TEXT | 동아리 질문 리스트 (JSON)
| admin_user_id (FK)| BIGINT       | 동아리 관리자 ID (`Users` 참조)   |
| hashtag_id (FK)   | BIGINT       | 해시태그 ID (`Hashtag` 참조)     |

<br>

### 4. AdmissionForm 테이블
| Column Name   | Data Type | Description                       |
|---------------|-----------|-----------------------------------|
| form_id (PK)       | BIGINT   | 신청서 ID                         |
| circle_id (FK)  | BIGINT       | 동아리 ID (`Circle` 참조)           |
| user_id (FK)  | BIGINT       | 작성자 ID (`Users` 참조)          |
| form_content  | TEXT      | 신청서 내용                       |
| admission_date| DATETIME  | 신청 날짜                         |
| status        | ENUM      | 신청 상태                         |

<br>

### 5. Hashtags 테이블
| Column Name   | Data Type | Description                       |
|---------------|-----------|-----------------------------------|
| hashtag_id (PK)    | VARCHAR   | 해시태그 ID                       |
| content       | VARCHAR   | 해시태그 내용                     |


M:N 관계인 Hashtag - Board는 따로 연결용 테이블을 하나 생성해줘야 할듯