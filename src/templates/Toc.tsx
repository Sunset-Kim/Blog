import styled from "@emotion/styled";
import ScrollSpy from "@libs/scroll-spy";
import React, { useEffect, useRef } from "react";

interface Props {
  tableOfContents: string;
}

const Toc: React.FC<Props> = ({ tableOfContents }) => {
  const tocRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!tocRef.current) return;
    const headings: HTMLElement[] = Array.from(document.querySelectorAll("h1,h2,h3,h4"));
    const links: HTMLAnchorElement[] = Array.from(tocRef.current.querySelectorAll("a"));

    const scrollSpy = new ScrollSpy(headings, links, {});

    const destroy = scrollSpy.init();

    return () => {
      destroy();
    };
  }, []);
  return (
    <TOC id="post-toc">
      <div ref={tocRef} dangerouslySetInnerHTML={{ __html: tableOfContents }}></div>
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
