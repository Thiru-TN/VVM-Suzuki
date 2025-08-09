// Validation Patterns
const validationPatterns = {
  name: /^[a-zA-Z\s]+$/,
  lastName: /^[a-zA-Z\s\-]*$|^NA$/i, // Updated to allow empty, single character, -, or NA
  phone: /^[6-9]\d{9}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
};

// Global variables for OTP
let otpTimer;
let timeLeft = 180; // 3 minutes in seconds
let userEmail = '';
let isFromForgotPassword = false; // Track if OTP is for password reset

function setInitialTheme() {
  const hour = new Date().getHours();
  const body = document.body;

  // Night time between 6PM and 6AM
  if (hour >= 18 || hour < 6) {
    body.classList.remove("morning");
    body.classList.add("night");
  } else {
    body.classList.remove("night");
    body.classList.add("morning");
  }
}

// Initialize speedometer marks
function initSpeedometer() {
  const marksContainer = document.getElementById("speedometerMarks");

  // Clear any existing marks
  marksContainer.innerHTML = "";

  // Create marks from -90deg to 90deg (180 degree arc)
  for (let i = 0; i <= 10; i++) {
    const angle = -90 + i * 18; // 18 degrees per mark (0-180 range)
    const mark = document.createElement("div");
    mark.className = "speedometer-mark";

    // Make every other mark a major mark
    if (i % 2 === 0) {
      mark.classList.add("major");
    }

    mark.style.transform = `rotate(${angle}deg)`;
    marksContainer.appendChild(mark);
  }
}

// Update speedometer based on form progress
function updateSpeedometer(progress) {
  const needle = document.getElementById("speedometerNeedle");
  const display = document.getElementById("digitalDisplay");

  // Calculate angle (-90 to 90 degrees based on progress)
  const angle = -90 + progress * 1.8;
  needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

  // Update digital display text based on progress
  let displayText = "READY";
  if (progress > 0 && progress < 25) {
    displayText = "GETTING STARTED";
  } else if (progress >= 25 && progress < 50) {
    displayText = "PICKING UP SPEED";
  } else if (progress >= 50 && progress < 65) {
    displayText = "CRUISING ALONG";
  } else if (progress >= 65 && progress < 75) {
    displayText = "CLOSE TO FINISH";
  } else if (progress >= 75 && progress < 100) {
    displayText = "FINAL STRETCH";
  } else if (progress === 100) {
    displayText = "READY TO LAUNCH!";
  }

  display.textContent = displayText;
}

// Calculate form completion percentage
function calculateFormProgress(form) {
  const inputs = form.querySelectorAll(".form-input");
  let filledCount = 0;

  inputs.forEach((input) => {
    if (input.value.trim() !== "") {
      filledCount++;
    }
  });

  return Math.round((filledCount / inputs.length) * 100);
}

// Calculate OTP completion percentage
function calculateOTPProgress() {
  const otpInputs = document.querySelectorAll(".otp-digit");
  let filledCount = 0;

  otpInputs.forEach((input) => {
    if (input.value.trim() !== "") {
      filledCount++;
    }
  });

  return Math.round((filledCount / otpInputs.length) * 100);
}

// Calculate Password Reset completion percentage
function calculatePasswordResetProgress() {
  const newPasswordInput = document.getElementById('newPassword');
  const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
  let filledCount = 0;

  if (newPasswordInput.value.trim() !== "") {
    filledCount++;
  }
  if (confirmNewPasswordInput.value.trim() !== "") {
    filledCount++;
  }

  return Math.round((filledCount / 2) * 100);
}

// Notification System
function showNotification(type, title, message, duration = 4000) {
  const notification = document.getElementById("notification");
  const iconMap = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  // Set notification content
  notification.className = `notification ${type} show`;
  notification.querySelector(".notification-icon i").className = `fas ${
    iconMap[type] || "fa-info-circle"
  }`;
  notification.querySelector(".notification-title").textContent = title;
  notification.querySelector(".notification-message").textContent = message;

  // Auto hide after duration
  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);

  // Close button functionality
  notification.querySelector(".notification-close").onclick = () => {
    notification.classList.remove("show");
  };
}

