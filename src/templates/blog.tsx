import { Header } from '@components/header'
import { MarkdownRemark, Util } from '@util/index'
import { graphql } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { BaseTemplate } from './base'

const BlogBox = styled.div`
  margin: 5em 0;
`

interface BlogProps {
  data: { markdownRemark: MarkdownRemark }
}

const BlogTemplate: React.FunctionComponent<BlogProps> = (props: BlogProps) => {
  const post = props.data.markdownRemark
  const bgColor = Util.getColorForString(post.frontmatter.categories || '')

  return (
    <BaseTemplate>
      <Header
        headerText={post.frontmatter.title || ''}
        byline={post.frontmatter.date}
        bgColor={bgColor}
        bgImage={post.frontmatter.image ? post.frontmatter.image.childImageSharp.fluid : undefined}
        bgAlt={post.frontmatter.image_credit}
        color={Util.getLabelColor(bgColor)}
        logoSize={25}
      />
      <BlogBox className="row center-xs">
        <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
          <div className="box start-xs">
            <div dangerouslySetInnerHTML={{ __html: post.html || '' }} />
          </div>
        </div>
      </BlogBox>
    </BaseTemplate>
  )
}

export default BlogTemplate

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
        image {
          childImageSharp {
            fluid(maxWidth: 1200) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        image_credit
      }
    }
  }
`
