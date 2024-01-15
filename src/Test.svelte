<script lang="ts">
  import { Grid } from './lib/model'

  function testSetup(node: HTMLElement) {
		// mounted
    console.log('mounted')
    const canvas = document.getElementById('grid')! as HTMLCanvasElement
    const btnStep = document.getElementById('step')!

    const ctx : CanvasRenderingContext2D = canvas.getContext('2d')!
    const g = new Grid(ctx, 3, 3)

    g.render()
    g.iterate()

		return {
			destroy() {
				console.log('game destroyed')
			}
		};
	}

</script>

<main use:testSetup>
  <div id="gridWrapper">
    <canvas id="grid" width="500" height="500" class="">
    </canvas>
  </div>
  <div class="controls">
    <button id="step" aria-label="step">step</button>
  </div>
</main>

<style>
</style>
