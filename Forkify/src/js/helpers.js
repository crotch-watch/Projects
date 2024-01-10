export async function AJAX(resource, options) {
  try {
    const res = await fetch(resource, options);
    const data = await res.json();
    if (!res.ok) throw new Error(`\n ${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
}
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export function windowEventListeners(...events) {
  return function (callbackFn) {
    events.forEach(event => window.addEventListener(event, callbackFn));
  };
}
export function getURL(URL) {
  return function (extension) {
    return URL + extension;
  };
}
export function bindCallbacks(...callbacks) {
  return function (...args) {
    callbacks.forEach(callback => args.forEach(arg => callback(arg)));
  };
}
export function createRecipeObject(recipe) {
  return {
    title: recipe.title,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    publisher: recipe.publisher,
    cookingTime: +recipe.cooking_time,
    servings: +recipe.servings,
    ingredients: recipe.ingredients,
    id: recipe.id,
    key: recipe.key,
  };
}
