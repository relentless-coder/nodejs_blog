import {Plugin} from 'prosemirror-state';
import {MenuView} from './menu.view.js';

export const menuPlugin = (items, editorView)=>{
    return new Plugin({
        view(editorView) {
            let menuView = new MenuView(items, editorView);
            editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
            return menuView;
        }
    });
};
