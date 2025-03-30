
// Site Security Enhancements
document.addEventListener('contextmenu', function(e) {
  if (sessionStorage.getItem('staffLoggedIn') !== 'true') {
    e.preventDefault();
    showNotification('Right-click disabled for security', 'error');
    return false;
  }
});

// Prevent copying credentials on the staff portal
document.addEventListener('copy', function(e) {
  if (e.target.closest('.credential-box') && !e.target.closest('.copy-btn')) {
    e.preventDefault();
    showNotification('Use the copy button instead', 'info');
  }
});

// Set static logo
const logoPreview = document.getElementById('logo-preview');
const footerLogo = document.getElementById('footer-logo');

// Logo switcher functionality with color themes - using the new specified image formats
const logos = {
  red: {
    path: 'PsychoHatcher.png',
    colors: {
      primaryColor: '#ED1F27',
      primaryLight: '#ff5252',
      primaryDark: '#b71c1c',
      secondaryColor: '#f44336'
    },
    displayName: 'Red Theme'
  },
  black: {
    path: 'PsychoHatcherGreen.png', // This is confusing but using the file you provided
    colors: {
      primaryColor: '#212121',
      primaryLight: '#484848',
      primaryDark: '#000000',
      secondaryColor: '#424242'
    },
    displayName: 'Black Theme'
  },
  pureWhite: {
    path: 'PsychoHatcherWhite.png',
    colors: {
      primaryColor: '#212121',
      primaryLight: '#484848',
      primaryDark: '#000000',
      secondaryColor: '#FFFFFF'
    },
    displayName: 'PureWhite Theme'
  }
};

// Load static logo on page load
window.addEventListener('DOMContentLoaded', () => {
  // Set static logo from project files
  const currentLogo = localStorage.getItem('selectedLogo') || 'red';
  switchLogo(currentLogo);

  // Replace upload button with logo switcher
  const uploadBtn = document.querySelector('.upload-btn');
  if (uploadBtn) {
    uploadBtn.innerHTML = '<i class="fas fa-images"></i> Switch Logo';
    uploadBtn.style.cursor = 'pointer';
    uploadBtn.style.opacity = '1';
    uploadBtn.title = 'Click to change logo style';
    uploadBtn.onclick = function() {
      showLogoSwitcher();
    };
  }

  // Disable logo upload functionality
  const logoUpload = document.getElementById('logo-upload');
  if (logoUpload) {
    logoUpload.disabled = true;
  }

  // Initialize custom components
  initializeTooltips();

  // Check if user is already logged in
  if (sessionStorage.getItem('staffLoggedIn') === 'true') {
    showNotification('Welcome back to the Staff Portal!', 'info');
  }
});

// Function to switch logo throughout the site and update color theme
function switchLogo(style) {
  const logoPreview = document.getElementById('logo-preview');
  const footerLogo = document.getElementById('footer-logo');
  const loginLogo = document.getElementById('login-logo-img');

  if (logos[style]) {
    console.log(`Switching to logo: ${logos[style].path}`);

    // Update logos with error handling
    if (logoPreview) {
      logoPreview.src = logos[style].path;
      logoPreview.onerror = function() {
        console.error(`Failed to load logo-preview: ${logos[style].path}`);
        this.src = 'PsychoHatcher.png'; // Fallback
      };
    }

    if (footerLogo) {
      footerLogo.src = logos[style].path;
      footerLogo.onerror = function() {
        console.error(`Failed to load footer-logo: ${logos[style].path}`);
        this.src = 'PsychoHatcher.png'; // Fallback
      };
    }

    if (loginLogo) {
      loginLogo.src = logos[style].path;
      loginLogo.onerror = function() {
        console.error(`Failed to load login-logo: ${logos[style].path}`);
        this.src = 'PsychoHatcher.png'; // Fallback
      };
    }

    // Apply color theme
    applyColorTheme(logos[style].colors);

    localStorage.setItem('selectedLogo', style);
    showNotification(`Theme changed to ${style}`, 'success');
  } else {
    console.error(`Invalid logo style: ${style}`);
    showNotification(`Failed to change theme`, 'error');
  }
}

