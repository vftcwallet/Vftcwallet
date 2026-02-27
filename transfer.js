
// Handle Proceed to transfer (with balance deduction + transaction history)
document.getElementById('proceedBtn').addEventListener('click', function() {
  if (this.disabled) return;

  // Get amount (remove commas)
  const amountStr = document.getElementById('amount').value.trim().replace(/,/g, '');
  const amount = parseFloat(amountStr) || 0;

  if (amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const email = localStorage.getItem("currentUserEmail");
  if (!email) {
    alert("Please log in first");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    alert("User not found");
    return;
  }

  let userBalance = users[userIndex].balance || 0;

  if (amount > userBalance) {
    alert("Insufficient balance");
    return;
  }

  // Deduct amount
  users[userIndex].balance = userBalance - amount;
  localStorage.setItem("users", JSON.stringify(users));

  // Update global balance variable (if you use it)
  balance = users[userIndex].balance;

  // Refresh balance display
  document.getElementById('balanceDisplay').innerHTML = 
    formatBalance(balance) + '<button class="toggle-balance" onclick="toggleBalance()">👁️</button>';

  // Add to transaction history (negative amount = sent)
  addTransaction("Transfer", -amount, "success");

  // Go to processing page
  window.location.href = 'processing-withdrawal.html';
});
