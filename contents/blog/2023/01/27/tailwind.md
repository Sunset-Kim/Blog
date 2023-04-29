---
slug: "/2023/01/27/tailwind.md"
title: "내가 tailwind를 프로젝트에 적용한 방법"
date: 2023-01-27
image: ./taliwind.jpeg
layout: post
tags:
  - tailwind
---

# 회의적이였던 tailwind를 프로젝트에 적용한 이유

<figure align="center">
  <img src="https://media.giphy.com/media/aVytG2ds8e0tG/giphy.gif" alt="tailwind CSS를 생각하는 내 모습"/>
  <figcaption>tailwind CSS를 생각하는 내 모습</figcaption>
</figure>

작년 2월경 간단한 채팅 사이드프로젝트를 만들며 찍먹해보았던 tailwind의 첫인상은 별로 좋지못했다. utility class 기반의 styling에 익숙하지도 못하였거니와 제대로 component를 쪼갤 수도 없는 초짜개발자에게는 그림의 떡이라 생각될 정도였고 내 부족한 역량때문에 실무에서는 사용할 일이 없는, 사이드프로젝트에서나 꺼내볼법한 그저그런 가벼운 라이브러리정도로만 기억하고 있었다. 누군가 물어본다면 ~~굳이 써야할까요?~~

![나는 이렇게 까지는... - youtube 코딩애플 tailwind 댓글들](reply.png)

그러던 와중 kakao page에서 tailwind CSS를 적용했다는 블로그를 읽고 내가 tailwind CSS를 잘못 이해했다는 생각이 들었고 간단한 design system을 적용해 보며 사이드 프로젝트를 진행해보기로 했다.

본 글은 사이드 프로젝트를 진행하며 느낀 tailwind CSS 한계와 그 한계를 극복할 수 있는 third-party-library를 공유하며, 내가 프로젝트에 적용한 방법까지를 공유하려한다.

