---
slug: "/2022/06/15/gatsby"
title: "개츠비로 만들어보는 블로그"
date: 2022-06-15
layout: post
tags:
  - gatsby
image: ./gatsby.png
---

# 굉장히 중요한 테스트를 하고 있다!

![개츠비](./gatsby.png)
This text is **_really important_**.

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [`gatsby-remark-prismjs`],
    },
  },
];
```

```java
public class User {

    public Long id;
    public String name;
    public String email;
    public String password; //외부에 노출되서는 안 될 정보
    public DetailInformation detailInformation; //외부에 노출되서는 안 될 정보

    //비즈니스 로직, getter, setter 등 생략
}
```
