<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import SvelteEditor from '$lib/Editor.svelte';

  import {getContext, onDestroy, onMount} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {svelteEditorToHtml} from '$lib/helpers';
  import {debounce} from 'radash';

  const editor: Writable<Editor> = getContext('editor');

  const submitPromt = async (prompt: string) => {
    return `An unofficial, community-led Svelte port of shadcn/ui. We are not affiliated with shadcn, but we did get his blessing before creating a Svelte version of his work. This project was born out of the need for a similar project for the Svelte ecosystem.
This is NOT a component library. It's a collection of re-usable components that you can copy and paste or use the CLI to add to your apps.`;
  };

  let html;
  const toHtml = async () => {
    html = await svelteEditorToHtml($editor);
  };

  const handleUpload = async (file: File) => {
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
  };
  const saveDraft = debounce({delay: 500}, (editor: Editor) => {
    const jsContent = editor.getJSON();
    localStorage.setItem('draft', JSON.stringify(jsContent));
  });
  const dispose = editor.subscribe(updated => {
    if (updated) {
      saveDraft(updated);
    }
  });

  onDestroy(dispose);
</script>

<div class="mt-10">
  <SvelteEditor
    content={''}
    placeholder="Press 'space' GPT support, type '/' for help"
    onCreated={createdEditor => {
      //@ts-ignore
      window.editor = createdEditor;
      editor.set(createdEditor);
      const jsonLoaded = localStorage.getItem('draft') || '';
      if (jsonLoaded) {
        createdEditor.commands.setContent(JSON.parse(jsonLoaded), false);
      }
      console.log(createdEditor.state);
    }}
    onChange={editor.set}
    plugins={{
      image: {
        handleUpload,
        unsplash: {
          accessKey: 'omv67BHUb-gbDEbf9UwFsvGbKdQHwnreJPAzgI0Mz5I'
        },
        triggerOnMount: false
      },
      ask: {query: submitPromt}
    }}
  />
</div>
