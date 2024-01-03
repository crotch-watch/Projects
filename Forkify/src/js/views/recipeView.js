class RecipeView {
  #parent = document.querySelector('.recipe');
  #data;
  #loadingSpinner = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  #DEFAULT_ERROR_MESSAGE = 'No recipes found for your query. Please try again!';
  #MESSAGE = '';
  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clearMarkup();
    this.#parent.insertAdjacentHTML('afterbegin', markup);
  }
  setSubscriber(subscriber) {
    const bindWindowListener = windowEventListeners('hashchange', 'load');
    bindWindowListener(subscriber);
  }
  #generateMarkup() {
    return `
      <figure class="recipe__fig">
      <img src=${this.#data.image} alt=${this.#data.title} class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this.#data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${this.#data.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this.#data.ingredients.map(this.#ingredientsMarkup).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${this.#data.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href=${this.#data.sourceURL}
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
  }
  #ingredientsMarkup(ingredient) {
    return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${ingredient.quantity ? ingredient.quantity : ''}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
          </div>
        </li>
    `;
  }
  #clearMarkup() {
    this.#parent.innerHTML = '';
  }
  renderLoadingSpinner(position) {
    if (
      !(position === 'afterbegin' || position === 'afterend' || position === 'beforebegin' || position === 'beforeend')
    ) {
      position = 'afterbegin';
    }
    this.#clearMarkup();
    this.#parent.insertAdjacentHTML(position, this.#loadingSpinner);
  }
  renderErrorMessage(message = this.#DEFAULT_ERROR_MESSAGE, position) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
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
    this.#clearMarkup();
    this.#parent.insertAdjacentHTML(position, markup);
  }
  renderMessage(message = this.#MESSAGE, position) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message || this.#MESSAGE}</p>
      </div>
    `;
    if (
      !(position === 'afterbegin' || position === 'afterend' || position === 'beforebegin' || position === 'beforeend')
    ) {
      position = 'afterbegin';
    }
    this.#clearMarkup();
    this.#parent.insertAdjacentHTML(position, markup);
  }
}
export default new RecipeView();
import { windowEventListeners } from '../helpers';
import icons from 'url:../../img/icons.svg';