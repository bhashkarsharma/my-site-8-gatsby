import { Header } from '@components/header'
import { SetGame } from '@components/lab'
import { LabTemplate } from '@templates/lab'
import React from 'react'

interface SetProps {}

interface SetState {}

export default class Set extends React.Component<SetProps, SetState> {
  state = {}

  render() {
    return (
      <LabTemplate>
        <Header headerText="Set" logoSize={25} />
        <div className="center-xs" />
        <SetGame />
      </LabTemplate>
    )
  }
}
