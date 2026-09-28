/* ==========================================
   THE GRILL HOUSE KS - THEME TOGGLE SYSTEM (LIGHT / DARK)
   ========================================== */

(function() {
  // Apply theme immediately on script execution to prevent theme flash
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);
})();

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButtonUI(newTheme);
}

function updateThemeButtonUI(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const isDark = (theme === 'dark');
  btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);

  const iconEl = btn.querySelector('.theme-icon');
  const labelEl = btn.querySelector('.theme-label');

  if (iconEl) iconEl.textContent = isDark ? '🌙' : '☀️';
  if (labelEl) labelEl.textContent = isDark ? 'Dark' : 'Light';
}

document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeButtonUI(currentTheme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
});
