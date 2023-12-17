---
slug: "/2023/01/20/zod.md"
title: "프론트엔드에서 zod를 사용하기"
date: 2023-01-20
layout: post
tags:
  - Javascript
  - Typescript
---

# Validation

어플리케이션에서 사용자의 입력값으로 데이터를 입력받아본적이 있다면 말도 안되는 입력값으로 우리를 곤란하게 하는 사용자를 본적이 있을 것이다. 예상치 않은 값이 들어와 에러로 어플리케이션이 뻗어버리거나 인풋으로 script나 query를 집어 넣는 XSS와 같은 공격을 당할 수도 있을 것이다.

<figure align="center">
  <img src="https://media.giphy.com/media/l0NwvUd7IEjn1764U/giphy.gif" alt="tailwind CSS를 생각하는 내 모습"/>
  <figcaption>
  사용자의 입력을 그대로 사용했을때 생기는 일 
  출처 - giphy(https://media.giphy.com/media/l0NwvUd7IEjn1764U/giphy.gif)
  </figcaption>
</figure>

최근 개발트렌드로 typescript를 많이 사용하고 있다. 그로 인해서 개발환경에서의 type의 오류로 어플리케이션이 동작하지 않는 일들은 현저히 줄었지만 typescript는 개발단계에서만 type을 보장하므로 어플리케이션이 동작하는 runtime에서는 type을 보장할 수 없다. 그러므로 여전히 runtime에서 type(혹은 여기서는 입력값)이 유효한 지 확인하는 과정은 매우 중요하다고 할 수 있다.

최근 백엔드 프로젝트를 진행하며 API만들 때 진행한 스텝을 공유하며 글을 시작하려 한다.

1.  입력이 유효한 값인지 검증
2.  데이터를 처리
3.  응답을 케이스에 맞게 처리

오늘의 주제인 유효값 검증(validation)은 모든 API에서 진행하는 첫번째 단계이면서 빠질 수 없는 단계이기도 하다. 반복되는 코드속에서 schema로 validation을 할 수 있는 라이브러리를 몇가지 찾아보았고 zod라는 라이브러리를 알게 되었다.

# Validation library

[npm trends - ajv vs joi vs zod vs yup](https://npmtrends.com/ajv-vs-joi-vs-yup-vs-zod)

validation 관련 라이브러리의 종류는 다양하다. 해당 섹션에서는 서로다른 라이브러리를 검토하고 마침내는 zod로 결장한 이유를 간략하게 공유하려 한다. 제일 많이 사용한 ajv는 json schema의 문법을 익히는데 시간이 걸리고 typescript와의 직접적인 연관성은 조금 떨어졌다. 러닝커브도 조금은 있는 편이다. 하지만 역사가 오래된 많큼 높은 사용량을 보이고 type을 json schema로 변환해 주는 서드파티도 굉장히 많았다. 가벼운 목적으로 사용하기에 ajv와는 맞지 않는다고 판단했다.

[다른 typescript validation shema 비교 - zod vs yup vs joi vs io-ts](https://egghead.io/blog/zod-vs-yup-vs-joi-vs-io-ts-for-creating-runtime-typescript-validation-schemas)
[zod - 공식사이트 비교](https://zod.dev/?id=comparison)

다음은 typescript schema library 중에서 비교해보았다. joi는 정적 타입추론을 지원하지 않았고 yup은 zod와 비슷하지만 union type을 지원하지 않거나 object type은 기본적으로 optional 인 것처럼 조금의 제약이 있었다. io-ts는 매우 훌륭한 라이브러리고 zod에 영향을 주었지만 절차지향적인 코드 패턴에 적용하려면 어려운 점이 있다고 설명한다.

나는 다음과 같은 이유로 zod를 선택했고 굉장히 만족하며 개발했다.

- typescript와 같아 러닝커브가 거의 없는 점.
- 하나의 라이브러리로 정적 타입추론과 schema 자체의 validation을 지원하는 것
- 6kb의 작은 용량

# zod 사용기

본 글은 zod의 기본 문법에 대해서는 다루지 않고 zod를 이용하여 프로젝트에 적용한 방법을 공유하기 때문에 기본적 사용은 공식문서를 참고하기를 바란다. 기본적인 사용은 typescript와 유사하여 어렵지 않으니 한번쯤 훑어보기를 권장한다.

[zod 공식문서](https://zod.dev/)
[30분만에 배우는 zod](https://www.youtube.com/watch?v=L6BE-U3oy80&t=35s)

## 입력값을 검증

api 요청 초반에 아래와 같은 함수를 호출하여 통과한 경우에만 data를 처리하였다.

```ts
function validateParamWithData<T>(param: unknown, schema: ZodSchema<T>) {
  const result = schema.safeParse(param);
  if (!result.success) {
    return {
      success: result.success,
      data: null,
      error: result.error.fomat(),
    };
  } else {
    return {
      success: result.success,
      data: result.data,
      error: null,
    };
  }
}
```

## 프론트엔드에서의 input을 검증하기

다음은 프론트엔드에서의 유저의 입력값을 검증하는 로직이다. onChange 를 받을때 해당하는 schema valid의 결과를 error Map에 set하여 error를 ui로 표현하는 방법이다.

```tsx
const userName = z.string({ required_error: "require" }).min(7, "at least 7");
const userPassword = z.string({ required_error: "require" }).min(4, "more than 4");

const schemaMap: Record<string, ZodSchema> = {
  userName,
  userPassword,
};

export default function App() {
  const errorMap = useMemo(() => new Map(), []);
  const [inputs, setInputs] = useState<Map<string, string>>(new Map());

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => new Map(prev.set(name, value)));
    const valid = schemaMap[e.target.name]?.safeParse(value);

    if (valid) {
      valid.success ? errorMap.delete(name) : errorMap.set(name, valid.error.formErrors.formErrors[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userName" onChange={handleChange} value={inputs.get("userName") ?? ""} />
      {errorMap.get("userName") && <span>{errorMap.get("userName")}</span>}
      <input name="userPassword" onChange={handleChange} value={inputs.get("userPassword") ?? ""} />
      {errorMap.get("userPassword") && <span>{errorMap.get("userPassword")}</span>}
      <button type="submit">제출</button>
    </form>
  );
}
```

## 다른 라이브러리와 연결하기

프론트엔드에서 form의 다양한 기능을 구현과 validation을 위해 react-hook-form을 사용하는데 다음 코드는 react-hook-form과 zod를 연결하는 코드의 예이다. resolver로 zodResolver를 사용해 react-hook-form과 zod를 연결하고 있다. react-hook-form에서 제공하는 formstate의 error에서 해당 schema를 검증해 error를 반환해 준다

```tsx
export function AddressForm({ onSubmit }: AddressForm) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(Address), // zodResolver를 zod schema와 연결한다
    mode: "all",
  });

  return (
    <FormControl>
      <FormLabel>이름</FormLabel>
      <Input type="text" {...register("name")} />
      {errors.name && (
        <Text color="red" size="xs">
          {errors.name.message?.toString()}
        </Text>
      )}
    </FormControl>
  );
}
```

# 무엇이 변했나

zod를 사용한 개발경험은 굉장히 좋았다. 그중에서 대표적으로 도움된 두가지의 특징을 공유한다.

1.  런타임상황과 개발상황에서 모두 적용할 수 있는 schema / type을 따로 선언하지 않아도 된다.
    아래와 같이 zod schema를 선언한다면 type은 zod가 제공하는 inference 를 통해 바로 타입으로 변환할 수 있다.
    [zod type-inference](https://zod.dev/?id=type-inference)

```ts
const Address = z.object({
  road_address: z.string(),
  road_number: z.number(),
});

type Address = z.infer<typeof Address>;
```

2. 타입스크립트 같은 방법으로 type을 확장하거나 바꿀 수 있다.
   zod는 extends,pick, omit 과 같은 타입스크립트와 같은 메소드를 제공하므로 타입을 쉽게 확장할 수 있으며 optional, deepPartial 같은 메소드로 이미 선언된 schema를 체이닝하는 방법으로 변경할 수 있다.

```ts
const OptionalAddress = Address.optional();
const PartialAddress = Address.partial();

type OptionalAddress = z.infer<typeof OptionalAddress>;
```

# 마무리

![유저의 입력값을 소독하는 중입니다 출처 - giphy(https://media.giphy.com/media/vuZeED6SoCN8MbLZq8/giphy.gif)](https://media.giphy.com/media/vuZeED6SoCN8MbLZq8/giphy.gif)

어플리케이션의 보안은 1차적으로 백엔드에 담당해야한다는 말에 동의하지만 모든 보안과 관련한 코드를 백엔드에만 의존하는 것은 옳지 않다고 생각한다. 백엔드와 프론트엔드 모두 예상되는 값을 validate를 하여 좀 더 안전한 프로젝트를 설계해 보는 것은 어떨까. 그리고 프론트엔드에서 validation 결과를 유저에게 알려주는 것만으로 사용자 경험을 향상시켜 줄 것이라고 생각한다.

# 참고

- [npm trends - ajv vs joi vs zod vs yup](https://npmtrends.com/ajv-vs-joi-vs-yup-vs-zod)
- [다른 typescript validation shema 비교 - zod vs yup vs joi vs io-ts](https://egghead.io/blog/zod-vs-yup-vs-joi-vs-io-ts-for-creating-runtime-typescript-validation-schemas)
- [zod 공식문서](https://zod.dev/)
- [30분만에 배우는 zod](https://www.youtube.com/watch?v=L6BE-U3oy80&t=35s)
