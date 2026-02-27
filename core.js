

 // Load profile picture in dashboard
document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;
  
  const pic = localStorage.setItem(`profilePic_${email}`, ev.target.result);
  const img = document.getElementById("dashboardProfilePic");
  const placeholder = document.getElementById("dashPlaceholder");
  
  if (pic && img && placeholder) {
    // Small delay helps mobile browsers render data URLs
    setTimeout(() => {
      img.src = pic;
      img.style.display = "block";
      placeholder.style.display = "none";
    }, 300);
  }
});
// Balance Toggle
    // Dynamic balance per user
let balance = 0; // default
let balanceVisible = false;
const maskedBalance = "₦•••••••";

function formatBalance(amount) {
  return "₦" + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Load balance + add approved deposits to balance AND transaction history
document.addEventListener("DOMContentLoaded", async function() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;
  
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    users.push({
      email: email,
      balance: 0,
      processedDeposits: [] // tracks added deposits to prevent duplicates
    });
    userIndex = users.length - 1;
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  let user = users[userIndex];
  balance = user.balance || 0;
  let processed = user.processedDeposits || [];
  
  // Load existing transactions (your existing code)
  const txKey = `transactions_${email}`;
  let transactions = JSON.parse(localStorage.getItem(txKey)) || [];
  
  // ────────────────────────────────────────────────
  // Fetch approved deposits from sheet
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwefHGlrZmK0sd7ozNqpJE-Kf9apCaoqz90vVyl-pnspbMFxIGqxeWWxWQ528RvuWdFvg/exec"; // ← YOUR URL
  
  try {
    const res = await fetch(SCRIPT_URL + "?action=get_approved");
    const result = await res.json();
    
    if (result.success && result.approved) {
      let addedTotal = 0;
      let newlyProcessed = [];
      
      result.approved.forEach(dep => {
        if (dep.email === email) {
          const ts = dep.timestamp; // unique identifier
          
          if (!processed.includes(ts)) {
            const depAmount = Number(dep.amount) || 0;
            
            // Add to balance
            addedTotal += depAmount;
            
            // Add to transaction history (positive deposit)
            transactions.push({
              type: "Deposit",
              amount: depAmount,
              status: "success",
              date: dep.timestamp ? new Date(dep.timestamp).toLocaleString('en-NG') : new Date().toLocaleString('en-NG')
            });
            
            newlyProcessed.push(ts);
          }
        }
      });
      
      if (addedTotal > 0) {
        balance += addedTotal;
        user.balance = balance;
        user.processedDeposits = [...processed, ...newlyProcessed];
        
        // Save updated user data
        localStorage.setItem("users", JSON.stringify(users));
        
        // Save new transactions
        localStorage.setItem(txKey, JSON.stringify(transactions));
        
        // Refresh transaction display
        renderTransactions(); // your existing function
        
        // Optional one-time alert
        if (!sessionStorage.getItem(`added_${email}`)) {
          alert(`₦${addedTotal.toLocaleString()} approved deposit added to balance & history!`);
          sessionStorage.setItem(`added_${email}`, "true");
        }
      }
    }
  } catch (err) {
    console.error("Failed to sync approved deposits:", err);
  }
  
  // Show masked balance by default
  document.getElementById('balanceDisplay').innerHTML =
    maskedBalance + '<button class="toggle-balance" onclick="toggleBalance()">👁️</button>';
});// Load balance + add approved deposits to balance AND transaction history
document.addEventListener("DOMContentLoaded", async function() {
  const email = localStorage.getItem("currentUserEmail");
  if (!email) return;
  
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    users.push({
      email: email,
      balance: 0,
      processedDeposits: [] // tracks added deposits to prevent duplicates
    });
    userIndex = users.length - 1;
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  let user = users[userIndex];
  balance = user.balance || 0;
  let processed = user.processedDeposits || [];
  
  // Load existing transactions (your existing code)
  const txKey = `transactions_${email}`;
  let transactions = JSON.parse(localStorage.getItem(txKey)) || [];
  
  // ────────────────────────────────────────────────
  // Fetch approved deposits from sheet
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwefHGlrZmK0sd7ozNqpJE-Kf9apCaoqz90vVyl-pnspbMFxIGqxeWWxWQ528RvuWdFvg/exec"; // ← YOUR URL
  
  try {
    const res = await fetch(SCRIPT_URL + "?action=get_approved");
    const result = await res.json();
    
    if (result.success && result.approved) {
      let addedTotal = 0;
      let newlyProcessed = [];
      
      result.approved.forEach(dep => {
        if (dep.email === email) {
          const ts = dep.timestamp; // unique identifier
          
          if (!processed.includes(ts)) {
            const depAmount = Number(dep.amount) || 0;
            
            // Add to balance
            addedTotal += depAmount;
            
            // Add to transaction history (positive deposit)
            transactions.push({
              type: "Deposit",
              amount: depAmount,
              status: "success",
              date: dep.timestamp ? new Date(dep.timestamp).toLocaleString('en-NG') : new Date().toLocaleString('en-NG')
            });
            
            newlyProcessed.push(ts);
          }
        }
      });
      
      if (addedTotal > 0) {
        balance += addedTotal;
        user.balance = balance;
        user.processedDeposits = [...processed, ...newlyProcessed];
        
        // Save updated user data
        localStorage.setItem("users", JSON.stringify(users));
        
        // Save new transactions
        localStorage.setItem(txKey, JSON.stringify(transactions));
        
        // Refresh transaction display
        renderTransactions(); // your existing function
        
        // Optional one-time alert
        if (!sessionStorage.getItem(`added_${email}`)) {
          alert(`₦${addedTotal.toLocaleString()} approved deposit added to balance & history!`);
          sessionStorage.setItem(`added_${email}`, "true");
        }
      }
    }
  } catch (err) {
    console.error("Failed to sync approved deposits:", err);
  }
  
  // Show masked balance by default
  document.getElementById('balanceDisplay').innerHTML =
    maskedBalance + '<button class="toggle-balance" onclick="toggleBalance()">👁️</button>';
});
function toggleBalance() {
  const display = document.getElementById('balanceDisplay');
  if (balanceVisible) {
    display.innerHTML = maskedBalance + '<button class="toggle-balance" onclick="toggleBalance()">👁️</button>';
    balanceVisible = false;
  } else {
    const visibleBalance = formatBalance(balance);
    display.innerHTML = visibleBalance + '<button class="toggle-balance" onclick="toggleBalance()">🙈</button>';
    balanceVisible = true;
  }
}
// Simple validation functions (you can make them stricter)
function verifyAccount() {
  const input = document.getElementById('accountNumber');
  // Basic: only allow digits
  input.value = input.value.replace(/\D/g, '');
  // You can add more checks (e.g. exactly 10 digits) here later
}

