import { graphql } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { Header } from '~components'
import { MarkdownRemark, Util } from '~util'
import { BaseTemplate } from './base'

const BlogBox = styled.div`
  margin: 5em 0;
`

interface BlogProps {
  data: MarkdownRemark
}

export default class BlogTemplate extends React.Component<BlogProps> {
  render() {
    const post = this.props.data.markdownRemark
    const bgColor = Util.getColorForString(post.frontmatter.categories)

    return (
      <BaseTemplate>
        <Header
          headerText={post.frontmatter.title}
          byline={post.frontmatter.date}
          bgColor={bgColor}
          bgImage={post.frontmatter.image}
          color={Util.getLabelColor(bgColor)}
          logoSize="25"
        />
        <BlogBox className="row center-xs">
          <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
            <div className="box start-xs">
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
