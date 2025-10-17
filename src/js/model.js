// model.js
import { fetchWithTimeout, setLoading, setError } from './helpers.js';
import { mapMealToRecipe, buildIngredients } from './utilities.js';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const CATEGORIES = ['breakfast', 'lunch', 'dessert', 'side'];

export const model = {
  state: {
    recipes: [],
    currentRecipe: null,
    searchResults: [],
    categories: CATEGORIES,
    loading: false,
    error: null,
  },

  async getRandomRecipes(number = 4) {
    try {
      setLoading(this, true);
      setError(this, null);

      const results = [];

      for (let i = 0; i < number; i++) {
        const json = await fetchWithTimeout(`${BASE_URL}/random.php`);
        if (json?.meals?.[0]) results.push(mapMealToRecipe(json.meals[0]));
      }

      this.state.recipes = results;
      return results;
    } catch (error) {
      setError(this, error.message);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  async searchRecipes(query) {
    try {
      setLoading(this, true);
      setError(this, null);

      const json = await fetchWithTimeout(`${BASE_URL}/search.php?s=${query}`);
      this.state.searchResults = (json.meals || []).map(mapMealToRecipe);
      return this.state.searchResults;
    } catch (error) {
      setError(this, error.message);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  async getRecipeById(id) {
    try {
      setLoading(this, true);
      setError(this, null);

      const json = await fetchWithTimeout(`${BASE_URL}/lookup.php?i=${id}`);
      this.state.currentRecipe = mapMealToRecipe(json?.meals?.[0]);
      return this.state.currentRecipe;
    } catch (error) {
      setError(this, error.message);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  async getRecipesByCategory(category, number = 12) {
    try {
      setLoading(this, true);
      setError(this, null);

      const catName = category.charAt(0).toUpperCase() + category.slice(1);
      const json = await fetchWithTimeout(
        `${BASE_URL}/filter.php?c=${catName}`
      );

      const details = await Promise.all(
        (json.meals || [])
          .slice(0, number)
          .map(meal =>
            fetchWithTimeout(`${BASE_URL}/lookup.php?i=${meal.idMeal}`)
          )
      );

      return details.map(d => mapMealToRecipe(d.meals[0]));
    } catch (error) {
      setError(this, error.message);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  async getRecipesByIngredients(ingredients = [], number = 6) {
    try {
      setLoading(this, true);
      setError(this, null);

      const firstIngredient = ingredients[0];
      const json = await fetchWithTimeout(
        `${BASE_URL}/filter.php?i=${firstIngredient}`
      );

      const results = [];
      for (let meal of json.meals || []) {
        const d = await fetchWithTimeout(
          `${BASE_URL}/lookup.php?i=${meal.idMeal}`
        );
        const mapped = mapMealToRecipe(d.meals[0]);
        const productIngredients = buildIngredients(d.meals[0]).map(i =>
          i.name.toLowerCase()
        );

        if (
          ingredients.every(ing =>
            productIngredients.includes(ing.toLowerCase())
          )
        ) {
          results.push(mapped);
        }
        if (results.length >= number) break;
      }
      return results;
    } catch (error) {
      setError(this, error.message);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },
};

export default model;
