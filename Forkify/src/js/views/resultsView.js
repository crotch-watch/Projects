/**
 * @function ResultsView
 * @memberof View 
 */

class ResultsView extends View {
  _parent = document.querySelector('ul.results');
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false));
  }
}
export default new ResultsView();
import View from './View';
import previewView from './previewView';
