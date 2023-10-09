<script lang="ts">
  import {createToggle, melt} from '@melt-ui/svelte';
  import {Italic} from 'lucide-svelte';

  const {
    elements: {root}
  } = createToggle();
</script>

<button
  use:melt={$root}
  aria-label="Toggle italic"
  class="grid h-9 w-9 place-items-center items-center justify-center rounded-md
  bg-background text-base leading-4 text-slate-800 hover:bg-slate-100
    data-[disabled]:cursor-not-allowed data-[state=on]:bg-slate-200
    data-[state=on]:text-slate-900"
>
  <Italic class="square-4" />
</button>
