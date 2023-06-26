<script lang="ts">
  import {type NextEditor, Editor} from '$lib';
  import EditorTheme from '$lib/EditorTheme.svelte';
  import Devtool from '../_components/Devtool.svelte';

  let editor: NextEditor;
  const onSave = () => {
    const json = editor.getJSON();
    localStorage.setItem('editor', JSON.stringify(json));
  };
  let options = {
    preview: false
  };
</script>

<div class="editor">
  <EditorTheme>
    <Devtool bind:options />
    <div class="container">
      <div class="wrapper">
        <Editor
          content=""
          placeholder="Press 'space' for GPT support, '/' for more blocks"
          onChange={nextEditor => {
            editor = nextEditor;
          }}
          openAI
        />
        <button on:click={onSave}>save</button>
      </div>

      {#if options.preview}
        <div class="wrapper">
          <Preview {editor} />
        </div>
      {/if}
    </div>
  </EditorTheme>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: row;
  }
  .wrapper {
    max-width: 800px;
    width: 100%;
    margin: auto;
    margin-top: 120px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 32px;
    border-radius: 8px;
  }
  .preview {
    max-width: 50%;
    margin: auto;
    margin-top: 120px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 32px;
    border-radius: 8px;
  }
  .editor {
    max-width: 800px;
    width: 100%;
  }
</style>
