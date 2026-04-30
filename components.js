class GlgNav extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered) return;
    this.dataset.rendered = "1";
    const active = (this.getAttribute("active") || "").toLowerCase();
    const isActive = (name) => (active === name ? "active" : "");
    const navItem = (name, label, href, key) => `<a class="nav-link ${isActive(name)}" href="${href}"><span class="nav-key">${key}</span><span>${label}</span></a>`;

    this.innerHTML = `
      <div class="orb one"></div>
      <div class="orb two"></div>
      <nav class="nav">
        <div class="shell nav-inner">
          <a class="brand" href="index.html" aria-label="GreenLabGames home">
            <span class="logo" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="flask-neck" d="M22 9H42" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                <path class="flask-body" d="M26 9V22L14 42C10 50 16 58 26 58H38C48 58 54 50 50 42L38 22V9" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                <path class="flask-liquid" d="M19 40C24 36 29 44 35 41C40 39 42 35 46 38" stroke="#03160c" stroke-width="5" stroke-linecap="round"/>
                <circle class="flask-bubble bubble-one" cx="27" cy="46" r="2.8" fill="#03160c"/>
                <circle class="flask-bubble bubble-two" cx="38" cy="47" r="2.4" fill="#03160c"/>
                <circle class="flask-spark spark-one" cx="27" cy="24" r="1.9" fill="#03160c"/>
                <circle class="flask-spark spark-two" cx="33" cy="19" r="1.6" fill="#03160c"/>
                <circle class="flask-spark spark-three" cx="40" cy="24" r="1.8" fill="#03160c"/>
              </svg>
              <span class="logo-badge" data-flask-badge hidden>0</span>
            </span>
            <span class="brand-text">
              <span>GreenLabGames</span>
              <small>Welcome to the lab...</small>
            </span>
          </a>
          
          <button class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav-links" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div class="nav-links" aria-label="Main navigation">
            ${navItem("home", "Home", "index.html", "01")}
            ${navItem("projects", "Projects", "projects.html", "02")}
            ${navItem("studio", "Studio", "studio.html", "03")}
            ${navItem("contact", "Contact", "contact.html", "04")}
          </div>
          <div class="mobile-nav-links" id="mobile-nav-links" aria-label="Mobile navigation">
            ${navItem("home", "Home", "index.html", "01")}
            ${navItem("projects", "Projects", "projects.html", "02")}
            ${navItem("studio", "Studio", "studio.html", "03")}
            ${navItem("contact", "Contact", "contact.html", "04")}
          </div>
        </div>
      </nav>
    `;

    const toggle = this.querySelector(".mobile-menu-toggle");
    const mobileLinks = this.querySelector(".mobile-nav-links");
    const brandLink = this.querySelector(".brand");
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

    let logoAnimationTimeout = null;
    const triggerLogoAnimation = () => {
      this.classList.add("logo-active");
      if (logoAnimationTimeout) {
        window.clearTimeout(logoAnimationTimeout);
      }

      logoAnimationTimeout = window.setTimeout(() => {
        this.classList.remove("logo-active");
      }, 1800);
    };

    document.addEventListener("click", triggerLogoAnimation);
    window.addEventListener("scroll", triggerLogoAnimation, { passive: true });

    if (brandLink instanceof HTMLAnchorElement) {
      brandLink.addEventListener("click", (event) => {
        const potionGame = window.glgPotionGame;
        if (!potionGame) return;

        if (potionGame.isWon && typeof potionGame.openCollection === "function") {
          event.preventDefault();
          potionGame.openCollection();
          return;
        }

        if (potionGame.isStopped && typeof potionGame.resume === "function") {
          event.preventDefault();
          potionGame.resume();
          return;
        }

        if (typeof potionGame.openCollection !== "function") return;

        event.preventDefault();
        potionGame.openCollection();
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
    try {
      localStorage.clear();
    } catch {
      // Storage may be disabled.
    }
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

const POTION_STATE_KEY = "glg_potion_state_v1";
const POTION_ITEMS = ["Honey", "Herbs", "Devil Tongue", "Darkroot", "Mushrooms", "Water"];
const POTION_FLASK_NAMES = [
  "Moonfern Tonic",
  "Sporeglow Serum",
  "Riverroot Elixir",
  "Brambleheart Brew",
  "Sunpetal Infusion",
  "Mistcap Draught",
  "Verdant Flux",
  "Stoneleaf Essence",
  "Nightdew Philter"
];
const POTION_FLASK_GOAL = 5;

function createDefaultPotionState() {
  return {
    potItems: [],
    flasks: [],
    winScreenShown: false
  };
}

function loadPotionState() {
  try {
    const saved = localStorage.getItem(POTION_STATE_KEY);
    if (!saved) return createDefaultPotionState();
    const parsed = JSON.parse(saved);
    const normalizedFlasks = Array.isArray(parsed.flasks)
      ? parsed.flasks
        .map((flask) => {
          if (!flask || typeof flask !== "object") return null;
          const name = typeof flask.name === "string" && flask.name.trim() ? flask.name : null;
          if (!name) return null;

          return {
            name,
            ingredients: Array.isArray(flask.ingredients)
              ? flask.ingredients.filter((item) => typeof item === "string")
              : [],
            createdAt: typeof flask.createdAt === "string" ? flask.createdAt : ""
          };
        })
        .filter(Boolean)
      : [];

    return {
      potItems: Array.isArray(parsed.potItems) ? parsed.potItems.filter((item) => typeof item === "string") : [],
      flasks: normalizedFlasks,
      winScreenShown: parsed.winScreenShown === true
    };
  } catch {
    return createDefaultPotionState();
  }
}

function savePotionState(state) {
  try {
    localStorage.setItem(POTION_STATE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be disabled.
  }
}

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function updateLogoFlaskBadge(count) {
  const badges = document.querySelectorAll("[data-flask-badge]");
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

  badges.forEach((badge) => {
    if (!(badge instanceof HTMLElement)) return;

    if (safeCount <= 0) {
      badge.hidden = true;
      badge.textContent = "0";
      return;
    }

    badge.hidden = false;
    badge.textContent = String(Math.min(99, safeCount));
  });
}

function getPotionUi() {
  const existingRoot = document.getElementById("glg-potion-root");
  if (existingRoot) {
    return {
      root: existingRoot,
      toast: existingRoot.querySelector("[data-potion-toast]"),
      toastTitle: existingRoot.querySelector("[data-potion-toast-title]"),
      toastBody: existingRoot.querySelector("[data-potion-toast-body]"),
      toastPot: existingRoot.querySelector("[data-potion-toast-pot]"),
      toastNewFlask: existingRoot.querySelector("[data-potion-toast-new-flask]"),
      toastNewFlaskSvg: existingRoot.querySelector("[data-potion-toast-flask-svg]"),
      toastNewFlaskName: existingRoot.querySelector("[data-potion-toast-flask-name]"),
      toastCollection: existingRoot.querySelector("[data-potion-collection-btn]"),
      toastStop: existingRoot.querySelector("[data-potion-stop-btn]"),
      collectionModal: existingRoot.querySelector("[data-potion-modal]"),
      collectionTitle: existingRoot.querySelector("[data-potion-collection-title]"),
      collectionReset: existingRoot.querySelector("[data-potion-reset-btn]"),
      collectionList: existingRoot.querySelector("[data-potion-list]")
    };
  }

  const root = document.createElement("div");
  root.id = "glg-potion-root";
  root.innerHTML = `
    <section class="potion-toast" data-potion-toast aria-live="polite">
    (<span><small>Navigate to add more ingredients, Scroll to stir.</small></span>)
      <h3 data-potion-toast-title>Lab update</h3>
      <p data-potion-toast-body></p>
      <div class="potion-toast-pot">
        <strong>Pot contents:</strong>
        <span data-potion-toast-pot>(empty pot)</span>
      </div>
      <div class="potion-toast-new-flask" data-potion-toast-new-flask hidden>
        <div class="potion-flask-svg" data-potion-toast-flask-svg></div>
        <span data-potion-toast-flask-name></span>
      </div>
      <div class="potion-toast-actions">
        <button class="potion-toast-collection" type="button" data-potion-collection-btn>Collection</button>
        <button class="potion-toast-stop" type="button" data-potion-stop-btn>Stop playing</button>
      </div>
    </section>

    <section class="potion-collection-modal" data-potion-modal hidden>
      <div class="potion-collection-backdrop" data-potion-close></div>
      <div class="potion-collection-panel" role="dialog" aria-modal="true" aria-labelledby="potion-collection-title">
        <header class="potion-collection-head">
          <h2 id="potion-collection-title" data-potion-collection-title>Collected Flasks: 0/${POTION_FLASK_GOAL}</h2>
          <div class="potion-collection-head-actions">
            <button class="potion-reset" type="button" data-potion-reset-btn>Reset game</button>
            <button class="potion-close" type="button" data-potion-close aria-label="Close flask collection">X</button>
          </div>
        </header>
        <div class="potion-collection-list" data-potion-list></div>
      </div>
    </section>
  `;

  document.body.append(root);

  const closeTargets = root.querySelectorAll("[data-potion-close]");
  closeTargets.forEach((el) => {
    el.addEventListener("click", () => {
      const modal = root.querySelector("[data-potion-modal]");
      if (!(modal instanceof HTMLElement)) return;
      modal.hidden = true;
      document.body.classList.remove("potion-modal-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const modal = root.querySelector("[data-potion-modal]");
    if (!(modal instanceof HTMLElement) || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("potion-modal-open");
  });

  return {
    root,
    toast: root.querySelector("[data-potion-toast]"),
    toastTitle: root.querySelector("[data-potion-toast-title]"),
    toastBody: root.querySelector("[data-potion-toast-body]"),
    toastPot: root.querySelector("[data-potion-toast-pot]"),
    toastNewFlask: root.querySelector("[data-potion-toast-new-flask]"),
    toastNewFlaskSvg: root.querySelector("[data-potion-toast-flask-svg]"),
    toastNewFlaskName: root.querySelector("[data-potion-toast-flask-name]"),
    toastCollection: root.querySelector("[data-potion-collection-btn]"),
    toastStop: root.querySelector("[data-potion-stop-btn]"),
    collectionModal: root.querySelector("[data-potion-modal]"),
    collectionTitle: root.querySelector("[data-potion-collection-title]"),
    collectionReset: root.querySelector("[data-potion-reset-btn]"),
    collectionList: root.querySelector("[data-potion-list]")
  };
}

function formatPotItems(items) {
  return items.length ? items.join(", ") : "(empty pot)";
}

function updatePotionUi(ui, state) {
  if (!(ui.toastPot instanceof HTMLElement)) return;
  ui.toastPot.textContent = formatPotItems(state.potItems);
}

function showPotionToast(ui, title, body, duration = 1700, options = {}) {
  if (!(ui.toast instanceof HTMLElement) || !(ui.toastTitle instanceof HTMLElement) || !(ui.toastBody instanceof HTMLElement)) return;

  ui.toastTitle.textContent = title;
  ui.toastBody.textContent = body;

  if (
    ui.toastNewFlask instanceof HTMLElement &&
    ui.toastNewFlaskSvg instanceof HTMLElement &&
    ui.toastNewFlaskName instanceof HTMLElement
  ) {
    const flaskName = typeof options.flaskName === "string" ? options.flaskName.trim() : "";
    if (flaskName.length > 0) {
      ui.toastNewFlask.hidden = false;
      ui.toastNewFlaskSvg.innerHTML = flaskSvg(flaskName);
      ui.toastNewFlaskName.textContent = flaskName;
    } else {
      ui.toastNewFlask.hidden = true;
      ui.toastNewFlaskSvg.innerHTML = "";
      ui.toastNewFlaskName.textContent = "";
    }
  }

  ui.toast.classList.add("show");

  if (showPotionToast.timer) {
    window.clearTimeout(showPotionToast.timer);
  }

  if (duration > 0) {
    showPotionToast.timer = window.setTimeout(() => {
      ui.toast.classList.remove("show");
    }, duration);
  }
}

function potionColorFromName(name) {
  const hash = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const hue = hash % 360;
  const neck = `hsl(${hue} 86% 82%)`;
  const liquid = `hsl(${(hue + 30) % 360} 84% 56%)`;

  return { neck, liquid };
}

function flaskSvg(name) {
  const colors = potionColorFromName(name);

  return `
    <svg viewBox="0 0 70 70" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 10H46" stroke="${colors.neck}" stroke-width="5" stroke-linecap="round"/>
      <path d="M28 10V24L16 44C12 52 17 60 28 60H42C53 60 58 52 54 44L42 24V10" stroke="${colors.neck}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 43C26 39 33 47 38 43C43 39 47 39 49 41" stroke="${colors.liquid}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="27" cy="49" r="3" fill="${colors.liquid}"/>
      <circle cx="39" cy="50" r="2.4" fill="${colors.liquid}"/>
    </svg>
  `;
}

function pickNextFlaskName(flasks) {
  const usedNames = new Set(flasks.map((flask) => flask.name));

  for (let i = 0; i < POTION_FLASK_NAMES.length; i += 1) {
    if (!usedNames.has(POTION_FLASK_NAMES[i])) {
      return POTION_FLASK_NAMES[i];
    }
  }

  const base = randomPick(POTION_FLASK_NAMES);
  let seq = 2;
  let candidate = `${base} ${seq}`;
  while (usedNames.has(candidate)) {
    seq += 1;
    candidate = `${base} ${seq}`;
  }

  return candidate;
}

function renderFlaskCollection(ui, state) {
  if (ui.collectionTitle instanceof HTMLElement) {
    ui.collectionTitle.textContent = `Collected Flasks: ${state.flasks.length}/${POTION_FLASK_GOAL}`;
  }

  if (!(ui.collectionList instanceof HTMLElement)) return;

  if (!state.flasks.length) {
    ui.collectionList.innerHTML = `
      <div class="potion-empty">
        <h3>No flasks yet</h3>
        <p>Scroll to stir your pot and craft your first flask.</p>
      </div>
    `;
    return;
  }

  ui.collectionList.innerHTML = state.flasks
    .map((flask) => {
      const flaskName = typeof flask.name === "string" && flask.name.trim() ? flask.name : "Unnamed Flask";
      const ingredients = Array.isArray(flask.ingredients) && flask.ingredients.length
        ? flask.ingredients.join(", ")
        : "Unknown recipe";

      return `
        <article class="potion-flask-card">
          <div class="potion-flask-svg">${flaskSvg(flaskName)}</div>
          <h3>${flaskName}</h3>
          <p>${ingredients}</p>
        </article>
      `;
    })
    .join("");
}

function buildPotionGame() {
  if (!document.body) return;

  const state = loadPotionState();
  const ui = getPotionUi();
  updateLogoFlaskBadge(state.flasks.length);
  let isActive = true;
  let hasWon = state.flasks.length >= POTION_FLASK_GOAL;
  let scrollStopTimer = null;
  let countdownTimer = null;
  let countdown = 0;

  const seedNewIngredient = () => {
    const addedItem = randomPick(POTION_ITEMS);
    state.potItems.push(addedItem);
    savePotionState(state);
    updatePotionUi(ui, state);
    showPotionToast(ui, "Ingredient added", `${addedItem} was dropped into the pot.`, 2100);
  };

  const showWinScreen = () => {
    if (!(ui.collectionModal instanceof HTMLElement) || !(ui.collectionList instanceof HTMLElement)) return;

    if (ui.root instanceof HTMLElement) {
      ui.root.hidden = false;
    }

    if (ui.collectionTitle instanceof HTMLElement) {
      ui.collectionTitle.textContent = `Game won! Collected Flasks: ${state.flasks.length}/${POTION_FLASK_GOAL}`;
    }

    ui.collectionList.innerHTML = `
      <section class="potion-win-banner">
        <h3>Potion Mastery Unlocked</h3>
        <p>You brewed all ${POTION_FLASK_GOAL} flasks. Your full collection is on display below.</p>
      </section>
    `;

    ui.collectionList.insertAdjacentHTML(
      "beforeend",
      state.flasks
        .map((flask) => {
          const flaskName = typeof flask.name === "string" && flask.name.trim() ? flask.name : "Unnamed Flask";
          const ingredients = Array.isArray(flask.ingredients) && flask.ingredients.length
            ? flask.ingredients.join(", ")
            : "Unknown recipe";

          return `
            <article class="potion-flask-card">
              <div class="potion-flask-svg">${flaskSvg(flaskName)}</div>
              <h3>${flaskName}</h3>
              <p>${ingredients}</p>
            </article>
          `;
        })
        .join("")
    );

    ui.collectionModal.hidden = false;
    document.body.classList.add("potion-modal-open");
  };

  const markWinScreenShown = () => {
    if (state.winScreenShown) return;
    state.winScreenShown = true;
    savePotionState(state);
  };

  const openCollection = () => {
    if (!isActive && !hasWon) return;
    if (!(ui.collectionModal instanceof HTMLElement)) return;

    if (hasWon) {
      stopGame({ hideRoot: false, closeModal: false });
      showWinScreen();
      return;
    }

    renderFlaskCollection(ui, state);
    ui.collectionModal.hidden = false;
    document.body.classList.add("potion-modal-open");
  };

  const stopGame = (options = {}) => {
    const hideRoot = options.hideRoot !== false;
    const closeModal = options.closeModal !== false;

    isActive = false;

    if (scrollStopTimer) {
      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = null;
    }

    if (countdownTimer) {
      window.clearInterval(countdownTimer);
      countdownTimer = null;
    }

    if (closeModal && ui.collectionModal instanceof HTMLElement) {
      ui.collectionModal.hidden = true;
      document.body.classList.remove("potion-modal-open");
    }

    if (hideRoot && ui.root instanceof HTMLElement) {
      ui.root.hidden = true;
    }
  };

  const resumeGame = () => {
    if (hasWon) return;

    isActive = true;
    if (ui.root instanceof HTMLElement) {
      ui.root.hidden = false;
    }

    updatePotionUi(ui, state);
    showPotionToast(ui, "Potion game resumed", "Scroll to stir the pot and keep brewing.", 1800);
  };

  const resetGame = () => {
    if (scrollStopTimer) {
      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = null;
    }

    if (countdownTimer) {
      window.clearInterval(countdownTimer);
      countdownTimer = null;
    }

    state.potItems = [];
    state.flasks = [];
    state.winScreenShown = false;
    hasWon = false;
    isActive = true;

    updateLogoFlaskBadge(0);

    if (ui.collectionModal instanceof HTMLElement) {
      ui.collectionModal.hidden = true;
      document.body.classList.remove("potion-modal-open");
    }

    if (ui.root instanceof HTMLElement) {
      ui.root.hidden = false;
    }

    if (ui.toast instanceof HTMLElement) {
      ui.toast.hidden = false;
    }

    if (ui.toastStop instanceof HTMLButtonElement) {
      ui.toastStop.hidden = false;
    }

    if (
      ui.toastNewFlask instanceof HTMLElement &&
      ui.toastNewFlaskSvg instanceof HTMLElement &&
      ui.toastNewFlaskName instanceof HTMLElement
    ) {
      ui.toastNewFlask.hidden = true;
      ui.toastNewFlaskSvg.innerHTML = "";
      ui.toastNewFlaskName.textContent = "";
    }

    savePotionState(state);
    seedNewIngredient();
  };

  window.glgPotionGame = {
    openCollection,
    stop: stopGame,
    resume: resumeGame,
    reset: resetGame,
    get isStopped() {
      return !isActive;
    },
    get isWon() {
      return hasWon;
    }
  };

  if (ui.toastCollection instanceof HTMLButtonElement) {
    ui.toastCollection.addEventListener("click", openCollection);
  }

  if (ui.toastStop instanceof HTMLButtonElement) {
    ui.toastStop.addEventListener("click", stopGame);
  }

  if (ui.collectionReset instanceof HTMLButtonElement) {
    ui.collectionReset.addEventListener("click", resetGame);
  }

  if (hasWon) {
    if (ui.toast instanceof HTMLElement) {
      ui.toast.hidden = true;
    }
    if (ui.toastStop instanceof HTMLButtonElement) {
      ui.toastStop.hidden = true;
    }

    if (state.winScreenShown) {
      stopGame({ hideRoot: true, closeModal: true });
      return;
    }

    stopGame({ hideRoot: false, closeModal: false });
    showWinScreen();
    markWinScreenShown();
    return;
  }

  seedNewIngredient();

  const stirMessage = () => {
    const itemList = formatPotItems(state.potItems);
    showPotionToast(ui, "Stirring pot", `Inside: ${itemList}`, 0);
  };

  const createFlask = () => {
    const flaskName = pickNextFlaskName(state.flasks);
    const newFlask = {
      name: flaskName,
      ingredients: [...state.potItems],
      createdAt: new Date().toISOString()
    };

    state.flasks.push(newFlask);
    state.potItems = [];
    savePotionState(state);
    updateLogoFlaskBadge(state.flasks.length);
    updatePotionUi(ui, state);

    if (state.flasks.length >= POTION_FLASK_GOAL) {
      hasWon = true;

      if (ui.toast instanceof HTMLElement) {
        ui.toast.hidden = true;
      }
      if (ui.toastStop instanceof HTMLButtonElement) {
        ui.toastStop.hidden = true;
      }

      stopGame({ hideRoot: false, closeModal: false });
      showWinScreen();
      markWinScreenShown();
      return;
    }

    showPotionToast(ui, "New flask created", flaskName, 2400, { flaskName });
  };

  const startCountdown = () => {
    if (!state.potItems.length) return;

    countdown = 2;
    showPotionToast(ui, "Brewing complete in", `${countdown} seconds`, 0);

    countdownTimer = window.setInterval(() => {
      countdown -= 1;

      if (countdown <= 0) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
        createFlask();
        return;
      }

      showPotionToast(ui, "Brewing complete in", `${countdown} seconds`, 0);
    }, 1000);
  };

  window.addEventListener("scroll", () => {
    if (!isActive) return;
    if (!state.potItems.length) return;

    stirMessage();

    if (scrollStopTimer) {
      window.clearTimeout(scrollStopTimer);
    }

    if (countdownTimer) {
      window.clearInterval(countdownTimer);
      countdownTimer = null;
    }

    scrollStopTimer = window.setTimeout(() => {
      startCountdown();
    }, 220);
  }, { passive: true });
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
  buildPotionGame();

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
