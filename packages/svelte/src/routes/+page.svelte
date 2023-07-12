<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import EditorTheme from '$lib/EditorTheme.svelte';
  import SvelteEditor from '$lib/Editor.svelte';

  import showcaseContent from './sveltor.json';
  import {TestNode} from './test-plugin/test-node-plugin';

  import Devtool from './_components/Devtool.svelte';

  let editor: Editor;

  const onSave = () => {
    const json = editor.getJSON();
    localStorage.setItem('editor', JSON.stringify(json));
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
  const extensions = [TestNode];
</script>

<div class="editor">
  <EditorTheme>
    <div class="container">
      <div class="wrapper">
        <SvelteEditor
          {extensions}
          content={[
            `<p data-align='left' style="text-align: left;">this is test thau</p>`,
            `<svelte-component><p>This is editable.</p></svelte-component>`
          ].join('')}
          placeholder="Press 'space' GPT support, type '/' for help"
          onCreated={createdEditor => {
            editor = createdEditor;
          }}
          onChange={nextEditor => {
            editor = nextEditor;
          }}
          plugins={{
            selectImage: {
              handleUpload,
              unsplash: {
                accessKey: 'omv67BHUb-gbDEbf9UwFsvGbKdQHwnreJPAzgI0Mz5I'
              }
            },
            gpt: {query: submitPromt}
          }}
        />
      </div>
    </div>
    {#if editor}
      <Devtool {editor} />
    {/if}
  </EditorTheme>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: row;
  }
  .wrapper {
    max-width: 860px;
    width: 100%;
    margin: auto;
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
