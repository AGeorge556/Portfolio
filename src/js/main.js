// Main animation controller
document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations
  initPageLoadAnimations();
  setupAnimationClasses();
  applyReducedAnimations();
});

function initPageLoadAnimations() {
  // Fade in main sections
  document.querySelectorAll('section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 200);
  });

  // Animate skill icons
  document.querySelectorAll('.skill-icon').forEach((icon, index) => {
    icon.style.opacity = '0';
    icon.style.transform = 'scale(0.8)';
    icon.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      icon.style.opacity = '1';
      icon.style.transform = 'scale(1)';
    }, index * 100);
  });
}

function setupAnimationClasses() {
  // Add scroll animation classes to elements
  document.querySelectorAll('.about-section p, .about-section h2').forEach(el => {
    el.classList.add('scroll-animate', 'fade-up');
  });
  
  document.querySelectorAll('.skill-bar').forEach(el => {
    el.classList.add('scroll-animate');
  });
  
  document.querySelectorAll('.project-card').forEach(el => {
    el.classList.add('scroll-animate', 'fade-up');
  });
  
  document.querySelectorAll('.contact-section form').forEach(el => {
    el.classList.add('scroll-animate', 'fade-in');
  });
}

// Check if animations should be reduced based on user preferences
function shouldReduceAnimations() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Apply reduced animations if needed
function applyReducedAnimations() {
  if (shouldReduceAnimations()) {
    document.body.classList.add('reduced-motion');
    
    // Override transitions and animations
    const style = document.createElement('style');
    style.textContent = `
      .reduced-motion * {
        transition-duration: 0.1s !important;
        animation-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize reduced motion check
applyReducedAnimations();