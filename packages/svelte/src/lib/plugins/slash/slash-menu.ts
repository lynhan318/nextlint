import type {SvelteComponent} from 'svelte';
import {Editor, Extension, type Range} from '@tiptap/core';
import {type SuggestionOptions, Suggestion} from '@tiptap/suggestion';
import {PluginKey} from '@tiptap/pm/state';

import {slashRenderer} from './renderer';
import {querySuggestion} from './suggestion';

export const SlashMenuPluginKey = new PluginKey('slash-menu');

export type SlashMenuItem = {
  title: string;
  icon: SvelteComponent;
  description: string;
  category: {type: string; text: string; desc?: string};
  command: (props: {editor: Editor; range: Range}) => void;
};

export type SlashMenuOptions = {
  suggestion: Omit<SuggestionOptions<SlashMenuItem>, 'editor' | 'render'>;
};

export const SlashMenu = Extension.create<SlashMenuOptions>({
  name: 'slash-menu',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({editor, range, props}) => {
          props.command({editor, range});
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        render: slashRenderer,
        items: querySuggestion,
        decorationClass: 'slash-menu-visible',
        char: '/',
        command: ({editor, range, props}) => {
          props.command({editor, range});
        }
      })
    ];
  }
});
