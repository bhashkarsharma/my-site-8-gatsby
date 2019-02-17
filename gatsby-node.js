const path = require('path')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '~components': path.resolve(__dirname, 'src/components'),
        '~layouts': path.resolve(__dirname, 'src/layouts'),
        '~templates': path.resolve(__dirname, 'src/templates')
      }
    }
  })
}

exports.createPages = ({ actions: { createPage }, graphql }) => {
  const blogTemplate = path.resolve('src/templates/blog.tsx')

  return graphql(`
    {
      posts: allMarkdownRemark(limit: 1000) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    return result.data.posts.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogTemplate
      })
    })
  })
}
