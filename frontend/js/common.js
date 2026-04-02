// ============================================================
// common.js – Shared utilities for Smart Expense System
// ============================================================

const API_BASE = 'https://smartexpensetracker-9.onrender.com/api';

// ── Session helpers ──────────────────────────────────────────
function getUser() {
  const u = localStorage.getItem('smartExpenseUser');
  return u ? JSON.parse(u) : null;
}

function setUser(user) {
  localStorage.setItem('smartExpenseUser', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('smartExpenseUser');
  window.location.href = 'login.html';
}

// ── Auth guard: redirect to login if not logged in ───────────
function requireAuth() {
  const user = getUser();
  if (!user || !user.id) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// ── Currency formatter (INR) ─────────────────────────────────
function formatINR(amount) {
  if (amount === undefined || amount === null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

// ── Date formatter ───────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Category icon + css class ────────────────────────────────
function getCategoryIcon(category) {
  const map = {
    'Food':     { icon: '🍔', cls: 'food' },
    'Travel':   { icon: '✈️',  cls: 'travel' },
    'Bills':    { icon: '📄', cls: 'bills' },
    'Shopping': { icon: '🛍️', cls: 'shopping' },
    'Others':   { icon: '📦', cls: 'others' }
  };
  return map[category] || { icon: '💰', cls: 'others' };
}

// ── Alert helpers ────────────────────────────────────────────
function showAlert(elementId, message, type = 'error') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.textContent = message;
  if (type === 'success') {
    setTimeout(() => el.classList.remove('show'), 3000);
  }
}

function hideAlert(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.classList.remove('show');
}

// ── API fetch wrapper ────────────────────────────────────────
async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(API_BASE + url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

// ── Populate sidebar user info ───────────────────────────────
function populateSidebarUser() {
  const user = getUser();
  if (!user) return;
  const nameEl  = document.getElementById('sidebarUserName');
  const emailEl = document.getElementById('sidebarUserEmail');
  const avatarEl = document.getElementById('sidebarAvatar');
  if (nameEl)  nameEl.textContent  = user.fullName || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) avatarEl.textContent = (user.fullName || 'U')[0].toUpperCase();
}

// ── Month name ───────────────────────────────────────────────
function monthName(m) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[(m - 1)] || '';
}

// ── Current month/year ───────────────────────────────────────
function currentMonth() { return new Date().getMonth() + 1; }
function currentYear()  { return new Date().getFullYear(); }

// ── Set active nav link ──────────────────────────────────────
function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}
