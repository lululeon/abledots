<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { Grid } from '../lib/Grid'
  import { Rule } from '../lib/types'
  import { RulesEngine } from '../lib/rules/RulesEngine'

  // export let setupFunc: (node: HTMLElement) => void
  export let aperture: number
  export let width: number
  export let height: number

  let canvas: HTMLCanvasElement

  // rudimentary state control
  let isReady = false
  let startFn: () => void
  let pauseFn: () => void
  let resetFn: () => void
  let toggleR20: () => void

  const setupFunc = (_node: HTMLElement) => {
    console.log('>>>>>>>>>>> SETUP !!!')
    const rulesEngine: RulesEngine = new RulesEngine([Rule.DefaultB3S23, Rule.R20_RCELLS])
    rulesEngine.toggleRule(Rule.R20_RCELLS) //switched off at start
    canvas = document.getElementById('grid')! as HTMLCanvasElement

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false })!
    const g = new Grid(ctx, rulesEngine, aperture, width / aperture, height / aperture)

    let playing = false
    let animationTimeoutRef: number | undefined

    g.render()

    const animationCallback = () => {
      if (!playing) return
      g.iterate()
      animationTimeoutRef = window.setTimeout(() => {
        window.requestAnimationFrame(animationCallback)
      }, 200)
    }

    startFn = () => {
      playing = true
      window.requestAnimationFrame(animationCallback!)
    }

    pauseFn = () => {
      playing = false
      window.clearTimeout(animationTimeoutRef)
    }

    resetFn = () => {
      g.reseed()
    }

    toggleR20 = () => {
      g.rulesEngine.toggleRule(Rule.R20_RCELLS)
      g.reseed()
    }

    isReady = true

    return {
      destroy() {
        console.log('game destroyed')
      },
    }
  }

  onMount(async () => {
    canvas.width = width
    canvas.height = height

    // wait till all changes applied to dom
    await tick()
  })
</script>

<main use:setupFunc>
  <div id="gridWrapper">
    <canvas id="grid" {width} {height} class=""> </canvas>
  </div>
</main>

<style>
</style>
