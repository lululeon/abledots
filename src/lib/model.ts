export enum Status {
  Occupied,
  Empty,
}

export const colormap: Record<Status, string> = {
  [Status.Occupied]: '#3498db',
  [Status.Empty]: '#a9a9a9',
}


export class Cell
{
    static width = 10
    static height = 10

    x: number
    y: number
    status: Status

    constructor (x:number, y: number)
    {
        // Store the position of this cell in the grid
        this.x = x
        this.y = y

        // initial seeding of grid (chance of being an occupied cell)
        this.status = Math.random() > 0.75 ? Status.Occupied : Status.Empty
    }

    setStatus(s: Status) {
      this.status = s
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = colormap[this.status]
        context.fillRect(this.x * Cell.width, this.y * Cell.height, Cell.width, Cell.height);
    }

    coords() {
      return [this.x, this.y]
    }

}

export class Grid {
  gridCols: number
  gridRows: number
  cellmatrix : Cell[] = []
  context: CanvasRenderingContext2D

  constructor (context: CanvasRenderingContext2D, gridCols: number, gridRows: number) {
    this.context = context
    this.gridCols = gridCols
    this.gridRows = gridRows
  
    // columnwise LtoR
    for (let x = 0; x < gridCols; x++) {
      for (let y = 0; y < gridRows; y++) {
        this.cellmatrix.push(new Cell(x, y));
      }
    }
  }

  cellAt (x: number, y:number): Cell|undefined {
    // cell at (x,y) is at arr index  (x * gridCols) + y
    if(x < 0 || y < 0) return undefined
    return this.cellmatrix[(x * this.gridCols)+y]
  }

  iterate() {
    for (let i = 0; i < this.cellmatrix.length; i++) {
      const cell = this.cellmatrix[i]
      const [x, y] = cell.coords()
      const neighbours = [
        this.cellAt(x-1, y-1),
        this.cellAt(x, y-1),
        this.cellAt(x+1, y-1),
        this.cellAt(x+1,y),
        this.cellAt(x+1, y+1),
        this.cellAt(x,y+1),
        this.cellAt(x-1,y+1),
        this.cellAt(x-1, y),
      ].filter(Boolean)

      // proxy for alive count for now
      const occupiedCount = neighbours.reduce((runningCount, nextCell) => runningCount + ((nextCell!.status === Status.Occupied) ? 1 : 0), 0)

      // apply rules
      if (cell.status === Status.Occupied) {
        if (occupiedCount >= 2 && occupiedCount < 4) {
          cell.setStatus(Status.Occupied)
        } else {
          cell.setStatus(Status.Empty)
        }
      } else if (occupiedCount === 3){
        cell.setStatus(Status.Occupied)
      }
    }
    this.render()
  }

  render(){
    for (let i = 0; i < this.cellmatrix.length; i++) {
        this.cellmatrix[i].render(this.context)
    }
  }
}
