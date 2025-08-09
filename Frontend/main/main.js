document.addEventListener("DOMContentLoaded", function() {
  // Mobile menu toggle
  const navToggle = document.getElementById("nav-toggle");
  navToggle.addEventListener("click", function() {
    document.body.classList.toggle("nav-open");
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.shellbar-container') && 
        !e.target.closest('.nav-mobile') && 
        document.body.classList.contains('nav-open')) {
      document.body.classList.remove("nav-open");
    }
  });

  // Notification System
  function showNotification(type, title, message, duration = 4000) {
    const notification = document.getElementById("notification");
    const iconMap = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle"
    };

    notification.className = `notification ${type} show`;
    notification.querySelector(".notification-icon i").className = `fas ${iconMap[type] || "fa-info-circle"}`;
    notification.querySelector(".notification-title").textContent = title;
    notification.querySelector(".notification-message").textContent = message;

    setTimeout(() => {
      notification.classList.remove("show");
    }, duration);

    notification.querySelector(".notification-close").onclick = function() {
      notification.classList.remove("show");
    };
  }

  // Logout Modal
  const logoutModal = document.getElementById("logoutModal");
  const logoutButtons = document.querySelectorAll('.logout-btn, .mobile-logout-btn');
  const modalClose = document.querySelector('.modal-close');
  const cancelBtn = document.querySelector('.btn-cancel');
  const confirmBtn = document.querySelector('.btn-confirm');

  function openModal() {
    logoutModal.classList.add('show');
    document.body.classList.remove("nav-open");
  }

  function closeModal() {
    logoutModal.classList.remove('show');
  }

  logoutButtons.forEach(button => {
    button.addEventListener('click', openModal);
  });

  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  logoutModal.addEventListener('click', function(e) {
    if (e.target === logoutModal) {
      closeModal();
    }
  });

  confirmBtn.addEventListener('click', function() {
    closeModal();
    showNotification('success', 'Logged Out', 'You have been successfully logged out');
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1500);
  });

  // Show welcome notification
  setTimeout(() => {
    showNotification('success', 'Welcome Back', 'You have successfully logged in as Anand');
  }, 1000);
});
