class AddRecipe extends View {
  _parent = document.querySelector('form.upload');
  _window = document.querySelector('div.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _openButton = document.querySelector('button.nav__btn--add-recipe');
  _closeButton = document.querySelector('button.btn--close-modal');
  setClickAddRecipeSub() {
    this._openButton.addEventListener('click', this.toggleWindow.bind(this));
    console.log(this._parent);
  }
  setFormSubmitSub(formSubmitSub) {
    this._parent.addEventListener('submit', submitEvent => {
      submitEvent.preventDefault();
      let formInputValues = [...new FormData(submitEvent.target)];
      formInputValues = Object.fromEntries(formInputValues);
      formSubmitSub(formInputValues);
    });
  }
  setFormCloseSub() {
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    this._closeButton.addEventListener('click', this.toggleWindow.bind(this));
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
}
export default new AddRecipe();

import View from './View';
