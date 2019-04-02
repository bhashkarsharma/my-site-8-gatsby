import { BrickGame, Point } from '@util'

export class Food {
  static readonly SCORE = 10
  points: Point[] = []

  constructor(pos: Point) {
    this.points = [pos]
  }

  draw(bg: BrickGame) {
    this.points.forEach((p) => bg.draw(p))
  }
}
