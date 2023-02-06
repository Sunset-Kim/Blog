---
slug: "/2022/03/26/react-query"
title: "리액트 Query - 상태도 나누자"
date: 2022-03-23
layout: post
tags:
  - react
image: ./organize.jpeg
---

회사업무로 레거시 리팩토링을 하게 되었다. 취업시장에서 프론트엔드 엔지니어가 갖춰야할 덕목 중 필수적인 상태관리의 중요성을 몸으로 느끼게 되었다. 리덕스로 점철된 우리의 어플리케이션을 보라! 수 많은 action,action creator, dispatch, reducer는 나를 괴롭게한다. 이 작은 서비스에 수 많은 flux가 난무하여 코드를 읽기 어렵게 한다. 좀 더 좋은 방법은 없단 말인가!

# 복잡한 상태관리

현재 개발중인 어플리케이션은 redux로 상태관리를 하고 있다. 아마도 나와 같은 주니어들이 components 간에 data,state를 공유하기 위해 쓰고 있는 것으로 보인다. 하지만 아키텍쳐구조를 생각하지 않고 사용한 전역상태와 하위에도 구현되어 있는 비즈니스 로직, 책임이 분명하지 않은 container, view 단은 어느 곳에서 상태를 처리하고 있는 지, 전역으로 공유되고 있는 상태를 도대체 어디서 어떻게 받아오고 처리를 하는 지 알 수 없게 한다.

