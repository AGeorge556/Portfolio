import React, { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      
      container.appendChild(element);
    }
  }, []);

  return (
    <div ref={containerRef} className="bg-elements absolute inset-0 pointer-events-none" />
  );
} 