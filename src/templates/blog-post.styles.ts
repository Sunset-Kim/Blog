import styled from "@emotion/styled";

export const S: Record<string, ReturnType<(typeof styled)[keyof JSX.IntrinsicElements]>> = {
  Ex: styled.div``,
  ColTwo: styled.div`
    display: flex;
  `,
  Contents: styled.main`
    flex: 1;
    overflow-x: hidden;
    padding: 80px 40px;
    line-height: 1.6;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 700;
      line-height: 1;
      margin: 1em 0;
      > a {
        fill: ${({ theme }) => theme.blue[500]};
      }
    }

    h1 {
      font-size: 32px;
    }

    h2 {
      font-size: 28px;
    }

    h3 {
      font-size: 24px;
    }

    h4 {
      font-size: 20px;
    }

    p {
      margin-block-start: 1em;
      margin-block-end: 1em;
    }

    table {
      border: 1px solid ${({ theme }) => theme.bg[300]};
      border-collapse: collapse;

      th {
        padding: 8px 16px;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
        background-color: ${({ theme }) => theme.bg[200]};
      }

      tr {
        &:nth-of-type(2n) {
          background-color: ${({ theme }) => theme.bg[100]};
        }
      }
      td {
        font-size: 14px;
        padding: 8px 16px;
        border: 1px solid ${({ theme }) => theme.bg[200]};
      }
    }

    ol,
    ul {
      margin-block-start: 1em;
      margin-block-end: 1em;
      background-color: aliceblue;
      padding: 1em 0;
      padding-left: 2em;
      padding-right: 1em;
      border-radius: 4px;
    }
    li {
      list-style-position: inside;
      list-style: square;
      &:not(:last-of-type) {
        margin-bottom: 0.25em;
      }
    }

    a {
      text-decoration: underline;
    }
    figure {
      img {
        width: 100%;
      }
    }
    figcaption {
      margin: 8px 0;
      font-size: 14px;
      color: ${({ theme }) => theme.bg[600]};
      text-align: center;
      font-style: italic;
    }

    pre {
      overflow: auto;
      overflow-wrap: normal;
      white-space: pre;
    }

    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }
  `,
  Page: styled.div`
    width: 50%;

    &.next {
      a {
        text-align: right;
      }
    }

    &:not(:last-of-type) {
      margin-right: 10px;
    }

    h5 {
      color: ${({ theme }) => theme.bg[800]};
      font-size: 16px;
      margin: 0;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.bg[700]};
      margin-bottom: 4px;
    }

    a {
      border-radius: 10px;
      transition: background-color 0.2s;
      background-color: ${({ theme }) => theme.bg[100]};
      display: block;
      padding: 16px;
      text-decoration: none;

      &:hover {
        background-color: ${({ theme }) => theme.bg[200]};
      }
    }
  `,
  PageContainer: styled.div`
    display: flex;
    margin-top: 40px;
  `,
};
