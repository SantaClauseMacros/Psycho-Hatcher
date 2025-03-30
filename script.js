// Mobile navigation enhancement
document.addEventListener("DOMContentLoaded", function () {
  // Add mobile menu toggle button
  const nav = document.querySelector("nav");
  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.className = "mobile-menu-toggle";
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';

  if (window.innerWidth <= 768) {
    // Insert before the navigation
    document.body.insertBefore(mobileMenuBtn, nav);

    // Hide nav by default on mobile
    nav.style.display = "none";

    // Toggle navigation visibility on mobile
    mobileMenuBtn.addEventListener("click", function () {
      if (nav.style.display === "none") {
        nav.style.display = "block";
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i> Close';
      } else {
        nav.style.display = "none";
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
      }
    });

    // Hide menu when clicking on a nav item
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        nav.style.display = "none";
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
      });
    });
  }

  // Add smooth scrolling to navigation links
  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });
});

// Site Security Enhancements
document.addEventListener("contextmenu", function (e) {
  if (sessionStorage.getItem("staffLoggedIn") !== "true") {
    e.preventDefault();
    showNotification("Right-click disabled for security", "error");
    return false;
  }
});

// Prevent copying credentials on the staff portal
document.addEventListener("copy", function (e) {
  if (e.target.closest(".credential-box") && !e.target.closest(".copy-btn")) {
    e.preventDefault();
    showNotification("Use the copy button instead", "info");
  }
});

// Set static logo
const logoPreview = document.getElementById("logo-preview");
const footerLogo = document.getElementById("footer-logo");

// Logo switcher functionality with color themes - using the new specified image formats
const logos = {
  red: {
    path: "PsychoHatcher.png",
    colors: {
      primaryColor: "#ED1F27",
      primaryLight: "#ff5252",
      primaryDark: "#b71c1c",
      secondaryColor: "#f44336",
    },
    displayName: "Red Theme",
  },
  black: {
    path: "PsychoHatcherGreen.png", // This is confusing but using the file you provided
    colors: {
      primaryColor: "#212121",
      primaryLight: "#484848",
      primaryDark: "#000000",
      secondaryColor: "#424242",
    },
    displayName: "Black Theme",
  },
  pureWhite: {
    path: "PsychoHatcherWhite.png",
    colors: {
      primaryColor: "#212121",
      primaryLight: "#484848",
      primaryDark: "#000000",
      secondaryColor: "#FFFFFF",
    },
    displayName: "PureWhite Theme",
  },
};

// Load static logo on page load
window.addEventListener("DOMContentLoaded", () => {
  // Set static logo from project files
  const currentLogo = localStorage.getItem("selectedLogo") || "red";
  switchLogo(currentLogo);

  // Replace upload button with logo switcher
  const uploadBtn = document.querySelector(".upload-btn");
  if (uploadBtn) {
    uploadBtn.innerHTML = '<i class="fas fa-images"></i> Switch Logo';
    uploadBtn.style.cursor = "pointer";
    uploadBtn.style.opacity = "1";
    uploadBtn.title = "Click to change logo style";
    uploadBtn.onclick = function () {
      showLogoSwitcher();
    };
  }

  // Disable logo upload functionality
  const logoUpload = document.getElementById("logo-upload");
  if (logoUpload) {
    logoUpload.disabled = true;
  }

  // Initialize custom components
  initializeTooltips();

  // Check if user is already logged in
  if (sessionStorage.getItem("staffLoggedIn") === "true") {
    showNotification("Welcome back to the Staff Portal!", "info");
  }
});

