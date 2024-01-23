export enum Status {
  Dead,
  Alive,
  Resource,
}

export type CellMeta = {
  neighbors: number
  health: number
}
