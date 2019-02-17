import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import '../styles/index.scss'

export default class BlogTemplate extends React.Component<any> {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <div>
        <Helmet title={post.frontmatter.title} />
        <h1>{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    )
  }
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
