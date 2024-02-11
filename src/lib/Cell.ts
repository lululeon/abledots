import { Status, type CellMeta } from './types'

export const colormap: Record<Status, string> = {
  [Status.Dead]: '#eeeeee',
  [Status.Alive]: '#3366cc',
  [Status.Resource]: '#52a63f',
}

export class Cell {
  private x: number
  private y: number

  // will be initialized via reseed() call in constructor, but typescript can't tell.
  private status!: Status
  private meta!: CellMeta

  constructor(x: number, y: number) {
    // Store the position of this cell in the grid
    this.x = x
    this.y = y
    this.wipe()
  }

  static fromCell(c: Cell) {
    const [x, y] = c.coords()
    const newCell = new this(x, y)
    newCell.setStatus(c.getStatus())
    return newCell
  }

  private wipe() {
    this.meta = {
      neighborCount: NaN,
      resourceCount: NaN,
    }
    this.status = Status.Dead
  }

  setNeigborCount(n: number) {
    this.meta.neighborCount = n
  }

  setResourceCount(r: number) {
    this.meta.resourceCount = r
  }

  getMeta() {
    return this.meta
  }

  /** aperture is cell height and width in pixels */
  render(context: CanvasRenderingContext2D, aperture: number, withLabels?: boolean) {
    context.fillStyle = colormap[this.status]
    const _x = this.x * aperture
    const _y = this.y * aperture
    context.fillRect(_x, _y, aperture, aperture)

    // min aperture size for this is 30px, for visual debugging
    if (withLabels) {
      context.font = '10px sans-serif'
      context.fillStyle = `rgb(0, 0, 0)`
      context.fillText(this.label(), _x + 5, _y + 10)
    }
  }

  coords() {
    return [this.x, this.y]
  }

  setStatus(s: Status) {
    this.status = s
  }

  getStatus() {
    return this.status
  }

  label() {
    return `(${this.x},${this.y})[${this.status === Status.Resource ? 'R' : this.status}] n:${this.meta.neighborCount}`
  }
}
