---
title: "[TroubleShooting] C언어 SIGSEGV"
description: "C언어에서 발생한 Segmentation Fault"
date: 2024-11-01T07:46:39.133Z
tags: ["TROUBLESHOOTING"]
slug: "TroubleShooting-C언어-SIGSEGV"
categories: TroubleShooting
velogSync:
  lastSyncedAt: 2025-08-18T06:18:45.065Z
  hash: "5ac6fd7d3b2a368c7d2db44fb158b485dd1295474f226b98f83a46fda04fe99a"
---

프로젝트: MAFM에서 C언어로 파일 READ를 하는 함수를 짜던 중 오류가 발생했다.

```
Process finished with exit code 139 (interrupted by signal 11:SIGSEGV)
```

<br>

### ✏️ 코드
문제가 발생했던 코드는 아래와 같다.

```c
// get_file_data: 주어진 파일 경로에 대한 정보를 읽고 필요한 데이터를 반환
// 입력: path (파일 경로)
// 출력: 파일 정보 배열 (파일 경로, 파일 이름, 파일 내용 조각)
/* 파일 정보 배열의 구조:
 * data[0]: 파일의 전체 경로 (char*)
 * data[1]: 파일의 이름 (char*)
 * data[2], data[3], ...: 파일 내용을 일정 크기(chunkSize)로 나눈 조각들 (char*)
 * 마지막 data[idx + 1]: NULL 포인터 (배열의 끝을 알리기 위해)
*/
char** get_file_data(const char* path) {
    // 파일을 읽기 모드로 엽니다.
    FILE *file = fopen(path, "rb");
    if (!file) {
        perror("Failed to open file"); // 파일 열기 실패 시 오류 메시지 출력
        return NULL; // 실패 시 NULL 반환
    }

    // 파일 이름을 가져옵니다.
    char *fname = get_filename(path);
    if (!fname) {
        perror("Failed to get filename"); // 파일 이름을 가져오는 데 실패하면 오류 메시지 출력
        fclose(file); // 파일 닫기
        return NULL; // 실패 시 NULL 반환
    }

    // 파일이 이미지 또는 비디오인지 확인합니다.
    int is_image_or_video_flag = is_image_or_video(path);

    // 이미지 또는 비디오 파일일 경우
    if (is_image_or_video_flag) {
        char **data = malloc(sizeof(char *) * 3); // data 배열에 3개의 포인터 공간을 할당합니다.
        if (!data) {
            perror("Failed to allocate memory for data array"); // 메모리 할당 실패 시 오류 메시지 출력
            free(fname); // 파일 이름 메모리 해제
            fclose(file); // 파일 닫기
            return NULL; // 실패 시 NULL 반환
        }
        data[0] = strdup(path); // 경로 복사
        if (!data[0]) {
            perror("Failed to duplicate path"); // 경로 복사 실패 시 오류 메시지 출력
            free(data); // data 배열 해제
            free(fname); // 파일 이름 해제
            fclose(file); // 파일 닫기
            return NULL; // 실패 시 NULL 반환
        }
        data[1] = fname; // 파일 이름 저장
        data[2] = NULL; // 마지막에 NULL 포인터 설정 (배열의 끝을 알리기 위해)
        fclose(file); // 파일 닫기
        return data; // data 배열 반환
    }

    // 일반 파일일 경우, 초기 배열 크기를 설정합니다.
    int maxChunks = 4;
    char **data = (char **)malloc(sizeof(char *) * maxChunks); // 초기 크기 4로 data 배열 할당
    if (!data) {
        perror("Failed to allocate memory for data array"); // 메모리 할당 실패 시 오류 메시지 출력
        free(fname); // 파일 이름 해제
        fclose(file); // 파일 닫기
        return NULL; // 실패 시 NULL 반환
    }

    data[0] = strdup(path); // 파일 경로 복사
    if (!data[0]) {
        perror("Failed to duplicate path"); // 파일 경로 복사 실패 시 오류 메시지 출력
        free(data); // data 배열 해제
        free(fname); // 파일 이름 해제
        fclose(file); // 파일 닫기
        return NULL; // 실패 시 NULL 반환
    }

    data[1] = fname; // 파일 이름 저장

    int idx = 2; // 데이터 조각을 저장할 인덱스 시작 (0과 1은 경로와 이름)
    int chunkSize = 500; // 각 조각의 크기 (500바이트)
    int bytesRead;

    // 파일 내용을 500바이트씩 읽습니다.
    while (1) {
        if (idx >= maxChunks) {
            // 현재 배열의 크기가 부족할 경우 크기를 2배로 늘립니다.
            maxChunks *= 2;
            char **temp = realloc(data, maxChunks * sizeof(char *));
            if (temp == NULL) {
                perror("Failed to reallocate memory for data array"); // 메모리 재할당 실패 시 오류 메시지 출력
                // 이미 할당된 메모리 해제
                for (int i = 0; i < idx; i++) {
                    free(data[i]);
                }
                free(data);
                fclose(file);
                return NULL; // 실패 시 NULL 반환
            }
            data = temp; // 재할당된 메모리 주소로 업데이트
        }

        // 새로운 조각을 위한 메모리 할당
        data[idx] = (char *)malloc(chunkSize * sizeof(char));
        if (data[idx] == NULL) {
            perror("Failed to allocate memory for chunk"); // 메모리 할당 실패 시 오류 메시지 출력
            // 이미 할당된 메모리 해제
            for (int i = 0; i < idx; i++) {
                free(data[i]);
            }
            free(data);
            fclose(file);
            return NULL; // 실패 시 NULL 반환
        }

        // 파일에서 chunkSize만큼 읽기
        bytesRead = fread(data[idx], 1, chunkSize, file);
        if (bytesRead > 0) {
            if (bytesRead < chunkSize) {
                // 만약 읽은 바이트가 chunkSize보다 적다면 메모리 크기 조정
                char *adjusted = realloc(data[idx], bytesRead);
                if (adjusted) {
                    data[idx] = adjusted;
                }
            }
            idx++;
        }
        if (bytesRead < chunkSize) {
            if (feof(file)) {
                break; // 파일 끝에 도달하면 종료
            } else if (ferror(file)) {
                perror("Error reading file"); // 파일 읽기 중 오류 발생 시 메시지 출력
                // 이미 할당된 메모리 해제
                for (int i = 0; i <= idx; i++) {
                    free(data[i]);
                }
                free(data);
                fclose(file);
                return NULL; // 실패 시 NULL 반환
            }
        }
    }

    // 마지막에 NULL 포인터 설정 (배열의 끝을 알리기 위해)
    if (idx < maxChunks) {
        data[idx] = NULL;
    } else {
        // 추가 공간이 필요하면 재할당하여 NULL 포인터 추가
        char **temp = realloc(data, (idx + 1) * sizeof(char *));
        if (temp == NULL) {
            perror("Failed to reallocate memory for terminating NULL pointer"); // 메모리 재할당 실패 시 오류 메시지 출력
            // 이미 할당된 메모리 해제
            for (int i = 0; i < idx; i++) {
                free(data[i]);
            }
            free(data);
            fclose(file);
            return NULL; // 실패 시 NULL 반환
        }
        data = temp;
        data[idx] = NULL;
    }

    fclose(file); // 파일 닫기
    return data; // 파일 정보와 조각들을 포함한 data 배열 반환
}


// 파일 데이터를 해제하는 함수 (get_file_data로부터 반환된 메모리 해제)
void free_file_data(char** data) {
    if (!data) return;
    for (int i = 0; data[i] != NULL; i++) {
        free(data[i]); // 각 문자열에 할당된 메모리 해제
    }
    free(data); // data 포인터 자체 해제
}

// 파일 데이터 배열을 해제하는 함수
void free_file_data_array(char*** file_data_array, int num_files) {
    for (int i = 0; i < num_files; i++) {
        free_file_data(file_data_array[i]);
    }
    free(file_data_array);
}

// collect_file_data_recursive: 지정된 디렉터리를 재귀적으로 탐색하며 파일 데이터를 수집
// 입력: dir_path (탐색할 디렉터리 경로), num_files (수집된 파일 개수 포인터), file_data_array (파일 데이터 배열 포인터), depth (재귀 깊이)
// 출력: 없음 (num_files와 file_data_array가 수정됨)
/* file_data_array는 파일 데이터를 가진 3차원 배열이다.
 * file_data_array[0]는 첫 번째 파일의 데이터를 가리키고, file_data_array[1]는 두 번째 파일의 데이터를 가리킨다.
 * file_data_array[i][j]는 i번째 파일 중 j번째 data(get_file_data의 리턴 배열)를 의미한다.
 * 즉, file_data_array[0][0]는 첫 번째 파일의 전체 경로를 의미한다.
 * file_data_array[i][j][k]는 단순 문자이므로 큰 의미가 없다.
*/
void collect_file_data_recursive(const char* dir_path, int* num_files, char**** file_data_array, int depth) {
    if (depth > 3) {
        return;
    }

    DIR *d = opendir(dir_path);
    if (!d) {
        return;
    }

    struct dirent *dir;
    int alloc_size = 4;

    // 동적 메모리 할당 후, 메모리 누수 방지를 위한 코드 추가
    while ((dir = readdir(d)) != NULL) {
        // 현재 디렉토리와 상위 디렉토리는 건너뛰기
        if (strcmp(dir->d_name, ".") == 0 || strcmp(dir->d_name, "..") == 0) {
            continue;
        }

        char full_path[512];
        snprintf(full_path, sizeof(full_path), "%s/%s", dir_path, dir->d_name);

        struct stat st;

        // 파일 또는 디렉토리의 정보(stat 구조체)를 가져오기
        if (stat(full_path, &st) == 0) {
            if (S_ISREG(st.st_mode)) {
                // 일반 파일일 경우, 파일 데이터를 수집하는 함수 호출
                char **data = get_file_data(full_path);
                if (data) { // 파일 데이터가 성공적으로 수집된 경우
                    (*num_files)++; // 파일 수 증가

                    // 파일 수가 할당된 크기를 초과하는 경우
                    if (*num_files > alloc_size) {
                        alloc_size *= 2;
                        char ***temp = realloc(*file_data_array, sizeof(char**) * alloc_size);
                        if (!temp) { // realloc 실패 시 메모리 해제
                            free_file_data(data);
                            closedir(d);
                            return;
                        }
                        *file_data_array = temp;
                    }

                    (*file_data_array)[*num_files - 1] = data;
                }
            } else if (S_ISDIR(st.st_mode)) {
                collect_file_data_recursive(full_path, num_files, file_data_array, depth + 1);
            }
        }
    }
    closedir(d); // 디렉토리 닫기
}

char*** get_all_file_data(const char* dir_path, int* num_files) {
    *num_files = 0;
    char*** file_data_array = malloc(sizeof(char **) * 4);
    collect_file_data_recursive(dir_path, num_files, &file_data_array, 1);
    return file_data_array;
}

int main(void){
    int num_files = 0;
    get_all_file_data("/Users/Ruffles/Projects/MAFM/MAFM/mafm/MAFM_test", &num_files);

    return 0;
}
```


