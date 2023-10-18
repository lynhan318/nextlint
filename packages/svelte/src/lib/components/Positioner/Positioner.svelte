<script lang="ts" context="module">
  let provider: PositionProvider;
</script>

<script lang="ts">
  import {useEditor} from '$lib/context';
  import {
    computePosition,
    autoPlacement,
    offset,
    type VirtualElement
  } from '@floating-ui/dom';
  import {onDestroy, setContext} from 'svelte';

  import {PositionProvider, positionStore, type Position} from './provider';
  import {cn} from '$lib/helpers';

  setContext('positioner', positionStore);

  const editor = useEditor();
  export let position: Position = 'cursor';

  let computing = false;
  let domPosition: {x: number; y: number} | null;

  provider ||= PositionProvider.create($editor!);

  let disposable = () => {};
  const floating = (element: HTMLDivElement) => {
    disposable = provider.register(position, {
      async onVisible(data) {
        if (computing) return;
        computing = true;
        const virtualEle: VirtualElement = {
          getBoundingClientRect() {
            console.log('data.clientRects', data.clientRects);
            return data.clientRects;
          }
        };
        domPosition = await computePosition(virtualEle, element, {
          placement: 'top'
          // middleware: [offset(-50), autoPlacement({autoAlignment: false})]
        });
        Object.assign(element.style, {
          left: `${domPosition.x}px`,
          top: `${domPosition.y}px`
        });
        computing = false;
      },
      onHide() {
        domPosition = null;
        console.log('onHide');
      }
    });
  };

  onDestroy(() => {
    disposable();
    provider.destroy();
  });
</script>

<div
  use:floating
  class={cn(
    'absolute transition-opacity',
    domPosition ? 'visible' : 'invisible'
  )}
>
  <slot />
</div>
