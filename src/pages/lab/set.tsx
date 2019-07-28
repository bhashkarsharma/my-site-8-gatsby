import { Header } from '@components/header'
import { SetGame } from '@components/lab'
import { LabTemplate } from '@templates/lab'
import React from 'react'

const Set: React.FunctionComponent = () => (
  <LabTemplate>
    <Header headerText="Set" logoSize={25} />
    <div className="center-xs" />
    <SetGame />
  </LabTemplate>
)

export default Set
