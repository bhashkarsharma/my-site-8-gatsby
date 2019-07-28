import { Point } from '@util/index'
import { Card, DRAW, GameEvent } from './types'

export class SetGameUtil {
  private static readonly FILL = ['EMPTY', 'SHADED', 'SOLID']
  private static readonly COUNT = ['ONE', 'TWO', 'THREE']
  private static readonly COLOR = ['RED', 'GREEN', 'BLUE']
  private static readonly SHAPE = ['PILL', 'DIAMOND', 'SQUIGGLE']
  private static readonly PROPS = ['fill', 'count', 'color', 'shape']

  static initGame = (drawCount: number): Card[] => {
    let deck = SetGameUtil.shuffle(SetGameUtil.generateDeck())
    do {
      deck = SetGameUtil.shuffle(deck)
    } while (SetGameUtil.countValidSets(deck.slice(0, drawCount)) === 0)
    return deck
  }

  static isValidSet = (a: Card, b: Card, c: Card): boolean => {
    const valid: boolean[] = SetGameUtil.PROPS.map((key: string) => {
      const props: string[] = [a, b, c].map((i: Card) => Reflect.get(i, key))
      const size: number = new Set(props).size
      // all PROPS same or all different
      return [1, 3].includes(size)
    })
    return valid.filter((i: boolean) => i).length === 4
  }

  static countValidSets = (deck: Card[]): number => {
    return SetGameUtil.getValidSets(deck).length
  }

  static getValidSets = (deck: Card[]): number[][] => {
    const valid = []
    const l = deck.length

    for (let i = 0; i < l - 2; i++) {
      for (let j = i + 1; j < l - 1; j++) {
        for (let k = j + 1; k < l; k++) {
          const { [i]: a, [j]: b, [k]: c } = deck
          if (SetGameUtil.isValidSet(a, b, c)) {
            valid.push([i, j, k])
          }
        }
      }
    }

    return valid
  }

  static selectCardAtIndex = (
    deck: Card[],
    chosen: number[],
    index: number
  ): { deck: Card[]; chosen: number[]; drawCount: number; callbackType: GameEvent } => {
    let newDeck: Card[] = [...deck]
    let newChosen: number[] = [...chosen]

    let callbackType: GameEvent = GameEvent.CARD_SELECTED

    if (chosen.includes(index)) {
      newChosen.splice(chosen.indexOf(index), 1)

      callbackType = GameEvent.CARD_UNSELECTED
    } else {
      newChosen.push(index)

      if (newChosen.length === DRAW.STEP) {
        const [a, b, c] = newChosen.map((index) => newDeck[index])

        if (SetGameUtil.isValidSet(a, b, c)) {
          newChosen.forEach((index) => {
            const lastCard = newDeck.pop()

            if (lastCard) {
              newDeck[index] = lastCard
            }
          })

          callbackType = GameEvent.VALID_SET
        } else {
          callbackType = GameEvent.INVALID_SET
        }
      } else if (newChosen.length > DRAW.STEP) {
        callbackType = GameEvent.INVALID_SET

        newChosen = []
      } else {
        callbackType = GameEvent.CARD_SELECTED
      }
    }

    const newDrawCount = SetGameUtil.updateDrawCount(newDeck)
    return { deck: newDeck, chosen: newChosen, drawCount: newDrawCount, callbackType }
  }

  private static updateDrawCount = (deck: Card[]): number => {
    let drawCount = DRAW.MIN
    while (SetGameUtil.countValidSets(deck.slice(0, drawCount)) === 0) {
      drawCount += DRAW.STEP
    }
    if (drawCount > deck.length) {
      drawCount = deck.length
    }
    if (drawCount > DRAW.MAX) {
      drawCount = DRAW.MAX
    }
    return drawCount
  }

  static generateDeck = (): Card[] => {
    const deck: Card[] = []
    for (let shape of SetGameUtil.SHAPE) {
      for (let fill of SetGameUtil.FILL) {
        for (let color of SetGameUtil.COLOR) {
          for (let count of SetGameUtil.COUNT) {
            deck.push({ fill, shape, color, count })
          }
        }
      }
    }
    return deck
  }

  static shuffle = (deck: Card[], shuffleUntil?: number): Card[] => {
    const cards = [...deck]
    let c = shuffleUntil || cards.length
    while (c > 0) {
      const idx = Math.floor(Math.random() * c)
      c--
      ;[cards[idx], cards[c]] = [cards[c], cards[idx]]
    }
    return cards
  }

  static modifyPoint = (p: Point, f: (n: number) => number): Point => {
    return {
      x: f(p.x),
      y: f(p.y)
    }
  }

  static modifyPoints = (a: Point, b: Point, f: (m: number, n: number) => number): Point => {
    return {
      x: f(a.x, b.x),
      y: f(a.y, b.y)
    }
  }
}
