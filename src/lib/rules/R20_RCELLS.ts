import { RuleExpression } from './RuleExpression'
import { Rule } from '../types'
import { Status } from '../types'
import { Cell } from '../Cell'

export class R20_RCELLS extends RuleExpression {
  constructor() {
    super(Rule.R20_RCELLS)
  }

  onCellCreate(cell: Cell) {
    const probability = Math.random()

    // override: turn some cells into resource cells
    if (probability > 0.9) cell.setStatus(Status.Resource)
  }

  onCellAssessEnv(cell: Cell, neighbors: Cell[]) {
    const resources = neighbors.reduce((total: number, nextCell) => {
      if (nextCell!.getStatus() === Status.Resource) total += 1
      return total
    }, 0)
    const { resourceCount } = cell.getMeta()

    // never changes so set once
    if (isNaN(resourceCount)) cell.setResourceCount(resources)
  }

  onCellRespondEnv(cell: Cell) {
    const status = cell.getStatus()

    // skip cells that do not update
    if (status === Status.Resource) return

    // todo: revisit health algo
  }
}
