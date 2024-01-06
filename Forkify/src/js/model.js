export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    currentPage: INITIAL_PAGE,
    totalPages: INITIAL_TOTAL_PAGES,
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
export function getPaginatedResults(page = state.search.currentPage) {
  if (!Number.isFinite(page) || page < INITIAL_PAGE) return;
  const { search } = state;
  const { results, resultsPerPage } = search;
  const resultsLength = results.length;
  if (resultsLength <= resultsPerPage) return results;
  search.totalPages = Math.ceil(resultsLength / resultsPerPage);
  search.currentPage = page;
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  return results.slice(start, end);
}
export function updateServingsTo(servings) {
  const { recipe } = state;
  recipe.ingredients.forEach(ingredient => {
    ingredient.quantity = (servings / recipe.servings) * ingredient.quantity;
  });
  recipe.servings = servings;
}

import { INITIAL_PAGE, INITIAL_TOTAL_PAGES, REQUEST_TIMEOUT_S, RESULTS_PER_PAGE } from './config';
import { parseRequest, timeout } from './helpers';
