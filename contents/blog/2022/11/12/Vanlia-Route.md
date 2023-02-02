---
slug: "/2022/11/12/Vanlia-Route.md"
title: "몇줄의 코드로 구현하는 Router"
date: 2022-11-12
layout: post
tags:
  - Javascript
image: ./organize.jpeg
---

# 프론트 진영의 빠른(?) 기술변화

프론트엔드 개발자의 기술변화가 잦은 만큼, 프론트엔드 개발자의 채용트렌드도 빠르게 바뀌고 있는 것 같다. 1년 전만해도 주니어정도의 레벨에서 테스트코드의 작성(Unit, e2e 등)이라던가 typescript, graphQL 같은 기술들은 우대사항에만 있을 뿐 자격요건에 들어가지는 않았다. 또 알고리즘만 잘 풀면되는 채용이 많았다면 최근 트렌드는 기술과제, 알고리즘, 손코딩 등등으로 점점 우수한 프론트엔드 개발자를 찾고 있는 형국인 것 같다.

오늘은 그 중 기술과제의 심심치않게 등장하는 route 기술에 관해 간략하게 공유하려 한다.

# 그 것은 괴물이 아니다.

오늘 공유할 코드는 괴물이 아니다. 나같이 react router로 router 기능을 처음 접한 개발자는 해당 기술의 과제를 접했을 때 굉장히 막막한 기분이 들 수도 있겠다. 과거에 React-Router 없이 Router를 만들라는 과제를 받았을 때의 충격은 아직도 잊을 수 없다. 그 당시 내가 만들어 본 라이브러리는 캐러셀 밖에 없으며, 그 마저도 실제 프로젝트에 적용할 때는 나보다 잘 짜놓은 library를 찾기 바빴기 때문이다. 더군다나 Router 같은 건 나보다 훌륭한 개발자들이 짜고 나는 그걸 쓰기만 할 것이라고 굳게 믿기도 했다.

# 라이브러리 살펴보기, 그리고 단서찾기

혹히 여러분은 라이브러리를 살펴본적이 있는가. 나는 자주 라이브러리를 까본다(라고 말하고 살펴본다). 해당 섹션에서는
과제를 완수하기 위해 React-Router-Dom의 직접 들여다보고 구현에 필요한 필수사항 몇가지 탐색하는 여정을 공유한다.
생각보다 Router는 무시무시한 괴물이 아니였으며, 내 수준 혹은 이 글을 읽고 있는 여러분 수준에도 그리 어렵지 않으리라 확신한다.

라이브러리의 기본적인 기능을 공부할때는 낮은 버전부터 순차적으로 올라가면서 공부를 하는 편이다. 다음은 react-router 0.2v 코드의 일부이다.

```js
var Route = React.createClass({

  componentWillMount: function () {
    RouteStore.registerRoute(this);

    if (!URLStore.isSetup() && ExecutionEnvironment.canUseDOM)
      URLStore.setup(this.props.location);

    URLStore.addChangeListener(this.handleRouteChange);
  },

  componentDidMount: function () {
    this.dispatch(URLStore.getCurrentPath());
  },

  componentWillUnmount: function () {
    URLStore.removeChangeListener(this.handleRouteChange);
  },

  handleRouteChange: function () {
    this.dispatch(URLStore.getCurrentPath());
  },

  match: function (path) {
    return findMatches(Path.withoutQuery(path), this);
  },


function getRootMatch(matches) {
  return matches[matches.length - 1];
}
// ... 생략
})

module.exports = Route;
```

다음과 같은 코드라인에서 Route 컴포넌트가 라이프사이클에 의해 router store에 자기자신을 등록하고 URL store에 이벤트를 등록하는 모습을 보인다. 해당 방법으로 URLStore를 추적해보면 아래와 같은 코드를 가지고 있음을 알 수 있다. 현재의 getCurrentPath 를 통해 현재의 주소를 알 수 있으며, push같은 작동이 발생했을 경우에 구독하고 있는 component에 change 이벤트를 전달하는 것을 볼 수 있다.

