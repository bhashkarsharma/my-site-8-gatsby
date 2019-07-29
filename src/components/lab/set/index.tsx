import { Point, UserEvent, Util } from '@util/index'
import React from 'react'
import { Card, DRAW, GameEvent } from './types'
import { UI } from './ui'
import { SetGameUtil } from './util'

const MAX_SWIPE_DIST = 4

const BACKGROUND_CHOICES = ['#00d439, #004009', '#ba3221, #540000', '#d4d24f, #6e6c00']

const pad = (num: number): string => `0${num}`.slice(-2)

interface SetGameProps {}

interface SetGameState {
  validSets: number
  start: number
  passed: string
}

export class SetGame extends React.Component<SetGameProps, SetGameState> {
  private canvas: any
  private cards: Card[] = []
  private chosen: number[] = []
  private drawCount = DRAW.MIN
  private ui: UI | null = null
  private lastEvent: Point | null = null
  private background: string = ''

  state: SetGameState = {
    validSets: 0,
    start: 0,
    passed: ''
  }

  get hand(): Card[] {
    return this.cards.slice(0, this.drawCount)
  }

  private getSeconds = () => Math.floor(Date.now() / 1000)

  componentDidMount() {
    this.setState({ start: this.getSeconds() })
    setInterval(this.timer, 1000)
    this.background = this._getBackground()
    this.cards = SetGameUtil.initGame(this.drawCount)
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  timer = (): void => {
    const now = this.getSeconds()
    const elapsed = now - this.state.start
    const secs = elapsed % 60
    const elapsedMins = Math.floor(elapsed / 60)
    const mins = elapsedMins % 60
    const hrs = Math.floor(elapsedMins / 60)
    this.setState({ passed: `${pad(hrs)}:${pad(mins)}:${pad(secs)}` })
  }

  _getBackground = (): string => {
    const choice = BACKGROUND_CHOICES[Math.floor(BACKGROUND_CHOICES.length * Math.random())]
    return `radial-gradient(${choice})`
  }

  handleResize = (): void => {
    this.canvas = this.refs.canvas
    const width = this.canvas.parentElement.clientWidth
    const height = window.innerHeight
    this.canvas.width = width
    this.canvas.height = height
    this.canvas.scrollIntoView()

    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')
    this.ui = new UI(ctx, width, height)
    this.draw()
    this.setState({ validSets: SetGameUtil.countValidSets(this.hand) })
  }

  private draw = (): void => {
    if (this.ui) {
      this.ui.drawDeck(this.hand, this.chosen)
    }
  }

  handleTouch = (e: any): void => {
    const { point, event } = Util.normalizeMouseTouchEvents(e)
    if (event === UserEvent.START) {
      this.lastEvent = point
    } else {
      // handle rogue touches
      const mouseDown = this.lastEvent || { x: 0, y: 0 }
      const { x: swipeX, y: swipeY } = Util.getSwipe(mouseDown, point)
      if (swipeX > MAX_SWIPE_DIST || swipeY > MAX_SWIPE_DIST) {
        return
      }

      const canvasBounds = this.canvas.getBoundingClientRect()
      const clickPosition: Point = {
        x: Math.floor(point.x - canvasBounds.left),
        y: Math.floor(point.y - canvasBounds.top)
      }
      if (this.ui) {
        const cardBounds = this.ui.getCardBoxDimensions(this.drawCount)
        const grid = this.ui.getGridSize(this.drawCount)
        const block: Point = {
          x: Math.floor(clickPosition.x / cardBounds.x),
          y: Math.floor(clickPosition.y / cardBounds.y)
        }
        const cardIndex = grid.y * block.x + block.y
        const { deck, chosen, drawCount, callbackType } = SetGameUtil.selectCardAtIndex(
          this.cards,
          this.chosen,
          cardIndex
        )
        this.cards = deck
        this.chosen = chosen
        this.drawCount = drawCount
        this.cardSelectCallback(callbackType, chosen, cardIndex)
      }
      this.setState({ validSets: SetGameUtil.countValidSets(this.hand) })
      this.lastEvent = null
    }
  }

  cardSelectCallback = (type: GameEvent, chosen: number[], index: number): void => {
    switch (type) {
      case GameEvent.CARD_SELECTED:
        return this.cardSelectedCallback(index)
      case GameEvent.CARD_UNSELECTED:
        return this.cardUnselectedCallback(index)
      case GameEvent.VALID_SET:
        return this.cardSelectedCallback(index, () => this.validSetCallback(chosen))
      case GameEvent.INVALID_SET:
        return this.cardSelectedCallback(index, () => this.invalidSetCallback(chosen))
    }
  }

  validSetCallback = (indices: number[], cb = this.draw): void => {
    indices.forEach((index: number) => {
      const callback = () => {
        if (this.ui) {
          this.ui.drawEntryAnimation({
            card: this.cards[index],
            deckSize: this.drawCount,
            index,
            callback: this.draw
          })
        }
      }

      if (this.ui && index < this.drawCount) {
        this.ui.drawSuccessAnimation({
          card: this.cards[index],
          deckSize: this.drawCount,
          index,
          callback
        })

        this.chosen = []
      }
    })
  }

  invalidSetCallback = (indices: number[], callback = this.draw): void => {
    if (this.ui) {
      this.ui.drawCardsErrorAnimation({ cards: this.cards, deckSize: this.drawCount, indices, callback })

      this.chosen = []
    }
  }

  cardSelectedCallback = (index: number, callback = this.draw): void => {
    if (this.ui && index < this.drawCount) {
      this.ui.drawCardSelectedAnimation({ card: this.cards[index], deckSize: this.drawCount, index, callback })
    }
  }

  cardUnselectedCallback = (index: number, callback = this.draw): void => {
    if (this.ui && index < this.drawCount) {
      this.ui.drawCardUnselectedAnimation({ card: this.cards[index], deckSize: this.drawCount, index, callback })
    }
  }

  shuffleHand = (): void => {
    this.cards = SetGameUtil.shuffle(this.cards, this.drawCount)
    this.chosen = []
    this.draw()
  }

  showHint = (): void => {
    const hints = SetGameUtil.getValidSets(this.hand)
    if (hints.length) {
      const hint = hints[0]
      hint.forEach((index) => {
        if (this.ui) {
          this.ui.drawHintAnimation({ card: this.cards[index], deckSize: this.drawCount, index, callback: this.draw })
        }
      })
    }
  }

  render() {
    const { validSets, passed } = this.state
    return (
      <div>
        <div>Possible sets: {validSets}</div>
        <div>Remaining cards: {this.cards.length}</div>
        <div>Time: {passed}</div>
        <div>Score:</div>
        <button onClick={this.showHint}>Hint</button>
        <button onClick={this.shuffleHand}>Shuffle</button>
        <canvas
          ref="canvas"
          style={{ border: '2px solid', backgroundImage: this.background }}
          onMouseDown={this.handleTouch}
          onMouseUp={this.handleTouch}
          onTouchStart={this.handleTouch}
          onTouchEnd={this.handleTouch}
        />
      </div>
    )
  }
}
