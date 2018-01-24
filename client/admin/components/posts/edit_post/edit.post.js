import {DOMParser} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';
import {EditorState} from 'prosemirror-state';
import {apiHandler} from '../../../handlers/api.handler.js';
import {errorHandler} from '../../../handlers/error.handler.js';

export function editPostHandler(){
	let content = document.getElementById('edit_post');

	let postContent = EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(content)
	});

	const editPost = (id)=>{
		const post = {
			title: document.getElementById('edit_title').value,
			content: postContent,
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

	return {editPost};
}
