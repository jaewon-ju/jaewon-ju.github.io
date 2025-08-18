---
title: "[MAFM] Watchdog 적용, 최종 결과물"
description: "셈틀제 최종 결과물"
date: 2024-11-13T16:18:20.229Z
tags: ["프로젝트"]
slug: "MAFM-watchdog"
thumbnail: "https://velog.velcdn.com/images/jaewon-ju/post/74bc8317-827f-4791-9f9a-52ff488167fa/image.png"
categories: 프로젝트
velogSync:
  lastSyncedAt: 2025-08-18T06:18:45.012Z
  hash: "466a73633d280a75091e10597fce0afbaa6c20934e809ad5f17d66b0870a15d7"
---


## ✏️ Watchdog
현재 MAFM은 시스템이 실행되었을 때를 기준으로 파일 정보를 Embedding한다.

> 만약 파일이 수정, 삭제, 생성, 이동 된다면?
➜ 파일 변경 사항을 감지하고, 새롭게 Embedding하는 기능이 필요하다.

<br>

해당 기능을 구현하기 위해, 파이썬 라이브러리인 `Watchdog`을 사용했다.

>#### Watchdog
: 파일 시스템의 변경 사항을 실시간으로 감시할 수 있도록 도와주는 도구

<br>

### ■ 적용
Watchdog을 프로젝트에 적용시켰다.
파일이 수정, 삭제, 생성, 이동되는 경우, 파일을 다시 Embedding하고 VectorDB에 저장하는 로직을 구현했다.

수정 ➜ 파일을 다시 Embedding 후 VectorDB에 저장 + 파일 구조 DB 수정
생성 ➜ 파일을 새로 Embedding 후 VectorDB에 저장 + 파일 구조 DB에 추가
삭제 ➜ VectorDB에서 해당 파일 삭제 + 파일 구조 DB에서도 삭제
수정 ➜ VectorDB에 저장된 내용을 그대로 다른 VectorDB에 이동시킴 + 파일 구조 DB 수정

<br>

다음은 생성 로직의 예제이다.

```python
# 생성 로직
    def on_created(self, event):
        print("--created--", flush=True)
        """파일 생성 이벤트 처리 함수"""
        if self.is_dot_file(event.src_path) or self.is_ignored_file(event.src_path):
            return  # 숨김 파일과 무시할 패턴을 가진 파일은 무시

        absolute_file_path = event.src_path
        dirpath = os.path.dirname(absolute_file_path)
        dirname = os.path.basename(dirpath)

        if event.is_directory:
            print("created directory")
            try:
                initialize_vector_db(dirpath + "/" + dirname + ".db")  # 벡터 DB 초기화
                id = insert_file_info(absolute_file_path, 1, "filesystem.db")
                insert_directory_structure(
                    id, dirpath, os.path.dirname(dirpath), "filesystem.db"
                )
            except Exception as e:
                print(f"Error initializing vector DB for directory: {e}")
        else:
            print("created file")
            insert_file_info(
                absolute_file_path, 0, "filesystem.db"
            )  # 파일 정보 DB에 추가

            # 파일 형식에 따라 데이터를 읽고 500바이트 크기의 배열로 분할
            if absolute_file_path.endswith(".pdf"):
                text_content = read_pdf(absolute_file_path)
                text_chunks = split_text_into_chunks(text_content)
            elif absolute_file_path.endswith(".docx"):
                text_content = read_word(absolute_file_path)
                text_chunks = split_text_into_chunks(text_content)
            else:
                # 일반 텍스트 파일일 경우
                file_chunks = get_file_data(absolute_file_path)
                text_chunks = file_chunks[2:]  # 필요한 데이터 조정


            # 벡터 DB에 저장
            save(
                dirpath + "/" + dirname + ".db",
                get_id_by_path(absolute_file_path, "filesystem.db"),
                text_chunks,
            )
            print(f"Created file: {event.src_path}")
```



<br>

---

<br>

## ✏️ 오류
observer를 프로젝트에 적용한 후 실행시켜보니, 다음과 같은 오류가 발생했다.
```
Open /Users/Ruffles/Projects/MAFM/MAFM/mafm/MAFM_test/coding/coding.db failed, the file has been opened by another program
```

