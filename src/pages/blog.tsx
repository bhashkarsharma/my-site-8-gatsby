import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Header, PostPreview } from '~components'
import { BaseTemplate } from '~templates'

const BlogPage: React.FunctionComponent<any> = ({ data }) => (
  <BaseTemplate>
    <Helmet title={`Blog - ${data.site.siteMetadata.title}`} />
    <Header headerText="Blog" logoSize="25" />
    <div className="row center-xs">
      <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
        {data.posts.edges.map((edge: any, key: number) => (
          <PostPreview post={edge.node} key={key} />
        ))}
      </div>
    </div>
  </BaseTemplate>
)

export const pageQuery = graphql`
  query BlogQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    posts: allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          frontmatter {
            categories
            date(formatString: "MMMM DD, YYYY")
            image
            path
            title
          }
        }
      }
    }
  }
`

export default BlogPage