```js
var URLStore = {
  // ...

  getCurrentPath: function () {
    if (_location === "history") return getWindowPath();

    if (_location === "hash") return window.location.hash.substr(1);

    return _currentPath;
  },

  push: function (path) {
    if (_location === "history") {
      window.history.pushState({ path: path }, "", path);
      notifyChange();
    } else if (_location === "hash") {
      window.location.hash = path;
    } else {
      _lastPath = _currentPath;
      _currentPath = normalizePath(path);
      notifyChange();
    }
  },

  addChangeListener: function (listener) {
    _events.on("change", listener);
  },

  removeChangeListener: function (listener) {
    _events.off("change", listener);
  },

  // ...
};

module.exports = URLStore;
```

다음과 같은 단서를 찾았으면 추상화를 해보는 단계가 남았다. route 컴포넌트는 생성과 동시에 URLStore에 자기자신이 가지고 있는 path를 등록하고 match가 되었는지 확인한다. 그리고 broswer의 url이 변경될때마다 자기자신이 match가 되었는지 감지해서 등록된 컴포넌트의 render 여부를 결정한다고 볼 수 있다.

해당 코드라인을 깊게 파고드는 것은 본 글과 맞지 않으므로 생략하지만 관심이 있다면 디자인패턴중 행동패턴인 옵저버패턴을 공부해 보기를 권장한다.

[디자인패턴 - 옵저버](https://refactoring.guru/ko/design-patterns/observer)

# 단 몇줄의 코드로 시작하기

우리의 목적은 vanila js에서 router를 구성하는 것이기 때문에 간단한 몇줄의 코드로 핵심로직을 만들어 볼 수 있다.
아래의 코드가 작성이 되면 여러분의 웹사이트에서 각각의 페이지로 라우팅되는 모습을 볼 수 있다. 라우팅을 구현을 할 때 핵심이 되는 로직은 다음과 같이 현재의 url에 맞는 pathname 일치하는 page를 렌더링하는 것이다.

```js
const { pathName } = window.location;
if (pathName === "/") {
  // index page render
} else if (pathName === "/about") {
  // about page render
}
```

# SPA에서의 라우터

SPA에서는 현재의 페이지에서 외부의 이동없이 화면전환이 이루어져야 하므로 HTML anchor tag의 기본 동작 대신에 내부에서 url change를 감지하여 렌더링할 페이지를 보여주면 된다. 같은 이유로 뒤로가기, 앞으로가기 등 broswer의 history api 기능을 이용하기 위해서 history의 이벤트로 이벤트를 처리한다.

의사코드 진행은 다음과 같다.

- anchor tag의 기본동작을 막는다
- pushState로 url를 변경한다
- popState로 이벤트를 감지해서 route를 작동시킨다.

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
  if (e.target.tagName !== "a") {
    return;
  }
  e.preventDefault();
  const { url } = e.target.dataset; // data-url 로 href를 따로 옮겨놓을 수도 있다.
  history.pushState(null, null, url);
});

window.addEventListener("popstate", router);
```

# 마무리

해당 글의 코드를 참고하여 수준 높은 라우팅 라이브러리를 설계하려고 했다면 굉장히 미안하다. 내 코딩 실력은 그렇게 좋지 않으며 추상화가 잘된 코드를 단시간에 짤정도로 높지 않다. 하지만 이 글을 읽으며 기능의 단서를 다른 라이브러리 찾으며 해당 라이브러리의 추상화가 어떻게 적용되는 지, 또 기능들의 단서는 어떻게 찾는지 도움이 되었으면 한다.

"프론트엔드개발이 빠르게 변화하고 있다" 라는 말을 자주 듣곤 한다. 하지만 속을 들여다본다면 실체는 전통적인 개발의 개념에서 출발하는 경우가 상당수다. useState가 자바스크립트의 클로저의 개념을 차용했다든가 react-redux가 react의 context를 이용해다든가 하는 내용들이 그 예가 될 수 있다. 변화하는 시장에서 잘 적응하고 자기자신의 포텐셜을 보여줄 수 있는 개발자가 되기위해서 라이브러리 읽기를 시도해보라. 글을 읽고 있는 여러분이 "빠른 변화"에 적응이 힘든 개발자라면, 전통적인 웹개발 경험을 해보는 건 어떨까. 본 글의 아래에 도움받았던 도서를 올려놓았다.

# 참고

[프레임워크 없는 프론트개발](https://product.kyobobook.co.kr/detail/S000001804992)
