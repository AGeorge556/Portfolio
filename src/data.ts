import { FileSymlink as Html5, Rss as Css3, Subscript as Javascript, RepeatIcon as ReactIcon, Github as Git, Figma, Database, Server, Code2, Terminal, Package, Layout } from 'lucide-react';

export const skills = {
  core: [
    { name: 'HTML5', icon: Html5 },
    { name: 'CSS3', icon: Css3 },
    { name: 'JavaScript', icon: Javascript },
    { name: 'React', icon: ReactIcon },
  ],
  frameworks: [
    { name: 'React', icon: ReactIcon },
    { name: 'Next.js', icon: Code2 },
    { name: 'Tailwind CSS', icon: Layout },
    { name: 'TypeScript', icon: Code2 },
  ],
  tools: [
    { name: 'Git', icon: Git },
    { name: 'Figma', icon: Figma },
    { name: 'VS Code', icon: Terminal },
    { name: 'npm/yarn', icon: Package },
  ],
  backend: [
    { name: 'Node.js', icon: Server },
    { name: 'RESTful APIs', icon: Code2 },
    { name: 'MongoDB', icon: Database },
    { name: 'PostgreSQL', icon: Database },
  ],
};

export const projects = [
  {
    title: 'E-Commerce Plant Shop',
    description: 'A dynamic e-commerce platform specializing in plants, featuring an intuitive shopping experience with a modern interface and seamless checkout process.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'JavaScript', 'CSS', 'HTML'],
    demo: 'https://ageorge556.github.io/e-plantShopping/',
    github: 'https://github.com/AGeorge556/e-plantShopping',
  },
  {
    title: 'Clear View Clinics',
    description: 'A professional website for an Ophthalmic Surgeon in Egypt, featuring a clean design that showcases medical services, patient information, and appointment scheduling.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'JavaScript', 'Responsive Design'],
    demo: 'https://ageorge556.github.io/ClearViewClinics/',
    github: 'https://github.com/AGeorge556/ClearViewClinics',
  },
  {
    title: 'Trust Pharma LTD',
    description: 'A comprehensive website for Trust Pharma LTD, an Egyptian pharmaceutical company, showcasing their products, services, and company information with a professional interface.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'JavaScript', 'Modern UI'],
    demo: 'https://john-0-andrew.github.io/trust-pharma/',
    github: 'https://github.com/john-0-andrew/trust-pharma',
  },
  {
    title: 'European Travel Weather Forecast',
    description: 'A React application providing 7-day weather forecasts for major European cities, helping travelers plan their trips with accurate weather information for their destinations.',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'Weather API', 'JavaScript'],
    demo: 'https://ageorge556.github.io/European-travel-agency/',
    github: 'https://github.com/AGeorge556/European-travel-agency',
  },
];