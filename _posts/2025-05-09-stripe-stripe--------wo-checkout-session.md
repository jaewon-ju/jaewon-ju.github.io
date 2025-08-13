---
title: "[Stripe] Stripe로 카드 정보 저장하기 W/O checkout Session
"
description: "checkout session을 사용하지 않고 카드 정보만 저장하는 방법"
date: 2025-05-09T08:53:51.617Z
tags: ["Stripe"]
slug: "Stripe-Stripe로-카드-정보-저장하기-WO-checkout-Session"
velogSync:
  lastSyncedAt: 2025-08-13T07:36:42.429Z
  hash: "2b55197f73517c6474b4b69d2bce148e6439bdddd6a586de20b39c1d615d778a"
---

## 목표
Stripe의 <span style = "color:red">Checkout Session을 사용하지 않고</span>, 사용자의 카드 정보를 웹사이트 내에서 직접 수집하고 저장하는 방법을 설명한다.
여기서 핵심은 `"결제는 하지 않고 카드 정보만 미리 받아두는 것"` 이다. 결제는 이후 필요할 때 따로 진행한다.

--- 

<br>

## ✏️ 핵심 개념 정리
### 1. SetupIntent

`SetupIntent`는 Stripe에서 결제 수단을 미리 등록할 때 사용하는 객체다.
결제는 하지 않지만, 사용자 카드가 유효한지 확인하고 Stripe 서버에 안전하게 저장하는 역할을 한다.

즉, `SetupIntent`는 **"결제 수단을 등록할 준비가 되었다"**를 Stripe에 선언하는 것이다.

- 따라서, `setupIntent` 생성만으로는 아무것도 등록되지 않는다.
- 반드시 `confirmCardSetup`을 호출해야 결제 수단이 등록된다.


<br>

### 2. PaymentIntent
`PaymentIntent`는 실제 결제를 실행할 때 사용하는 객체다.
`SetupIntent`로 등록해둔 payment_method를 사용해서 PaymentIntent를 만들어 결제할 수 있다.

<br>

### 3. Stripe Elements
Stripe가 제공하는 클라이언트 측 카드 입력 <span style="background-color:green">UI 컴포넌트다</span>.
`CardElement`, `PaymentElement` 등을 통해 카드 번호, 만료일, CVC 등을 사용자로부터 입력받을 수 있다.

⚠️ 보안상 중요한 점은, 카드 정보가 브라우저에서 Stripe로 직접 전달되므로 서버가 민감 정보를 다루지 않아도 된다는 것이다.

<br>

---

<br>



## ✏️ 코드
 전체 흐름 요약
>1. 사용자가 웹사이트의 CardElement에 카드 정보를 입력한다.
2. 제출 시, 백엔드 API(/api/create-setup-intent)를 호출해 SetupIntent를 생성하고 client_secret을 받아온다.
3. 프론트엔드는 stripe.confirmCardSetup(client_secret)으로 카드 정보를 인증한다.
4. 인증이 완료되면 Stripe 서버에 payment_method.id가 생성되고 저장된다.
5. 이 ID를 DB에 저장해두고, 나중에 PaymentIntent를 통해 결제에 사용한다.

```tsx
// stripe 초기화 설정
// Stripe 퍼블리시 키로 초기화
const stripePromise = loadStripe('pk_test_...');

// Elements 컴포넌트에 전달할 옵션 (mode: setup을 명시적으로 지정)
const options = {
  mode: 'setup' as const, // 결제가 아닌 카드 등록 목적
  currency: 'usd',
};

// 최상위 App 컴포넌트에서 Stripe context 구성
export default function App({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise} options={options}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RecoilRoot>
            <MainWrapper>{children}</MainWrapper>
          </RecoilRoot>
        </I18nextProvider>
      </Provider>
    </Elements>
  );
}
```

<br>

```tsx
export default function SetupForm() {
  const stripe = useStripe();        // Stripe 객체
  const elements = useElements();    // Stripe Elements 객체

  const [errorMessage, setErrorMessage] = useState(); // 에러 메시지 상태
  const [loading, setLoading] = useState(false);      // 로딩 상태
  const { data: session } = useSession();             // 로그인 세션
  const token = session?.accessToken;                 // 인증 토큰

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message); // 에러 메시지 설정
  };

  const handleSubmit = async (event) => {
    event.preventDefault();         // 폼 기본 동작 차단 (새로고침 방지)

    if (!stripe) return;            // Stripe.js가 아직 로드되지 않았다면 종료

    setLoading(true);               // 로딩 시작

    const { error: submitError } = await elements.submit(); // 카드 유효성 검사
    if (submitError) return handleError(submitError);

    // 백엔드 API 호출해서 SetupIntent 생성 → clientSecret 반환
    const clientSecret = (await createSetupIntent(undefined, undefined, token)).data;

    // Stripe에 카드 정보 등록 및 인증 요청
    const { error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      // 인증 실패 시 에러 처리
      handleError(error);
    } else {
      // 인증 성공 시 추가 처리 (예: 성공 메시지, DB 저장 등)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: { base: { color: 'white' } }, // 스타일 설정
        }}
      />
      <button type="submit" disabled={!stripe || loading}>
        Submit
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
```

