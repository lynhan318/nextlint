<script lang="ts">
  import {useNodeViewProps} from '$lib/node-view';
  import {ChevronDown} from 'lucide-svelte';
  import {createDropdownMenu, melt} from '@melt-ui/svelte';
  import {derived} from 'svelte/store';

  import {NextlintCodeBlock} from './codeBlock';

  const props = useNodeViewProps();

  const LANGUAGES = NextlintCodeBlock.options.langs;

  const node = derived(props, $ => $.node);
  const attrs = derived(node, $ => $.attrs);

  const {
    elements: {menu, item, trigger}
  } = createDropdownMenu({
    positioning: {
      placement: 'bottom-start'
    }
  });
</script>

<div class="absolute right-1 top-1 z-10" contenteditable="false">
  <button
    class="px-4 py-1 border rounded-md flex flex-row items-center capitalize"
    use:melt={$trigger}
    >{$attrs.lang}

    <ChevronDown size={16} />
  </button>
  <div
    class="z-10 flex flex-col p-2 bg-background
    shadow-md max-w-[200px] max-h-[360px] overflow-y-auto
    w-full border border-border rounded-md"
    use:melt={$menu}
  >
    {#each LANGUAGES as lang}
      <a
        class="hover:bg-accent px-4 py-1 rounded-md transition-colors cursor-pointer capitalize"
        on:click={() =>
          $props.updateAttributes({
            lang
          })}
        use:melt={$item}>{lang}</a
      >
    {/each}
  </div>
</div>
