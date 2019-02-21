import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Header } from '~components'
import { BaseTemplate } from '~templates'

const IndexPage: React.FunctionComponent<any> = (props) => (
  <BaseTemplate>
    <Helmet title={props.data.site.siteMetadata.title} />
    <Header headerText={props.data.site.siteMetadata.title} logoSize="50" />
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
