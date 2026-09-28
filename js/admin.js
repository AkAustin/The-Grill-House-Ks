/* ==========================================
   THE GRILL HOUSE KS - ADMIN CONTROLLER LOGIC
   ========================================== */

let currentEditingDishId = null;
let currentEditingReviewId = null;
let isFormLocked = false;

// Dynamic arrays for chip management in the dish form
let currentIngredients = [];
let currentDietary = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminDashboard();
});

function checkAdminAuth() {
  const overlay = document.getElementById('admin-auth-overlay');
  if (!overlay) return;
  
  const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  if (!isAuthenticated) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const pinInput = document.getElementById('admin-pin-input');
      if (pinInput) pinInput.focus();
    }, 100);
  } else {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function handleAdminAuthSubmit(event) {
  event.preventDefault();
  const pinInput = document.getElementById('admin-pin-input');
  const errorMsg = document.getElementById('admin-auth-error');
  const overlay = document.getElementById('admin-auth-overlay');
  
  const pinVal = pinInput ? pinInput.value.trim() : '';
  // Default PIN: 1234
  if (pinVal === '1234' || pinVal === 'admin' || pinVal === '2026') {
    sessionStorage.setItem('admin_authenticated', 'true');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (errorMsg) errorMsg.style.display = 'none';
    if (pinInput) pinInput.value = '';
    showToast('Welcome, Admin! Dashboard unlocked.', '🔓');
  } else {
    if (errorMsg) errorMsg.style.display = 'block';
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
  }
}

function lockAdminDashboard() {
  sessionStorage.removeItem('admin_authenticated');
  showToast('Admin session locked.', '🔒');
  setTimeout(() => {
    checkAdminAuth();
  }, 300);
}

function initAdminDashboard() {
  // Tab Switcher Handler
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = content.id === `tab-${targetTab}` ? 'block' : 'none';
      });
    });
  });

  // Render initial tables
  renderAdminDishes();
  renderAdminReviews();
  loadAdminSettings();

  // Wire Dish Form
  const dishForm = document.getElementById('admin-dish-form');
  if (dishForm) {
    dishForm.addEventListener('submit', handleSaveDish);
  }

  // Wire Review Form
  const reviewForm = document.getElementById('admin-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleSaveReview);
  }

  // Wire Local File Upload Input for Dish Image
  const fileInput = document.getElementById('dish-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (isFormLocked) return;
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          const dataUrl = evt.target.result;
          const urlInput = document.getElementById('dish-image');
          if (urlInput) urlInput.value = dataUrl;
          updateImagePreview(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const urlInput = document.getElementById('dish-image');
  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      if (!isFormLocked) {
        updateImagePreview(e.target.value.trim());
      }
    });
  }

  // Wire Ingredient Chip Field
  const ingInput = document.getElementById('ingredient-chip-input');
  if (ingInput) {
    ingInput.addEventListener('keydown', (e) => {
      if (isFormLocked) return;
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = ingInput.value.trim().replace(/^,|,$/g, '');
        if (val && !currentIngredients.includes(val)) {
          currentIngredients.push(val);
          renderIngredientChips();
          ingInput.value = '';
        }
      }
    });
  }

  // Wire Dietary Chip Field
  const dietInput = document.getElementById('dietary-chip-input');
  if (dietInput) {
    dietInput.addEventListener('keydown', (e) => {
      if (isFormLocked) return;
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = dietInput.value.trim().replace(/^,|,$/g, '');
        if (val && !currentDietary.includes(val)) {
          currentDietary.push(val);
          renderDietaryChips();
          dietInput.value = '';
        }
      }
    });
  }
}

