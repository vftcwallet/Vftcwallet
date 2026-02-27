
// ────────────────────────────────────────────────
// TRANSACTION STATS & HISTORY - WORKING VERSION
// Calculates Total Sent, Total Received, count, and renders list
// ────────────────────────────────────────────────

let transactions = [];

// Load transactions from localStorage for current user
function loadTransactions() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;

  const key = `transactions_${email}`;
  transactions = JSON.parse(localStorage.getItem(key)) || [];

  updateStats();
  renderTransactions();
}

// Save transactions back to localStorage
function saveTransactions() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;

  const key = `transactions_${email}`;
  localStorage.setItem(key, JSON.stringify(transactions));
}

// Update the three stats cards
function updateStats() {
  let totalSent = 0;
  let totalReceived = 0;

  transactions.forEach(tx => {
    if (tx.amount > 0) {
      totalReceived += tx.amount;
    } else {
      totalSent += Math.abs(tx.amount);
    }
  });

  // Include welcome bonus in received if not already in transactions
  const hasWelcome = transactions.some(tx => tx.type === "Welcome Bonus");
  if (!hasWelcome) {
    totalReceived += 16400.80;
  }

  // Update DOM
  document.getElementById("totalSent").textContent = 
    "₦" + totalSent.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("totalReceived").textContent = 
    "₦" + totalReceived.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("txCount").textContent = 
    transactions.length + (!hasWelcome ? 1 : 0);
}

// Render the full transaction history list
function renderTransactions() {
  const container = document.getElementById("txContainer") || document.querySelector(".empty-state");
  if (!container) return;

  if (transactions.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:#888;">
        <h3>No transactions yet</h3>
        <p>Your recent activity will appear here.</p>
      </div>
    `;
    return;
  }

  let html = '<ol style="list-style:none; padding:0; margin:0;">';
  transactions.slice().reverse().forEach(tx => {
    const isPositive = tx.amount > 0;
    const sign = isPositive ? '+' : '-';
    const color = isPositive ? '#22c55e' : '#ef4444';

    html += `
      <li style="padding:12px 16px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:600; color:${color};">${sign}${Math.abs(tx.amount).toLocaleString('en-NG', {minimumFractionDigits:2})}</div>
          <div style="font-size:13px; color:#aaa; margin-top:4px;">${tx.type || 'Transaction'}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px; color:#888;">${tx.date || '—'}</div>
          <div style="font-size:12px; color:${tx.status === 'success' ? '#22c55e' : '#ef4444'}; margin-top:2px;">
            ${tx.status || 'Pending'}
          </div>
        </div>
      </li>
    `;
  });
  html += '</ol>';
  container.innerHTML = html;
}

// Add a transaction (call this after successful send/deposit)
function addTransaction(type, amount, status = 'success') {
  const date = new Date().toLocaleString('en-NG', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  transactions.push({ type, amount, status, date });
  saveTransactions();
  updateStats();
  renderTransactions();
}

// Load on page open
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
  toggleBalance(); // keep your existing balance toggle
});

// Automatically add welcome bonus as a transaction if missing
document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("currentUserEmail");
  if (email && !transactions.some(tx => tx.type === "Welcome Bonus")) {
    addTransaction("Welcome Bonus", 16400.80, "success");
  }
});