// Validation Functions
function validateName(name) {
  if (!name.trim()) {
    return "Name is required";
  }
  if (!validationPatterns.name.test(name.trim())) {
    return "Name should contain only letters and spaces";
  }
  if (name.trim().length < 2) {
    return "Name should be at least 2 characters long";
  }
  return null;
}

function validateLastName(lastName) {
  // Allow empty, single character, "-", or "NA" (case insensitive)
  if (!lastName || lastName.trim() === "") {
    return null; // Allow empty
  }
  
  const trimmed = lastName.trim();
  
  // Allow single character
  if (trimmed.length === 1 && /^[a-zA-Z\-]$/.test(trimmed)) {
    return null;
  }
  
  // Allow "NA" (case insensitive)
  if (trimmed.toUpperCase() === "NA") {
    return null;
  }
  
  // Allow "-"
  if (trimmed === "-") {
    return null;
  }
  
  // For longer names, check pattern
  if (!validationPatterns.lastName.test(trimmed)) {
    return "Last name should contain only letters, spaces, or hyphens";
  }
  
  return null;
}

function validatePhone(phone) {
  if (!phone.trim()) {
    return "Phone number is required";
  }
  if (!validationPatterns.phone.test(phone.trim())) {
    return "Please enter a valid 10-digit Indian phone number";
  }
  return null;
}

function validateEmail(email) {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!validationPatterns.email.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return null;
}

function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  if (!validationPatterns.password.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)";
  }
  return null;
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
}

// Form validation
function validateInput(input, validationType) {
  const value = input.value;
  let error = null;

  switch (validationType) {
    case 'firstName':
      error = validateName(value);
      break;
    case 'lastName':
      error = validateLastName(value);
      break;
    case 'phone':
      error = validatePhone(value);
      break;
    case 'email':
      error = validateEmail(value);
      break;
    case 'password':
    case 'newPassword':
      error = validatePassword(value);
      break;
    case 'confirmPassword':
      const password = document.getElementById('registerPassword').value;
      error = validateConfirmPassword(password, value);
      break;
    case 'confirmNewPassword':
      const newPassword = document.getElementById('newPassword').value;
      error = validateConfirmPassword(newPassword, value);
      break;
  }

  // Update input styling based on validation
  if (error) {
    input.classList.add('error');
    input.classList.remove('valid');
    return false;
  } else if (value.trim() || validationType === 'lastName') {
    input.classList.remove('error');
    input.classList.add('valid');
    return true;
  } else {
    input.classList.remove('error', 'valid');
    return true;
  }
}

function validateAllRegisterInputs() {
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const phone = document.getElementById('phoneNumber');
  const email = document.getElementById('registerEmail');
  const password = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  const validations = [
    { input: firstName, type: 'firstName', name: 'First Name' },
    { input: lastName, type: 'lastName', name: 'Last Name' },
    { input: phone, type: 'phone', name: 'Phone Number' },
    { input: email, type: 'email', name: 'Email' },
    { input: password, type: 'password', name: 'Password' },
    { input: confirmPassword, type: 'confirmPassword', name: 'Confirm Password' }
  ];

  let isValid = true;
  let firstError = null;

  validations.forEach(({ input, type, name }) => {
    if (!validateInput(input, type)) {
      isValid = false;
      if (!firstError) {
        let errorMessage = '';
        switch (type) {
          case 'firstName':
            errorMessage = validateName(input.value);
            break;
          case 'lastName':
            errorMessage = validateLastName(input.value);
            break;
          case 'phone':
            errorMessage = validatePhone(input.value);
            break;
          case 'email':
            errorMessage = validateEmail(input.value);
            break;
          case 'password':
            errorMessage = validatePassword(input.value);
            break;
          case 'confirmPassword':
            errorMessage = validateConfirmPassword(
              document.getElementById('registerPassword').value,
              input.value
            );
            break;
        }
        if (errorMessage) {
          firstError = errorMessage;
        }
      }
    }
  });

  if (!isValid && firstError) {
    showNotification('error', 'Validation Error', firstError);
  }

  return isValid;
}

