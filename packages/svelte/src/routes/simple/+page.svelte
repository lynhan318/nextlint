<script lang="ts">
  import {SimpleEditor, EditorTheme} from '$lib';
  let editor: Editor;
</script>

<div class="wrapper">
  <EditorTheme>
    <SimpleEditor
      content=""
      placeholder="Share your thoughts..."
      onCreated={createdEditor => {}}
    />
  </EditorTheme>
</div>

<style lang="scss">
  .wrapper {
    max-width: 768px;
    margin: auto;
    margin-top: 120px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 32px;
    border-radius: 8px;
  }
</style>
