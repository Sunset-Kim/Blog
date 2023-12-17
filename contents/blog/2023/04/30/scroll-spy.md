---
slug: "/2023/04/30/scroll-spy.md"
title: "간단한 ScrollSpy 구현하며 적어보는 2년차 개발자의 단상"
date: 2023-04-30
layout: post
tags:
  - ts
---

# Scroll Spy 적용기
 지난 이직 면접 중 면접관께서 블로그 글이 탐색이 너무 어렵더라는 피드백이 있어 시간이 나면 scrollspy를 추가해야 겠다고 생각했다. 간단히 Scrollspy에 대해 설명을 가져와 봤는데,
 > Scroll Spy는 일반적으로 웹페이지에서 유저가 스크롤을 내리면 해당 위치에 따라 네비게이션 바의 링크를 하이라이트해주는 기능이다. 예를 들어, 웹페이지가 여러 섹션으로 구성되어 있을 때, Scroll Spy를 사용하여 사용자가 스크롤하고 있는 현재 위치가 어떤 섹션에 해당하는지 알 수 있다. 해당 기능은 부트스트랩을 비롯한 여러 라이브러리에서 경험할 수 있는 데 유저의 탐색을 돕는다는 점에서 상당히 유용하다.

 확실히 있으면 TOC와 더불어 현재 글의 맥락을 잡는 부분에서 상당히 도움이 되더라.

# 간단한 구현방법
구현방법의 sudo 코드는 다음과 같다.

1. 섹션의 id값과 연결할 a tag의 list를 구한다
2. 스크롤 이벤트에 현재위치와 섹션의 위치를 평가하는 함수로 스크롤 이벤트 발생마다 현재 섹션을 구한다
3. 현재 속해있는 섹션의 연결된 a tag에 class를 추가한다

나의 경우 항상 spyItems와 links는 1:1 대응이 되었기 때문에 아래와 같이 class를 이용해 간단히 구현을 해보았다.

```ts
export class ScrollSpy {
  private readonly options: ScrollSpyOptions;

  constructor(
    private readonly spyItems: HTMLElement[],
    private readonly links: HTMLAnchorElement[],
    options: ScrollSpyOptions
  ) {
    this.options = options;
    this.spyItems = spyItems;
  }

  public init(): VoidFunction {
    this.setActiveSpyItem();
    return this.bindScrollHandler();
  }

  private bindScrollHandler(): VoidFunction {
    const cb = () => {
      this.setActiveSpyItem();
    };
    window.addEventListener("scroll", cb);
    return () => {
      window.removeEventListener("scroll", cb);
    };
  }

  private getTargetTop(target: HTMLElement) {
    const { top } = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { headerHeight = 0, offset = 0 } = this.options;

    return top + scrollTop - headerHeight - offset;
  }

  private setActiveSpyItem(): void {
    const scrollTop = window.pageYOffset;

    const targetIndex = findLastIndex(this.spyItems ?? [], (item) => scrollTop >= this.getTargetTop(item));
    const activeItem = this.spyItems[targetIndex];
    const id = activeItem?.getAttribute("id");

    if (id) {
      this.detachClass();
      this.attachClass(id);
    }
  }

  private detachClass(): void {
    this.links.forEach((item) => item.classList.remove("active"));
  }

  private attachClass(id: string): void {
    const activeLink = this.links.find((link) => decodeURI(link.getAttribute("href")?.replace(/^#/, "") ?? "") === id);
    activeLink?.classList.add("active");
  }
}

export default ScrollSpy;
```

작성하며 신경썼던 부분은 총 두가지 인데,
첫번째로 scroll event를 삭제 해주기위해 등록했던 이벤트를 지워주는 함수를 리턴했다. 다음과 같이 useEffect hook 내에서 unmount 될때 쉽게 이벤트에 등록된 콜백을 지워버릴 수 있다.
```ts
useEffect(() => {
  const removeEvent = scrollSpy.init();

  return () => {
    removeEvent()
  }
}, [])
```
 두번째로 추상화된 함수로 최대한 간단하게. 이였는데 조금더 간단하게 코드라인이 나올 수 있지 않았나 싶다. 1년전만 하더라도 뭔가 멋진 패턴 훨씬 더 구조적인 코드가 있지 않을까하고 과하게 추상화하면서 코드를 짰던 기억이 있다. 쓸데없이 방어코드를 적거나 일어날 수 없는 일들을 대비하며 코드를 짰었는데 최근에는 "남이 볼 수 있게 간단하고 깔끔한 코드가 정답이다" 라는 생각으로 바뀌었다. 내가 생각하는 방향으로 코드가 발전하지도 않고 너무 방어적이고 추상적으로 코드를 짜면 나도 못알아보겠더라.
 최근에는 간단한 함수들의 모음으로 내가 생각하는 기능들을 composition 해서 구현하려는 노력을 하고 있는 것 같다. unit test도 쉽고 최종적으로 내가 기능을 프로그래밍적으로 생각할 수 있게 도와주는 것도 같다. 그리고 동료들도 해당로직에서 오류를 잘 찾아주기도 쉽고 나 또한 그렇다.

# 마무리
 도메인도 구입하고 comment 기능도 구현하면서 블로그에 애정을 쌓아 가는 중이다. 가끔씩 간단한 코드를 짜면서 회고도 해볼 생각이다.
 Scroll spy는 핑계였고 사실 블로그를 써야한다는 강박과 최근하고 있는 단상들을 공유하기 위해 주제로 선택한 감이 있다. 그래도 구현하고나니 편하다.
올해는 매일매일 공부해야는 강박으로 놓쳐왔던 많은 생각들을 작성해볼 요량이다. 2023년에는 DB도 무료, 서버도 무료인 시대인데 내 생각하나쯤 오래보관하고 있어도 되겠지.
그리고 가끔은 도움이 되는 Tech 지식도 적고 싶지만, 아직까지 멋들어진 인사이트를 가지고 있지 않아 무리다.

아무튼 Scrollspy는 한번 구현해보시길 추천드린다. 나보다 내 글을 읽는 사람이 더 좋아한다.