![복잡한 상태관리를 보는 우리모습 출처 (https://tenor.com/search/equations-gifs)](https://c.tenor.com/WaBfaiDpRywAAAAd/equations-alex.gif)

# 선배님 상태도 분류가 있지 말입니다!

_"혹시, 상태도 분류할 수 있다는 걸 아시나요?"_ 에서 시작된 상태와 상태관리의 library 개편 과정을 공유해드립니다.

## 상태와 상태관리

먼저, 팀원들과 상태의 정의와 상태관리를 정의하는 시간을 가졌다.

- 상태는 주어진 시간에 대해 시스템을 나타내는 것 **(언제든지 변경가능)**
- 시간에 따라 언제든지 변경될 수 있는 시스템의 스냅샷

상태란, 말그대로 바뀔 수 있는 값이고 현재 프론트엔드 시장에서는 UI / UX의 중요성과 함께 프로덕트의 다양한 부분을 Client에서 컨트롤 하다보니 프로덕트의 규모가 커지고 프론트엔드에서 관리해야 하는 상태들이 굉장히 많이 생겼다.

상태관리는 시간에 따라 변화하는 상태 또는 유저의 조작에 의해 변하는 상태를 관리하는 방법을 말하며,

자체적인 방법

- 부모 -> 자식으로 향하는 단방향 props 바인딩
- contenxt api

외부 라이브러리를 통한 방법

- redux
- mobx
- react-query
- recoil

등이 있으며, 굳이 하나만 사용하기 보다는 때에 따라 하나 혹은 두개의 조합으로 상태를 관리한다.

## React Query

그렇다면 상태는 어떻게 나눌 수 있을까?
핵심은 해당 데이터의 오너쉽(제어권)이 어디에 있냐는 질문에서 시작한다.

### Client State

클라이언트 상태는 다음과 같은 특성을 가진다

1. client 에서 소유하며 온전히 제어가능하고
2. 초기값 설정이나 조작에 제약사항이 없고
3. 다른 사람들과 공유되지 않으며 client 내에서 UI/UX 흐름과 사용자의 인터렉션에 따라 변한다
4. Client 내에서 최신 상태로 관리가 된다 (즉, stale 해지지 않는다)

### Server State

서버의 상태의 특성은 다음과 같다.

1. client에서 제어하거나 소유되지 않은 원격의 공간에서 관리되고 유지가 된다 (DB,Backend)
2. Fetching/Updating에 비동기 API가 필요하다
3. 다른 사용자들과 공유되는 것으로 사용자가 모르게 변경될 수 있다.
4. 신경쓰지 않는다면 잠재적으로 Out of Date (stale) 해질 수 있다.

위와 같은 특성을 고려하여 상태를 분류했을 때, 현재 내가 개발하고 있는 제품은 그 중에서도 API 응답결과를 Fetching하고 전역상태에 보관하는 경우로 Server State에 해당했고 나머지의 상태들은 UI에 관련된 상태들 뿐이였다. 내가 세운 전략은 다음과 같았다.

1. React Query를 사용하여 Server의 상태와 Client 상태를 분리하고
2. Context api, props 를 사용해 viewer layer와 container layer를 분리한뒤
3. redux로 모든 곳에서 공유하는 최소한의 application 정보를 사용하자

# React Query는 무엇?

리액트 쿼리는 Server State를 처리하는데 특화된 녀석처럼 보인다. 데이터를 가져오고 캐시처리하고, 동기화하고 업데이트 하는 로직을 하나의 hook으로 구현할 수 있으며 사용자는 그저 찍먹! 하면 된다.

![리액트쿼리가 하는 일](query.png)

```js {4,10-12,21,24-29}
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient();

// 쿼리 클라이언트 꽂고 쓰셈
function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // Access the client - 클라이언트 자제에 접근한다.
  const queryClient = useQueryClient();

  // Queries - 하나의 쿼리는 이렇게 가지고 온다! 심지어 자동으로 가지고 올것이다.
  const query = useQuery("todos", getTodos);

  // Mutations - 뮤테이션이 발생하면 성공하면 todos를 썩은 데이터로 만들어라!
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch 썩은 데이터가 된 todos는 query가 실행되어 다시 받아온다.
      queryClient.invalidateQueries("todos");
    },
  });

  return (
    <div>
      <ul>
        {query.data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: "Do Laundry",
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

render(<App />, document.getElementById("root"));
```

이하 자세한 설명은 [react query 공식 홈페이지](https://react-query.tanstack.com/)를 참고한다!

# 그래서, 내 자식 무사해요?

**네, 무사히 수술 마쳤습니다.**
우리팀은 리액트 쿼리의 도입으로 다음과 같은 문제를 해결할 수 있었습니다.

- 서버상태와 클라이언트 상태를 분리하여 로컬상태는 UI의 조작용으로만 사용하였습니다.
- devtool로 사용하지 않는 상태, cache가 필요한 상태를 골라 api 최적화를 하였습니다.
- 개별 loading을 사용해 전역로딩을 최소화해서 편한 UX를 구축했습니다.
- optimistic update를 사용하여 좀 더 편하고 빠른 UX를 구축할 수 있었습니다.

# 부작용은 없을까요?

react query를 도입하며 좋았던 부분이 UX라면 고민이 많이 들었던 부분은 component가 이렇게 비대해 져도 되나? 라는 질문을 하게되었습니다. 하나의 컴포넌트가 비대해 지면서 다시 container presentational 패턴으로 돌아가야 하나라는 생각도 하였습니다.
하나의 컴포넌트가 hook을 사용하게 되면서 유착이되면 하위의 컴포넌트들은 좀더 작은 단위로 atomic하게 설계를 해야 재사용성이 올라갔으며 컴포넌트의 설계 난이도 또한 증가했습니다.

# 결론

프론트엔드에서 가장 중요한 상태관리의 중요성을 몸으로 깨닫고 개선하는 경험을 하였습니다. State Flow가 명확하지 않은 상태는 유지보수 하기 힘들며 시간이 지날 수록 새로운 상태들로 비대해지고 계속해서 추가적인 상태를 생성하는 것을 눈으로 보았습니다. 좀 더 상태관리 패턴과 그에 따른 Flow를 잘 공부하여 상황에 맞는 최적의 상태로 설계할 수 있도록 해야겠습니다.

## 참고

- [우아한테크 2월 React Query와 상태관리](https://www.youtube.com/watch?v=MArE6Hy371c)
- [React Query 공식](https://react-query.tanstack.com/)
