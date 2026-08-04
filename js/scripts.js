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

document.querySelectorAll(".bruna-product-grid .card .text-center").forEach((details) => {
  const hasStyledPrice = details.querySelector(".bruna-card-price");

  if (hasStyledPrice) {
    return;
  }

  Array.from(details.childNodes).forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !/\$\s*[\d.]+/.test(node.textContent || "")) {
      return;
    }

    const price = (node.textContent || "").match(/\$\s*[\d.]+/)?.[0]?.replace(/\s+/g, "") || "";

    if (!price) {
      return;
    }

    const priceElement = document.createElement("span");
    priceElement.className = "bruna-card-price";
    priceElement.textContent = price;
    node.replaceWith(priceElement);
  });
});

const catalogProducts = Array.from(document.querySelectorAll(".bruna-product-grid > .col"));
const loadMoreButton = document.querySelector(".bruna-load-more");
const productSearch = document.querySelector("#product-search");
const searchEmptyMessage = document.querySelector(".bruna-search-empty");
const filterLinks = document.querySelectorAll(".bruna-filter-link");
const categoryLinks = document.querySelectorAll(".bruna-category-link");
const pageCatalogFilter = document.body.dataset.catalogFilter?.trim() || "";
let visibleProductCount = pageCatalogFilter ? Number.POSITIVE_INFINITY : 18;
let activeSearchTerm = pageCatalogFilter;

function saveCatalogReturnPoint() {
  if (!catalogProducts.length) {
    return;
  }

  sessionStorage.setItem("brunaCatalogReturnUrl", window.location.href);
  sessionStorage.setItem("brunaCatalogScrollY", String(window.scrollY));
  sessionStorage.setItem("brunaCatalogVisibleCount", String(visibleProductCount));
  sessionStorage.setItem("brunaCatalogSearchTerm", activeSearchTerm);
}

filterLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const filter = link.dataset.filter?.trim() || "";

    if (filter) {
      sessionStorage.setItem("brunaProductSearch", filter);
    } else {
      sessionStorage.removeItem("brunaProductSearch");
    }

    if (link.getAttribute("href")) {
      event.preventDefault();
      window.location.assign(link.href);
    }
  });
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sessionStorage.removeItem("brunaCatalogScrollY");
    sessionStorage.removeItem("brunaCatalogVisibleCount");
    sessionStorage.removeItem("brunaCatalogSearchTerm");
    sessionStorage.removeItem("brunaProductSearch");
  });
});

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

  if (/\b(aros?|argollitas?|cuff)\b/.test(normalizedText)) {
    extraTerms.push("aros");
  }

  if (/\banillos?\b/.test(normalizedText)) {
    extraTerms.push("anillo");
  }

  if (/\bpulseras?\b/.test(normalizedText)) {
    extraTerms.push("pulsera");
  }

  if (/\b(collares?|cadena|cadenas|choker|corbatin)\b/.test(normalizedText)) {
    extraTerms.push("collar");
  }

  if (/\b(cintos?|cinturones?)\b/.test(normalizedText)) {
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
    const matchesSearch = pageCatalogFilter || !searchWords.length || searchWords.every((word) => productText.includes(word));
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
  const savedScrollY = Number(sessionStorage.getItem("brunaCatalogScrollY") || "");
  const savedVisibleCount = Number(sessionStorage.getItem("brunaCatalogVisibleCount") || "");
  const savedCatalogSearchTerm = sessionStorage.getItem("brunaCatalogSearchTerm") || "";

  if (pageCatalogFilter) {
    activeSearchTerm = pageCatalogFilter;
    sessionStorage.removeItem("brunaProductSearch");

    if (productSearch) {
      productSearch.value = "";
    }
  } else if (savedSearchTerm) {
    activeSearchTerm = savedSearchTerm;

    if (productSearch) {
      productSearch.value = savedSearchTerm;
    }

    sessionStorage.removeItem("brunaProductSearch");
  } else if (savedCatalogSearchTerm) {
    activeSearchTerm = savedCatalogSearchTerm;

    if (productSearch) {
      productSearch.value = savedCatalogSearchTerm;
    }
  }

  if (savedVisibleCount > visibleProductCount) {
    visibleProductCount = savedVisibleCount;
  }

  updateCatalogVisibility();

  if (!pageCatalogFilter && savedScrollY > 0) {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: savedScrollY,
        behavior: "auto",
      });
      sessionStorage.removeItem("brunaCatalogScrollY");
    });
  } else if (savedSearchTerm) {
    document.querySelector("#catalogo")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  loadMoreButton?.addEventListener("click", () => {
    visibleProductCount += 16;
    updateCatalogVisibility();
  });

  document.querySelectorAll("a[href*='productos/']").forEach((link) => {
    link.addEventListener("click", saveCatalogReturnPoint);
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

const catalogBackLink = document.querySelector(".bruna-back");

catalogBackLink?.addEventListener("click", (event) => {
  const returnUrl = sessionStorage.getItem("brunaCatalogReturnUrl");

  if (!returnUrl) {
    return;
  }

  event.preventDefault();
  window.location.href = returnUrl;
});

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
