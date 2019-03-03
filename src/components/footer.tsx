import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import { Menu } from './menu'
import styled from 'styled-components'

const FooterBox = styled.footer`
  background-color: var(--color-blue);
  color: var(--color-white);
  padding: 2em;

  a:hover {
    color: var(--color-white);
  }

  li {
    display: inline-block;
    font-size: 2rem;
    margin-right: 1em;

    &:last-child {
      margin: 0;
    }
  }

  .copy {
    margin: 2em 0 1em;
  }
`

const Footer: React.FunctionComponent = () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        allFooterJson {
          edges {
            node {
              class
              label
              link
            }
          }
        }
      }
    `}
    render={(data) => (
      <FooterBox className="row center-xs">
        <div className="col-xs-12 col-md-6">
          <div className="box center-xs">
            <Menu items={data.allFooterJson.edges} />
            <div className="copy">&copy; Bhashkar Sharma</div>
          </div>
        </div>
      </FooterBox>
    )}
  />
)

export { Footer }
