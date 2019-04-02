import { Point } from '../types'

export interface BrickAnimation {
  [interval: number]: Point[][]
}

export class BrickAnimationGallery {
  static wipeScreen(rows: number, cols: number, delay: number): BrickAnimation {
    const resp: BrickAnimation = {}
    for (let i = 0; i <= rows; i++) {
      const pattern: Point[][] = []
      for (let j = 0; j <= i; j++) {
        pattern.push(
          Array(cols)
            .fill(null)
            .map((_: any, x: number) => ({ x, y: rows - j }))
        )
      }
      resp[delay * i] = pattern
    }
    return resp
  }
}
