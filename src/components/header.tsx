import React from 'react'
import { Menu } from './menu'
import { StaticQuery, graphql } from 'gatsby'

interface HeaderProp {
  headerText: string
}

const Header: React.FunctionComponent<HeaderProp> = (props: HeaderProp) => (
  <div>
    <h1>{props.headerText}</h1>
    <StaticQuery
      query={graphql`
        query MenuQuery {
          allHeaderJson {
            edges {
              node {
                label
                link
              }
            }
          }
        }
      `}
      render={(data) => <Menu items={data.allHeaderJson.edges} />}
    />
  </div>
)

export { Header }
