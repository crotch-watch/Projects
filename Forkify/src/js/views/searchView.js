class SearchView extends View {
  #parent = document.querySelector('form');
  #searchField = this.#parent.querySelector('.search__field');
  get searchQuery() {
    return this.#searchField.value;
  }
  setSubscriber(subscriber) {
    this.#parent.addEventListener('submit', submitEvent => {
      submitEvent.preventDefault();
      subscriber();
      this.#clearSeachField();
    });
  }
  #clearSeachField() {
    this.#searchField.value = '';
  }
}
export default new SearchView();
import View from './View';
