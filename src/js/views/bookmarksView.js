import previewView from './previewView.js';
import View from './view.js';
import icons from 'url:../../img/icons.svg';

class bookmarksView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
    _message = 'We find that recipe. Please try another one!'
    
    addHandlerRender(handler){
        window.addEventListener('load',handler);
    }
    
    _generateMarkup(){
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
};

export default new bookmarksView();