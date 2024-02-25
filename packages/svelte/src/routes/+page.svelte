<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import SvelteEditor from '$lib/Editor.svelte';

  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {svelteEditorToHtml} from '$lib/helpers';
  import test from './test.json';

  const editor: Writable<Editor> = getContext('editor');

  const submitPromt = async (prompt: string) => {
    return `An unofficial, community-led Svelte port of shadcn/ui. We are not affiliated with shadcn, but we did get his blessing before creating a Svelte version of his work. This project was born out of the need for a similar project for the Svelte ecosystem.
This is NOT a component library. It's a collection of re-usable components that you can copy and paste or use the CLI to add to your apps.`;
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
      image: {
        handleUpload,
        unsplash: {
          accessKey: 'omv67BHUb-gbDEbf9UwFsvGbKdQHwnreJPAzgI0Mz5I'
        },
        triggerOnMount: false
      },
      gpt: {query: submitPromt}
    }}
  />
</div>
