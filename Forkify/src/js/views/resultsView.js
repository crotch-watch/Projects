class ResultsView extends View {
  _parent = document.querySelector('ul.results');
  _generateMarkup() {
    return this._data.map(this._generateSinglePreview);
  }
  _generateSinglePreview(result) {
    const id = window.location.hash.slice(1);
    const isLinkActive = result.id === id;
    return `
        <li class="preview">
          <a class="preview__link" ${isLinkActive ? 'preview__link--active' : ''} href="#${result.id}">
            <figure class="preview__fig">
              <img src="${result.image}" alt="${result.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${result.title}</h4>
              <p class="preview__publisher">${result.publisher}</p>
            </div>
          </a>
        </li
      `;
  }
}
export default new ResultsView();
import View from './View';
