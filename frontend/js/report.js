// ============================================================
// report.js – Monthly Report page
// ============================================================

let pieChart  = null;
let barChart  = null;

const CAT_COLORS = {
  'Food':     '#ff9f40',
  'Travel':   '#36a2eb',
  'Bills':    '#ff6384',
  'Shopping': '#a855f7',
  'Others':   '#22c55e'
};

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAuth();
  if (!user) return;

  populateSidebarUser();
  setActiveNav('report');

  // Set default month/year selects
  const monthSel = document.getElementById('reportMonth');
  const yearSel  = document.getElementById('reportYear');
  monthSel.value = currentMonth();
  yearSel.value  = currentYear();

  await loadReport(user.id);

  document.getElementById('loadReportBtn').addEventListener('click', () => loadReport(user.id));
  document.getElementById('logoutBtn').addEventListener('click', logout);
});

async function loadReport(userId) {
  const month = parseInt(document.getElementById('reportMonth').value);
  const year  = parseInt(document.getElementById('reportYear').value);

  document.getElementById('reportLoading').style.display = 'block';
  document.getElementById('reportContent').style.display = 'none';

  try {
    const data = await apiFetch(`/reports/monthly?userId=${userId}&month=${month}&year=${year}`);
    renderReport(data);
  } catch (err) {
    alert('Failed to load report: ' + err.message);
  } finally {
    document.getElementById('reportLoading').style.display = 'none';
    document.getElementById('reportContent').style.display = 'block';
  }
}

function renderReport(data) {
  // Summary numbers
  document.getElementById('rTotalSpent').textContent   = formatINR(data.totalSpent);
  document.getElementById('rBudget').textContent       = formatINR(data.monthlyBudget);
  document.getElementById('rRemaining').textContent    = formatINR(data.remainingBudget);
  document.getElementById('rMonthLabel').textContent   =
    `${monthName(data.month)} ${data.year} — Report`;

  // Budget exceeded alert
  const alertBanner = document.getElementById('reportAlertBanner');
  if (data.budgetExceeded) {
    alertBanner.style.display = 'flex';
    document.getElementById('reportAlertMsg').textContent =
      `⚠️ Budget exceeded by ${formatINR(Math.abs(data.remainingBudget))} this month!`;
  } else {
    alertBanner.style.display = 'none';
  }

  // Budget progress
  const budgetBar = document.getElementById('rBudgetBar');
  const pctEl     = document.getElementById('rBudgetPct');
  if (data.monthlyBudget > 0) {
    const pct = Math.min((data.totalSpent / data.monthlyBudget) * 100, 100);
    budgetBar.style.width = pct + '%';
    budgetBar.className = 'progress-fill ' + (pct >= 100 ? 'danger' : pct >= 75 ? 'warning' : 'safe');
    pctEl.textContent = `${pct.toFixed(1)}% of budget used`;
  } else {
    budgetBar.style.width = '0%';
    pctEl.textContent = 'No budget set for this month';
  }

  // Category summary
  renderCategorySummary(data.categoryTotals, data.categoryPercentages);

  // Charts
  renderPieChart(data.categoryTotals);
  renderBarChart(data.categoryTotals);

  // Expense table
  renderReportExpenseTable(data.expenses || []);
}

// ── Category Summary ─────────────────────────────────────────
function renderCategorySummary(totals, percentages) {
  const container = document.getElementById('categorySummary');
  if (!totals || !Object.keys(totals).length) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center">No data</p>';
    return;
  }

  container.innerHTML = Object.entries(totals).map(([cat, amt]) => {
    const color = CAT_COLORS[cat] || '#999';
    const pct   = percentages[cat] || 0;
    const icon  = getCategoryIcon(cat).icon;
    return `
      <div class="cat-summary-item">
        <div class="cat-summary-left">
          <div class="cat-summary-dot" style="background:${color}"></div>
          <div>
            <div class="cat-summary-name">${icon} ${cat}</div>
            <div class="cat-summary-pct">${pct}% of total</div>
          </div>
        </div>
        <div class="cat-summary-amt">${formatINR(amt)}</div>
      </div>`;
  }).join('');
}

// ── Pie Chart ────────────────────────────────────────────────
function renderPieChart(totals) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (pieChart) pieChart.destroy();

  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const colors = labels.map(l => CAT_COLORS[l] || '#999');

  if (!labels.length) return;

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 13 } } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ₹${ctx.parsed.toLocaleString('en-IN')}`
          }
        }
      }
    }
  });
}

// ── Bar Chart ────────────────────────────────────────────────
function renderBarChart(totals) {
  const ctx = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();

  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const colors = labels.map(l => CAT_COLORS[l] || '#999');

  if (!labels.length) return;

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Amount (₹)',
        data: values,
        backgroundColor: colors.map(c => c + '88'),
        borderColor: colors,
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
          ticks: { callback: v => '₹' + v.toLocaleString('en-IN') }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── Report expense table ─────────────────────────────────────
function renderReportExpenseTable(expenses) {
  const tbody = document.getElementById('reportExpenseBody');
  if (!expenses.length) {
    tbody.innerHTML = `<tr><td colspan="5">
      <div class="empty-state"><div class="empty-icon">📭</div>
      <p>No expenses for this month.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(exp => {
    const cat = getCategoryIcon(exp.category);
    return `
      <tr>
        <td><strong>${exp.title}</strong></td>
        <td><span class="badge badge-${exp.category.toLowerCase()}">${cat.icon} ${exp.category}</span></td>
        <td style="font-weight:700;color:var(--accent)">${formatINR(exp.amount)}</td>
        <td>${formatDate(exp.date)}</td>
        <td style="font-size:13px;color:var(--text-muted)">${exp.description || '—'}</td>
      </tr>`;
  }).join('');
}
