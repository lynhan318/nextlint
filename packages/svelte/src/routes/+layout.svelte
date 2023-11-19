<script lang="ts">
  import './app.scss';
  import {writable} from 'svelte/store';
  import {setContext} from 'svelte';
  import type {Editor} from '@tiptap/core';

  import {EditorTheme} from '$lib';

  import Devtool from './$components/Devtool.svelte';

  const editor = writable<Editor>();
  setContext('editor', editor);
</script>

<div class="relative flex min-h-screen flex-col px-6">
  <header
    class="h-[60px] sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <Devtool />
    <a href="/draft">Draft</a>
  </header>
  <main class="max-w-6xl mx-auto w-full">
    <EditorTheme>
      <slot />
    </EditorTheme>
  </main>
</div>
