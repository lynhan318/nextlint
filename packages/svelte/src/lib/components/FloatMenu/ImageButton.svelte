<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import {ImageIcon} from '../../icons';
  import ButtonWrapper from './FloatButton.svelte';

  export let editor: Editor;
  const upload = async (file: File) => {};

  const onFileChange = async (
    event: Event & {currentTarget: HTMLInputElement}
  ) => {
    event.preventDefault();
    const files = event.currentTarget.files;
    const holderId = crypto.randomUUID();
    if (
      !files ||
      files.length === 0 ||
      !editor.commands.insertUploadHolder({id: holderId})
    )
      return;

    const file = files[0];

    const form = new FormData();
    form.append('file', file);

    const [data, error] = await upload<Array<{src: string}>>(
      $editorStore.uploadServer,
      form
    );

    if (!data || error) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    editor
      .chain()
      .replaceUploadHolderWithFigure(holderId, {
        src: data[0].src,
        alt: 'nextlint',
        title: 'nextlint'
      })
      .run();
  };
  let inputRef: HTMLInputElement;
</script>

<ButtonWrapper
  onClick={() => {
    inputRef.click();
    return true;
  }}
>
  <ImageIcon />
</ButtonWrapper>
<input
  bind:this={inputRef}
  hidden
  accept="image"
  type="file"
  on:change={onFileChange}
/>

<style lang="scss">
</style>
