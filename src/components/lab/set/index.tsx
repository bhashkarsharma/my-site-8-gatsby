import { Point, UserEvent, Util } from '@util/index'
import React from 'react'
import { Card, DRAW, GameEvent } from './types'
import { UI } from './ui'
import { SetGameUtil } from './util'

interface SetGameProps {}

interface SetGameState {
  validSets: number
}

export class SetGame extends React.Component<SetGameProps, SetGameState> {
  private canvas: any
  private cards: Card[] = []
  private chosen: number[] = []
  private drawCount = DRAW.MIN
  private ui: UI | null = null

  state = {
    validSets: 0
  }

  get hand(): Card[] {
    return this.cards.slice(0, this.drawCount)
  }

  componentDidMount() {
    this.cards = SetGameUtil.initGame(this.drawCount)
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
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
    if (event === UserEvent.END) {
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
      if (this.ui && index < this.drawCount) {
        this.ui.drawExitAnimation(this.cards[index], this.drawCount, index, () => {
          if (this.ui) {
            this.ui.drawEntryAnimation(this.cards[index], this.drawCount, index, this.draw)
          }
        })

        this.chosen = []
      }
    })
  }

  invalidSetCallback = (indices: number[], cb = this.draw): void => {
    if (this.ui) {
      this.ui.drawCardsErrorAnimation(this.cards, this.drawCount, indices, cb)
      this.chosen = []
    }
  }

  cardSelectedCallback = (index: number, cb = this.draw): void => {
    if (this.ui && index < this.drawCount) {
      this.ui.drawCardSelectedAnimation(this.cards[index], this.drawCount, index, cb)
    }
  }

  cardUnselectedCallback = (index: number, cb = this.draw): void => {
    if (this.ui && index < this.drawCount) {
      this.ui.drawCardUnselectedAnimation(this.cards[index], this.drawCount, index, cb)
    }
  }

  render() {
    return (
      <div>
        <div>Possible sets: {this.state.validSets}</div>
        <canvas
          ref="canvas"
          style={{ border: '2px solid', backgroundImage: 'radial-gradient(#00d439, #004009)' }}
          onMouseDown={this.handleTouch}
          onMouseUp={this.handleTouch}
          onTouchStart={this.handleTouch}
          onTouchEnd={this.handleTouch}
        />
      </div>
    )
  }
}
