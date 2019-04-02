import { FluidObject } from 'gatsby-image'

export interface MarkdownFrontmatter {
  title?: string
  path: string
  canonical?: string
  date?: string
  tags?: string
  categories?: string
  comments?: string
  image?: {
    childImageSharp: {
      fluid: FluidObject
    }
  }
  image_credit?: string
}

export interface WordCount {
  paragraphs: number
  sentences: number
  words: number
}

export interface MarkdownRemark {
  id?: string
  frontmatter: MarkdownFrontmatter
  excerpt?: string
  timeToRead?: number
  html?: string
  wordCount?: WordCount
}

export interface Point {
  x: number
  y: number
}

export enum UserEvent {
  START,
  END
}
