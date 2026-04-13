const defaultCamps = [
  {
    id: 1,
    title: "Camp de Perfectionnement Été",
    date: "15 - 20 Août 2024",
    spots: 10,
    info: "Un camp intensif de 5 jours dédié au développement technique, physique et tactique. Ouvert à tous les niveaux."
  },
  {
    id: 2,
    title: "Combine Prep Camp",
    date: "10 - 12 Septembre 2024",
    spots: 5,
    info: "Préparation spécifique aux tests physiques du football américain (40-yard dash, pro agility, etc.)."
  }
];

const defaultCoaches = [
  {
    id: 1,
    name: "Coach Alpha",
    role: "Head Coach & Préparateur Physique",
    bio: "Spécialiste de la performance athlétique et du développement des joueurs de football américain.",
    image: "./image hea/541213899_18074637869320682_6723091946661350098_n.jpg"
  },
  {
    id: 2,
    name: "Coach Beta",
    role: "Coordinateur Défensif",
    bio: "Ancien joueur professionnel, expert en tactique défensive et analyse vidéo.",
    image: "./image hea/657293113_18096950719834003_4291469215939332747_n.jpg"
  }
];

const defaultPhotos = [
  "./image hea/537920425_18073785356320682_3420085158594470568_n.jpg",
  "./image hea/541835685_18074637908320682_3895152037575491480_n.jpg",
  "./image hea/540732315_18074637896320682_1849280148453891062_n.jpg",
  "./image hea/541584182_18074637857320682_1148746400733786855_n.jpg",
  "./image hea/537780320_18073785335320682_6608482871352179542_n.jpg",
  "./image hea/536889463_18073785377320682_646450316489396630_n.jpg"
];

// Load data from localStorage or use defaults
const loadData = () => {
  const camps = JSON.parse(localStorage.getItem("hea_camps")) || defaultCamps;
  const coaches = JSON.parse(localStorage.getItem("hea_coaches")) || defaultCoaches;
  const photos = JSON.parse(localStorage.getItem("hea_photos")) || defaultPhotos;
  return { camps, coaches, photos };
};

const renderCamps = () => {
  const container = document.querySelector("#dynamic-camps");
  if (!container) return;

  const { camps } = loadData();
  
  if (camps.length === 0) {
    container.innerHTML = `<p class="reveal">Aucun camp prévu pour le moment. Restez à l'écoute !</p>`;
    return;
  }

  container.innerHTML = camps.map((camp, idx) => `
    <div class="offer reveal" style="transition-delay: ${idx * 50}ms">
      <div class="offer__body">
        <h3 class="offer__title">${camp.title}</h3>
        <p class="offer__desc">${camp.info}</p>
        <ul class="offer__list">
          <li class="offer__item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${camp.date}
          </li>
          <li class="offer__item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            ${camp.spots} places restantes
          </li>
        </ul>
        <div class="offer__action">
          <a class="btn btn--primary" style="width: 100%" href="./contact.html">Réserver ma place</a>
        </div>
      </div>
    </div>
  `).join("");
};

const renderCoaches = () => {
  const container = document.querySelector("#dynamic-coaches");
  if (!container) return;

  const { coaches } = loadData();
  
  if (coaches.length === 0) {
    container.innerHTML = `<p class="reveal">Aucun coach renseigné.</p>`;
    return;
  }

  container.innerHTML = coaches.map((coach, idx) => `
    <div class="coach-card reveal" style="transition-delay: ${idx * 50}ms">
      <img class="coach-card__img" src="${coach.image}" alt="${coach.name}" loading="lazy" />
      <div class="coach-card__body">
        <h3 class="coach-card__name">${coach.name}</h3>
        <div class="coach-card__role">${coach.role}</div>
        <p class="coach-card__bio">${coach.bio}</p>
      </div>
    </div>
  `).join("");
};

const renderPhotos = () => {
  const container = document.querySelector("#dynamic-gallery");
  if (!container) return;

  const { photos } = loadData();
  
  if (photos.length === 0) {
    container.innerHTML = `<p class="reveal">Aucune photo pour le moment.</p>`;
    return;
  }

  container.innerHTML = photos.map((src, idx) => {
    // Alterner les tailles pour la grille
    let cls = "shot reveal";
    if (idx % 4 === 0 || idx % 7 === 0) cls += " shot--wide";
    else if (idx % 3 === 0) cls += " shot--tall";

    return `
      <button class="${cls}" type="button" data-shot data-src="${src}" aria-label="Ouvrir la photo ${idx + 1}">
        <img src="${src}" alt="Photo de la galerie" loading="lazy" />
      </button>
    `;
  }).join("");
};

// Run rendering on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCamps();
  renderCoaches();
  renderPhotos();
  
  // Re-trigger global script functions to handle newly added elements
  if (window.initReveal) window.initReveal();
  if (window.initLightbox) window.initLightbox();
});