function validatePasswordResetInputs() {
  const newPassword = document.getElementById('newPassword');
  const confirmNewPassword = document.getElementById('confirmNewPassword');

  const validations = [
    { input: newPassword, type: 'newPassword', name: 'New Password' },
    { input: confirmNewPassword, type: 'confirmNewPassword', name: 'Confirm New Password' }
  ];

  let isValid = true;
  let firstError = null;

  validations.forEach(({ input, type, name }) => {
    if (!validateInput(input, type)) {
      isValid = false;
      if (!firstError) {
        let errorMessage = '';
        switch (type) {
          case 'newPassword':
            errorMessage = validatePassword(input.value);
            break;
          case 'confirmNewPassword':
            errorMessage = validateConfirmPassword(
              document.getElementById('newPassword').value,
              input.value
            );
            break;
        }
        if (errorMessage) {
          firstError = errorMessage;
        }
      }
    }
  });

  if (!isValid && firstError) {
    showNotification('error', 'Validation Error', firstError);
  }

  return isValid;
}

// OTP Timer Functions
function startOTPTimer() {
  timeLeft = 180; // Reset to 3 minutes
  updateTimerDisplay();
  
  otpTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(otpTimer);
      document.getElementById('resendBtn').disabled = false;
      showNotification('warning', 'OTP Expired', 'Your OTP has expired. Please request a new one.');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = document.getElementById('timerDisplay');
  
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  if (timeLeft <= 30) {
    timerDisplay.classList.add('timer-expired');
  } else {
    timerDisplay.classList.remove('timer-expired');
  }
}

// OTP Input Handling
function setupOTPInputs() {
  const otpInputs = document.querySelectorAll('.otp-digit');
  
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        e.target.value = '';
        return;
      }
      
      if (value) {
        input.classList.add('filled');
        // Move to next input
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      } else {
        input.classList.remove('filled');
      }
      
      // Update speedometer based on OTP completion
      const progress = calculateOTPProgress();
      updateSpeedometer(progress);
    });
    
    input.addEventListener('keydown', (e) => {
      // Handle backspace
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
        otpInputs[index - 1].value = '';
        otpInputs[index - 1].classList.remove('filled');
      }
      
      // Handle paste
      if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigator.clipboard.readText().then(text => {
          const digits = text.replace(/\D/g, '').slice(0, 6);
          digits.split('').forEach((digit, i) => {
            if (otpInputs[i]) {
              otpInputs[i].value = digit;
              otpInputs[i].classList.add('filled');
            }
          });
          const progress = calculateOTPProgress();
          updateSpeedometer(progress);
        });
      }
    });
  });
}