// Function to apply color theme to CSS variables
function applyColorTheme(colors) {
  const root = document.documentElement;

  // Update CSS variables
  root.style.setProperty('--primary-color', colors.primaryColor);
  root.style.setProperty('--primary-light', colors.primaryLight);
  root.style.setProperty('--primary-dark', colors.primaryDark);
  root.style.setProperty('--secondary-color', colors.secondaryColor);

  // Update header background
  const header = document.querySelector('header');
  if (header) {
    header.style.background = `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryDark})`;
  }

  // Update navigation background
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.backgroundColor = colors.primaryLight;
  }

  // Update footer background
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.backgroundColor = colors.primaryDark;
  }

  // Update login overlay if present
  const loginOverlay = document.querySelector('.login-overlay');
  if (loginOverlay) {
    loginOverlay.style.background = `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primaryColor})`;
  }
}

// Function to show logo switcher dialog
function showLogoSwitcher() {
  // Create logo switcher overlay
  const overlay = document.createElement('div');
  overlay.className = 'logo-switcher-overlay';

  const switcher = document.createElement('div');
  switcher.className = 'logo-switcher-container';

  // Add heading
  const heading = document.createElement('h3');
  heading.textContent = 'Choose Logo & Theme Style';
  switcher.appendChild(heading);

  // Add theme image showcasing all three themes
  const themeImage = document.createElement('img');
  themeImage.src = 'attached_assets/theme_logos.png';
  themeImage.alt = 'Theme Options';
  themeImage.style.width = '100%';
  themeImage.style.maxWidth = '500px';
  themeImage.style.marginBottom = '20px';
  switcher.appendChild(themeImage);

  // Create logo options - limit to only 3 options
  const logoOptions = document.createElement('div');
  logoOptions.className = 'logo-options';

  // Only show these three options
  const displayStyles = ['red', 'black', 'pureWhite'];

  for (const style of displayStyles) {
    if (logos[style]) {
      const option = document.createElement('div');
      option.className = 'logo-option';

      // Create preview of the theme colors
      const colorPreview = document.createElement('div');
      colorPreview.className = 'color-preview';
      colorPreview.style.display = 'flex';
      colorPreview.style.marginTop = '10px';

      // Add color swatches
      const colors = [
        logos[style].colors.primaryColor,
        logos[style].colors.primaryLight,
        logos[style].colors.primaryDark,
        logos[style].colors.secondaryColor
      ];

      colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.style.width = '20px';
        swatch.style.height = '20px';
        swatch.style.backgroundColor = color;
        swatch.style.borderRadius = '50%';
        swatch.style.margin = '0 5px';
        swatch.style.border = '1px solid #ddd';
        colorPreview.appendChild(swatch);
      });

      const label = document.createElement('div');
      label.textContent = logos[style].displayName || (style.charAt(0).toUpperCase() + style.slice(1) + ' Theme');
      label.style.fontSize = '16px';
      label.style.fontWeight = 'bold';
      label.style.color = logos[style].colors.primaryColor;
      label.style.marginBottom = '10px';

      option.appendChild(label);
      option.appendChild(colorPreview);

      // Add hover effect
      option.style.transition = 'all 0.3s ease';
      option.style.padding = '15px';
      option.style.borderRadius = '8px';
      option.style.border = '2px solid transparent';
      option.style.cursor = 'pointer';

      // Apply theme preview on hover
      option.addEventListener('mouseenter', () => {
        option.style.backgroundColor = logos[style].colors.primaryLight + '20'; // 20% opacity
        option.style.borderColor = logos[style].colors.primaryColor;
      });

      option.addEventListener('mouseleave', () => {
        option.style.backgroundColor = '';
        option.style.borderColor = 'transparent';
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
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn';
  closeBtn.textContent = 'Close';
  closeBtn.onclick = () => document.body.removeChild(overlay);
  closeBtn.style.marginTop = '20px';
  switcher.appendChild(closeBtn);

  overlay.appendChild(switcher);
  document.body.appendChild(overlay);
}

// Notification System
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');

  if (notification) {
    // If a notification is already visible, remove it first
    if (notification.classList.contains('notification-show')) {
      notification.classList.add('notification-closing');
      setTimeout(() => {
        notification.remove();
        showNotification(message, type);
      }, 300);
      return;
    }
    notification.remove();
  }

  // Create new notification
  notification = document.createElement('div');
  notification.className = `notification ${type}`;

  // Set icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';

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
    notification.classList.add('notification-show');
  }, 10);

  // Add close functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.add('notification-closing');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  // Auto hide after 5 seconds
  setTimeout(() => {
    if (notification && document.body.contains(notification)) {
      notification.classList.add('notification-closing');
      setTimeout(() => {
        if (notification && document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Navigation
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('active'));
    // Add active class to clicked link
    this.classList.add('active');
  });
});

// Troubleshooting Guides Content
const guideButtons = document.querySelectorAll('.toggle-guide');
const guideContents = {
  rankup: `### **Psycho Hatchers Rank Up Macro Troubleshooting Guide**

This guide will help you identify and fix common and uncommon issues with the Psycho Hatchers rank-up macro. Please follow the steps below:

---

### **Common Issues**
**1. Scaling is not 100%**
   - Ask: *"Is your display scaling set to 100%? Check this in your PC's Display Settings."*
   - Fix: Set scaling to 100% (Settings > Display > Scale and Layout).

**2. Roblox isn't the web browser version**
   - Ask: *"Are you using the web browser version of Roblox?"*
   - Fix: Switch to the web browser version.

**3. Roblox is in fullscreen mode**
   - Ask: *"Is Roblox in fullscreen mode?"*
   - Fix: Press \`Esc\`, go to Settings, and switch Display Mode to "Windowed."

**4. Camera movement after joining PS99**
   - Ask: *"Did you move your camera after joining PS99?"*
   - Fix: Rejoin PS99 and avoid moving the camera.

**5. They haven't pressed F1**
   - Ask: *"Have you pressed F1 after loading in?"*
   - Fix: Press F1 to initialize the macro setup.

**6. PC language isn't set to English (US)**
   - Ask: *"Is your PC language set to English (US)?"*
   - Fix: Change PC language to English (US) (Settings > Time & Language > Language).

**7. Font hasn't been changed**
   - Ask: *"Have you changed your font settings?"*
   - Fix: Change the font back to the system default (or reset to recommended settings).

**8. Background transparency isn't opaque**
   - Ask: *"Is your background transparency set to opaque?"*
   - Fix: Set background transparency to opaque in Roblox Settings.

---

### **Uncommon Issues**
**1. Big Games messing with UI**
   - Ask: *"Are you experiencing UI issues specific to Big Games?"*
   - Fix: Report UI issues to Waktool for debugging.

**2. PC settings affecting color**
   - Ask: *"Do you have any PC settings that modify colors (like Night Light, HDR, or color filters)?"*
   - Fix: Turn off any features that alter screen colors.

**3. Not all zones are unlocked**
   - Ask: *"Do you have all zones unlocked in the game?"*
   - Fix: Ensure all zones are unlocked; players missing zones cannot progress correctly.

---

### **Escalation Process**
1. If **common issues** are resolved but the macro still isn't working:
   - Ping **Waktool** for help with Big Games issues or PC color settings.

2. If **all other steps fail**, and the issue remains unresolved:
   - Ping **Reversals** for manual intervention and fixes.

---

### **Checklist for Common Issues**
- [ ] Scaling is at 100%.
- [ ] Roblox is the web browser version.
- [ ] Roblox is not in fullscreen mode.
- [ ] No camera movement after joining PS99.
- [ ] F1 key has been pressed.
- [ ] PC language is set to English (US).
- [ ] Default font is used.
- [ ] Background transparency is set to opaque.

Use this checklist to ensure a smooth troubleshooting process!`,

  digging: `### **Psycho Hatchers Advanced Digging Mode Troubleshooting Guide**

This guide is designed to help resolve issues with the **Advanced Digging Mode** macro. Follow these steps to identify and fix the problem.

---

### **Common Issues**

**1. Scaling is not set to 100%**
   - Ask: *"Is your display scaling set to 100%?"*
   - Fix: Adjust display scaling to 100% in your PC's Display Settings (Settings > Display > Scale and Layout).

**2. Roblox isn't in windowed mode**
   - Ask: *"Is Roblox in fullscreen mode?"*
   - Fix: Switch Roblox to **Windowed Mode** by pressing \`Esc\`, navigating to Settings, and selecting **Windowed** in the Display Mode setting.

**3. Not using the web browser version of Roblox**
   - Ask: *"Are you using the web browser version of Roblox?"*
   - Fix: Close the Roblox app and switch to the web browser version.

**4. Using a shiny hoverboard**
   - Ask: *"Are you using a shiny hoverboard?"*
   - Fix: Switch to a basic hoverboard or dismount entirely. Shiny hoverboards can interfere with the macro.

**5. Not in World 1**
   - Ask: *"Are you currently in World 1?"*
   - Fix: Navigate to **World 1**. Advanced Digging Mode works only in this specific world.

**6. Camera movement after starting**
   - Ask: *"Have you moved your camera since starting the macro?"*
   - Fix: Rejoin World 1 and avoid moving the camera after starting the macro.

---

### **Uncommon Issues**

**1. Different camera mode than default**
   - Ask: *"Is your camera mode set to default?"*
   - Fix: Go to Roblox settings and switch the camera mode to **Default Classic**.

**2. PC settings that affect color**
   - Ask: *"Do you have any PC settings that alter color (Night Light, HDR, color filters)?"*
   - Fix: Disable any color-altering settings on your PC.

---

### **Escalation Process**
- If **common issues** are fixed but the macro still doesn't work:
  - Ping **Waktool** for debugging issues related to PC or camera settings.
- If the issue persists and cannot be resolved:
  - Ping **Reversals** for further assistance.

---

### **Checklist for Common Issues**
- [ ] Scaling is set to 100%.
- [ ] Roblox is in windowed mode.
- [ ] Using the web browser version of Roblox.
- [ ] Not using a shiny hoverboard.
- [ ] Player is in World 1.
- [ ] Camera has not been moved.

### **Checklist for Uncommon Issues**
- [ ] Camera mode is set to default.
- [ ] No PC settings are interfering with color.

By following this guide, you can resolve most issues with Advanced Digging Mode. Escalate only when necessary!`,

  clan: `### **Psycho Hatchers Clan Mode Troubleshooting Guide**

This guide covers troubleshooting for the **Clan Mode Macro**, which is a temporary macro designed to assist clans in reaching the top 10. Follow the steps below to identify and resolve issues.

---

### **Common Issues**

**1. Scaling isn't set to 100%**
   - Ask: *"Is your display scaling set to 100%?"*
   - Fix: Set scaling to 100% in your PC's Display Settings (Settings > Display > Scale and Layout).

**2. Roblox is in fullscreen mode**
   - Ask: *"Is Roblox in fullscreen mode?"*
   - Fix: Ensure Roblox is in windowed mode. Press \`Esc\`, go to Settings, and set the Display Mode to **Windowed**.

**3. Not located in the Void World**
   - Ask: *"Are you in the Void World?"*
   - Fix: Travel to the Void World before starting the macro. The macro will not work in any other world.

**4. Not using the web browser version of Roblox**
   - Ask: *"Are you using the web browser version of Roblox?"*
   - Fix: Close the Roblox app and use the web browser version instead.

**5. Using a shiny hoverboard**
   - Ask: *"Are you using a shiny hoverboard?"*
   - Fix: Dismount from the shiny hoverboard or switch to a basic hoverboard. Shiny hoverboards can interfere with macro functions.

---

### **Uncommon Issues**

- **No uncommon issues have been identified.**  
  If any unusual issues arise, ping **Reversals**, and they will resolve it.

---

### **Checklist for Common Issues**
- [ ] Scaling is at 100%.
- [ ] Roblox is not in fullscreen mode.
- [ ] Player is in the Void World.
- [ ] The web browser version of Roblox is in use.
- [ ] Shiny hoverboard is not in use.

If all items in the checklist are resolved and the macro still fails, escalate by contacting **Reversals** for further assistance.

This guide ensures quick and effective troubleshooting for Clan Mode!`,

  treehouse: `### **Psycho Hatchers Treehouse Mode Troubleshooting Guide**

This guide provides steps to resolve issues with the **Treehouse Mode** macro. Follow the outlined solutions for quick troubleshooting.

---

### **Common Issues**

**1. Scaling is not set to 100%**
   - Ask: *"Is your display scaling set to 100%?"*
   - Fix: Adjust scaling to 100% in your PC's Display Settings (Settings > Display > Scale and Layout).

**2. Roblox isn't in windowed mode**
   - Ask: *"Is Roblox in fullscreen mode?"*
   - Fix: Switch to **Windowed Mode** in Roblox by pressing \`Esc\`, opening Settings, and selecting **Windowed** under Display Mode.

**3. UI of the macro overlaps Roblox**
   - Ask: *"Is the macro interface overlapping your Roblox screen?"*
   - Fix: Adjust the macro's window size or reposition it to avoid overlap with the Roblox game interface.

**4. Using a shiny hoverboard**
   - Ask: *"Are you using a shiny hoverboard?"*
   - Fix: Switch to a basic hoverboard or dismount entirely. Shiny hoverboards can interfere with macro functionality.

**5. Not in World 1**
   - Ask: *"Are you in World 1?"*
   - Fix: Navigate to **World 1**, as Treehouse Mode works only in this world.

**6. Not using the web browser version of Roblox**
   - Ask: *"Are you using the web browser version of Roblox?"*
   - Fix: Close the Roblox app and use the browser version instead.

---

### **Uncommon Issues**

**1. OCR Fails**
   - Description: The OCR (Optical Character Recognition) function of the macro might fail to detect on-screen elements correctly.
   - Fix: Ping **Waktool** or **Reversals** to debug the OCR setup.

**2. Big Games bugs causing zones after Zone 1 not to load**
   - Description: Sometimes, Big Games servers may bug out, failing to show zones beyond Zone 1.
   - Fix: If this happens, ping **Waktool** or **Reversals** for assistance.

---

### **Escalation Process**
- If **common issues** are resolved and the macro is still not working:
  - For **OCR failures** or **Big Games bugs**, ping **Waktool** or **Reversals** for further support.

---

### **Checklist for Common Issues**
- [ ] Scaling is set to 100%.
- [ ] Roblox is in windowed mode.
- [ ] Macro UI is not overlapping Roblox.
- [ ] Not using a shiny hoverboard.
- [ ] Player is in World 1.
- [ ] The web browser version of Roblox is in use.

### **Checklist for Uncommon Issues**
- [ ] OCR is functioning correctly.
- [ ] Zones beyond Zone 1 are visible.

By following this guide, most issues with Treehouse Mode can be resolved. Escalate only when necessary!`,

  fishing: `### **Psycho Hatchers Deep Fishing Mode Troubleshooting Guide**

This guide will help you identify and resolve common and uncommon issues related to the Psycho Hatchers Deep Fishing Mode. Follow the steps carefully to get the mode functioning properly.

---

### **Common Issues**

**1. Roblox graphics not set to level 6 or higher**
   - Ask: *"Are your Roblox graphics set to level 6 or higher?"*
   - Fix: Go to Roblox settings (in-game), then navigate to the **Graphics** tab. Set the graphics quality to level 6 or higher.

**2. Not in the fishing zone**
   - Ask: *"Are you in the correct fishing zone?"*
   - Fix: Ensure you are in the **Advanced Fishing Zone** and not in the normal fishing zone.

**3. Camera isn't overhead and max zoomed out**
   - Ask: *"Is your camera positioned overhead and zoomed out to the maximum?"*
   - Fix: Adjust the camera by using the \`Scroll Wheel\` to zoom out and move it directly overhead using the mouse or keyboard controls.

**4. Scaling is not set to 100%**
   - Ask: *"Is your display scaling set to 100%?"*
   - Fix: Set scaling to 100% in your PC's Display Settings (Settings > Display > Scale and Layout).

**5. Roblox isn't windowed**
   - Ask: *"Is Roblox running in windowed mode?"*
   - Fix: Make sure Roblox is not in fullscreen mode. Press \`Esc\`, go to Settings, and set the display mode to **Windowed**.

---

### **Uncommon Issues**

**1. Mastery-related bugs**
   - Ask: *"Are you experiencing any temporary bugs or issues related to Mastery while fishing?"*
   - Fix: This issue can sometimes occur due to the mastery system. If this happens, simply wait for the temporary bug to resolve itself, or try restarting Roblox.

**2. Trying to use the mode in the normal fishing zone**
   - Ask: *"Are you trying to use Deep Fishing Mode in the normal fishing zone?"*
   - Fix: Ensure that you're in the **Advanced Fishing Zone**. Deep Fishing Mode will only work in that specific zone.

---

### **Escalation Process**

1. If all else fails, and the issue persists:
   - Ping **Reversals** for a deeper dive into the problem, and they'll assist in resolving it.

---

### **Checklist for Common Issues**
- [ ] Roblox graphics set to level 6 or higher.
- [ ] You're in the **Advanced Fishing Zone**.
- [ ] Camera is overhead and zoomed out to max.
- [ ] Display scaling is at 100%.
- [ ] Roblox is in windowed mode.

Follow this checklist to ensure the troubleshooting process is thorough and effective!`
};

// Handle Guide Toggle
guideButtons.forEach(button => {
  button.addEventListener('click', function() {
    const guideType = this.getAttribute('data-guide');
    const contentElement = document.getElementById(`${guideType}-content`);

    // Toggle active class
    contentElement.classList.toggle('active');

    // Change button text
    if (contentElement.classList.contains('active')) {
      this.textContent = 'Hide Guide';

      // Convert markdown to HTML
      const markdownContent = guideContents[guideType];
      contentElement.innerHTML = convertMarkdownToHTML(markdownContent);
    } else {
      this.textContent = 'View Guide';
    }
  });
});

// Simple Markdown to HTML converter
function convertMarkdownToHTML(markdown) {
  let html = markdown;

  // Headers
  html = html.replace(/### \*\*(.*?)\*\*/g, '<h3>$1</h3>');
  html = html.replace(/### (.*?)$/gm, '<h3>$1</h3>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Lists
  html = html.replace(/- \[ \] (.*?)$/gm, '<div class="checklist-item"><input type="checkbox"> $1</div>');
  html = html.replace(/- (.*?)$/gm, '<li>$1</li>');

  // Line breaks and paragraphs
  html = html.replace(/\n\n/g, '</p><p>');

  // Horizontal rules
  html = html.replace(/---/g, '<hr>');

  // Code blocks
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Ensure proper paragraph wrapping
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*<h/g, '<h');
  html = html.replace(/<\/h\d>\s*<\/p>/g, '</h3>');
  html = html.replace(/<p>\s*<hr>\s*<\/p>/g, '<hr>');
  html = html.replace(/<p>\s*<li>/g, '<ul><li>');
  html = html.replace(/<\/li>\s*<\/p>/g, '</li></ul>');
  html = html.replace(/<\/li>\s*<li>/g, '</li><li>');

  return html;
}

// Apply active class to current section in nav
function setActiveNavLink() {
  const sections = document.querySelectorAll('main section');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= (sectionTop - 200)) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notificationElement = document.createElement('div');
  notificationElement.className = `notification ${type}`;
  notificationElement.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  // Add to document
  document.body.appendChild(notificationElement);

  // Add event listener to close button
  notificationElement.querySelector('.notification-close').addEventListener('click', () => {
    notificationElement.classList.add('notification-closing');
    setTimeout(() => {
      notificationElement.remove();
    }, 300);
  });

  // Auto hide after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notificationElement)) {
      notificationElement.classList.add('notification-closing');
      setTimeout(() => {
        notificationElement.remove();
      }, 300);
    }
  }, 5000);

  // Animate in
  setTimeout(() => {
    notificationElement.classList.add('notification-show');
  }, 10);
}

