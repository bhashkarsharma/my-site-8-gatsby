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
    return n ? '#000000'.substring(0, 7 - c.length) + c : 'var(--color-link)'
  }

  static getColorForString(str: string): string {
    return this.intToRGB(this.hash(str || ''))
  }

  static getLabelColor(color: string): string {
    if (color.length < 5) {
      color += color.slice(1)
    }
    return color.replace('#', '0x') > (0xffffff / 2).toString() ? 'var(--color-black)' : 'var(--color-white)'
  }
}
