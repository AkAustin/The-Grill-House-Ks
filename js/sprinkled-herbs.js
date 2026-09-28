/* ==========================================
   THE GRILL HOUSE KS - MULTI-COLORED SPRINKLED GARNISH
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Target all main landing page sections including the Explore Menu section
  const sections = document.querySelectorAll('.hero-section, .food-showcase-section, #full-menu, .reviews-section, .location-section, .service-banner');

  // Green Herbs (Cilantro, Parsley, Basil)
  const greenHerbSVGs = [
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="%234CAF50"><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z"/></svg>`,
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="%2366BB6A"><path d="M17 8C8 10 5 16 5 21c7 0 13-3 15-10-1-1-2-2-3-3z"/></svg>`,
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="%23388E3C"><ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(30 12 12)"/></svg>`
  ];

  // Warm & Spicy Multi-Colored Culinary Flakes (Red Chili, Golden Garlic, Seasoning Flecks) for Menu Side Balance
  const multiColorSpiceSVGs = [
    // Spicy Red Chili Flake
    `<svg width="15" height="15" viewBox="0 0 24 24" fill="%23E53935"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>`,
    // Golden Toasted Garlic Fleck
    `<svg width="13" height="13" viewBox="0 0 24 24" fill="%23FFB74D"><circle cx="12" cy="12" r="8"/></svg>`,
    // Deep Red Pepper Flake
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="%23D32F2F"><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z"/></svg>`,
    // Golden Paprika Spice Spec
    `<svg width="11" height="11" viewBox="0 0 24 24" fill="%23F57C00"><rect x="4" y="4" width="16" height="16" rx="4" transform="rotate(45 12 12)"/></svg>`,
    // Purple Basil Leaf
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="%238E24AA"><path d="M17 8C8 10 5 16 5 21c7 0 13-3 15-10-1-1-2-2-3-3z"/></svg>`
  ];

  sections.forEach(section => {
    // Ensure section supports relative positioning and overflow clipping for sprinkled leaves
    if (getComputedStyle(section).position === 'static') {
      section.style.position = 'relative';
    }
    section.style.overflow = 'hidden';

    const isMenuSection = (section.id === 'full-menu');
    // Combine green leaves and colorful spice flakes, leaning towards multi-colored spices on the menu side
    const pool = isMenuSection 
      ? [...multiColorSpiceSVGs, ...multiColorSpiceSVGs, ...greenHerbSVGs]
      : [...greenHerbSVGs, ...greenHerbSVGs, ...multiColorSpiceSVGs];

    const leafCount = isMenuSection ? 14 : 10;

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'sprinkled-herb-leaf';
      
      const svg = pool[Math.floor(Math.random() * pool.length)];
      const randomTop = Math.floor(Math.random() * 84) + 6; // 6% to 90%
      const randomLeft = Math.floor(Math.random() * 80) + 6; // 6% to 86%
      const randomRotate = Math.floor(Math.random() * 360);
      const randomScale = (Math.random() * 0.6 + 0.7).toFixed(2);
      const floatDur = (Math.random() * 6 + 6).toFixed(2); // 6s to 12s float cycle duration
      const floatDelay = (Math.random() * -8).toFixed(2); // negative offset for staggered start states
      const floatX = (Math.random() * 30 - 15).toFixed(1); // -15px to +15px horizontal float
      const floatY = (Math.random() * -30 - 10).toFixed(1); // -10px to -40px vertical float

      leaf.style.position = 'absolute';
      leaf.style.top = `${randomTop}%`;
      leaf.style.left = `${randomLeft}%`;
      leaf.style.setProperty('--base-rotate', `${randomRotate}deg`);
      leaf.style.setProperty('--base-scale', `${randomScale}`);
      leaf.style.setProperty('--float-dur', `${floatDur}s`);
      leaf.style.setProperty('--float-delay', `${floatDelay}s`);
      leaf.style.setProperty('--float-x', `${floatX}px`);
      leaf.style.setProperty('--float-y', `${floatY}px`);
      leaf.style.pointerEvents = 'none';
      leaf.style.zIndex = '1';
      leaf.style.opacity = isMenuSection ? '0.75' : '0.65';

      leaf.innerHTML = decodeURIComponent(svg);
      section.appendChild(leaf);
    }
  });

  // Individual Mouse Proximity Dodge / Repel System
  const REPEL_RADIUS = 130; // Distance threshold in px
  const MAX_REPEL_FORCE = 80; // Maximum dodge distance in px

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  function animateLeafRepel() {
    const leaves = document.querySelectorAll('.sprinkled-herb-leaf');
    
    leaves.forEach(leaf => {
      const rect = leaf.getBoundingClientRect();
      const leafCenterX = rect.left + rect.width / 2;
      const leafCenterY = rect.top + rect.height / 2;

      const dx = leafCenterX - mouseX;
      const dy = leafCenterY - mouseY;
      const distance = Math.hypot(dx, dy);

      let targetX = 0;
      let targetY = 0;

      if (distance < REPEL_RADIUS && distance > 0) {
        const force = (1 - distance / REPEL_RADIUS) * MAX_REPEL_FORCE;
        targetX = (dx / distance) * force;
        targetY = (dy / distance) * force;
      }

      // Smooth linear interpolation (lerp) for fluid dodge movement
      const currentX = parseFloat(leaf.dataset.mouseX || '0');
      const currentY = parseFloat(leaf.dataset.mouseY || '0');

      const nextX = currentX + (targetX - currentX) * 0.12;
      const nextY = currentY + (targetY - currentY) * 0.12;

      if (Math.abs(nextX - currentX) > 0.05 || Math.abs(nextY - currentY) > 0.05) {
        leaf.dataset.mouseX = nextX.toFixed(2);
        leaf.dataset.mouseY = nextY.toFixed(2);
        leaf.style.setProperty('--mouse-x', `${nextX.toFixed(1)}px`);
        leaf.style.setProperty('--mouse-y', `${nextY.toFixed(1)}px`);
      }
    });

    requestAnimationFrame(animateLeafRepel);
  }

  requestAnimationFrame(animateLeafRepel);
});
