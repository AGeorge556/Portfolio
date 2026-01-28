export const skills = {
  core: [
    { name: 'React.js', level: 'Advanced', achievements: ['Custom hooks', 'Performance optimization', 'State management'] },
    { name: 'TypeScript', level: 'Advanced', achievements: ['Type safety', 'Interface design', 'Generics'] },
    { name: 'Next.js', level: 'Intermediate', achievements: ['SSR implementation', 'API routes', 'App Router'] },
    { name: 'JavaScript', level: 'Advanced', achievements: ['ES6+', 'Async patterns', 'DOM manipulation'] },
    { name: 'HTML5', level: 'Advanced', achievements: ['Semantic markup', 'Accessibility (WCAG 2.1)'] },
    { name: 'CSS3', level: 'Advanced', achievements: ['Responsive design', 'Animations', 'Flexbox/Grid'] },
  ],
  frameworks: [
    { name: 'Tailwind CSS', level: 'Advanced', achievements: ['Custom design systems', 'Responsive layouts'] },
    { name: 'Flutter', level: 'Intermediate', achievements: ['Cross-platform apps', 'Supabase integration'] },
    { name: 'Bootstrap', level: 'Advanced', achievements: ['Custom themes', 'Responsive components'] },
    { name: 'Framer Motion', level: 'Intermediate', achievements: ['Page transitions', 'Scroll animations'] },
  ],
  backend: [
    { name: 'Supabase', level: 'Advanced', achievements: ['Auth', 'RLS policies', 'Real-time subscriptions'] },
    { name: 'Node.js', level: 'Intermediate', achievements: ['REST APIs', 'Express.js', 'Middleware'] },
    { name: 'PostgreSQL', level: 'Intermediate', achievements: ['Schema design', 'Row-level security'] },
    { name: 'MongoDB', level: 'Intermediate', achievements: ['Data modeling', 'Aggregation pipelines'] },
    { name: 'RESTful APIs', level: 'Advanced', achievements: ['API design', 'Third-party integration'] },
  ],
  tools: [
    { name: 'Git / GitHub', level: 'Advanced', achievements: ['Branch strategy', 'Code reviews', 'CI/CD'] },
    { name: 'Vercel', level: 'Advanced', achievements: ['Deployment', 'Preview builds'] },
    { name: 'Figma', level: 'Intermediate', achievements: ['UI/UX design', 'Prototyping'] },
    { name: 'VS Code', level: 'Advanced', achievements: ['Extensions', 'Debugging'] },
  ],
};

export const experience = [
  {
    title: 'Full-Stack Developer',
    company: 'Streams Of Living Water',
    location: 'Cairo, Egypt',
    period: 'Aug 2025 - Present',
    current: true,
    highlights: [
      'Architected and developed a cross-platform ERP system (Web, Mobile, Desktop) to digitize and unify core nonprofit operations',
      'Owned end-to-end system design: clean architecture, database schema, role-based access control, and security (RLS)',
      'Built core platform infrastructure including authentication, user management, permissions, and offline-first sync',
      'Designed data models and workflows for multi-role environments (admins, coordinators, teachers, students, staff)',
      'Integrated backend services (Supabase, PostgreSQL, storage, email workflows) with Flutter frontend',
      'Defined MVP scope, sprint backlog, and long-term technical roadmap from foundation to production scale',
    ],
    technologies: ['React', 'Flutter', 'Supabase', 'PostgreSQL', 'TypeScript'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'Clear View Clinics',
    location: 'Cairo, Egypt',
    period: 'Jan 2025 - May 2025',
    current: false,
    highlights: [
      'Developed secure, interactive web applications using modern front-end frameworks with clean, intuitive interfaces',
      'Built dynamic, reusable React components to improve development speed, scalability, and maintainability',
      'Integrated third-party APIs to extend application functionality and enable real-time features',
      'Collaborated closely with backend developers to ensure reliable API integration and data consistency',
      'Delivered features under tight deadlines with strong prioritization and problem-solving',
    ],
    technologies: ['React', 'JavaScript', 'REST APIs', 'Responsive Design'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'Trust Pharma LTD',
    location: 'Cairo, Egypt',
    period: 'Jun 2023 - Dec 2023',
    current: false,
    highlights: [
      'Designed and implemented user-friendly, responsive web interfaces enhancing usability and engagement',
      'Worked closely with UI/UX designers to translate designs into production-ready web applications',
      'Optimized front-end performance, significantly reducing page load times',
      'Led adoption and integration of new technologies to improve application capabilities',
      'Participated in code reviews to enforce best practices and maintain code quality',
    ],
    technologies: ['React', 'JavaScript', 'Git', 'Performance Optimization'],
  },
];

export const education = {
  degree: "Bachelor's degree in Computer Science",
  track: 'General Track',
  university: 'Nile University',
  location: 'Sheikh Zayed, Egypt',
  graduated: 'Jul 2025',
  gpa: '3.24',
  gradProject: 'ImmerseAI - Educational video summarization and visualization web app using Deep Learning',
  certification: {
    name: 'IBM Professional Front-End Developer',
    period: 'Mar 2025 - Apr 2025',
    link: 'https://coursera.org/share/899f937de16ce48448f5f09d6d11bf1d',
  },
};

export const projects = [
  {
    title: 'StayHealthy',
    description: 'A modern healthcare platform that allows users to book in-person medical appointments and schedule instant online consultations with healthcare professionals.',
    metrics: {
      performance: '95% Lighthouse',
      accessibility: '100% WCAG 2.1',
      userSatisfaction: '95% positive',
      bookingTime: '60% faster booking'
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
      performance: '98% Lighthouse',
      accessibility: '100% WCAG 2.1',
      userEngagement: '+40% bookings',
      loadTime: '1.2s load time'
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
    description: 'A comprehensive website for an Egyptian pharmaceutical company, showcasing their products, services, and company information with a professional, accessible interface.',
    metrics: {
      performance: '96% Lighthouse',
      accessibility: '100% WCAG 2.1',
      userEngagement: '+35% submissions',
      loadTime: '1.5s load time'
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
    description: 'A React application providing 7-day weather forecasts for major European cities, helping travelers plan their trips with accurate weather data.',
    metrics: {
      performance: '94% Lighthouse',
      accessibility: '100% WCAG 2.1',
      userSatisfaction: '90% positive',
      loadTime: '1.8s load time'
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
      performance: '93% Lighthouse',
      accessibility: '100% WCAG 2.1',
      userSatisfaction: '92% positive',
      conversionRate: '+25% sales'
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
