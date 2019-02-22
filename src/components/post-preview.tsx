import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { Tag } from './tag'

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
}

const PostBox = styled.div`
  border: 1px solid;
  padding: 1em;
  text-align: left;

  .date {
    font-size: 0.8em;
    font-style: italic;
  }

  .excerpt {
    font-size: 0.8em;
  }
`

const PostPreview: React.FunctionComponent<PostPreviewProps> = ({ post }: PostPreviewProps) => (
  <Link to={post.frontmatter.path}>
    <PostBox>
      <h3>{post.frontmatter.title}</h3>
      <div className="date">{post.frontmatter.date}</div>
      {post.frontmatter.categories ? <Tag>{post.frontmatter.categories}</Tag> : null}
      <div className="excerpt">{post.excerpt}</div>
    </PostBox>
  </Link>
)

export { PostPreview }
