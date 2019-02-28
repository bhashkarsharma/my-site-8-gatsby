import React from 'react'
import { Header, Vinyl } from '~components'
import { BaseTemplate } from '~templates'

const IndexPage: React.FunctionComponent = () => (
  <BaseTemplate>
    <Header logoSize="50" />
    <div className="row center-xs">
      <div className="col-xs-12">
        <div className="box">
          <Vinyl />
        </div>
      </div>
    </div>
  </BaseTemplate>
)

export default IndexPage
