export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    currentPage: INITIAL_PAGE,
    totalPages: INITIAL_TOTAL_PAGES,
  },
  bookmarks: [],
};

init();

function init() {
  const persistentData = localStorage.getItem('bookmarks');
  if (persistentData) state.bookmarks = JSON.parse(persistentData);
}

export async function loadRecipe(recipeURL) {
  try {
    const data = await Promise.race([parseRequest(recipeURL), timeout(REQUEST_TIMEOUT_S)]);
    const { recipe } = data.data;
    const isBookmarked = state.bookmarks.some(bookmarkedRecipe => bookmarkedRecipe.id === recipe.id);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      bookmarked: isBookmarked,
    };
  } catch (error) {
    throw error;
  }
}
export async function fetchSearchResults(searchQuery) {
  try {
    const { search } = state;
    search.query = searchQuery;
    const data = await parseRequest(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}`);
    const { recipes } = data.data;
    search.results = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    }));
    search.currentPage = INITIAL_PAGE;
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
export function addBookmark(recipe) {
  const { bookmarks } = state;
  if (!bookmarks.length || !bookmarks.some(bookmark => bookmark.id === recipe.id)) {
    bookmarks.push(recipe);
    state.recipe.bookmarked = true;
    persistBookmarks();
  }
}
export function removeBookmark(recipe) {
  const { bookmarks } = state;
  const startIndex = bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
  const DELETE_COUNT = 1;
  bookmarks.splice(startIndex, DELETE_COUNT);
  state.recipe.Bookmarked = false;
  persistBookmarks();
}
export function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export async function uploadRecipe(recipe) {
  try {
    const ingredients = Object.entries(recipe)
      .filter(entry => {
        const [key, value] = entry;
        if (key.startsWith('ingredient') && value) return true;
        return false;
      })
      .map(([key, value]) => {
        const ingredientInfo = value.replaceAll(' ', '').split(',');
        if (ingredientInfo.length !== 3) throw new Error('Please insert 3 values separated with a comma :)');
        let [quantity, unit, description] = value.replaceAll(' ', '').split(',');
        quantity = parseFloat(quantity);
        if (!Number.isFinite(quantity)) throw new Error('Quantity must be a number :)');
        return { quantity: quantity ? quantity : null, unit, description };
      });
    const recipeToUpload = {
      title: recipe.title,
      source_url: recipe.sourceURL,
      image_url: recipe.image,
      publisher: recipe.publisher,
      cooking_time: +recipe.cookingTime,
      servings: +recipe.servings,
      ingredients,
    };
    const baseURL = getURL(API_URL);
    const keyQueryParam = getURL('')('?key=');
    const apiKeyURL = baseURL(keyQueryParam);

    const data = sendRequest(apiKeyURL, recipeToUpload);
  } catch (error) {
    throw error;
  }
}

import { API_KEY, API_URL, INITIAL_PAGE, INITIAL_TOTAL_PAGES, REQUEST_TIMEOUT_S, RESULTS_PER_PAGE } from './config';
import { getURL, parseRequest, sendRequest, timeout } from './helpers';
