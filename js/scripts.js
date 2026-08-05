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

const CART_STORAGE_KEY = "brunaCart";
const BRUNA_WHATSAPP_NUMBER = "5491164282208";

function formatARS(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseARS(value) {
  const cleanValue = String(value || "").replace(/[^\d]/g, "");
  return cleanValue ? Number(cleanValue) : 0;
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function normalizeCartUrl(url) {
  return new URL(url, window.location.href).pathname.replace(/\/index\.html$/, "/");
}

function getProductFromCard(card) {
  const link = card.querySelector("a[href*='productos/']");
  const image = card.querySelector(".card-img-top");
  const name = card.querySelector(".fw-bolder")?.textContent.trim() || "";
  const priceText = card.querySelector(".bruna-card-price")?.textContent.trim() || "";
  const isOutOfStock = card.querySelector(".bruna-stock-badge")?.textContent.toLowerCase().includes("sin stock");

  if (!link || !image || !name || !priceText || isOutOfStock) {
    return null;
  }

  return {
    id: normalizeCartUrl(link.href),
    name,
    price: parseARS(priceText),
    image: image.src,
    url: link.href,
  };
}

function getProductFromDetailPage() {
  const title = document.querySelector(".bruna-product-title");
  const price = document.querySelector(".bruna-product-price");
  const image = document.querySelector("#product-main-image");
  const disabledBuy = document.querySelector(".bruna-whatsapp.is-disabled");

  if (!title || !price || !image || disabledBuy) {
    return null;
  }

  return {
    id: window.location.pathname.replace(/\/index\.html$/, "/"),
    name: title.textContent.trim(),
    price: parseARS(price.textContent),
    image: image.src,
    url: window.location.href,
  };
}

function getCartTotals(cart = loadCart()) {
  return cart.reduce(
    (totals, item) => {
      totals.quantity += item.quantity;
      totals.price += item.price * item.quantity;
      return totals;
    },
    { quantity: 0, price: 0 },
  );
}

function addToCart(product) {
  if (!product || !product.price) {
    return;
  }

  const cart = loadCart();
  const currentItem = cart.find((item) => item.id === product.id);

  if (currentItem) {
    currentItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
  openCart();
}

function updateCartQuantity(id, nextQuantity) {
  const cart = loadCart();
  const item = cart.find((cartItem) => cartItem.id === id);

  if (!item) {
    return;
  }

  item.quantity = Math.max(1, nextQuantity);
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  saveCart(loadCart().filter((item) => item.id !== id));
  renderCart();
}

function openCart() {
  document.body.classList.add("bruna-cart-open");
  document.querySelector(".bruna-cart-drawer")?.setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("bruna-cart-open");
  document.querySelector(".bruna-cart-drawer")?.setAttribute("aria-hidden", "true");
}

function buildCartMessage(cart, customerName, paymentMethod) {
  const lines = ["Hola, quiero realizar el siguiente pedido:", ""];

  cart.forEach((item) => {
    lines.push(`• ${item.quantity}x ${item.name}`);
    lines.push(`Precio unitario: ${formatARS(item.price)}`);
    lines.push(`Subtotal: ${formatARS(item.price * item.quantity)}`);
    lines.push("");
  });

  lines.push(`Total del pedido: ${formatARS(getCartTotals(cart).price)}`);
  lines.push("");
  lines.push(`Nombre: ${customerName || "[nombre del cliente]"}`);
  lines.push(`Método de pago: ${paymentMethod || "[transferencia o efectivo]"}`);

  return lines.join("\n");
}

function renderCart() {
  const cart = loadCart();
  const itemsWrap = document.querySelector(".bruna-cart-items");
  const countElements = document.querySelectorAll(".bruna-cart-count");
  const totalProducts = document.querySelector(".bruna-cart-total-products");
  const totalPrice = document.querySelector(".bruna-cart-total-price");
  const checkoutButton = document.querySelector(".bruna-cart-checkout");
  const totals = getCartTotals(cart);

  countElements.forEach((count) => {
    count.textContent = String(totals.quantity);
    count.hidden = totals.quantity === 0;
  });

  if (!itemsWrap || !totalProducts || !totalPrice || !checkoutButton) {
    return;
  }

  itemsWrap.innerHTML = "";

  if (!cart.length) {
    itemsWrap.innerHTML = '<p class="bruna-cart-empty">Tu carrito está vacío.</p>';
  } else {
    cart.forEach((item) => {
      const itemElement = document.createElement("article");
      itemElement.className = "bruna-cart-item";
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="bruna-cart-item-info">
          <h3>${item.name}</h3>
          <p>${formatARS(item.price)}</p>
          <strong>Subtotal: ${formatARS(item.price * item.quantity)}</strong>
          <div class="bruna-cart-quantity" aria-label="Cantidad">
            <button type="button" data-cart-decrease="${item.id}" aria-label="Restar unidad">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-increase="${item.id}" aria-label="Sumar unidad">+</button>
          </div>
        </div>
        <button class="bruna-cart-remove" type="button" data-cart-remove="${item.id}" aria-label="Eliminar ${item.name}">
          <i class="bi bi-trash"></i>
        </button>
      `;
      itemsWrap.append(itemElement);
    });
  }

  totalProducts.textContent = String(totals.quantity);
  totalPrice.textContent = formatARS(totals.price);
  checkoutButton.disabled = cart.length === 0;
}

function createCartDrawer() {
  if (document.querySelector(".bruna-cart-drawer")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="bruna-cart-backdrop" data-cart-close></div>
      <aside class="bruna-cart-drawer" aria-hidden="true" aria-label="Carrito de compras">
        <div class="bruna-cart-header">
          <div>
            <span>Pedido</span>
            <h2>Tu carrito</h2>
          </div>
          <button class="bruna-icon-button" type="button" data-cart-close aria-label="Cerrar carrito">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="bruna-cart-items"></div>
        <div class="bruna-cart-summary">
          <label>
            Nombre
            <input class="bruna-cart-name" type="text" placeholder="Tu nombre" autocomplete="name" />
          </label>
          <label>
            Método de pago
            <select class="bruna-cart-payment">
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          </label>
          <div class="bruna-cart-total-row">
            <span>Total de productos</span>
            <strong class="bruna-cart-total-products">0</strong>
          </div>
          <div class="bruna-cart-total-row">
            <span>Total del pedido</span>
            <strong class="bruna-cart-total-price">$0</strong>
          </div>
          <button class="bruna-cart-checkout" type="button">Finalizar pedido por WhatsApp</button>
        </div>
      </aside>
    `,
  );
}

function createCartHeaderButton() {
  const headerActions = document.querySelector(".bruna-header-actions");

  if (!headerActions || headerActions.querySelector(".bruna-cart-toggle")) {
    return;
  }

  if (!headerActions.querySelector(".bruna-home-toggle")) {
    const homeLink = document.createElement("a");
    homeLink.className = "bruna-icon-button bruna-home-toggle";
    homeLink.href = document.querySelector(".navbar-brand")?.getAttribute("href") || "index.html";
    homeLink.setAttribute("aria-label", "Volver al inicio");
    homeLink.innerHTML = '<i class="bi bi-house"></i>';
    headerActions.insertBefore(homeLink, headerActions.firstChild);
  }

  const cartButton = document.createElement("button");
  cartButton.className = "bruna-icon-button bruna-cart-toggle";
  cartButton.type = "button";
  cartButton.setAttribute("aria-label", "Abrir carrito");
  cartButton.innerHTML = '<i class="bi bi-bag"></i><span class="bruna-cart-count" hidden>0</span>';

  const menuButton = headerActions.querySelector(".bruna-menu-toggle");
  headerActions.insertBefore(cartButton, menuButton || null);
  cartButton.addEventListener("click", openCart);
}

function createCatalogCartButtons() {
  document.querySelectorAll(".bruna-product-grid .card").forEach((card) => {
    const product = getProductFromCard(card);
    const footer = card.querySelector(".card-footer .text-center");

    if (!product || !footer || footer.querySelector(".bruna-add-to-cart")) {
      return;
    }

    const button = document.createElement("button");
    button.className = "bruna-add-to-cart";
    button.type = "button";
    button.setAttribute("aria-label", `Agregar ${product.name} al carrito`);
    button.innerHTML = '<i class="bi bi-bag"></i>';
    button.addEventListener("click", (event) => {
      event.preventDefault();
      addToCart(product);
    });
    footer.append(button);
  });
}

function createProductCartButton() {
  const product = getProductFromDetailPage();
  const productInfo = document.querySelector(".bruna-product-info");
  const whatsappButton = document.querySelector(".bruna-product-info .bruna-whatsapp");

  if (!product || !productInfo || productInfo.querySelector(".bruna-product-add-cart")) {
    return;
  }

  const button = document.createElement("button");
  button.className = "bruna-whatsapp bruna-product-add-cart";
  button.type = "button";
  button.textContent = "Agregar al carrito";
  button.addEventListener("click", () => addToCart(product));

  if (whatsappButton) {
    whatsappButton.insertAdjacentElement("beforebegin", button);
  } else {
    productInfo.append(button);
  }
}

function setupCart() {
  createCartHeaderButton();
  createCartDrawer();
  createCatalogCartButtons();
  createProductCartButton();
  renderCart();

  document.addEventListener("click", (event) => {
    const closeTrigger = event.target.closest("[data-cart-close]");
    const increaseId = event.target.closest("[data-cart-increase]")?.dataset.cartIncrease;
    const decreaseId = event.target.closest("[data-cart-decrease]")?.dataset.cartDecrease;
    const removeId = event.target.closest("[data-cart-remove]")?.dataset.cartRemove;

    if (closeTrigger) {
      closeCart();
    }

    if (increaseId) {
      const item = loadCart().find((cartItem) => cartItem.id === increaseId);
      updateCartQuantity(increaseId, (item?.quantity || 1) + 1);
    }

    if (decreaseId) {
      const item = loadCart().find((cartItem) => cartItem.id === decreaseId);
      updateCartQuantity(decreaseId, (item?.quantity || 1) - 1);
    }

    if (removeId) {
      removeFromCart(removeId);
    }
  });

  document.querySelector(".bruna-cart-checkout")?.addEventListener("click", () => {
    const cart = loadCart();

    if (!cart.length) {
      return;
    }

    const customerName = document.querySelector(".bruna-cart-name")?.value.trim() || "";
    const paymentMethod = document.querySelector(".bruna-cart-payment")?.value || "";
    const message = buildCartMessage(cart, customerName, paymentMethod);
    window.open(`https://wa.me/${BRUNA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

setupCart();
