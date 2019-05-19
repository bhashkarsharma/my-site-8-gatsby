import { Header } from '@components/header'
import { BaseTemplate } from '@templates/base'
import React from 'react'

const NotFoundPage: React.FunctionComponent = () => (
  <BaseTemplate>
    <Header headerText="404" logoSize={25} />
    <div className="row center-xs">
      <div className="col-xs-6">
        <div className="box">
          <p>What you seek is not here.</p>
        </div>
      </div>
    </div>
  </BaseTemplate>
)

export default NotFoundPage
