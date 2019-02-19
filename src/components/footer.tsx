import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import { Menu } from './menu'
import styled from 'styled-components'

const FooterBox = styled.div`
  background-color: var(--color-blue);
  color: var(--color-white);
  padding: 2em;
`

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
      render={(data) => (
        <FooterBox className="row center-xs">
          <div className="col-xs-6">
            <div className="box start-xs">
              <Menu items={data.allFooterJson.edges} />
              <div>&copy; Bhashkar Sharma </div>
            </div>
          </div>
        </FooterBox>
      )}
    />
  </div>
)

export { Footer }
