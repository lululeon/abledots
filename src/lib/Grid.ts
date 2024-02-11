import { Cell } from './Cell'
import { RulesEngine } from './RulesEngine'
import { truthify } from './utils'

export class Grid {
  context: CanvasRenderingContext2D
  rulesEngine: RulesEngine
  aperture: number
  gridCols: number
  gridRows: number
  cellmatrix: Cell[] = []
  debug: boolean

  constructor(
    context: CanvasRenderingContext2D,
    rulesEngine: RulesEngine,
    aperture: number,
    width: number,
    height: number,
    cells?: Cell[]
  ) {
    this.context = context
    this.aperture = aperture
    this.gridCols = width / aperture
    this.gridRows = height / aperture
    this.rulesEngine = rulesEngine
    this.debug = false

    // columnwise LtoR
    if (!cells) {
      this.tessellate()
    } else {
      this.cellmatrix = cells
    }

    this.forceRedraw()
  }

  static fromGrid(
    context: CanvasRenderingContext2D,
    grid: Grid,
    overrideRulesEngine?: RulesEngine
  ) {
    return new this(
      context,
      overrideRulesEngine ?? grid.rulesEngine,
      grid.aperture,
      grid.gridCols * grid.aperture,
      grid.gridRows * grid.aperture,
      grid.cellmatrix.map((_) => Cell.fromCell(_))
    )
  }

  private cellAt(x: number, y: number): Cell | undefined {
    // cell at (x,y) is at arr index  (x * gridRows) + y
    if (x < 0 || y < 0 || x >= this.gridCols || y >= this.gridRows) return undefined
    return this.cellmatrix[x * this.gridRows + y]
  }

  private tessellate() {
    this.cellmatrix.length = 0
    for (let x = 0; x < this.gridCols; x++) {
      for (let y = 0; y < this.gridRows; y++) {
        const cell = new Cell(x, y)
        this.rulesEngine.cellCreateSignal(cell)
        this.cellmatrix.push(cell)
      }
    }
  }

  toggleDebug() {
    this.debug = !this.debug
  }

  private updateCellStatus(cell: Cell) {
    this.rulesEngine.cellRespondEnvSignal(cell)
  }

  private render() {
    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      this.updateCellStatus(cell)
      cell.render(this.context, this.aperture, this.debug)
    }
  }

  iterate() {
    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      const [x, y] = cell.coords()
      const neighbors = [
        this.cellAt(x - 1, y - 1),
        this.cellAt(x, y - 1),
        this.cellAt(x + 1, y - 1),
        this.cellAt(x + 1, y),
        this.cellAt(x + 1, y + 1),
        this.cellAt(x, y + 1),
        this.cellAt(x - 1, y + 1),
        this.cellAt(x - 1, y),
      ].filter(truthify)

      if (this.debug) {
        console.log(`Neighborhood of (${x},${y}) b4 updates:`)
        neighbors.forEach((_) => console.log(_?.label()))
      }

      this.rulesEngine.cellAssessEnvSignal(cell, neighbors)
    }

    this.render()
  }

  forceRedraw() {
    // force "immediate" redraw outside of raf callbacks.
    setTimeout(() => {
      this.render()
    }, 20)
  }

  reseed() {
    this.tessellate()
    this.forceRedraw()
  }

  resize(width: number, height: number) {
    // clear the old drawing area
    this.context.clearRect(0, 0, this.gridCols * this.aperture, this.gridRows * this.aperture)

    // new drawing area
    this.gridCols = width / this.aperture
    this.gridRows = height / this.aperture

    this.reseed()
  }

  getSize() {
    return [this.gridCols * this.aperture, this.gridRows * this.aperture]
  }

  list() {
    this.cellmatrix.map((_) => console.log(_.label()))
  }
}
