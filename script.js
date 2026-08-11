const translations = {
  mk: {
    tagline: "Каде секој момент си заслужува пауза.",
    searchPlaceholder: "Пребарај пијалок...",
    noResultsTitle: "Нема резултати 🍃",
    noResultsText: "Пробај друг збор или категорија.",
    footerAddress: "Плоштад, Цар Самоил, Ресен",
    footerHours: "Секој ден до 00:00",
    footerSocial: "Следете нè на Instagram:",
    currency: "ден",
  },
  en: {
    tagline: "Where every moment deserves a pause.",
    searchPlaceholder: "Search for a drink...",
    noResultsTitle: "No results 🍃",
    noResultsText: "Try another word or category.",
    footerAddress: "Plostad, Car Samoil, Resen",
    footerHours: "Every day until 00:00",
    footerSocial: "Follow us on Instagram:",
    currency: "den",
  },
};

const categoryLabels = {
  mk: {
    All:       "Сите",
    Coffee:    "Кафе",
    Soft:      "Безалкохолни",
    Beer:      "Пиво",
    Cocktails: "Коктели",
    Wine:      "Вино",
    Rakija:    "Ракија",
    Vodka:     "Водка",
    Whisky:    "Виски",
    Gin:       "Џин",
    Ouzo:      "Узо",
    Rum:       "Рум",
    Liqueurs:  "Ликери",
    Brandy:    "Коњак/Бренди",
    Tequila:   "Текила",
  },
  en: {
    All:       "All",
    Coffee:    "Coffee",
    Soft:      "Soft Drinks",
    Beer:      "Beer",
    Cocktails: "Cocktails",
    Wine:      "Wine",
    Rakija:    "Rakija",
    Vodka:     "Vodka",
    Whisky:    "Whisky",
    Gin:       "Gin",
    Ouzo:      "Ouzo",
    Rum:       "Rum",
    Liqueurs:  "Liqueurs",
    Brandy:    "Cognac & Brandy",
    Tequila:   "Tequila",
  },
};

let currentLang     = localStorage.getItem("timeLang") || "mk";
let currentCategory = "All";
let searchTerm      = "";
let allItems        = [];

const searchInput  = document.getElementById("searchInput");
const categoryList = document.getElementById("categoryList");
const productsGrid = document.getElementById("productsGrid");
const noResults    = document.getElementById("noResults");

function loadMenu() {
  fetch("menu.json")
    .then((response) => response.json())
    .then((data) => {
      allItems = data;
      applyTranslations();
      renderProducts();
    })
    .catch((error) => console.error("Грешка при вчитување на menu.json:", error));
}

function renderCategories() {
  const fromMenu = [...new Set(allItems.map((item) => item.category))];
  const allCats  = ["All", ...fromMenu];
  const labels   = categoryLabels[currentLang];

  categoryList.innerHTML = allCats
    .map((cat) => {
      const isActive = cat === currentCategory ? " active" : "";
      const label    = labels[cat] || cat;
      return `<button class="category-btn${isActive}" data-category="${cat}">${label}</button>`;
    })
    .join("");
}

function applyTranslations() {
  const t = translations[currentLang];

  document.getElementById("tagline").textContent         = t.tagline;
  searchInput.placeholder                                = t.searchPlaceholder;
  document.getElementById("noResultsTitle").textContent  = t.noResultsTitle;
  document.getElementById("noResultsText").textContent   = t.noResultsText;
  document.getElementById("footerAddress").textContent   = t.footerAddress;
  document.getElementById("footerHours").textContent     = t.footerHours;
  document.getElementById("footerSocial").textContent    = t.footerSocial;
  document.documentElement.lang                          = currentLang;

  renderCategories();
}

function getFilteredItems() {
  return allItems.filter((item) => {
    const matchesCategory =
      currentCategory === "All" || item.category === currentCategory;

    const name        = item.name[currentLang].toLowerCase();
    const description = item.description[currentLang].toLowerCase();
    const matchesSearch =
      name.includes(searchTerm) || description.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const items = getFilteredItems();

  if (items.length === 0) {
    productsGrid.innerHTML = "";
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;

  productsGrid.innerHTML = items
    .map((item) => {
      const desc     = item.description[currentLang];
      const descHtml = desc ? `<p class="product-description">${desc}</p>` : "";
      return `
        <article class="product-card">
          <div class="product-header">
            <h3 class="product-name">${item.name[currentLang]}</h3>
            <span class="product-dots"></span>
            <span class="product-price">
              <span class="price-number">${item.price}</span>
              <span class="price-currency">${translations[currentLang].currency}</span>
            </span>
          </div>
          ${descHtml}
        </article>`;
    })
    .join("");
}

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});

categoryList.addEventListener("click", (event) => {
  const btn = event.target.closest(".category-btn");
  if (!btn) return;

  currentCategory = btn.dataset.category;

  document.querySelectorAll(".category-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  renderProducts();
});

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    localStorage.setItem("timeLang", currentLang);

    document.querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    applyTranslations();
    renderProducts();
  });
});

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.classList.toggle("active", btn.dataset.lang === currentLang);
});

loadMenu();
