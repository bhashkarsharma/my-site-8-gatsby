import { graphql } from 'gatsby'
import React from 'react'
import { Header } from '~components'
import { BaseTemplate } from '~templates'

const TalksPage: React.FunctionComponent<any> = ({ data }) => (
  <BaseTemplate>
    <Header headerText="Talks" logoSize="50" />
    <div className="row center-xs">
      <div className="col-xs-8">
        <div className="box">
          {data.allTalksJson.edges.map((edge: any, key: number) => (
            <div key={key}>
              <h2>{edge.node.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: edge.node.html }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </BaseTemplate>
)

export const pageQuery = graphql`
  query TalksQuery {
    allTalksJson {
      edges {
        node {
          title
          html
        }
      }
    }
  }
`

export default TalksPage
