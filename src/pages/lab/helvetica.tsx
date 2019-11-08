import { Header } from '@components/header'
import { LabTemplate } from '@templates/lab'
import React from 'react'
import styled from 'styled-components'

const ARRANGEMENT = [
  'ITLISASTIME',
  'ACQUARTERDC',
  'TWENTYFIVEX',
  'HALFBTENFTO',
  'PASTERUNINE',
  'ONESIXTHREE',
  'FOURFIVETWO',
  'EIGHTELEVEN',
  'SEVENTWELVE',
  'TENSEOCLOCK'
]
const NUM_LABELS = [
  'ZERO',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'ELEVEN',
  'TWELVE'
]
const MINUTE_LABELS = ['', 'FIVE', 'TEN', 'QUARTER', 'TWENTY', 'TWENTYFIVE', 'HALF']
const TIME_PREFIX = ['IT', 'IS']
const TO = 'TO'
const PAST = 'PAST'
const PRECISE = 'OCLOCK'
const MAX_HOURS = 12
const MAX_MINS = 60
const ROUND_MINS = 5

const HelveticaBox = styled.div`
  font-family: Helvetica, Arial, sans-serif;
`

const HelvticaRow = styled.div`
  line-height: 1em;
  text-align: center;
`

const HelveticaChar = styled.div`
  --size: 1em;
  display: inline-block;
  height: var(--size);
  width: var(--size);

  &.on {
    color: var(--color-blue);
  }

  &.off {
    color: var(--color-red);
  }

  @media (min-width: 64em) {
    --size: 1.5em;
    font-size: var(--size);
  }

  @media (max-width: 64em) {
    --size: 1.2em;
  }
`

interface HelveticaProps {}

interface HelveticaState {
  blink: boolean[][]
}

export default class Helvetica extends React.Component<HelveticaProps, HelveticaState> {
  private timer = 0

  state = {
    blink: ARRANGEMENT.map((i) => Array.from(i).map((_) => false))
  }

  componentDidMount() {
    this.tick()
    this.timer = setInterval(this.tick, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  tick = (): void => {
    this.setState({
      blink: this.getBlinkState(this.getTimeArrayForDate(new Date()))
    })
  }

  private getUsableHours = (hours: number): number => {
    return hours % MAX_HOURS || hours || MAX_HOURS
  }

  private getTimeArrayForDate = (date: Date): string[] => {
    const timeArray = TIME_PREFIX.slice()
    let hours = this.getUsableHours(date.getHours())
    const minutes = date.getMinutes()
    const roundedMins = Math.floor(minutes / ROUND_MINS) * ROUND_MINS

    for (let i = 0; i < MINUTE_LABELS.length; i++) {
      const vagueMinutes = i * ROUND_MINS
      if (vagueMinutes === roundedMins || MAX_MINS - vagueMinutes === roundedMins) {
        timeArray.push(MINUTE_LABELS[i])
        break
      }
    }

    if (roundedMins > 0) {
      if (roundedMins > MAX_MINS / 2) {
        timeArray.push(TO)
        hours = this.getUsableHours(++hours)
      } else {
        timeArray.push(PAST)
      }
    }

    timeArray.push(NUM_LABELS[hours])

    if (roundedMins === 0) {
      timeArray.push(PRECISE)
    }

    return timeArray.filter((i) => i !== '')
  }

  private getBlinkState = (timeArray: string[]): boolean[][] => {
    const blinkState = ARRANGEMENT.map((i) => Array.from(i).map((_) => false))
    let startX = 0
    let startY = 0
    timeArray.forEach((word) => {
      for (let i = startX; i < ARRANGEMENT.length; i++) {
        if (!ARRANGEMENT[i].substring(startY).includes(word)) {
          i++
        }
        const idx = ARRANGEMENT[i].indexOf(word)
        if (idx !== -1) {
          blinkState[i].splice(idx, word.length, ...Array(word.length).fill(true))
          startX = i
          startY = idx + word.length
          break
        }
        startY = 0
      }
    })
    return blinkState
  }

  render() {
    return (
      <LabTemplate>
        <Header headerText="Helvetica" byline="You've never seen time like this" logoSize={25} />
        <div className="row center-xs">
          <HelveticaBox className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
            {ARRANGEMENT.map((row, rowKey) => (
              <HelvticaRow key={rowKey}>
                {Array.from(row).map((letter, letterKey) => (
                  <HelveticaChar className={this.state.blink[rowKey][letterKey] ? 'on' : 'off'} key={letterKey}>
                    {letter}
                  </HelveticaChar>
                ))}
              </HelvticaRow>
            ))}
          </HelveticaBox>
        </div>
      </LabTemplate>
    )
  }
}
