<script lang="ts">
  import {Popover} from '$lib/components';

  import {useEditor} from '$lib/context';
  import {Check} from 'lucide-svelte';
  import {writable} from 'svelte/store';

  const editor = useEditor();

  let input: HTMLInputElement;

  let open = writable(false);

  const onSubmit = () => {
    if (
      input.value &&
      $editor!
        .chain()
        .focus()
        .setLink({
          href: input.value
        })
        .run()
    ) {
      setTimeout(() => {
        input.value = '';
      }, 100);
      $open = false;
    }
  };
</script>

<Popover {open}>
  <div slot="trigger">
    <slot
      toggle={() => {
        setTimeout(() => {
          input.focus();
        }, 100);
      }}
    />
  </div>
  <form
    on:submit|preventDefault={onSubmit}
    class="flex items-center bg-background rounded-md px-4 shadow-md relative top-2 border border-border leading-10"
  >
    <input
      placeholder="https://..."
      bind:this={input}
      class="outline-none bg-background text-foreground"
    />
    <button
      type="submit"
      class="hover:bg-secondary transition-colors p-1 rounded-md"
    >
      <Check size={20} />
    </button>
  </form>
</Popover>