// Password toggle functionality
function setupPasswordToggles() {
  // Login password toggle
  const toggleLoginPassword = document.getElementById('toggleLoginPassword');
  const loginPassword = document.getElementById('loginPassword');
  
  toggleLoginPassword.addEventListener('click', () => {
    const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPassword.setAttribute('type', type);
    toggleLoginPassword.classList.toggle('fa-eye-slash');
    toggleLoginPassword.classList.toggle('fa-eye');
  });

  // Register password toggle
  const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
  const registerPassword = document.getElementById('registerPassword');
  
  toggleRegisterPassword.addEventListener('click', () => {
    const type = registerPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    registerPassword.setAttribute('type', type);
    toggleRegisterPassword.classList.toggle('fa-eye-slash');
    toggleRegisterPassword.classList.toggle('fa-eye');
  });

  // Confirm password toggle
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  
  toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPassword.setAttribute('type', type);
    toggleConfirmPassword.classList.toggle('fa-eye-slash');
    toggleConfirmPassword.classList.toggle('fa-eye');
  });

  // New password toggle
  const toggleNewPassword = document.getElementById('toggleNewPassword');
  const newPassword = document.getElementById('newPassword');
  
  toggleNewPassword.addEventListener('click', () => {
    const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    newPassword.setAttribute('type', type);
    toggleNewPassword.classList.toggle('fa-eye-slash');
    toggleNewPassword.classList.toggle('fa-eye');
  });

  // Confirm new password toggle
  const toggleConfirmNewPassword = document.getElementById('toggleConfirmNewPassword');
  const confirmNewPassword = document.getElementById('confirmNewPassword');
  
  toggleConfirmNewPassword.addEventListener('click', () => {
    const type = confirmNewPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmNewPassword.setAttribute('type', type);
    toggleConfirmNewPassword.classList.toggle('fa-eye-slash');
    toggleConfirmNewPassword.classList.toggle('fa-eye');
  });
}

// Forgot password functionality
function setupForgotPassword() {
  const forgotPassword = document.getElementById('forgotPassword');
  
  forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const enteredEmail = emailInput.value.trim();

    if (!enteredEmail || !validationPatterns.email.test(enteredEmail)) {
      showNotification("error", "Invalid Email", "Please enter a valid email address to receive OTP.");
      return;
    }

    userEmail = enteredEmail;
    isFromForgotPassword = true;
    
    document.getElementById('otpEmailDisplay').textContent = userEmail;
    
    // Update OTP form content for password reset
    document.querySelector('#otpForm .otp-welcome').textContent = 'Password Reset Verification';
    document.querySelector('#otpForm .otp-instruction').innerHTML = `We've sent a verification code to<br /><span class="otp-email" id="otpEmailDisplay">${userEmail}</span>`;
    document.getElementById('backToRegister').textContent = '← Back to Login';
    
    // Switch to OTP form
    switchForms(loginForm, otpForm);
    
    // Start OTP timer
    startOTPTimer();
    
    // Reset OTP inputs
    document.querySelectorAll('.otp-digit').forEach(input => {
      input.value = '';
      input.classList.remove('filled');
    });
    
    showNotification("info", "OTP Sent", `Password reset code sent to ${userEmail}`);
  });
}

// Form switching functionality
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const otpForm = document.getElementById("otpForm");
const passwordResetForm = document.getElementById("passwordResetForm");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");
const backToRegister = document.getElementById("backToRegister");
const backToLogin = document.getElementById("backToLogin");
const formFlash = document.getElementById("formFlash");
const mainFormContainer = document.getElementById("mainFormContainer");

function switchForms(fromForm, toForm) {
  // Trigger form flash animation
  formFlash.style.animation = "none";
  void formFlash.offsetWidth; // Trigger reflow
  formFlash.style.animation = "formFlash 0.6s ease-out forwards";

  // Change form width immediately
  if (toForm.id === "registerForm") {
    mainFormContainer.classList.add("register-mode");
    mainFormContainer.classList.remove("otp-mode", "password-reset-mode");
  } else if (toForm.id === "otpForm") {
    mainFormContainer.classList.add("otp-mode");
    mainFormContainer.classList.remove("register-mode", "password-reset-mode");
  } else if (toForm.id === "passwordResetForm") {
    mainFormContainer.classList.add("password-reset-mode");
    mainFormContainer.classList.remove("register-mode", "otp-mode");
  } else {
    mainFormContainer.classList.remove("register-mode", "otp-mode", "password-reset-mode");
  }

  setTimeout(() => {
    // Form transition
    fromForm.classList.remove("active");
    toForm.classList.add("active");

    // Update speedometer for the new form
    if (toForm.id === "otpForm") {
      updateSpeedometer(0);
      document.getElementById("digitalDisplay").textContent = "ENTER OTP";
    } else if (toForm.id === "passwordResetForm") {
      updateSpeedometer(0);
      document.getElementById("digitalDisplay").textContent = "SET NEW PASSWORD";
    } else {
      updateFormProgress(toForm);
    }
  }, 300);
}

