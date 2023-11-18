<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import SvelteEditor from '$lib/Editor.svelte';
  import type {Writable} from 'svelte/store';
  import {getContext} from 'svelte';

  const editor: Writable<Editor> = getContext('editor');

  const handleUpload = async (file: File) => {
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
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
</script>

<div class="mt-10 w-full">
  <SvelteEditor
    content={'a'}
    onChange={editor.set}
    placeholder="Press 'space' GPT support, type '/' for help"
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
