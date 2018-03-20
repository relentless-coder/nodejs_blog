import {toggleMark, setBlockType, wrapIn} from 'prosemirror-commands';
import {schema} from 'prosemirror-schema-basic';
import {menuPlugin} from './menu.plugin.js';

const icon = (text, name)=>{
    let iconElement = document.createElement('span');
    iconElement.className = 'menu_icon';
    iconElement.title = name;
    iconElement.textContent = text;
    return iconElement;
};

const heading = (level)=>{
    return {
        command: setBlockType(schema.nodes.heading, {level}),
        dom: icon(`H${level}`, heading)
    };
};

export const setupMenu = ()=>{
    return menuPlugin([
        {command: toggleMark(schema.marks.strong), dom: icon('B', 'strong')},
        {command: toggleMark(schema.marks.em), dom: icon('i', 'em')},
        {command: setBlockType(schema.nodes.paragraph), dom: icon('p', 'paragraph')},
        {command: setBlockType(schema.nodes.code_block), dom: icon('<>', 'code')},
        {command: toggleMark(schema.marks.code), dom: icon('``', 'inline_code')},
        {command: toggleMark(schema.marks.link), dom: icon('link', 'link')}
    ]);
};

export {schema};
