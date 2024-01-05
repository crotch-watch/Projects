class PaginationView extends View {
  _parent = document.querySelector('.pagination');
  _nextButtonType = 'next';
  _nextButtonClassSuffix = 'next';
  _prevButtonType = 'previous';
  _previousButtonClassSuffix = 'prev';
  _generateMarkup() {
    const { currentPage, totalPages } = this._data;
    if (totalPages === INITIAL_TOTAL_PAGES) return;
    const nextButton = this._generatePaginationButton(this._nextButtonType, currentPage);
    if (currentPage === INITIAL_PAGE) return nextButton;
    const previousButton = this._generatePaginationButton(this._prevButtonType, currentPage);
    if (currentPage === totalPages) return previousButton;
    return previousButton + nextButton;
  }
  setSubscriber(subscriber) {
    this._parent.addEventListener('click', clickEvent => {
      const button = clickEvent.target.closest('.btn--inline');
      if (!button) return;
      subscriber(+button.dataset.redirectToPage);
    });
  }
  _generatePaginationButton(type, currentPage = this._data.currentPage) {
    let classNameSuffix;
    const isNextButton = type === this._nextButtonType;
    const isPreviousButton = type === this._prevButtonType;
    switch (true) {
      case isPreviousButton:
        classNameSuffix = this._previousButtonClassSuffix;
        currentPage -= 1;
        break;
      case isNextButton:
        classNameSuffix = this._nextButtonClassSuffix;
        currentPage += 1;
        break;
    }
    return `
      <button data-redirectToPage=${currentPage} class="btn--inline pagination__btn--${classNameSuffix}">
        ${
          isPreviousButton
            ? `<svg class="search__icon">
                <use href="${View.icons}#icon-arrow-left"></use>
              </svg>`
            : `<span>Page ${currentPage}</span>`
        }
        ${
          isPreviousButton
            ? `<span>Page ${currentPage}</span>`
            : `<svg class="search__icon">
                <use href="${View.icons}#icon-arrow-right"></use>
              </svg>`
        }
      </button>
    `;
  }
}

export default new PaginationView();
import { INITIAL_PAGE, INITIAL_TOTAL_PAGES } from '../config';
import View from './View';
