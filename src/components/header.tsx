import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import { Menu } from './menu'
import { Logo } from './logo'

interface HeaderProp {
  headerText: string
  logoSize: number
}

const Header: React.FunctionComponent<HeaderProp> = (props: HeaderProp) => (
  <div>
    <Logo size={props.logoSize} />
    <h1>{props.headerText}</h1>
    <StaticQuery
      query={graphql`
        query HeaderQuery {
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
