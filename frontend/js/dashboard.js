// ============================================================
// dashboard.js – Dashboard page logic
// ============================================================

let monthlyChart = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAuth();
  if (!user) return;

  populateSidebarUser();
  setActiveNav('dashboard');

  document.getElementById('welcomeName').textContent = user.fullName.split(' ')[0];

  await loadDashboard(user.id);
  await loadBudgetSection(user.id);

  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('saveBudgetBtn').addEventListener('click', () => saveBudget(user.id));
});

// ── Load dashboard stats + recent expenses ───────────────────
async function loadDashboard(userId) {
  try {
    const data = await apiFetch(`/expenses/dashboard/${userId}`);

    document.getElementById('totalExpenses').textContent   = formatINR(data.totalExpenses);
    document.getElementById('todayExpenses').textContent   = formatINR(data.todayExpenses);
    document.getElementById('monthlyBudget').textContent   = formatINR(data.monthlyBudget);
    document.getElementById('budgetLeft').textContent      = formatINR(data.budgetLeft);
    document.getElementById('spentThisMonth').textContent  = formatINR(data.spentThisMonth);

    // Budget progress bar
    updateBudgetProgress(data.spentThisMonth, data.monthlyBudget);

    // Budget alert
    if (data.budgetExceeded) {
      document.getElementById('budgetAlertBanner').style.display = 'flex';
      document.getElementById('budgetAlertAmt').textContent =
        `You have exceeded your budget by ${formatINR(Math.abs(data.budgetLeft))}!`;
    } else {
      document.getElementById('budgetAlertBanner').style.display = 'none';
    }

    // Recent expenses
    renderRecentExpenses(data.recentExpenses || []);

    // Monthly chart
    await loadMonthlyChart(userId);

  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

// ── Render recent expenses list ──────────────────────────────
function renderRecentExpenses(expenses) {
  const container = document.getElementById('recentExpenses');
  if (!expenses.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧾</div>
        <p>No expenses yet. Add your first expense!</p>
      </div>`;
    return;
  }

  container.innerHTML = expenses.map(exp => {
    const cat = getCategoryIcon(exp.category);
    return `
      <div class="expense-item fade-in">
        <div class="expense-left">
          <div class="expense-cat-icon ${cat.cls}">${cat.icon}</div>
          <div>
            <div class="expense-title">${exp.title}</div>
            <div class="expense-date">${formatDate(exp.date)} · ${exp.category}</div>
          </div>
        </div>
        <div class="expense-amount">-${formatINR(exp.amount)}</div>
      </div>`;
  }).join('');
}

// ── Budget progress bar ──────────────────────────────────────
function updateBudgetProgress(spent, budget) {
  const bar = document.getElementById('budgetProgressFill');
  const pctEl = document.getElementById('budgetProgressPct');
  if (!bar) return;

  if (!budget || budget === 0) {
    bar.style.width = '0%';
    bar.className = 'progress-fill safe';
    if (pctEl) pctEl.textContent = 'No budget set';
    return;
  }

  const pct = Math.min((spent / budget) * 100, 100);
  bar.style.width = pct + '%';
  if (pct >= 100)      bar.className = 'progress-fill danger';
  else if (pct >= 75)  bar.className = 'progress-fill warning';
  else                 bar.className = 'progress-fill safe';

  if (pctEl) pctEl.textContent = `${pct.toFixed(1)}% used`;
}

// ── Load monthly chart (last 6 months bar chart) ─────────────
async function loadMonthlyChart(userId) {
  const labels = [];
  const values = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    labels.push(monthName(m) + ' ' + y);
    try {
      const report = await apiFetch(`/reports/monthly?userId=${userId}&month=${m}&year=${y}`);
      values.push(report.totalSpent || 0);
    } catch { values.push(0); }
  }

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Spending (₹)',
        data: values,
        backgroundColor: 'rgba(108, 71, 255, 0.15)',
        borderColor: '#6c47ff',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => '₹ ' + ctx.parsed.y.toLocaleString('en-IN')
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f0f0f8' },
          ticks: {
            callback: val => '₹' + val.toLocaleString('en-IN')
          }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── Load & display current budget in the set-budget form ─────
async function loadBudgetSection(userId) {
  const m = currentMonth();
  const y = currentYear();
  try {
    const budget = await apiFetch(`/budgets?userId=${userId}&month=${m}&year=${y}`);
    if (budget.amount > 0) {
      document.getElementById('budgetInput').value = budget.amount;
      document.getElementById('budgetMonthLabel').textContent =
        `Budget for ${monthName(m)} ${y}: ${formatINR(budget.amount)}`;
    }
  } catch (err) { /* no budget set yet */ }
}

// ── Save budget ──────────────────────────────────────────────
async function saveBudget(userId) {
  const amount = parseFloat(document.getElementById('budgetInput').value);
  if (!amount || amount <= 0) {
    return showAlert('budgetAlert', 'Please enter a valid budget amount.');
  }
  hideAlert('budgetAlert');

  const btn = document.getElementById('saveBudgetBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    await apiFetch('/budgets', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        month: currentMonth(),
        year:  currentYear(),
        userId
      })
    });
    showAlert('budgetAlert', 'Budget saved successfully!', 'success');
    await loadDashboard(userId);
    await loadBudgetSection(userId);
  } catch (err) {
    showAlert('budgetAlert', err.message || 'Failed to save budget.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Budget';
  }
}
