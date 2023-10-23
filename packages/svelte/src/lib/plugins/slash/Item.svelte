<script lang="ts">
  import {cn} from '$lib/helpers';
  import {type ComponentType, createEventDispatcher} from 'svelte';

  const dispatcher = createEventDispatcher<{
    active: HTMLElement;
  }>();
  export let text = '';
  export let description = '';
  export let icon: ComponentType | null = null;
  export let active = false;
  export let onClick = () => {};
  let element: HTMLElement;
  $: {
    if (active) {
      // wait for next tick make sure layout is ready
      setTimeout(() => {
        dispatcher('active', element);
      });
    }
  }
</script>

<button
  on:click={onClick}
  bind:this={element}
  class={cn(
    `grid grid-cols-[40px,auto] outline-none w-full cursor-pointer 
     border-none bg-none h-[60px] items-center rounded-lg`,
    active && 'bg-secondary'
  )}
>
  <div class="pl-4 w-10 h-10 flex items-center justify-center">
    <svelte:component this={icon} size={24} />
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
