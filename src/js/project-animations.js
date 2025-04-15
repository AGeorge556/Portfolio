// Initialize project card animations
document.addEventListener('DOMContentLoaded', () => {
  // Set tag indices for staggered animations
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    const tags = card.querySelectorAll('.tech-tag');
    tags.forEach((tag, index) => {
      tag.style.setProperty('--tag-index', index);
    });
  });
});