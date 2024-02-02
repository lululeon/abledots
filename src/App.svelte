<script lang="ts">
  import { Grid } from './lib/Grid'
  import { Rule } from './lib/types'
  import { RulesEngine } from './lib/rules/RulesEngine'
  import GOL from './Components/GOL.svelte'

  let isReady = false
  let startFn: () => void
  let stopFn: () => void
  let toggleR20: () => void
  let aperture = 10

  // must be multiples of aperture
  let width = 800
  let height = 600

  function gameSetup(node: HTMLElement) {
    const rulesEngine: RulesEngine = new RulesEngine([Rule.DefaultB3S23, Rule.R20_RCELLS])
    rulesEngine.toggleRule(Rule.R20_RCELLS) //switched off at start
    const canvas = document.getElementById('grid')! as HTMLCanvasElement

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
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

    stopFn = () => {
      playing = false
      window.clearTimeout(animationTimeoutRef)
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
</script>

<div id="wrapper">
  <div class="golgrid">
    <GOL setupFunc={gameSetup} {width} {height} />
  </div>
  <aside class="sidebar">
    <h2>Control Panel</h2>
    {#if isReady}
      <button on:click={startFn}> Start </button>
      <button on:click={stopFn}> Stop </button>
      <button on:click={toggleR20}> toggle Rule R20 </button>
    {:else}
      <p>Setting up...</p>
    {/if}
  </aside>
</div>

<style>
  #wrapper {
    display: flex;
  }
</style>
