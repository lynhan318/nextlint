<script lang="ts">
  import {Check, ChevronDown, ChevronUp} from 'lucide-svelte';
  import {createCombobox, melt} from '@melt-ui/svelte';
  import {fly} from 'svelte/transition';

  import type {NextlintCodeBlockOptions} from './codeBlock';
  import {cn} from '$lib/helpers';
  import {useNodeViewContext} from '$lib/node-view';
  import {onDestroy} from 'svelte';

  const options = useNodeViewContext('options') as NextlintCodeBlockOptions;
  const setAttrs = useNodeViewContext('updateAttributes');
  const node = useNodeViewContext('node');

  const LANGUAGES = options.langs;

  const {
    elements: {menu, input, option},
    states: {open, inputValue, touchedInput, selected},
    helpers: {isSelected}
  } = createCombobox({
    forceVisible: true,
    multiple: false
  });

  const dispose = node.subscribe(({attrs}) => {
    inputValue.set(attrs.lang);
  });

  $: filteredLanguages = $touchedInput
    ? LANGUAGES.filter(lang => {
        const normalizedInput = $inputValue.toLowerCase();
        return lang.includes(normalizedInput);
      })
    : LANGUAGES;

  onDestroy(dispose);
</script>

<div class="absolute right-1 top-1 z-10" contenteditable="false">
  <div class="relative">
    <input
      use:melt={$input}
      class={cn(
        `flex h-8 items-center justify-between rounded-sm px-4 pr-6 outline-none text-sm
          text-foreground capitalize bg-[unset] border border-transparent focus:border-border`,
        {
          'border-border': $inputValue
        }
      )}
      placeholder="Programing Language"
    />
    <div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-border">
      {#if $open}
        <ChevronUp size={20} />
      {:else}
        <ChevronDown size={20} />
      {/if}
    </div>
  </div>
</div>
{#if $open}
  <ul
    class=" z-10 flex max-h-[300px] flex-col overflow-hiddenshadow-md shadown-md p-1"
    use:melt={$menu}
    transition:fly={{duration: 150, y: -5}}
  >
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="flex max-h-full flex-col gap-1 overflow-y-auto clean-scroll bg-background border border-accent px-2 py-2 text-foreground rounded-lg p-1"
      tabindex="0"
    >
      {#each filteredLanguages as lang, index (index)}
        <li
          use:melt={$option({
            value: lang,
            label: lang
          })}
          on:mousedown|preventDefault={() => setAttrs({lang})}
          class="flex flex-row items-center justify-between cursor-pointer
          rounded-md py-1 pl-4 pr-4 data-[highlighted]:bg-accent
          data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
        >
          <span class="font-medium capitalize">{lang}</span>
          {#if $isSelected(lang)}
            <Check size={16} />
          {/if}
        </li>
      {:else}
        <li
          class="relative cursor-pointer rounded-md py-[2px] pl-8 pr-4
        data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
        >
          No results found
        </li>
      {/each}
    </div>
  </ul>
{/if}
