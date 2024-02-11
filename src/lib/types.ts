import type { Cell } from './Cell'

export enum Status {
  Dead,
  Alive,
  Resource,
}

export enum Rule {
  DefaultB3S23 = 'DefaultB3S23',
  R20_RCELLS = 'R20_RCELLS',
}

export type CellMeta = {
  neighborCount: number
  resourceCount: number
}

type LabelSetter = (label: string) => void
export interface GOLApi {
  startFn: () => void
  pauseFn: () => void
  isPlayingFn: () => boolean
  togglePlayState: (LabelSetter: LabelSetter) => () => void
  resetFn: () => void
  resizeFn: (width: number, height: number) => void
  toggleR20: () => void
}
