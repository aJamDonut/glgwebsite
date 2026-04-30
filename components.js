class GlgNav extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";
    const active = (this.getAttribute("active") || "").toLowerCase();
    const isActive = (name) => (active === name ? "active" : "");

    this.innerHTML = `
      <div class="orb one"></div>
      <div class="orb two"></div>
      <nav class="nav">
        <div class="shell nav-inner">
          <a class="brand" href="index.html" aria-label="GreenLabGames home">
            <span class="logo" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 40C14 25 25 14 40 14C44 14 48 15 52 17C51 35 41 50 24 53C18 52 14 47 14 40Z" fill="currentColor"/>
                <path d="M24 43C30 31 39 25 52 17" stroke="#03160c" stroke-width="5" stroke-linecap="round"/>
              </svg>
            </span>
            <span>GreenLabGames</span>
          </a>
          <button class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav-links" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div class="nav-links" aria-label="Main navigation">
            <a class="${isActive("home")}" href="index.html">Home</a>
            <a class="${isActive("projects")}" href="projects.html">Projects</a>
            <a class="${isActive("studio")}" href="studio.html">Studio</a>
            <a class="${isActive("contact")}" href="contact.html">Contact</a>
          </div>
          <div class="mobile-nav-links" id="mobile-nav-links" aria-label="Mobile navigation">
            <a class="${isActive("home")}" href="index.html">Home</a>
            <a class="${isActive("projects")}" href="projects.html">Projects</a>
            <a class="${isActive("studio")}" href="studio.html">Studio</a>
            <a class="${isActive("contact")}" href="contact.html">Contact</a>
          </div>
        </div>
      </nav>
    `;

    const toggle = this.querySelector(".mobile-menu-toggle");
    const mobileLinks = this.querySelector(".mobile-nav-links");
    const closeMenu = () => {
      if (!toggle || !mobileLinks) return;
      this.classList.remove("mobile-nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };

    if (toggle && mobileLinks) {
      toggle.addEventListener("click", () => {
        const isOpen = this.classList.toggle("mobile-nav-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });

      mobileLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => closeMenu());
      });

      document.addEventListener("click", (event) => {
        if (!this.classList.contains("mobile-nav-open")) return;
        if (event.target instanceof Node && this.contains(event.target)) return;
        closeMenu();
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
      });
    }
  }
}

class GlgFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";

    this.innerHTML = `
      <footer>
        <div class="shell footer-inner">
          <span>Copyright <span data-year></span> GreenLabGames. All rights reserved.</span>
          <div class="socials" aria-label="Social links">
            GreenLabGames
          </div>
        </div>
      </footer>
    `;
  }
}

class GlgSectionHead extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";

    const title = this.getAttribute("title") || "Section title";
    const description = this.getAttribute("description") || "";

    this.innerHTML = `
      <div class="section-head">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
    `;
  }
}

class GlgGameCard extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";

    const title = this.getAttribute("title") || "Untitled";
    const body = this.getAttribute("body") || "";
    const tags = (this.getAttribute("tags") || "").split(",").map((x) => x.trim()).filter(Boolean);
    const tall = this.hasAttribute("tall") ? "tall" : "";

    this.innerHTML = `
      <article class="game-card ${tall}">
        <div class="tag-row">
          ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="game-title">
          <h3>${title}</h3>
          <p>${body}</p>
        </div>
      </article>
    `;
  }
}

class GlgFeatureCard extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";

    const title = this.getAttribute("title") || "Feature";
    const body = this.getAttribute("body") || "";
    const icon = this.getAttribute("icon") || "*";

    this.innerHTML = `
      <article class="feature">
        <div class="icon">${icon}</div>
        <h3>${title}</h3>
        <p>${body}</p>
      </article>
    `;
  }
}

class GlgNewsletter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";

    this.innerHTML = `
      <section class="shell reveal" id="updates">
        <div class="newsletter">
          <div>
            <h2>Signup for announcements,<br />betas and patches notes</h2>
          </div>
          <form class="signup" data-newsletter-form>
            <input type="email" placeholder="player@domain.com" aria-label="Email address" required />
            <button class="btn primary" type="submit">Join</button>
          </form>
        </div>
      </section>
    `;
  }
}

customElements.define("glg-nav", GlgNav);
customElements.define("glg-footer", GlgFooter);
customElements.define("glg-section-head", GlgSectionHead);
customElements.define("glg-game-card", GlgGameCard);
customElements.define("glg-feature-card", GlgFeatureCard);
customElements.define("glg-newsletter", GlgNewsletter);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("[data-newsletter-form]")) return;

    event.preventDefault();
    const button = form.querySelector("button");
    if (!button) return;

    button.textContent = "Added to the lab";
    form.reset();
    setTimeout(() => {
      button.textContent = "Join";
    }, 2200);
  });
});
