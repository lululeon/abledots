import { Grid } from './Grid'
import { Rule, type GOLApi } from './types'
import { RulesEngine } from './RulesEngine'

const STANDARD_APERTURE = 10

export const gameBuilder = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  apertureOverride?: number
) => {
  if (!canvas) throw new Error('GameBuilder: invalid canvas object!')
  const rulesEngine: RulesEngine = new RulesEngine([Rule.DefaultB3S23, Rule.R20_RCELLS])
  rulesEngine.toggleRule(Rule.R20_RCELLS) //switched off at start

  const aperture = apertureOverride ?? STANDARD_APERTURE
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
  const grid = new Grid(ctx, rulesEngine, aperture, width, height)

  let playing = false
  let animationTimeoutRef: number | undefined

  const animationCallback = () => {
    if (!playing) return
    grid.iterate()
    animationTimeoutRef = window.setTimeout(() => {
      window.requestAnimationFrame(animationCallback)
    }, 200)
  }

  const startFn = () => {
    playing = true
    window.requestAnimationFrame(animationCallback!)
  }

  const pauseFn = () => {
    playing = false
    window.clearTimeout(animationTimeoutRef)
  }

  const isPlayingFn = () => playing

  const togglePlayState = (setLabel: (label: string) => void) => {
    setLabel('Start')
    return () => {
      if (!playing) {
        startFn()
        setLabel('Pause')
      } else {
        pauseFn()
        setLabel('Resume')
      }
    }
  }

  const resetFn = () => {
    pauseFn()
    grid.reseed()
  }

  const resizeFn = (width: number, height: number) => {
    grid.resize(width, height)
  }

  const toggleR20 = () => {
    grid.rulesEngine.toggleRule(Rule.R20_RCELLS)
    grid.reseed()
  }

  const gameController: GOLApi = {
    startFn,
    pauseFn,
    isPlayingFn,
    togglePlayState,
    resetFn,
    resizeFn,
    toggleR20,
  }

  return {
    grid,
    gameController,
  }
}
