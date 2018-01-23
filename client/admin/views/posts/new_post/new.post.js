import {DOMParser} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';
import {EditorState} from 'prosemirror-state';
import {apiHandler} from '../../../handlers/api.handler.js';
import {errorHandler} from '../../../handlers/error.handler.js';

function newPostHandler() {
	let content = document.getElementById('new_post');

	let postContent = EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(content)
	});
	
	const createNewPost = ()=>{
		const post = {
			title: document.getElementById('post_title').value,
			content: postContent,
			meta: {
				description: document.getElementById('meta_desc'),
				author: document.getElementById('meta_author'),
				keywords: document.getElementById('meta_keywords')
			},
			category: document.getElementById('post_category')
		};

		const options = {
			method: 'post',
			url: '/api/v1/post',
			date: post,
			config: true
		};

		return apiHandler.callAPi(options).then(console.log).catch(errorHandler);

	};
}
