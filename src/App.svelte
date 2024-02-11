<script lang="ts">
  import { onMount } from 'svelte'
  import { debounced } from './lib/utils'
  import { type GOLApi } from './lib/types'
  import { gameBuilder } from './lib/gameBuilder'
  import Button from './Components/Button.svelte'

  const aperture = 10

  let canvas: HTMLCanvasElement
  let gol: GOLApi

  let width: number = 0
  let height: number = 0
  let displayReady = false

  // TODO: move to a proper store
  let playStateLabel: string = 'Begin'
  let toggleState: () => void
  const setPlayStateLabel = (label: string) => (playStateLabel = label)

  const setDims = () => {
    // sidebar is w-560 => 240px of horizontal real estate. all round padding p-4 => 16px x 2 = 32px
    // Also need to ensure integer dims (multiples of aperture) so that canvas doesn't have to work so hard
    width = Math.floor((window.innerWidth - 240 - 32) / aperture) * aperture
    height = Math.floor((window.innerHeight - 32) / aperture) * aperture
  }

  const onViewportResize = debounced(() => {
    setDims()
    gol.resizeFn(width, height)
  })

  onMount(() => {
    setDims()
    canvas = document.getElementById('grid')! as HTMLCanvasElement
    const game = gameBuilder(canvas, width, height)
    gol = game.gameController
    toggleState = gol.togglePlayState(setPlayStateLabel)

    window.addEventListener('resize', onViewportResize)
    displayReady = true

    return () => {
      window.removeEventListener('resize', onViewportResize)
    }
  })

  $: dimsNotif = `dimensions: ${width}px X ${height}px`
</script>

<div id="wrapper" class="w-full m-0 p-0 flex">
  <div class="flex min-h-screen w-full flex-row bg-gray-100 text-gray-800">
    <aside
      class="sidebar w-60 flex flex-col justify-start -translate-x-full transform bg-white p-4 transition-transform duration-150 ease-in md:translate-x-0 md:shadow-md"
    >
      {#if displayReady}
        <h2 class="text-xl font-caption text-center my-3">Control Panel</h2>
        <p class="text-sm text-center">{dimsNotif}</p>
        <hr class="my-2" />
        <div class="inline-flex flex-col items-stretch my-3" role="group">
          <Button on:click={toggleState} bind:label={playStateLabel}></Button>
          <Button on:click={gol.toggleR20} label="toggle Rule R20"></Button>
          <!-- <Button on:click={gol.resetFn} label="Reset"></Button> -->
        </div>
      {:else}
        Loading...
      {/if}
    </aside>
    <main
      class="main -ml-48 flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0"
    >
      <div id="displaybox" class="flex h-full items-center justify-center bg-white shadow-md">
        <div class="golgrid">
          <canvas id="grid" {width} {height} />
        </div>
      </div>
    </main>
  </div>
</div>
