<script lang="ts">
  import { Grid } from '../lib/Grid'
  import { Rule } from '../lib/types'
  import { RulesEngine } from '../lib/rules/RulesEngine'

  function testSetup(_node: HTMLElement) {
    // mounted
    console.log('mounted')
    const canvas1 = document.getElementById('grid1')! as HTMLCanvasElement
    const canvas2 = document.getElementById('grid2')! as HTMLCanvasElement
    const canvas3 = document.getElementById('grid3')! as HTMLCanvasElement

    const ctx1: CanvasRenderingContext2D = canvas1.getContext('2d')!
    const ctx2: CanvasRenderingContext2D = canvas2.getContext('2d')!
    const ctx3: CanvasRenderingContext2D = canvas3.getContext('2d')!

    const rulesEngine: RulesEngine = new RulesEngine([Rule.DefaultB3S23])

    // const g1 = new Grid(ctx1, 100, 3, 3)
    const g1 = new Grid(ctx1, rulesEngine, 100, 3, 2)

    g1.toggleDebug()
    g1.render()

    const g2 = Grid.fromGrid(ctx2, g1)
    g2.toggleDebug()
    g2.iterate()

    const g3 = Grid.fromGrid(ctx3, g2)
    g3.toggleDebug()
    g3.iterate()

    return {
      destroy() {
        console.log('game destroyed')
      },
    }
  }
</script>

<main use:testSetup>
  <div id="gridWrapper">
    <canvas id="grid1" width="300" height="300" class=""> </canvas>
    <canvas id="grid2" width="300" height="300" class=""> </canvas>
    <canvas id="grid3" width="300" height="300" class=""> </canvas>
  </div>
</main>

<style>
  #gridWrapper {
    display: flex;
    flex-direction: row;
    width: max-content;
    gap: 0px 0px;
  }

  canvas {
    display: block;
    margin: 0;
    padding: 0;
    border: 1px solid red;
  }
</style>
