import React from 'react'
import { Header } from '~components'
import { BaseTemplate } from '~templates'

const IndexPage: React.FunctionComponent<any> = () => (
  <BaseTemplate>
    <Header headerText="404" logoSize="50" />
    <div className="row center-xs">
      <div className="col-xs-6">
        <div className="box">
          <p>What you seek is not here.</p>
        </div>
      </div>
    </div>
  </BaseTemplate>
)

export default IndexPage
