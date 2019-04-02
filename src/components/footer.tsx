import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { Menu } from './menu'

const FooterBox = styled.footer`
  background-color: var(--color-blue);
  clip-path: polygon(0% 10%, 100% 20%, 100% 100%, 0 100%);
  color: var(--color-white);
  margin-top: 4em;
  padding: 4em 2em 2em;

  a:hover {
    color: var(--color-white);
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
      <FooterBox>
        <div className="row center-xs">
          <div className="col-xs-12 col-md-6">
            <div className="box center-xs">
              <Menu items={data.allFooterJson.edges} />
              <div className="copy">&copy; Bhashkar Sharma</div>
            </div>
          </div>
        </div>
      </FooterBox>
    )}
  />
)

export { Footer }
