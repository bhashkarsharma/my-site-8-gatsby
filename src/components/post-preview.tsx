import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { MarkdownRemark, Util } from '~util'
import { Tag } from './tag'

interface PostPreviewProps {
  post: MarkdownRemark
  count: number
}

interface PostBoxProps {
  odd: boolean
  color: string
}

const PostBox = styled.div`
  --shadow-width: 5px;

  box-shadow: ${(props: PostBoxProps) =>
    `calc(${props.odd ? '-1' : '1'} * var(--shadow-width)) var(--shadow-width) ${props.color}`} 
  margin-bottom: 4em;
  padding: 0 1em 1em;
  text-align: left;

  .date {
    font-size: 0.7em;
    font-style: italic;
    margin-top: 1em;
  }

  .excerpt {
    color: var(--color-text);
    font-size: 0.7em;
  }
`

const PostPreview: React.FunctionComponent<PostPreviewProps> = ({ post, count }) => {
  const color = Util.getColorForString(post.frontmatter.categories)

  return (
    <PostBox odd={count % 2 == 1} color={color}>
      <Link to={post.frontmatter.path}>
        <h2 style={{ color }}>{post.frontmatter.title}</h2>
        <div className="excerpt">{post.excerpt}</div>
        <div className="date" style={{ color }}>
          {post.frontmatter.date}
        </div>
      </Link>
      {post.frontmatter.categories ? <Tag bgColor={color}>{post.frontmatter.categories}</Tag> : null}
    </PostBox>
  )
}

PostPreview.defaultProps = {
  count: 1
}

export { PostPreview }
