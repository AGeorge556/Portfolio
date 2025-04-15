// Create a scroll progress indicator
document.addEventListener('DOMContentLoaded', () => {
  // Create progress bar element
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.scrollY;
    
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  });
});