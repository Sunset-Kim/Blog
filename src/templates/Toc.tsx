import styled from "@emotion/styled";
import React, { useLayoutEffect } from "react";

interface Props {
  tableOfContents: string;
}

const Toc: React.FC<Props> = ({ tableOfContents }) => {
  return (
    <TOC id="post-toc">
      <div dangerouslySetInnerHTML={{ __html: tableOfContents }}></div>
    </TOC>
  );
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
