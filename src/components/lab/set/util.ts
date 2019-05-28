import { Card } from './card'

export class CardUtil {
  private static readonly FILL = ['EMPTY', 'SHADED', 'SOLID']
  private static readonly COUNT = ['ONE', 'TWO', 'THREE']
  private static readonly COLOR = ['RED', 'GREEN', 'BLUE']
  private static readonly SHAPE = ['PILL', 'DIAMOND', 'SQUIGGLE']
  private static readonly PROPS = ['fill', 'count', 'color', 'shape']

  static isValidSet(a: Card, b: Card, c: Card): boolean {
    const valid = CardUtil.PROPS.map((key: string) => {
      const props: string[] = [a, b, c].map((i: Card) => Reflect.get(i, key))
      const size: number = new Set(props).size
      // all same or all different
      return [1, 3].includes(size)
    })
    return valid.filter((i: boolean) => i).length === 4
  }

  static generateDeck(): Card[] {
    const deck: Card[] = []
    for (let shape of CardUtil.SHAPE) {
      for (let fill of CardUtil.FILL) {
        for (let color of CardUtil.COLOR) {
          for (let count of CardUtil.COUNT) {
            deck.push({ fill, shape, color, count })
          }
        }
      }
    }
    return deck
  }

  static shuffle(deck: Card[], shuffleUntil?: number): Card[] {
    const cards = [...deck]
    let c = shuffleUntil || cards.length
    while (c > 0) {
      const idx = Math.floor(Math.random() * c)
      c--
      ;[cards[idx], cards[c]] = [cards[c], cards[idx]]
    }
    return cards
  }
}
