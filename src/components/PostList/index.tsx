import styled from "@emotion/styled";
import dayjs from "dayjs";
import "dayjs/locale/ko";
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
            <span>{dayjs(date).locale("ko").format("YY년 MM월 DD일 dddd")}</span>
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

  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

const LIST_TEXT = styled.div`
  h3 {
    font-size: 20px;
    font-weight: bold;
  }

  span {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    font-style: italic;
  }

  p {
    line-height: 24px;
  }
`;

const LIST_IMG = styled.div`
  display: flex;
  flex: 0 0 150px;
  justify-content: center;
  align-items: center;
  max-height: 120px;
  margin-right: 20px;
  overflow: hidden;

  img {
    width: 100%;
    display: block;
  }

  @media screen and (max-width: 500px) {
    flex: 0 0 150px;
    height: 150px;
    width: 100%;
    margin-bottom: 10px;
    margin-right: 0;
  }
`;

export default PostList;
