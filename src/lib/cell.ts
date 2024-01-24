import type { CellMeta, GameMode } from './types.d.ts'
import { Status } from './types'

export const colormap: Record<Status, string> = {
  [Status.Dead]: '#eeeeee',
  [Status.Alive]: '#3366cc',
  [Status.Resource]: '#52a63f',
}

export class Cell {
  x: number
  y: number

  // will be initialized via reseed() call in constructor, but typescript can't tell.
  status!: Status
  meta!: CellMeta

  constructor(x: number, y: number) {
    // Store the position of this cell in the grid
    this.x = x
    this.y = y

    // initial seeding of grid
    this.reseed()
  }

  reseed() {
    this.wipe()
    const probability = Math.random()
    this.status =
      probability > 0.5 ? Status.Alive : probability > 0.4 ? Status.Resource : Status.Dead
  }

  /**
   *
   * @param n number of immediate neighbors that are alive
   * @param r number of immediate neighbors that are resource cells
   */
  setMeta(n: number, r: number) {
    const { health } = this.meta
    this.meta.neighbors = n
    this.meta.resources = r

    // only set to initial value at birth (1:! correspondence with # of neighboring resource cells for now)
    if (isNaN(health)) this.meta.health = r
  }

  /** aperture is cell height and width in pixels */
  render(context: CanvasRenderingContext2D, aperture: number, withLabels?: boolean) {
    context.fillStyle = colormap[this.status]
    const _x = this.x * aperture
    const _y = this.y * aperture
    context.fillRect(_x, _y, aperture, aperture)

    // min aperture size for this is 30px, for visual debugging
    if (withLabels) {
      context.font = '8px sans-serif'
      context.fillStyle = `rgb(0, 0, 0)`
      context.fillText(this.label(), _x + 5, _y + 10)
    }
  }

  coords() {
    return [this.x, this.y]
  }

  label() {
    return `(${this.x},${this.y})[${this.status === Status.Resource ? 'R' : this.status}] n:${this.meta.neighbors} h:${this.meta.health}`
  }

  wipe() {
    this.meta = {
      neighbors: NaN,
      resources: NaN,
      health: NaN,
    }
    this.status = Status.Dead
  }
}
