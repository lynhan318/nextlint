# Introduce

Headless editor with pre-existing plugins. Use by [@nextlint/svelte](https://www.npmjs.com/package/@nextlint/svelte)

# Setup

Nextlint core with written in pure typescript, Can you nextlint core with any frontend framework you like.

In this example we create a `test-editor` vanilla project using vite:

```
pnpm create vite
cd test-editor
pnpm add @nextlint/core

```

Setup editor:

```html
<div id="editor" />

<script>
  import {createEditor} from '@nextlint/core';
  const editor = createEditor({
    element: document.getElementById('editor'),
    content: '',
    placeholder: 'Start writing...'
  });
</script>
```

# Contributing