// Function to switch logo throughout the site and update color theme
function switchLogo(style) {
  const logoPreview = document.getElementById("logo-preview");
  const footerLogo = document.getElementById("footer-logo");
  const loginLogo = document.getElementById("login-logo-img");

  if (logos[style]) {
    console.log(`Switching to logo: ${logos[style].path}`);

    // Update logos with error handling
    if (logoPreview) {
      logoPreview.src = logos[style].path;
      logoPreview.onerror = function () {
        console.error(`Failed to load logo-preview: ${logos[style].path}`);
        this.src = "PsychoHatcher.png"; // Fallback
      };
    }

    if (footerLogo) {
      footerLogo.src = logos[style].path;
      footerLogo.onerror = function () {
        console.error(`Failed to load footer-logo: ${logos[style].path}`);
        this.src = "PsychoHatcher.png"; // Fallback
      };
    }

    if (loginLogo) {
      loginLogo.src = logos[style].path;
      loginLogo.onerror = function () {
        console.error(`Failed to load login-logo: ${logos[style].path}`);
        this.src = "PsychoHatcher.png"; // Fallback
      };
    }

    // Apply color theme
    applyColorTheme(logos[style].colors);

    localStorage.setItem("selectedLogo", style);
    showNotification(`Theme changed to ${style}`, "success");
  } else {
    console.error(`Invalid logo style: ${style}`);
    showNotification(`Failed to change theme`, "error");
  }
}

// Function to apply color theme to CSS variables
function applyColorTheme(colors) {
  const root = document.documentElement;

  // Update CSS variables
  root.style.setProperty("--primary-color", colors.primaryColor);
  root.style.setProperty("--primary-light", colors.primaryLight);
  root.style.setProperty("--primary-dark", colors.primaryDark);
  root.style.setProperty("--secondary-color", colors.secondaryColor);

  // Update header background
  const header = document.querySelector("header");
  if (header) {
    header.style.background = `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryDark})`;
  }

  // Update navigation background
  const nav = document.querySelector("nav");
  if (nav) {
    nav.style.backgroundColor = colors.primaryLight;
  }

  // Update footer background
  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.backgroundColor = colors.primaryDark;
  }

  // Update login overlay if present
  const loginOverlay = document.querySelector(".login-overlay");
  if (loginOverlay) {
    loginOverlay.style.background = `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primaryColor})`;
  }
}

// Function to show logo switcher dialog
function showLogoSwitcher() {
  // Create logo switcher overlay
  const overlay = document.createElement("div");
  overlay.className = "logo-switcher-overlay";

  const switcher = document.createElement("div");
  switcher.className = "logo-switcher-container";

  // Add heading
  const heading = document.createElement("h3");
  heading.textContent = "Choose Logo & Theme Style";
  switcher.appendChild(heading);

  // Add theme image showcasing all three themes
  const themeImage = document.createElement("img");
  themeImage.src = "attached_assets/theme_logos.png";
  themeImage.alt = "Theme Options";
  themeImage.style.width = "100%";
  themeImage.style.maxWidth = "500px";
  themeImage.style.marginBottom = "20px";
  switcher.appendChild(themeImage);

  // Create logo options - limit to only 3 options
  const logoOptions = document.createElement("div");
  logoOptions.className = "logo-options";

  // Only show these three options
  const displayStyles = ["red", "black", "pureWhite"];

  for (const style of displayStyles) {
    if (logos[style]) {
      const option = document.createElement("div");
      option.className = "logo-option";

      // Create preview of the theme colors
      const colorPreview = document.createElement("div");
      colorPreview.className = "color-preview";
      colorPreview.style.display = "flex";
      colorPreview.style.marginTop = "10px";

      // Add color swatches
      const colors = [
        logos[style].colors.primaryColor,
        logos[style].colors.primaryLight,
        logos[style].colors.primaryDark,
        logos[style].colors.secondaryColor,
      ];

      colors.forEach((color) => {
        const swatch = document.createElement("div");
        swatch.style.width = "20px";
        swatch.style.height = "20px";
        swatch.style.backgroundColor = color;
        swatch.style.borderRadius = "50%";
        swatch.style.margin = "0 5px";
        swatch.style.border = "1px solid #ddd";
        colorPreview.appendChild(swatch);
      });

      const label = document.createElement("div");
      label.textContent =
        logos[style].displayName ||
        style.charAt(0).toUpperCase() + style.slice(1) + " Theme";
      label.style.fontSize = "16px";
      label.style.fontWeight = "bold";
      label.style.color = logos[style].colors.primaryColor;
      label.style.marginBottom = "10px";

      option.appendChild(label);
      option.appendChild(colorPreview);

      // Add hover effect
      option.style.transition = "all 0.3s ease";
      option.style.padding = "15px";
      option.style.borderRadius = "8px";
      option.style.border = "2px solid transparent";
      option.style.cursor = "pointer";

      // Apply theme preview on hover
      option.addEventListener("mouseenter", () => {
        option.style.backgroundColor = logos[style].colors.primaryLight + "20"; // 20% opacity
        option.style.borderColor = logos[style].colors.primaryColor;
      });

      option.addEventListener("mouseleave", () => {
        option.style.backgroundColor = "";
        option.style.borderColor = "transparent";
      });

      option.onclick = () => {
        console.log(`Switching to logo style: ${style}`);
        switchLogo(style);
        document.body.removeChild(overlay);
      };

      logoOptions.appendChild(option);
    }
  }

  switcher.appendChild(logoOptions);

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "btn";
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  closeBtn.style.marginTop = "20px";
  switcher.appendChild(closeBtn);

  overlay.appendChild(switcher);
  document.body.appendChild(overlay);
}

