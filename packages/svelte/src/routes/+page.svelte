<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import EditorTheme from '$lib/EditorTheme.svelte';
  import SvelteEditor from '$lib/Editor.svelte';

  import Devtool from './_components/Devtool.svelte';

  let editor: Editor;

  const onSave = () => {
    const json = editor.getJSON();
    localStorage.setItem('editor', JSON.stringify(json));
  };

  let options = {
    preview: false,
    toc: false
  };
  const submitPromt = async (prompt: string) => {
    const {data} = await fetch('https://api.nextlint.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{sveltor_completion(prompt:"${prompt}"){text}}`
      })
    }).then(res => res.json());
    if (data?.sveltor_completion) {
      return data.sveltor_completion[0].text.trim();
    }
    return '';
  };
  const handleUpload = async (file: File) => {
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
  };
</script>

<div class="editor">
  <EditorTheme>
    <Devtool bind:options />
    <div class="container">
      <div class="wrapper">
        <SvelteEditor
          content={''}
          placeholder="Press 'space' GPT support, type '/' for help"
          onCreated={createdEditor => {
            editor = createdEditor;
            const content = localStorage.getItem('editor');
            createdEditor.commands.setContent(JSON.parse(content || ''));
          }}
          onChange={nextEditor => {
            editor = nextEditor;
          }}
          editorOptions={{
            selectImage: {
              handleUpload,
              unsplash: {
                accessKey: 'asdfasdf'
              }
            },
            gpt: {query: submitPromt}
          }}
        />
        <button on:click={onSave}>save</button>
      </div>
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
    margin: auto;
  }
</style>
