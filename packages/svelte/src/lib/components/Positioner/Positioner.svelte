<script lang="ts" context="module">
  let provider: PositionProvider;
</script>

<script lang="ts">
  import {useEditor} from '$lib/context';
  import tippy, {type Props, type SingleTarget} from 'tippy.js';
  import {computePosition, type VirtualElement} from '@floating-ui/dom';
  import {onDestroy, setContext} from 'svelte';

  import {PositionProvider, positionStore, type Position} from './provider';

  setContext('positioner', positionStore);

  const editor = useEditor();
  export let position: Position = 'cursor';
  export let tippyProps: Partial<Props> = {};
  export let target: SingleTarget = document.body;

  provider ||= PositionProvider.create($editor!);

  let disposable = () => {};
  const floatingUI = (element: HTMLDivElement) => {
    const instance = tippy(target, {
      ...tippyProps,
      getReferenceClientRect: null,
      content: element,
      interactive: true,
      animation: 'fade',
      maxWidth: '100%',
      trigger: 'manual'
    });
    disposable = provider.register(position, instance);
  };

  onDestroy(() => {
    disposable();
    provider.destroy();
  });
</script>

<div use:floatingUI style="position: relative;">
  <slot />
</div>
