import { BrickAnimation } from './brick-animations'
import { Point } from '../types'
import { BrickCharMap } from './brick-char-map'

export class BrickGame {
  private static readonly FG_COLOR = '#444444'
  private static readonly BG_COLOR = '#acc4ac'
  private static readonly SIZE = 10
  private static readonly ARC_A = (Math.PI * 3) / 4
  private static readonly ARC_B = (Math.PI * 7) / 4
  private context: CanvasRenderingContext2D
  private size: number
  private static instance: BrickGame

  private constructor(ctx: CanvasRenderingContext2D, size?: number) {
    BrickGame.instance = this
    this.context = ctx
    this.size = size || BrickGame.SIZE
    this.draw = this.draw.bind(this)
    this.drawEmpty = this.drawEmpty.bind(this)
    this.drawPattern = this.drawPattern.bind(this)
    this.clearScreen = this.clearScreen.bind(this)
  }

  static getInstance(ctx: CanvasRenderingContext2D, size?: number) {
    if (!this.instance) {
      this.instance = new BrickGame(ctx, size)
    }
    return this.instance
  }

  draw(point: Point): void {
    const ctx = this.context
    const size = this.size
    const radius = Math.round(size / 3)
    const xCoords = point.x * size
    const yCoords = point.y * size
    ctx.fillStyle = BrickGame.FG_COLOR
    ctx.strokeStyle = BrickGame.BG_COLOR
    ctx.moveTo(xCoords, yCoords)
    ctx.lineTo(xCoords + size, yCoords)
    ctx.lineTo(xCoords, yCoords + size)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(xCoords + size / 2, yCoords + size / 2, radius, BrickGame.ARC_A, BrickGame.ARC_B, false)
    ctx.fillStyle = BrickGame.BG_COLOR
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(xCoords + size / 2, yCoords + size / 2, radius, BrickGame.ARC_B, BrickGame.ARC_A, false)
    ctx.fillStyle = BrickGame.FG_COLOR
    ctx.fill()
    ctx.closePath()
    ctx.lineWidth = 1
    ctx.strokeStyle = BrickGame.FG_COLOR
    ctx.strokeRect(xCoords, yCoords, size, size)
  }

  drawEmpty(point: Point): void {
    const ctx = this.context
    const size = this.size
    ctx.fillStyle = BrickGame.BG_COLOR
    ctx.fillRect(point.x * size, point.y * size, size, size)
  }

  drawPattern(grid: Point[][], reverse?: boolean, rows?: number, cols?: number): void {
    if (reverse) {
      if (rows && cols) {
        for (let x = 0; x < rows; x++) {
          for (let y = 0; y < cols; y++) {
            this.draw({ x, y })
          }
        }
      }
      grid.forEach((row) => row.forEach((box) => this.drawEmpty(box)))
    } else {
      if (rows && cols) {
        this.clearScreen(rows, cols)
      }
      grid.forEach((row) => row.forEach((box) => this.draw(box)))
    }
  }

  drawString(str: string, startX = 0, startY = 0, spacing = 2): void {
    this.drawPattern(this.getPatternForString(str, startX, startY, spacing))
  }

  getPatternForString(str: string, startX = 0, startY = 0, spacing = 2): Point[][] {
    let offsetX = startX
    const pattern = str
      .toString()
      .toLowerCase()
      .split('')
      .map((char: string) => {
        const charPattern = BrickCharMap[char]
        if (charPattern.length) {
          const patternWidth = charPattern.reduce((prev: Point, curr: Point) => (prev.x > curr.x ? prev : curr)).x
          const patternWithOffset: Point[] = charPattern.map((p: Point) => ({ x: p.x + offsetX, y: p.y + startY }))
          offsetX = offsetX + patternWidth + spacing
          return patternWithOffset
        } else {
          return []
        }
      })
    return pattern
  }

  drawAnimation(anim: BrickAnimation, callback: Function, reverse?: boolean, rows?: number, cols?: number): void {
    const delays = Object.keys(anim)
      .map((k) => parseInt(k))
      .sort((a: number, b: number) => a - b)
    delays.forEach((delay: number, ix: number, delays: number[]) =>
      setTimeout(() => {
        this.drawPattern(anim[delay], reverse, rows, cols)
        if (ix === delays.length - 1) {
          callback()
        }
      }, delay)
    )
  }

  clearScreen(rows: number, cols: number, offset: Point = { x: 0, y: 0 }): void {
    const { x: startX, y: startY } = offset
    const ctx = this.context
    ctx.fillStyle = BrickGame.BG_COLOR
    ctx.fillRect(this.size * startX, this.size * startY, this.size * cols, this.size * rows)
    ctx.strokeStyle = BrickGame.FG_COLOR
    ctx.strokeRect(this.size * startX, this.size * startY, this.size * cols, this.size * rows)
  }
}
