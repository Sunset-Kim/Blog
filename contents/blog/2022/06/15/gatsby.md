---
slug: "/2022/06/15/gatsby"
title: "개츠비는 어떻게 문제를 해결했을까?"
date: 2022-06-15
layout: post
tags:
  - gatsby
image: ./gatsby.png
---

# 굉장히 중요한 테스트를 하고 있다!

![개츠비](./gatsby.png)
리액트JS을 이용한 정적사이트 생성기이다.

정적사이트 생성기는? 지킬 ruby 기반의 도구, vue press, react + graphQL을 합쳐서 만듦

## gatsby js

### 설치

- 커맨드라인 CLI가 존재
- node npm으로 설치

### 소개

- develop
- build
- serve

- 데이터 접근 (graphQL)

  - 사이트의 메타 데이터를 graphQL로 가지고 오자
  - 가지고온 데이터를 data로 살펴보자

- UI는 리액트 컴포넌트

  - 특별한 page 폴더

- gatsby 성능이 좋음

  - 이미지렌더방법
  - prefetch
  - 확장성이좋음 (image, styled components, sass, remark 등을 자유롭게 확장가능)

- gatsby data layer
  -
