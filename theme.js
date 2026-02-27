// theme.js - shared dark/light mode
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  
  // Set button icon if it exists
  if (toggleBtn) {
    toggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  }
  
  // Toggle function
  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (toggleBtn) {
      toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
  }
  
  // Attach event if button exists
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  } else {
    console.log("No theme toggle button found on this page");
  }
});