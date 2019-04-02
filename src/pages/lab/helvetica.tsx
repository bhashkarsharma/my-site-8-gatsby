import React from 'react'
import { Header } from '@components'
import { LabTemplate } from '@templates'
import styled from 'styled-components'

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
  private static readonly ARRANGEMENT = [
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
  private static readonly NUM_LABELS = [
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
  private static readonly MINUTE_ROUND = ['', 'FIVE', 'TEN', 'QUARTER', 'TWENTY', 'TWENTYFIVE', 'HALF']
  private static readonly TIME_PREFIX = ['IT', 'IS']
  private static readonly TO = 'TO'
  private static readonly PAST = 'PAST'
  private static readonly PRECISE = 'OCLOCK'
  private static readonly MAX_HOURS = 12
  private static readonly MAX_MINS = 60
  private static readonly ROUND_MINS = 5
  private timer = 0

  constructor(props: HelveticaProps) {
    super(props)
    this.state = {
      blink: Helvetica.ARRANGEMENT.map((i) => Array.from(i).map((_) => false))
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    this.tick()
    this.timer = setInterval(this.tick, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  tick(): void {
    this.setState({
      blink: this.getBlinkState(this.getTimeArrayForDate(new Date()))
    })
  }

  private getUsableHours(hours: number): number {
    return hours % Helvetica.MAX_HOURS || hours || Helvetica.MAX_HOURS
  }

  private getTimeArrayForDate(date: Date): string[] {
    const timeArray = Helvetica.TIME_PREFIX.slice()
    let hours = this.getUsableHours(date.getHours())
    const minutes = date.getMinutes()
    const roundedMins = Math.floor(minutes / Helvetica.ROUND_MINS) * Helvetica.ROUND_MINS

    for (let i = 0; i < Helvetica.MINUTE_ROUND.length; i++) {
      const vagueMinutes = i * Helvetica.ROUND_MINS
      if (vagueMinutes === roundedMins || Helvetica.MAX_MINS - vagueMinutes === roundedMins) {
        timeArray.push(Helvetica.MINUTE_ROUND[i])
        break
      }
    }

    if (roundedMins > 0) {
      if (roundedMins > Helvetica.MAX_MINS / 2) {
        timeArray.push(Helvetica.TO)
        hours = this.getUsableHours(++hours)
      } else {
        timeArray.push(Helvetica.PAST)
      }
    }

    timeArray.push(Helvetica.NUM_LABELS[hours])

    if (roundedMins === 0) {
      timeArray.push(Helvetica.PRECISE)
    }

    return timeArray.filter((i) => i !== '')
  }

  private getBlinkState(timeArray: string[]): boolean[][] {
    const blinkState = Helvetica.ARRANGEMENT.map((i) => Array.from(i).map((_) => false))
    let startX = 0
    let startY = 0
    timeArray.forEach((word) => {
      for (let i = startX; i < Helvetica.ARRANGEMENT.length; i++) {
        if (!Helvetica.ARRANGEMENT[i].substring(startY).includes(word)) {
          i++
        }
        const idx = Helvetica.ARRANGEMENT[i].indexOf(word)
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
        <Header headerText="Helvetica" byline="You've never seen time like this" logoSize="25" />
        <div className="row center-xs">
          <HelveticaBox className="col-xs-10 col-sm-8 col-md-8 col-lg-6">
            {Helvetica.ARRANGEMENT.map((row, rowKey) => (
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
