---
slug: "/2023/05/10/javascript.md"
title: "코드로 이해하는 일시적 데드존 TDZ"
date: 2023-05-10
layout: post
tags:
  - javascript
---

# 머리말

ES2015에서 등장한 일시적 데드존(이하 TDZ)을 코드를 통해 명확하게 아는 것을 목적으로 본 글을 쓴다. TDZ를 설명하기 위해서는 **호이스팅** 을 먼저 설명하고 TDZ 등장의 이유와 TDZ의 개념을 코드를 통해 정확하게 알아본다.

# ES2015 이후의 호이스팅

var가 호이스팅 된다는 사실은 너무나도 잘 알려져있다. 아래의 코드와 같이 var는 변수가 선언되기 전에도 사용할 수 있으며 사용되는 곳 아래에서 선언되어도 해당 변수를 사용할 수 있다.

```ts
function ex() {
  console.log(result); // undefined
  result = 10;
  console.log(result); // 10
  var result = 20;
}
```

그렇다면 ES2015 스펙의 let, const는 어떠한가. 선언 되기전의 변수에 접근때 에러를 발생시킨다.

```ts
function ex2() {
  console.log(result); // ReferenceError: Cannot access 'result' before initialization
  let result;
  console.log(result); // undefined
  result = 23;
}
```

이 결과를 통해 let, const가 호이스팅이 일어나지 않는다고 생각할 수 있겠지만 let, const는 분명히 호이스팅된다. 단지 var와는 다르게 호이스팅될 뿐이다.

let과 const가 호이스팅이 되지 않는다면 다음과 같은 코드결과가 생길 수 있을까. 호이스팅이 일어나지 않는다면 외부의 result에 10이 할당이 되고 result는 10이 되어야 하지만 내부의 result 선언이 호이스팅 되었기 때문에 내부 블록에서는 result에 접근할 수 없게 되었다.

```ts
let result; // 외부 result
function hosting() {
  result = 10;
  console.log(result); // ReferenceError: Cannot access 'result' before initialization
  let result; // 내부 result
}
hosting();
```

# TDZ의 이해

위에서 봤던 코드의 동작을 설명할 수 있는 개념이 바로 TDZ다. var와 마찬가지로 자바스크립트 엔진은 코드를 실행하기전 let, const선언을 호이스팅하여 처리한다. 그러나 해당 변수에 접근할 수 있도록하고 `undefined`을 제공하는 대신 엔진은 해당 변수를 `before initialization` 으로 표시한다.

```ts
let result; // 외부 result
function hosting() {
  // 여기에 result를 예약한다
  result = 10;
  console.log(result); // ReferenceError: Cannot access 'result' before initialization
  let result; // 내부 result - 여기에서 TDZ가 끝나고 변수를  초기화한다
}
hosting();
```

위의 코드는 TDZ의 시간순서를 잘 나타내주는 예시이다. TDZ는 코드 실행이 선언이 나타나는 스코프에 들어갈 때 시작되고 선언이 될 때까지 계속 유지된다.(선언이 되는 순간까지 `before initialization`상태이다)

# TDZ는 공간적 개념이 아닌 시간적 개념이다

이때까지의 내용은 대부분 자바스크립트 개발자면 대부분 다 아는 내용일 것이다. 이 섹션의 제목인 **'TDZ는 공간적 개념이 아닌 시간적 개념'** 의 내용이 내가 전하려는 TDZ 내용의 핵심 포인트이다.
나 또한 그래왔고 TDZ의 용어에 속아 TDZ(Temporal Dead Zone)를 공간적 개념으로 생각하는 경우가 있다. 아래의 코드를 살펴보자.

```ts
function tdz() {
  const func = () => {
    console.log(value);
  };
  let value = 42;
  func();
}

tdz();
```

만약 TDZ의 개념이 공간이라면 tdz함수의 inner function 인 func의 value는 사용될 수 없으며 해당함수의 실행도 에러가 발생해야한다. 하지만 TDZ는 시간의 개념이기 함수의 실행전에 value가 할당 되었기 때문에 func 내부의 value 값은 42가 할당되어있다.

# 정리

1.  let, const는 var와 마찬가지로 호이스팅 된다.
2.  하지만 var와 다른 방식으로 호이스팅이 된다.
3.  let, const의 스코프에서 선언되기 전까지 TDZ가 적용된다
4.  let, const는 상위 스코프, 하위스코프가 각각 존재할때, 상위 스코프에서 선언되었더라도 하위스코프에서 섀도잉선언이 있으면 하위스코프에서 선언되기 전까지 마찬가지로 TDZ가 적용된다
5.  **TDZ는 공간의 개념이 아니라 시간의 개념이다**

# 참고

- [웹 개발자를 위한 자바스크립트의 모든 것](https://product.kyobobook.co.kr/detail/S000061550045)