<br>

### ✏️ 문제
문제는 collect_file_data_recursive에 존재했다.

> collect_file_data_recursive는 `file_data_array` 에 파일의 정보를 담는 함수이다.
- root 디렉토리 내부의 파일들을 다 읽을 때까지 끝나지 않는다.
- `file_data_array` 에는 모든 파일의 정보가 들어간다.

크기가 큰 파일이 다수 존재한다면?
➜ `file_data_array` 의 크기를 realloc 할 때 메모리 초과 현상이 발생한다.

예를들어 25KB 파일 10개를 `file_data_array`에 저장한다고 가정해보자.
`file_data_array`에는 모든 파일의 정보가 저장되어야 하므로 최소 250000 Byte의 메모리를 차지한다.
파일이 더 많아지면, `file_data_array`에는 그만큼 더 부하가 걸린다.




<br>

### ✏️ 해결방법
1. `file_data_array` 의 내용을 일정 크기마다 다른 공간에 저장시킨다. (EX - 1000 Byte 마다 DB에 저장)
2. recursive를 사용하지 않는다.

필자는 2번의 방법을 선택했다.
각 파일의 내용을 읽어서 바로바로 DB에 저장하는 것이다.
디렉토리 탐색은 python에서 `os.walk()`를 사용해서 구현하였다.