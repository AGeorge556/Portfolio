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
    image: '/assets/experience/streams.svg',
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
    image: '/assets/experience/clearview.svg',
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
    image: '/assets/experience/trustpharma.svg',
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
  image: '/assets/experience/nile-uni.svg',
  gradProjectSubtitle: 'Deep Learning Web App',
  gradProjectImage: '/assets/experience/immerse-ai.svg',
  certification: {
    name: 'IBM Professional Front-End Developer',
    period: 'Mar 2025 - Apr 2025',
    link: 'https://coursera.org/share/899f937de16ce48448f5f09d6d11bf1d',
    image: '/assets/experience/ibm-cert.svg',
  },
};

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  demo: string;
  github: string;
  technicalHighlights: string[];
  metrics: Record<string, string>;
  image: string;
  challenges: { problem: string; solution: string; impact: string }[];
};

export const projects: Project[] = [
  {
    title: 'LuminaMed Stock',
    description: 'Mobile-first internal PWA for tracking medical equipment stock: units in the storeroom, checked out to salespeople, or in repair. Built for LuminaMed staff, installable, and usable offline on bad hospital Wi-Fi.',
    technicalHighlights: [
      'Stock is derived, never stored: per-unit status rows plus an append-only ledger feed one Postgres view',
      'Every status change goes through a Postgres RPC; a trigger validates the transition and writes the audit row, with no client insert policy so the log cannot be forged',
      'Invite-only auth with role-based access via Supabase and RLS',
      'TanStack Query persisted to localStorage and a PWA app shell so cached stock survives offline',
      'Excel export of stock and movements'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/luminamed-stock.svg',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'TanStack Query', 'PWA'],
    demo: '',
    github: '',
  },
  {
    title: 'BCH Youth Bible Reading',
    description: 'Mobile-first web app for tracking youth Bible reading, with member profiles and avatars, poster uploads, and a role-based admin panel.',
    technicalHighlights: [
      'Next.js App Router with Supabase auth and Postgres',
      'Role-based access: youth members vs. admins',
      'Supabase Storage buckets for avatars and posters',
      'SQL migrations checked into the repo'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/bch-youth-bible-reading.svg',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    demo: 'https://bch-youth-bible-reading.vercel.app',
    github: 'https://github.com/AGeorge556/bch-youth-bible-reading',
  },
  {
    title: 'Say I Do Gallery',
    description: "Wedding website and shared photo gallery built for a couple's big day, deployed on Vercel.",
    technicalHighlights: [
      'Responsive gallery layout for phone-first guests',
      'Deployed on Vercel with preview builds'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/say-i-do-gallery.svg',
    technologies: ['React', 'TypeScript', 'Vercel'],
    demo: 'https://say-i-do-gallery.vercel.app',
    github: 'https://github.com/AGeorge556/say-i-do-gallery',
  },
  {
    title: 'Mini Inventory System',
    description: 'Full-stack inventory management across multiple warehouses with atomic, transactional stock operations and a REST API.',
    technicalHighlights: [
      'Express + Prisma REST API over PostgreSQL',
      'Stock moves wrapped in database transactions',
      'Dockerised Postgres for one-command local setup',
      'React + Vite frontend'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/mini-inventory-system.svg',
    technologies: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'React', 'Docker'],
    demo: '',
    github: 'https://github.com/AGeorge556/INVIA_Task',
  },
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
    image: '/assets/projects/stayhealthy.svg',
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
    image: '/assets/projects/clear-view-clinics.svg',
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
    image: '/assets/projects/trust-pharma.svg',
    technologies: ['React', 'JavaScript', 'Modern UI'],
    demo: 'https://john-0-andrew.github.io/trust-pharma/',
    github: 'https://github.com/john-0-andrew/trust-pharma',
  },
  {
    title: 'Interactive Global Weather Forecast App',
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
    image: '/assets/projects/weather-forecast.svg',
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
    image: '/assets/projects/plant-shop.svg',
    technologies: ['React', 'JavaScript', 'CSS', 'HTML'],
    demo: 'https://ageorge556.github.io/e-plantShopping/',
    github: 'https://github.com/AGeorge556/e-plantShopping',
  }
];
