import { RenderPostList } from "@/types/Qureys";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import _ from "lodash";
import React from "react";
import { Params, Path } from "../../constants";

type ArchiveListProps = {
  posts: RenderPostList[];
  activeYear?: string;
};

type TagListProps = {
  posts: RenderPostList[];
  activeTag?: string;
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
    <ASIDE_LIST>
      <ASIDE_TITLE>아카이브</ASIDE_TITLE>
      <ASIDE_ITEM>
        <Link to={Path.Blog} className={activeYear === "all" ? "active" : ""}>
          <label>모든글</label>
          <span>{posts.length.toLocaleString()}</span>
        </Link>
      </ASIDE_ITEM>
      {postsSortByYear.map(({ year, posts }) => (
        <ASIDE_ITEM key={year}>
          <Link
            to={`${Path.Blog}?${Params.Year}=${encodeURIComponent(year)}`}
            className={year === activeYear ? "active" : ""}
          >
            <label>{year}년</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </ASIDE_ITEM>
      ))}
    </ASIDE_LIST>
  );
};

export const TagsList: React.FC<TagListProps> = ({ posts, activeTag }) => {
  let postsGroubyTag: { [tag: string]: RenderPostList[] } = {};

  posts.forEach((post) => {
    const tags = post.frontmatter.tags;
    tags.forEach((tag) => {
      postsGroubyTag[tag] = postsGroubyTag[tag] || [];
      postsGroubyTag[tag].push(post);
    });
  });

  const postsSortByTagCount = _.orderBy(
    Object.entries(postsGroubyTag).map(([tag, posts]) => ({ tag, posts })),
    (entry) => entry.posts.length,
    "desc"
  );

  return (
    <ASIDE_LIST>
      <ASIDE_TITLE>태그</ASIDE_TITLE>

      {postsSortByTagCount.map(({ tag, posts }) => (
        <TAG_ITEM key={tag}>
          <Link
            to={`${Path.Blog}?${Params.Tag}=${encodeURIComponent(tag)}`}
            className={tag === activeTag ? "active" : ""}
          >
            <label>#{tag}</label>
            <span>{posts.length.toLocaleString()}</span>
          </Link>
        </TAG_ITEM>
      ))}
    </ASIDE_LIST>
  );
};

const ASIDE_LIST = styled.ul`
  :not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const ASIDE_TITLE = styled.li`
  font-size: 15px;
  margin-bottom: 8px;
  padding-left: 8px;
  color: ${({ theme }) => theme.bg[700]};
`;

const ASIDE_ITEM = styled.li`
  border-radius: 8px;

  &:not(:last-of-type) {
    margin-bottom: 4px;
  }

  > a {
    padding: 8px 16px;
    height: 100%;
    border-radius: 8px;
    justify-content: space-between;
    display: flex;

    &.active {
      background-color: ${({ theme }) => theme.blue[400]};
      color: white;
    }
  }
`;

const TAG_ITEM = styled.li`
  display: inline-block;
  border-radius: 8px;
  margin-right: 4px;

  > a {
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px;
    background-color: ${({ theme }) => theme.bg[200]};

    &.active {
      background-color: ${({ theme }) => theme.blue[400]};
      color: white;
    }

    > label {
      display: inline-block;
      margin-right: 4px;
    }

    > span {
      font-size: 13px;
      color: white;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 1.2em;
      height: 1.2em;
      text-align: center;
      vertical-align: middle;
      border-radius: 100%;
      background-color: ${({ theme }) => theme.bg[700]};
    }
  }
`;
