<script lang="ts">
  export let label: string
  let buttonProps = {}
</script>

<button
  type="button"
  class="text-sm text-blue-500 flex-1 font-bold hover:bg-blue-50 border-solid border-2 border-blue-300 border-spacing-2 rounded-lg px-5 py-2.5 me-2 mb-2"
  on:click
  {...buttonProps}
>
  {label}
</button>
