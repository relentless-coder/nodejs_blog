import {setupMenu,schema} from '../editor/menu.items.js';
import {EditorView} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
import {keymap} from 'prosemirror-keymap';
import {DOMParser} from 'prosemirror-model';
import {baseKeymap} from 'prosemirror-commands';
export const profileHandler = ()=>{

    let content = document.querySelector('#profile_about');


    const setupUpdateProfile = ()=>{

        window.view = new EditorView(document.querySelector('#profile_editor'), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(schema).parse(content),
                plugins: [keymap(baseKeymap), setupMenu()]
            })
        });
    };

    const addSocialProfile = ()=>{
        const div = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        div.appendChild(label);
        div.appendChild(input);
    };

    const updateProfile = ()=>{
        const socialNodes = document.getElementById('social_profiles').children;
        socialNodes.forEach((el)=>{
            el.child()
        })
        const form = new FormData();
        form.append('name', document.getElementById('profile_name').value);
        form.append('profileImage', document.getElementById('profile_image').files[0]);
        form.append('about', window.view.DOM.outerHTML);
    };

    return {setupUpdateProfile, addSocialProfile, updateProfile}

};
