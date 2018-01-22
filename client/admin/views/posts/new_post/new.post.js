import {DOMParser} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';
import {EditorState} from 'prosemirror-state'


function newPostHandler() {
  let content = document.getElementById('new_post');

  let state = EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content)
  })
}