---
title: "[LingoConnect] 개발"
description: "새싹 해커톤 개발 내용"
date: 2024-07-16T14:18:45.576Z
tags: ["프로젝트"]
slug: "LingoConnect-개발"
thumbnail: "/assets/posts/d398ca16cd35eea0d42dfa6f719a9ec1a55d6cbd41ac79afb31887574270c468.png"
categories: 프로젝트
toc: true
velogSync:
  lastSyncedAt: 2025-08-19T12:12:04.692Z
  hash: "b44b31c9e6d0e783fbfad040f8986bca94f25e45dc3ded70c18c4e3f1e6210a9"
---

### 1. OpenAiClient.java


> OpenAI API와의 통신을 담당한다.
Assistant 생성, thread 생성, message 생성, run 생성 등을 제공한다.


Assistant API는 다음과 같은 과정을 통해 이용 가능하다.

1. Assistant 생성
2. thread 생성
3. message 생성
4. run 생성 - 프롬프트 실행 시점
5. message list에서 응답 메시지 조회

```java
// 핵심 코드: getResponse

public String getResponse(String threadId, String runId) throws InterruptedException {
        JsonObject object = null;
        String status = JsonParser.parseString(openAiClient.checkRun(threadId, runId)).getAsJsonObject().get("status").getAsString();
        while(!status.equals("completed")) {
            Thread.sleep(1000);
            object = JsonParser.parseString(openAiClient.checkRun(threadId, runId)).getAsJsonObject();
            status = object.get("status").getAsString();
        }

        JsonObject jsonObject = JsonParser.parseString(openAiClient.listMessages(threadId)).getAsJsonObject();
        log.info("jsonObject: {}", jsonObject);
        JsonArray data = jsonObject.getAsJsonArray("data");

        String result = data.get(0).getAsJsonObject()
                .get("content").getAsJsonArray()
                .get(0).getAsJsonObject()
                .get("text").getAsJsonObject()
                .get("value").getAsString();

        if(result == null){
            log.error("에러 발생");
            return null; // Return null if the messageId is not found or doesn't have text content
        }
        return result;
    }
```

<br>

---

<br>

### 2. GptService.java


>주요 역할:
GPT-3와의 상호작용을 관리한다.
사용자가 입력한 질문에 대해 GPT-3의 응답을 처리한다.

핵심 메서드:

askQuestion(String question): 주어진 질문에 대해 GPT-3의 응답을 반환한다.
JSON 객체를 구성하여 질문을 OpenAI API로 전송하고, 응답을 처리한다.

<br>

---

<br>

### 3. PronunciationEvalService.java

>주요 역할:
발음 평가를 수행한다.
주어진 오디오 파일을 기반으로 발음을 평가하고 점수를 반환한다.


발음 평가 API는 ETRI에서 제공한다.
https://aiopen.etri.re.kr/guide/Pronunciation

- pronunciationEval(String languageCode, String audioFileName)
: 주어진 언어 코드와 오디오 파일 이름을 사용하여 발음 평가를 수행한다.
오디오 파일을 Base64로 인코딩하여 전송하고, 응답에서 점수를 추출한다.

```java
@Service
@Slf4j
public class PronunciationEvalService {
    private final String openApiURL;
    private final String accessKey;
    private final String languageCode;
    private final String audioFilePath;

    public PronunciationEvalService(@Value("${etri.url}") String openApiURL,
                                     @Value("${etri.access-key}") String accessKey,
                                     @Value("${etri.language-code}") String languageCode,
                                     @Value("${etri.file-path}") String audioFilePath) {
        this.openApiURL = openApiURL;
        this.accessKey = accessKey;
        this.languageCode = languageCode;
        this.audioFilePath = audioFilePath;
    }

    public String evaluate(String audioFileName){
        Gson gson = new Gson();

        Map<String, Object> request = new HashMap<>();
        Map<String, String> argument = new HashMap<>();
        
        String filePath = audioFilePath + "/" + audioFileName;
        String audioContents = null;
        
        try {
            Path path = Paths.get(filePath);
            byte[] audioBytes = Files.readAllBytes(path);
            audioContents = Base64.getEncoder().encodeToString(audioBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }

        argument.put("language_code", languageCode);
        argument.put("audio", audioContents);
        request.put("argument", argument);

        URL url;
        Integer responseCode = null;
        String responBody = null;
        try {
            url = new URL(openApiURL);
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            con.setRequestProperty("Authorization", accessKey);

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.write(gson.toJson(request).getBytes("UTF-8"));
            wr.flush();
            wr.close();

            responseCode = con.getResponseCode();
            InputStream is = con.getInputStream();
            byte[] buffer = new byte[is.available()];
            int byteRead = is.read(buffer);
            responBody = new String(buffer);

            JsonObject object = JsonParser.parseString(responBody).getAsJsonObject();
            String result = object.get("return_object").getAsJsonObject().get("score").getAsString();

            log.info("평가 결과: {}", result);
            return result;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return responBody;
    }

}

```

<br>

---

<br>

## JsonObject
오늘 구현한 내용 중에서 가장 핵심적인 부분을 차지한 것은 바로 ```JsonObject```이다.

- JsonObject는 Java에서 JSON 데이터를 다루기 위한 클래스로, JSON 객체를 생성하고 조작할 수 있는 다양한 메서드를 제공한다.
- 외부 라이브러리인 Gson, Jackson 등에서 제공된다.

<br>

### ■ 주요 메소드
Gson을 사용하는 경우, 다음과 같은 메소드들을 제공한다.

1. ```fromJson()```
: JSON 문자열을 Java 객체로 변환

2. ```toJson```
: Java 객체를 JSON 문자열로 변환

3. ```JsonParser.parseString()```
: JSON 문자열을 jsonElement로 변환

>#### JsonElement VS JsonObject
JsonElement는 JSON 데이터의 모든 형태를 표현할 수 있는 <span style = "color:red">추상 클래스</span>이다.
즉, JsonObject는 JsonElement의 자식 클래스이다.<br>
JsonElement는 다음과 같은 자식 클래스를 갖고 있다.
- JsonObject
- JsonArray
- JsonNull
