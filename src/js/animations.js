// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Main sections fade-in
  const mainSections = document.querySelectorAll('.section');
  
  mainSections.forEach((section, index) => {
    // Add initial styles
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = `opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)`;
    
    // Delay each section slightly
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
  
  // Initialize other animations
  initRevealAnimations();
  initStaggeredAnimations();
  initScrollAnimations();

  // Animated entrance for skill icons with particle effects
  const skillIcons = document.querySelectorAll('.skill-icon');
  skillIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.1}s`;
    
    // Add glowing particle effect on hover
    icon.addEventListener('mouseenter', () => {
      createParticles(icon);
    });
  });

  // Intersection Observer for project cards
  const projectsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Animate each project's children with staggered delays
        const children = entry.target.querySelectorAll('.project-title, .project-category, .project-description, .btn');
        children.forEach((child, index) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(20px)';
          child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          child.style.transitionDelay = `${0.2 + (index * 0.1)}s`;
          
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, 100);
        });
        
        projectsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe all project cards
  document.querySelectorAll('.project').forEach(project => {
    projectsObserver.observe(project);
  });

  // Add glittering effect to skill cards
  const skillCards = document.querySelectorAll('.stagger-item');
  skillCards.forEach(card => {
    // Add sparkle elements to each card
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.style.position = 'absolute';
      sparkle.style.width = '8px';
      sparkle.style.height = '8px';
      sparkle.style.borderRadius = '50%';
      sparkle.style.backgroundColor = 'rgba(99, 102, 241, 0.6)';
      sparkle.style.boxShadow = '0 0 10px 2px rgba(99, 102, 241, 0.4)';
      sparkle.style.opacity = '0';
      sparkle.style.transition = 'all 0.5s ease';
      sparkle.style.zIndex = '10';
      
      // Random position
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      
      card.appendChild(sparkle);
    }
    
    // Hover effect with super animated skills
    card.addEventListener('mouseenter', () => {
      // Scale and rotate card
      card.style.transform = 'translateY(-20px) scale(1.05) rotate(1deg)';
      card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(99, 102, 241, 0.4)';
      
      // Animate sparkles
      card.querySelectorAll('.sparkle').forEach((sparkle, i) => {
        setTimeout(() => {
          sparkle.style.opacity = '1';
          sparkle.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px)`;
        }, i * 100);
      });
      
      // Animate skill icons
      const icons = card.querySelectorAll('.skill-icon');
      icons.forEach((icon, index) => {
        icon.style.transitionDelay = `${index * 0.07}s`;
        icon.style.transform = 'translateX(10px) scale(1.15)';
        icon.style.color = '#4f46e5';
        
        // Add a glowing effect to icons
        const iconSvg = icon.querySelector('svg');
        if (iconSvg) {
          iconSvg.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))';
          iconSvg.style.animation = 'pulse 1.5s infinite';
        }
      });
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset card
      card.style.transform = '';
      card.style.boxShadow = '';
      
      // Hide sparkles
      card.querySelectorAll('.sparkle').forEach(sparkle => {
        sparkle.style.opacity = '0';
        sparkle.style.transform = 'translate(0, 0)';
      });
      
      // Reset skill icons
      const icons = card.querySelectorAll('.skill-icon');
      icons.forEach(icon => {
        icon.style.transitionDelay = '0s';
        icon.style.transform = '';
        icon.style.color = '';
        
        const iconSvg = icon.querySelector('svg');
        if (iconSvg) {
          iconSvg.style.filter = '';
          iconSvg.style.animation = '';
        }
      });
    });
  });
  
  // Enhance project cards with advanced hover effects
  const projectCards = document.querySelectorAll('.project');
  projectCards.forEach((card, index) => {
    // Set initial animation
    card.style.animationDelay = `${0.2 + (index * 0.15)}s`;
    
    // Add 3D tilt effect on mouse move
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Reduce the rotation angle for a more subtle effect
      const offsetX = ((x - centerX) / centerX) * 5; // Reduced from 10 to 5
      const offsetY = ((y - centerY) / centerY) * 5; // Reduced from 10 to 5
      
      // Apply gentler 3D transform
      card.style.transform = `perspective(1000px) rotateY(${offsetX}deg) rotateX(${-offsetY}deg) translateY(-10px) scale(1.02)`;
      
      // Softer shadow effect
      const shadowX = offsetX * 2;
      const shadowY = offsetY * 2;
      card.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.1), 0 0 20px rgba(99, 102, 241, 0.2)`;
      
      // Gentler movement for inner elements
      const title = card.querySelector('.project-title');
      const image = card.querySelector('.project-image img');
      const buttons = card.querySelectorAll('.btn');
      
      if (title) title.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
      if (image) image.style.transform = `scale(1.05) translateX(${-offsetX}px) translateY(${-offsetY}px)`;
      
      buttons.forEach((button, i) => {
        button.style.transform = `translateX(${offsetX * 0.5}px) translateY(${offsetY * 0.5}px)`;
      });
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      
      // Reset inner elements
      const elements = card.querySelectorAll('.project-title, .project-image img, .btn');
      elements.forEach(el => {
        el.style.transform = '';
      });
    });
    
    // Add highlight animation on buttons
    const buttons = card.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-8px) scale(1.05)';
        button.style.boxShadow = '0 10px 20px rgba(79, 70, 229, 0.4)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.style.boxShadow = '';
      });
    });
  });

  // Add particle effects to skill icons
  skillIcons.forEach(icon => {
    initParticleEffect(icon);
  });
  
  // Add 3D tilt effect to project cards
  projectCards.forEach(card => {
    init3DTiltEffect(card);
  });
  
  // Add keyframes for particle animation if they don't exist
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes particle-fade {
      0% { transform: translate(${0}px, ${0}px); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translate(var(--x, 0), var(--y, 0)) translateX(var(--tx, 0)) translateY(var(--ty, 0)); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  // Initialize scroll indicator animations
  initScrollIndicatorAnimations();
});

// Create particle effects for skill icons
function createParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create 10 particles
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('span');
    particle.className = 'skill-particle';
    particle.style.position = 'fixed';
    particle.style.width = `${Math.random() * 6 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = '#4f46e5';
    particle.style.boxShadow = '0 0 10px 2px rgba(99, 102, 241, 0.6)';
    particle.style.zIndex = '9999';
    particle.style.pointerEvents = 'none';
    
    // Random initial position near the element
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    
    // Random direction and speed
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 60 + 30;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    document.body.appendChild(particle);
    
    // Animate particle
    const startTime = performance.now();
    const duration = Math.random() * 1000 + 500; // 0.5-1.5 seconds
    
    function animateParticle(time) {
      const elapsed = time - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        particle.remove();
        return;
      }
      
      const x = centerX + vx * progress;
      const y = centerY + vy * progress - (100 * progress * progress); // Add arc
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = 1 - progress;
      particle.style.transform = `scale(${1 - progress})`;
      
      requestAnimationFrame(animateParticle);
    }
    
    requestAnimationFrame(animateParticle);
  }
}

