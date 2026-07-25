/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const stickyHeader = document.querySelector(".bruna-sticky-header");
const searchToggle = document.querySelector(".bruna-search-toggle");
const headerSearch = document.querySelector(".bruna-header-search");
const menuToggle = document.querySelector(".bruna-menu-toggle");

function setHeaderSearchOpen(isOpen) {
  if (!stickyHeader || !searchToggle || !headerSearch) {
    return;
  }

  headerSearch.hidden = !isOpen;
  stickyHeader.classList.toggle("is-search-open", isOpen);
  searchToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    headerSearch.querySelector("input")?.focus();
  }
}

searchToggle?.addEventListener("click", () => {
  setHeaderSearchOpen(headerSearch?.hidden ?? true);
});

menuToggle?.addEventListener("click", () => {
  setHeaderSearchOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setHeaderSearchOpen(false);
  }
});

const productMainImage = document.querySelector("#product-main-image");
const productThumbs = document.querySelectorAll(".bruna-thumb");

productThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const nextImage = thumb.dataset.image;

    if (!productMainImage || !nextImage) {
      return;
    }

    productMainImage.src = nextImage;
    productThumbs.forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");
  });
});

const heroSlides = document.querySelectorAll(".bruna-hero-slide");
let activeHeroSlide = 0;

if (heroSlides.length > 1) {
  window.setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove("is-active");
    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
    heroSlides[activeHeroSlide].classList.add("is-active");
  }, 4200);
}

const catalogProducts = Array.from(document.querySelectorAll(".bruna-product-grid > .col"));
const loadMoreButton = document.querySelector(".bruna-load-more");
const productSearch = document.querySelector("#product-search");
const searchEmptyMessage = document.querySelector(".bruna-search-empty");
const filterLinks = document.querySelectorAll(".bruna-filter-link");
let visibleProductCount = 18;
let activeSearchTerm = "";

function normalizeSearchText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildProductSearchText(product) {
  const rawText = [
    product.dataset.search || "",
    product.textContent,
    product.querySelector("a")?.getAttribute("href") || "",
    product.querySelector("img")?.getAttribute("src") || "",
  ].join(" ");
  const normalizedText = normalizeSearchText(rawText);
  const extraTerms = [];

  if (normalizedText.includes("aro") || normalizedText.includes("argollita")) {
    extraTerms.push("aros");
  }

  if (normalizedText.includes("anillo")) {
    extraTerms.push("anillo");
  }

  if (normalizedText.includes("pulsera")) {
    extraTerms.push("pulsera");
  }

  if (normalizedText.includes("collar") || normalizedText.includes("cadena") || normalizedText.includes("choker") || normalizedText.includes("corbat")) {
    extraTerms.push("collar");
  }

  if (normalizedText.includes("cinto") || normalizedText.includes("cintur")) {
    extraTerms.push("cinturon");
  }

  if (normalizedText.includes("dorado") || normalizedText.includes("dorada") || normalizedText.includes("dorados") || normalizedText.includes("doradas")) {
    extraTerms.push("acero dorado");
  }

  if (normalizedText.includes("blanco") || normalizedText.includes("blanca") || normalizedText.includes("blancos") || normalizedText.includes("blancas")) {
    extraTerms.push("acero blanco");
  }

  const hasExplicitMaterial = normalizedText.includes("acero blanco") || normalizedText.includes("acero dorado") || normalizedText.includes("acero quirurgico") || normalizedText.includes("gamuza");
  const looksPlateado = normalizedText.includes("plateado") || normalizedText.includes("plateada") || normalizedText.includes("plateados") || normalizedText.includes("plateadas");

  if (normalizedText.includes("quirurgico") || (!hasExplicitMaterial && looksPlateado)) {
    extraTerms.push("acero quirurgico");
  }

  if (normalizedText.includes("gamuza")) {
    extraTerms.push("gamuza");
  }

  if (normalizedText.includes("cadena") || normalizedText.includes("chain")) {
    extraTerms.push("cadena");
  }

  return `${normalizedText} ${extraTerms.join(" ")}`;
}

function updateCatalogVisibility() {
  let visibleMatches = 0;

  catalogProducts.forEach((product, index) => {
    const productText = buildProductSearchText(product);
    const searchWords = normalizeSearchText(activeSearchTerm).split(/\s+/).filter(Boolean);
    const matchesSearch = !searchWords.length || searchWords.every((word) => productText.includes(word));
    const isWithinVisibleCount = activeSearchTerm || index < visibleProductCount;
    const shouldHide = !matchesSearch || !isWithinVisibleCount;

    product.classList.toggle("bruna-product-hidden", shouldHide);

    if (!shouldHide) {
      visibleMatches += 1;
    }
  });

  if (loadMoreButton) {
    const shouldShowLoadMore = !activeSearchTerm && visibleProductCount < catalogProducts.length;
    loadMoreButton.style.display = shouldShowLoadMore ? "" : "none";
  }

  if (searchEmptyMessage) {
    searchEmptyMessage.hidden = !activeSearchTerm || visibleMatches > 0;
  }
}

if (catalogProducts.length) {
  const savedSearchTerm = sessionStorage.getItem("brunaProductSearch") || "";

  if (savedSearchTerm) {
    activeSearchTerm = savedSearchTerm;

    if (productSearch) {
      productSearch.value = savedSearchTerm;
    }

    sessionStorage.removeItem("brunaProductSearch");
  }

  updateCatalogVisibility();

  if (savedSearchTerm) {
    document.querySelector("#catalogo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  loadMoreButton?.addEventListener("click", () => {
    visibleProductCount += 16;
    updateCatalogVisibility();
  });

  productSearch?.addEventListener("input", () => {
    activeSearchTerm = productSearch.value.trim();
    updateCatalogVisibility();

    if (activeSearchTerm) {
      document.querySelector("#catalogo")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  filterLinks.forEach((link) => {
    link.addEventListener("click", () => {
      activeSearchTerm = link.dataset.filter?.trim() || "";

      if (productSearch) {
        productSearch.value = activeSearchTerm;
      }

      updateCatalogVisibility();
      document.querySelector("#catalogo")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
} else if (productSearch) {
  const submitProductSearch = () => {
    const query = productSearch.value.trim();

    if (!query) {
      return;
    }

    sessionStorage.setItem("brunaProductSearch", query);
    window.location.href = "../../index.html#catalogo";
  };

  productSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitProductSearch();
    }
  });

  headerSearch?.querySelector("span")?.addEventListener("click", submitProductSearch);
}

const carouselTrack = document.querySelector(".bruna-carousel-track");
const carouselPrev = document.querySelector(".bruna-carousel-prev");
const carouselNext = document.querySelector(".bruna-carousel-next");

function scrollFeaturedCarousel(direction) {
  if (!carouselTrack) {
    return;
  }

  const firstCard = carouselTrack.querySelector(".bruna-carousel-card");
  const scrollAmount = firstCard ? firstCard.getBoundingClientRect().width + 14 : 220;

  carouselTrack.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

if (carouselPrev && carouselNext) {
  carouselPrev.addEventListener("click", () => scrollFeaturedCarousel(-1));
  carouselNext.addEventListener("click", () => scrollFeaturedCarousel(1));
}
