<script lang="ts">
  import EditorTheme from '$lib/EditorTheme.svelte';
  import {createEditor} from '@nextlint/core';
  const editor = (element: HTMLDivElement) => {
    const editor = createEditor({
      element,
      content: `
<p>Hello</p>
<pre><code>
let a= 123;
</code></pre>
`,
      placeholder: 'Start typing...'
    });
  };
</script>

<div id="code-preview" class="w-full h-[400px]"></div>
<EditorTheme theme="light">
  <div use:editor id="editor" class="tiptap border p-4 rounded mt-4" />
</EditorTheme>
