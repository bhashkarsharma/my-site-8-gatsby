export class Card {
  shape: string
  fill: string
  color: string
  count: string

  constructor({ shape, fill, color, count }: Card) {
    this.shape = shape
    this.fill = fill
    this.color = color
    this.count = count
  }
}
