// Background animations
document.addEventListener('DOMContentLoaded', () => {
  // Setup background elements for hero section
  const bgElements = document.querySelector('.bg-elements');
  if (bgElements) {
    // Create background elements
    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div');
      element.classList.add('bg-element');
      
      // Random size between 50px and 300px
      const size = Math.floor(Math.random() * 250) + 50;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      
      // Random position
      element.style.left = `${Math.floor(Math.random() * 100)}%`;
      element.style.top = `${Math.floor(Math.random() * 100)}%`;
      
      // Random animation delay
      element.style.animationDelay = `${Math.floor(Math.random() * 10)}s`;
      
      bgElements.appendChild(element);
    }
  }

  // Setup custom cursor
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    // Add effect when hovering over links and buttons
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-grow');
      });
      
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-grow');
      });
    });
  }

  // Fade in elements when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });

  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}); 