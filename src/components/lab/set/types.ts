import { Point } from '@util/index'

export enum Orientation {
  PORTRAIT,
  LANDSCAPE
}

export interface Game {
  validSetCallback(indices: number[]): void
  invalidSetCallback(indices: number[]): void
  cardSelectedCallback(index: number): void
  cardUnselectedCallback(index: number): void
}

export interface Measure {
  offset: Point
  dimensions: Point
}

export interface Card {
  shape: string
  fill: string
  color: string
  count: string
}

export const DRAW = {
  MIN: 12,
  STEP: 3,
  MAX: 21
}
