// ============================================================
// expense.js – Add Expense & Expense List
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  populateSidebarUser();

  const addForm  = document.getElementById('addExpenseForm');
  const listPage = document.getElementById('expenseListContainer');

  if (addForm) {
    setActiveNav('add-expense');
    // Default date = today
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    addForm.addEventListener('submit', e => handleAddExpense(e, user.id));
  }

  if (listPage) {
    setActiveNav('expenses');
    loadExpenseList(user.id);
  }

  document.querySelectorAll('#logoutBtn').forEach(btn =>
    btn.addEventListener('click', logout));
});

// ── Add expense ──────────────────────────────────────────────
async function handleAddExpense(e, userId) {
  e.preventDefault();
  hideAlert('expenseAlert');

  const title       = document.getElementById('expenseTitle').value.trim();
  const amount      = parseFloat(document.getElementById('expenseAmount').value);
  const category    = document.getElementById('expenseCategory').value;
  const description = document.getElementById('expenseDescription').value.trim();
  const date        = document.getElementById('expenseDate').value;

  if (!title || !amount || !category || !date) {
    return showAlert('expenseAlert', 'Please fill all required fields.');
  }
  if (amount <= 0) {
    return showAlert('expenseAlert', 'Amount must be greater than 0.');
  }

  const btn = document.getElementById('addExpenseBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    await apiFetch('/expenses', {
      method: 'POST',
      body: JSON.stringify({ title, amount, category, description, date, userId })
    });

    showAlert('expenseAlert', 'Expense added successfully! ✓', 'success');
    document.getElementById('addExpenseForm').reset();
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

  } catch (err) {
    showAlert('expenseAlert', err.message || 'Failed to add expense.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Add Expense';
  }
}

// ── Load expense list ────────────────────────────────────────
async function loadExpenseList(userId) {
  const tbody = document.getElementById('expenseTableBody');
  tbody.innerHTML = `<tr><td colspan="6"><div class="spinner"></div></td></tr>`;

  try {
    const expenses = await apiFetch(`/expenses/user/${userId}`);
    renderExpenseTable(expenses, userId);
    document.getElementById('expenseCount').textContent = `${expenses.length} expense(s)`;

    // Total
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('expenseTotal').textContent = formatINR(total);

    // Category filter
    populateCategoryFilter(expenses, userId);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red">
      Failed to load expenses: ${err.message}</td></tr>`;
  }
}

// ── Render expense table ─────────────────────────────────────
function renderExpenseTable(expenses, userId) {
  const tbody = document.getElementById('expenseTableBody');

  if (!expenses.length) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>No expenses found. Start adding!</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(exp => {
    const cat = getCategoryIcon(exp.category);
    return `
      <tr class="fade-in">
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="expense-cat-icon ${cat.cls}" style="width:34px;height:34px;font-size:16px;">${cat.icon}</div>
            <div>
              <div style="font-weight:600">${exp.title}</div>
              <div style="font-size:12px;color:var(--text-muted)">${exp.description || '—'}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-${exp.category.toLowerCase()}">${cat.icon} ${exp.category}</span></td>
        <td style="font-family:var(--font-display);font-weight:700;color:var(--accent)">${formatINR(exp.amount)}</td>
        <td>${formatDate(exp.date)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${exp.id}, ${userId})">
            🗑 Delete
          </button>
        </td>
      </tr>`;
  }).join('');
}

// ── Delete expense ───────────────────────────────────────────
async function deleteExpense(expenseId, userId) {
  if (!confirm('Delete this expense?')) return;
  try {
    await apiFetch(`/expenses/${expenseId}`, { method: 'DELETE' });
    await loadExpenseList(userId);
  } catch (err) {
    alert('Failed to delete: ' + err.message);
  }
}

// ── Category filter dropdown ─────────────────────────────────
function populateCategoryFilter(expenses, userId) {
  const filter = document.getElementById('categoryFilter');
  if (!filter) return;

  filter.addEventListener('change', () => {
    const selected = filter.value;
    const filtered = selected === 'All'
      ? expenses
      : expenses.filter(e => e.category === selected);
    renderExpenseTable(filtered, userId);
  });
}
