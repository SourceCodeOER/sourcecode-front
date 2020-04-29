import { Node } from 'tiptap'
// @ts-ignore
import {splitListItem, liftListItem, sinkListItem, insertText, chainCommands} from 'tiptap-commands'

export default class ListItem extends Node {

  get name() {
    return 'list_item'
  }

  get schema() {
    return {
      content: 'paragraph block*',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'li' },
      ],
      toDOM: () => ['li', 0],
    }
  }

  // @ts-ignore
  keys({ type }) {
    return {
      Enter: splitListItem(type),
      Tab: chainCommands(sinkListItem(type), insertText("    ")),
      "Shift-Tab": liftListItem(type)
    };
  }

}
