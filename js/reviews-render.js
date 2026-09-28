/* ==========================================
   THE GRILL HOUSE KS - REVIEWS RENDERER & SUBMISSION
   ========================================== */

/**
 * Render real customer reviews into target container
 * @param {Array} reviews - List of review objects
 * @param {HTMLElement} container - DOM element target
 */
function renderReviews(reviews, container) {
  if (!container || !reviews) return;

  container.innerHTML = reviews.map(rev => `
    <div class="review-slider-card">
      <div>
        <div class="review-stars">${rev.rating}</div>
        <p class="review-quote">"${rev.quote}"</p>
      </div>
      <div>
        <div class="review-author">${rev.author}<small>${rev.role}</small></div>
        ${rev.dish ? `<span class="badge" style="margin-top: 10px; font-size: 0.72rem;">Praising: ${rev.dish}</span>` : ''}
      </div>
    </div>
  `).join('');
}

/**
 * Scroll reviews slider sideways
 * @param {number} direction - Multiplier (-1 for left, 1 for right)
 */
function scrollReviewsSlider(direction) {
  const row = document.querySelector('.reviews-slider-row');
  if (row) {
    const scrollAmount = 360 * direction;
    row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

/* ---------- CUSTOMER REVIEW SUBMISSION MODAL ---------- */
function openReviewModal() {
  const modal = document.getElementById('customer-review-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeReviewModal() {
  const modal = document.getElementById('customer-review-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('reviews-slider-container');
  if (container) {
    const reviews = typeof getReviewsData === 'function' ? getReviewsData() : (window.REVIEWS_DATA || []);
    renderReviews(reviews, container);
  }

  const reviewModal = document.getElementById('customer-review-modal');
  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) {
        closeReviewModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reviewModal.style.display === 'flex') {
        closeReviewModal();
      }
    });
  }

  const form = document.getElementById('customer-review-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cust-rev-name')?.value.trim();
      const role = document.getElementById('cust-rev-role')?.value.trim() || 'Verified Customer';
      const rating = document.getElementById('cust-rev-rating')?.value || '★★★★★';
      const dish = document.getElementById('cust-rev-dish')?.value.trim() || 'Grill Specialty';
      const quote = document.getElementById('cust-rev-quote')?.value.trim();

      if (!name || !quote) {
        alert('Please fill out your name and review message.');
        return;
      }

      const pendingReview = {
        id: `pending-${Date.now()}`,
        author: name,
        role: role,
        rating: rating,
        dish: dish,
        quote: quote,
        submittedAt: new Date().toLocaleDateString()
      };

      if (typeof addPendingReview === 'function') {
        addPendingReview(pendingReview);
      } else {
        const stored = JSON.parse(localStorage.getItem('the_grill_house_pending_reviews') || '[]');
        stored.unshift(pendingReview);
        localStorage.setItem('the_grill_house_pending_reviews', JSON.stringify(stored));
      }

      alert(`Thank you, ${name}! Your review has been submitted to store management for approval. Once confirmed, it will appear on our website!`);
      form.reset();
      closeReviewModal();
    });
  }
});
