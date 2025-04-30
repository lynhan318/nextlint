<script lang="ts">
  import { run } from 'svelte/legacy';

import { cn } from "$lib/helpers";
import { type SvelteComponent, createEventDispatcher } from "svelte";

const dispatcher = createEventDispatcher<{
	active: HTMLElement;
}>();
  interface Props {
    text?: string;
    description?: string;
    icon?: SvelteComponent | null;
    active?: boolean;
    onClick?: any;
  }

  let {
    text = "",
    description = "",
    icon = null,
    active = false,
    onClick = () => {}
  }: Props = $props();
let element: HTMLElement = $state();
run(() => {
	if (active) {
		// wait for next tick make sure layout is ready
		setTimeout(() => {
			dispatcher("active", element);
		});
	}
});

  const SvelteComponent_1 = $derived(icon);
</script>

<button
  onclick={onClick}
  bind:this={element}
  class={cn(
    `grid grid-cols-[40px,auto] outline-none w-full cursor-pointer 
     border-none h-[60px] items-center rounded-lg hover:bg-muted/70`,
    active && 'bg-secondary'
  )}
>
  <div class="pl-4 w-10 h-10 flex items-center justify-center">
    <SvelteComponent_1 size={24} />
  </div>
  <div class="w-full text-left ml-4">
    <p class="text-base font-medium">
      {text}
    </p>
    <p class="text-sm">
      {description}
    </p>
  </div>
</button>
