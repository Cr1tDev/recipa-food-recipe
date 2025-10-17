const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const TIMEOUT = 10000;
const DEV_MODE = true;
const FALLBACK_IMAGE =
  'https://via.placeholder.com/520x370?text=No+Image+Available';

// Your chosen categories (TheMealDB categories are title-cased when used in URLs)
const CATEGORIES = ['Breakfast', 'Starter', 'Dessert', 'Side'];

// ------------------ Helper Functions ------------------
const log = (...args) => DEV_MODE && console.log('[model]', ...args);

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error('Request timeout');
    throw error;
  }
};

const setLoading = (model, isLoading) => (model.state.loading = isLoading);
const setError = (model, message) => (model.state.error = message);

// Utility: normalize ingredient name for image URL
const ingredientImageUrl = name =>
  name
    ? `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
        name
      )}.png`
    : null;

// Utility: build ingredients array from meal details
const buildIngredients = meal => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({
        name: ing.trim(),
        measure: (measure || '').trim(),
        image: ingredientImageUrl(ing.trim()),
      });
    }
  }
  return ingredients;
};

// Utility: map TheMealDB meal object to our "recipe" shape
const mapMealToRecipe = meal => {
  if (!meal) return null;
  const ingredients = buildIngredients(meal);
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb || FALLBACK_IMAGE,
    category: meal.strCategory || null,
    area: meal.strArea || null,
    tags: meal.strTags ? meal.strTags.split(',') : [],
    instructions: meal.strInstructions || '',
    ingredients,
    dishTypes: meal.strCategory ? [meal.strCategory.toLowerCase()] : [],
    // TheMealDB doesn't provide ready time or servings; keep safe defaults
    readyInMinutes: null,
    servings: null,
    // raw meal object for advanced use
    raw: meal,
  };
};

// ------------------ Main Model Object ------------------