<br>

```tsx
export const createPaymentMethod = async (
  stripe: Stripe,
  sql: postgres.Sql<{}>,
  userId: string,
): Promise<string> => {
  try {
    // 사용자 정보 조회 (Stripe customer_id 필요)
    const user: usersRowType = await usersRepository.findById(sql, userId);

    // Stripe SetupIntent 생성 (카드 등록만 수행)
    const setupIntent = await stripe.setupIntents.create({
      customer: user.customer_id!,           // Stripe customer 연결
      automatic_payment_methods: { enabled: true }, // 여러 결제 수단 지원 가능 (카드만 사용해도 문제 없음)
    });

    // client_secret을 프론트에 반환 → 카드 인증 시 사용
    return setupIntent.client_secret!;
  } catch (error: any) {
    // 에러 로깅 및 예외 처리
    logger.error('Failed to create payment method', {
      error_message: error.message,
      error_stack: error.stack,
      context: 'stripe.payment-method.ts',
      timestamp: new Date().toISOString(),
    });
    throw new Error(error as string);
  }
}
```


---

아래는 동일한 내용을 영어로 정리한 것입니다.


## Goal

This guide explains how to collect and save a user's card information directly on your website **without using Stripe Checkout Session**.
The key point is that you're **not charging the customer right away**, just saving their payment method for later use.

---

## ✏️ Core Concepts

### 1. SetupIntent

`SetupIntent` is a Stripe object used to register a payment method without charging the customer.
It ensures the card is valid and securely saves it to the Stripe server.

> Think of `SetupIntent` as telling Stripe:
> "I'm preparing to register a payment method."

* Creating a `SetupIntent` does **not** register anything by itself.
* You must call `confirmCardSetup` to actually register the payment method.

<br>

### 2. PaymentIntent

`PaymentIntent` is used when you're ready to charge the customer.
You can use a `payment_method` saved via `SetupIntent` to create a `PaymentIntent` and process the actual payment.

<br>

### 3. Stripe Elements

Stripe Elements are client-side <span style="background-color:green">UI components</span> for securely collecting payment information.
Examples include `CardElement`, `PaymentElement`, etc., which allow users to input their card number, expiry date, CVC, etc.

⚠️ The important security detail: card information is sent directly from the browser to Stripe — your server never touches sensitive data.

<br>

---

<br>

## ✏️ Code

### Overall Flow Summary

> 1. User inputs card info via `CardElement` on the website.
> 2. On submit, frontend calls a backend API (`/api/create-setup-intent`) to create a `SetupIntent` and receive a `client_secret`.
> 3. The frontend calls `stripe.confirmCardSetup(client_secret)` to authenticate the card info.
> 4. On success, a `payment_method.id` is created and stored on the Stripe server.
> 5. Save this ID in your database and use it later with `PaymentIntent` to charge the user.

```tsx
// Stripe initialization
const stripePromise = loadStripe('pk_test_...');

// Stripe Elements config: setup mode
const options = {
  mode: 'setup' as const, // setup only, not payment
  currency: 'usd',
};

// Global app context setup
export default function App({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise} options={options}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RecoilRoot>
            <MainWrapper>{children}</MainWrapper>
          </RecoilRoot>
        </I18nextProvider>
      </Provider>
    </Elements>
  );
}
```

<br>

```tsx
export default function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const token = session?.accessToken;

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe) return;

    setLoading(true);
    const { error: submitError } = await elements.submit();
    if (submitError) return handleError(submitError);

    const clientSecret = (await createSetupIntent(undefined, undefined, token)).data;

    const { error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      handleError(error);
    } else {
      // success handling (e.g., store payment_method.id)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: { base: { color: 'white' } },
        }}
      />
      <button type="submit" disabled={!stripe || loading}>
        Submit
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
```

<br>

```ts
export const createPaymentMethod = async (
  stripe: Stripe,
  sql: postgres.Sql<{}>,
  userId: string,
): Promise<string> => {
  try {
    // Lookup user to get customer_id
    const user: usersRowType = await usersRepository.findById(sql, userId);

    // Create SetupIntent linked to customer
    const setupIntent = await stripe.setupIntents.create({
      customer: user.customer_id!,
      automatic_payment_methods: { enabled: true },
    });

    // Return client_secret to frontend
    return setupIntent.client_secret!;
  } catch (error: any) {
    logger.error('Failed to create payment method', {
      error_message: error.message,
      error_stack: error.stack,
      context: 'stripe.payment-method.ts',
      timestamp: new Date().toISOString(),
    });
    throw new Error(error as string);
  }
}
```
