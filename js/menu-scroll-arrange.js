/* ==========================================
   THE GRILL HOUSE KS - MENU CARD CONVERGENCE SCROLL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu-grid-container');
  if (!menuContainer) return;

  /**
   * Scroll convergence effect:
   * Center cards move UP from below, while left & right cards move DOWN from above,
   * joining into a perfect aligned row as the user scrolls into view.
   */
  function updateCardScrollPositions() {
    const cards = menuContainer.querySelectorAll('.menu-card-item');
    if (cards.length === 0) return;
    
    const viewportHeight = window.innerHeight;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      
      // Only process cards in or near the viewport
      if (rect.top < viewportHeight + 150 && rect.bottom > -150) {
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        
        // Calculate normalized distance from viewport center (0 = center, 1 = edge)
        const rawDistance = (cardCenter - viewportCenter) / (viewportHeight / 2);
        const clampedDist = Math.min(Math.max(rawDistance, -1), 1);

        const colIndex = index % 3;

        let translateY = 0;
        if (colIndex === 1) {
          // Center column: comes UP from below
          translateY = clampedDist * 36;
        } else {
          // Left & Right columns: come DOWN from above
          translateY = clampedDist * -24;
        }

        // Apply smooth 3D translation
        card.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    });
  }

  // Attach scroll & resize listeners
  window.addEventListener('scroll', updateCardScrollPositions, { passive: true });
  window.addEventListener('resize', updateCardScrollPositions, { passive: true });

  // Initial trigger after menu items render
  setTimeout(updateCardScrollPositions, 100);
});
