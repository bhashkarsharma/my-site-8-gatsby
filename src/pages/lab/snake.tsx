import { Header } from '@components/header'
import { SnakeGame } from '@components/lab'
import { LabTemplate } from '@templates/lab'
import { Link } from 'gatsby'
import React from 'react'

interface SnakeProps {}

interface SnakeState {
  full: boolean
}

export default class Snake extends React.Component<SnakeProps, SnakeState> {
  constructor(props: SnakeProps) {
    super(props)
    this.state = {
      full: false
    }
  }

  switchToFull(): void {
    this.setState({ full: true })
  }

  render() {
    return (
      <>
        {this.state.full ? (
          <SnakeGame />
        ) : (
          <LabTemplate>
            <Header headerText="Snake" logoSize={25} />
            <div className="center-xs">
              <SnakeGame />
              <div>Play with keyboard, mouse, or touch. Click to Play/Pause.</div>
              <h2>
                <a onClick={this.switchToFull.bind(this)}>Play Fullscreen</a>
              </h2>
            </div>
          </LabTemplate>
        )}
      </>
    )
  }
}
