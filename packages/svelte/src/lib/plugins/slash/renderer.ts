import type {SuggestionProps, SuggestionRenderer} from '@tiptap/suggestion';
import tippy, {type Instance, type Props} from 'tippy.js';

import type {SlashMenuItem} from './slash-menu';
import SlashComponent from './Slash.svelte';

export type Coordinate = {
  top: number;
  left: number;
  bottom: number;
  pos: number;
};

export const slashRenderer = (): SuggestionRenderer<SlashMenuItem> => {
  let component: SlashComponent,
    wrapper: HTMLDivElement,
    popup: Instance<Props>;
  return {
    onStart(props: SuggestionProps) {
      const {clientRect, editor} = props;
      wrapper = document.createElement('div');
      editor.view.dom.parentNode?.appendChild(wrapper);
      component = new SlashComponent({
        target: wrapper,
        props: {props}
      });
      popup = tippy('body', {
        getReferenceClientRect: clientRect as any,
        appendTo: () => document.body,
        content: wrapper,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start'
      })[0];
    },
    onUpdate(props: SuggestionProps) {
      component.$set({props});
      popup.setProps({
        getReferenceClientRect: props.clientRect as any
      });
    },

    onExit() {
      popup.destroy();
      component.$destroy();
      wrapper.remove();
    },

    onKeyDown(props: SuggestionProps) {
      if (props.event.key === 'Escape') {
        popup.hide();

        return true;
      }
      return component.onKeyDown(props);
    }
  };
};
