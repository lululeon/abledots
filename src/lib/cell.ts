import type { CellMeta } from "./types.d.ts"
import { Status } from "./types"

export const colormap: Record<Status, string> = {
  [Status.Dead]: '#eeeeee',
  [Status.Alive]: '#3366cc',
}

export class Cell
{
  x: number
  y: number
  status: Status
  meta: CellMeta

  constructor (x: number, y: number)
  {
    // Store the position of this cell in the grid
    this.x = x
    this.y = y

    this.meta = {
      neighborCount: NaN
    }

    // initial seeding of grid
    this.status = Math.random() > 0.5 ? Status.Alive : Status.Dead
  }

  
  setNeighborCount (n: number) {
    this.meta.neighborCount = n
  }

  updateStatus() {
    // determine new status
    const { neighborCount } = this.meta

    // ignore metadata until it receives valid updates
    if (!isNaN(neighborCount)) {
      if ((this.status === Status.Alive) && (neighborCount < 2 || neighborCount >= 4)) {
        this.status = Status.Dead
      } else if (neighborCount === 3){
        this.status = Status.Alive
      }
    }
  }

  /** aperture is cell height and width in pixels */
  render(context: CanvasRenderingContext2D, aperture: number, withLabels?:boolean) {
    context.fillStyle = colormap[this.status]
    const _x = this.x * aperture
    const _y = this.y * aperture
    context.fillRect(_x, _y, aperture, aperture)
    
    // min aperture size for this is 30px, for visual debugging
    if (withLabels) {
      context.font = "10px sans-serif"
      context.fillStyle = `rgb(0, 0, 0)`
      context.fillText(this.label(), _x + 5, _y + 10)
    }
  }

  coords() {
    return [this.x, this.y]
  }

  label() {
    return `(${this.x},${this.y}) st:${this.status} nb:${this.meta.neighborCount}`
  }

  wipe() {
    this.meta.neighborCount = NaN
    this.status = Status.Dead
  }

  reseeed() {
    this.wipe()
    this.status = Math.random() > 0.5 ? Status.Alive : Status.Dead
  }
}
