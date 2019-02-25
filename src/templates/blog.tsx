import { graphql } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { Header } from '~components'
import { MarkdownRemark } from '~util'
import { BaseTemplate } from './base'

const BlogBox = styled.div`
  margin: 5em 0;
`

const DateBox = styled.p`
  font-size: 0.8em;
  font-style: italic;
`

interface BlogProps {
  data: MarkdownRemark
}

export default class BlogTemplate extends React.Component<BlogProps> {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <BaseTemplate>
        <Header headerText={post.frontmatter.title} logoSize="25" />
        <BlogBox className="row center-xs">
          <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
            <div className="box start-xs">
              <DateBox>{post.frontmatter.date}</DateBox>
              <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
          </div>
        </BlogBox>
      </BaseTemplate>
    )
  }
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        categories
        image
        image_credit
      }
    }
  }
`
