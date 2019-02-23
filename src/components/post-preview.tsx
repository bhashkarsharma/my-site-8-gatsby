import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { Tag } from './tag'
import { Util } from '~util'

interface MarkdownFrontmatter {
  path: string
  title: string
  date: string
  categories: string
}

interface PostPreviewProps {
  post: {
    frontmatter: MarkdownFrontmatter
    excerpt: string
  }
  count: number
}

const PostBox = styled.div`
  --shadow-width: 5px;
  margin-bottom: 4em;
  padding: 0 1em 1em;
  text-align: left;

  .date {
    font-size: 0.8em;
    font-style: italic;
  }

  .excerpt {
    font-size: 0.8em;
  }
`

const PostPreview: React.FunctionComponent<PostPreviewProps> = ({ post, count }) => {
  const color = `#${Util.getColorForString(post.frontmatter.categories)}`
  const odd = count % 2 ? -1 : 1

  return (
    <PostBox style={{ boxShadow: `calc(${odd} * var(--shadow-width)) var(--shadow-width) ${color}` }}>
      <Link to={post.frontmatter.path}>
        <h2 style={{ color }}>{post.frontmatter.title}</h2>
      </Link>
      <div className="excerpt">{post.excerpt}</div>
      <div className="date">{post.frontmatter.date}</div>
      {post.frontmatter.categories ? <Tag style={{ backgroundColor: color }}>{post.frontmatter.categories}</Tag> : null}
    </PostBox>
  )
}

PostPreview.defaultProps = {
  count: 1
}

export { PostPreview }
