export enum Status {
  Dead,
  Alive,
  Resource,
}

export enum GameRule {
  R20_RCELLS = 'R20_RCELLS',
}

export type CellMeta = {
  neighbors: number
  resources: number
  health: number
}

export type GameMode = {
  debug: boolean
  ruleset: Record<GameRule, boolean>
}
