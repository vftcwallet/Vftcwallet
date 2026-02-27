
// Transaction history - full working version
let transactions = [];

// Load transactions for current user
function loadTransactions() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;

  const key = `transactions_${email}`;
  transactions = JSON.parse(localStorage.getItem(key)) || [];

  renderTransactions();
  updateClearButtonVisibility();
}

// Save transactions
function saveTransactions() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;

  const key = `transactions_${email}`;
  localStorage.setItem(key, JSON.stringify(transactions));
}

// Render transactions
function renderTransactions() {
  const container = document.querySelector(".card1 .empty-state");
  if (!container) return;

  if (transactions.length === 0) {
    container.innerHTML = `
      <ol>
        <div class="icon"></div>
        <li><p><h3>No transactions yet</h3></p></li>
      </ol>
    `;
  } else {
    let html = '<ol>';
    transactions.slice().reverse().forEach(tx => {
      const isPositive = tx.amount > 0;
      const sign = isPositive ? '+' : '-';
      const color = isPositive ? '#00c853' : '#ff6b6b';

      html += `
        <li style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #333;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: ${color};">${sign}${Math.abs(tx.amount).toLocaleString('en-NG', {minimumFractionDigits: 2})}</strong>
              <br>
              <small style="color: #888;">${tx.date}</small>
            </div>
            <div style="text-align: right;">
              <div>${tx.type}</div>
              <small style="color: ${tx.status === 'success' ? '#00c853' : '#ff6b6b'};">${tx.status}</small>
            </div>
          </div>
        </li>
      `;
    });
    html += '</ol>';
    container.innerHTML = html;
  }

  updateClearButtonVisibility();
}

// Show/hide clear button based on transactions
function updateClearButtonVisibility() {
  const btn = document.getElementById("clearHistoryBtn");
  if (btn) {
    btn.style.display = transactions.length > 0 ? 'inline-block' : 'none';
  }
}

// Add a transaction (call this from airtime, transfer, etc.)
function addTransaction(type, amount, status = 'success') {
  const date = new Date().toLocaleString('en-NG', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  transactions.push({ type, amount, status, date });
  saveTransactions();
  renderTransactions();
}

// Clear history
document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clearHistoryBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear all transaction history?\nThis cannot be undone.")) {
        const email = localStorage.getItem("currentUserEmail");
        if (email) {
          const key = `transactions_${email}`;
          localStorage.removeItem(key);
          transactions = [];
          renderTransactions();
          alert("Transaction history cleared!");
        }
      }
    });
  }

  // Load on page start
  loadTransactions();
});
