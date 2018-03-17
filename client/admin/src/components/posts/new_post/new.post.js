import {DOMParser, Schema} from 'prosemirror-model';
import {EditorView} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
import {baseKeymap} from 'prosemirror-commands';
import {keymap} from 'prosemirror-keymap';
import {setupMenu, schema} from '../../editor/menu.items.js';
import {apiHandler} from '../../../handlers/api.handler.js';
import {errorHandler} from '../../../handlers/error.handler.js';

export const newPostHandler = ()=> {

    let content = document.querySelector('#new_post');


    const setupNewPost = ()=>{

        window.view = new EditorView(document.querySelector('#editor'), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(schema).parse(content),
                plugins: [keymap(baseKeymap), setupMenu()]
            })
        });
    };

    const createNewPost = ()=>{

        const post = {
            title: document.getElementById('post_title').value,
            content: window.view.dom.innerHTML,
            meta: {
                description: document.getElementById('meta_desc').value,
                author: document.getElementById('meta_author').value,
                keywords: document.getElementById('meta_keywords').value
            },
            category: document.getElementById('post_category').value
        };

        const options = {
            method: 'post',
            url: '/post',
            data: post,
            config: true
        };

        return apiHandler.callAPi(options).then(console.log).catch(errorHandler);

    };

    return {createNewPost, setupNewPost};
};
