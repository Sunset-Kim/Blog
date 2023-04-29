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
        "@libs": path.resolve(__dirname, "src/libs"),
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
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(fromNow: true)
              title
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.erros) {
    throw result.errors;
  }

  const nodes = result.data.allMarkdownRemark.edges.map((e) => e.node);

  nodes.forEach((node, index) => {
    const { slug } = node.fields;
    const { date, title, tags } = node.frontmatter;
    actions.createPage({
      path: `blog${slug}`,
      component: require.resolve(`./src/templates/blog-post.tsx`),
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
