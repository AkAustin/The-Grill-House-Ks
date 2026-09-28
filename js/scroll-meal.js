/* ==========================================
   THE GRILL HOUSE KS - SCROLL-DRIVEN MOVING MEAL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const movingMeal = document.getElementById('moving-meal-widget');
  const footer = document.querySelector('footer.site-footer');
  if (!movingMeal) return;

  function updateMealPosition() {
    // Hide on small mobile screens (< 480px) to prevent layout overlap
    if (window.innerWidth < 480) {
      movingMeal.style.display = 'none';
      return;
    } else {
      movingMeal.style.display = 'flex';
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (maxScroll <= 0) return;

    // Check footer collision - fade out widget near footer
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < window.innerHeight - 40) {
        movingMeal.style.opacity = '0';
        movingMeal.style.pointerEvents = 'none';
      } else {
        movingMeal.style.opacity = '1';
        movingMeal.style.pointerEvents = 'auto';
      }
    }

    // Calculate scroll progress ratio (0 to 1)
    const scrollRatio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    // Map scrollRatio (0 -> far left 2%, 1 -> middle right 45% max so widget never spills out)
    const startLeft = 2; // % from left
    const maxEndLeft = 45; // % from left

    const currentLeft = startLeft + (maxEndLeft - startLeft) * scrollRatio;
    movingMeal.style.left = `${currentLeft}%`;
  }

  // Update position on scroll & window resize
  window.addEventListener('scroll', updateMealPosition, { passive: true });
  window.addEventListener('resize', updateMealPosition, { passive: true });
  
  updateMealPosition();
});
