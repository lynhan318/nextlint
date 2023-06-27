<script lang="ts">
  import {CommentEditor, Editor, EditorTheme} from '@nextlint/editor';

  const onEditorChange = () => {};

  const onCreated = () => {};
</script>

<div>
  <EditorTheme>
    <Editor
      onChange={onEditorChange}
      {onCreated}
      placeholder="Start writing..."
      openAI
      content=""
    />
  </EditorTheme>
</div>
