import { BrickGame, Point } from '@util'

export enum Direction {
  LEFT = -1,
  RIGHT = 1,
  UP = 2,
  DOWN = -2
}

export class Snake {
  private static readonly INIT_LENGTH = 5
  private rows: number
  private cols: number
  private direction: Direction
  private endCallback: Function
  points: Point[] = []

  constructor(
    start: Point,
    rows: number,
    cols: number,
    endCallback: Function,
    dir: Direction = Direction.RIGHT,
    length: number = Snake.INIT_LENGTH
  ) {
    this.rows = rows
    this.cols = cols
    this.direction = dir
    this.endCallback = endCallback
    this.points = []
    const dx = dir === Direction.RIGHT ? -1 : dir === Direction.LEFT ? 1 : 0
    const dy = dir === Direction.UP ? 1 : dir === Direction.DOWN ? -1 : 0

    for (let i = 0; i < length; i++) {
      this.points.push({ x: start.x + dx * i, y: start.y + dy * i })
    }
  }

  move(direction?: Direction, grow?: boolean): void {
    if (!this.points.length) return
    if (direction) {
      if (direction === -this.direction) {
        return
      }
      this.direction = direction
    } else {
      this.moveOrGrow(false)
    }
  }

  grow(): void {
    this.moveOrGrow(true)
  }

  private moveOrGrow(grow: boolean): void {
    const dir = this.direction
    const dx = dir === Direction.RIGHT ? 1 : dir === Direction.LEFT ? -1 : 0
    const dy = dir === Direction.UP ? -1 : dir === Direction.DOWN ? 1 : 0
    const head = this.points[0]

    if (!grow) {
      this.points.pop()
    }

    const point: Point = {
      x: (this.cols + head.x + dx) % this.cols,
      y: (this.rows + head.y + dy) % this.rows
    }
    this.points.unshift(point)
    if (this.checkSelfCollision()) {
      this.die()
    }
  }

  die(): void {
    this.points = []
    console.log('die')
    this.endCallback()
  }

  checkSelfCollision(): boolean {
    const d: any = {}
    for (const p of this.points) {
      const dpx = d[p.x] || {}
      if (dpx[p.y]) {
        return true
      }
      dpx[p.y] = true
      d[p.x] = dpx
    }
    return false
  }

  draw(bg: BrickGame): void {
    this.points.forEach((p) => bg.draw(p))
  }
}
