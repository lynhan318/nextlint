<script lang="ts">
  import {EditorTheme, SvelteEditor} from '@nextlint/svelte';

  const onEditorChange = () => {};

  const onCreated = () => {};
</script>

<div>
  <EditorTheme>
    <SvelteEditor
      onChange={onEditorChange}
      {onCreated}
      placeholder="Start writing..."
      content=""
    />
  </EditorTheme>
</div>