// Notification System
function showNotification(message, type = "info") {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".notification");

  if (notification) {
    // If a notification is already visible, remove it first
    if (notification.classList.contains("notification-show")) {
      notification.classList.add("notification-closing");
      setTimeout(() => {
        notification.remove();
        showNotification(message, type);
      }, 300);
      return;
    }
    notification.remove();
  }

  // Create new notification
  notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // Set icon based on type
  let icon = "info-circle";
  if (type === "success") icon = "check-circle";
  if (type === "error") icon = "exclamation-circle";

  // Create notification content
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${icon}"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  // Add to DOM
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("notification-show");
  }, 10);

  // Add close functionality
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.add("notification-closing");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });

  // Auto hide after 5 seconds
  setTimeout(() => {
    if (notification && document.body.contains(notification)) {
      notification.classList.add("notification-closing");
      setTimeout(() => {
        if (notification && document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Navigation
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    // Remove active class from all links
    navLinks.forEach((l) => l.classList.remove("active"));
    // Add active class to clicked link
    this.classList.add("active");
  });
});

// Add scroll animations to elements
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.section-card, .guide-card, .info-box, h2, h3');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  animatedElements.forEach(element => {
    element.classList.add('animate-ready');
    observer.observe(element);
  });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  
  // Add dark mode toggle
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  darkModeToggle.title = 'Toggle Dark Mode';
  document.body.appendChild(darkModeToggle);
  
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      darkModeToggle.title = 'Toggle Light Mode';
      localStorage.setItem('darkMode', 'enabled');
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      darkModeToggle.title = 'Toggle Dark Mode';
      localStorage.setItem('darkMode', 'disabled');
    }
  });
  
  // Check for saved dark mode preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    darkModeToggle.title = 'Toggle Light Mode';
  }
});

// Add typing animation to headers
function initTypingEffect() {
  const headers = document.querySelectorAll('h1, h2');
  
  headers.forEach((header, index) => {
    const text = header.textContent;

// Add scroll progress bar
document.addEventListener('DOMContentLoaded', function() {
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  // Update progress bar width on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollProgress + '%';
    
    // Show back to top button when scrolled down
    const backToTopBtn = document.querySelector('.back-to-top');
    if (scrollTop > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Add back to top button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.title = 'Back to top';
  document.body.appendChild(backToTopBtn);
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// Add interactive checklists for guide pages
document.addEventListener('DOMContentLoaded', function() {
  const guidePage = document.querySelector('.guide-content.active');
  
  if (guidePage) {
    const checklistItems = guidePage.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checklistItems.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const parentItem = this.closest('.checklist-item');
        
        if (this.checked) {
          parentItem.style.textDecoration = 'line-through';
          parentItem.style.opacity = '0.7';
        } else {
          parentItem.style.textDecoration = 'none';
          parentItem.style.opacity = '1';
        }
        
        // Count checked items
        const guide = this.closest('.guide-content');
        const totalItems = guide.querySelectorAll('.checklist-item').length;
        const checkedItems = guide.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        
        // If all items are checked, show success notification
        if (checkedItems === totalItems) {
          showNotification('All items checked! Issue should be resolved.', 'success');
        }
      });
    });
  }
});

    header.innerHTML = '';
    header.style.visibility = 'visible';
    
    setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          header.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
    }, index * 300);
  });
}

