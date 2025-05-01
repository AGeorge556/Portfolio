// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.md\\:hidden button');
  const mobileMenu = document.querySelector('.md\\:hidden .animate-fade-in');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      menuButton.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      
      // Prevent scrolling when menu is open
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
});