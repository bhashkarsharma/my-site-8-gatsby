export interface MarkdownFrontmatter {
  title?: string
  path: string
  canonical?: string
  date?: string
  tags?: string
  categories?: string
  comments?: string
  image?: string
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
