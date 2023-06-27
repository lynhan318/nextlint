import {
  DOMSerializer,
  type Fragment,
  type Schema,
  Node
} from '@tiptap/pm/model';
import {toHtml} from 'hast-util-to-html';
import {
  type Node as TiptapNode,
  type Editor,
  isNodeSelection
} from '@tiptap/core';
import {createHTMLDocument, VHTMLDocument} from 'zeed-dom';

import {lowlight} from './editor';

export function createUUID(): string {
  return crypto.randomUUID();
}

export const transformHTML = (fragment: Fragment, schema: Schema) => {
  const domSerializer = DOMSerializer.fromSchema(schema);
  const dom = domSerializer.serializeFragment(fragment, {
    document: createHTMLDocument() as unknown as Document
  }) as unknown as VHTMLDocument;
  return dom.children
    .map((child: VHTMLDocument) => {
      if (child.nodeName === 'PRE') {
        const codeElement = child.querySelector('code');
        if (codeElement) {
          const code = child.textContent || '';
          const htmlContent = toHtml(lowlight.highlightAuto(code));
          codeElement.innerHTML = htmlContent;
          return child.render();
        }
      }
      return child.render();
    })
    .join('');
};

export const renderHTML = (editor: Editor) => {
  const doc = editor.getJSON();
  try {
    const schema = editor.schema;
    const contentNode = Node.fromJSON(schema, doc);
    return transformHTML(contentNode.content, schema);
  } catch (error) {
    console.error(error);
    return ``;
  }
};

export const nodeIdDecorator = (plugin: TiptapNode) => {
  const addAttributes = (plugin as any).parent.config?.addAttributes;

  (plugin as any).parent.config.addAttributes = function () {
    const attrs = addAttributes?.apply(this, arguments) || {};
    return {
      ...attrs,
      align: {
        default: 'left',
        renderHTML: attributes => {
          return {
            'data-align': attributes.align,
            'data-node-type': this.name,
            style: `text-align:${attributes.align}`
          };
        },
        parseHTML: (element: string | HTMLElement) => {
          if (typeof element === 'string') return;
          return element.getAttribute('data-align');
        }
      }
    };
  };

  return plugin;
};
export const extractTOC = (root: HTMLElement) => {
  root.childNodes.forEach(child => {
    console.log('childNOde', child);
  });
};

export const getRootNode = (editor: Editor) => {
  const {doc, selection} = editor.state;
  if (isNodeSelection(selection)) {
    const node = selection.node;
    return {
      start: selection.from,
      end: selection.to,
      node
    };
  }
  if (selection.anchor > 0) {
    const resolver = doc.resolve(selection.anchor);
    return {
      start: resolver.start(1),
      node: resolver.node(1),
      end: resolver.end(1)
    };
  }
  return null;
};
