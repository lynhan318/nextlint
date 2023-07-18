import {Extension, isNodeSelection} from '@tiptap/core';

export type TextAlignment = 'left' | 'center' | 'right';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    common: {
      setTextAlign: (align?: TextAlignment) => ReturnType;
    };
  }
}
export const CommonExtension = Extension.create({
  name: 'nextlintCommon',
  addCommands() {
    return {
      setTextAlign:
        (align?: TextAlignment) =>
        ({editor, state}) => {
          const sel = state.selection;
          if (isNodeSelection(sel)) {
            queueMicrotask(() => {
              editor.commands.updateAttributes(sel.node.type, {align});
            });
            return true;
          } else {
            const node = sel.$anchor.node(1);

            //Workaround: invaid with selection range when click on command item
            queueMicrotask(() => {
              editor.commands.updateAttributes(node.type, {align});
            });

            return true;
          }
        }
    };
  }
});
