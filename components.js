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
                <path d="M25 10H39" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                <path d="M29 10V24L17 42C13 49 18 56 26 56H38C46 56 51 49 47 42L35 24V10" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 38C26 35 30 44 35 41C38 39 40 35 44 37" stroke="#03160c" stroke-width="4" stroke-linecap="round"/>
                <circle cx="28" cy="45" r="2.5" fill="#03160c"/>
                <circle cx="39" cy="47" r="2" fill="#03160c"/>
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

const COOKIE_CONSENT_KEY = "glg_cookie_consent_v1";
const KNOWN_COOKIE_SERVICES = [
  {
    name: "_ga",
    provider: "google.com",
    purpose: "Google Analytics visitor identifier",
    duration: "Up to 2 years"
  },
  {
    name: "_gid",
    provider: "google.com",
    purpose: "Google Analytics session grouping",
    duration: "Up to 24 hours"
  },
  {
    name: "_gat",
    provider: "google.com",
    purpose: "Google Analytics request throttling",
    duration: "Up to 1 minute"
  },
  {
    name: "_clck",
    provider: "microsoft.com",
    purpose: "Microsoft Clarity browser identifier",
    duration: "Up to 1 year"
  },
  {
    name: "_clsk",
    provider: "microsoft.com",
    purpose: "Microsoft Clarity session identifier",
    duration: "Up to 24 hours"
  },
  {
    name: "MUID",
    provider: "microsoft.com",
    purpose: "Microsoft Ads and analytics identifier",
    duration: "Up to 1 year"
  }
];

function parseDocumentCookies() {
  if (!document.cookie.trim()) return [];

  return document.cookie.split(";").map((chunk) => {
    const [rawName, ...rest] = chunk.trim().split("=");
    return {
      name: rawName || "(unnamed)",
      value: rest.join("=") || "(empty)"
    };
  });
}

function clearAllDocumentCookies() {
  if (!document.cookie.trim()) return;

  const cookieNames = document.cookie
    .split(";")
    .map((chunk) => chunk.split("=")[0].trim())
    .filter(Boolean);

  const hostParts = window.location.hostname.split(".");
  const domains = [window.location.hostname];

  if (hostParts.length > 2) {
    domains.push(`.${hostParts.slice(-2).join(".")}`);
  }

  cookieNames.forEach((name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;

    domains.forEach((domain) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain};`;
    });
  });
}

function buildCookieManager() {
  if (!document.body || document.getElementById("glg-cookie-root")) return;

  const root = document.createElement("div");
  root.id = "glg-cookie-root";
  root.innerHTML = `
    <section class="cookie-banner" data-cookie-banner aria-live="polite" hidden>
      <div class="cookie-banner-copy">
        <h2>Cookies and local analytics</h2>
        <p>
          We use essential site storage plus internal analytics providers like Google and Microsoft to improve gameplay and performance.
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button class="btn" type="button" data-cookie-open>View cookies</button>
        <button class="btn" type="button" data-cookie-reject>Reject</button>
        <button class="btn primary" type="button" data-cookie-accept>Accept</button>
      </div>
    </section>

    <button
      class="cookie-fab"
      type="button"
      data-cookie-fab
      aria-label="Cookie settings"
      title="Cookie settings"
      hidden
    >
      <span aria-hidden="true">C</span>
    </button>

    <div class="cookie-modal" data-cookie-modal hidden>
      <div class="cookie-modal-backdrop" data-cookie-close></div>
      <section class="cookie-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
        <header class="cookie-modal-head">
          <h3 id="cookie-modal-title">Cookie details</h3>
          <button class="cookie-modal-close" type="button" data-cookie-close aria-label="Close cookie details">X</button>
        </header>

        <div class="cookie-modal-body">
          <div class="cookie-table-tools">
            <button class="btn" type="button" data-cookie-reset>Reset all cookies</button>
          </div>
          <p class="cookie-modal-lead">Detected cookies on this page:</p>
          <div class="cookie-table-wrap">
            <table class="cookie-table" aria-label="Detected cookies">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value Preview</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody data-cookie-detected></tbody>
            </table>
          </div>

          <p class="cookie-modal-lead">Known analytics services used internally:</p>
          <div class="cookie-table-wrap">
            <table class="cookie-table" aria-label="Known analytics cookies">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Provider</th>
                  <th>Purpose</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody data-cookie-known></tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `;

  document.body.append(root);

  const banner = root.querySelector("[data-cookie-banner]");
  const fab = root.querySelector("[data-cookie-fab]");
  const modal = root.querySelector("[data-cookie-modal]");
  const detectedBody = root.querySelector("[data-cookie-detected]");
  const knownBody = root.querySelector("[data-cookie-known]");
  const acceptBtn = root.querySelector("[data-cookie-accept]");
  const rejectBtn = root.querySelector("[data-cookie-reject]");
  const resetBtn = root.querySelector("[data-cookie-reset]");
  const openButtons = root.querySelectorAll("[data-cookie-open], [data-cookie-fab]");
  const closeButtons = root.querySelectorAll("[data-cookie-close]");
  const closeXButton = root.querySelector(".cookie-modal-close");

  if (!(
    banner instanceof HTMLElement &&
    fab instanceof HTMLButtonElement &&
    modal instanceof HTMLElement &&
    detectedBody instanceof HTMLElement &&
    knownBody instanceof HTMLElement &&
    acceptBtn instanceof HTMLButtonElement &&
    rejectBtn instanceof HTMLButtonElement &&
    resetBtn instanceof HTMLButtonElement
  )) {
    return;
  }

  const renderKnownRows = () => {
    knownBody.innerHTML = "";

    KNOWN_COOKIE_SERVICES.forEach((cookie) => {
      const row = document.createElement("tr");

      [cookie.name, cookie.provider, cookie.purpose, cookie.duration].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });

      knownBody.append(row);
    });
  };

  const renderDetectedRows = () => {
    detectedBody.innerHTML = "";
    const detected = parseDocumentCookies();

    if (!detected.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 3;
      cell.textContent = "No browser cookies detected for this page yet.";
      row.append(cell);
      detectedBody.append(row);
      return;
    }

    detected.forEach((cookie) => {
      const row = document.createElement("tr");
      const valuePreview = cookie.value.length > 36 ? `${cookie.value.slice(0, 36)}...` : cookie.value;

      [cookie.name, valuePreview, "Current site"].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });

      detectedBody.append(row);
    });
  };

  const setConsentState = (status) => {
    const hasDecision = status === "accepted" || status === "rejected";
    const isAccepted = status === "accepted";

    banner.hidden = hasDecision;
    fab.hidden = !hasDecision;
    document.body.classList.toggle("cookie-accepted", isAccepted);
  };

  const openModal = () => {
    renderDetectedRows();
    modal.hidden = false;
    document.body.classList.add("cookie-modal-open");
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("cookie-modal-open");
  };

  const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
  setConsentState(consentStatus);
  closeModal();
  renderKnownRows();

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsentState("accepted");
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsentState("rejected");
  });

  resetBtn.addEventListener("click", () => {
    clearAllDocumentCookies();
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsentState(null);
    renderDetectedRows();
  });

  openButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  if (closeXButton instanceof HTMLButtonElement) {
    closeXButton.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

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

  buildCookieManager();

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
