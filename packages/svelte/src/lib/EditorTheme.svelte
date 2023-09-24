<script lang="ts">
  import './EditorTheme.scss';
  import './CodeTheme.scss';

  export let theme: 'dark' | 'light' = 'light';
</script>

<div class={theme}>
  <slot />
</div>

<style lang="postcss">
  :global(.tiptap) {
    @apply outline-none;
  }
  :global(.tiptap :not(pre)) {
    @apply text-primary;
  }

  :global(.tiptap h1) {
    @apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
  }
  :global(.tiptap h2) {
    @apply mt-10  scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0;
  }

  :global(.tiptap h3) {
    @apply mt-8  scroll-m-20 text-2xl font-semibold tracking-tight;
  }

  :global(.tiptap h4) {
    @apply scroll-m-20 text-xl font-semibold tracking-tight;
  }

  :global(.tiptap p) {
    @apply leading-7 [&:not(:first-child)]:mt-6;
  }

  :global(.tiptap blockquote) {
    @apply mt-6 border-l-2 pl-6 italic;
  }

  :global(.tiptap ul) {
    @apply my-6 ml-6 list-disc [&>li]:mt-2;
  }
  :global(.tiptap ol) {
    @apply my-6 ml-6 list-decimal [&>li]:mt-2;
  }
  :global(.tiptap :not(pre) > code) {
    @apply relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold;
  }
  :global(.tiptap pre) > * {
    @apply relative rounded bg-secondary px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold;
  }
</style>
