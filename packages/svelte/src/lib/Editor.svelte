<script lang="ts" context="module">
  export type PluginOptions = {
    image?: ImagePluginOptions;
    ask?: AskOptions;
    dropCursor?: DropcursorOptions;
    codeBlock?: NextlintCodeBlockOptions;
  };
</script>

<script lang="ts">
  import {createEditorContext} from '$lib/context';
  import type {Content, Editor, Extensions} from '@tiptap/core';

  import {LinkExtension} from '$lib/plugins/link';
  import {
    NextlintCodeBlock,
    type NextlintCodeBlockOptions
  } from '$lib/plugins/codeBlock';
  import {PluginAsk, type AskOptions} from '$lib/plugins/ask';
  import {FigureExtension} from '$lib/plugins/figure';
  import {
    SelectImageExtension,
    type ImagePluginOptions
  } from '$lib/plugins/image';
  import {HighlightExtension} from '$lib/plugins/highlight';
  import {SlashMenu} from '$lib/plugins/slash';

  import {
    Dropcursor,
    type DropcursorOptions
  } from '@tiptap/extension-dropcursor';
  import {useProsemirrorAdapterProvider} from '@prosemirror-adapter/svelte';

  import BubbleMenu from './components/BubbleMenu/BubbleMenu.svelte';
  import {BubbleMenuExtension} from './plugins/bubbleMenu/bubbleMenu';
  import {BlockMenuExtension} from './plugins/blockMenu';

  useProsemirrorAdapterProvider();
  export let content: Content;
  export let placeholder = "Press 'space' GPT support, type '/' for help";
  export let onChange: (editor: Editor) => void;
  export let onCreated = (_editor: Editor) => {};
  export let plugins: PluginOptions = {};
  export let extensions: Extensions = [];
  const {render} = createEditorContext({
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
    //@ts-ignore
    extensions: [
      LinkExtension,
      HighlightExtension,
      SlashMenu,
      FigureExtension,
      BlockMenuExtension,
      SelectImageExtension.configure(plugins.image),
      Dropcursor.configure(plugins.dropCursor),
      NextlintCodeBlock.configure(
        plugins.codeBlock || {
          themes: {
            dark: 'github-dark',
            light: 'github-light'
          },
          langs: []
        }
      ),
      BubbleMenuExtension.configure({
        component: BubbleMenu
      }),
      plugins.ask && PluginAsk.configure(plugins.ask)
    ]
      .concat(extensions)
      .filter(Boolean)
  });
</script>

<div use:render />
