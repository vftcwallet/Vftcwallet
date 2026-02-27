<script>
  // Handle deposit button
  
  // Optional: "sh balance on dashboard load (in case approved)
  document.addEventListener("DOMContentLoaded", () => {
    toggleBalance(); // or call your balance refresh if needed
  });
function confirmTopUp() {
  const amountInput = document.getElementById("topUpAmount");
  const amount = parseFloat(amountInput.value) || 0;
  
  if (amount <= 0) {
    alert("Enter a valid amount");
    return;
  }
  
  const email = localStorage.getItem("currentUserEmail");
  if (!email) {
    alert("Please login first");
    return;
  }
  
  const url = "https://script.google.com/macros/s/AKfycbwefHGlrZmK0sd7ozNqpJE-Kf9apCaoqz90vVyl-pnspbMFxIGqxeWWxWQ528RvuWdFvg/exec"; // ← paste fresh URL
  
  fetch(url, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({ email: email, amount: amount, action: "deposit" }),
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // ← critical for iOS Safari
      }
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert("Request sent! ₦" + amount.toLocaleString() + " – waiting for admin approval.");
        // close modal
        document.getElementById("topUpModal").style.display = "none";
        // optional: show pending notice
      } else {
        alert("Error: " + (data.error || "Unknown problem"));
      }
    })
    .catch(err => {
      console.error(err);
      alert("Connection failed – check internet or try again later.\nDetails: " + err.message);
    });
}
</script>