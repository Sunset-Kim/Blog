---
slug: "/2022/04/05/intercept"
title: "Axios 인터셉터"
date: 2022-04-05
layout: post
tags:
  - react
  - axios
  - http
image: ./tazza.jpeg
---

# 반복적인 코드를 줄이기

개발업무중 대부분은 리팩터링일 것이고 리팩터링의 중요한 부분은 DRY(Don't Repeat Yourself)라고 생각한다. 본 글은 axios intercepter를 적용하며 DRY 원칙으로 개선하는 과정을 작성하였다.

![동작그만 밑장빼기냐?](./tazza.jpeg)
타짜의 명대사다. 만약 우리가 타짜들 처럼 비동기호출를 하기 전에 작업을 하고, 응답을 받을 때 입맛에 맞게 작업을 할 수 있으면 얼마나 좋을까. 실제로 많은 비동기처리 flow 중에 요청과 응답 전후로 토큰을 추가하거나 특별히 약속된 에러처리를 해야할 경우가 있다. 이 경우에 반복되는 코드를 줄이기 위해 사용되는 axios intercepter에 대해 알아보자.

# 개발자의 문제인식이 중요한이유

우리팀의 코드는 레거시에 속하기도 하지만 관성적으로 써왔던 부분에 의문을 품지 않는 것도 문제의 한 축이라고 생각한다. 매번 반복되는 콜백과 그러한 패턴으로 쓰여진 한두개 라인만 다른 코드들은 분명한 개선점이 있었을 것이다. 아래는 레거시 코드의 일부이다

```js
const fetchingStatisticData = () => {
  dispatch(Loading(true)); // loading state
  const url = "example.js";
  const params = {
    ...
    ...
  };

  axiosRequest(
    undefined,
    url,
    params,
    function (e) {
      // anti pattern
      setGameLengthData(e.avgGamelength);
      setSupportTimeData(e.avgSupportingTime);
      setFirstGankData(e.avgFirstGang);
      setTotalMatchData(e.avgMatchTotal);

      // 뭔가를 저장한다
      setGameLengthX(gameX);
      setGameLengthY(gameY);
      setSupportTimeX(supportX);
      setSupportTimeY(supportY);
      setFirstGankX(GankX);
      setFirstGankY(GankY);
      setTotalMatchX(TotalX);
      setTotalMatchY(TotalY);

      // 로딩을 끈다.
      dispatch(Loading(false));
    },
    function (objStore) {
      // 실패콜백이다
      dispatch(SetModalInfo(objStore));
      dispatch(Loading(false));
    }
  );
};
```

레거시 코드의 뭉치들은 대표적인 두개의 원칙을 위배하고 있다.

- Don't Sync State. Derive It!
- DRY(Don't Repeat Yourself)
  오늘의 글은 첫번째와는 관련도가 적으므로 블로그를 첨부한다. [Don't Sync State. Derive It!](https://kentcdodds.com/blog/dont-sync-state-derive-it)

# 답은 이미 우리안에 존재한다

일부는 ajax를 쓰기도 하지만 대부분의 실무 프로젝트에서 axios를 채택하고 있을 것이라고 생각한다. 우리 팀역시도 그랬다. 대부분의 axios를 사용하는 개발자들이 고민을 했을 법한 내용이라고 생각하고 axios 공식문서에서 해결방법을 찾아봤다. 그 외에 axios를 사용할만한 근거들도 찾아보았다. 아래의 표는fetch 와 Axios를 상당히 잘 비교하고 있다.

| axios                                           | fetch                                                          |
| ----------------------------------------------- | -------------------------------------------------------------- |
| 요청 객체에 url이 있다                          | 요청 객체에 url이 없다                                         |
| 써드파티 라이브러리로 설치가 필요               | 현대 브라우저에 빌트인이라 설치 필요 없음                      |
| XSRF 보호를 해준다                              | 별도 보호 없음                                                 |
| data 속성을 사용                                | body 속성을 사용                                               |
| data는 object를 포함한다                        | body는 문자열화 되어있다                                       |
| status가 200이고 statusText가 ‘OK’이면 성공이다 | 응답객체가 ok 속성을 포함하면 성공이다                         |
| 자동으로 JSON데이터 형식으로 변환된다           | json()메서드를 사용해야 한다                                   |
| 요청을 취소할 수 있고 타임아웃을 걸 수 있다     | 해당 기능 존재 하지않음                                        |
| **HTTP 요청을 가로챌수 있음**                   | 기본적으로 제공하지 않음                                       |
| download진행에 대해 기본적인 지원을 함          | 지원하지 않음                                                  |
| 좀더 많은 브라우저에 지원됨                     | Chrome 42+, Firefox 39+, Edge 14+, and Safari 10.1+이상에 지원 |

이미 우리가 사용하고 있는 라이브러리에는 많은 기능들이 있었고 잘 활용하지 못하는 것은 우리들일지도 모른다. 다시 본론으로 넘어와 interceptor는 우리팀에게 주어진 두가지의 큰 문제를 해결할 수 있었다.

1. 우리팀의 server 요청은 모두 201의 응답값을 가진다. (모든 요청을 post => 201 => 처리된 데이터 안에서 statuscode를 읽어내야 한다.)
2. 우리팀의 post 요청은 auth를 제외하고 모두 token 값을 같이 전송해야한다.

cf) 후일담으로는 backend 개발자와 이야기를 해보았는데 Riot api가 보통 모든 요청을 201로 처리하고 error를 따로 보내는 것을 참고해서 서버를 구성했다고 들었다

# 가로채기 intercept

![응답을 중간에 가로채 보자](https://c.tenor.com/uEXr3DWcDQ8AAAAd/girl-baseball.gif)

앞서 말한 두가지 상황을 개선하기 위해 Axios의 인터셉터 기능을 사용하기로 결정하였다. 요청할 때쓰이는 인스턴스를 정의하고 해당 인스턴스가 요청할때와 응답할 때 쓰이는 인터셉터를 연결하였다. 요청 인터셉터에서는 유저의 기본정보를 바디에 담아주거나 때에 따라 헤더에 삽입하는 구조로 짰고, 응답 인터셉터에서는 HTTP 기본 통신코드 + 커스텀 코드를 확인하고 에러를 던져주는 코드를 작성하였다.

```js
// 1. 먼저 자주쓰는 인스턴스를 만들었다
export const axiosPost = axios.create({
  baseURL: `url`,
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  timeout: 2000,
});

const addUserData = (config: AxiosRequestConfig) => {
  // 유저의 id, token을 담는 로직
  return _config;
};

// 2. 각각 처리할 핸들러
const handlePostRequest = (config: AxiosRequestConfig) => {
  const _config = addUserData(config);
  return _config;
};

const refineError = (res: AxiosResponse<IAxiosResponse<string[]>>) => {
  if (Number(res.data.status) > 299 || Number(res.data.status) < 200) {
    return Promise.reject(res);
  }
  return res;
};

// 4. 각각의 인터셉터를 연결
axiosPost.interceptors.request.use(handlePostRequest);
axiosPost.interceptors.response.use((res: AxiosResponse<IAxiosResponse<string[]>>) => {
  return refineError(res);
}, handleError);
```

# 무엇이 변했을까?

기존에 쓰고 있던 리액트쿼리와 결합해서 분리된 Error Controller Layer를 구성했다. 기존의 로직이였다면 http 응답코드로 에러를 판별하는 react query에서는 현재 프로젝트에서 에러를 처리하기 힘들었지만, 인터셉터를 활용해서 reject를 반환하여 error를 처리하니 react query 에러를 발생시 공통으로 에러를 핸들링 하는 것이 가능해졌다. 기존 로직에서는 각각 호출마다 error 처리를 고민했다면 아키텍처를 재설계한 후로는 에러를 횡단관심사로 분류하여 처리를 한번하고, view 단에서 세부적인 에러를 처리하여 좀 더 사용자 친화적으로 에러처리를 하게 되었다

지난달에 진행한 state migration 과 이번달에 진행한 Error Handling 이 마무리 되면서 어플리케이션 전체적인 데이터 플로우가 명확해졌다. 그 결과로 팀원들이 기초적인 범위를 넘어서는 수준높은 고민을 하게 되었다. 좀 더 사용자를 생각하는 팀이 되었다고 생각한다.

# 맺음말

프론트엔드에서 가장 중요한 것은 Layered Architecture라고 생각한다. 현재 프로젝트에는 역할별 layer가 없어 유지보수해야 할 부분이 산재되어 있다는 것을 느낀다. 백엔드 엔지니어처럼 MVC, MVVM 등의 다양한 디자인패턴을 프론트 프로젝트에서 적용하기에 무리가 있지만 결국, 유지보수의 비용을 줄이고 지속적으로 개발의 부채를 탕감하는 것은 잘 설계된 아키텍쳐 위에서 가능할 것이라는 생각이든다.

요즘은 배우는 것이 즐겁다. 예전에는 막연하게만 느껴지던 상태관리, Restful, Layerd Architecture 등등 기본적으로 갖춰야할 프론트엔지니어의 소양들이 지켜지지 않았을 때 어떤 문제가 발생하는 지 여실히 느끼고 있다. 결국 내가 취업을 하기에 부족했다는 것이고 또한 지금 그 문제들을 회피하지 않고 하나씩 개선에 갔을 때 좀 더 탄탄한 기본기의 엔지니어가 될 것이라 믿는다. 문제를 회피하지 않는 주니어가 되자. 모두들 화이팅

## 참고

- [Don't Sync State. Derive It!](https://kentcdodds.com/blog/dont-sync-state-derive-it)
- [Axios - 인터셉터](https://axios-http.com/kr/docs/interceptors)
- [zig song님의 포스트중 aixos관련내용](https://zigsong.github.io/2021/08/19/wtc-lv3-log-1/#%EC%9A%B0%ED%85%8C%EC%BD%94-Lv3-%ED%95%99%EC%8A%B5%EB%A1%9C%EA%B7%B8-%EC%82%AC%EC%9A%A9-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%A0%95%EB%A6%AC)
