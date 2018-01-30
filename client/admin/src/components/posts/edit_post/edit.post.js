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

        console.log(content);

        let postContent = EditorState.create({
            doc: DOMParser.fromSchema(mySchema).parse(content),
            plugins: exampleSetup({schema: mySchema})
        });

        window.view = new EditorView(document.querySelector('#editor'), {
            state: postContent
        });
    };


    const editPost = (id)=>{
        const post = {
            title: document.getElementById('edit_title').value,
            content: DOMParser.fromSchema(mySchema).parse(content),
            meta: {
                description: document.getElementById('meta_desc'),
                keywords: document.getElementById('meta_keywords'),
            },
            category: document.getElementById('edit_post_category')
        };

        const options = {
            method: 'put',
            url: `/api/v1/post/${id}`,
            data: post,
            config: true
        };

        return apiHandler.callAPi(options).then(console.log).catch(errorHandler);
    };

    return {editPost, setupEditPost};
}
