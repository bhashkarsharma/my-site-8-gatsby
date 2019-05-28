import { Point } from '@util/index'
import { Card } from './card'
import { Draw } from './draw'
import { Orientation } from './types'

export class UI {
  private static readonly MAX_ASPECT_RATIO = 4 / 3
  private static readonly CARD_GROUP_SIZE = 3
  private static readonly NORMAL_CARD_COVER = 0.85
  private static readonly CHOSEN_CARD_COVER = 0.7
  private static readonly STRING_NUMS = ['ZERO', 'ONE', 'TWO', 'THREE']

  private static readonly COLOR_MAP: { [color: string]: string } = {
    RED: '#FF0080',
    GREEN: '#4AD76A',
    BLUE: '#6F72CD'
  }

  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private orientation: Orientation
  private shadedFillMap: { [color: string]: CanvasPattern } = {}

  private readonly DRAW_FILL_MAP: { [fill: string]: Function } = {
    EMPTY: (card: Card) => 'white',
    SHADED: (card: Card) => this.getFillPattern(UI.getColorCode(card.color)),
    SOLID: (card: Card) => UI.getColorCode(card.color)
  }

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
    this.orientation = width > height ? Orientation.LANDSCAPE : Orientation.PORTRAIT
  }

  private static floorProduct = (dm: number) => (n: number) => Math.floor(n * dm)

  private static getColorCode = (colorName: string) => UI.COLOR_MAP[colorName]

  getOrientation(): Orientation {
    return this.orientation
  }

  drawDeck(deck: Card[], chosen: number[]): void {
    const len = deck.length
    const grid = this.getGridSize(len)
    const cardBounds = this.getCardBounds(len)
    // console.log(grid, cardBounds)
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 0; i < grid.x; i++) {
      for (let j = 0; j < grid.y; j++) {
        const index = i * grid.y + j
        const dimensionMultiplier = chosen.includes(index) ? UI.CHOSEN_CARD_COVER : UI.NORMAL_CARD_COVER
        const scaledDimensions = UI.floorProduct(dimensionMultiplier)
        const dimensions = { x: scaledDimensions(cardBounds.x), y: scaledDimensions(cardBounds.y) }
        const space = { x: cardBounds.x - dimensions.x, y: cardBounds.y - dimensions.y }
        const position = {
          x: Math.floor(i * cardBounds.x + space.x / 2),
          y: Math.floor(j * cardBounds.y + space.y / 2)
        }
        // console.log(index, position)
        // this.ctx.strokeRect(cardBounds.x * i, cardBounds.y * j, cardBounds.x, cardBounds.y)
        this.drawCard(deck[index], position, dimensions)
      }
    }
  }

  getCardBounds(deckSize: number): Point {
    const grid = this.getGridSize(deckSize)
    return {
      x: UI.floorProduct(this.width)(1 / grid.x),
      y: UI.floorProduct(this.height)(1 / grid.y)
    }
  }

  getGridSize(deckSize: number): Point {
    const groupSize = UI.CARD_GROUP_SIZE
    const itemsPerRow = this.getOrientation() === Orientation.LANDSCAPE ? deckSize / groupSize : groupSize
    const itemsPerCol = this.getOrientation() === Orientation.LANDSCAPE ? groupSize : deckSize / groupSize
    return {
      x: itemsPerRow,
      y: itemsPerCol
    }
  }

  private drawCard(card: Card, position: Point, dimensions: Point): void {
    // console.log(card, position)
    const { ctx } = this
    ctx.save()
    ctx.fillStyle = 'white'
    // ctx.strokeRect(position.x, position.y, dimensions.x, dimensions.y)
    Draw.drawRoundedRect(ctx, position, dimensions)
    ctx.stroke()
    ctx.fill()
    ctx.fillStyle = this.DRAW_FILL_MAP[card.fill](card)
    ctx.strokeStyle = UI.getColorCode(card.color)
    ctx.lineWidth = 2
    this.drawShapes(card, position, dimensions)
    ctx.restore()
  }

  private drawShapes(card: Card, position: Point, dimensions: Point): void {
    const { ctx } = this
    const cardOrientation = dimensions.x > dimensions.y ? Orientation.LANDSCAPE : Orientation.PORTRAIT
    const count = UI.STRING_NUMS.indexOf(card.count)
    const { size: newDimensions, start: newPosition } = UI.getScaledCoords(position, dimensions, UI.NORMAL_CARD_COVER)
    const { coords, size } = UI.getShapeBounds(newPosition, newDimensions, count, cardOrientation)
    coords.forEach((start: Point) => {
      // ctx.strokeRect(start.x, start.y, size.x, size.y)
      const drawFunc = Draw.getFunc(card.shape)
      const { size: newSize, start: newStart } = UI.getScaledCoords(start, size)

      drawFunc(ctx, newStart, newSize, cardOrientation)
      ctx.fill()
      ctx.stroke()
    })
  }

  private static getScaledCoords(
    start: Point,
    size: Point,
    scale = UI.CHOSEN_CARD_COVER
  ): { start: Point; size: Point } {
    const newSize: Point = {
      x: UI.floorProduct(size.x)(scale),
      y: UI.floorProduct(size.y)(scale)
    }
    const newStart: Point = {
      x: start.x + UI.floorProduct(size.x - newSize.x)(1 / 2),
      y: start.y + UI.floorProduct(size.y - newSize.y)(1 / 2)
    }
    return { size: newSize, start: newStart }
  }

  private static getShapeBounds(
    start: Point,
    dimensions: Point,
    count: number,
    orientation: Orientation
  ): { coords: Point[]; size: Point } {
    let width = 0
    let height = 0
    let mapFunc: (val: any, index?: number) => any
    // how much to shift the position for various count values
    const shiftFactor = [0, 1, 1 / 2, 0]
    if (orientation === Orientation.LANDSCAPE) {
      width = UI.floorProduct(dimensions.x)(1 / 3)
      height = dimensions.y
      start.x += UI.floorProduct(width)(shiftFactor[count])
      mapFunc = (c: number) => ({ x: start.x + c * width, y: start.y })
    } else {
      width = dimensions.x
      height = UI.floorProduct(dimensions.y)(1 / 3)
      start.y += UI.floorProduct(height)(shiftFactor[count])
      mapFunc = (c: number) => ({ x: start.x, y: start.y + c * height })
    }
    const coords = Array.from(Array(count).keys()).map(mapFunc)
    const size: Point = { x: width, y: height }
    return { coords, size }
  }

  private getFillPattern(color: string): CanvasPattern | null {
    color = color.toLowerCase()
    if (this.shadedFillMap[color]) {
      return this.shadedFillMap[color]
    }
    const can = document.createElement('canvas')
    const size = 2
    can.width = 2 * size
    can.height = 2 * size
    const canCtx = can.getContext('2d')
    if (canCtx) {
      canCtx.fillStyle = color
      canCtx.fillRect(0, 0, size * 2, size / 2)
    }
    const pattern = this.ctx.createPattern(can, 'repeat')
    if (pattern) {
      this.shadedFillMap[color] = pattern
    }
    return pattern
  }
}
