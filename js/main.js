/* ==========================================
   THE GRILL HOUSE KS - MAIN SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Menu rendering with 'all' items
  const menuContainer = document.getElementById('menu-grid-container');
  if (menuContainer && typeof MENU_DATA !== 'undefined') {
    renderMenuItems(MENU_DATA, menuContainer);
  }

  // Smooth scroll links override to instant scroll (respecting no-animation directive)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'auto' });
        }
      }
    });
  });
});

/**
 * Scroll food showcase cards sideways without animation
 * @param {number} direction - Direction multiplier (-1 for left, 1 for right)
 */
function scrollFoodShowcase(direction) {
  const row = document.querySelector('.food-card-row');
  if (row) {
    const scrollAmount = 320 * direction;
    row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
