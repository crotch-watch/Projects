export default class View {
  static icons = icons;
  _data;
  _parent;
  _loadingSpinner = `
    <div class="spinner">
      <svg>
        <use href="${View.icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  _DEFAULT_ERROR_MESSAGE = 'No recipes found for your query. Please try again!';
  _MESSAGE = '';
  render(data) {
    if (!data || (Array.isArray(data) && !data.length)) throw new Error(this._DEFAULT_ERROR_MESSAGE);
    this._data = data;
    this._clearMarkup();
    const markup = this._generateMarkup();
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }
  renderLoadingSpinner(position) {
    if (
      !(position === 'afterbegin' || position === 'afterend' || position === 'beforebegin' || position === 'beforeend')
    ) {
      position = 'afterbegin';
    }
    this._clearMarkup();
    this._parent.insertAdjacentHTML(position, this._loadingSpinner);
  }
  _clearMarkup() {
    this._parent.innerHTML = '';
  }
  renderErrorMessage(message = this._DEFAULT_ERROR_MESSAGE, position) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${View.icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;
    if (
      !(position === 'afterbegin' || position === 'afterend' || position === 'beforebegin' || position === 'beforeend')
    ) {
      position = 'afterbegin';
    }
    this._clearMarkup();
    this._parent.insertAdjacentHTML(position, markup);
  }
  renderMessage(message = this._MESSAGE, position) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    if (
      !(position === 'afterbegin' || position === 'afterend' || position === 'beforebegin' || position === 'beforeend')
    ) {
      position = 'afterbegin';
    }
    this._clearMarkup();
    this._parent.insertAdjacentHTML(position, markup);
  }
  _generateMarkup() {}
  setSubscriber() {}
}

import icons from 'url:../../img/icons.svg';
