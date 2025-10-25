class BlogCardsView {
  parentEl = document.querySelector('.blog-grid');

  // Temporary reusable data (same image and content for now)
  data = [
    {
      title: "How food vlogging shapes today's",
      date: 'November 7, 2022',
      link: '/post/how-food-vlogging-shapes-todays',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: "How food vlogging shapes today's",
      date: 'November 7, 2022',
      link: '/post/how-food-vlogging-shapes-todays',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: "How food vlogging shapes today's",
      date: 'November 7, 2022',
      link: '/post/how-food-vlogging-shapes-todays',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    },
  ];

  generateMarkup(card) {
    return `
      <article class="blog-card">
        <a href="${card.link}" class="blog-card__link">
          <div class="blog-card__image" style="background-image: url('${card.image}')"></div>
          <div class="blog-card__content">
            <time class="blog-card__date">${card.date}</time>
            <h3 class="blog-card__title">
              ${card.title}
            </h3>
            <div class="blog-card__action">
              <div class="link-underline">
                <span class="link-underline__text">Read More</span>
                <span class="link-underline__line"></span>
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  render() {
    if (!this.parentEl) {
      console.error(
        'BlogCardsView Error: .blog-cards parent element not found.'
      );
      return;
    }

    this.parentEl.innerHTML = this.data.map(this.generateMarkup).join('');
  }
}

export default new BlogCardsView();
