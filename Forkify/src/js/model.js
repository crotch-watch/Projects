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
const globalCache = {
  cache: { [RECIPE_CACHE_KEY]: [], [SEARCH_RESULTS_CACHE_KEY]: [] },
};

init();

function init() {
  const persistentData = localStorage.getItem('bookmarks');
  if (persistentData) state.bookmarks = JSON.parse(persistentData);
  handleCaching();
}
function handleCaching() {
  const { cache } = globalCache;
  CACHE_KEYS.forEach(key => {
    initCacheInstance(cache, key);
    clearCacheInstances(key);
  });
}
function initCacheInstance(cache, cacheKey) {
  const browserCache = localStorage.getItem(cacheKey);
  if (browserCache) {
    cache[cacheKey] = JSON.parse(browserCache);
    return;
  }
  localStorage.setItem(cacheKey, JSON.stringify(cache[cacheKey]));
}
function clearCacheInstances(key) {
  setTimeout(() => {
    localStorage.removeItem(key);
  }, CACHE_CLEAR_INTERVAL);
}
export async function loadRecipe(recipeID) {
  const { cache } = globalCache;
  const { recipes } = cache;
  const cachedRecipe = checkCachedRecipe(recipes, recipeID);
  if (cachedRecipe) {
    state.recipe = cachedRecipe;
    return;
  }
  const baseURL = getURL(API_URL);
  const recipeURL = baseURL(recipeID);
  try {
    const data = await Promise.race([AJAX(recipeURL + '?key=' + API_KEY), timeout(REQUEST_TIMEOUT_S)]);
    const { recipe } = data.data;
    const formattedRecipe = createRecipeObject(recipe);
    state.recipe = formattedRecipe;
    const isBookmarked = state.bookmarks.some(bookmarkedRecipe => bookmarkedRecipe.id === recipe.id);
    state.recipe.bookmarked = isBookmarked;
    // adding to cache
    recipes.push(formattedRecipe);
    localStorage.setItem(RECIPE_CACHE_KEY, JSON.stringify(recipes));
  } catch (error) {
    throw error;
  }
}
function checkCachedRecipe(cachedRecipes, recipeID) {
  // if user loads '/' we return;
  const noRecipeID = !recipeID.trim();
  if (noRecipeID) return;
  if (!cachedRecipes.length) return;
  const cachedRecipe = cachedRecipes.find(recipe => recipe.id === recipeID);
  if (cachedRecipe) return cachedRecipe;
}
export async function fetchSearchResults(searchQuery) {
  try {
    const { search } = state;
    const { searchResults } = globalCache.cache;
    const cachedResults = checkCachedSearchResults(searchResults, searchQuery);
    if (cachedResults) {
      search.results = cachedResults;
      return;
    }
    search.query = searchQuery;
    const data = await AJAX(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}&key=${API_KEY}`);
    const { recipes } = data.data;
    const formattedResults = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      key: recipe.key,
    }));
    search.results = formattedResults;
    search.currentPage = INITIAL_PAGE;
    searchResults.push({ searchQuery: searchQuery.toLowerCase(), results: formattedResults });
    localStorage.setItem(SEARCH_RESULTS_CACHE_KEY, JSON.stringify(searchResults));
  } catch (error) {
    throw error;
  }
}

function checkCachedSearchResults(cachedSearchResults, searchQuery) {
  if (!cachedSearchResults.length) return;
  const cachedResult = cachedSearchResults.find(result => result.searchQuery === searchQuery.toLowerCase());
  if (!cachedResult) return;
  return cachedResult.results;
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
    ingredient.quantity = ((servings / recipe.servings) * ingredient.quantity).toFixed(2);
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
  state.recipe.bookmarked = false;
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
        const ingredientInfo = value.split(',').map(info => info.trim());
        if (ingredientInfo.length !== 3) throw new Error('Please insert 3 values separated with a comma :)');
        let [quantity, unit, description] = ingredientInfo;
        quantity = parseFloat(quantity);
        if (!Number.isFinite(quantity)) throw new Error('Quantity must be a number :)');
        return { quantity: quantity ? quantity : null, unit, description };
      });
    const recipeToUpload = {
      title: recipe.title,
      source_url: recipe.sourceURL,
      image_url: recipe.image,
      publisher: recipe.publisher,
      cooking_time: recipe.cookingTime,
      servings: recipe.servings,
      ingredients,
    };
    const apiKeyURL = API_URL + '?key=' + API_KEY;
    const options = {
      body: JSON.stringify(recipeToUpload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = await AJAX(apiKeyURL, options);
    const { recipe: uploadedRecipe } = data.data;
    state.recipe = createRecipeObject(uploadedRecipe);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}

import {
  API_KEY,
  API_URL,
  CACHE_CLEAR_INTERVAL,
  RECIPE_CACHE_KEY,
  INITIAL_PAGE,
  INITIAL_TOTAL_PAGES,
  REQUEST_TIMEOUT_S,
  RESULTS_PER_PAGE,
  SEARCH_RESULTS_CACHE_KEY,
  CACHE_KEYS,
} from './config';
import { AJAX, createRecipeObject, getURL, timeout } from './helpers';

// areas where caching may be useful
// API call
// loadRecipe checks in cache and if required data is absent then make a network request.