// Skip typing animation for now to avoid overriding existing content
// document.addEventListener('DOMContentLoaded', initTypingEffect);

// Apply active class to current section in nav
function setActiveNavLink() {
  const sections = document.querySelectorAll("main section");
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveNavLink);

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notificationElement = document.createElement("div");
  notificationElement.className = `notification ${type}`;
  notificationElement.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  // Add to document
  document.body.appendChild(notificationElement);

  // Add event listener to close button

// Suggestions system implementation
document.addEventListener('DOMContentLoaded', function() {
  const suggestionForm = document.querySelector('.suggestion-form');
  const suggestionText = document.getElementById('suggestion-text');
  const submitSuggestionBtn = document.getElementById('submit-suggestion');
  const suggestionStatus = document.getElementById('suggestion-status');
  
  if (submitSuggestionBtn) {
    submitSuggestionBtn.addEventListener('click', function() {
      if (!suggestionText || suggestionText.value.trim() === '') {
        showNotification('Please enter a suggestion before submitting', 'error');
        return;
      }
      
      // Get staff name (fake a random name if not available)
      const staffNames = ['Dennis', 'Notsus', 'Watermelon', 'Crazy', 'Adelnon', 'Santa', 'Reversals', 'makoralen', 'waktool', 'Creeper'];
      const staffName = sessionStorage.getItem('loggedInUser') || staffNames[Math.floor(Math.random() * staffNames.length)];
      
      // Store the suggestion in local storage with staff name
      const suggestions = JSON.parse(localStorage.getItem('staffSuggestions') || '[]');
      suggestions.push({
        text: suggestionText.value,
        date: new Date().toISOString(),
        status: 'pending',
        author: staffName
      });
      localStorage.setItem('staffSuggestions', JSON.stringify(suggestions));
      
      // Show success message
      showNotification('Suggestion submitted successfully!', 'success');
      suggestionText.value = '';
      
      // Immediately display updated suggestions
      displaySavedSuggestions();
    });
  }
  
  // Always display saved suggestions
  displaySavedSuggestions();
});

