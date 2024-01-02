const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const BASE_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
const baseURL = getURL(BASE_URL);
const bindWindowListener = windowEventListeners('load', 'hashchange');
bindWindowListener(controlRecipe);

import * as model from './model.js';
import recipeView from './views/recipeView.js';

async function controlRecipe() {
  const recipeID = window.location.hash.slice(1);
  if (!recipeID) return;
  recipeView.renderLoadingSpinner();
  const recipeURL = baseURL(recipeID);
  try {
    await model.loadRecipe(recipeURL);
    recipeView.render(model.state.recipe);
  } catch (e) {
    alert(e);
  }
}

function getURL(URL) {
  return function (extension) {
    return URL + extension;
  };
}

function windowEventListeners(...events) {
  return function (callbackFn) {
    events.forEach(event => window.addEventListener(event, callbackFn));
  };
}
