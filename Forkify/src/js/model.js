export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};
import { REQUEST_TIMEOUT_S } from './config';
import { parseRequest, timeout } from './helpers';
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
