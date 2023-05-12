---
slug: "/2023/05/12/promise.md"
title: "draft:promise"
date: 2023-05-12
layout: post
tags:
  - javascript
---

# 프로미스는 왜 사용하는가

프라미스는 흔히 비동기작업을 수행하기 위해 사용한다고 알려져있다. 하지만 프로미스는 그 자체로는 아무런 일도 수행하지 못한다. 단지 비동기적 작업을 관찰하는 방법이다.

다시말하자면 프로미스는 **이미 비동기화된 작업의 완료를 관찰하는 수단을 제공하는 객체**이다.

# 프로미스의 기본

프로미스는 다음과 같은 세가지의 상태를 가질 수 있다

- pending: 대기
- fulfilled: 성공
- rejected: 실패

프로미스는 pending 상태로 시작해서 한 번만 다른 상태로 확정될 수 있다. 한번 상태가 확정이 되면 다른 상태로는 돌아갈 수 없다.
성공이 된 프로미스에는 값이 있고 실패한 프로미스에는 실패이유(일반적으로 오류지만 원하는 값을 사용할 수도 있음)가 있다.

프로미스의 상태와 값, 실패이유는 직접 관찰할 수 없다. 프로미스가 호출하는 핸들러 함수를 추가해야만 관찰할 수 있다. 자바스크립트 스펙의 프로미스는 핸들러를 등록하기 위한 3가지의 메서드를 가진다

- then: 프로미스가 fulfilled 되었을때 호출하는 핸들러를 등록
- catch: 프로미스가 rejected 되었을때 호출하는 핸들러를 등록
- finally: 무엇이는 상관없이 프로미스의 상태가 확정이 되었을때 호출하는 핸들러를 등록

프로미스의 가장 중요한점 중 하나는 then,catch, finally가 새로운 프로미스를 반환할 수 있다는 점이다

다음과 같은 코드를 보면서 다시 이야기 하자.

```ts
function example() {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        const isSuccess = Math.random() < 0.5;

        if (isSuccess) {
          resolve("success");
        } else {
          throw Error("failure");
        }
      } catch (error) {
        reject(error);
      }
    }, 100)
  );
}

example()
  .then((value) => console.log("fulfilled", value))
  .catch((e) => console.log("reject", e))
  .finally(() => {
    console.log("finally");
  });
```

위의 코드에서 Promise의 생성자에게 넘겨주는 함수를 실행자 함수 (executor)라 부른다. 이때 제공하는 인자의 resolve, reject의 이름은 취향에 따라 선언할 수 있다. 프로미스의 상태를 참조해 resolve 대신 fulfilled라는 이름은 어떠한가.
사실 프로미스 생성자에 제공하는 실행자 함수에서 resolve가 통용되는 이유를 알기위해서 우리는 프로미스의 확정된 상태(fulfilled)에서 다른 프로미스를 호출할 수 있다는 것을 기억해야 할 필요가 있다. 다른 프로미스로 resolve를 호출한다면 해당 프로미스가 다른 프로미스로 fulfilled 되며 이때 다른 프로미스는 다시 fulfilled, reject 될 수 있다.(완료는 되었지만 다른 thenable한 프로미스의 상태를 바라봄) 이러한 이유로 완벽한 종결의 의미인 fulfilled 대신 resolve를 통상적으로 사용한다.
만약 resolve가 프로미스가 아닌 값으로 호출한다면 그 값으로 fulfilled 될 것이다.

반면에 reject는 reject가 다른 프로미스로 호출 한다하더라도 다른 일을 하지 않고 항상 거부의 이유로서 사용한다.

# Thenable 과 프로미스

프로미스를 공부하다 보면 심심치않게 Thenable이라는 단어를 마주하게 되는데 Thenable의 대한 설명은 아래와 같다

> 자바스크립트의 프로미스는 ㄷECMAScript 사양에 정의된 규칙을 따르며, 이는 선행기술 특히 Promises/A+ 사양과 그에 이르는 작업에 크게 의존한다.
> ...(중략)
> 이 사양에서는 이름 다음과 같이 정의한다.

- 프라미스는 동작이 [Promises/A+ 사양]을 따르는 then 메서드를 사용하는 객체 또는 함수다
- "thenable"은 then 메서드를 정의하는 객체 또는 함수다

따라서 모든 프로미스는 thenable이고, 모든 thenable은 프로미스가 아니다.

thenable이 중요한 이유는 프로미스를 구현할때 프로미스를 fulfilled하기위한 단순한 값인지 아니면 thenable한 객체인지 알필요가 있는 데, 만약 호출한 값이 then 메서드의 유/무를 사용하여 객체인지 확인한다. 만약 메서드가 존재한다면 then을 통해 프로미스를 fulfilled로 확정한다.이때 then이 프로미스와는 상관없는 then을 가질 수 있기 때문에 조금은 불완전하다고 느낄 수 있다. 꼭 then이라는 메서드가 프로미스만을 위한 스펙이 아님을 명심하자.

```ts
const lazyReturn = (value) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const isSuccess = Math.random() < 0.5;

        if (isSuccess) {
          resolve(value);
        } else {
          throw Error("failure");
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });

const calculate = (value) => {
  const operator = {
    add(num) {
      value += num;
      return operator;
    },
    sub(num) {
      value -= num;
      return operator;
    },
    then(resolve, reject) {
      return lazyReturn(value).then(resolve).catch(reject);
    },
  };
  return operator;
};

calculate(5)
  .add(1)
  .then(
    (value) => console.log("결과는: ", value),
    (e) => console.log("실패 :", e)
  );
```

위의 코드는 마치 비동기 처럼 동작한다.

# 참고
