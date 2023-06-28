# Introduce

Headless editor with pre-existing plugins. Use by @nextlint/svelte

# Setup
Create editor context
```typescript
import {createEditorContext} from '@nextlint/core';

  const {render, ready} = createEditorContext({
    editable: true,
    content,
    onCreated,
    onChange,
    placeholder,
    starterKit: {},
    extensions: []
  });
```


Bind editor to an element

```svelte
<div use:render/>
```

Any svelte component under the Editor context can get the editor via the `useEditor` hook
```svelte
<script lang="ts">
    import {useEditor} from '@nextlint/core';
    const edtitor = useEditor();
</script>

<Button on:click={()=>editor.commands.toggleBold()}>Toggle Bold</Button>
    
```

# Contributing