// Initialize tooltips
function initializeTooltips() {
  // Add hoverable class to existing tooltips
  document.querySelectorAll('.tooltip').forEach(tooltip => {
    tooltip.classList.add('hoverable');
  });
}

// Suggestion system
document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submit-suggestion');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitSuggestion);
  }
  
  // Template copy functionality
  document.querySelectorAll('.copy-template').forEach(button => {
    button.addEventListener('click', function() {
      const templateType = this.getAttribute('data-template');
      const contentDiv = this.closest('.template-content');
      const paragraphs = contentDiv.querySelectorAll('p');
      
      let templateText = '';
      paragraphs.forEach(p => {
        templateText += p.textContent + '\n\n';
      });
      
      navigator.clipboard.writeText(templateText.trim()).then(() => {
        showNotification('Template copied to clipboard!', 'success');
        
        // Visual feedback
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = 'Copy Template';
        }, 2000);
      });
    });
  });
});

function submitSuggestion() {
  const suggestionText = document.getElementById('suggestion-text').value.trim();
  const statusDiv = document.getElementById('suggestion-status');
  
  if (!suggestionText) {
    statusDiv.className = 'error';
    statusDiv.textContent = 'Please enter a suggestion before submitting.';
    statusDiv.style.display = 'block';
    return;
  }
  
  // Format the suggestion with date and time
  const now = new Date();
  const formattedDate = now.toLocaleString();
  const formattedSuggestion = `[${formattedDate}] ${suggestionText}\n\n---\n\n`;
  
  // Create file content with the suggestion
  const fileContent = formattedSuggestion;
  
  // Create a temporary file for download
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Create a link to download the file
  const a = document.createElement('a');
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
  statusDiv.className = 'success';
  statusDiv.textContent = 'Your suggestion has been saved! Thank you for your contribution.';
  statusDiv.style.display = 'block';
  
  // Clear the input
  document.getElementById('suggestion-text').value = '';
  
  // Add to navigation
  if (!document.querySelector('nav a[href="#suggestions"]')) {
    const navList = document.querySelector('nav ul');
    const newNavItem = document.createElement('li');
    newNavItem.innerHTML = '<a href="#suggestions">Suggestions</a>';
    navList.appendChild(newNavItem);
  }
  
  showNotification('Suggestion submitted successfully!', 'success');
}

