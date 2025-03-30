
// Login System
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  const isLoggedIn = sessionStorage.getItem('staffLoggedIn');
  if (!isLoggedIn) {
    createLoginOverlay();
  }

  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('staffLoggedIn');
      sessionStorage.removeItem('loginAttempts');
      location.reload();
    });
  }
});

function createLoginOverlay() {
  // Create login overlay
  const loginOverlay = document.createElement('div');
  loginOverlay.className = 'login-overlay';
  
  // Disable right-click on login overlay
  loginOverlay.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  // Disable text selection on login overlay
  loginOverlay.style.userSelect = 'none';
  loginOverlay.style.webkitUserSelect = 'none';
  loginOverlay.style.msUserSelect = 'none';
  
  // Create login container
  const loginContainer = document.createElement('div');
  loginContainer.className = 'login-container';
  
  // Add security notice
  const securityNotice = document.createElement('div');
  securityNotice.className = 'security-notice';
  securityNotice.innerHTML = '<i class="fas fa-shield-alt"></i> Secure Login';
  
  // Create logo
  const logoContainer = document.createElement('div');
  logoContainer.className = 'login-logo';
  const logoImg = document.createElement('img');
  logoImg.id = 'login-logo-img';
  logoImg.src = 'PsychoHatcher.png'; // Static image from project files
  logoImg.alt = 'Psycho Hatcher Logo';
  logoImg.draggable = false; // Prevent image dragging
  logoContainer.appendChild(logoImg);
  
  // Create login message
  const loginMessage = document.createElement('p');
  loginMessage.className = 'login-msg';
  loginMessage.textContent = 'Enter the staff password to access the portal';
  
  // Create input group
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';
  
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Staff Password';
  passwordInput.id = 'staff-password';
  passwordInput.autocomplete = 'off'; // Disable autocomplete
  
  const togglePassword = document.createElement('button');
  togglePassword.className = 'toggle-password';
  togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
  togglePassword.type = 'button';
  togglePassword.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      passwordInput.type = 'password';
      this.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });
  
  const loginButton = document.createElement('button');
  loginButton.className = 'btn';
  loginButton.textContent = 'Login';
  
  inputGroup.appendChild(passwordInput);
  inputGroup.appendChild(togglePassword);
  inputGroup.appendChild(loginButton);
  
  // Create error message element
  const errorMessage = document.createElement('p');
  errorMessage.className = 'login-error';
  errorMessage.id = 'login-error';
  
  // Create attempts counter with max attempts set to 3
  const attemptsInfo = document.createElement('div');
  attemptsInfo.className = 'attempts-info';
  attemptsInfo.id = 'attempts-info';
  
  // Get current attempts
  const currentAttempts = parseInt(sessionStorage.getItem('loginAttempts') || '0');
  const maxAttempts = 3;
  const remainingAttempts = maxAttempts - currentAttempts;
  
  attemptsInfo.textContent = `${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining`;
  
  // Append elements to container
  loginContainer.appendChild(securityNotice);
  loginContainer.appendChild(logoContainer);
  loginContainer.appendChild(loginMessage);
  loginContainer.appendChild(inputGroup);
  loginContainer.appendChild(errorMessage);
  loginContainer.appendChild(attemptsInfo);
  
  // Append container to overlay
  loginOverlay.appendChild(loginContainer);
  
  // Append overlay to body
  document.body.appendChild(loginOverlay);
  
  // Add event listeners
  loginButton.addEventListener('click', validateLogin);
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      validateLogin();
    }
  });
  
  // Check if already reached max attempts
  if (currentAttempts >= maxAttempts) {
    passwordInput.disabled = true;
    loginButton.disabled = true;
    errorMessage.textContent = 'Maximum attempts reached. Please reload the page.';
  }
  
  // Additional security - prevent F12, Ctrl+Shift+I, Ctrl+Shift+J
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
      e.preventDefault();
    }
  });
}

function validateLogin() {
  const passwordInput = document.getElementById('staff-password');
  const errorElement = document.getElementById('login-error');
  const attemptsInfo = document.getElementById('attempts-info');
  
  // Set maximum attempts
  const maxAttempts = 3;
  
  // Get attempt count from session storage
  let attemptCount = parseInt(sessionStorage.getItem('loginAttempts') || '0');
  attemptCount++;
  sessionStorage.setItem('loginAttempts', attemptCount.toString());
  
  // Calculate remaining attempts
  const remainingAttempts = maxAttempts - attemptCount;
  
  // Update attempts info
  attemptsInfo.textContent = `${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining`;
  
  // Add a subtle delay for security
  setTimeout(() => {
    // Complex password validation
    // Using a very random password as requested
    if (passwordInput.value === 'X7@p#R2q!L9zK&tM5*Dv$F8gB3') {
      // Store login state and reset attempts
      sessionStorage.setItem('staffLoggedIn', 'true');
      sessionStorage.removeItem('loginAttempts');
      
      // Success animation
      const container = document.querySelector('.login-container');
      container.style.boxShadow = '0 0 20px rgba(80, 220, 100, 0.5)';
      container.style.borderColor = '#4CAF50';
      
      // Remove overlay
      const overlay = document.querySelector('.login-overlay');
      overlay.classList.add('fade-out');
      
      setTimeout(() => {
        overlay.remove();
        // Show welcome notification
        if (typeof showNotification === 'function') {
          showNotification('Welcome to the Staff Portal!', 'success');
        }
      }, 800);
    } else {
      // Show error and shake animation
      errorElement.textContent = 'Incorrect password. Please try again.';
      const container = document.querySelector('.login-container');
      container.classList.add('shake');
      
      // Permanently disable login after max attempts
      if (attemptCount >= maxAttempts) {
        passwordInput.disabled = true;
        document.querySelector('.btn').disabled = true;
        errorElement.textContent = 'Maximum attempts reached. Please reload the page.';
      }
      
      // Remove shake animation after it completes
      setTimeout(() => {
        container.classList.remove('shake');
      }, 500);
    }
  }, 300); // Small delay for security perception
}