// Update form progress when inputs change
function updateFormProgress(form) {
  if (form.id === "otpForm") {
    const progress = calculateOTPProgress();
    updateSpeedometer(progress);
  } else if (form.id === "passwordResetForm") {
    const progress = calculatePasswordResetProgress();
    updateSpeedometer(progress);
  } else {
    const progress = calculateFormProgress(form);
    updateSpeedometer(progress);
  }
}

// Event listeners for form switching
switchToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  switchForms(loginForm, registerForm);
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  switchForms(registerForm, loginForm);
});

backToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  if (otpTimer) {
    clearInterval(otpTimer);
  }
  
  if (isFromForgotPassword) {
    isFromForgotPassword = false;
    switchForms(otpForm, loginForm);
  } else {
    switchForms(otpForm, registerForm);
  }
});

backToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  switchForms(passwordResetForm, loginForm);
});

// Event listeners for input changes
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to all form inputs
  document.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", () => {
      const activeForm = document.querySelector(".form-content.active");
      
      // Validate input on change for register form
      if (activeForm.id === "registerForm") {
        const inputId = input.id;
        let validationType = '';
        
        switch (inputId) {
          case 'firstName':
            validationType = 'firstName';
            break;
          case 'lastName':
            validationType = 'lastName';
            break;
          case 'phoneNumber':
            validationType = 'phone';
            break;
          case 'registerEmail':
            validationType = 'email';
            break;
          case 'registerPassword':
            validationType = 'password';
            // Also revalidate confirm password if it has a value
            const confirmPass = document.getElementById('confirmPassword');
            if (confirmPass.value) {
              validateInput(confirmPass, 'confirmPassword');
            }
            break;
          case 'confirmPassword':
            validationType = 'confirmPassword';
            break;
        }
        
        if (validationType) {
          validateInput(input, validationType);
        }
      } else if (activeForm.id === "passwordResetForm") {
        const inputId = input.id;
        let validationType = '';
        
        switch (inputId) {
          case 'newPassword':
            validationType = 'newPassword';
            // Also revalidate confirm password if it has a value
            const confirmNewPass = document.getElementById('confirmNewPassword');
            if (confirmNewPass.value) {
              validateInput(confirmNewPass, 'confirmNewPassword');
            }
            break;
          case 'confirmNewPassword':
            validationType = 'confirmNewPassword';
            break;
        }
        
        if (validationType) {
          validateInput(input, validationType);
        }
      }
      
      updateFormProgress(activeForm);
    });
  });
});

// Form submission handlers
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const otpSubmitBtn = document.getElementById("otpSubmitBtn");
const passwordResetBtn = document.getElementById("passwordResetBtn");
const resendBtn = document.getElementById("resendBtn");
const googleSigninLogin = document.getElementById("googleSigninLogin");
const googleSigninRegister = document.getElementById("googleSigninRegister");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  updateSpeedometer(100);
  document.getElementById("digitalDisplay").textContent = "LOGIN SUCCESS!";
  showNotification("success", "Login Successful", "Welcome back to Vignesh Vishnu Motors!");
});

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (validateAllRegisterInputs()) {
    // Store user email for OTP display
    userEmail = document.getElementById('registerEmail').value;
    isFromForgotPassword = false;
    document.getElementById('otpEmailDisplay').textContent = userEmail;
    
    // Reset OTP form content for registration
    document.querySelector('#otpForm .otp-welcome').textContent = 'Thank you for becoming a member!';
    document.querySelector('#otpForm .otp-instruction').innerHTML = `We've sent a verification code to<br /><span class="otp-email" id="otpEmailDisplay">${userEmail}</span>`;
    document.getElementById('backToRegister').textContent = '← Back to Registration';
    
    // Switch to OTP form
    switchForms(registerForm, otpForm);
    
    // Start OTP timer
    startOTPTimer();
    
    // Reset OTP inputs
    document.querySelectorAll('.otp-digit').forEach(input => {
      input.value = '';
      input.classList.remove('filled');
    });
    
    showNotification("info", "OTP Sent", `Verification code sent to ${userEmail}`);
  }
});

otpSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  const otpInputs = document.querySelectorAll('.otp-digit');
  const otpValue = Array.from(otpInputs).map(input => input.value).join('');
  
  if (otpValue.length !== 6) {
    showNotification("error", "Incomplete OTP", "Please enter the complete 6-digit verification code");
    return;
  }
  
  if (timeLeft <= 0) {
    showNotification("error", "OTP Expired", "Your OTP has expired. Please request a new one.");
    return;
  }
  
  // Clear the timer
  if (otpTimer) {
    clearInterval(otpTimer);
  }
  
  // Check if this is for password reset or registration
  if (isFromForgotPassword) {
    // Switch to password reset form
    document.getElementById('resetEmailDisplay').textContent = userEmail;
    switchForms(otpForm, passwordResetForm);
    showNotification("success", "OTP Verified", "Please set your new password");
  } else {
    // Registration complete
    updateSpeedometer(100);
    document.getElementById("digitalDisplay").textContent = "REGISTRATION COMPLETE!";
    showNotification("success", "Registration Successful", "Welcome to the Vignesh Vishnu Motors family!");
  }
});

passwordResetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (validatePasswordResetInputs()) {
    updateSpeedometer(100);
    document.getElementById("digitalDisplay").textContent = "PASSWORD RESET SUCCESS!";
    
    // Reset form state
    isFromForgotPassword = false;
    
    // Clear password inputs
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    document.getElementById('newPassword').classList.remove('error', 'valid');
    document.getElementById('confirmNewPassword').classList.remove('error', 'valid');
    
    showNotification("success", "Password Reset Successful", "Your password has been updated successfully. You can now login with your new password.");
    
    // Switch back to login form after a short delay
    setTimeout(() => {
      switchForms(passwordResetForm, loginForm);
    }, 2000);
  }
});

resendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  // Reset timer and start again
  if (otpTimer) {
    clearInterval(otpTimer);
  }
  
  document.getElementById('resendBtn').disabled = true;
  startOTPTimer();
  
  // Clear OTP inputs
  document.querySelectorAll('.otp-digit').forEach(input => {
    input.value = '';
    input.classList.remove('filled');
  });
  
  updateSpeedometer(0);
  
  const messageType = isFromForgotPassword ? "password reset" : "verification";
  showNotification("info", "OTP Resent", `New ${messageType} code sent to ${userEmail}`);
});

// Google Sign-in handlers
googleSigninLogin.addEventListener("click", (e) => {
  e.preventDefault();
  updateSpeedometer(100);
  document.getElementById("digitalDisplay").textContent = "GOOGLE LOGIN SUCCESS!";
  showNotification("success", "Google Sign-in Successful", "Welcome back via Google!");
});

googleSigninRegister.addEventListener("click", (e) => {
  e.preventDefault();
  updateSpeedometer(100);
  document.getElementById("digitalDisplay").textContent = "GOOGLE SIGNUP SUCCESS!";
  showNotification("success", "Google Sign-up Successful", "Welcome to our family via Google!");
});

// Initialize
setInitialTheme();
initSpeedometer();
setupOTPInputs();
setupPasswordToggles();
setupForgotPassword();
updateSpeedometer(0); // Start at 0%

// Update theme every minute
setInterval(setInitialTheme, 60000);
