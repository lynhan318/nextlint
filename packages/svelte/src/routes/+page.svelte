<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import SvelteEditor from '$lib/Editor.svelte';

  import showcaseContent from './sveltor.json';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {renderHTML} from '@nextlint/core';
  import {getHighlighter} from '$lib/plugins/codeBlock';
  import {svelteEditorToHtml} from '$lib/helpers';
  import test from './test.json';

  const editor: Writable<Editor> = getContext('editor');

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

  let html;
  const toHtml = async () => {
    html = await svelteEditorToHtml($editor);
    console.log('html', html);
  };

  const handleUpload = async (file: File) => {
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
  };
</script>

<button on:click={() => toHtml()}>To HTML</button>

<div>
  <SvelteEditor
    content={test}
    placeholder="Press 'space' GPT support, type '/' for help"
    onCreated={editor.set}
    onChange={editor.set}
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
