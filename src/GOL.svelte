<script lang="ts">
  import { Grid } from './lib/Grid'
  import { Rule } from './lib/types'
  import { RulesEngine } from './lib/rules/RulesEngine'

  function gameSetup(node: HTMLElement) {
    const rulesEngine: RulesEngine = new RulesEngine([Rule.DefaultB3S23, Rule.R20_RCELLS])
    rulesEngine.toggleRule(Rule.R20_RCELLS) //switched off at start
    const canvas = document.getElementById('grid')! as HTMLCanvasElement
    const btnStart = document.getElementById('start')!
    const btnStop = document.getElementById('stop')!
    const btnR20 = document.getElementById('r20')!

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    const g = new Grid(ctx, rulesEngine, 10, 120, 60) // 10 x (120 x 80) = 1200 x 800 canvas

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

    const startGame = () => {
      playing = true
      window.requestAnimationFrame(animationCallback!)
    }

    const pauseGame = () => {
      playing = false
      window.clearTimeout(animationTimeoutRef)
    }

    btnStart.addEventListener('click', startGame)
    btnStop.addEventListener('click', pauseGame)
    btnR20.addEventListener('click', () => {
      g.rulesEngine.toggleRule(Rule.R20_RCELLS)
      g.reseed()
    })

    return {
      destroy() {
        console.log('game destroyed')
      },
    }
  }
</script>

<main use:gameSetup>
  <div id="gridWrapper">
    <canvas id="grid" width="1200" height="600" class=""> </canvas>
  </div>
  <div class="controls">
    <button id="start" aria-label="start">start</button>
    <button id="stop" aria-label="stop">stop</button>
    <button id="r20" aria-label="stop">toggle rule-R20</button>
  </div>
</main>

<style>
</style>
