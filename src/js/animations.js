// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Main sections fade-in
  const mainSections = document.querySelectorAll('.section');
  
  mainSections.forEach((section, index) => {
    // Add initial styles
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    
    // Delay each section slightly
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 300 + (index * 150));
  });
  
  // Initialize other animations
  initStaggeredAnimations();
  initScrollAnimations();
});

// Staggered animations for child elements
function initStaggeredAnimations() {
  const containers = document.querySelectorAll('.stagger-container');
  
  containers.forEach(container => {
    const children = container.querySelectorAll('.stagger-item');
    
    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(15px)';
      child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 500 + (index * 100));
    });
  });
}