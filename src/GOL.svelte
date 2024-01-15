<script lang="ts">
  import { Grid } from './lib/model'

  function gameSetup(node: HTMLElement) {
		// mounted
    console.log('mounted')
    const canvas = document.getElementById('grid')! as HTMLCanvasElement
    const btnStart = document.getElementById('start')!
    const btnStop = document.getElementById('stop')!

    const ctx : CanvasRenderingContext2D = canvas.getContext('2d')!
    const g = new Grid(ctx, 150, 150)

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

    btnStop.addEventListener('click', () => {
      playing = false
      console.log('started')
      window.clearTimeout(animationTimeoutRef)
    })

    btnStart.addEventListener('click', () => {
      playing = true
      console.log('started')
      window.requestAnimationFrame(animationCallback)
    })

		return {
			destroy() {
				console.log('game destroyed')
			}
		};
	}

</script>

<main use:gameSetup>
  <div id="gridWrapper">
    <canvas id="grid" width="500" height="500" class="">
    </canvas>
  </div>
  <div class="controls">
    <button id="start" aria-label="start">start</button>
    <button id="stop" aria-label="stop">stop</button>
    <button id="clear" aria-label="clear">clear</button>
  </div>
</main>

<style>

</style>
