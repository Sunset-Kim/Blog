import styled from "@emotion/styled";
import { Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

interface PageListProps {
  slug: string;
  title: string;
  contents: string;
  date: string;
  image?: IGatsbyImageData;
}

const PostList: React.FC<PageListProps> = ({ slug, image, title, date, contents }) => {
  return (
    <LIST>
      <Link to={`/blog${slug}`}>
        <LIST_ITEM>
          <LIST_IMG>{image && <GatsbyImage image={image} alt={title} />}</LIST_IMG>
          <LIST_TEXT>
            <h3>{title}</h3>
            <span>{date}</span>
            <p>{contents}</p>
          </LIST_TEXT>
        </LIST_ITEM>
      </Link>
    </LIST>
  );
};

const LIST = styled.li`
  &:not(:last-of-type) {
    margin-bottom: 32px;
  }

  > a {
    display: block;
    height: 100%;
  }
`;
const LIST_ITEM = styled.div`
  display: flex;
`;
const LIST_TEXT = styled.div`
  h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p {
    line-height: 24px;
  }
`;
const LIST_IMG = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  overflow: hidden;

  img {
    width: 100%;
    display: block;
  }
`;

export default PostList;
