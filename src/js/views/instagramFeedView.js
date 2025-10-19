class InstagramFeedView {
  parentEl = document.querySelector('.instagram-feed__grid');

  // Default reusable images inside the component
  images = [
    'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65042c4a2dc3c15cdd271d43_insta-4.jpg',
    'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65042c0dda5ee049389e83b5_insta-3-p-500.jpg',
    'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65042c0ccf2de05165003a1a_insta-2-p-500.jpg',
    'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65042c0c869cc9c0d2bdbaaa_insta-1-p-500.jpg',
    'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/65042c49c7145b13706fd220_insta-5-p-500.jpg',
  ];

  generateMarkup(imageUrl) {
    return `
      <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" class="instagram-feed__item" aria-label="View on Instagram">
        <img class="instagram-feed__image" src="${imageUrl}" alt="Instagram post" loading="lazy">
      </a>
    `;
  }

  render() {
    if (!this.parentEl) {
      console.error(
        'InstagramFeedView Error: .instagram-feed parent element not found.'
      );
      return;
    }

    const markup = this.images.map(img => this.generateMarkup(img)).join('');
    this.parentEl.innerHTML = markup;
  }
}

export default new InstagramFeedView();
