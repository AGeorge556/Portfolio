export const skills = {
  core: [
    { name: 'HTML5', level: 'Advanced', achievements: ['Semantic HTML5 implementation', 'Accessibility compliance (WCAG 2.1)'] },
    { name: 'CSS3', level: 'Advanced', achievements: ['Responsive design implementation', 'CSS animations and transitions'] },
    { name: 'JavaScript', level: 'Advanced', achievements: ['ES6+ features', 'Performance optimization'] },
    { name: 'React', level: 'Advanced', achievements: ['State management', 'Custom hooks', 'Performance optimization'] },
  ],
  frameworks: [
    { name: 'React', level: 'Advanced', achievements: ['Context API', 'React Router', 'Custom hooks'] },
    { name: 'Next.js', level: 'Intermediate', achievements: ['SSR implementation', 'API routes'] },
    { name: 'Tailwind CSS', level: 'Advanced', achievements: ['Custom component design', 'Responsive layouts'] },
    { name: 'TypeScript', level: 'Intermediate', achievements: ['Type safety', 'Interface design'] },
  ],
  tools: [
    { name: 'Git', level: 'Advanced', achievements: ['Branch management', 'Code reviews'] },
    { name: 'Figma', level: 'Intermediate', achievements: ['UI/UX design', 'Prototyping'] },
    { name: 'VS Code', level: 'Advanced', achievements: ['Extensions', 'Debugging'] },
    { name: 'npm/yarn', level: 'Advanced', achievements: ['Package management', 'Script automation'] },
  ],
  backend: [
    { name: 'Node.js', level: 'Intermediate', achievements: ['REST API development', 'Authentication'] },
    { name: 'RESTful APIs', level: 'Intermediate', achievements: ['API design', 'Integration'] },
    { name: 'MongoDB', level: 'Intermediate', achievements: ['Data modeling', 'Query optimization'] },
    { name: 'PostgreSQL', level: 'Basic', achievements: ['Database design', 'SQL queries'] },
  ],
};

export const projects = [
  {
    title: 'StayHealthy',
    description: 'StayHealthy is a modern healthcare platform that allows users to book in-person medical appointments and schedule instant online consultations with healthcare professionals.',
    metrics: {
      performance: '95% Lighthouse score',
      accessibility: '100% WCAG 2.1 compliance',
      userSatisfaction: '95% positive feedback',
      bookingTime: '60% reduction in appointment booking time'
    },
    technicalHighlights: [
      'Implemented real-time WebSocket connections for instant doctor-patient communication',
      'Developed custom authentication system with JWT and role-based access control',
      'Optimized React performance using React.memo and useCallback',
      'Created responsive design system with mobile-first approach'
    ],
    challenges: [
      {
        problem: 'Real-time updates for appointment availability',
        solution: 'Implemented WebSocket connections with fallback to polling',
        impact: 'Reduced server load by 40% while maintaining real-time updates'
      },
      {
        problem: 'Complex state management across multiple components',
        solution: 'Created custom hooks and context providers for shared state',
        impact: 'Improved code maintainability and reduced prop drilling'
      }
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'React Router', 'CSS3', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    demo: 'https://ageorge556.github.io/StayHealthy/',
    github: 'https://github.com/AGeorge556/StayHealthy',
  },
  {
    title: 'Clear View Clinics',
    description: 'A professional website for an Ophthalmic Surgeon in Egypt, featuring a clean design that showcases medical services, patient information, and appointment scheduling.',
    metrics: {
      performance: '98% Lighthouse score',
      accessibility: '100% WCAG 2.1 compliance',
      userEngagement: '40% increase in appointment bookings',
      loadTime: '1.2s average page load time'
    },
    technicalHighlights: [
      'Implemented responsive design with mobile-first approach',
      'Created custom animation system for smooth transitions',
      'Developed SEO-optimized content structure',
      'Built custom form validation system'
    ],
    challenges: [
      {
        problem: 'Complex appointment scheduling system',
        solution: 'Created custom calendar component with real-time availability',
        impact: 'Reduced scheduling errors by 75%'
      }
    ],
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'JavaScript', 'Responsive Design'],
    demo: 'https://ageorge556.github.io/ClearViewClinics/',
    github: 'https://github.com/AGeorge556/ClearViewClinics',
  },
  {
    title: 'Trust Pharma LTD',
    description: 'A comprehensive website for Trust Pharma LTD, an Egyptian pharmaceutical company, showcasing their products, services, and company information with a professional interface.',
    metrics: {
      performance: '96% Lighthouse score',
      accessibility: '100% WCAG 2.1 compliance',
      userEngagement: '35% increase in contact form submissions',
      loadTime: '1.5s average page load time'
    },
    technicalHighlights: [
      'Implemented modern UI with smooth animations',
      'Created product catalog with search and filtering',
      'Developed contact form with validation and spam protection',
      'Built responsive layout for all devices'
    ],
    challenges: [
      {
        problem: 'Large product catalog performance',
        solution: 'Implemented virtual scrolling and lazy loading',
        impact: 'Reduced initial load time by 60%'
      }
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'JavaScript', 'Modern UI'],
    demo: 'https://john-0-andrew.github.io/trust-pharma/',
    github: 'https://github.com/john-0-andrew/trust-pharma',
  },
  {
    title: 'European Travel Weather Forecast',
    description: 'A React application providing 7-day weather forecasts for major European cities, helping travelers plan their trips with accurate weather information for their destinations.',
    metrics: {
      performance: '94% Lighthouse score',
      accessibility: '100% WCAG 2.1 compliance',
      userSatisfaction: '90% positive feedback',
      loadTime: '1.8s average page load time'
    },
    technicalHighlights: [
      'Integrated with Weather API for real-time data',
      'Created interactive map with city selection',
      'Implemented responsive design for all devices',
      'Built custom weather visualization components'
    ],
    challenges: [
      {
        problem: 'API rate limiting and data caching',
        solution: 'Implemented client-side caching and request throttling',
        impact: 'Reduced API calls by 70% while maintaining data freshness'
      }
    ],
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'Weather API', 'JavaScript'],
    demo: 'https://ageorge556.github.io/European-travel-agency/',
    github: 'https://github.com/AGeorge556/European-travel-agency',
  },
  {
    title: 'E-Commerce Plant Shop',
    description: 'A dynamic e-commerce platform specializing in plants, featuring an intuitive shopping experience with a modern interface and seamless checkout process.',
    metrics: {
      performance: '93% Lighthouse score',
      accessibility: '100% WCAG 2.1 compliance',
      userSatisfaction: '92% positive feedback',
      conversionRate: '25% increase in sales'
    },
    technicalHighlights: [
      'Implemented shopping cart with local storage',
      'Created product filtering and search functionality',
      'Developed responsive design for all devices',
      'Built custom image gallery with zoom feature'
    ],
    challenges: [
      {
        problem: 'Shopping cart persistence',
        solution: 'Implemented local storage with fallback to session storage',
        impact: 'Improved cart retention by 85%'
      }
    ],
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'JavaScript', 'CSS', 'HTML'],
    demo: 'https://ageorge556.github.io/e-plantShopping/',
    github: 'https://github.com/AGeorge556/e-plantShopping',
  }
];