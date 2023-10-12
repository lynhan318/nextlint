<script lang="ts">
  import {getContext} from 'svelte';
  import {Popover} from '$lib/components';

  import type {PositionStore} from '$lib/components/Positioner';
  import {useEditor} from '$lib/context';
  import {Check} from 'lucide-svelte';

  const editor = useEditor();
  const positioner = getContext('positioner');

  let input: HTMLInputElement;
  let createLinkModal = false;
  let element: HTMLElement;

  positioner?.subscribe((value: PositionStore) => {
    if (!value.selection) {
      createLinkModal = false;
    }
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (
      $editor!
        .chain()
        .focus()
        .setLink({
          href: input.value
        })
        .run()
    ) {
      createLinkModal = false;

      setTimeout(() => {
        input.value = '';
      }, 100);
    }
  };
</script>

<div bind:this={element}>
  <slot
    toggle={() => {
      createLinkModal = !createLinkModal;
      requestAnimationFrame(() => {
        input.focus();
      });
    }}
  />
</div>
<Popover>
  <div>
    <div on:submit={onSubmit}>
      <div>https://</div>
      <input placeholder="Link..." bind:element={input} />
      <button type="submit" color="teal">
        <Check size={20} />
      </button>
    </div>
  </div>
</Popover>
