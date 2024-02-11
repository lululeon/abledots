import type { Cell } from './Cell'
import { Rule } from './types'
import { DefaultB3S23 } from './rules/DefaultB3S23'
import { R20_RCELLS } from './rules/R20_RCELLS'
import type { RuleExpression } from './RuleExpression'

export class RulesEngine {
  private pipeline: RuleExpression[]
  private activePipeline!: RuleExpression[]

  constructor(rules: Rule[]) {
    this.pipeline = rules.map((r) => {
      return RulesEngine.makeRuleExpresson(r)
    })
    this.updateActivePipeline()
  }

  // doubles as a factory
  static makeRuleExpresson(rule: Rule): RuleExpression {
    switch (rule) {
      case Rule.R20_RCELLS:
        return new R20_RCELLS()
      default:
        return new DefaultB3S23()
    }
  }

  private updateActivePipeline() {
    this.activePipeline = this.pipeline.filter((rExp: RuleExpression) => rExp.enabled === true)
  }

  appendRule(rule: Rule) {
    this.pipeline.push(RulesEngine.makeRuleExpresson(rule))
    this.updateActivePipeline()
  }

  toggleRule(rule: Rule) {
    const ruleExp = this.pipeline.find((_) => _.getId() === rule)
    ruleExp && ruleExp.toggle()
    this.updateActivePipeline()
  }

  cellCreateSignal(cell: Cell) {
    this.activePipeline.forEach((ruleExp) => {
      ruleExp.onCellCreate?.(cell)
    })
  }

  cellAssessEnvSignal(cell: Cell, neighbors: Cell[]) {
    this.activePipeline.forEach((ruleExp) => {
      ruleExp.onCellAssessEnv(cell, neighbors)
    })
  }

  cellRespondEnvSignal(cell: Cell) {
    this.activePipeline.forEach((ruleExp) => {
      ruleExp.onCellRespondEnv(cell)
    })
  }
}
