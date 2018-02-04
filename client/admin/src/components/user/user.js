import {setupMenu,schema} from '../editor/menu.items.js';
import {EditorView} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
export const profileHandler = ()=>{

    const addSocialProfile = ()=>{
        const div = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        div.appendChild(label);
        div.appendChild(input);
    };

    const saveUserProfile = ()=>{

    };

};
