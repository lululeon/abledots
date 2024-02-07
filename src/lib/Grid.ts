import { Cell } from './Cell'
import { RulesEngine } from './rules/RulesEngine'
import { truthify } from './utils'

export class Grid {
  context: CanvasRenderingContext2D
  rulesEngine: RulesEngine
  aperture: number
  gridCols: number
  gridRows: number
  cellmatrix: Cell[] = []
  debug: boolean = false

  constructor(
    context: CanvasRenderingContext2D,
    rulesEngine: RulesEngine,
    aperture: number,
    gridCols: number,
    gridRows: number,
    cells?: Cell[]
  ) {
    this.context = context
    this.aperture = aperture
    this.gridCols = gridCols
    this.gridRows = gridRows
    this.rulesEngine = rulesEngine

    // columnwise LtoR
    if (!cells) {
      for (let x = 0; x < gridCols; x++) {
        for (let y = 0; y < gridRows; y++) {
          const cell = new Cell(x, y)
          this.rulesEngine.cellCreateSignal(cell)
          this.cellmatrix.push(cell)
        }
      }
    } else {
      this.cellmatrix = cells
    }
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
      grid.gridCols,
      grid.gridRows,
      ([] as Cell[]).concat(grid.cellmatrix)
    )
  }

  cellAt(x: number, y: number): Cell | undefined {
    // cell at (x,y) is at arr index  (x * gridRows) + y
    if (x < 0 || y < 0 || x >= this.gridCols || y >= this.gridRows) return undefined
    return this.cellmatrix[x * this.gridRows + y]
  }

  toggleDebug() {
    this.debug = !this.debug
  }

  updateCellStatus(cell: Cell) {
    this.rulesEngine.cellRespondEnvSignal(cell)
  }

  render() {
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

  clear() {
    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      cell.wipe()
      cell.render(this.context, this.aperture)
    }
  }

  reseed() {
    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      cell.wipe()
      this.rulesEngine.cellCreateSignal(cell)
    }
    this.iterate()
  }
}
