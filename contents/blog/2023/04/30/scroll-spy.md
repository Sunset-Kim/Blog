---
slug: "/2023/04/30/scroll-spy.md"
title: "블로그에 적용한 Scroll Spy"
date: 2023-04-30
image:
layout: post
tags:
  - ts
---

# Scroll Spy 적용기

Scroll Spy는 일반적으로 웹페이지에서 유저가 스크롤을 내리면 해당 위치에 따라 네비게이션 바의 링크를 하이라이트해주는 기능이다. 예를 들어, 웹페이지가 여러 섹션으로 구성되어 있을 때, Scroll Spy를 사용하여 사용자가 스크롤하고 있는 현재 위치가 어떤 섹션에 해당하는지 알 수 있다.

# 구현방법

구현방법의 sudo 코드는 다음과 같다.

1. 섹션에 해당하는 링크들을 배열에 담는다
2. 스크롤 이벤트에 현재위치와 각 링크들의 위치를 비교하는 콜백 함수를 등록한다
3. 현재 스크롤된 섹션에 class를 추가한다

나는 각 섹션의 Heading, Heading 과 1:1 bind된 link의 배열로 scroll spy를 구현하였다.

react에서 사용될 코드이기 때문에 clean up 될때의 removeEventListener도 구현하였다.

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
    let cb = () => {
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

# 마무리

평소 부트스트랩이나 기타 라이브러리를 간단히 사용해 구현하던 기능을

# 참고
