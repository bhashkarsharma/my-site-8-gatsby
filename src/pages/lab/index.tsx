import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Header } from '~components'
import { BaseTemplate } from '~templates'

export default (props: any) => (
  <BaseTemplate>
    <Helmet title={`Lab - ${props.data.site.siteMetadata.title}`} />
    <Header headerText="Lab" logoSize="25" />
  </BaseTemplate>
)

export const pageQuery = graphql`
  query LabQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
