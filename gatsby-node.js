const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const { reporter } = require("gatsby-cli/lib/reporter/reporter");

// Setup Import Alias
exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const output = getConfig().output || {};
  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/components"),
        "@styles": path.resolve(__dirname, "src/styles"),
        "@templates": path.resolve(__dirname, "src/templates"),
        "@containers": path.resolve(__dirname, "src/containers"),
      },
    },
  });
};

// 노드만들기
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNode, createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  data.allMarkdownRemark.edges.forEach((edge) => {
    const slug = edge.node.fields.slug;
    actions.createPage({
      path: `blog${slug}`,
      component: require.resolve(`./src/templates/blog-post.tsx`),
      context: { slug: slug },
    });
  });

  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___datePublished], order: DESC }, limit: 1000) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const posts = result.data.allMarkdownRemark.edges;
  const postsPerPage = 2;
  const numPages = Math.ceil(posts.length / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    actions.createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve("./src/templates/blog-list.tsx"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};
