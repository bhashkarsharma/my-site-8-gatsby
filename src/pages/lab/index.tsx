import { graphql, Link } from 'gatsby'
import React from 'react'
import { Header } from '~components'
import { BaseTemplate } from '~templates'

const Lab: React.FunctionComponent<any> = ({ data }) => (
  <BaseTemplate>
    <Header headerText="Lab" logoSize="25" />
    <div className="row center-xs">
      <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
        {data.pages.edges.map(({ node }: any, key: number) => (
          <Link key={key} to={node.path}>
            {node.internalComponentName.split('Lab')[1]}
          </Link>
        ))}
      </div>
    </div>
  </BaseTemplate>
)

export const PageQuery = graphql`
  query LabQuery {
    pages: allSitePage(filter: { path: { regex: "/lab/\\\\w+/" } }) {
      edges {
        node {
          internalComponentName
          path
        }
      }
    }
  }
`

export default Lab