// Staggered animations for child elements
function initStaggeredAnimations() {
  const containers = document.querySelectorAll('.stagger-container');
  
  containers.forEach(container => {
    const children = container.querySelectorAll('.stagger-item');
    
    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px) scale(0.95)';
      child.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0) scale(1)';
      }, 500 + (index * 150));
    });
  });
}

// Scroll triggered animations
function initScrollAnimations() {
  // Use Intersection Observer to animate elements when they become visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add explosive entrance for skills section
        if (entry.target.classList.contains('skills-section')) {
          const skillsTitle = entry.target.querySelector('h2');
          if (skillsTitle) {
            skillsTitle.style.opacity = '0';
            skillsTitle.style.transform = 'scale(0.5)';
            skillsTitle.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Increased from 0.7s
            
            setTimeout(() => {
              skillsTitle.style.opacity = '1';
              skillsTitle.style.transform = 'scale(1)';
              
              // Add light ray effect behind the title
              const lightRay = document.createElement('div');
              lightRay.style.position = 'absolute';
              lightRay.style.top = '0';
              lightRay.style.left = '50%';
              lightRay.style.width = '2px';
              lightRay.style.height = '0';
              lightRay.style.backgroundColor = 'rgba(99, 102, 241, 0.6)';
              lightRay.style.boxShadow = '0 0 20px 5px rgba(99, 102, 241, 0.4)';
              lightRay.style.transform = 'translateX(-50%)';
              lightRay.style.transition = 'height 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Increased from 1s
              lightRay.style.zIndex = '-1';
              
              skillsTitle.parentNode.style.position = 'relative';
              skillsTitle.parentNode.appendChild(lightRay);
              
              setTimeout(() => {
                lightRay.style.height = '120px';
              }, 200); // Increased from 100ms
            }, 500); // Increased from 300ms
          }
          
          // Super entrance for skill cards with dramatic scale
          const skillCards = entry.target.querySelectorAll('.stagger-item');
          skillCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(100px) scale(0.8) rotate(-5deg)';
            card.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Increased from 0.8s
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1) rotate(0deg)';
              
              // Add pulsing border effect
              card.style.animation = 'cardPulse 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Increased from 2s
              card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(99, 102, 241, 0.3)';
              
              setTimeout(() => {
                card.style.boxShadow = '';
                card.style.animation = '';
              }, 2500); // Increased from 2000ms
            }, 600 + (index * 300)); // Increased delays for better spacing
          });
        }
        
        // Spectacular entrance for projects section
        if (entry.target.classList.contains('projects-section')) {
          const projectsTitle = entry.target.querySelector('h2');
          if (projectsTitle) {
            projectsTitle.style.opacity = '0';
            projectsTitle.style.transform = 'translateY(40px)'; // Increased from 30px
            projectsTitle.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Increased from 0.7s
            
            setTimeout(() => {
              projectsTitle.style.opacity = '1';
              projectsTitle.style.transform = 'translateY(0)';
              
              // Add highlight effect to title
              projectsTitle.style.background = 'linear-gradient(90deg, #4f46e5 0%, #818cf8 50%, #4f46e5 100%)';
              projectsTitle.style.backgroundSize = '200% auto';
              projectsTitle.style.WebkitBackgroundClip = 'text';
              projectsTitle.style.WebkitTextFillColor = 'transparent';
              projectsTitle.style.animation = 'gradientFlow 2.5s ease infinite'; // Increased from 2s
            }, 500); // Increased from 300ms
          }
          
          // Dramatic entrance for project cards
          const projectCards = entry.target.querySelectorAll('.project');
          projectCards.forEach((card, index) => {
            // Initial state - use a gentler animation
            card.style.opacity = '0';
            card.style.transform = 'perspective(1000px) rotateY(10deg) translateX(-40px) scale(0.95)'; // Increased from -30px
            card.style.transformOrigin = 'left center';
            card.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Increased from 0.8s
            
            // Animate each project with staggered timing
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'perspective(1000px) rotateY(0deg) translateX(0) scale(1)';
              
              // After the entrance animation completes, remove the transform to allow hover effects
              setTimeout(() => {
                card.style.transform = '';
              }, 1200); // Increased from 1000ms
              
              // Add reveal effect to project image
              const projectImage = card.querySelector('.project-image img');
              if (projectImage) {
                projectImage.style.clipPath = 'inset(100% 0 0 0)';
                projectImage.style.transition = 'clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'; // Increased from 1.2s and 0.2s
                
                setTimeout(() => {
                  projectImage.style.clipPath = 'inset(0 0 0 0)';
                }, 200); // Increased from 100ms
              }
              
              // Staggered animation for project content
              const elements = [
                card.querySelector('.project-title'),
                card.querySelector('.project-category'),
                card.querySelector('.project-description'),
                ...card.querySelectorAll('.btn')
              ].filter(el => el); // Remove nulls
              
              elements.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(25px)'; // Increased from 20px
                el.style.transition = `opacity 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.4 + (i * 0.15)}s, transform 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.4 + (i * 0.15)}s`; // Increased from 0.6s and 0.3s
                
                setTimeout(() => {
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                }, 1000 + (i * 150)); // Increased from 800ms and 100ms
              });
              
              // Add floating effect to buttons
              const buttons = card.querySelectorAll('.btn');
              buttons.forEach(button => {
                button.style.animation = 'buttonFloat 3.5s ease-in-out infinite'; // Increased from 3s
              });
            }, 800 + (index * 300)); // Increased delays for better spacing
          });
        }
        
        // Mark as animated
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 }); // Adjusted from 0.4 - more reasonable threshold
  
  // Observe main sections
  const sections = document.querySelectorAll('.skills-section, .projects-section');
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Add keyframe animations to stylesheet
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardPulse {
      0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
      100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
    }
    
    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes buttonFloat {
      0% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initializes a subtle particle effect around an element
 * @param {HTMLElement} element The element to add particles to
 */
function initParticleEffect(element) {
  // Only create particles on hover
  element.addEventListener('mouseenter', () => {
    // Create a container for particles
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-container');
    element.appendChild(particleContainer);
    
    // Create 10 particles
    for (let i = 0; i < 10; i++) {
      createParticle(particleContainer);
    }
    
    // Clean up particles after animation completes
    setTimeout(() => {
      if (particleContainer && particleContainer.parentNode === element) {
        element.removeChild(particleContainer);
      }
    }, 1500);
  });
}

/**
 * Creates a single particle element
 * @param {HTMLElement} container The container to append the particle to
 */
function createParticle(container) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  // Random position around the element
  const posX = Math.random() * 100 - 50;
  const posY = Math.random() * 100 - 50;
  
  // Random size
  const size = Math.random() * 5 + 3;
  
  // Random color based on the theme
  const colors = ['#ff7e5f', '#feb47b', '#00bcd4', '#6a1b9a'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Apply styles
  particle.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    border-radius: 50%;
    transform: translate(${posX}px, ${posY}px);
    opacity: 0;
    animation: particle-fade 1.5s ease-out forwards;
    pointer-events: none;
  `;
  
  container.appendChild(particle);
}

/**
 * Initializes a 3D tilt effect for an element
 * @param {HTMLElement} element The element to add the tilt effect to
 */
function init3DTiltEffect(element) {
  element.addEventListener('mousemove', e => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert mouse position to percentage of element dimensions
    const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
    
    // Apply the tilt effect (subtle rotation)
    element.style.transform = `perspective(1000px) rotateY(${xPercent * 5}deg) rotateX(${yPercent * -5}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Add a subtle highlight effect
    const highlight = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2), transparent 50%)`;
    element.style.backgroundImage = highlight;
  });
  
  // Reset on mouse leave
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
    element.style.backgroundImage = 'none';
  });
}

function initRevealAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(element => {
    revealObserver.observe(element);
  });
}

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

// Scroll Indicator Animations
function initScrollIndicatorAnimations() {
  const scrollDot = document.querySelector('.scroll-dot');
  const sectionIndicators = document.querySelectorAll('.section-indicator');
  
  if (!scrollDot || !sectionIndicators.length) return;

  // Add hover effects to section indicators
  sectionIndicators.forEach(indicator => {
    indicator.addEventListener('mouseenter', () => {
      indicator.style.transform = 'scale(1.1) translateX(-5px)';
      scrollDot.style.transform = 'scale(1.2)';
      scrollDot.style.boxShadow = '0 0 20px var(--primary-color), 0 0 40px var(--primary-color)';
    });

    indicator.addEventListener('mouseleave', () => {
      indicator.style.transform = '';
      scrollDot.style.transform = '';
      scrollDot.style.boxShadow = '';
    });
  });

  // Add smooth transitions when changing sections
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = st > lastScrollTop ? 'down' : 'up';
    
    if (scrollDot) {
      // Add momentum effect
      const momentum = scrollDirection === 'down' ? 5 : -5;
      scrollDot.style.transform = `translateY(${momentum}px)`;
      
      // Reset transform after transition
      setTimeout(() => {
        scrollDot.style.transform = '';
      }, 300);
    }
    
    lastScrollTop = st <= 0 ? 0 : st;
  }, false);
}