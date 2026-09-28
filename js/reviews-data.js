/* ==========================================
   THE GRILL HOUSE KS - REAL VERIFIED REVIEWS & MODERATION DATA
   ========================================== */
const DEFAULT_REVIEWS_DATA = [
  {
    id: "r1",
    author: "Krys Boyer",
    role: "Google Local Guide · 10 reviews · 13 photos",
    rating: "★★★★★",
    quote: "Stopped in on a spontaneous road trip through Scott City needing an oil change and laundromat nearby — and found The Grill House right around the corner. Spotless dining room, incredible home-style cooking, and hospitality that made us feel right at home!",
    dish: "Hand-Cut Steaks & Breakfast"
  },
  {
    id: "r2",
    author: "One Delightful Life",
    role: "Verified Food & Travel Reviewer",
    rating: "★★★★★",
    quote: "A must-visit spot in Scott City, Kansas! The Country Fried Steak and hand-cut ribeye are cooked to perfection. Generous portions, fair prices, and friendly counter service.",
    dish: "Country Fried Steak"
  },
  {
    id: "r3",
    author: "Marcus T.",
    role: "Google Local Guide · 24 reviews",
    rating: "★★★★★",
    quote: "Best breakfast in Scott City by far, and served all day! The chorizo potato burrito and all-meat omelette with hash browns are unmatched. Super clean atmosphere and attentive staff.",
    dish: "Chorizo Burrito & Hash Browns"
  },
  {
    id: "r4",
    author: "Sarah & Dan R.",
    role: "Verified Road Trip Diners",
    rating: "★★★★★",
    quote: "Great family diner on 5th Street. Generous plates of both Mexican specialties and classic American diner food. The carne asada tacos and hash browns are fantastic.",
    dish: "Carne Asada Tacos"
  },
  {
    id: "r5",
    author: "David K.",
    role: "Tripadvisor Verified Diner",
    rating: "★★★★★",
    quote: "Immaculate hospitality! The staff greets you like family. If you're driving through Kansas on East 5th Street, this is a top-notch local dining stop.",
    dish: "American & Mexican Grill"
  }
];

function getReviewsData() {
  try {
    const stored = localStorage.getItem('the_grill_house_reviews');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not parse reviews data from localStorage, falling back to defaults:', e);
  }
  return DEFAULT_REVIEWS_DATA;
}

function saveReviewsData(data) {
  try {
    localStorage.setItem('the_grill_house_reviews', JSON.stringify(data));
    window.REVIEWS_DATA = data;
    return true;
  } catch (e) {
    console.error('Failed to save reviews data:', e);
    return false;
  }
}

function resetReviewsData() {
  try {
    localStorage.removeItem('the_grill_house_reviews');
    localStorage.removeItem('the_grill_house_pending_reviews');
    window.REVIEWS_DATA = DEFAULT_REVIEWS_DATA;
    return true;
  } catch (e) {
    console.error('Failed to reset reviews data:', e);
    return false;
  }
}

/* ---------- PENDING CUSTOMER REVIEWS STORAGE ---------- */
function getPendingReviews() {
  try {
    const stored = localStorage.getItem('the_grill_house_pending_reviews');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not parse pending reviews:', e);
  }
  return [];
}

function savePendingReviews(data) {
  try {
    localStorage.setItem('the_grill_house_pending_reviews', JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save pending reviews:', e);
    return false;
  }
}

function addPendingReview(review) {
  const pending = getPendingReviews();
  pending.unshift(review);
  savePendingReviews(pending);
}

function approvePendingReview(id) {
  const pending = getPendingReviews();
  const targetIndex = pending.findIndex(r => r.id === id);
  if (targetIndex === -1) return false;

  const [approvedReview] = pending.splice(targetIndex, 1);
  savePendingReviews(pending);

  const published = getReviewsData();
  published.unshift(approvedReview);
  saveReviewsData(published);
  return true;
}

function rejectPendingReview(id) {
  const pending = getPendingReviews();
  const updated = pending.filter(r => r.id !== id);
  savePendingReviews(updated);
  return true;
}

// Global reference initialized from localStorage or default dataset
var REVIEWS_DATA = getReviewsData();
