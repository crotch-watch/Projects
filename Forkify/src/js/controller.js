init();

function init() {
  recipeView.setSubscriber(controlRecipe);
  searchView.setSubscriber(controlSearchResults);
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
    const searchResults = model.state.search.results;
    resultsView.render(searchResults);
  } catch (error) {
    resultsView.renderErrorMessage(error.message)
  }
}

import { API_URL } from './config.js';
import { getURL } from './helpers.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

if(module.hot) {
  module.hot.accept()
}
