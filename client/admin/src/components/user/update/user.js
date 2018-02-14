import {setupMenu, schema} from '../../editor/menu.items.js';
import {EditorView} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
import {keymap} from 'prosemirror-keymap';
import {DOMParser} from 'prosemirror-model';
import {baseKeymap} from 'prosemirror-commands';
import {apiHandler} from '../../../handlers/api.handler';

export const profileHandler = () => {

    let content = document.querySelector('#profile_about');


    const setupUpdateProfile = () => {

        window.view = new EditorView(document.querySelector('#profile_editor'), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(schema).parse(content),
                plugins: [keymap(baseKeymap), setupMenu()]
            })
        });
    };

    const addSocialProfile = () => {
        const button = document.querySelector('.add_social_profile');
        const div = document.createElement('div');
        div.setAttribute('class', 'social_profiles');
        const inputName = document.createElement('input');
        const inputLink = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('placeholder', 'Name of the social profile');
        inputLink.setAttribute('type', 'text');
        inputLink.setAttribute('placeholder', 'Link to the social profile');
        div.appendChild(inputName);
        div.appendChild(inputLink);
        document.querySelector('.social_profiles_wrapper').insertBefore(div, button);
    };

    const updateProfile = () => {
        const form = new FormData();
        form.append('name', document.getElementById('profile_name').value);
        form.append('profileImage', document.getElementById('profile_image').files[0]);
        form.append('about', window.view.dom.innerHTML);

        const profileWrapper = document.querySelector('.social_profiles_wrapper');
        const socialProfiles = [...profileWrapper.children];

        console.log(socialProfiles);
        console.log(socialProfiles[0].children);

        let profiles = [];

        socialProfiles.forEach((el, i) => {
            console.log(el);
            if (el.nodeName !== 'BUTTON') {
                if (el.children[0].value && el.children[1].value) {
                    profiles[i] = {
                        name: el.children[0].value,
                        link: el.children[1].value
                    };
                }
            }
        });

        console.log(profiles);

        form.append('social', JSON.stringify(profiles));

        for (let pair of form) {
            console.log(pair[0], pair[1]);
        }

        let options = {
            method: 'put',
            data: form,
            url: '/user',
            config: true
        };

        return apiHandler.callAPi(options).then(data => console.log(data)).catch(err => console.log(err));

    };

    return {setupUpdateProfile, addSocialProfile, updateProfile};

};
