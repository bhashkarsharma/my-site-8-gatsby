import { graphql } from 'gatsby'
import React from 'react'
import { Header } from '~components'
import { HomeTemplate } from '~templates'

const IndexPage: React.FunctionComponent<any> = (props) => (
  <HomeTemplate>
    <Header headerText={props.data.site.siteMetadata.title} logoSize="50" />
    <div className="row center-xs">
      <div className="col-xs-6">
        <div className="box">
          <p>Welcome to the machine</p>
        </div>
      </div>
    </div>
  </HomeTemplate>
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
