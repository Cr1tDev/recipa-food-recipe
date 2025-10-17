// controller.js
import model from './model.js';
import view from './view.js';

const controlLoadRandomRecipes = async function () {
  try {
    view.renderLoader(view._recipesContainer); // Show loader
    await model.getRandomRecipes(6); // Fetch from Spoonacular
    console.log('Random recipes:', model.state.recipes); // ✅ console output
    view.renderRecipes(model.state.recipes);
  } catch (err) {
    console.error(err);
    view.renderError(
      'Failed to load recipes. Please try again!',
      view._recipesContainer
    );
  }
};

const controlSearchRecipes = async function (query) {
  try {
    view.renderLoader(view._recipesContainer);
    await model.searchRecipes(query);
    console.log('Search results:', model.state.searchResults); // ✅ console output
    view.renderRecipes(model.state.searchResults);
  } catch (err) {
    console.error(err);
    view.renderError('Search failed. Try again!', view._recipesContainer);
  }
};

const controlCategoryRecipes = async function (category) {
  try {
    view.renderLoader(view._recipesContainer);
    const results = await model.getRecipesByCategory(category);
    console.log(`Category (${category}) recipes:`, results); // ✅ console output
    view.renderRecipes(results);
  } catch (err) {
    console.error(err);
    view.renderError(
      `Failed to load ${category} recipes.`,
      view._recipesContainer
    );
  }
};

const controlRecipeDetails = async function (id) {
  try {
    console.log('Fetching recipe details for ID:', id);
    await model.getRecipeById(id);
    console.log('Recipe details:', model.state.currentRecipe); // ✅ console output
    alert(`Recipe loaded in console: ${model.state.currentRecipe.title}`);
  } catch (err) {
    console.error(err);
  }
};

export const init = function () {
  view.initGetElement();
  view.renderCategories(model.state.categories);

  // Add event listeners
  view.addSearchHandler(controlSearchRecipes);
  view.addCategoryClickHandler(controlCategoryRecipes);
  view.addRecipeClickHandler(controlRecipeDetails);

  // Load homepage recipes
  controlLoadRandomRecipes();
};
