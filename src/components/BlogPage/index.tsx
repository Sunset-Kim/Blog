import React, { useEffect, useState } from "react";
import { PageProps } from "gatsby";
import { BlogQuery, ObjectValue, RenderPostList } from "types/Qureys";
import PostList from "@components/PostList";
import Layout from "@components/layouts/Layout";

const BlogPage: React.FC<PageProps<ObjectValue<BlogQuery, "data">>> = (props) => {
  const { data, location } = props;
  const allPosts = data.allMarkdownRemark.edges.map((edge) => edge.node);
  const [posts, setPosts] = useState<RenderPostList[]>();

  useEffect(() => {
    const year = new URLSearchParams(location.search).get("year");
    const tag = new URLSearchParams(location.search).get("tag");

    console.log("year", year);
    console.log("tag", tag);
  }, [location.search]);

  useEffect(() => {
    setPosts(allPosts);
  }, []);

  return (
    <Layout pageTitle="안녕">
      {posts &&
        posts.map((list) => {
          return <PostList key={list.id} renderPost={list} />;
        })}
    </Layout>
  );
};

export default BlogPage;
