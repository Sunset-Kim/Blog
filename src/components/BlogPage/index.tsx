import React, { useEffect, useReducer, useState } from "react";
import { PageProps } from "gatsby";
import { BlogQuery, ObjectValue, RenderPostList } from "types/Qureys";
import PostList from "@components/PostList";
import Layout from "@components/layouts/Layout";
import styled from "@emotion/styled";
import { ArchiveList, TagsList } from "./aside";

type InitState = {
  key?: "year" | "tag" | null;
  value?: any;
  renderPost: RenderPostList[];
};

type Action =
  | {
      type: "SET_POST";
      payload: InitState["renderPost"];
    }
  | {
      type: "SET_QUERY";
      payload: {
        key: "year" | "tag" | null;
        value: any;
      };
    };

const initialState: InitState = {
  renderPost: [],
};

const reducer = (state: InitState, action: Action): InitState => {
  console.log(action);
  switch (action.type) {
    case "SET_POST":
      return {
        ...state,
        renderPost: [...action.payload],
      };
    case "SET_QUERY":
      return {
        ...state,
        key: action.payload.key,
        value: action.payload.value,
      };
    default:
      return state;
  }
};

const BlogPage: React.FC<PageProps<ObjectValue<BlogQuery, "data">>> = (props) => {
  const { data, location } = props;
  const allPosts = data.allMarkdownRemark.edges.map((edge) => edge.node);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { key, value } = state;

  useEffect(() => {
    const year = new URLSearchParams(location.search).get("year");
    const tag = new URLSearchParams(location.search).get("tag");

    const key = year ? "year" : tag ? "tag" : null;
    const value = year ? year : tag ? tag : "all";

    dispatch({
      type: "SET_QUERY",
      payload: {
        key,
        value,
      },
    });
  }, [location.search]);

  useEffect(() => {
    dispatch({
      type: "SET_POST",
      payload:
        key === "year"
          ? allPosts.filter((p) => new Date(p.frontmatter.date).getFullYear().toString() === value)
          : key === "tag"
          ? allPosts.filter((p) => p.frontmatter.tags?.includes(value))
          : allPosts,
    });
  }, [state.key, state.value]);

  return (
    <Layout pageTitle="안녕">
      <LAYOUT_COL_2>
        <LAYOUT_SIDE>
          <ArchiveList posts={allPosts} activeYear={state.value} />
          <TagsList posts={allPosts} activeTag={state.value} />
        </LAYOUT_SIDE>
        <LAYOUT_MAIN>
          <LAYOUT_TITLE>{state.value === "all" ? "모든글" : state.value}</LAYOUT_TITLE>
          <ul>
            {state.renderPost.map((list) => {
              return <PostList key={list.id} renderPost={list} />;
            })}
          </ul>
        </LAYOUT_MAIN>
      </LAYOUT_COL_2>
    </Layout>
  );
};

const LAYOUT_COL_2 = styled.div`
  display: flex;
`;
const LAYOUT_SIDE = styled.aside`
  position: sticky;
  top: 0;
  min-height: calc(100vh - 73px);
  height: 100%;
  border-right: 1px solid #eaeaea;
  padding: 24px 24px;
  width: 240px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const LAYOUT_MAIN = styled.main`
  flex: 1;
  max-width: 786px;
  padding: 0 40px;
  padding-top: 80px;
`;

const LAYOUT_TITLE = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 60px;
`;

export default BlogPage;
