import styled from "@emotion/styled";
import React from "react";

export type TOC = {
  title: string;
  url: string;
  items?: TOC[];
};

export function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input != null;
}
interface Props {
  tableOfContents?: TOC["items"];
}

function getTOC(tocs: TOC[]) {
  return tocs.map((toc) => <ol key={toc.url}>{getTOCLink(toc)}</ol>);
}

function getTOCLink(toc: TOC, depth: number = 1) {
  if (depth > 6) return;
  let result = [];
  const { title, url, items } = toc;
  const link = (
    <li key={url}>
      <a href={url}>{title}</a>
    </li>
  );
  result.push(link);

  if (items) {
    const child = items.flatMap((toc) => getTOCLink(toc, depth + 1)).filter(isNotNullOrUndefined);
    result = result.concat(<ol key={title + "list"}>{child}</ol>);
  }

  return result;
}

const Toc: React.FC<Props> = ({ tableOfContents }) => {
  return <TOC id="post-toc">{tableOfContents && getTOC(tableOfContents)}</TOC>;
};

export default Toc;

const TOC = styled.aside`
  max-width: 300px;
  padding-top: 40px;
  padding-left: 16px;
  padding-right: 16px;
  top: 0;
  right: 0;
  position: sticky;
  height: fit-content;

  @media screen and (max-width: 786px) {
    display: none;
  }

  > div {
    position: relative;
    padding: 16px;
  }

  a.active {
    font-weight: bold;
  }

  ul {
    > li {
      font-size: 15px;
      &:not(:last-of-type) {
        margin-bottom: 4px;
      }

      > ul {
        margin-top: 4px;
        padding-left: 8px;

        > li {
          font-size: 14px;

          > ul {
            margin-top: 4px;
            padding-left: 8px;

            > li {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
`;
