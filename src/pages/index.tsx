import { graphql } from 'gatsby'
import React from 'react'
import { Header } from '~components'
import { BaseTemplate } from '~templates'

const IndexPage: React.FunctionComponent<any> = (props) => (
  <BaseTemplate>
    <Header logoSize="50" />
    <div className="row center-xs">
      <div className="col-xs-6">
        <div className="box">
          <p>Welcome to the machine</p>
        </div>
      </div>
    </div>
  </BaseTemplate>
)

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`

export default IndexPage
