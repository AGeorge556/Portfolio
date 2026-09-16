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
};

export type CourseCertificate = {
  title: string;
  date: string;
  verify: string;
  pdf: string;
  image: string;
  honors: boolean;
};

export type CertificationGroup = {
  id: string;
  program: string;
  issuer: string;
  date: string;
  credential?: string;
  pdf?: string;
  image?: string;
  courses: CourseCertificate[];
};

export const certifications: CertificationGroup[] = [
  {
    id: 'ibm-front-end',
    program: 'IBM Front-End Developer Professional Certificate',
    issuer: 'IBM via Coursera',
    date: 'Apr 7, 2025',
    credential: 'https://coursera.org/verify/professional-cert/DP6FKDNZET4B',
    pdf: '/assets/certificates/ibm-front-end-developer.pdf',
    image: '/assets/certificates/ibm-front-end-developer.webp',
    courses: [
      { title: 'Getting Started with Front-End and Web Development', date: 'Mar 25, 2025', verify: 'https://coursera.org/verify/CKN1TXTUZJMU', pdf: '/assets/certificates/getting-started-with-front-end-and-web.pdf', image: '/assets/certificates/getting-started-with-front-end-and-web.webp', honors: true },
      { title: 'Introduction to Software Engineering', date: 'Mar 25, 2025', verify: 'https://coursera.org/verify/QSGFDQXL8E76', pdf: '/assets/certificates/introduction-to-software-engineering.pdf', image: '/assets/certificates/introduction-to-software-engineering.webp', honors: true },
      { title: 'Designing User Interfaces and Experiences (UI/UX)', date: 'Mar 26, 2025', verify: 'https://coursera.org/verify/WQXV9IFFHSN5', pdf: '/assets/certificates/designing-user-interfaces-and-experiences-uiux.pdf', image: '/assets/certificates/designing-user-interfaces-and-experiences-uiux.webp', honors: true },
      { title: 'Developing Websites and Front-Ends with Bootstrap', date: 'Mar 26, 2025', verify: 'https://coursera.org/verify/24THOYZUE489', pdf: '/assets/certificates/developing-websites-and-front-ends-with.pdf', image: '/assets/certificates/developing-websites-and-front-ends-with.webp', honors: false },
      { title: 'Getting Started with Git and GitHub', date: 'Mar 26, 2025', verify: 'https://coursera.org/verify/FWHZG7Q00CJQ', pdf: '/assets/certificates/getting-started-with-git-and-github.pdf', image: '/assets/certificates/getting-started-with-git-and-github.webp', honors: false },
      { title: 'Introduction to HTML, CSS, & JavaScript', date: 'Mar 26, 2025', verify: 'https://coursera.org/verify/J9IMP1YPBZ34', pdf: '/assets/certificates/introduction-to-html-css-javascript.pdf', image: '/assets/certificates/introduction-to-html-css-javascript.webp', honors: false },
      { title: 'Developing Front-End Apps with React', date: 'Apr 2, 2025', verify: 'https://coursera.org/verify/P79O0H28CPZ4', pdf: '/assets/certificates/developing-front-end-apps-with-react.pdf', image: '/assets/certificates/developing-front-end-apps-with-react.webp', honors: false },
      { title: 'Intermediate Web and Front-End Development', date: 'Apr 4, 2025', verify: 'https://coursera.org/verify/8W89PEF12D02', pdf: '/assets/certificates/intermediate-web-and-front-end-development.pdf', image: '/assets/certificates/intermediate-web-and-front-end-development.webp', honors: false },
      { title: 'Get Started with Cloud Native, DevOps, Agile, and NoSQL', date: 'Apr 5, 2025', verify: 'https://coursera.org/verify/VFGOE272S93I', pdf: '/assets/certificates/get-started-with-cloud-native-devops-agile-and-nosql.pdf', image: '/assets/certificates/get-started-with-cloud-native-devops-agile-and-nosql.webp', honors: false },
      { title: 'Front-End Development Capstone Project', date: 'Apr 7, 2025', verify: 'https://coursera.org/verify/5OQRV2Y0WNHE', pdf: '/assets/certificates/front-end-capstone-project.pdf', image: '/assets/certificates/front-end-capstone-project.webp', honors: false },
    ],
  },
  {
    id: 'microsoft-back-end',
    program: 'Microsoft Back-End Developer Professional Certificate',
    issuer: 'Microsoft via Coursera',
    date: 'Apr 28, 2026',
    credential: 'https://coursera.org/verify/professional-cert/E3XUQY3ZI8C7',
    pdf: '/assets/certificates/microsoft-back-end-developer.pdf',
    image: '/assets/certificates/microsoft-back-end-developer.webp',
    courses: [
      { title: 'Foundations of Coding Back-End', date: 'Apr 20, 2026', verify: 'https://coursera.org/verify/PJYBCXRSREW9', pdf: '/assets/certificates/foundations-of-coding-back-end.pdf', image: '/assets/certificates/foundations-of-coding-back-end.webp', honors: false },
      { title: 'Introduction to Programming With C#', date: 'Apr 21, 2026', verify: 'https://coursera.org/verify/0YZP92CU2JKJ', pdf: '/assets/certificates/intro-to-programming-with-c.pdf', image: '/assets/certificates/intro-to-programming-with-c.webp', honors: false },
      { title: 'Back-End Development with .NET', date: 'Apr 22, 2026', verify: 'https://coursera.org/verify/6S0H7DVDW2JH', pdf: '/assets/certificates/back-end-development-with-net.pdf', image: '/assets/certificates/back-end-development-with-net.webp', honors: false },
      { title: 'Database Integration and Management', date: 'Apr 22, 2026', verify: 'https://coursera.org/verify/LG7VVV65DR79', pdf: '/assets/certificates/database-integration-and-management.pdf', image: '/assets/certificates/database-integration-and-management.webp', honors: false },
      { title: 'Security and Authentication', date: 'Apr 22, 2026', verify: 'https://coursera.org/verify/MAJQC5KO2C8V', pdf: '/assets/certificates/security-and-authentication.pdf', image: '/assets/certificates/security-and-authentication.webp', honors: false },
      { title: 'Data Structures and Algorithms', date: 'Apr 23, 2026', verify: 'https://coursera.org/verify/4ZT3K4UN29VL', pdf: '/assets/certificates/data-stuctures-and-algorithms.pdf', image: '/assets/certificates/data-stuctures-and-algorithms.webp', honors: false },
      { title: 'Deployment and DevOps', date: 'Apr 28, 2026', verify: 'https://coursera.org/verify/GPDZKLXGUUN1', pdf: '/assets/certificates/deployment-and-devops.pdf', image: '/assets/certificates/deployment-and-devops.webp', honors: false },
      { title: 'Performance Optimization and Scalability', date: 'Apr 28, 2026', verify: 'https://coursera.org/verify/TR711T1PZCFD', pdf: '/assets/certificates/preformance-optimization-and-scalability.pdf', image: '/assets/certificates/preformance-optimization-and-scalability.webp', honors: false },
    ],
  },
  {
    id: 'ibm-genai',
    program: 'IBM Generative AI',
    issuer: 'IBM via Coursera',
    date: 'Apr 22, 2026',
    courses: [
      { title: 'Generative AI: Introduction and Applications', date: 'Jan 26, 2026', verify: 'https://coursera.org/verify/JU0P5OZN3UP4', pdf: '/assets/certificates/genai-intro-applications.pdf', image: '/assets/certificates/genai-intro-applications.webp', honors: false },
      { title: 'Generative AI: Prompt Engineering Basics', date: 'Jan 26, 2026', verify: 'https://coursera.org/verify/3V3DTK8HEAB2', pdf: '/assets/certificates/genai-prompt-engineering.pdf', image: '/assets/certificates/genai-prompt-engineering.webp', honors: false },
      { title: 'Generative AI: Elevate your Software Development Career', date: 'Apr 22, 2026', verify: 'https://coursera.org/verify/VJHHI7H87XAC', pdf: '/assets/certificates/genai-elevate-your-software-development-career.pdf', image: '/assets/certificates/genai-elevate-your-software-development-career.webp', honors: false },
    ],
  },
];

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
  nda?: boolean;
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
    title: 'WDC Operations Platform',
    description: 'Multi-phase internal operations platform for a client agency: client intake, requests, admin and settings, user-generated content, CRM, and finance, replacing a set of spreadsheets and Airtable bases. Delivered in reviewed vertical slices with a mutation-tested backend. Details are under NDA.',
    technicalHighlights: [
      'Next.js App Router on PostgreSQL with Drizzle ORM',
      'Every server mutation covered by a mutation-testing harness; end-to-end suite in Playwright',
      'Phased roadmap with plan gates and owner rulings recorded per phase',
      'Zero-downtime deploys via PM2 with a separate scheduler process'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/wdc-system.svg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Playwright', 'PM2'],
    demo: '',
    github: '',
    nda: true,
  },
  {
    title: 'Impact Chatbot',
    description: 'Telegram bot that tells refugees and migrants in Alexandria where to go for a service and what to expect, then checks back two days later whether the answer held up. Built for IMPACT Alexandria around a UNICEF proposal.',
    technicalHighlights: [
      'Whole conversation is a pure reducer with no I/O, clock, or network, so the flow is fully tested without a bot token (86 tests)',
      'Arabic and English copy, buttons-only intake, long polling with no inbound endpoint to secure',
      'Privacy by design: no phone numbers, chat ids stored in one place, anonymous JSONL event log',
      '48-hour follow-up that records helped, turned away, or did not go, plus an opt-in callback'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/impact-chatbot.svg',
    technologies: ['Node.js', 'Telegram Bot API', 'JavaScript'],
    demo: '',
    github: '',
  },
  {
    title: 'Live AE Translator',
    description: 'Real-time translator that listens to live Egyptian Arabic speech and streams English text back as the speaker talks.',
    technicalHighlights: [
      'Browser MediaRecorder captures WebM/Opus audio and streams it over a WebSocket',
      'FastAPI WebSocket server pipes chunks through OpenAI Whisper for transcription',
      'GPT-4o-mini translation streamed token by token to the UI',
      'Live connection, recording, and processing state indicators'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/live-ae-translator.svg',
    technologies: ['React', 'TypeScript', 'FastAPI', 'Python', 'WebSockets', 'OpenAI Whisper', 'GPT-4o-mini'],
    demo: '',
    github: '',
  },
  {
    title: 'SafeSight',
    description: 'Workplace hazard analysis: upload a site photo or a written description and get a structured hazard report grounded in the company safety policy.',
    technicalHighlights: [
      'GPT vision describes visible hazards factually before any reasoning happens',
      'Retrieval over the ingested safety-policy PDF grounds every report in the actual policy text',
      'Typed HazardReport response model from a FastAPI endpoint',
      'React front end for upload and report review'
    ],
    metrics: {},
    challenges: [],
    image: '/assets/projects/safesight.svg',
    technologies: ['Python', 'FastAPI', 'OpenAI', 'RAG', 'React', 'TypeScript'],
    demo: '',
    github: 'https://github.com/AGeorge556/SafeSight',
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
];
