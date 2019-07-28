import { Point, Util } from '@util/index'
import { Draw } from './draw'
import { Card, DRAW, Measure, Orientation } from './types'
import { SetGameUtil } from './util'

const FRAME_DELAY = Math.round(1000 / 40)

const CARD_SCALE: { [key: string]: number } = {
  MIN: 0.7,
  MAX: 0.85,
  STEP: 0.04
}

const CARD_OPACITY: { [key: string]: number } = {
  MIN: 0,
  MAX: 1,
  STEP: 0.05
}

const CARD_OFFSET: { [key: string]: number } = {
  MIN: -20,
  MAX: 20,
  STEP: 4
}

const STRING_NUMS = ['ZERO', 'ONE', 'TWO', 'THREE']

const COLOR_MAP: { [color: string]: string } = {
  RED: '#FF0080',
  GREEN: '#4AD76A',
  BLUE: '#6F72CD',
  WHITE: '#FFFFFF'
}

const getColorCode = (colorName: string): string => COLOR_MAP[colorName]

const floorProduct = (dm: number) => (n: number) => Math.floor(n * dm)

export class UI {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private orientation: Orientation
  private shadedFillMap: { [color: string]: CanvasPattern } = {}

  private readonly FILL_MAP: { [fill: string]: Function } = {
    EMPTY: (card: Card) => 'white',
    SHADED: (card: Card) => this.getFillPattern(getColorCode(card.color)),
    SOLID: (card: Card) => getColorCode(card.color)
  }

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
    this.orientation = width > height ? Orientation.LANDSCAPE : Orientation.PORTRAIT
  }

  private getFill = (card: Card) => this.FILL_MAP[card.fill](card)

  drawDeck = (deck: Card[], chosen: number[]): void => {
    this.ctx.clearRect(0, 0, this.width, this.height)
    deck.forEach((card, index) => {
      const scale = chosen.includes(index) ? CARD_SCALE.MIN : CARD_SCALE.MAX
      this.drawScaledCard(card, deck.length, index, scale)
    })
  }

  drawEntryAnimation = (card: Card, deckSize: number, index: number, callback: Function): void => {
    this.animateCardOpacity({
      card,
      deckSize,
      index,
      start: CARD_OPACITY.MIN,
      end: CARD_OPACITY.MAX,
      callback
    })
  }

  drawExitAnimation = (card: Card, deckSize: number, index: number, callback: Function): void => {
    this.animateCardOpacity({
      card,
      deckSize,
      index,
      start: CARD_OPACITY.MAX,
      end: CARD_OPACITY.MIN,
      callback
    })
  }

  drawCardSelectedAnimation = (card: Card, deckSize: number, index: number, callback: Function): void => {
    const { MAX: start, MIN: end } = CARD_SCALE
    this.animateCardScale({
      card,
      deckSize,
      index,
      start,
      end,
      callback
    })
  }

  drawCardUnselectedAnimation = (card: Card, deckSize: number, index: number, callback: Function): void => {
    const { MIN: start, MAX: end } = CARD_SCALE
    this.animateCardScale({
      card,
      deckSize,
      index,
      start,
      end,
      callback
    })
  }

  drawCardsErrorAnimation = (cards: Card[], deckSize: number, indices: number[], callback: Function): void => {
    indices.forEach((index) => {
      this.animateCardOffset({
        card: cards[index],
        deckSize,
        index,
        start: CARD_OFFSET.MIN,
        end: CARD_OFFSET.MAX,
        callback
      })
    })
  }

  private animateCardScale = async (config: {
    card: Card
    deckSize: number
    index: number
    start: number
    end: number
    callback: Function
  }) => {
    const { card, deckSize, index, start, end, callback } = config

    const { offset, dimensions } = this.getCoordinatesForCardAtIndex(deckSize, index)

    const step = end > start ? CARD_SCALE.STEP : -CARD_SCALE.STEP

    let next = start
    let cond = true

    const steplist = []

    while (cond) {
      steplist.push(next)
      next += step
      cond = end > start ? next < end : next > end
    }
    steplist.push(end)

    await Util.asyncForEach(steplist, async (step: number) => {
      await Util.createDelay(FRAME_DELAY)

      this.ctx.clearRect(offset.x, offset.y, dimensions.x, dimensions.y)

      this.drawScaledCard(card, deckSize, index, step)
    })

    callback()
  }

  private animateCardOpacity = async (config: {
    card: Card
    deckSize: number
    index: number
    start: number
    end: number
    callback: Function
  }) => {
    const { ctx } = this

    const { card, deckSize, index, start, end, callback } = config

    const { offset, dimensions } = this.getCoordinatesForCardAtIndex(deckSize, index)

    const step = end > start ? CARD_OPACITY.STEP : -CARD_OPACITY.STEP

    let next = start
    let cond = true

    const steplist = []

    while (cond) {
      steplist.push(next)
      next += step
      cond = end > start ? next < end : next > end
    }
    steplist.push(end)

    await Util.asyncForEach(steplist, async (step: number) => {
      await Util.createDelay(FRAME_DELAY)

      ctx.save()
      ctx.globalAlpha = step
      ctx.clearRect(offset.x, offset.y, dimensions.x, dimensions.y)

      this.drawScaledCard(card, deckSize, index)

      ctx.restore()
    })

    callback()
  }

  private animateCardOffset = async (config: {
    card: Card
    deckSize: number
    index: number
    start: number
    end: number
    callback: Function
  }) => {
    const { ctx } = this

    const { card, deckSize, index, start, end, callback } = config

    const { offset, dimensions } = this.getCoordinatesForCardAtIndex(deckSize, index)

    const step = end > start ? CARD_OFFSET.STEP : -CARD_OFFSET.STEP

    let next = start
    let cond = true

    const steplist = []

    while (cond) {
      steplist.push(next)
      next += step
      cond = end > start ? next < end : next > end
    }
    steplist.push(end)

    const reversedSteplist = [...steplist].reverse()
    const stepsAndBack = [...steplist, ...reversedSteplist]
    const animatedSteps = [...stepsAndBack, ...stepsAndBack, ...stepsAndBack]

    await Util.asyncForEach(animatedSteps, async (step: number) => {
      await Util.createDelay(FRAME_DELAY)

      const shakeOffset: Point = { x: step, y: 0 }
      const cardOffset = SetGameUtil.modifyPoints(offset, shakeOffset, (a, b) => a + b)

      const { offset: drawOffset, dimensions: drawDimensions } = UI.getScaledCoords(cardOffset, dimensions)

      ctx.clearRect(offset.x, offset.y, dimensions.x, dimensions.y)
      this.drawCard(card, drawOffset, drawDimensions)
    })

    callback()
  }

  /**
   * Calls `drawCard` after applying scale
   */
  private drawScaledCard = (card: Card, deckSize: number, index: number, scale = CARD_SCALE.MAX): void => {
    const { offset: position, dimensions: cardBounds } = this.getCoordinatesForCardAtIndex(deckSize, index)

    const { dimensions, offset } = UI.getScaledCoords(position, cardBounds, scale)

    this.drawCard(card, offset, dimensions)
  }

  private drawCard = (card: Card, position: Point, dimensions: Point): void => {
    const { ctx } = this

    ctx.save()

    ctx.fillStyle = getColorCode('WHITE')

    Draw.roundedRect(ctx, position, dimensions)

    ctx.stroke()
    ctx.fill()
    ctx.fillStyle = this.getFill(card)
    ctx.strokeStyle = getColorCode(card.color)
    ctx.lineWidth = 2

    this.drawShapes(card, position, dimensions)

    ctx.restore()
  }

  /**
   * Draws the shapes in the card
   */
  private drawShapes = (card: Card, position: Point, dimensions: Point): void => {
    const { ctx } = this

    const cardOrientation = dimensions.x > dimensions.y ? Orientation.LANDSCAPE : Orientation.PORTRAIT

    const count = STRING_NUMS.indexOf(card.count)

    const { dimensions: newDimensions, offset: newPosition } = UI.getScaledCoords(position, dimensions, CARD_SCALE.MAX)

    const { coords, size } = UI.getShapeBounds(newPosition, newDimensions, count, cardOrientation)

    coords.forEach((start: Point) => {
      const drawFunc = Draw.getFunc(card.shape)

      const { dimensions: newSize, offset: newStart } = UI.getScaledCoords(start, size)

      drawFunc(ctx, newStart, newSize, cardOrientation)

      ctx.fill()
      ctx.stroke()
    })
  }

  /**
   * Returns the offset and dimensions of the card container
   */
  private getCoordinatesForCardAtIndex = (deckSize: number, index: number): Measure => {
    const grid = this.getGridSize(deckSize)
    const cardBounds = this.getCardBoxDimensions(deckSize)

    return {
      offset: {
        x: cardBounds.x * Math.floor(index / grid.y),
        y: cardBounds.y * (index % grid.y)
      },
      dimensions: cardBounds
    }
  }

  /**
   * Returns the dimensions of the box that contains the card
   */
  getCardBoxDimensions = (deckSize: number): Point => {
    const grid = this.getGridSize(deckSize)

    return {
      x: floorProduct(this.width)(1 / grid.x),
      y: floorProduct(this.height)(1 / grid.y)
    }
  }

  /**
   * Determines the grid dimensions for the provided @param deckSize
   */
  getGridSize = (deckSize: number): Point => {
    const groupSize = DRAW.STEP

    const itemsPerRow = this.orientation === Orientation.LANDSCAPE ? deckSize / groupSize : groupSize
    const itemsPerCol = this.orientation === Orientation.LANDSCAPE ? groupSize : deckSize / groupSize

    return {
      x: itemsPerRow,
      y: itemsPerCol
    }
  }

  /**
   * Returns the updated @param offset and @param dimensions after applying the provided @param scale
   */
  private static getScaledCoords = (offset: Point, dimensions: Point, scale = CARD_SCALE.MIN): Measure => {
    return {
      dimensions: SetGameUtil.modifyPoint(dimensions, (p: number) => p * scale),
      offset: SetGameUtil.modifyPoints(offset, dimensions, (p, q) => p + floorProduct(q * (1 - scale))(1 / 2))
    }
  }

  /**
   * Returns the size and coordinates for each shape in the card
   */
  private static getShapeBounds = (
    start: Point,
    dimensions: Point,
    count: number,
    orientation: Orientation
  ): { coords: Point[]; size: Point } => {
    let width = 0
    let height = 0

    let mapFunc: (val: any) => any

    // how much to shift the position of shape for various count values
    const shiftFactor = [0, 1, 1 / 2, 0]

    if (orientation === Orientation.LANDSCAPE) {
      width = floorProduct(dimensions.x)(1 / 3)
      height = dimensions.y

      const startX = start.x + floorProduct(width)(shiftFactor[count])

      mapFunc = (c: number) => ({ x: startX + c * width, y: start.y })
    } else {
      width = dimensions.x
      height = floorProduct(dimensions.y)(1 / 3)

      const startY = start.y + floorProduct(height)(shiftFactor[count])

      mapFunc = (c: number) => ({ x: start.x, y: startY + c * height })
    }

    const coords = Array.from(Array(count).keys()).map(mapFunc)

    const size: Point = { x: width, y: height }

    return { coords, size }
  }

  /**
   * Generates the pattern to fill the card if SHADED
   */
  private getFillPattern = (color: string): CanvasPattern | null => {
    if (this.shadedFillMap[color]) {
      return this.shadedFillMap[color]
    }

    const size = 2

    const can = document.createElement('canvas')
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
