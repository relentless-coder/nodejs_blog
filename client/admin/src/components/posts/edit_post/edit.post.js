import {DOMParser, Schema} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {exampleSetup} from 'prosemirror-example-setup';
import {apiHandler} from '../../../handlers/api.handler.js';
import {addListNodes} from  'prosemirror-schema-list';
import {errorHandler} from '../../../handlers/error.handler.js';

export function editPostHandler(){

    const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
        marks: schema.spec.marks
    });

    let content = document.querySelector('#edit_post');

    const setupEditPost = ()=>{
        window.view = new EditorView(document.querySelector('#editor'), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(schema).parse(content),
                plugins: exampleSetup({schema: mySchema})

            })
        });
    };


    const editPost = (id)=>{
        const post = {
            title: document.getElementById('edit_title').value,
            content: window.view.dom.innerHTML,
            meta: {
                description: document.getElementById('meta_desc').value,
                keywords: document.getElementById('meta_keywords').value,
            }
        };

        const options = {
            method: 'put',
            url: `/post/${id}`,
            data: post,
            config: true
        };

        return apiHandler.callAPi(options).then(console.log).catch(errorHandler);
    };

    return {editPost, setupEditPost};
}
