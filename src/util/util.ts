export class Util {
  static hash(str: string): number {
    let hash = 0
    for (let i of Array(str.length).keys()) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
  }

  static intToRGB(n: number): string {
    const c = (n & 0x00ffffff).toString(16).toUpperCase()
    return '000000'.substring(0, 6 - c.length) + c
  }

  static getColorForString(str: string): string {
    return this.intToRGB(this.hash(str || ''))
  }
}
