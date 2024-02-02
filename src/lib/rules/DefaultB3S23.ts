import { RuleExpression } from './RuleExpression'
import { Rule } from '../types'
import { Status } from '../types'
import { Cell } from '../Cell'

export class DefaultB3S23 extends RuleExpression {
  constructor() {
    super(Rule.DefaultB3S23)
  }

  onCellCreate(cell: Cell) {
    const probability = Math.random()
    const s = probability > 0.5 ? Status.Alive : Status.Dead
    cell.setStatus(s)
  }

  onCellAssessEnv(c: Cell, neighbors: Cell[]) {
    const n = neighbors.reduce((total: number, nextCell) => {
      if (nextCell!.getStatus() === Status.Alive) total += 1
      return total
    }, 0)
    c.setNeigborCount(n)
  }

  onCellRespondEnv(cell: Cell) {
    const status = cell.getStatus()

    // only concerned with alive/dead
    if (status !== Status.Alive && status !== Status.Dead) return

    // determine new status
    const { neighborCount } = cell.getMeta()

    // ignore metadata until it receives valid updates
    if (!isNaN(neighborCount)) {
      if (status === Status.Alive && (neighborCount < 2 || neighborCount >= 4)) {
        cell.setStatus(Status.Dead)
      } else if (neighborCount === 3) {
        cell.setStatus(Status.Alive)
      }
    }
  }
}
