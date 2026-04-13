const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const initActiveNav = () => {
  const links = $$(".nav__link");
  if (links.length === 0) return;

  const path = window.location.pathname.split("/").pop() || "";
  const current = path === "" ? "index.html" : path;

  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!href.endsWith(".html")) return;
    const target = href.split("/").pop() || "";
    if (target === current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
};

const initHeader = () => {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    header.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
};

const initHeroRotator = () => {
  const media = document.querySelector("[data-hero-rotator]");
  if (!media) return;

  const imagesRaw = String(media.getAttribute("data-hero-images") || "").trim();
  if (!imagesRaw) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const sources = imagesRaw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  const layers = $$("[data-hero-img]", media);
  if (sources.length < 2 || layers.length < 2) return;

  const preload = (src) =>
    new Promise((resolve) => {
      const i = new Image();
      i.onload = () => resolve(true);
      i.onerror = () => resolve(false);
      i.src = src;
    });

  sources.slice(0, 4).forEach((src) => preload(src));

  let idx = 0;
  let active = 0;

  layers[0].src = sources[0];
  layers[0].classList.add("is-active");
  layers[1].src = sources[1];

  if (prefersReduced) return;

  window.setInterval(() => {
    idx = (idx + 1) % sources.length;
    const next = sources[idx];
    const nextLayer = layers[active === 0 ? 1 : 0];
    const currentLayer = layers[active];

    nextLayer.src = next;

    requestAnimationFrame(() => {
      nextLayer.classList.add("is-active");
      currentLayer.classList.remove("is-active");
      active = active === 0 ? 1 : 0;
    });
  }, 5200);
};

const initNav = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const close = () => {
    nav.dataset.open = "false";
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  };

  const open = () => {
    nav.dataset.open = "true";
    toggle.setAttribute("aria-label", "Fermer le menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    if (isOpen) close();
    else open();
  });

  $$(".nav__link, .nav__cta", nav).forEach((link) => link.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    if (nav.dataset.open !== "true") return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    close();
  });
};

const initSpotlight = () => {
  const root = document.querySelector("[data-spotlight]");
  if (!root) return;

  const mainImg = $("[data-spotlight-main]", root);
  const items = $$("[data-spotlight-item]", root);
  if (!mainImg || items.length === 0) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  let idx = 0;
  let timer = null;

  const setActive = (nextIdx) => {
    const item = items[nextIdx];
    const src = item.getAttribute("data-src");
    if (!src) return;

    items.forEach((el) => el.setAttribute("aria-pressed", "false"));
    item.setAttribute("aria-pressed", "true");

    mainImg.classList.add("is-fading");
    window.setTimeout(() => {
      mainImg.src = src;
      mainImg.classList.remove("is-fading");
    }, 160);
    idx = nextIdx;
  };

  items.forEach((btn, i) => {
    btn.addEventListener("click", () => setActive(i));
  });

  setActive(0);

  if (prefersReduced) return;

  const start = () => {
    if (timer) return;
    timer = window.setInterval(() => setActive((idx + 1) % items.length), 4200);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  start();
};

window.initReveal = () => {
  const items = $$(".reveal:not(.is-visible)");
  if (items.length === 0) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el, idx) => {
      el.style.transitionDelay = `${Math.min(idx * 35, 320)}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }
};

window.initLightbox = () => {
  const lightbox = document.querySelector("[data-lightbox]");
  const closeBtn = document.querySelector("[data-lightbox-close]");
  const img = document.querySelector("[data-lightbox-img]");
  const shots = $$("[data-shot]");

  if (!lightbox || !closeBtn || !img || shots.length === 0) return;

  const open = (src) => {
    img.src = src;
    lightbox.dataset.open = "true";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.dataset.open = "false";
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    img.removeAttribute("src");
  };

  if (lightbox.dataset.initialized) return;
  lightbox.dataset.initialized = "true";

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-shot]");
    if (!btn) return;
    const src = btn.getAttribute("data-src");
    if (!src) return;
    open(src);
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.dataset.open === "true") close();
  });
};

const initAdminHotkey = () => {
  document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;
    const key = String(e.key || "").toLowerCase();
    if (key !== "a") return;
    if (e.repeat) return;
    try {
      localStorage.setItem("hea_admin_entry", String(Date.now()));
    } catch {
    }
    try {
      sessionStorage.setItem("hea_admin_entry", "1");
    } catch {
    }
    window.location.href = "./admin.html";
  });
};

const initForm = () => {
  const form = document.querySelector("form.form");
  const hint = document.querySelector("[data-form-hint]");
  if (!form || !hint) return;

  const buildMailto = (payload) => {
    const subject = `Demande Human Elite Athlete — ${payload.name || "Nouveau message"}`;
    const body = [
      `Nom: ${payload.name}`,
      `Email: ${payload.email}`,
      "",
      payload.message,
      "",
      "Envoyé depuis le site Human Elite Athlete"
    ].join("\n");

    const to = "contact@hea.fr";
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      hint.textContent = "Remplis tous les champs pour envoyer ton message.";
      return;
    }

    hint.textContent = "Ouverture de ton email…";
    const url = buildMailto(payload);
    window.location.href = url;
    setTimeout(() => {
      hint.textContent = "Si ton email ne s’ouvre pas, copie/colle ton message et écris à contact@hea.fr.";
    }, 800);
  });
};

initHeader();
initActiveNav();
initHeroRotator();
initNav();
initSpotlight();
window.initReveal();
window.initLightbox();
initAdminHotkey();
initForm();
