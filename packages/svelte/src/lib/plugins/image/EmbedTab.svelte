<script lang="ts">
  export let onInsert = (url: string, alt: string) => {};
  let value = '';
</script>

<div class="bg-background text-foreground">
  <input
    on:paste={e => {
      //prevent paste fire in editor
      e.stopPropagation();
    }}
    class="w-full px-4 py-2 border-input border rounded-md bg-secondary text-foreground"
    type="text"
    bind:value
    placeholder="Paste link here..."
  />
  <button
    class="w-full bg-secondary mt-4 py-2 rounded-md"
    on:click={() => onInsert(value, 'image alt')}
  >
    Submit
  </button>
</div>