<br>

처음에는 VectorDB인 Milvus와의 Connection이 제대로 종료되지 않아 발생한 문제라고 생각했다.
하지만, vector_db.py 파일에 이미 `client.close()`를 통해 연결을 끊는 로직이 구현되어 있었다.

<br>

Docker를 통해 Milvus를 사용하거나 Garbage Collection을 수행해도 문제는 해결되지 않았다.
그러다 파일 시스템에 이상한 .lock 파일이 생성된 것을 발견했다.

> #### .lock file
: 파일이나 리소스에 대한 동시 접근을 제어하기 위해 생성되는 파일

확인해보니 모든 DB에 lock이 걸려 있었다.
`client.close()`를 호출했음에도 불구하고 왜 .lock 파일이 남아있을까?

<br>

### ■ 해결 방법
`client.close()`를 호출한 뒤, db.lock 파일을 수동으로 삭제해주었다.

```python
def delete_db_lock_file(db_name):
    dir_path = os.path.dirname(db_name)
    base_name = os.path.basename(db_name)

    lock_file = f"{dir_path}/.{base_name}.lock"
    if os.path.exists(lock_file):
        os.remove(lock_file)
    else:
        print(f"No lock file found for {lock_file}")
```


<br>

### ■ Milvus 자체의 오류?
이 문제는 Milvus 자체의 오류로 보였다.
GitHub에 Issue를 등록한 결과, .lock 파일은 프로세스가 완전히 종료된 경우에만 삭제된다는 답변을 받았다.

![](https://velog.velcdn.com/images/jaewon-ju/post/74bc8317-827f-4791-9f9a-52ff488167fa/image.png)

`client.close()`를 호출해도 프로세스가 남아 있으면 .lock 파일이 유지되는 것이 Milvus의 기본 동작이었다.

<br>

---

<br>

## ✏️ 최종 결과
MAFM(Multi-Agent File Management)은 기존 파일 관리 시스템의 한계를 극복하고 보다 효율적인 파일 검색 기능을 제공하는 지능형 파일 관리 시스템이다.

기존 시스템과의 차별점 3가지는 다음과 같다.

1. 정확성
   - 파일의 제목뿐만 아니라, 내용까지 읽어보고 탐색한다.
   - PDF와 Word의 내용까지 검색 가능하다.
   
2. 키워드 비종속성
   - 키워드에 종속되지 않는 파일 검색이 가능하다.
   
3. 다국어 지원
   - 한국어 쿼리로 영어 파일 검색이 가능하다.
   
   
<br>

<a href = "https://www.youtube.com/watch?v=NpaOWLcejEs">시연 영상</a>

서울시립대학교 컴퓨터과학부 프로젝트 공모전 [셈틀제] 3위를 수상했다!


> #### 교수님의 평가
- 프로젝트 내용과 구현 결과는 좋지만 상품성에 대한 의문이 있음
- MAFM 자체만으로 상품화 하기는 어렵다는 의견
- 차라리 하나의 `파일 관리 시스템`에 검색 기능으로써 MAFM을 삽입하는 것이 좋을 것 같다.

<br>

---

<br>

## ✏️ 느낀점
이번 프로젝트는 아이디어 구상에 정말 많은 시간을 쏟았다.

> `서비스` 라는 틀에서 벗어나 보자

웹 개발을 하다보면, 정말 있을만한 서비스는 다 있다는 것을 자주 느낀다.
괜찮은 아이디어다~ 싶으면 이미 github에 있는 경우가 대다수다.

그래서 이번 프로젝트는 조금 다르게 접근하고자 했다.
서비스와 OS 사이의 무언가를 만들어보고 싶었다.

결론적으론 MAFM도 일종의 서비스지만, 내가 기존에 만들던 웹 서비스들과는 결이 다른 것 같다.
python과 C를 써서 로직을 구현하고, VectorDB라는 새로운 DB를 써볼 수 있어서 좋았다.

다음번에는 NoSQL DB도 써봐야겠다.





