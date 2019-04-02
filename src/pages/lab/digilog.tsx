import React from 'react'
import styled from 'styled-components'
import { Header } from '@components'
import { Face } from '@components/lab'
import { LabTemplate } from '@templates'

interface DigilogProps {}

interface DigilogState {
  isDigital: boolean
  time: number[]
  hours: number
  minutes: number
}

const DigilogBox = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin: 0 2em;
`

export default class Digilog extends React.Component<DigilogProps, DigilogState> {
  private static readonly ANGLE_OFFSET = 90
  private static readonly TOTAL_MINUTES = 60
  private timer = 0

  constructor(props: DigilogProps) {
    super(props)
    this.state = {
      isDigital: true,
      time: [0, 0, 0, 0, 0, 0],
      hours: 0,
      minutes: 0
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    this.tick()
    this.timer = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  tick(): void {
    const date = new Date()
    if (this.state.isDigital) {
      let time: number[] = []
      const digits = [date.getHours(), date.getMinutes(), date.getSeconds()]
      digits.forEach((i) => {
        time = time.concat(
          i
            .toString()
            .padStart(2, '0')
            .split('')
            .map((i) => +i)
        )
      })
      this.setState({ time })
    } else {
      const h = date.getHours()
      const m = date.getMinutes()
      const hours = 0.5 * (Digilog.TOTAL_MINUTES * h + m) - Digilog.ANGLE_OFFSET
      const minutes = 6 * m - Digilog.ANGLE_OFFSET
      this.setState({ hours, minutes })
    }
  }

  switchMode(): void {
    const isDigital = !this.state.isDigital
    this.setState({ isDigital })
  }

  render() {
    return (
      <LabTemplate>
        <Header headerText="Digilog" logoSize="25" />
        <DigilogBox onClick={this.switchMode.bind(this)}>
          {this.state.time.map((digit, key) => (
            <Face
              isDigital={this.state.isDigital}
              val={digit}
              hours={this.state.hours}
              minutes={this.state.minutes}
              key={key}
            />
          ))}
        </DigilogBox>
      </LabTemplate>
    )
  }
}
