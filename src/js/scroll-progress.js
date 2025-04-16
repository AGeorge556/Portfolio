// Create a scroll progress indicator
document.addEventListener('DOMContentLoaded', () => {
  // Create scroll line if it doesn't exist
  if (!document.querySelector('.scroll-line')) {
    const scrollLine = document.createElement('div');
    scrollLine.classList.add('scroll-line');
    document.body.appendChild(scrollLine);
  }

  // Update scroll progress
  function updateScrollProgress() {
    const scrollLine = document.querySelector('.scroll-line');
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    
    if (scrollLine) {
      scrollLine.style.width = `${scrolled}%`;
    }
  }

  // Initial call
  updateScrollProgress();

  // Update on scroll
  window.addEventListener('scroll', () => {
    updateScrollProgress();
  });
});