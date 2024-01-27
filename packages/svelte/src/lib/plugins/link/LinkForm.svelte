<script lang="ts">
  import {createCheckbox, melt} from '@melt-ui/svelte';
  import {Check, Link} from 'lucide-svelte';
  import {onDestroy} from 'svelte';

  export let link = '';
  export let external = true;
  export let onSubmit = () => {};

  const {
    elements: {root, input},
    helpers: {isChecked}
  } = createCheckbox({
    defaultChecked: external
  });
  const dispose = isChecked.subscribe(() => {
    external = $isChecked;
  });
  onDestroy(() => {
    dispose();
  });
</script>

<form
  class="flex gap-2 flex-col min-w-[300px]"
  on:submit|preventDefault={onSubmit}
>
  <label class="flex items-center gap-2 rounded-lg cursor-text">
    <Link class="absolute left-4 text-primary" size={16} />
    <input
      class="outline-none border-none bg-accent p-2 rounded-md text-sm w-full pl-8"
      type="url"
      bind:value={link}
      placeholder="Enter URL"
    />
    <button
      class="w-[100px] text-sm bg-muted text-primary p-2 rounded-md"
      type="submit">Set Link</button
    >
  </label>
  <div class="flex items-center">
    <button
      use:melt={$root}
      class="flex appearance-none items-center rounded-md
            bg-background w-5 h-5 hover:opacity-75 border border-border"
      id="checkbox"
    >
      {#if $isChecked}
        <Check class="w-4 h-4a" />
      {/if}
      <input use:melt={$input} />
    </button>
    <label class="pl-2 text-sm" for="checkbox">Open link in new tab</label>
  </div>
</form>
