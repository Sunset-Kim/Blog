const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const blogPost = require.resolve(`./src/templates/blog-post.tsx`);

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
  const { createNodeField } = actions;
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            frontmatter {
              date(fromNow: true)
              title
            }
            fields {
              slug
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `);

  if (result.erros) {
    throw result.errors;
  }

  const nodes = result.data.allMdx.edges.map((e) => e.node);

  nodes.forEach((node, index) => {
    const { slug } = node.fields;
    const { date, title, tags } = node.frontmatter;
    actions.createPage({
      path: `blog${slug}`,
      component: `${blogPost}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        slug,
        date,
        tags,
        title,
        previous: index === nodes.length - 1 ? null : nodes[index + 1],
        next: index === 0 ? null : nodes[index - 1],
      },
    });
  });
};
