import bookImg from 'url:../../img/book.webp';

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
            <custom-tag tagname="Shop my premium recipe" position="right" color="light"></custom-tag>

            <h2 class="promo-card__title">
              Discover and indulge in my exclusive collection of gourmet recipes.
            </h2>

            <div class="promo-card__action">
              <custom-button text="Contact Me" color="light" href="./pages/contact.html"></custom-button>
            </div>
          </div>

          <figure class="promo-card__figure">
            <img
              class="promo-card__image"
              src="${bookImg || ''}"
              alt="Premium recipe book"
              width="492"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    `;
  }
}

export default new RecipeBook();
