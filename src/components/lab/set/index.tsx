import { Util, Point, UserEvent } from '@util/index'
import React from 'react'
import { Card } from './card'
import { UI } from './ui'
import { CardUtil } from './util'

interface SetGameProps {}

interface SetGameState {}

export class SetGame extends React.Component<SetGameProps, SetGameState> {
  private static readonly DRAW_COUNT = 12
  private static readonly DRAW_STEP = 3

  private canvas: any
  private cards: Card[] = []
  private chosen: number[] = []
  private drawCount = SetGame.DRAW_COUNT
  private ui: UI | null

  constructor(props: SetGameProps) {
    super(props)
    this.state = {}
    this.ui = null

    this.handleResize = this.handleResize.bind(this)
    this.handleTouch = this.handleTouch.bind(this)
    this.draw = this.draw.bind(this)
  }

  componentDidMount() {
    this.cards = CardUtil.shuffle(CardUtil.generateDeck())
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize(): void {
    this.canvas = this.refs.canvas
    const width = this.canvas.parentElement.clientWidth
    const height = window.innerHeight
    this.canvas.width = width
    this.canvas.height = height
    this.canvas.scrollIntoView()

    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')
    this.ui = new UI(ctx, width, height)

    this.draw()
  }

  private draw(): void {
    if (this.ui) {
      this.ui.drawDeck(this.cards.slice(0, this.drawCount), this.chosen)
    }
    // requestAnimationFrame(() => this.draw())
  }

  handleTouch(e: any): void {
    const { point, event } = Util.normalizeMouseTouchEvents(e)
    if (event === UserEvent.END) {
      const canvasBounds = this.canvas.getBoundingClientRect()
      const clickPosition: Point = {
        x: Math.floor(point.x - canvasBounds.left),
        y: Math.floor(point.y - canvasBounds.top)
      }
      if (this.ui) {
        const cardBounds = this.ui.getCardBounds(this.drawCount)
        const grid = this.ui.getGridSize(this.drawCount)
        const block: Point = {
          x: Math.floor(clickPosition.x / cardBounds.x),
          y: Math.floor(clickPosition.y / cardBounds.y)
        }
        const cardIndex = grid.y * block.x + block.y
        this.onCardClick(cardIndex)
        // console.log(grid, this.cards[cardIndex])
      }
    }
  }

  onCardClick(index: number): void {
    if (this.chosen.includes(index)) {
      const newChosen = [...this.chosen]
      newChosen.splice(this.chosen.indexOf(index), 1)
      this.chosen = newChosen
    } else {
      this.chosen = [...this.chosen, index]
      if (this.chosen.length > 3) {
        this.chosen = []
      }
    }
    this.draw()
  }

  render() {
    return (
      <canvas
        ref="canvas"
        style={{ border: '2px solid', backgroundImage: 'radial-gradient(#00d439, #004009)' }}
        onMouseDown={this.handleTouch}
        onMouseUp={this.handleTouch}
        onTouchStart={this.handleTouch}
        onTouchEnd={this.handleTouch}
      />
    )
  }
}
