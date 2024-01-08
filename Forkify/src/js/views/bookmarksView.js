class BookmarksView extends View {
  _parent = document.querySelector('ul.bookmarks__list');
  _DEFAULT_ERROR_MESSAGE = 'No Bookmarks Yet. Find a recipe and bookmark it :)';
  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  }
}
export default new BookmarksView();
import View from './View';
import previewView from './previewView';
