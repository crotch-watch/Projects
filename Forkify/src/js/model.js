export const state = {
  recipe: {},
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
