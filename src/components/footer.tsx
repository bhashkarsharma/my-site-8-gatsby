import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import { Menu } from './menu'

const Footer: React.FunctionComponent = () => (
  <div>
    <StaticQuery
      query={graphql`
        query FooterQuery {
          allFooterJson {
            edges {
              node {
                label
                link
              }
            }
          }
        }
      `}
      render={(data) => <Menu items={data.allFooterJson.edges} />}
    />
  </div>
)

export { Footer }
