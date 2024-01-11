class RecipeView extends View {
  _parent = document.querySelector('.recipe');
  setSubscriber(subscriber) {
    const bindWindowListener = windowEventListeners('hashchange', 'load');
    bindWindowListener(subscriber);
  }
  setUpdateServingsSubscriber(UpdateServingsSubscriber) {
    this._parent.addEventListener('click', clickEvent => {
      const updateServingButton = clickEvent.target.closest('.btn--update-servings');
      if (!updateServingButton) return;
      const { updateServingsTo } = updateServingButton.dataset;
      if (+updateServingsTo <= 0) return;
      UpdateServingsSubscriber(+updateServingsTo);
    });
  }
  setBookmarkSubscriber(bookmarkSubscriber) {
    this._parent.addEventListener('click', clickEvent => {
      const bookmarkButton = clickEvent.target.closest('.btn--bookmark');
      if (!bookmarkButton) return;
      bookmarkSubscriber();
    });
  }
  _generateMarkup() {
    return `
      <figure class="recipe__fig">
      <img src=${this._data.image} alt=${this._data.title} class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${View.icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${View.icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-servings-to=${this._data.servings - 1}>
            <svg>
              <use href="${View.icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-servings-to=${this._data.servings + 1}>
            <svg>
              <use href="${View.icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
      <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${View.icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${View.icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this.#ingredientsMarkup).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href=${this._data.sourceURL}
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${View.icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
  }
  #ingredientsMarkup(ingredient) {
    return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${View.icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${ingredient.quantity ? ingredient.quantity : ''}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
          </div>
        </li>
    `;
  }
}
export default new RecipeView();
import { windowEventListeners } from '../helpers';
import { updateServingsTo } from '../model.js';
import View from '../views/View.js';
