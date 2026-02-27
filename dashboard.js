const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxVzCUBdC1wXD2C3YeZg_bd6ge_9RBfcSgoC4BgCT2lHMG7IBLlS4cLa4WK5UzXTpxVxA/exec";

// Get current user
const email = localStorage.getItem("currentUserEmail");
if (!email) console.warn("No user logged in");

// -------------------- TOP-UP --------------------
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxVzCUBdC1wXD2C3YeZg_bd6ge_9RBfcSgoC4BgCT2lHMG7IBLlS4cLa4WK5UzXTpxVxA/exec"; // replace with your URL

function confirmTopUp() {
  const amount = Number(document.getElementById("topUpAmount").value);
  const email = localStorage.getItem("currentUserEmail");
  
  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }
  
  if (!email) {
    alert("Login required");
    return;
  }
  
  fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deposit",
        email: email,
        amount: amount
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Deposit request sent. Waiting for approval.");
      document.getElementById("topUpModal").style.display = "none";
    })
    .catch(err => {
      console.error(err);
      alert("Request sent. Please wait for approval.");
    });
}
// -------------------- CHECK APPROVED TOP-UPS --------------------
function checkApprovedTopUps() {
  if (!email) return;
  
  fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkTopUp",
        email: email
      })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.amount) return;
      
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].balance = (users[userIndex].balance || 0) + Number(data.amount);
        localStorage.setItem("users", JSON.stringify(users));
        balance = users[userIndex].balance;
        updateBalanceDisplay();
        alert("Top-Up Approved! ₦" + Number(data.amount).toLocaleString());
      }
    })
    .catch(err => console.warn("Error checking top-ups:", err));
}

// -------------------- UPDATE BALANCE UI --------------------
let balanceVisible = false;
let balance = 0;

function updateBalanceDisplay() {
  const display = document.getElementById("balanceDisplay");
  if (!display) return;
  
  if (balanceVisible) {
    display.innerHTML = "₦" + balance.toLocaleString('en-NG', { minimumFractionDigits: 2 }) +
      '<button class="toggle-balance" onclick="toggleBalance()">🙈</button>';
  } else {
    display.innerHTML = "₦•••••••" +
      '<button class="toggle-balance" onclick="toggleBalance()">👁️</button>';
  }
}

function toggleBalance() {
  balanceVisible = !balanceVisible;
  updateBalanceDisplay();
}

// -------------------- PENDING NOTIFICATION --------------------
function showPendingNotification(amount) {
  const notif = document.getElementById("pendingNotification");
  const info = document.getElementById("pendingInfo");
  
  if (amount > 0) {
    info.textContent = `₦${amount.toLocaleString()} awaiting approval`;
    notif.style.display = "block";
  } else {
    notif.style.display = "none";
  }
}

// -------------------- INITIAL LOAD --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Load balance from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email);
  if (user) balance = user.balance || 0;
  
  updateBalanceDisplay();
  
  // Poll approved top-ups every 5s
  setInterval(checkApprovedTopUps, 5000);
});


