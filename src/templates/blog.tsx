import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Header } from '~components'
import { BaseTemplate } from './base'

const DateBox = styled.p`
  font-size: 0.8em;
  font-style: italic;
`

export default class BlogTemplate extends React.Component<any> {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <BaseTemplate>
        <Helmet title={post.frontmatter.title} />
        <Header headerText={post.frontmatter.title} logoSize="25" />
        <div className="row center-xs">
          <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
            <div className="box start-xs">
              <DateBox>{post.frontmatter.date}</DateBox>
              <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
          </div>
        </div>
      </BaseTemplate>
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
