// Main animation controller
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all animations
  initPageLoadAnimations();
  initScrollAnimations();
  initProjectAnimations();
  initNavAnimations();
  
  // Add animation classes to HTML elements
  setupAnimationClasses();
});

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

// Call this function early
applyReducedAnimations();