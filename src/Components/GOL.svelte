<script lang="ts">
  export let setupFunc: (node: HTMLElement) => void
  export let width: number
  export let height: number
</script>

<main use:setupFunc>
  <div id="gridWrapper">
    <canvas id="grid" {width} {height} class=""> </canvas>
  </div>
</main>

<style>
</style>
