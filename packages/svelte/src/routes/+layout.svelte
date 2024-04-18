<script lang="ts">
  import './app.scss';
  import {writable} from 'svelte/store';
  import {setContext} from 'svelte';
  import type {Editor} from '@tiptap/core';

  import EditorTheme from '$lib/EditorTheme.svelte';

  const editor = writable<Editor>();
  let theme: 'dark' | 'light' = 'light';
  const changeTheme = () => {
    theme = theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark', theme === 'dark');
  };
  setContext('editor', editor);
</script>

<div class="relative flex min-h-screen flex-col px-6">
  <header
    class="h-[60px] sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div
      class="max-w-6xl mx-auto flex flex-row text-foreground items-center h-full"
    >
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          class="sr-only peer"
          on:change={() => changeTheme()}
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-500"
        ></div>
        <span
          class="ms-3 text-md font-bold text-gray-900 dark:text-gray-300 capitalize"
          >{theme}</span
        >
      </label>
    </div>
  </header>
  <main class="max-w-6xl mx-auto w-full">
    <EditorTheme {theme}>
      <slot />
    </EditorTheme>
  </main>
</div>
