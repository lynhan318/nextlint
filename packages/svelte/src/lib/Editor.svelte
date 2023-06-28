<script lang="ts" context="module">
  export type PluginOptions = {
    selectImage?: SelectImageOptions;
    gpt?: GPTOptions;
    dropCursor?: DropcursorOptions;
  };
</script>

<script lang="ts">
  import {createEditorContext} from '@nextlint/core';
  import type {Content, Editor, Extensions} from '@tiptap/core';
  import {SvelteUIProvider} from '@svelteuidev/core';

  import {LinkExtension} from '$lib/plugins/link';
  import {PluginGPT, type GPTOptions} from '$lib/plugins/gpt';
  import {FigureExtension} from '$lib/plugins/figure';
  import {
    SelectImageExtension,
    type SelectImageOptions
  } from '$lib/plugins/image';
  import {HighlightExtension} from '$lib/plugins/highlight';
  import {SlashMenu} from '$lib/plugins/slash';

  import {
    Dropcursor,
    type DropcursorOptions
  } from '@tiptap/extension-dropcursor';

  import Positioner from './components/Positioner/Positioner.svelte';
  import BubbleMenu from './components/BubbleMenu/BubbleMenu.svelte';

  export let content: Content;
  export let placeholder = "Press 'space' GPT support, type '/' for help";
  export let onChange: (editor: Editor) => void;
  export let onCreated = (editor: Editor) => {};
  export let plugins: PluginOptions = {};
  export let extensions: Extensions = [];

  const {render, ready} = createEditorContext({
    editable: true,
    content,
    onCreated,
    onChange,
    placeholder,
    starterKit: {
      placeholder: {
        placeholder,
        emptyNodeClass: 'is-block-empty'
      }
    },
    extensions: [
      LinkExtension,
      HighlightExtension,
      SlashMenu,
      FigureExtension,
      PluginGPT.configure(plugins.gpt),
      SelectImageExtension.configure(plugins.selectImage),
      Dropcursor.configure(plugins.dropCursor)
    ].concat(extensions)
  });
</script>

<SvelteUIProvider>
  <div use:render />
  {#await ready then _}
    <Positioner position="selection">
      <BubbleMenu />
    </Positioner>
  {/await}
</SvelteUIProvider>
