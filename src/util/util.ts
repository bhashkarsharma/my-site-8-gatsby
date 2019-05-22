import { Point, UserEvent } from './types'

export class Util {
  /**
   * Generate hash for the string
   * @param str input string
   */
  static hash(str: string): number {
    let hash = 0
    for (let i of Array(str.length).keys()) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
  }

  /**
   * Convert an integer to hex color
   * @param n number to be converted
   */
  static intToRGB(n: number): string {
    const c = (n & 0x00ffffff).toString(16).toUpperCase()
    return n ? '#000000'.substring(0, 7 - c.length) + c : 'var(--color-link)'
  }

  /**
   * Generates a hex color code for given string
   * @param str string to compute color
   */
  static getColorForString(str: string): string {
    return this.intToRGB(this.hash(str || ''))
  }

  /**
   * Decides the best text color for
   * the given background color based on contrast
   * @param bgColor background color
   */
  static getLabelColor(bgColor: string): string {
    if (bgColor.length < 5) {
      bgColor += bgColor.slice(1)
    }
    return bgColor.replace('#', '0x') > (0xffffff / 2).toString() ? 'var(--color-black)' : 'var(--color-white)'
  }

  /**
   * Returns an integer in the given range
   * @param min lower range. If max is not provided, will be 0.
   * @param max (optional) upper range. If not provided, min will be used.
   */
  static getRand(min: number, max?: number): number {
    if (max === undefined) {
      max = min
      min = 0
    }
    return min + Math.floor(Math.random() * (max - min))
  }

  /**
   * Returns the swipe distance
   * @param start starting point
   * @param end ending point
   */
  static getSwipe(start: Point, end: Point): Point {
    return {
      x: end.x - start.x,
      y: end.y - start.y
    }
  }

  /**
   * Normalizes mouse and touch events and returns
   * the coordinates (relative to the client), and the event type
   * @param event raised by React
   */
  static normalizeMouseTouchEvents(event: React.MouseEvent & React.TouchEvent): { point: Point; event: UserEvent } {
    let eventType = UserEvent.START
    let touch: any = event
    switch (event.type) {
      case 'touchstart':
        touch = event.touches[0]
      case 'mousedown':
        eventType = UserEvent.START
        break
      case 'touchend':
        touch = event.changedTouches[0]
      case 'mouseup':
        eventType = UserEvent.END
        break
    }
    return { point: { x: touch.clientX, y: touch.clientY }, event: eventType }
  }
}
