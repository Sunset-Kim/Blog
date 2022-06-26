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
  padding-top: 40px;
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
    background-color: ${({ theme }) => theme.bg[100]};
    border-left: 2px solid ${({ theme }) => theme.blue[500]};
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
      color: ${({ theme }) => theme.bg[800]};

      > ul {
        margin-top: 4px;
        padding-left: 8px;

        > li {
          font-size: 14px;
          color: ${({ theme }) => theme.bg[600]};

          > ul {
            margin-top: 4px;
            padding-left: 8px;

            > li {
              font-size: 13px;
              color: ${({ theme }) => theme.bg[500]};
            }
          }
        }
      }
    }
  }
`;
