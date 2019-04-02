import { Header } from '@components/header'
import { BaseTemplate } from '@templates/base'
import { graphql, Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const LinkBox = styled.span`
  display: inline-block;
  font-size: 2em;
  margin: 0.4em;
`

const Lab: React.FunctionComponent<any> = ({ data }) => (
  <BaseTemplate>
    <Header headerText="Lab" logoSize={25} />
    <div className="row center-xs">
      <div className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
        {data.pages.edges.map(({ node }: any, key: number) => (
          <LinkBox key={key}>
            <Link to={node.path}>{node.internalComponentName.split('Lab')[1]}</Link>
          </LinkBox>
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
