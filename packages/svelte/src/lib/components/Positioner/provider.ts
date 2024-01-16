import type {Editor} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import type {EditorView} from '@tiptap/pm/view';
import {throttle} from 'radash';
import type {ResolvedPos} from '@tiptap/pm/model';
import {get, writable} from 'svelte/store';

import {
  emptyBlock,
  selectionCoords,
  blockHoverCoordinate,
  coordAtCursor
} from './coords';

export type Maybe<T> = T | null | undefined;

export type Position = 'blockEmpty' | 'blockHover' | 'selection' | 'cursor';

export type PositionMaps = {
  [position in Position]: Positioner[];
};

export type PrositionProvider = {
  [position in Position]: () => Maybe<DOMRect>;
};

type Disposable = () => void;

export interface Positioner {
  onVisible(p: PositionData): void;
  onHide(): void;
}

export type PositionData = {
  pos: number;
  resolver: ResolvedPos;
  blockDOM: HTMLElement;
  clientRects: DOMRect;
};

export type PositionStore = {
  cursor: Maybe<PositionData>;
  selection: Maybe<PositionData>;
  blockEmpty: Maybe<PositionData>;
  blockHover: Maybe<PositionData>;
  locked: Array<Position>;
};

export const positionStore = writable<PositionStore>({
  cursor: null,
  selection: null,
  blockEmpty: null,
  blockHover: null,
  locked: []
});

function sameCoord(coordA?: DOMRect, coordB?: DOMRect) {
  return coordA && coordB && coordA.x === coordB.x && coordA.y === coordB.y;
}

export class PositionProvider {
  positioners: PositionMaps = {
    blockEmpty: [],
    selection: [],
    cursor: [],
    blockHover: []
  };

  isBlockEmpty = false;
  isSelection = false;

  disposable;

  constructor(readonly editor: Editor) {
    this.editor.registerPlugin(
      new Plugin({
        key: new PluginKey('positioner'),
        view: () => {
          return {
            update: this.update,
            destroy: this.destroy
          };
        }
      })
    );
    this.disposable = ['mouseup'].map(eventName => {
      const handler = (event: any) => this[eventName](event);
      editor.view.dom.addEventListener(eventName, handler, false);
      return () =>
        editor.view.dom.removeEventListener(eventName, handler, false);
    });
    this.disposable.push(
      ...['click', 'mousemove'].map(eventName => {
        const handler = (event: any) => this[eventName](event);
        editor.view.dom.addEventListener(eventName, handler, false);
        return () =>
          editor.view.dom.removeEventListener(eventName, handler, false);
      })
    );
  }

  get visibleState() {
    return get(positionStore);
  }

  static create(editor: Editor) {
    return new PositionProvider(editor);
  }

  register = (position: Position, positioner: Positioner): Disposable => {
    const insertIdx = this.positioners[position].push(positioner);
    return () => this.positioners[position].splice(insertIdx - 1, 1);
  };

  private setPositionCoord = (
    position: Position,
    data: Maybe<PositionData>
  ) => {
    this.setState(position, data);
    this.positioners[position].forEach(positioner => {
      if (data) {
        return positioner.onVisible(data);
      }
      positioner.onHide();
    });
  };

  update = (view: EditorView, event) => {
    //pre calculate value for all position
    this.isBlockEmpty = emptyBlock(view);
    this.isSelection = !view.state.selection.empty && view.hasFocus();
  };

  destroy = () => {
    this.disposable.forEach((disposable: any) => {
      disposable();
    });
  };

  //Handle 'CURSOR' position here
  click = (event: MouseEvent) => {
    // ignore if event queue is empty
    if (this.positioners.cursor.length === 0) return;
    //workaround wait until selection state is updated
    setTimeout(() => {
      const data = coordAtCursor(this.editor.view, event);
      if (sameCoord(data?.clientRects, this.visibleState.cursor?.clientRects)) {
        return;
      }
      if (!data) {
        this.setPositionCoord('cursor', null);
        return;
      }
      if (this.editor.state.selection.empty) {
        this.setPositionCoord('cursor', data);
      }
    }, 100);
  };

  isLock = (queue: Position) => this.visibleState.locked.includes(queue);

  mousemove = throttle({interval: 50}, event => {
    // ignore if event queue is empty
    if (this.positioners.blockHover.length === 0) return;

    //ignore when lock
    if (this.isLock('blockHover')) return;

    const data = blockHoverCoordinate(this.editor.view, event);

    if (!data) {
      this.setPositionCoord('blockHover', null);
      return;
    }
    this.setPositionCoord('blockHover', data);
  });

  setState = (key, value) => {
    positionStore.set({
      ...this.visibleState,
      [key]: value
    });
  };
  //Handle 'SELECTION' position here
  mouseup = async () => {
    // ignore if event queue is empty
    if (this.positioners.selection.length === 0) return;
    // if (!this.isSelection) {
    //   this.setPositionCoord('selection', null);
    //   console.log('selection is null');
    //   return;
    // }
    setTimeout(() => {
      const coords = selectionCoords(this.editor.view);
      if (!coords) {
        if (this.visibleState.selection) {
          this.setPositionCoord('selection', null);
        }
        return;
      }
      this.setPositionCoord('selection', coords);
    }, 50);
  };
}
