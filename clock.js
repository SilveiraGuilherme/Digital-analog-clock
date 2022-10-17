class wcClock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    this.span = document.createElement("span");
    style.textContent = `
    :host {
      display: block;
    }
    `;
    this.shadowRoot.append(style);
    this.shadowRoot.append(this.span);
  }

  connectedCallback() {
    const analog = this.getAttribute("type") === "analog";

    this.showClock(analog);
    this.timer = setInterval(() => {
      this.showClock(analog);
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  getHMS() {
    const dh = new Date();
    const h = String(dh.getHours()).padStart(2, "0");
    const m = String(dh.getMinutes()).padStart(2, "0");
    const s = String(dh.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  showClock(analog) {
    if (analog) {
      return this.showAnalogClock();
    } else {
      return this.showDigitalClock();
    }
  }

  showDigitalClock() {
    this.span.textContent = this.getHMS();
  }

  showAnalogClock() {
    const dh = new Date();
    const s = dh.getSeconds();
    const m = dh.getMinutes() + s / 60;
    const h = (dh.getHours() % 12) + m / 60;

    let check = "";
    for (let ang = 0; ang < 360; ang += 6) {
      const thick = ang % 30 === 0;
      if (thick) {
        check += ` <path transform="rotate(${ang})" d="M 0 -100 v 6" />\n`;
      } else {
        check += ` <path transform="rotate(${ang})" d="M 0 -100 v 3" stroke-width="1" />\n`;
      }
    }

    this.span.innerHTML = `
    <svg width="220" height="220">
    <g transform="translate(110, 110)" fill="none" stroke="black" stroke-width="2">
      <circle cx="0" cy="0" r="100" />
      <circle cx="0" cy="0" r="4" fill="black" />
      ${check}    
      <path transform= "rotate(${
        h * (360 / 12)
      })" d="M 0 0 h 85" stroke-width="4" />
      <path transform= "rotate(${m * (360 / 60)})" d="M 0 0 v -90" />
      <path transform= "rotate(${
        s * (360 / 60)
      })" d="M 0 0 v 90" stroke="red" />
      <circle cx="0" cy="0" r="2" stroke="none" fill="red">
      </g>
    </svg>`;
  }
}

customElements.define("wc-clock", wcClock);
