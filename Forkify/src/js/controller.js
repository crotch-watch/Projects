init();

function init() {
  recipeView.setSubscriber(controlRecipe);
  searchView.setSubscriber(controlSearchResults);
  paginationView.setSubscriber(controlPagination);
}

async function controlRecipe() {
  const recipeID = window.location.hash.slice(1);
  if (!recipeID) return;
  recipeView.renderLoadingSpinner();
  const baseURL = getURL(API_URL);
  const recipeURL = baseURL(recipeID);
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
    resultsView.renderErrorMessage(error.message);
  }
}
function controlPagination(page) {
  const paginatedResults = model.getPaginatedResults(page);
  resultsView.render(paginatedResults);
  paginationView.render(model.state.search);
}

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import { API_URL } from './config.js';
import { getURL } from './helpers.js';
import * as model from './model.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

if (module.hot) {
  module.hot.accept();
}
