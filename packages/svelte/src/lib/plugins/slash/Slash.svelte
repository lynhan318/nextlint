<svelte:options accessors={true} />

<script lang="ts">
  import type {SuggestionProps} from '@tiptap/suggestion';

  import Item from './Item.svelte';
  import type {SlashMenuItem} from './slash-menu';

  export let props: SuggestionProps<SlashMenuItem>;
  const SCROLL_HEIGHT = 400;
  const ELEMENT_HEIGHT = 60;

  const editor = props.editor;
  $: query = props.query;

  let selectedIndex = 0;

  $: menus = props.items;

  export const onKeyDown = ({event}: {event: KeyboardEvent}) => {
    if (event.key === 'ArrowUp') {
      upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      enterHandler();
      return true;
    }

    return false;
  };
  const upHandler = () => {
    selectedIndex = (selectedIndex + menus.length - 1) % menus.length;
  };

  const downHandler = () => {
    selectedIndex = (selectedIndex + 1) % menus.length;
  };

  const enterHandler = () => {
    onSelect(selectedIndex);
  };

  const onActiveChange = (element: CustomEvent<HTMLElement>, idx: number) => {
    //max slash menu scroll is 400
    const parent = element.detail.offsetParent!;
    const elementHeight = (idx + 1) * ELEMENT_HEIGHT;
    if (
      elementHeight < parent.scrollTop ||
      elementHeight > parent.scrollTop + SCROLL_HEIGHT
    ) {
      requestAnimationFrame(() => {
        parent.scrollTo({
          top: Math.max(elementHeight - ELEMENT_HEIGHT, 0),
          behavior: 'smooth'
        });
      });
    }
  };

  const onSelect = (idx: number) => {
    const item = menus[idx];
    if (item) {
      props.command(item);
    }
  };
</script>

<div
  class="w-[336px] border border-border h-full flex flex-row
  shadow-lg bg-background text-foreground relative overflow-y-auto
  overflow-x-hidden rounded-lg px-4 py-4"
>
  {#if menus.length === 0}
    <p style="width:100%;text-align: center">No results</p>
  {:else}
    <div class="w-full" style="max-height:{SCROLL_HEIGHT}px">
      {#each menus as item, idx}
        <Item
          on:active={event => onActiveChange(event, idx)}
          text={item.title}
          icon={item.icon}
          description={item.description}
          active={selectedIndex === idx}
          onClick={() => onSelect(idx)}
        />
      {/each}
    </div>
  {/if}
</div>
