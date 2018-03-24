import {setupMenu, schema} from '../../editor/menu.items.js';
import {EditorView} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
import {keymap} from 'prosemirror-keymap';
import {DOMParser, Schema} from 'prosemirror-model';
import {baseKeymap} from 'prosemirror-commands';
import {exampleSetup} from 'prosemirror-example-setup';
import {addListNodes} from  'prosemirror-schema-list';
import {apiHandler} from '../../../handlers/api.handler';

const createDomElement = (type, attributes) => {
    const el = document.createElement(type);
    if (Array.isArray(attributes)) {
        attributes.forEach((attr) => {
            el.setAttribute(attr.name, attr.value);
        });
        return el;
    }
    el.setAttribute(attributes.name, attributes.value);
    return el;
};

export const profileHandler = () => {

    let content = document.querySelector('#profile_about');


    const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
        marks: schema.spec.marks
    });
    const setupUpdateProfile = () => {
        console.log('content user is ', content.user);

        window.view = new EditorView(document.querySelector('#profile_editor'), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(mySchema).parse(content),
                plugins: exampleSetup({schema: mySchema})

            })
        });
    };

    const addSocialProfile = () => {
        const button = document.querySelector('.add_social_profile');
        const div = createDomElement('div', {name: 'class', value: 'social_profiles'});

        const inputName = createDomElement('input', [{name: 'type', value: 'text'}, {
            name: 'placeholder',
            value: 'Name of the social profile'
        }]);
        const inputLink = createDomElement('input', [{name: 'type', value: 'text'}, {
            name: 'placeholder',
            value: 'Link to the social profile'
        }]);

        div.appendChild(inputName);

        div.appendChild(inputLink);

        document.querySelector('.social_profiles_wrapper').insertBefore(div, button);
    };

    const addHelpfulLinks = () => {
        const button = document.querySelector('.add_helpful_links');
        let helpful_links_wrapper;
        if (!document.querySelector('.helpful_links_wrapper')) {
            helpful_links_wrapper = createDomElement('div', {name: 'class', value: 'helpful_links_wrapper'});
        } else {
            helpful_links_wrapper = document.querySelector('.helpful_links_wrapper');
        }

        const div = createDomElement('div', {name: 'class', value: 'helpful_link'});

        const linkName = createDomElement('input', [{name: 'type', value: 'text'}, {
            name: 'placeholder',
            value: 'Enter the title of the link'
        }, {
            name: 'name',
            value: 'resource_name'
        }]);
        const link = createDomElement('input', [{name: 'type', value: 'text'}, {
            name: 'placeholder',
            value: 'Enter the link to the resource'
        }, {
            name: 'name',
            value: 'resource_link'
        }]);
        const about = createDomElement('input', [{name: 'type', value: 'text'}, {
            name: 'placeholder',
            value: 'Enter the link to the resource'
        }, {name: 'class', value: 'helpful_link_about'}, {
            name: 'name',
            value: 'resource_about'
        }]);

        div.appendChild(linkName);
        div.appendChild(about);
        div.appendChild(link);

        helpful_links_wrapper.insertBefore(div, button);
    };

    const updateProfile = () => {
        const form = new FormData();
        form.append('name', document.getElementById('profile_name').value);
        form.append('title', document.getElementById('profile_title').value);

        if(document.getElementById('profile_image').files[0])
            form.append('profileImage', document.getElementById('profile_image').files[0]);

        form.append('about', window.view.dom.innerHTML);

        const profileWrapper = document.querySelector('.social_profiles_wrapper');
        const socialProfiles = [...profileWrapper.children];

        const helpFullLinksWrapper = document.querySelector('.helpful_links_wrapper');
        console.log(helpFullLinksWrapper);
        const helpFullLinks = [...helpFullLinksWrapper.children];

        let links = [];

        helpFullLinks.forEach((el, i) => {
            if (el.nodeName !== 'BUTTON') {
                links[i] = {
                    title: el.children[0].value,
                    about: el.children[1].value,
                    link: el.children[2].value
                };
            }
        });

        let profiles = [];

        socialProfiles.forEach((el, i) => {
            if (el.nodeName !== 'BUTTON') {
                if (el.children[0].value && el.children[1].value) {
                    profiles[i] = {
                        name: el.children[0].value,
                        link: el.children[1].value
                    };
                }
            }
        });

        form.append('social', JSON.stringify(profiles));
        form.append('projects', JSON.stringify(links));

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

    return {setupUpdateProfile, addSocialProfile, updateProfile, addHelpfulLinks};

};
