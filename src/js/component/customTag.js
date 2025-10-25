class CustomTagElement extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.render();
    this.updateAll(); // update all attributes on load
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .tag {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .tag__bullet {
          border-radius: 100%;
          flex-shrink: 0;
          width: 5px;
          height: 5px;
          border: 2px solid #00693d;
        }

        .tag__text {
          color: #00693d;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.1;
        }
      </style>

      <div class="tag">
        <span class="tag__bullet" aria-hidden="true"></span>
        <span class="tag__text"></span>
      </div>
    `;
    this.root.innerHTML = ''; // clean before re-render
    this.root.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['tagname', 'position', 'color'];
  }

  get tagName() {
    return this.getAttribute('tagname');
  }
  set tagName(value) {
    this.setAttribute('tagname', value);
  }

  get position() {
    return this.getAttribute('position');
  }
  set position(value) {
    this.setAttribute('position', value);
  }

  get color() {
    return this.getAttribute('color');
  }
  set color(value) {
    this.setAttribute('color', value);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal === newVal) return;
    this.updateAll();
  }

  updateAll() {
    this.updateTagText();
    this.updatePosition();
    this.updateColor();
  }

  updateTagText() {
    const textEl = this.root.querySelector('.tag__text');
    if (textEl) textEl.textContent = this.tagName || 'Default tag';
  }

  updatePosition() {
    const tag = this.root.querySelector('.tag');
    if (!tag) return;

    const pos = this.position ? this.position.toLowerCase() : 'center';

    switch (pos) {
      case 'right':
        tag.style.justifyContent = 'flex-start';
        break;
      case 'left':
        tag.style.justifyContent = 'flex-end';
        break;
      default:
        tag.style.justifyContent = 'center';
    }
  }

  updateColor() {
    const text = this.root.querySelector('.tag__text');
    const bullet = this.root.querySelector('.tag__bullet');
    if (!text || !bullet) return;

    const colorAttr = this.color ? this.color.toLowerCase() : 'green';

    const colorMap = {
      green: '#00693d',
      light: '#ffffff',
    };

    const chosen = colorMap[colorAttr] || colorMap.green;
    text.style.color = chosen;
    bullet.style.borderColor = chosen;
  }
}

customElements.define('custom-tag', CustomTagElement);
