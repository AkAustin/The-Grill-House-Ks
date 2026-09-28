/* ==========================================
   THE GRILL HOUSE KS - MENU FILTER & SEARCH LOGIC
   ========================================== */

let currentActiveCategory = 'all';

/**
 * Render menu items into target container with dish photography
 * @param {Array} items - List of menu item objects
 * @param {HTMLElement} container - DOM element target
 */
function renderMenuItems(items, container) {
  if (!container) return;
  
  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px 20px; color: var(--color-ink-soft);">
        <p style="font-size: 1.05rem; font-weight: 700; margin-bottom: 8px;">No matching dishes found.</p>
        <p style="font-size: 0.9rem; margin-bottom: 16px;">Try searching for "steak", "tacos", or "burrito".</p>
        <button type="button" class="btn btn-primary" onclick="filterMenuCategory('all', document.querySelector('.tab-button'))" style="padding: 8px 18px; font-size: 0.88rem;">Clear Filters & Show All Meals</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="menu-card-item" data-category="${item.category}">
      ${item.image ? `
        <div class="menu-card-img-wrap">
          <img class="menu-card-img" src="${item.image}" alt="${item.name}" loading="lazy">
          ${item.badge ? `<span class="badge badge-barn menu-card-badge-overlay">${item.badge}</span>` : ''}
        </div>
      ` : ''}
      <div class="menu-card-top">
        <h3 class="menu-card-name">${item.name}</h3>
        <span class="menu-card-price">${item.price}</span>
      </div>
      <p class="menu-card-body">${item.description}</p>
      <div style="margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" class="btn btn-wheat" style="padding: 6px 12px; font-size: 0.82rem; background-color: var(--color-wheat); color: var(--color-ink); border: none;">🔍 View Details</button>
        <a class="btn btn-barn" href="tel:+16209092090" style="padding: 6px 12px; font-size: 0.82rem;">📞 Call Order</a>
      </div>
    </div>
  `).join('');
}

/**
 * Filter menu items by category without animation
 * @param {string} category - Selected category key ('all', 'breakfast', etc.)
 * @param {HTMLElement} activeBtn - Clicked button element
 */
function filterMenuCategory(category, activeBtn) {
  currentActiveCategory = category;

  // Update active tab style instantly
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');

  const searchInput = document.getElementById('menu-search-input');
  if (category === 'all' && searchInput && activeBtn && activeBtn.getAttribute('onclick') && activeBtn.getAttribute('onclick').includes('clear')) {
    searchInput.value = '';
  }
  const query = searchInput ? searchInput.value : '';

  searchMenuItems(query);
}

/**
 * Filter menu items by search query
 * @param {string} query - Search term
 */
function searchMenuItems(query) {
  const container = document.getElementById('menu-grid-container');
  if (!container || typeof MENU_DATA === 'undefined') return;

  const searchTerm = (query || '').toLowerCase().trim();

  const filtered = MENU_DATA.filter(item => {
    const matchesCategory = (currentActiveCategory === 'all' || item.category === currentActiveCategory);
    const matchesQuery = !searchTerm || 
                         item.name.toLowerCase().includes(searchTerm) || 
                         item.description.toLowerCase().includes(searchTerm) ||
                         (item.badge && item.badge.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesQuery;
  });

  renderMenuItems(filtered, container);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchMenuItems(e.target.value);
    });
  }
});
