import { Point } from '@util/index'
import { Orientation } from './types'

export class Draw {
  private static readonly FUNC_MAP: { [shape: string]: Function } = {
    PILL: Draw.drawPill,
    DIAMOND: Draw.drawDiamond,
    SQUIGGLE: Draw.drawSquiggle
  }

  static getFunc(shape: string): Function {
    return Draw.FUNC_MAP[shape]
  }

  static drawRoundedRect(ctx: CanvasRenderingContext2D, start: Point, size: Point, radius = 12): void {
    const { x: startX, y: startY } = start
    const { x: width, y: height } = size

    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
  }

  static drawPill(ctx: CanvasRenderingContext2D, start: Point, size: Point, orientation: Orientation): void {
    const { x: startX, y: startY } = start
    const { x: width, y: height } = size
    const radius = orientation === Orientation.LANDSCAPE ? width / 2 : height / 2

    ctx.beginPath()
    ctx.moveTo(startX + radius, startY)
    ctx.lineTo(startX + width - radius, startY)
    ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius)
    ctx.lineTo(startX + width, startY + height - radius)
    ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height)
    ctx.lineTo(startX + radius, startY + height)
    ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius)
    ctx.lineTo(startX, startY + radius)
    ctx.quadraticCurveTo(startX, startY, startX + radius, startY)
    ctx.closePath()
  }

  static drawDiamond(ctx: CanvasRenderingContext2D, start: Point, size: Point, orientation: Orientation): void {
    const startX = orientation === Orientation.LANDSCAPE ? start.x + size.x / 2 : start.x + size.x / 2
    const startY = start.y

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX - size.x / 2, startY + size.y / 2)
    ctx.lineTo(startX, startY + size.y)
    ctx.lineTo(startX + size.x / 2, startY + size.y / 2)
    ctx.closePath()
  }

  static drawSquiggle(ctx: CanvasRenderingContext2D, start: Point, size: Point, orientation: Orientation): void {
    const startX = start.x + size.x / 2
    const startY = start.y + size.y / 2
    const radius = Math.min(size.x, size.y) / 2

    ctx.beginPath()
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
    ctx.closePath()
  }
}
