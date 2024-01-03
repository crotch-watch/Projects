// https://forkify-api.herokuapp.com/v2

init();

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

function init() {
  recipeView.setSubscriber(controlRecipe);
}

import { API_URL } from './config.js';
import { getURL } from './helpers.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
