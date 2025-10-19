class FeaturedView {
  _parentEl = document.querySelector('.featured');

  render() {
    const markup = this._generateMarkup();
    this._parentEl.innerHTML = markup;
  }

  _generateMarkup() {
    return `
      <div class="featured__container">
        <div class="featured__grid">
          <div class="featured__header">
            <div class="tag">
              <span class="tag__bullet" aria-hidden="true"></span>
              <span class="tag__text">Featured on</span>
            </div>
          </div>

          <div class="featured__logos" role="list" aria-label="Media partners">
            <img class="featured__logo" src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6554e9936483aff6a6fb2495_logo-3.svg" alt="Media partner 1 logo" width="140" height="auto" loading="lazy" role="listitem"/>
            <img class="featured__logo" src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6554e993ba9b6474c62e713e_logo-5.svg" alt="Media partner 2 logo" width="130" height="auto" loading="lazy" role="listitem"/>
            <img class="featured__logo" src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6554e997d16ce48b7668f9f7_logo-1.svg" alt="Media partner 3 logo" width="120" height="auto" loading="lazy" role="listitem"/>
            <img class="featured__logo" src="https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6554e9958709782214641d0d_logo-9.svg" alt="Media partner 4 logo" width="110" height="auto" loading="lazy" role="listitem"/>
          </div>
        </div>
      </div>
    `;
  }
}

export default new FeaturedView();
