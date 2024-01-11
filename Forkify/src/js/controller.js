init();

function init() {
  bookmarksView.setWindowLoadSub(preloadBookmarks);
  recipeView.setSubscriber(controlRecipe);
  recipeView.setUpdateServingsSubscriber(controlServings);
  recipeView.setBookmarkSubscriber(controlBookmark);
  searchView.setSubscriber(controlSearchResults);
  paginationView.setSubscriber(controlPagination);
  addRecipeView.setClickAddRecipeSub();
  addRecipeView.setFormCloseSub();
  addRecipeView.setFormSubmitSub(controlRecipeSubmit);
}

async function controlRecipe() {
  const recipeID = window.location.hash.slice(1);
  if (!recipeID) return;
  recipeView.renderLoadingSpinner();
  resultsView.update(model.getPaginatedResults());
  bookmarksView.update(model.state.bookmarks);
  try {
    await model.loadRecipe(recipeID);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderErrorMessage();
  }
}
async function controlSearchResults() {
  try {
    const { searchQuery } = searchView;
    if (!searchQuery.trim().length) return;
    resultsView.renderLoadingSpinner();
    await model.fetchSearchResults(searchQuery);
    const searchResults = model.getPaginatedResults();
    resultsView.render(searchResults);
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderErrorMessage(error.message);
  }
}
function controlPagination(page) {
  const paginatedResults = model.getPaginatedResults(page);
  resultsView.render(paginatedResults);
  paginationView.render(model.state.search);
}
function controlServings(servings) {
  model.updateServingsTo(servings);
  recipeView.update(model.state.recipe);
}
function controlBookmark() {
  const { recipe, bookmarks } = model.state;
  if (!recipe.bookmarked) model.addBookmark(recipe);
  else model.removeBookmark(recipe);
  recipeView.update(model.state.recipe);
  try {
    bookmarksView.render(bookmarks);
  } catch (error) {
    bookmarksView.renderErrorMessage();
  }
}
function preloadBookmarks() {
  try {
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    bookmarksView.renderErrorMessage();
  }
}
async function controlRecipeSubmit(recipe) {
  try {
    await model.uploadRecipe(recipe);
    addRecipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, SUCCESS_MODAL_S);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    addRecipeView.renderErrorMessage(error.message);
  }
}

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { API_KEY, API_URL, SUCCESS_MODAL_S } from './config.js';
import { AJAX, getURL } from './helpers.js';
import * as model from './model.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}
