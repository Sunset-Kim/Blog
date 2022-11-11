---
slug: "/2022/11/12/Vanlia-Route.md"
title: "몇줄의 코드로 구현하는 Router"
date: 2022-11-12
layout: post
tags:
  - Javascript
image: ./organize.jpeg
---

# 프론트엔드 채용의 트렌드

프론트엔드 개발자의 기술변화가 잦은 만큼, 프론트엔드 개발자의 채용트렌드도 바뀌고 있는 것 같다. 1년 전만해도 주니어정도의 레벨에서 테스트코드의 작성(Unit, e2e 등)이라던가 typescript, graphQL 같은 기술들은 우대사항에만 있을 뿐 자격요건에 들어가지는 않았다. 또 알고리즘만 잘 풀면되는 채용이 많았다면 최근 트렌드는 과제, 알고리즘, 손코딩 등등으로 점점 우수한 프론트엔드 개발자를 찾고 있는 형국인 것 같다.
프론트엔드 개발자들이 점점 많아지면서 양질의 컨텐츠도 늘어나고 있는 데, 스터디의 트렌드가 Vanlia Javascript와 Frameworkless 한 웹 개발의 기본지식을 공부하는 스터디들도 많아지고 있는 것 같다.

- [Programmers - 프론트엔드 개발을 위한 자바스크립트(feat. VanillaJS)](https://school.programmers.co.kr/learn/courses/15244)
- [Next Step - TDD, 클린 코드 with JavaScript](https://edu.nextstep.camp/c/BRaNdTQx/)

# 그 것은 괴물이 아니다.

과거에 React-Router 없이 Router를 만들라는 과제를 받았을 때의 충격은 아직도 잊을 수 없다. 그 당시 내가 만들어 본 라이브러리는 캐러셀 밖에 없으며, 그 마저도 실제 프로젝트에 적용할 때는 나보다 잘 짜놓은 library를 찾기 바빴기 때문이다. 더군다나 Router 같은 건 나보다 훌륭한 개발자들이 짜고 나는 그걸 쓰기만 할 것이라고 굳게 믿기도 했다.
과제를 완수하기 위해 React-Router-Dom의 이전버전, 최신버전까지 직접 들여다보고 구현에 필요한 필수사항 몇가지를 공부하고 실제로 구현을 했다. 생각보다 Router는 무시무시한 괴물이 아니였으며, 내 수준 혹은 이 글을 읽고 있는 여러분 수준에도 그리 어렵지 않으리라 확신한다.

# 단, 몇줄의 코드로 시작하기

아래의 코드가 작성이 되면 여러분의 웹사이트에서 각각의 페이지로 라우팅되는 모습을 볼 수 있습니다. 라우팅을 구현을 할 때 핵심이 되는 로직은 다음과 같이 url의 pathName에 따라 페이지를 나눠서 보여주는 것이다.

```js
const { pathName } = window.location;
if (pathName === "/") {
  // index page render
} else if (pathName === "/about") {
  // about page render
}
```

# SPA에서의 라우터

SPA에서는 HTML anchor tag의 기본 동작 대신에 내부에서 url change를 감지하여 page를 렌더링 해주면 된다. 당연한 이유로 뒤로가기, 앞으로가기 등 broswer의 history한 기능을 사용가능하게 하기 위해 hitory Api의 도움도 받는다.
다음과 같은 절차로 라우터를 설계한다

- anchor의 기본동작을 막고
- pushState로 url를 변경
- popState로 변경을감지해서 route를 작동시킨다.

```js
function router() {
  const { pathName } = window.location;
  if (pathName === "/") {
    // index page render
  } else if (pathName === "/about") {
    // about page render
  }
}

documents.addEventListener("click", (e) => {
  if (e.target.tagName === "a") {
    return;
  }
  e.preventDefault();
  const { url } = e.target.dataset; // data-url 로 href를 따로 옮겨놓을 수도 있다.
  history.pushState(null, null, url);
});

window.addEventListener("popstate", router);
```

## 참고
