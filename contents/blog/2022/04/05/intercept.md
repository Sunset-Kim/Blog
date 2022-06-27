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

![동작그만 밑장빼기냐?](./tazza.jpeg)

_걱정하지 마라 내 손은 눈보다 빠르고 우리 인터셉터는 응답보다 빠를테니._

타짜의 명대사다. 나는 지금 비동기호출를 하기 전에 토큰을 추가해야하고, 응답을 받을 때 입맛에 맞게 에러처리를 해야한다.

프론트엔드의 시작과 끝은 비동기 프로그래밍에 있다고 생각한다. 현업에서 마주치는 첫번째 보스같은 존재랄까. 막상 자주 접하다 보면 어려울것이 없겠지만 "비동기"라는 이야기는 입문자를 패닉에 빠뜨리기도 한다. Ajax, fetch 등을 사용하면서 여러 기능에 대한 갈증이 있었다면 다양한 기능을 지원하는 Axios를 써보기 바란다. 나 역시 현재 프로젝트에 비동기 통신을 위한 라이브러리로 Axios를 채택해서 쓰고 있다.

# 나는 왜 Axios를 선택하게 되었나

장황한 설명이 거두절미하고 잘 정리된 표를 공유한다. 기존 fetch 와 Axios를 상당히 잘 비교하셨다. 너무 감사하다. 내가 쓴 것은 아니고 표의 [원작자분께](https://zigsong.github.io/2021/08/19/wtc-lv3-log-1/#%EC%9A%B0%ED%85%8C%EC%BD%94-Lv3-%ED%95%99%EC%8A%B5%EB%A1%9C%EA%B7%B8-%EC%82%AC%EC%9A%A9-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%A0%95%EB%A6%AC) 감사의 말씀을 전한다!

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

나의 경우는 프로젝트에 backend API 요청을 하면 무조건 http 코드는 201로 날아온다. 왜 200도 아니고 201인고 하니 모든 요청이 Post로 구성이 되어있다! -> CRUD 모두

백엔드 개발자 말로는 http 코드는 함부로 바꿀 수 없고 서버랑 수신이 되면 200,201을 보내주는게 보통이란다. _(나는 node 서버를 구축할때 그렇게 하지 않았다.)_ 더욱더 나를 힘들게 하는 것은 201로 응답을 받은 response 객체 안에 개발자가 임의로 만든 code라는 key가 있고 그 안에 http 상태코드와 유사한 넘버링이 된 string 타입의 객체가 날아온다. ~~_(참으로 번거롭다.)_~~

다시 말해 응답으로 받은 response를 다시 한번 뜯어봐야할 필요가 생겼다.

# 가로채기

![응답을 중간에 가로채 보자](https://c.tenor.com/uEXr3DWcDQ8AAAAd/girl-baseball.gif)

앞서 말한 상황과 레거시를 존중하라는 사내 문화에 힘입어 상황을 타파하기 위해 Axios의 인터셉터 기능을 사용하기로 결정하였다. 이미 사용하고 있었는 데, 조직에서 인터셉터를 몰랐나 보더라. 강력하게 API Flow를 개선하겠다고 의지를 피력하고 interceptor를 인스턴스에 연결해주기로 결정했다.
당시의 문제상황을 잠깐 공유한다.

```js
const fetchingStatisticData = () => {
  dispatch(Loading(true)); // 로딩을 켜고
  const url = "섬띵URL";
  const params = {
    // ... 대략적으로 많은 파라메타
  };

  axiosRequest(
    undefined,
    url,
    params,
    function (e) {
      // 무려 성공 콜벡이다 실제로는 200줄이 넘어간다..
      setGameLengthData(e.avgGamelength);
      setSupportTimeData(e.avgSupportingTime);
      setFirstGankData(e.avgFirstGang);
      setTotalMatchData(e.avgMatchTotal);

      // ... 뭔가를 만들고

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

리액트 state에 쓸때없는 정보를 저장하는 가장 하지 말아야 할 짓을 하는 것은 논외로 두고서라도 **~~(이미 수정했다. 사내 공유까지 해드렸다.)~~**

미칠듯한 길이의 성공 콜백을 연결하고 error 콜백을 연결하고 있다. 저 무시무시한 `axiosRequest` 이라는 친구는 response의 객체를 탐색하여 이것저것 하는 대략 1000줄 가까이 되는 레거시 코드다.
레거시를 존중해야 성장을 한다고 했던가.

## 문제정의

사실 그때는 좋은 코드였겠지라고 마음의 안정을 잡고 리팩터링 계획을 세우고 문제를 정의한다.

- 프로덕트의 모든 요청에는 사용자 id,token이 필요하다. (바디로 송수신 한다...)
- 프로덕트의 모든 응답의 기본 http 코드는 201이며, response 객체에 custom code가 들어있다.
- 성공콜백은 인스턴스를 포함하는 함수에 연결하는 것이 아니라 인스턴스를 재사용하고 그 이후 컨벤션에 맞게 then 이나 await를 사용할 수 있어야 한다.

## 문제해결

간단히 요청할 때쓰이는 인스턴스를 정의하고 해당 인스턴스가 요청할때와 응답할 때 쓰이는 인터셉터를 연결하였다.
요청 인터셉터에서는 유저의 기본정보를 바디에 담아주거나 때에 따라 헤더에 삽입하는 구조로 짰고, 응답 인터셉터에서는 HTTP 기본 통신코드 + 커스텀 코드를 확인하고 에러를 던져주는 코드를 작성하였다.

```js
// 1. 먼저 자주쓰는 인스턴스를 만들었다
export const axiosPost = axios.create({
  baseURL: `기본이될URL/`,
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  timeout: 2000,
});

// 2. 각각 처리할 핸들러
const handlePostRequest = (config: AxiosRequestConfig) => {
  const _config = addUserData(config);
  return _config;
};

const handleError = (error: any) => {
  return Promise.reject(error);
};

// 3. 핸들러 안에서 수행할 로직
const addUserData = (config: AxiosRequestConfig) => {
  // 유저의 id, token을 담는 로직
  return _config;
};

// 4. 각각의 인터셉터를 연결
axiosPost.interceptors.request.use(handlePostRequest);
axiosPost.interceptors.response.use((res: AxiosResponse<IAxiosResponse<string[]>>) => {
  // http 기본응답
  if (res.status > 299 || res.status < 200) {
    console.error("서버에 호출이 들어가지 않았습니다. url을 확인하세요");
  }

  // 서버에서 호출하는 응답 schema
  if (Number(res.data.status) > 299 || Number(res.data.status) < 200) {
    // 뭔가 에러를 처리하고 관리하는 로직
    return Promise.reject(error);
  }

  return res;
}, handleError);
```

# 무엇이 변했을까?

기존에 쓰고 있던 리액트쿼리와 결합해서 Error Layer를 구성했다. 기존의 로직이였다면 http 기본 코드로 에러를 판별하는 react query에서는 우리 어플리케이션에서 에러를 처리하기 힘들었지만, 인터셉터를 활용해서 reject을 만들어서 error를 처리하니 react query에서도 공통으로 에러를 처리하게 설계가 가능했다.

기존에 Buggy 하게 흘러갔던 데이터 플로우가 정립되면서 팀원들이 수준높은 고민을 하게 되었다. 기존 로직에서는 각각 호출마다 error 처리를 고민했다면 아키텍처를 재설계한 후로는 조금 더 생산적인 고민을 할 수 있게 되었다.

# 결론

프론트엔드에서 가장 중요한 것은 Layered Architecture라고 생각한다. 현재 프로젝트에는 역할별 layer가 없어 유지보수해야 할 부분이 산재되어 있다는 것을 느낀다. 백엔드 엔지니어처럼 MVC, MVVM 등의 다양한 디자인패턴을 프론트 프로젝트에서 적용하기에 무리가 있지만 결국, 유지보수의 비용을 줄이고 지속적으로 개발의 부채를 탕감하는 것은 잘 설계된 아키텍쳐 위에서 가능할 것이라는 생각이든다.

요즘은 배우는 것이 즐겁다. 예전에는 막연하게만 느껴지던 상태관리, Restful, Layerd Architecture 등등 기본적으로 갖춰야할 프론트엔지니어의 소양들이 지켜지지 않았을 때 어떤 문제가 발생하는 지 여실히 느끼고 있다. 결국 내가 취업을 하기에 부족했다는 것이고 또한 지금 그 문제들을 회피하지 않고 하나씩 개선에 갔을 때 좀 더 탄탄한 기본기의 엔지니어가 될 것이라 믿는다. 문제를 회피하지 않는 주니어가 되자. 모두들 화이팅

## 참고

- [Axios - 인터셉터](https://axios-http.com/kr/docs/interceptors)
- [zig song님의 포스트중 aixos관련내용](https://zigsong.github.io/2021/08/19/wtc-lv3-log-1/#%EC%9A%B0%ED%85%8C%EC%BD%94-Lv3-%ED%95%99%EC%8A%B5%EB%A1%9C%EA%B7%B8-%EC%82%AC%EC%9A%A9-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%A0%95%EB%A6%AC)
