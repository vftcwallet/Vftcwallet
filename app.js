
let selectedNetwork = "";

function selectNetwork(button, network) {
  
  selectedNetwork = network;
  
  document.querySelectorAll(".network-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  button.classList.add("active");
  
}

function setAirtimeAmount(button, amount) {
  
  // set amount
  document.getElementById("airtimeAmount").value = amount;
  
  // remove active from all buttons
  document.querySelectorAll(".airtime-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  // add active to clicked button
  button.classList.add("active");
  
}

// open airtime modal
function openAirtimeModal() {
  document.getElementById("airtimeModal").style.display = "flex";
}

// close airtime modal
function closeAirtimeModal() {
  document.getElementById("airtimeModal").style.display = "none";
}



  

// Global helpers
// ────────────────────────────────────────────────

function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard: " + text);
    }).catch(() => {
        alert("Copy failed");
    });
}


// ────────────────────────────────────────────────
// Navbar dropdowns
// ────────────────────────────────────────────────

function toggleNotifications() {
    const dd = document.getElementById("notificationDropdown");
    dd.style.display = dd.style.display === "block" ? "none" : "block";
    // close other dropdowns
    document.getElementById("settingsDropdown").style.display = "none";
}

function toggleSettings() {
    const dd = document.getElementById("settingsDropdown");
    dd.style.display = dd.style.display === "block" ? "none" : "block";
    // close other dropdowns
    document.getElementById("notificationDropdown").style.display = "none";
}

// Close dropdowns when clicking outside
document.addEventListener("click", function(e) {
    if (!e.target.closest(".icon-btn") && !e.target.closest(".notification-dropdown") && !e.target.closest(".settings-dropdown")) {
        document.getElementById("notificationDropdown").style.display = "none";
        document.getElementById("settingsDropdown").style.display = "none";
    }
});




// Modal open / close helpers
// ────────────────────────────────────────────────

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

const modalFunctions = {
    openSendMoneyModal:  () => openModal("sendMoneyModal"),
    closeSendMoneyModal: () => closeModal("sendMoneyModal"),
    openTopUpModal:      () => openModal("topUpModal"),
    closeTopUpModal:     () => closeModal("topUpModal"),
    openChat:            () => openModal("chatModal"),
    closeChat:           () => closeModal("chatModal"),
};

Object.assign(window, modalFunctions);

// Close modal when clicking outside content
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

// ────────────────────────────────────────────────
// Top-up modal logic
// ────────────────────────────────────────────────

function selectPaymentMethod(method) {
    document.querySelectorAll(".payment-method").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    document.getElementById("bankTransfer").style.display  = method === "bank"  ? "block" : "none";
    document.getElementById("cryptoDeposit").style.display = method === "crypto" ? "block" : "none";
}

function updateAmount() {
    const amount = document.getElementById("topUpAmount").value || "0";
    const formatted = Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    document.getElementById("confirmAmount").textContent = formatted;
}

// ────────────────────────────────────────────────
// Very basic chat simulation
// ────────────────────────────────────────────────

function sendMessage() {
    const input = document.querySelector(".chat-input");
    const msg = input.value.trim();
    if (!msg) return;

    const chatBody = document.querySelector(".chat-body");

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "message sent";
    userMsg.innerHTML = `
        <div class="message-text">${msg}</div>
        <div class="message-time">now</div>
    `;
    chatBody.appendChild(userMsg);

    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Fake bot reply after delay
    setTimeout(() => {
        const replies = [
            "Thanks for your message! Our team will respond shortly.",
            "Hello! How may I assist you today?",
            "We're currently experiencing high demand. Please hold on...",
            "Can you please provide more details?",
            "Your request has been forwarded to our support team."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const botMsg = document.createElement("div");
        botMsg.className = "message received";
        botMsg.innerHTML = `
            <div class="message-text">${randomReply}</div>
            <div class="message-time">now</div>
        `;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1200);
}

// Allow sending message with Enter key
document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector(".chat-input");
    if (chatInput) {
        chatInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

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
    const bank = document.getElementById('bank').value.trim();
    const accNumber = document.getElementById('accountNumber').value.trim();
    const accName = document.getElementById('accountName').value.trim();
    const amount = document.getElementById('amount').value.trim();
    
    const btn = document.getElementById('proceedBtn');
    
    const isFilled =
        bank !== "" &&
        accNumber.length >= 8 && // most Nigerian banks use 10, but some allow less
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
// Runs when dashboard loads — shows the logged-in user's name
document.addEventListener("DOMContentLoaded", function() {
    const currentEmail = localStorage.getItem("currentUserEmail");

    if (!currentEmail) {
        document.getElementById("username").textContent = ", Guest";
        return;
    }

    // Get all registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the current user
    const user = users.find(u => u.email === currentEmail);

    if (user) {
        // Use firstName + lastName (or just firstName if you prefer)
        const displayName = `${user.firstName} ${user.lastName}`.trim();
        document.getElementById("username").textContent = ", " + displayName;
    } else {
        document.getElementById("username").textContent = ", User";
    }
});

// Handle button click only when enabled
document.getElementById('proceedBtn').addEventListener('click', function() {
    if (!this.disabled) {
        // You can add final validation here before redirect
        window.location.href = 'processing-withdrawal.html';
    }
});

// Run once on page load
checkForm();


