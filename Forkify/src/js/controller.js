init();

function init() {
  recipeView.setSubscriber(controlRecipe);
  recipeView.setUpdateServingsSubscriber(controlServings);
  recipeView.setBookmarkSubscriber(controlBookmark);
  searchView.setSubscriber(controlSearchResults);
  paginationView.setSubscriber(controlPagination);
}

async function controlRecipe() {
  const recipeID = window.location.hash.slice(1);
  if (!recipeID) return;
  recipeView.renderLoadingSpinner();
  resultsView.update(model.getPaginatedResults());
  const baseURL = getURL(API_URL);
  const recipeURL = baseURL(recipeID);
  bookmarksView.update(model.state.bookmarks);
  try {
    await model.loadRecipe(recipeURL);
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
    console.log(error);
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
  recipeView.update(recipe);
  bookmarksView.render(bookmarks);
}

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { API_URL } from './config.js';
import { getURL } from './helpers.js';
import * as model from './model.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

if (module.hot) {
  module.hot.accept();
}
