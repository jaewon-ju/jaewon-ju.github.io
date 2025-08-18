---
title: "[CS 지식] Inngest"
description: "Inngest란? #Inngest #Inngest_nextjs #Inngest_cloudflare_workers"
date: 2025-04-02T07:39:45.053Z
tags: ["CS지식"]
slug: "CS-지식-Inngest"
velogSync:
  lastSyncedAt: 2025-08-18T06:18:44.499Z
  hash: "4b88cb8b52fa712d371f3d1e839b777ac16176050f46e765c9ada67693ef7ae6"
---

#### Cloudflare Workers + R2 환경에서 Inngest 기반 워크플로우 구축기

이번 글에서는 Firebase Functions 환경에서 사용하던 Storage Trigger 기반 워크플로우를 `Cloudflare Workers + R2 + Inngest` 조합으로 마이그레이션한 과정을 공유한다. 

특히 **Inngest의 이벤트 기반 워크플로우 시스템**을 활용해, Cloudflare R2에 파일이 업로드되었을 때 후처리 작업을 자동으로 실행하는 구조를 구현하였다.

<br>

---

## ✏️ Inngest란?

>[Inngest](https://www.inngest.com)
: 이벤트 기반 서버리스 워크플로우 플랫폼

간단히 설명하자면, 트리거가 발생했을때 특정 로직을 실행시켜주는 도구이다.

주요 기능은 아래와 같다.

- 트리거 기반 비동기 함수 실행
- 이벤트 발송 → 워크플로우 자동 실행
- 재시도, 스텝 단위 실행, 의존성 관리 등 내장
- Dev 서버 또는 셀프 호스팅 가능


<br>


### ◼︎ 구현한 워크플로우 시나리오

1. 사용자가 파일 업로드를 요청
2. Cloudflare Worker가 R2에 파일을 저장
3. 업로드 완료 후 Inngest 서버에 `file.uploaded` 이벤트 전송
4. 프론트의 `/api/inngest`에 정의된 워크플로우가 실행됨
5. 워크플로우 내부에서 백엔드의 후처리 API(`/storage/post-upload`) 호출
6. 썸네일 생성, 메타데이터 추출 등 후처리 수행

<br>

---

### ◼︎ 프론트엔드 구조 (Next.js App Router)

#### `/app/api/inngest/client.ts`
```ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "wedeo-inngest",
  baseUrl: process.env.INNGEST_BASE_URL,
  eventKey: process.env.INNGEST_EVENT_KEY,
});
```

#### `/app/api/inngest/route.ts`
```ts
import { serve } from "inngest/next";
import { inngest } from "./client";
import { onFileInBucketCreate } from "./workflow";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [onFileInBucketCreate],
});
```

#### `/app/api/inngest/workflow.ts`
```ts
import { inngest } from "./client";

export const onFileInBucketCreate = inngest.createFunction(
  { id: "on-file-in-bucket-create" },
  { event: "file.uploaded" },
  async ({ event, step }) => {
    const { userId, fileId } = event.data;

    await step.run("Call worker's post-upload handler", async () => {
      const res = await fetch("http://localhost:8787/storage/post-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, fileId }),
      });

      if (!res.ok) {
        throw new Error(`Worker 처리 실패: ${await res.text()}`);
      }
    });

    return { status: "ok" };
  }
);
```

<br>

---

### ◼︎ 백엔드 구조 (Cloudflare Worker)

#### `uploadFileToStorage`
```ts
export const uploadFileToStorage = async (
  bucket: R2Bucket,
  inngestBaseUrl: string,
  inngestEventKey: string,
  filePath: string,
  userId: string,
  fileId: string,
  file: Buffer,
) => {
  await bucket.put(filePath, file);

  const response = await sendInngestEvent(inngestBaseUrl, inngestEventKey, "file.uploaded", {
    userId,
    fileId,
  });

  return filePath;
};
```

#### `sendInngestEvent`
```ts
export const sendInngestEvent = async (
  inngestBaseUrl: string,
  inngestEventKey: string,
  name: string,
  data: any
) => {
  return await fetch(`${inngestBaseUrl}/e/${inngestEventKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, data }),
  });
};
```
