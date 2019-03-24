import { Link } from 'gatsby'
import React from 'react'
import { BaseTemplate } from './base'

const LabTemplate: React.FunctionComponent = (props) => (
  <BaseTemplate>
    {props.children}
    <div className="row center-xs">
      <h2>
        <Link to="/lab">Back to Lab</Link>
      </h2>
    </div>
  </BaseTemplate>
)
export { LabTemplate }
