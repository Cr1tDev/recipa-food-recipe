const FALLBACK_IMAGE =
  'https://via.placeholder.com/520x370?text=No+Image+Available';

export const ingredientImageUrl = name =>
  name
    ? `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
        name
      )}.png`
    : null;

export const buildIngredients = meal => {
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

export const mapMealToRecipe = meal => {
  if (!meal) return null;

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb || FALLBACK_IMAGE,
    category: meal.strCategory.toLowerCase() || null,
    area: meal.strArea || null,
    description: meal.strMeal
      ? `${meal.strMeal} is a delicious dish from ${
          meal.strArea || 'unknown origin'
        }.`
      : 'No description available.',
    instructions: meal.strInstructions || 'No instructions available.',
    ingredients: buildIngredients(meal),
  };
};
