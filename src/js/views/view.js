import spinnerIcon from 'url:../../img/spinnerIcon.svg';

class View {
  // =======================
  // DOM Element References
  // =======================
  _recipesContainer = null;
  _categoriesContainer = null;
  _searchResults = null;
  _recipeDetail = null;

  _loader = null;
  _errorMessage = null;
  _searchForm = null;
  _searchInput = null;

  // =======================
  // Initialization
  // =======================
  initGetElement() {
    this._recipesContainer = document.querySelector('.recipes');
    this._categoriesContainer = document.querySelector('.categories');
    this._searchForm = document.querySelector('[data-search-form]');
    this._searchInput = document.querySelector('[data-search-input]');
  }

  // =======================
  // UI Helpers
  // =======================
  renderLoader(container) {
    const markup = `
      <div class="spinner">
        <svg class="spinner-icon">
          <use href="${spinnerIcon}#icon-loader"></use>
        </svg>
      </div>
    `;
    if (container) container.innerHTML = markup;
  }

  clearLoader(container) {
    const loader = container?.querySelector('.loader');
    if (loader) loader.remove();
  }

  renderError(message, container) {
    const markup = `
      <div class="error-message">
        <img src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6501c88eb0eaccde56b0c146_icon-menu.svg" alt="" class="error-message__icon" />
        <h3 class="error-message__title">Oops!</h3>
        <p class="error-message__text">${message}</p>
        <button class="button error-message__button" onclick="location.reload()">
          <span class="button__content">
            <span class="button__text">Try Again</span>
          </span>
        </button>
      </div>
    `;
    if (container) container.innerHTML = markup;
  }

  renderEmptyState(message, container) {
    const markup = `
      <div class="empty-state">
        <p class="empty-state__text">${message}</p>
      </div>
    `;
    if (container) container.innerHTML = markup;
  }

  clear(container) {
    if (container) container.innerHTML = '';
  }

  // =======================
  // Recipe Card Generator
  // =======================
  _generateRecipeCard(recipe) {
    const getCategoryInfo = () => {
      if (recipe.category?.includes('breakfast'))
        return {
          name: 'Breakfast',
          icon: 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e2d1ff8db94df5297188_icons8-bread-240.png',
          url: '/recipe-categories/breakfast',
        };
      if (
        recipe.category?.includes('lunch') ||
        recipe.category?.includes('main course')
      )
        return {
          name: 'Lunch',
          icon: 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e2f3fbcadab05d250a8b_icons8-pizza-240.png',
          url: '/recipe-categories/lunch',
        };
      if (recipe.category?.includes('dessert'))
        return {
          name: 'Dessert',
          icon: 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e33c6ae3d69baf126f5a_icons8-cake-240.png',
          url: '/recipe-categories/dessert',
        };
      if (
        recipe.category?.includes('side') ||
        recipe.category?.includes('drink')
      )
        return {
          name: 'Side',
          icon: 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e314a55677b935bd3113_icons8-the-toast-240.png',
          url: '/recipe-categories/drink',
        };
      return {
        name: 'Lunch',
        icon: 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e2f3fbcadab05d250a8b_icons8-pizza-240.png',
        url: '/recipes',
      };
    };

    const category = getCategoryInfo();
    const readyInMinutes = recipe.readyInMinutes || 30;
    const servings = recipe.servings || 4;
    const difficulty =
      readyInMinutes <= 20 ? 'Easy' : readyInMinutes <= 45 ? 'Medium' : 'Hard';
    const title = recipe.title || 'Delicious Recipe';
    const description = recipe.summary
      ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
      : "A delicious and nutritious recipe you'll love.";

    return `
      <article class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="recipe-card__badge">
          <a href="${category.url}" class="badge">
            <img
              class="badge__icon"
              src="${category.icon}"
              alt=""
              width="27"
              height="27"
            />
            <span class="badge__text">${category.name}</span>
          </a>
        </div>

        <a
          href="/recipe/${recipe.id}"
          class="recipe-card__link"
        >
          <div class="recipe-card__image-wrapper">
            <img
              class="recipe-card__image"
              src="${recipe.image}"
              alt="${title}"
              loading="lazy"
            />

            <div class="recipe-card__info">
              <div class="recipe-meta">
                <img
                  class="recipe-meta__icon"
                  src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/650300cba3d8f08049ff6aed_schedule_FILL0_wght300_GRAD0_opsz24.svg"
                  alt=""
                  width="27"
                  height="27"
                />
                <span class="recipe-meta__text">${readyInMinutes} Min</span>
              </div>

              <div class="recipe-meta">
                <img
                  class="recipe-meta__icon"
                  src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65030090282cb8dc8d551130_account_circle_FILL0_wght300_GRAD0_opsz24.svg"
                  alt=""
                  width="27"
                  height="27"
                />
                <span class="recipe-meta__text"
                  >${servings} Servings</span
                >
              </div>

              <div class="recipe-meta">
                <img
                  class="recipe-meta__icon"
                  src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65030140cda3526d9edcd88b_signal_cellular_alt_FILL0_wght300_GRAD0_opsz24.svg"
                  alt=""
                  width="27"
                  height="27"
                />
                <span class="recipe-meta__text">${difficulty}</span>
              </div>
            </div>
          </div>

          <div class="recipe-card__content">
            <h3 class="recipe-card__title">${title}</h3>
            <p class="recipe-card__description">
              ${description}
            </p>
            <div class="link-underline">
              <span class="link-underline__text"
                >View Recipe</span
              >
              <span class="link-underline__line"></span>
            </div>
          </div>
        </a>
      </article>

      
    `;
  }

  // =======================
  // Recipe List Rendering
  // =======================
  renderRecipes(recipes, container = this._recipesContainer) {
    if (!container) return;

    if (!recipes || recipes.length === 0) {
      this.renderError('No recipes found. Try a different search!', container);
      return;
    }

    container.innerHTML = recipes
      .map(recipe => this._generateRecipeCard(recipe))
      .join('');
  }

  renderCategories(categories) {
    if (!this._categoriesContainer) return;

    const categoryIcons = {
      breakfast:
        'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e2d1ff8db94df5297188_icons8-bread-240.png',
      lunch:
        'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e2f3fbcadab05d250a8b_icons8-pizza-240.png',
      side: 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e314a55677b935bd3113_icons8-the-toast-240.png',
      dessert:
        'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c089/6502e33c6ae3d69baf126f5a_icons8-cake-240.png',
    };

    const markup = categories
      .map(
        cat => `
        <article class="category-card">
          <a
            href="/recipe-categories/${cat}"
            class="category-card__link"
            data-link
          >
            <img
              class="category-card__icon"
              src="${categoryIcons[cat.toLowerCase()]}"
              alt="${cat} icon"
              width="60"
              height="60"
            />
            <h3 class="category-card__title">${
              cat.charAt(0).toUpperCase() + cat.slice(1)
            }</h3>
          </a>
        </article>
      `
      )
      .join('');

    this._categoriesContainer.innerHTML = markup;
  }

  // =======================
  // Event Handlers
  // =======================
  addRecipeClickHandler(handler) {
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-recipe-link]');
      if (!link) return;
      e.preventDefault();
      handler(link.dataset.recipeLink);
    });
  }

  addCategoryClickHandler(handler) {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-category]');
      if (!btn) return;
      e.preventDefault();
      handler(btn.dataset.category);
    });
  }

  addSearchHandler(handler) {
    this._searchForm?.addEventListener('submit', e => {
      e.preventDefault();
      const query = this._searchInput?.value.trim();
      if (query) handler(query);
    });
  }
}

export default new View();
