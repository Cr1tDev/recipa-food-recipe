class CustomButton extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'color', 'href'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const text = this.getAttribute('text') || 'Button';
    const color = this.getAttribute('color') || 'green';
    const href = this.getAttribute('href') || '#';

    const isLight = color === 'light';
    const iconSrc = isLight
      ? 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6503134eb1cb19fd7ad46347_arrow-white.svg'
      : 'https://cdn.prod.website-files.com/6501c88eb0eaccde56b0c083/6501d777e97e1de57908741e_arrow.svg';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --color-green: #00693d;
          --color-green-hover: #009e5c;
          --color-white: #fff;
          --font-size-md: 16px;
          --radius-sm: 6px;
          --transition-base: 0.3s;
          --transition-ease: ease;
          --spacing-xs: 6px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 23px;
          border: 2px solid var(--color-green);
          border-radius: var(--radius-sm);
          background-color: transparent;
          color: var(--color-green);
          font-size: var(--font-size-md);
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: all var(--transition-base) var(--transition-ease);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .button:hover {
          color: var(--color-white);
          background-color: var(--color-green-hover);
          border-color: var(--color-green-hover);
        }

        .button__content {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          position: relative;
          z-index: 4;
        }

        .button__text {
          font-size: var(--font-size-md);
          font-weight: 600;
        }

        .button__icon-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 4px;
        }

        .button__icon {
          width: 14px;
          transition: transform var(--transition-base) ease-in-out;
        }

        .button:hover .button__icon {
          transform: translateX(3px);
        }

        /* Light variant */
        .button--light {
          color: var(--color-white);
          border-color: var(--color-white);
          background-color: transparent;
        }

        .button--light:hover {
          background-color: var(--color-white);
          color: var(--color-green);
        }

        .button--light:hover .button__icon {
          filter: brightness(0) saturate(100%) invert(23%) sepia(89%)
            saturate(1234%) hue-rotate(134deg) brightness(95%) contrast(101%);
        }
      </style>

      <a class="button ${isLight ? 'button--light' : ''}" href="${href}">
        <span class="button__content">
          <span class="button__text">${text}</span>
          <span class="button__icon-wrapper">
            <img
              class="button__icon"
              src="${iconSrc}"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </span>
        </span>
      </a>
    `;
  }
}

customElements.define('custom-button', CustomButton);
