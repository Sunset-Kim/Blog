---
slug: "/2022/09/28/onboard"
title: "CSR , SSR, NextJS"
date: 2022-09-28
layout: post
tags:
  - react
  - nextjs
  - SSR
  - CSR
image: ./wanted.jpeg
---

# 들어가는말

![원티드프리온보딩 챌린지](./wanted.png)
회사 프로젝트를 nextjs로 빌드하고 있다. React에서 B2B Sass 프로젝트를 진행해온터라 그다지 필요하지 않았던 SSR 기술이 B2C 서비스를 시작하며 필요하게 되었다. 그러던 와중 프리온보딩 챌린지를 발견하고 마지막날(사실 회사프로젝트도 이번주가 마감이다.) 급하게 신청서를 넣고 사전과제를 참여하는 중이다.

- CSR
- SSR
- NextJS

# CSR

React, Vue 등 싱글 페이지 어플리케이션에서 많이 사용하는 방식이다. 사용자의 요청에 따라 페이지 렌더링에 필요한 리소스를 요청받아 서버가 리소스를 전송하면 그때 페이지가 그려지는 방식이다.
따라서 처음 전송받을 리소스의 용량이 크거나 통신이 느려질 경우에는 유저가 보는 브라우저의 첫 페인트 속도가 느려질 수도 있습니다.

하지만 후속 페이지를 만드는데 걸리는 시간은 대부분 짧다. 유저가 요청한 일부분의 데이터를 요청후 갱신해주기 때문에 사용자는 깜빡임 없이 페이지의 컨텐츠를 이용할 수 있다. 또 한번 받은 리소스를 캐싱해 놓는다면 다음번 접속때는 더 빠르게 서비스를 이용할 수 있습니다.

CSR의 가장 큰단점으로 SEO(Search Engine Optimiztion) 꼽을 수 있는데, 사용자는 빈 html에 js 파일을 받아 렌더링 하기 때문에 검색엔진 js를 구동해서 크롤링하는 봇이 아닌 경우에는 컨텐츠를 제대로 읽을 수 없다.

# SSR

SSR은 서버에서 사용자에게 보여줄 페이지를 모두 구성하여 사용자에서 페이지를 전달하는 방식이다. SSR을 사용하면 모든 데이터가 매핑된 서비스 페이지를 클라이언트에게 바로 보여줄 수 있다. 서버를 이용해서 페이지를 구성하기 때문에 클라이언트에서 구성하는 CSR보다 페이지를 구성하는 속도는 늦어지지만 전체적으로 사용자에게 보여주는 콘텐츠 구성이 완료되는 시점은 빨라진다는 장점이 있다. 또한 SSR은 HTML문서 자체를 가져오므로 SEO에 유리한 측면을 가진다.

반면에 SSR은 Blinking Issue (사용자가 새로고침을 했을때 전체 웹사이트를 다시 서버에 받아오므로 화면이 사라짐)가 있을 수 있고, 서버가 과부화 될 수 있다는 단점을 가진다. 마지막으로 가장 큰 단점은 TTV(Time to view)와 TTI (Time to Interact)인데 view가 그려진 시점과 사용자가 실제로 interaction을 할 수 있는 시간차이가 날 수 있다.

# NextJS

Nextjs는 위와 같은 SSR, CSR의 문제점을 해결해기 위해 위 두가지 방법을 적절하게 섞고 거기에 SSG(Static Site Generator)까지 잘 섞은 React 기반의 프레임워크이다.

## yarn start 시 실행되는 코드들

yarn start는 단독으로 실행되지 않는다. yarn start 라는 cli 명령어가 제대로 작동하기 위해서는 우선적으로 nextjs 프로젝트를 yarn build 를 통해 컴파일을 완료해야한다. 그 후에 yarn start라는 명령어는 해당 프로젝트의 build된 파일을 실행하는 코드이다.

yarn start (next start)를 실행하면

1. cli/nextstart.ts [nextstart](https://github.com/vercel/next.js/blob/canary/packages/next/cli/next-start.ts)
2. server/lib/start-server.ts [start-server](https://github.com/vercel/next.js/blob/canary/packages/next/server/lib/start-server.ts)
3. next.ts [next.ts](https://github.com/vercel/next.js/blob/canary/packages/next/server/next.ts)

가 실행된다.

각각의 코드는 자체적으로 http server를 만들고 next Instance를 만들어서 client의 요청에 따라 next instance에 있는 다양한 종류의 render 함수를 호출한다. render 대표적으로 app Container dom을 만들고 document ctx를 만들어서 공통적으로 전송하며 사용자가 custom한 \_app, \_document가 없다면 default로 작성해 놓은 코드를 바탕으로 추가로 dom트리를 구성하여 client로 응답을 보낸다.

## 참고

- [nextjs 공식문서](https://nextjs.org/docs/getting-started)
- [nextjs 공식 github](https://github.com/vercel/next.js)
- [드림코딩 앨리 SSR](https://www.youtube.com/watch?v=iZ9csAfU5Os)
