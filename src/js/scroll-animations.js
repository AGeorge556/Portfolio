// Initialize scroll-based animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  // Create observer with improved settings for better timing
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay before triggering animation for better pacing
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, 150); // 150ms delay for better timing
        
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3, // Adjusted from 0.4 - trigger when 30% of the element is visible (more reasonable)
    rootMargin: '0px 0px -80px 0px' // Adjusted from -100px for better balance
  });
  
  // Observe all elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);