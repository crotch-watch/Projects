export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    currnetPage: INITIAL_PAGE,
  },
};

export async function loadRecipe(recipeURL) {
  try {
    const data = await Promise.race([parseRequest(recipeURL), timeout(REQUEST_TIMEOUT_S)]);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    throw error;
  }
}
export async function fetchSearchResults(searchQuery) {
  try {
    state.search.query = searchQuery;
    const data = await parseRequest(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}`);
    const { recipes } = data.data;
    state.search.results = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    }));
  } catch (error) {
    throw error;
  }
}
export function getSearchResultsPage(page = state.search.currnetPage) {
  if (!Number.isFinite(page) || page < INITIAL_PAGE) return;
  state.search.currnetPage = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

import { INITIAL_PAGE, REQUEST_TIMEOUT_S, RESULTS_PER_PAGE } from './config';
import { parseRequest, timeout } from './helpers';
