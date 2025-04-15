// Typing effect for hero section tagline
function typeEffect(element, text, speed = 100) {
  let i = 0;
  
  // Clear the element first
  element.textContent = '';
  
  // Start typing
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
      // Add blinking cursor at the end
      element.classList.add('typing-done');
    }
  }, speed);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const originalText = tagline.textContent;
    typeEffect(tagline, originalText);
  }
});