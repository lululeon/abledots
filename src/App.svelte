<script lang="ts">
  import { onMount } from 'svelte'
  import { debounced } from './lib/utils'
  import GOL from './Components/GOL.svelte'

  const aperture = 10

  // a scope for the game to bound to
  let gol: GOL

  // must be multiples of aperture. TODO: make configurable / reactive
  let width: number = 0
  let height: number = 0

  const setDims = () => {
    // sidebar is w-50 => 208px of horizontal real estate.
    // Also need to ensure integer dims (multiples of aperture) so that canvas doesn't have to work so hard
    width = Math.floor((window.innerWidth - 208) / aperture) * aperture
    height = Math.floor(window.innerHeight / aperture) * aperture
  }

  const onViewportResize = debounced(() => {
    // width = document.getElementById('displaybox')!.offsetWidth
    // height = document.getElementById('displaybox')!.offsetHeight
    setDims()
    gol.setupFunc && gol.setupFunc()
  })
  document.body.addEventListener('viewportchanged', onViewportResize)

  onMount(() => {
    // initialise dimensions
    width = document.getElementById('displaybox')!.offsetWidth
    height = document.getElementById('displaybox')!.offsetHeight
    window.addEventListener('resize', onViewportResize)

    return () => {
      window.removeEventListener('resize', onViewportResize)
    }
  })

  $: dimsNotif = `dimensions: ${width}px X ${height}px`
  $: displayReady = width * height > 0
</script>

<div id="wrapper" class="w-full m-0 p-0">
  <div class="flex min-h-screen w-full flex-row bg-gray-100 text-gray-800">
    <aside
      class="sidebar w-52 -translate-x-full transform bg-white p-4 transition-transform duration-150 ease-in md:translate-x-0 md:shadow-md"
    >
      {#if displayReady}
        <h2 class="text-xl">Control Panel</h2>
        <p class="font-smalltext">{dimsNotif}</p>
        <div class="inline-flex rounded-md shadow-sm my-3" role="group">
          <button
            on:click={gol.startFn}
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
          >
            Start
          </button>

          <button
            on:click={gol.pauseFn}
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
          >
            Pause
          </button>
        </div>
        <div class="my-3">
          <button
            on:click={gol.toggleR20}
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border rounded border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
          >
            toggle Rule R20
          </button>
        </div>
      {:else}
        Loading...
      {/if}
    </aside>
    <main
      class="main -ml-48 flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0"
    >
      <div
        id="displaybox"
        class="flex h-full items-center justify-center bg-white text-center text-5xl font-bold shadow-md"
      >
        <div class="golgrid">
          <GOL {aperture} bind:width bind:height bind:this={gol} />
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  #wrapper {
    display: flex;
  }
</style>