// Function to display previously saved suggestions
function displaySavedSuggestions() {
  const suggestions = JSON.parse(localStorage.getItem('staffSuggestions') || '[]');
  const statusDiv = document.getElementById('suggestion-status');
  
  if (statusDiv) {
    // Create header for the suggestions section
    const header = document.createElement('div');
    header.className = 'suggestions-header';
    header.innerHTML = `
      <h3><i class="fas fa-comments"></i> Staff Suggestions Board</h3>
      <p>View and search all staff suggestions. All suggestions are visible to everyone.</p>
    `;
    
    // Create a search box for suggestions
    const searchBox = document.createElement('div');
    searchBox.className = 'suggestion-search';
    searchBox.innerHTML = `
      <input type="text" id="suggestion-search" placeholder="Search suggestions..." class="suggestion-search-input">
    `;
    
    statusDiv.innerHTML = ''; // Clear previous content
    statusDiv.appendChild(header);
    statusDiv.appendChild(searchBox);
    
    // Add suggestions count indicator
    const suggestionsCount = document.createElement('div');
    suggestionsCount.className = 'suggestions-count';
    suggestionsCount.innerHTML = `<h4>All Staff Suggestions (${suggestions.length})</h4>`;
    statusDiv.appendChild(suggestionsCount);
    
    // Create container for suggestions
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    statusDiv.appendChild(suggestionsContainer);
    
    if (suggestions.length > 0) {
      // Create the list
      const list = document.createElement('ul');
      list.className = 'suggestions-list';
      
      // Show all suggestions 
      suggestions.reverse().forEach((suggestion, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-suggestion-id', index);
        listItem.innerHTML = `
          <div class="suggestion-header">
            <span class="suggestion-author">${suggestion.author || 'Anonymous'}</span>
            <small>Submitted on ${new Date(suggestion.date).toLocaleString()}</small>
          </div>
          <p class="suggestion-content">${suggestion.text}</p>
          <div class="suggestion-meta">
            <span class="suggestion-status ${suggestion.status}">${suggestion.status}</span>
            <button class="btn-vote upvote" data-id="${index}"><i class="fas fa-thumbs-up"></i> <span class="vote-count">${suggestion.upvotes || 0}</span></button>
          </div>
        `;
        list.appendChild(listItem);
      });
      
      suggestionsContainer.appendChild(list);
      
      // Add search functionality
      const searchInput = document.getElementById('suggestion-search');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          const suggestionItems = document.querySelectorAll('.suggestions-list li');
          
          suggestionItems.forEach(item => {
            const suggestionText = item.querySelector('.suggestion-content').textContent.toLowerCase();
            const authorText = item.querySelector('.suggestion-author').textContent.toLowerCase();
            if (suggestionText.includes(searchTerm) || authorText.includes(searchTerm)) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }
      
      // Add upvote functionality
      document.querySelectorAll('.btn-vote').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          const suggestions = JSON.parse(localStorage.getItem('staffSuggestions') || '[]');
          const suggestion = suggestions[suggestions.length - 1 - id]; // Account for reversed display
          
          if (!suggestion.upvotes) suggestion.upvotes = 0;
          suggestion.upvotes++;
          
          this.querySelector('.vote-count').textContent = suggestion.upvotes;
          localStorage.setItem('staffSuggestions', JSON.stringify(suggestions));
          
          showNotification('Vote recorded!', 'success');
        });
      });
    } else {
      // No suggestions message
      const noSuggestions = document.createElement('div');
      noSuggestions.className = 'no-suggestions';
      noSuggestions.innerHTML = `
        <i class="fas fa-comment-slash" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
        <p>No suggestions have been submitted yet.</p>
        <p>Be the first to suggest an improvement!</p>
      `;
      suggestionsContainer.appendChild(noSuggestions);
    }
    
    // Make the suggestions section visible
    statusDiv.style.display = 'block';
  }
}

