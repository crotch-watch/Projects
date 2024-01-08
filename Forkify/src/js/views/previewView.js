class PreviewView extends View {
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    const isLinkActive = this._data.id === id;
    return `
        <a class="preview__link" ${isLinkActive ? 'preview__link--active' : ''} href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
          </div>
        </a>
      `;
  }
}
export default new PreviewView();
import View from './View';
