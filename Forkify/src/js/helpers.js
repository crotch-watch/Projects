export async function parseRequest(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(`\n ${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
}
export async function sendRequest(url, payload) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = res.json();
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
    source_url: recipe.sourceURL,
    image_url: recipe.image,
    publisher: recipe.publisher,
    cooking_time: +recipe.cookingTime,
    servings: +recipe.servings,
    ingredients,
  };
}
