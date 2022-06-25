import React from "react";
import _ from "lodash";
import { RenderPostList } from "types/Qureys";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import { Params, Path } from "../../constants";

type ArchiveListProps = {
  posts: RenderPostList[];
  activeYear?: string;
};

export const ArchiveList: React.FC<ArchiveListProps> = ({ posts, activeYear }) => {
  let postsGroubyYear: { [year: string]: RenderPostList[] } = {};

  posts.forEach((post) => {
    const year = new Date(post.frontmatter.date).getFullYear();
    postsGroubyYear[year] = postsGroubyYear[year] || [];
    postsGroubyYear[year].push(post);
  });

  const postsSortByYear = _.orderBy(
    Object.entries(postsGroubyYear).map(([year, posts]) => ({
      year,
      posts,
    })),
    (entry) => entry.year,
    "desc"
  );

  return (
    <>
      <ASIDE_LIST>
        <ASIDE_TITLE>아카이브</ASIDE_TITLE>
        <ASIDE_ITEM>
          <Link to={Path.Blog} className={activeYear === "모든글" ? "active" : ""}>
            <label>모든글</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </ASIDE_ITEM>
        {postsSortByYear.map(({ year, posts }) => (
          <ASIDE_ITEM key={year}>
            <Link
              to={`${Path.Blog}?${Params.Year}=${encodeURIComponent(year)}`}
              activeClassName={year === activeYear ? "active" : ""}
            >
              <label>{year}년</label>
              <span>{posts.length.toLocaleString()}</span>
            </Link>
          </ASIDE_ITEM>
        ))}
      </ASIDE_LIST>
    </>
  );
};

const ASIDE_LIST = styled.ul``;

const ASIDE_TITLE = styled.li`
  font-size: 15px;
  margin-bottom: 8px;
`;

const ASIDE_ITEM = styled.li`
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.orange[300]};
  &:not(:last-of-type) {
    margin-bottom: 4px;
  }

  > a {
    justify-content: space-between;
    display: flex;
  }
`;
