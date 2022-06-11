import * as React from "react";
import Layout from "../components/layouts/Layout";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

const IndexPage = () => {
  return (
    <main>
      <Layout pageTitle="Home Page">
        <StaticImage
          src="https://static.wikia.nocookie.net/pokemon/images/5/52/%ED%94%BC%EC%B9%B4%EC%B8%84_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest/scale-to-width-down/200?cb=20170405000019&path-prefix=ko"
          alt="카피츄"
        />
        <StaticImage src="../assets/picka.png" alt="피카츄" />
        <p>I'm making this by following the Gatsby Tutorial.</p>
      </Layout>
    </main>
  );
};

export default IndexPage;
