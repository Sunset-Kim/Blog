type ScrollSpyOptions = {
  headerHeight?: number;
  offset?: number;
};

function findLastIndex<T>(arr: T[], callback: (value: T, index: number, array: T[]) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}

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
    const activeItem = this.spyItems[targetIndex] ?? "";

    if (activeItem) {
      const id = activeItem.getAttribute("id");

      this.links.find((item) => item.classList.remove("active"));
      const activeLink = this.links.find(
        (link) => decodeURI(link.getAttribute("href")?.replace(/^#/, "") ?? "") === id
      );
      activeLink?.classList.add("active");
    }
  }
}

export default ScrollSpy;