function verifyName() {
  const input = document.getElementById('accountName');
  // Optional: remove numbers or special chars if you want
  // input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
}

function verifyAmount() {
  const input = document.getElementById('amount');
  // Allow only numbers and comma
  input.value = input.value.replace(/[^0-9,]/g, '');
}

// Enable/disable button based on all fields
function checkForm() {
  const bank        = document.getElementById('bank').value.trim();
  const accNumber   = document.getElementById('accountNumber').value.trim();
  const accName     = document.getElementById('accountName').value.trim();
  const amount      = document.getElementById('amount').value.trim();

  const btn = document.getElementById('proceedBtn');

  const isFilled = 
    bank !== "" &&
    accNumber.length >= 8 &&    // most Nigerian banks use 10, but some allow less
    accName.length >= 2 &&
    amount !== "" && amount !== "0" && amount !== ",";

  btn.disabled = !isFilled;

  // Optional: change appearance when active
  if (isFilled) {
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  } else {
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  }
}


// Format balance (used for display)
function formatBalance(amount) {
  return "₦" + amount.toLocaleString('en-NG', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

// Handle Proceed to transfer button
document.getElementById('proceedBtn').addEventListener('click', function() {
  if (this.disabled) return;

  // Get entered amount (remove commas if any)
  const amountStr = document.getElementById('amount').value.trim().replace(/,/g, '');
  const amount = parseFloat(amountStr) || 0;

  if (amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  // Get current user
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

// ✅ SAVE TRANSFER DETAILS TEMPORARILY
localStorage.setItem("pendingTransfer", JSON.stringify({
  email: email,
  amount: amount,
  bank: document.getElementById("bank").value,
  accountNumber: document.getElementById("accountNumber").value,
  accountName: document.getElementById("accountName").value,
  timestamp: new Date().toISOString()
}));
  // ✅ THEN redirect
  window.location.href = 'processing-withdrawal.html';
});
// Run form check on load
checkForm();

