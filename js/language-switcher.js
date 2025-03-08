/**
 * Language Switcher
 * 
 * This script handles language switching across the entire application,
 * including the display window content.
 */

// Initialize with default language (can be changed based on user preference)
let currentLanguage = 'zh'; // Default to Chinese, can be 'en' for English

// Function to apply language to all elements with language attributes
function applyLanguage(lang) {
  currentLanguage = lang;
  
  // Save preference to localStorage
  localStorage.setItem('preferredLanguage', lang);
  
  // Apply to all elements with data-zh and data-en attributes
  document.querySelectorAll('[data-zh][data-en]').forEach(element => {
    // Hide all language text content
    const zhContent = element.getAttribute('data-zh');
    const enContent = element.getAttribute('data-en');
    
    if (lang === 'zh') {
      element.textContent = zhContent;
    } else {
      element.textContent = enContent;
    }
  });
  
  // Apply to all containers with data-lang attribute
  document.querySelectorAll('[data-lang]').forEach(container => {
    container.setAttribute('lang', lang);
    
    // This allows for CSS targeting based on current language
    if (lang === 'zh') {
      container.classList.remove('lang-en');
      container.classList.add('lang-zh');
    } else {
      container.classList.remove('lang-zh');
      container.classList.add('lang-en');
    }
  });
  
  // Update any language indicators in the UI
  const languageIndicators = document.querySelectorAll('.language-indicator');
  if (languageIndicators) {
    languageIndicators.forEach(indicator => {
      indicator.textContent = lang.toUpperCase();
    });
  }
  
  // Dispatch a custom event for other components to respond to
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

// Function to toggle between languages
function toggleLanguage() {
  const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
  applyLanguage(newLang);
}

// Set up the language from saved preference or default
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved language preference
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    applyLanguage(savedLanguage);
  } else {
    applyLanguage(currentLanguage); // Apply default
  }
  
  // Set up language switcher events
  const languageSwitchers = document.querySelectorAll('.language-switcher, .lang-switch-btn');
  if (languageSwitchers) {
    languageSwitchers.forEach(switcher => {
      switcher.addEventListener('click', toggleLanguage);
    });
  }
  
  // Apply language when content is dynamically loaded in the display window
  document.addEventListener('contentLoaded', () => {
    applyLanguage(currentLanguage);
  });
});

// Handle iframe content if present
function applyLanguageToIframe(iframe) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Apply language to all elements with data-zh and data-en attributes in iframe
    iframeDoc.querySelectorAll('[data-zh][data-en]').forEach(element => {
      const zhContent = element.getAttribute('data-zh');
      const enContent = element.getAttribute('data-en');
      
      element.textContent = currentLanguage === 'zh' ? zhContent : enContent;
    });
    
    // Apply language class to iframe body
    if (iframeDoc.body) {
      if (currentLanguage === 'zh') {
        iframeDoc.body.classList.remove('lang-en');
        iframeDoc.body.classList.add('lang-zh');
      } else {
        iframeDoc.body.classList.remove('lang-zh');
        iframeDoc.body.classList.add('lang-en');
      }
    }
  } catch (e) {
    console.error('Cannot access iframe content due to same-origin policy');
  }
}

// Apply language to iframes when they load
document.addEventListener('DOMContentLoaded', () => {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
      applyLanguageToIframe(iframe);
    });
  });
});

// Export functions for external use
window.languageSwitcher = {
  apply: applyLanguage,
  toggle: toggleLanguage,
  getCurrentLanguage: () => currentLanguage
}; 