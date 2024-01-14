<script lang="ts">
  import EditorTheme from '$lib/EditorTheme.svelte';
  import {createEditor} from '@nextlint/core';
  const editor = (element: HTMLDivElement) => {
    const editor = createEditor({
      element,
      content: [],
      placeholder: 'Start typing...'
    });
  };
</script>

<div id="code-preview" class="w-full h-[400px]"></div>
<EditorTheme>
  <div use:editor id="editor" class="tiptap border p-4 rounded mt-4" />
</EditorTheme>
