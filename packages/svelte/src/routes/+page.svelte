<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import SvelteEditor from '$lib/Editor.svelte';

  import showcaseContent from './sveltor.json';

  import Devtool from './_components/Devtool.svelte';
  import {EditorTheme} from '$lib';

  let editor: Editor;
  let theme: 'dark' | 'light' = 'light';

  const changeTheme = () => {
    theme = theme === 'light' ? 'dark' : 'light';
  };

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
</script>

<div class={'w-full p-4 mx-auto'} data-theme={theme}>
  <EditorTheme {theme}>
    <SvelteEditor
      content={showcaseContent}
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
  </EditorTheme>
</div>
{#if editor}
  <Devtool {editor}>
    <button on:click={changeTheme}>change theme</button>
  </Devtool>
{/if}

<style lang="scss">
  .container {
    display: flex;
    flex-direction: row;
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
  [data-theme='dark'] {
    background: #1e1e1e;
  }
</style>
