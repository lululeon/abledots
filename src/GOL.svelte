<script lang="ts">
  import { Grid } from './lib/grid'

  function gameSetup(node: HTMLElement) {
		// mounted
    console.log('mounted')
    const canvas = document.getElementById('grid')! as HTMLCanvasElement
    const btnStart = document.getElementById('start')!
    const btnStop = document.getElementById('stop')!
    const btnClear = document.getElementById('clear')!

    const ctx : CanvasRenderingContext2D = canvas.getContext('2d')!
    const g = new Grid(ctx, 10, 120, 60) // 10 x (120 x 80) = 1200 x 800 canvas

    let playing = false
    let animationTimeoutRef: number|undefined

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

    return {
      destroy() {
        console.log('game destroyed')
      }
    }
	}
</script>

<main use:gameSetup>
  <div id="gridWrapper">
    <canvas id="grid" width="1200" height="600" class="">
    </canvas>
  </div>
  <div class="controls">
    <button id="start" aria-label="start">start</button>
    <button id="stop" aria-label="stop">stop</button>
  </div>
</main>

<style>

</style>
