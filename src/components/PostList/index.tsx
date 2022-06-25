import styled from "@emotion/styled";
import { Link } from "gatsby";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import { RenderPostList } from "types/Qureys";

interface PageListProps {
  renderPost: RenderPostList;
}

const PostList: React.FC<PageListProps> = ({ renderPost }) => {
  const { fields, frontmatter, excerpt } = renderPost;
  const { slug } = fields;
  const { title, date, image } = frontmatter;

  const renderImage = getImage(image?.childImageSharp);

  return (
    <LIST>
      <Link to={`/blog${slug}`}>
        <LIST_ITEM>
          <LIST_IMG>{renderImage && <GatsbyImage image={renderImage} alt={title} />}</LIST_IMG>
          <LIST_TEXT>
            <h3>{title}</h3>
            <span>{date}</span>
            <p>{excerpt}</p>
          </LIST_TEXT>
        </LIST_ITEM>
      </Link>
    </LIST>
  );
};

const LIST = styled.li`
  list-style: none;
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

  span {
    display: block;
    margin-bottom: 4px;
  }

  p {
    line-height: 24px;
  }
`;

const LIST_IMG = styled.div`
  display: flex;
  flex: 0 0 100px;
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