// Add guide content toggle with smooth animation
document.querySelectorAll('.toggle-guide').forEach(button => {
  button.addEventListener('click', function() {
    const guideType = this.getAttribute('data-guide');
    const contentElement = document.getElementById(`${guideType}-content`);

    // Smooth toggle
    if (contentElement.classList.contains('active')) {
      contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
      setTimeout(() => {
        contentElement.style.maxHeight = '0px';
        setTimeout(() => {
          contentElement.classList.remove('active');
          this.textContent = 'View Guide';
        }, 300);
      }, 10);
    } else {
      contentElement.classList.add('active');
      contentElement.style.maxHeight = '0px';
      setTimeout(() => {
        contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
        this.textContent = 'Hide Guide';
      }, 10);
    }
  });
});

// Progressive content loading for better performance
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('main section');

  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe each section
  sections.forEach(section => {
    observer.observe(section);
  });
});

// Add copy functionality to credential boxes
document.querySelectorAll('.credential-box p').forEach(credential => {
  const originalHTML = credential.innerHTML;
  const textToCopy = credential.textContent.split(':')[1]?.trim() || credential.textContent;

  credential.innerHTML = `${originalHTML} <button class="copy-btn" data-copy="${textToCopy}"><i class="fas fa-copy"></i></button>`;
});

// Initialize copy buttons
document.addEventListener('click', function(e) {
  if (e.target.closest('.copy-btn')) {
    const button = e.target.closest('.copy-btn');
    const textToCopy = button.getAttribute('data-copy');

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Change icon temporarily
      const originalIcon = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';

      // Show notification
      showNotification('Copied to clipboard!', 'success');

      // Reset icon after a delay
      setTimeout(() => {
        button.innerHTML = originalIcon;
      }, 2000);
    });
  }
});
