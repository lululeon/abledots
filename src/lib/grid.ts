import { Status, type GameMode, GameRule } from './types'
import { Cell } from './cell'

export class Grid {
  aperture: number
  gridCols: number
  gridRows: number
  cellmatrix: Cell[] = []
  context: CanvasRenderingContext2D
  mode: GameMode

  constructor(
    context: CanvasRenderingContext2D,
    aperture: number,
    gridCols: number,
    gridRows: number,
    cells?: Cell[]
  ) {
    this.context = context
    this.aperture = aperture
    this.gridCols = gridCols
    this.gridRows = gridRows

    this.mode = {
      debug: false,
      ruleset: {
        [GameRule.R20_RCELLS]: false,
      },
    }

    // columnwise LtoR
    if (!cells) {
      for (let x = 0; x < gridCols; x++) {
        for (let y = 0; y < gridRows; y++) {
          this.cellmatrix.push(new Cell(x, y))
        }
      }
    } else {
      this.cellmatrix = cells
    }
  }

  static fromGrid(context: CanvasRenderingContext2D, grid: Grid) {
    return new this(
      context,
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
    this.mode.debug = !this.mode.debug
  }

  toggleRule(rule: GameRule) {
    this.mode.ruleset[rule] = !this.mode.ruleset[rule]
  }

  iterate() {
    const { debug } = this.mode

    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      const [x, y] = cell.coords()
      const neighbours = [
        this.cellAt(x - 1, y - 1),
        this.cellAt(x, y - 1),
        this.cellAt(x + 1, y - 1),
        this.cellAt(x + 1, y),
        this.cellAt(x + 1, y + 1),
        this.cellAt(x, y + 1),
        this.cellAt(x - 1, y + 1),
        this.cellAt(x - 1, y),
      ].filter(Boolean)

      if (debug) {
        console.log(`Neighborhood of (${x},${y}) b4 updates:`)
        neighbours.forEach((_) => console.log(_?.label()))
      }

      const { n, r } = neighbours.reduce(
        (accumulator: any, nextCell) => {
          if (nextCell!.status === Status.Alive) accumulator.n += 1
          if (nextCell!.status === Status.Resource) accumulator.r += 1
          return accumulator
        },
        { n: 0, r: 0 }
      )

      cell.setMeta(n, r)
    }

    if (debug) {
      this.render()
    } else {
      this.render()
    }
  }

  updateCellStatus(cell: Cell) {
    const { ruleset } = this.mode

    // skip cells that do not update
    if (cell.status === Status.Resource) return

    // determine new status
    const { neighbors, health } = cell.meta

    // ignore metadata until it receives valid updates
    if (!isNaN(neighbors)) {
      if (cell.status === Status.Alive && (neighbors < 2 || neighbors >= 4)) {
        // only cells with health points at 0 are subject to grim reaper
        if (ruleset.R20_RCELLS) {
          if (!isNaN(health)) {
            cell.meta.health -= 1
            if (cell.meta.health <= 0) cell.status = Status.Dead
          }
        } else {
          cell.status = Status.Dead
        }
      } else if (neighbors === 3) {
        cell.status = Status.Alive
      }
    }
  }

  render() {
    const { debug } = this.mode
    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      this.updateCellStatus(cell)
      cell.render(this.context, this.aperture, debug)
    }
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
      cell.reseed()
    }
    this.iterate()
  }
}
