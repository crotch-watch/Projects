export const state = {
  recipe: {},
};
export async function loadRecipe(recipeURL) {
  try {
    const res = await fetch(recipeURL);
    const data = await res.json();
    if (!res.ok) throw new Error(`\n ${data.message} (${res.status})`);
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
    alert(error);
  }
}
