import { Rule } from './types'
import { Cell } from './Cell'

export abstract class RuleExpression {
  private id: Rule

  enabled: boolean = true

  constructor(rule: Rule) {
    this.id = rule
  }

  getId() {
    return this.id
  }

  toggle() {
    this.enabled = !this.enabled
  }

  // grid creation callback - optional
  onCellCreate?(cell: Cell): void

  // iteration callbacks
  abstract onCellAssessEnv(cell: Cell, neighbors: Cell[]): void
  abstract onCellRespondEnv(cell: Cell): void
}
