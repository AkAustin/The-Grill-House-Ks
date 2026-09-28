/* ==========================================
   THE GRILL HOUSE KS - INTERACTIVE DISH PRODUCT DETAIL LANDING MODAL
   ========================================== */

function ensureSmokeOverlayExists(modal) {
  if (!modal || modal.querySelector('.product-modal-smoke-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'product-modal-smoke-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="smoke-stream smoke-stream-left">
      <div class="smoke-puff p1"></div>
      <div class="smoke-puff p2"></div>
      <div class="smoke-puff p3"></div>
      <div class="smoke-puff p4"></div>
    </div>
    <div class="smoke-stream smoke-stream-right">
      <div class="smoke-puff p1"></div>
      <div class="smoke-puff p2"></div>
      <div class="smoke-puff p3"></div>
      <div class="smoke-puff p4"></div>
    </div>
  `;
  modal.insertBefore(overlay, modal.firstChild);
}

function openDishProductModal(dish) {
  const modal = document.getElementById('product-detail-modal');
  if (!modal || !dish) return;

  ensureSmokeOverlayExists(modal);

  const pmImage = document.getElementById('pm-image');
  const pmBadge = document.getElementById('pm-badge');
  const pmCategory = document.getElementById('pm-category');
  const pmTitle = document.getElementById('pm-title');
  const pmPrice = document.getElementById('pm-price');
  const pmDesc = document.getElementById('pm-description');
  const pmCalories = document.getElementById('pm-calories');
  const pmPrep = document.getElementById('pm-prep');
  const pmIngredients = document.getElementById('pm-ingredients');
  const pmDietary = document.getElementById('pm-dietary');
  const pmReserveBtn = document.getElementById('pm-reserve-btn');

  if (pmImage) {
    pmImage.src = dish.image;
    pmImage.alt = dish.name;
  }
  if (pmBadge) {
    pmBadge.textContent = dish.badge || 'Kitchen Special';
    pmBadge.style.display = dish.badge ? 'inline-block' : 'none';
  }
  if (pmCategory) {
    pmCategory.textContent = dish.category ? `${dish.category.toUpperCase()} SPECIALTY` : 'THE GRILL HOUSE';
  }
  if (pmTitle) pmTitle.textContent = dish.name;
  if (pmPrice) pmPrice.textContent = dish.price;
  if (pmDesc) pmDesc.textContent = dish.description;
  if (pmCalories) pmCalories.textContent = dish.calories || '~750 kcal';
  if (pmPrep) pmPrep.textContent = dish.prepInfo || 'Flame-grilled to order';

  // Render Ingredients
  if (pmIngredients) {
    pmIngredients.innerHTML = '';
    const ingredients = dish.ingredients || ['Fresh Local Ingredients', 'House Seasoning', 'Served Hot'];
    ingredients.forEach(item => {
      const chip = document.createElement('span');
      chip.className = 'ingredient-chip';
      chip.textContent = `• ${item}`;
      pmIngredients.appendChild(chip);
    });
  }

  // Render Dietary Tags
  if (pmDietary) {
    pmDietary.innerHTML = '';
    const tags = dish.dietary || ['Fresh Preparation', 'Nut-Free Option'];
    tags.forEach(tag => {
      const el = document.createElement('span');
      el.className = 'dietary-tag';
      el.textContent = tag;
      pmDietary.appendChild(el);
    });
  }

  // Wire Reserve Table Button to navigate to reservations.html
  if (pmReserveBtn) {
    pmReserveBtn.onclick = () => {
      closeDishProductModal();
      window.location.href = 'reservations.html';
    };
  }

  // Update URL hash for deep-linking capability
  window.history.replaceState(null, null, `#dish-${dish.id}`);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDishProductModal() {
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Clean URL hash back cleanly if dish hash was present
  if (window.location.hash.startsWith('#dish-')) {
    window.history.replaceState(null, null, window.location.pathname + window.location.search);
  }
}

function initProductModal() {
  const modal = document.getElementById('product-detail-modal');
  const closeBtn = document.getElementById('product-modal-close');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDishProductModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeDishProductModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeDishProductModal();
    }
  });

  // Attach click listeners to all dish cards in Showcase and Explore Menu section
  attachDishCardListeners();

  // Check initial URL hash for direct deep-linking (e.g. #dish-b1 or #dish-s1)
  checkDeepLinkHash();
}

function attachDishCardListeners() {
  // Delegate click on menu section & showcase cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card-item, .food-showcase-card, .moving-meal-container');
    if (!card) return;

    // Ignore direct telephone call links inside cards
    if (e.target.closest('a[href^="tel:"]')) return;

    // Find matching dish from MENU_DATA
    const cardTitleEl = card.querySelector('.menu-card-name, .food-card-title, .moving-meal-title');
    if (!cardTitleEl) return;

    const titleText = cardTitleEl.textContent.trim();
    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normTitle = normalize(titleText);
    
    // Find matching item in dataset (exact clean match first)
    const matchedDish = MENU_DATA.find(item => normalize(item.name) === normTitle) ||
                        MENU_DATA.find(item => normTitle.includes(normalize(item.name)) || normalize(item.name).includes(normTitle));

    if (matchedDish) {
      e.preventDefault();
      openDishProductModal(matchedDish);
    }
  });
}

function checkDeepLinkHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#dish-')) {
    const dishId = hash.replace('#dish-', '');
    const matchedDish = MENU_DATA.find(d => d.id === dishId);
    if (matchedDish) {
      setTimeout(() => openDishProductModal(matchedDish), 300);
    }
  }
}

document.addEventListener('DOMContentLoaded', initProductModal);