먼저 tailwind의 core concept 중 하나인 [utility-first](https://tailwindcss.com/docs/utility-first)를 살펴보길 권장한다.

# 내가 겪은 Tailwind의 한계

기본적으로 tailwind CSS는 utility-first concept 덕분에 개발자가 클래스의 이름(스타일컴포넌트의 이름)을 고민하지 않아도 되며 다양한 uitility 선택자를 활용하여 반응형 styling을 비롯해 브라우저의 theme에 대한 스타일링 등 여러가지 유용한 스타일링을 class name을 통해 직관적으로 styling이 가능하다는 대표적인 장점을 가지고 있다.

그에 반해 대표적인 단점으로 contents의 가독성(html의 가독성)이 상당히 떨어지고 러닝커브가 존재한다는 점이 있다. 그 외에도 내가 발견한 단점은 아래와 같은 두가지 상황에서 발생했다.

## 1. class name merge

다음은 className을 병합하는 예시코드이다. 일반적인 class 였다면 잘 작동할 코드가 tailwind에서는 예상치 못한 결과를 보인다. 아래의 코드가 의도대로 동작하길 바란다면 `bg-white text-black`의 결과만 보여야 겠지만, 아쉽게도 tailwind는 작동을 보장하지 않는다. tailwind는 css sheet에 tailwind가 선언한 순서대로 utility class가 컴파일 되어 포함되고 이 결과에 따라 개발자가 선언된 class의 순서와 상관없이 cascading 된다.

```tsx
function CustomComponent({ className, children }) {
  return <div className={classnames("bg-black text-white", className)}>{children}</div>;
}
```

```tsx
// 아래와 같은 상황은 user가 선언한 style이 적용될 것을 보장하지 않는다
function Page() {
  return <CustomComponent className="bg-white text-black">안녕하세요. 블로그에 오신 것을 환영합니다</CustomComponent>;
}
```

## 2. dynamic-class-name 원칙

두번째 경우는 props에서 받아온 인자로 부터 스타일을 동적으로 할당하려는 상황이다. [tailwind 공식문서 - dynamic-class-name](https://tailwindcss.com/docs/content-configuration#dynamic-class-names) 에서는 tailwind를 사용한 동적할당의 예를 설명하고 있지만 지금과 같은 자유로운 동적할당은 지원하지 않는다.

| "Always use complete class names"으로 항상 완벽한 상태의 class name을 정의해야 한다고 말하고 있다.

```tsx
// 아래와 같은 코드는 작동하지 않는다
function Box({width, height,children}) {
  return <div className={`w-[${width}px] h-[${height}px]`}>{children}<div>
}
```

# 유연함을 더해줄 twin.macro

[twin.macro](https://github.com/ben-rogerson/twin.macro)는 tailwind로 개발하는 개발자에게 위의 몇가지 문제점을 해결하면서 tailwind CSS에 유연함을 부여해 주는 라이브러리다.

## 1. twin.macro가 class를 merge하는 원리

작동원리는 [Kakao FE 기술블로그](https://fe-developers.kakaoent.com/2022/220303-tailwind-tips/)에서 굉장히 자세히 설명하고 있는데

[kakao FE기술블로그 - Tailwind CSS 사용기](kakao-fe.png)

다시말해 선언된 클래스를 css 속성의 key-value쌍으로 덮어쓰면서 최종적인 결과물만 반영하기 때문에 병합오류를 막을 수 있다.

```tsx
import 'twin.macro'

function Text({children}) {
  // 이제는 text-blue-200을 보장한다
  return <p tw"text-red-200 text-blue-200">
    {children}
  </p>
}
```

## 2. twin.macro 동적할당

또, twin.macro를 사용하면 tailwind CSS를 emotion CSS의 css props을 이용해서 동적할당도 가능해 지는데

```tsx
import tw from 'twin.macro';

function Box({width, height, children}) {
  return <div css={[tw`text-red-200`, {width, height}]}>
  {children}
  <div>
}
```

이외에도 Emotion CSS와 tailwind CSS의 장점들을 잘 조합해서 style을 할 수 있게 해준다

# 간단한 방법으로 design system 만들어보기

tailwind를 통해서 간단한 atomic design system을 적용한 컴포넌트를 만들 수 있었다. twin을 이용해서 다양한 props에 대한 style을 미리 생성하고 props에 맞게 mapping 해놓은 style을 적용한다.

```tsx
// button.style.js
import tw from "twin.macro";

const sizeVariants = {
  sm: tw`px-1 py-0.5`,
  md: tw`px-2 py-1`,
  lg: tw`px-4 py-2`,
};

const variants = {
  solid: ``,
  outlined: `bg-transparent border-1`,
};

const colorVariants = {
  red: tw`bg-red-300 border-red-300 focus:ring-red-300`,
  blue: tw`bg-blue-300 border-blue-300 focus:ring-blue-300`,
  sky: tw`bg-sky-300 border-sky-300 focus:ring-sky-300`,
};

export const styles = {
  button: ({ variant = "solid", color = "blue", size = "md" }) => [
    tw`flex justify-center items-center hover:brightness-110	focus:ring-1`,
    sizeVariants[size],
    colorVariants[color],
    variants[variant],
  ],
};
```

디자인시스템이 엄격하게 지켜지지 않을 때를 대비하여 추가적으로 sx props를 정의하여 상위에서 tw로 정의한 스타일을 css prop의 마지막 순서에 추가함으로 컴포넌트를 사용하는 순간에 조금 더 유연한 스타일링이 가능하도록 했다.

```tsx
// button.component.js
import { style } from "./button.style";

const Button = ({ variant, size, color, sx, ...props }) => (
  <button css={[styles.button({ variant, size, color }), sx]} {...props}>
    {children}
  </button>
);
```

sx props에 tw으로 정의한 class를 넘겨줌으로써 기존 css를 override 할 수 있다.

```tsx
// 아래와 같이 추가 커스텀으로 스타일을 적용할 수도 있다.
<Button color="sky" sx={tw`px-4 py-6`}>
  추가 커스텀 버튼
</Button>
```

# 마무리

_"We will find a way. We always have."_
_"우리는 답을 찾을 것이다. 늘 그랬듯이"_

감사해요. 카카오개발자님들. tailwind를 사용하는 방법을 블로그를 통해서 접하면서 이제까지 했던 오해들을 풀 수 있는 시간이였다. 꺼진 관심도 다시보자. 좋은 레퍼런스를 찾고 좋은 개발자들의 블로그를 자주 살펴보아야겠다는 다짐도 든다. 이제서야 uitility 기반의 styling에 강점에 대해 조금 이해했고 실제로 tailwind CSS를 현업 프로젝트에서도 도입이 가능하겠다고 생각했다.

# 참고

- [tailwind CSS](https://tailwindcss.com/)
- [카카오 FE 기술블로그 - 'FE개발그룹에서는 Tailwind CSS를 왜 도입했고, 어떻게 사용했을까?'](https://fe-developers.kakaoent.com/2022/221013-tailwind-and-design-system/)
- [카카오 FE 기술블로그 - 'Tailwind CSS 사용기'](https://fe-developers.kakaoent.com/2022/220303-tailwind-tips/)
