module.exports = {
  siteMetadata: {
    title: 'Bhashkar Sharma',
    author: 'Bhashkar Sharma',
    description: 'My personal website - built with Gatsby'
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/src/content`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200
            }
          },
          {
            resolve: 'gatsby-remark-prismjs'
          }
        ]
      }
    },
    {
      resolve: 'gatsby-transformer-json',
      options: {
        plugins: [
          {
            resolve: 'gatsby-source-filesystem',
            options: {
              name: 'data',
              path: `${__dirname}/src/content/json`
            }
          }
        ]
      }
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-no-sourcemaps`
  ]
}
