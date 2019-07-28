import { Point } from '@util/index'

export enum Orientation {
  PORTRAIT,
  LANDSCAPE
}

export enum GameEvent {
  VALID_SET,
  INVALID_SET,
  CARD_SELECTED,
  CARD_UNSELECTED
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
