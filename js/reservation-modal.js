/* ==========================================
   THE GRILL HOUSE KS - RESERVATION MODAL LOGIC
   ========================================== */

function openReservationModal() {
  const modal = document.getElementById('reservation-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeReservationModal() {
  const modal = document.getElementById('reservation-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('reservation-modal');
  if (!modal) return;

  // Set minimum date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  // Close modal when clicking outside content box
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeReservationModal();
    }
  });

  // ESC key handler for reservation modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeReservationModal();
    }
  });

  // Handle form submission
  const form = document.getElementById('reservation-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name')?.value || 'Guest';
      const guests = document.getElementById('res-guests')?.value || '2';
      const date = document.getElementById('res-date')?.value || 'Today';
      const time = document.getElementById('res-time')?.value || '6:00 PM';
      
      alert(`Thank you, ${name}! Your table request for ${guests} guest(s) on ${date} at ${time} has been submitted. We will call you to confirm!`);
      form.reset();
      closeReservationModal();
    });
  }
});
