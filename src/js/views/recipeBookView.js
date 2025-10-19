class RecipeBook {
  _parentEl = document.querySelector('.promo-section');

  render() {
    const markup = this._generateMarkup();
    this._parentEl.innerHTML = markup;
  }

  _generateMarkup() {
    return `
      <div class="promo-section__container">
        <div class="promo-card">
          <div class="promo-card__content">
            <div class="tag tag--light">
              <span class="tag__bullet tag__bullet--light" aria-hidden="true"></span>
              <span class="tag__text tag__text--light">Shop my premium recipe</span>
            </div>

            <h2 class="promo-card__title">
              Discover and indulge in my exclusive collection of gourmet recipes.
            </h2>

            <div class="promo-card__action">
              <a href="/plans-ecommerce" class="button button--light">
                <span class="button__content">
                  <span class="button__text">Shop Now</span>
                  <span class="button__icon-wrapper">
                    <img
                      class="button__icon"
                      src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6503134eb1cb19fd7ad46347_arrow-white.svg"
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />
                  </span>
                </span>
              </a>
            </div>
          </div>

          <figure class="promo-card__figure">
            <img
              class="promo-card__image"
              src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/650429de5a44aaaaccaf56e2_book.png"
              alt="Premium recipe book"
              width="492"
              loading="lazy"
              srcset="
                https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/650429de5a44aaaaccaf56e2_book-p-500.png 500w,
                https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/650429de5a44aaaaccaf56e2_book-p-800.png 800w,
                https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/650429de5a44aaaaccaf56e2_book.png 984w
              "
            />
          </figure>
        </div>
      </div>
    `;
  }
}

export default new RecipeBook();