function updateImagePreview(src) {
  const container = document.getElementById('image-preview-container');
  const preview = document.getElementById('dish-image-preview');
  if (container && preview) {
    if (src) {
      preview.src = src;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  }
}

/* ---------- RENDER DISHES TABLE ---------- */
function renderAdminDishes() {
  const container = document.getElementById('admin-dishes-list');
  if (!container) return;

  const menuData = typeof getMenuData === 'function' ? getMenuData() : (window.MENU_DATA || []);

  if (menuData.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--color-ink-soft);">No dishes found. Click "Add New Dish" to create one!</td></tr>`;
    return;
  }

  container.innerHTML = menuData.map(dish => `
    <tr onclick="viewDish('${dish.id}')" title="Click row to inspect dish details in locked mode">
      <td>
        <img class="admin-dish-thumb" src="${dish.image || 'images/handcut-ribeye.jpg'}" alt="${dish.name}" onerror="this.src='images/handcut-ribeye.jpg'">
      </td>
      <td>
        <div class="admin-dish-info">
          <h4>${dish.name} ${dish.badge ? `<span class="badge badge-barn" style="font-size:0.65rem; padding:2px 6px;">${dish.badge}</span>` : ''}</h4>
          <p>${dish.description}</p>
        </div>
      </td>
      <td><span class="badge" style="text-transform:capitalize;">${dish.category}</span></td>
      <td><strong>${dish.price}</strong></td>
      <td>
        <div class="admin-actions-cell">
          <button type="button" class="btn btn-wheat btn-icon" onclick="editDish('${dish.id}', event)">✏️ Edit</button>
          <button type="button" class="btn btn-barn btn-icon" onclick="event.stopPropagation(); deleteDish('${dish.id}')">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ---------- DISH VIEW & EDIT MODES ---------- */
function resetDishForm() {
  currentEditingDishId = null;
  isFormLocked = false;

  const form = document.getElementById('admin-dish-form');
  if (form) form.reset();
  
  currentIngredients = ['Fresh Local Ingredients', 'House Seasoning'];
  currentDietary = ['Fresh Preparation'];
  
  updateImagePreview('');

  // Enable all inputs
  const inputs = document.querySelectorAll('#admin-dish-form input, #admin-dish-form select, #admin-dish-form textarea');
  inputs.forEach(input => {
    input.disabled = false;
    input.readOnly = false;
  });

  renderIngredientChips();
  renderDietaryChips();

  const titleEl = document.getElementById('form-dish-title');
  if (titleEl) titleEl.textContent = 'Add New Dish';

  const lockStatus = document.getElementById('form-lock-status');
  const lockText = document.getElementById('lock-status-text');
  const unlockBtn = document.getElementById('unlock-dish-btn');
  const saveBtn = document.getElementById('save-dish-btn');

  if (lockStatus) lockStatus.className = 'lock-status-banner is-new';
  if (lockText) lockText.innerHTML = '🔓 Unlocked &mdash; Creating New Dish';
  if (unlockBtn) unlockBtn.style.display = 'none';
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.style.opacity = '1';
    saveBtn.style.cursor = 'pointer';
    saveBtn.textContent = 'Save New Dish';
  }
}

function viewDish(id) {
  const menuData = typeof getMenuData === 'function' ? getMenuData() : (window.MENU_DATA || []);
  const dish = menuData.find(d => d.id === id);
  if (!dish) return;

  currentEditingDishId = dish.id;

  document.getElementById('dish-name').value = dish.name || '';
  document.getElementById('dish-category').value = dish.category || 'breakfast';
  document.getElementById('dish-price').value = dish.price || '$10.00';
  document.getElementById('dish-description').value = dish.description || '';
  document.getElementById('dish-badge').value = dish.badge || '';
  document.getElementById('dish-image').value = dish.image || '';
  document.getElementById('dish-calories').value = dish.calories || '~750 kcal';
  document.getElementById('dish-prep').value = dish.prepInfo || 'Flame-grilled to order';

  currentIngredients = Array.isArray(dish.ingredients) ? [...dish.ingredients] : ['Fresh Local Ingredients'];
  currentDietary = Array.isArray(dish.dietary) ? [...dish.dietary] : ['Fresh Preparation'];

  updateImagePreview(dish.image || '');

  lockDishForm(`🔒 Locked (Read-Only) &mdash; Inspecting "${dish.name}"`);
}

function lockDishForm(statusMsg) {
  isFormLocked = true;

  const inputs = document.querySelectorAll('#admin-dish-form input, #admin-dish-form select, #admin-dish-form textarea');
  inputs.forEach(input => {
    if (input.type !== 'button' && input.type !== 'submit') {
      if (input.tagName === 'SELECT' || input.type === 'file') {
        input.disabled = true;
      } else {
        input.readOnly = true;
      }
    }
  });

  renderIngredientChips();
  renderDietaryChips();

  const lockStatus = document.getElementById('form-lock-status');
  const lockText = document.getElementById('lock-status-text');
  const unlockBtn = document.getElementById('unlock-dish-btn');
  const saveBtn = document.getElementById('save-dish-btn');
  const titleEl = document.getElementById('form-dish-title');

  if (lockStatus) lockStatus.className = 'lock-status-banner is-locked';
  if (lockText) lockText.innerHTML = statusMsg || '🔒 Form Locked (Read-Only)';
  if (unlockBtn) unlockBtn.style.display = 'inline-block';
  if (titleEl) titleEl.textContent = `Inspect Dish Details`;
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.style.opacity = '0.5';
    saveBtn.style.cursor = 'not-allowed';
  }

  const formBox = document.getElementById('dish-form-card');
  if (formBox) formBox.scrollIntoView({ behavior: 'smooth' });
}

function unlockDishForm() {
  if (!currentEditingDishId) return;

  isFormLocked = false;
  const inputs = document.querySelectorAll('#admin-dish-form input, #admin-dish-form select, #admin-dish-form textarea');
  inputs.forEach(input => {
    input.disabled = false;
    input.readOnly = false;
  });

  renderIngredientChips();
  renderDietaryChips();

  const lockStatus = document.getElementById('form-lock-status');
  const lockText = document.getElementById('lock-status-text');
  const unlockBtn = document.getElementById('unlock-dish-btn');
  const saveBtn = document.getElementById('save-dish-btn');
  const titleEl = document.getElementById('form-dish-title');

  if (lockStatus) lockStatus.className = 'lock-status-banner is-editing';
  if (lockText) lockText.innerHTML = '✏️ Unlocked &mdash; Editing Dish Details';
  if (unlockBtn) unlockBtn.style.display = 'none';
  if (titleEl) titleEl.textContent = `Edit Dish Details`;
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.style.opacity = '1';
    saveBtn.style.cursor = 'pointer';
    saveBtn.textContent = 'Save Dish Changes';
  }
}

function editDish(id, event) {
  if (event) event.stopPropagation();
  viewDish(id);
  unlockDishForm();
}

function renderIngredientChips() {
  const container = document.getElementById('ingredients-chips-list');
  if (!container) return;
  
  container.innerHTML = currentIngredients.map((item, idx) => `
    <span class="chip-tag-item">
      • ${item}
      ${!isFormLocked ? `<span class="chip-remove-btn" onclick="removeIngredientChip(${idx})">&times;</span>` : ''}
    </span>
  `).join('');
}

function removeIngredientChip(index) {
  if (isFormLocked) return;
  currentIngredients.splice(index, 1);
  renderIngredientChips();
}

function renderDietaryChips() {
  const container = document.getElementById('dietary-chips-list');
  if (!container) return;

  container.innerHTML = currentDietary.map((item, idx) => `
    <span class="chip-tag-item" style="background-color: rgba(139,38,26,0.1); border-color: var(--color-barn); color: var(--color-barn);">
      ${item}
      ${!isFormLocked ? `<span class="chip-remove-btn" onclick="removeDietaryChip(${idx})">&times;</span>` : ''}
    </span>
  `).join('');
}

function removeDietaryChip(index) {
  if (isFormLocked) return;
  currentDietary.splice(index, 1);
  renderDietaryChips();
}

function handleSaveDish(e) {
  e.preventDefault();
  if (isFormLocked) return;

  const name = document.getElementById('dish-name').value.trim();
  const category = document.getElementById('dish-category').value;
  const price = document.getElementById('dish-price').value.trim();
  const description = document.getElementById('dish-description').value.trim();
  const badge = document.getElementById('dish-badge').value.trim();
  const image = document.getElementById('dish-image').value.trim() || 'images/handcut-ribeye.jpg';
  const calories = document.getElementById('dish-calories').value.trim() || '~750 kcal';
  const prepInfo = document.getElementById('dish-prep').value.trim() || 'Flame-grilled to order';

  if (!name || !price || !description) {
    alert('Please fill out dish name, price, and description.');
    return;
  }

  const menuData = typeof getMenuData === 'function' ? getMenuData() : (window.MENU_DATA || []);
  let updatedMenu = [...menuData];

  if (currentEditingDishId) {
    // Edit existing dish
    const index = updatedMenu.findIndex(d => d.id === currentEditingDishId);
    if (index !== -1) {
      updatedMenu[index] = {
        ...updatedMenu[index],
        name,
        category,
        price,
        description,
        badge,
        image,
        calories,
        prepInfo,
        ingredients: currentIngredients.length ? [...currentIngredients] : ['Fresh Ingredients'],
        dietary: currentDietary.length ? [...currentDietary] : ['Fresh Preparation']
      };
    }
  } else {
    // Create new dish
    const newId = `custom-${Date.now()}`;
    const newDish = {
      id: newId,
      name,
      category,
      price,
      description,
      badge,
      featured: false,
      image,
      calories,
      prepInfo,
      ingredients: currentIngredients.length ? [...currentIngredients] : ['Fresh Local Ingredients'],
      dietary: currentDietary.length ? [...currentDietary] : ['Fresh Preparation']
    };
    updatedMenu.unshift(newDish);
  }

  if (typeof saveMenuData === 'function') {
    saveMenuData(updatedMenu);
  } else {
    localStorage.setItem('the_grill_house_menu', JSON.stringify(updatedMenu));
    window.MENU_DATA = updatedMenu;
  }

  renderAdminDishes();
  resetDishForm();
  showToast(currentEditingDishId ? 'Dish updated successfully!' : 'New dish added to website menu!', '🎉');
}

function deleteDish(id) {
  const menuData = typeof getMenuData === 'function' ? getMenuData() : (window.MENU_DATA || []);
  const target = menuData.find(d => d.id === id);
  if (!target) return;

  showDeleteConfirmModal(
    `Warning: Are you sure you want to delete "${target.name}"? This action will permanently remove it from the website menu.`,
    () => {
      const updatedMenu = menuData.filter(d => d.id !== id);
      
      if (typeof saveMenuData === 'function') {
        saveMenuData(updatedMenu);
      } else {
        localStorage.setItem('the_grill_house_menu', JSON.stringify(updatedMenu));
        window.MENU_DATA = updatedMenu;
      }

      renderAdminDishes();
      if (currentEditingDishId === id) resetDishForm();
      showToast(`"${target.name}" has been deleted.`, '🗑️');
    },
    'Warning: Delete Dish',
    'YES, Delete Dish'
  );
}

/* ---------- REVIEWS & MODERATION MANAGEMENT ---------- */
function renderAdminPendingReviews() {
  const container = document.getElementById('admin-pending-reviews-list');
  const countBadge = document.getElementById('pending-count-badge');
  if (!container) return;

  const pending = typeof getPendingReviews === 'function' ? getPendingReviews() : [];

  if (countBadge) {
    countBadge.textContent = `${pending.length} Pending`;
  }

  if (pending.length === 0) {
    container.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--color-ink-soft);">No pending customer reviews awaiting approval.</td></tr>`;
    return;
  }

  container.innerHTML = pending.map(rev => `
    <tr>
      <td><strong>${rev.author}</strong><br><small style="color:var(--color-ink-soft);">${rev.role || 'Verified Customer'}</small></td>
      <td>
        <span style="color:var(--color-barn); letter-spacing:1px; display:block;">${rev.rating}</span>
        <small style="color:var(--color-ink-soft);">${rev.dish || 'Grill Specialty'}</small>
      </td>
      <td><p style="margin:0; font-size:0.85rem; max-width:32ch; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"${rev.quote}"</p></td>
      <td>
        <div class="admin-actions-cell">
          <button type="button" class="btn btn-wheat btn-icon" style="background-color:var(--color-status-green); color:#fff !important; border:none;" onclick="approveReviewAction('${rev.id}')">✅ Approve</button>
          <button type="button" class="btn btn-barn btn-icon" onclick="rejectReviewAction('${rev.id}')">❌ Reject</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function approveReviewAction(id) {
  if (typeof approvePendingReview === 'function') {
    approvePendingReview(id);
    renderAdminPendingReviews();
    renderAdminReviews();
    showToast('Customer review approved and published to website!', '🎉');
  }
}

function rejectReviewAction(id) {
  showDeleteConfirmModal(
    'Are you sure you want to reject and discard this pending customer review?',
    () => {
      if (typeof rejectPendingReview === 'function') {
        rejectPendingReview(id);
        renderAdminPendingReviews();
        showToast('Pending review rejected.', '🗑️');
      }
    },
    'Warning: Reject Review',
    'YES, Reject'
  );
}

function renderAdminReviews() {
  renderAdminPendingReviews();

  const container = document.getElementById('admin-reviews-list');
  if (!container) return;

  const reviews = typeof getReviewsData === 'function' ? getReviewsData() : (window.REVIEWS_DATA || []);

  container.innerHTML = reviews.map(rev => `
    <tr>
      <td><strong>${rev.author}</strong><br><small style="color:var(--color-ink-soft);">${rev.role}</small></td>
      <td><span style="color:var(--color-barn); letter-spacing:1px;">${rev.rating}</span></td>
      <td><p style="margin:0; font-size:0.85rem; max-width:36ch; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"${rev.quote}"</p></td>
      <td>
        <button type="button" class="btn btn-barn btn-icon" onclick="deleteReview('${rev.id}')">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleSaveReview(e) {
  e.preventDefault();

  const author = document.getElementById('rev-author').value.trim();
  const role = document.getElementById('rev-role').value.trim() || 'Verified Customer';
  const rating = document.getElementById('rev-rating').value;
  const quote = document.getElementById('rev-quote').value.trim();
  const dish = document.getElementById('rev-dish').value.trim() || 'American & Mexican Grill';

  if (!author || !quote) {
    alert('Please enter reviewer name and quote.');
    return;
  }

  const reviews = typeof getReviewsData === 'function' ? getReviewsData() : (window.REVIEWS_DATA || []);
  const newRev = {
    id: `rev-${Date.now()}`,
    author,
    role,
    rating,
    quote,
    dish
  };

  const updatedReviews = [newRev, ...reviews];
  if (typeof saveReviewsData === 'function') {
    saveReviewsData(updatedReviews);
  } else {
    localStorage.setItem('the_grill_house_reviews', JSON.stringify(updatedReviews));
    window.REVIEWS_DATA = updatedReviews;
  }

  renderAdminReviews();
  document.getElementById('admin-review-form').reset();
  showToast('New review published to main website!', '⭐');
}

function deleteReview(id) {
  const reviews = typeof getReviewsData === 'function' ? getReviewsData() : (window.REVIEWS_DATA || []);
  showDeleteConfirmModal(
    'Are you sure you want to delete this customer review from the website?',
    () => {
      const updated = reviews.filter(r => r.id !== id);
      if (typeof saveReviewsData === 'function') {
        saveReviewsData(updated);
      } else {
        localStorage.setItem('the_grill_house_reviews', JSON.stringify(updated));
        window.REVIEWS_DATA = updated;
      }
      renderAdminReviews();
      showToast('Review deleted.', '🗑️');
    },
    'Warning: Delete Review',
    'YES, Delete'
  );
}

/* ---------- SETTINGS & BACKUP / RESET ---------- */
function loadAdminSettings() {
  const phone = localStorage.getItem('the_grill_house_phone') || '(620) 909-2090';
  const notice = localStorage.getItem('the_grill_house_notice') || 'OPEN TODAY · DINE-IN & TAKEAWAY';

  const phoneEl = document.getElementById('settings-phone');
  const noticeEl = document.getElementById('settings-notice');

  if (phoneEl) phoneEl.value = phone;
  if (noticeEl) noticeEl.value = notice;
}

function saveAdminSettings(e) {
  if (e) e.preventDefault();
  const phone = document.getElementById('settings-phone')?.value.trim();
  const notice = document.getElementById('settings-notice')?.value.trim();

  if (phone) localStorage.setItem('the_grill_house_phone', phone);
  if (notice) localStorage.setItem('the_grill_house_notice', notice);

  showToast('Website settings saved!', '⚙️');
}

function exportDataJSON(type) {
  let data, filename;
  if (type === 'menu') {
    data = typeof getMenuData === 'function' ? getMenuData() : [];
    filename = 'menu-data.json';
  } else {
    data = typeof getReviewsData === 'function' ? getReviewsData() : [];
    filename = 'reviews-data.json';
  }

  const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", str);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast(`Exported ${filename}`, '📥');
}

function confirmFactoryReset() {
  showDeleteConfirmModal(
    'Are you sure you want to reset all dishes and reviews to factory default settings? Custom added items will be permanently erased.',
    () => {
      if (typeof resetMenuData === 'function') resetMenuData();
      if (typeof resetReviewsData === 'function') resetReviewsData();
      
      localStorage.removeItem('the_grill_house_phone');
      localStorage.removeItem('the_grill_house_notice');

      renderAdminDishes();
      renderAdminReviews();
      loadAdminSettings();
      resetDishForm();

      showToast('Factory reset complete! Restored original menu.', '🔄');
    },
    'Warning: Restore Factory Defaults',
    'YES, Reset Everything'
  );
}

/* ---------- CENTERED DELETE CONFIRMATION WARNING MODAL ---------- */
function showDeleteConfirmModal(message, onConfirm, title = 'Warning: Confirm Deletion', yesText = 'YES, Delete') {
  const modal = document.getElementById('delete-confirm-modal');
  const titleEl = document.getElementById('delete-confirm-title');
  const msgEl = document.getElementById('delete-confirm-message');
  const yesBtn = document.getElementById('confirm-delete-yes');
  const noBtn = document.getElementById('confirm-delete-no');

  if (!modal) {
    if (window.confirm(message)) {
      onConfirm();
    }
    return;
  }

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (yesBtn) yesBtn.textContent = yesText;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const cleanup = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  yesBtn.onclick = () => {
    cleanup();
    if (typeof onConfirm === 'function') onConfirm();
  };

  noBtn.onclick = () => {
    cleanup();
  };

  modal.onclick = (e) => {
    if (e.target === modal) cleanup();
  };
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function showToast(message, icon = '✅') {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