export const model = {
  state: {
    recipes: [],
    currentRecipe: null,
    searchResults: [],
    categories: CATEGORIES.map(c => c.toLowerCase()),
    loading: false,
    error: null,
  },

  async getRandomRecipes(number = 4) {
    // Balanced selection: sample roughly equally from categories
    try {
      log('getRandomRecipes start — number:', number);
      setLoading(this, true);
      setError(this, null);

      // Fetch list (brief) for each category
      const categoryLists = await Promise.all(
        CATEGORIES.map(async cat => {
          const url = `${BASE_URL}/filter.php?c=${encodeURIComponent(cat)}`;
          const json = await fetchWithTimeout(url);
          return json?.meals || [];
        })
      );

      // Flatten and pick randomized unique ids fairly across categories
      const pool = [];
      categoryLists.forEach((list, idx) => {
        // add category tag to each item for potential use
        list.forEach(m => pool.push({ ...m, __category: CATEGORIES[idx] }));
      });

      if (pool.length === 0) {
        log('No meals found in category lists — falling back to random.php');
        // fallback: call random.php multiple times
        const fallbackMeals = [];
        for (let i = 0; i < number; i++) {
          const json = await fetchWithTimeout(`${BASE_URL}/random.php`);
          if (json?.meals?.[0])
            fallbackMeals.push(mapMealToRecipe(json.meals[0]));
        }
        this.state.recipes = fallbackMeals;
        return this.state.recipes;
      }

      // Shuffle pool
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      // Choose up to `number` unique meal IDs, trying to be fair by category
      const chosenIds = new Set();
      const chosen = [];
      let idx = 0;
      while (chosen.length < number && idx < pool.length) {
        const item = pool[idx];
        if (!chosenIds.has(item.idMeal)) {
          chosenIds.add(item.idMeal);
          chosen.push(item.idMeal);
        }
        idx++;
      }

      // Fetch full details for each chosen id
      const details = await Promise.all(
        Array.from(chosenIds).map(async id => {
          const json = await fetchWithTimeout(`${BASE_URL}/lookup.php?i=${id}`);
          return json?.meals?.[0] ? mapMealToRecipe(json.meals[0]) : null;
        })
      );

      // Filter non-null and set state
      this.state.recipes = details.filter(Boolean);
      log('getRandomRecipes loaded:', this.state.recipes.length);
      return this.state.recipes;
    } catch (error) {
      setError(this, error.message);
      log('getRandomRecipes error:', error);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  // ----- Search Recipes (by name) -----
  // Maps to: https://www.themealdb.com/api/json/v1/1/search.php?s={query}
  async searchRecipes(query) {
    try {
      log('searchRecipes:', query);
      setLoading(this, true);
      setError(this, null);

      const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
      const json = await fetchWithTimeout(url);
      const meals = json?.meals || [];

      // Map to recipe objects
      const results = meals.map(mapMealToRecipe);
      this.state.searchResults = results;
      log('searchRecipes results:', results.length);
      return this.state.searchResults;
    } catch (error) {
      setError(this, error.message);
      log('searchRecipes error:', error);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  // ----- Recipe Details (by id) -----
  // https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}
  async getRecipeById(id) {
    try {
      log('getRecipeById:', id);
      setLoading(this, true);
      setError(this, null);

      const url = `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`;
      const json = await fetchWithTimeout(url);
      const meal = json?.meals?.[0] || null;
      const recipe = mapMealToRecipe(meal);

      this.state.currentRecipe = recipe;
      log('getRecipeById loaded:', !!recipe);
      return recipe;
    } catch (error) {
      setError(this, error.message);
      log('getRecipeById error:', error);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  // ----- Recipes By Category -----
  // https://www.themealdb.com/api/json/v1/1/filter.php?c={Category}
  // returns brief items; we lookup details for each selected item.
  async getRecipesByCategory(category, number = 12) {
    try {
      log('getRecipesByCategory:', category, 'number:', number);
      setLoading(this, true);
      setError(this, null);

      // TheMealDB categories are Title Case (attempt to normalize)
      const catName =
        category && typeof category === 'string'
          ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
          : category;

      const url = `${BASE_URL}/filter.php?c=${encodeURIComponent(catName)}`;
      const json = await fetchWithTimeout(url);
      const meals = json?.meals || [];

      if (meals.length === 0) {
        log('No meals in category:', catName);
        this.state.searchResults = [];
        return [];
      }

      // pick up to `number` random items from meals
      const shuffled = meals.sort(() => 0.5 - Math.random()).slice(0, number);
      const details = await Promise.all(
        shuffled.map(async m => {
          const j = await fetchWithTimeout(
            `${BASE_URL}/lookup.php?i=${m.idMeal}`
          );
          return j?.meals?.[0] ? mapMealToRecipe(j.meals[0]) : null;
        })
      );

      const cleaned = details.filter(Boolean);
      log(`getRecipesByCategory loaded ${cleaned.length} items for ${catName}`);
      return cleaned;
    } catch (error) {
      setError(this, error.message);
      log('getRecipesByCategory error:', error);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  // ----- Similar Recipes (fallback) -----
  // Attempt: look up this meal, then return other meals from same category
  async getSimilarRecipes(id, number = 4) {
    try {
      log('getSimilarRecipes for id:', id);
      setLoading(this, true);
      setError(this, null);

      const json = await fetchWithTimeout(
        `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`
      );
      const meal = json?.meals?.[0];
      if (!meal) return [];

      const category = meal.strCategory;
      if (!category) return [];

      // get category list (filter)
      const catJson = await fetchWithTimeout(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      let list = catJson?.meals || [];

      // remove the original id and shuffle
      list = list
        .filter(m => m.idMeal !== id)
        .sort(() => 0.5 - Math.random())
        .slice(0, number);

      const details = await Promise.all(
        list.map(async m => {
          const j = await fetchWithTimeout(
            `${BASE_URL}/lookup.php?i=${m.idMeal}`
          );
          return j?.meals?.[0] ? mapMealToRecipe(j.meals[0]) : null;
        })
      );

      return details.filter(Boolean);
    } catch (error) {
      setError(this, error.message);
      log('getSimilarRecipes error:', error);
      return []; // safe fallback
    } finally {
      setLoading(this, false);
    }
  },

  // ----- Nutrition Info (NOT supported) -----
  // TheMealDB doesn't provide nutrition; return safe fallback
  async getRecipeNutrition(id) {
    log('getRecipeNutrition called for id:', id);
    return {
      available: false,
      message: 'Nutrition information is not available from TheMealDB.',
    };
  },

  // ----- Autocomplete (best-effort) -----
  // Best-effort: use search endpoint and return matching meal names
  async getAutocomplete(query, number = 5) {
    try {
      log('getAutocomplete:', query);
      if (!query || !query.trim()) return [];
      const url = `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
      const json = await fetchWithTimeout(url);
      const meals = json?.meals || [];
      const names = meals.map(m => m.strMeal).slice(0, number);
      return names;
    } catch (error) {
      log('getAutocomplete error:', error);
      return [];
    }
  },

  // ----- Search by Ingredients -----
  // Approach: fetch filter.php?i={ingredient} for the first ingredient, then verify others by lookup
  async getRecipesByIngredients(ingredients = [], number = 12) {
    try {
      log('getRecipesByIngredients:', ingredients);
      setLoading(this, true);
      setError(this, null);

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return [];
      }

      const first = ingredients[0].trim();
      const url = `${BASE_URL}/filter.php?i=${encodeURIComponent(first)}`;
      const json = await fetchWithTimeout(url);
      const candidates = json?.meals || [];

      if (candidates.length === 0) {
        log('No candidates for ingredient:', first);
        return [];
      }

      const results = [];
      for (let i = 0; i < candidates.length && results.length < number; i++) {
        const c = candidates[i];
        const detailJson = await fetchWithTimeout(
          `${BASE_URL}/lookup.php?i=${c.idMeal}`
        );
        const meal = detailJson?.meals?.[0];
        if (!meal) continue;

        // Check that meal contains all requested ingredients
        const mealIngredients = buildIngredients(meal).map(it =>
          it.name.toLowerCase()
        );
        const allMatch = ingredients.every(ing =>
          mealIngredients.includes(ing.toLowerCase())
        );
        if (allMatch) {
          results.push(mapMealToRecipe(meal));
        }
      }

      log('getRecipesByIngredients resultCount:', results.length);
      return results;
    } catch (error) {
      setError(this, error.message);
      log('getRecipesByIngredients error:', error);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },

  // ----- State Helpers -----
  clearCurrentRecipe() {
    this.state.currentRecipe = null;
  },

  clearSearchResults() {
    this.state.searchResults = [];
  },

  clearState() {
    this.state.recipes = [];
    this.state.currentRecipe = null;
    this.state.searchResults = [];
    this.state.error = null;
  },

  // ----- Internal Request Wrapper (keeps same pattern) -----
  async _handleRequest(url, onSuccess) {
    try {
      setLoading(this, true);
      setError(this, null);

      const data = await fetchWithTimeout(url);
      if (onSuccess) onSuccess(data);

      return data;
    } catch (error) {
      setError(this, error.message);
      log('_handleRequest error:', error);
      throw error;
    } finally {
      setLoading(this, false);
    }
  },
};

export default model;