// Function to export all suggestions
function exportAllSuggestions() {
  const suggestions = JSON.parse(localStorage.getItem('staffSuggestions') || '[]');
  if (suggestions.length === 0) {
    showNotification('No suggestions to export', 'error');
    return;
  }
  
  // Format the suggestions as text
  let exportText = "# Psycho Hatcher Staff Suggestions\n\n";
  suggestions.forEach((suggestion, index) => {
    exportText += `## Suggestion ${index + 1}\n`;
    exportText += `**Date:** ${new Date(suggestion.date).toLocaleString()}\n`;
    exportText += `**Status:** ${suggestion.status}\n\n`;
    exportText += `${suggestion.text}\n\n`;
    exportText += `---\n\n`;
  });
  
  // Create a blob and download it
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `psycho-hatcher-suggestions-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  showNotification('Suggestions exported successfully!', 'success');
}

  notificationElement
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notificationElement.classList.add("notification-closing");
      setTimeout(() => {
        notificationElement.remove();
      }, 300);
    });

  // Auto hide after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notificationElement)) {
      notificationElement.classList.add("notification-closing");
      setTimeout(() => {
        notificationElement.remove();
      }, 300);
    }
  }, 5000);

  // Animate in
  setTimeout(() => {
    notificationElement.classList.add("notification-show");
  }, 10);
}

// Initialize tooltips
function initializeTooltips() {
  // Add hoverable class to existing tooltips
  document.querySelectorAll(".tooltip").forEach((tooltip) => {
    tooltip.classList.add("hoverable");
  });
}

// Suggestion system
document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submit-suggestion");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitSuggestion);
  }

  // Template copy functionality
  document.querySelectorAll(".copy-template").forEach((button) => {
    button.addEventListener("click", function () {
      const templateType = this.getAttribute("data-template");
      const contentDiv = this.closest(".template-content");
      const paragraphs = contentDiv.querySelectorAll("p");

      let templateText = "";
      paragraphs.forEach((p) => {
        templateText += p.textContent + "\n\n";
      });

      navigator.clipboard.writeText(templateText.trim()).then(() => {
        showNotification("Template copied to clipboard!", "success");

        // Visual feedback
        this.textContent = "Copied!";
        setTimeout(() => {
          this.textContent = "Copy Template";
        }, 2000);
      });
    });
  });
});

function submitSuggestion() {
  const suggestionText = document
    .getElementById("suggestion-text")
    .value.trim();
  const statusDiv = document.getElementById("suggestion-status");

  if (!suggestionText) {
    statusDiv.className = "error";
    statusDiv.textContent = "Please enter a suggestion before submitting.";
    statusDiv.style.display = "block";
    return;
  }

  // Format the suggestion with date and time
  const now = new Date();
  const formattedDate = now.toLocaleString();
  const formattedSuggestion = `[${formattedDate}] ${suggestionText}\n\n---\n\n`;

  // Create file content with the suggestion
  const fileContent = formattedSuggestion;

  // Create a temporary file for download
  const blob = new Blob([fileContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Create a link to download the file
  const a = document.createElement("a");
  a.href = url;
  a.download = `suggestion_${now.getTime()}.txt`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  // Show success message
  statusDiv.className = "success";
  statusDiv.textContent =
    "Your suggestion has been saved! Thank you for your contribution.";
  statusDiv.style.display = "block";

  // Clear the input
  document.getElementById("suggestion-text").value = "";

  // Add to navigation
  if (!document.querySelector('nav a[href="#suggestions"]')) {
    const navList = document.querySelector("nav ul");
    const newNavItem = document.createElement("li");
    newNavItem.innerHTML = '<a href="#suggestions">Suggestions</a>';
    navList.appendChild(newNavItem);
  }

  showNotification("Suggestion submitted successfully!", "success");
}

// Add guide content toggle with smooth animation
document.querySelectorAll(".toggle-guide").forEach((button) => {
  button.addEventListener("click", function () {
    const guideType = this.getAttribute("data-guide");
    const contentElement = document.getElementById(`${guideType}-content`);

    // Smooth toggle
    if (contentElement.classList.contains("active")) {
      contentElement.style.maxHeight = contentElement.scrollHeight + "px";
      setTimeout(() => {
        contentElement.style.maxHeight = "0px";
        setTimeout(() => {
          contentElement.classList.remove("active");
          this.textContent = "View Guide";
        }, 300);
      }, 10);
    } else {
      contentElement.classList.add("active");
      contentElement.style.maxHeight = "0px";
      setTimeout(() => {
        contentElement.style.maxHeight = contentElement.scrollHeight + "px";
        this.textContent = "Hide Guide";
      }, 10);
    }
  });
});

// Progressive content loading for better performance
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("main section");

  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  // Observe each section
  sections.forEach((section) => {
    observer.observe(section);
  });
});

// Add copy functionality to credential boxes
document.querySelectorAll(".credential-box p").forEach((credential) => {
  const originalHTML = credential.innerHTML;
  const textToCopy =
    credential.textContent.split(":")[1]?.trim() || credential.textContent;

  credential.innerHTML = `${originalHTML} <button class="copy-btn" data-copy="${textToCopy}"><i class="fas fa-copy"></i></button>`;
});

// Initialize copy buttons
document.addEventListener("click", function (e) {
  if (e.target.closest(".copy-btn")) {
    const button = e.target.closest(".copy-btn");
    const textToCopy = button.getAttribute("data-copy");

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Change icon temporarily
      const originalIcon = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';

      // Show notification
      showNotification("Copied to clipboard!", "success");

      // Reset icon after a delay
      setTimeout(() => {
        button.innerHTML = originalIcon;
      }, 2000);
    });
  }
});
