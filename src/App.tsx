import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Github, Linkedin, Mail, ExternalLink, Download, ArrowRight } from 'lucide-react';
import { skills, projects } from './data';
import { Scene3D } from './components/Scene3D'
import { AnimatedBackground } from './components/AnimatedBackground'
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaAws } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import { useForm, ValidationError } from '@formspree/react';

function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    const sectionElements = sections.map(id => document.getElementById(id));
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate relative scroll position (0 to 1)
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      
      // Update dot position using CSS custom property
      const dot = document.querySelector('.scroll-dot') as HTMLElement;
      if (dot) {
        dot.style.setProperty('--scroll-position', `${scrollPercentage * windowHeight}px`);
      }
      
      // Find active section
      let currentSection = sections[0];
      sectionElements.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
            currentSection = sections[index];
          }
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-indicator">
      <div className="scroll-dot" />
      {['home', 'about', 'skills', 'projects', 'contact'].map((section, index) => (
        <div
          key={section}
          className={`section-indicator ${activeSection === section ? 'active' : ''}`}
          style={{ '--indicator-position': `${index * 25}%` } as React.CSSProperties}
          onClick={() => {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Add intersection observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for staggered card items
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
            cardObserver.unobserve(entry.target);
          }, 150);
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      sectionObserver.observe(section);
    });

    // Observe all stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
      cardObserver.observe(item);
    });

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  // Initialize useForm hook for contact form
  const [state, handleSubmit] = useForm("meogyobe");

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-200">
      {/* Scene3D and background elements are site-wide */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene3D />
        <AnimatedBackground />
        <div className="pattern-bg"></div>
      </div>
      
      <ScrollIndicator />
      {/* Custom cursor */}
      <div className="cursor hidden md:block"></div>
      
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gradient">AG</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Home</a>
              <a href="#about" className="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
              <a href="#skills" className="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Skills</a>
              <a href="#projects" className="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Projects</a>
              <a href="#contact" className="nav-link text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
              <button
                onClick={toggleDarkMode}
                className="theme-toggle p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 transition-transform duration-200 ease-in-out"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
              <a href="#home" className="nav-link block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Home</a>
              <a href="#about" className="nav-link block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
              <a href="#skills" className="nav-link block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Skills</a>
              <a href="#projects" className="nav-link block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Projects</a>
              <a href="#contact" className="nav-link block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
              <button
                onClick={toggleDarkMode}
                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-1">
        {/* Hero Section - 13g inspired design */}
        <section id="home" className="section min-h-screen pt-20 flex items-center relative overflow-hidden">
          <div className="container mx-auto px-4 z-10">
            <div className="hero-content text-center fade-in">
              <h1 className="display-text text-gray-900 dark:text-white mb-6">
                Crafting <span className="text-gradient">Clean</span>, Responsive Interfaces
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto alt-text">
                Front-end developer specializing in building exceptional digital experiences
              </p>
              <div className="flex flex-wrap justify-center space-x-4">
                <a
                  href="#contact"
                  className="button-hover-effect px-8 py-3 mb-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 flex items-center"
                >
                  Get in Touch <ArrowRight className="ml-2" size={18} />
                </a>
                <a
                  href="#projects"
                  className="button-hover-effect px-8 py-3 mb-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 transition duration-300"
                >
                  View Work
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section py-24 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center fade-in">About <span className="text-gradient">Me</span></h2>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-16 text-center max-w-2xl mx-auto alt-text">
              Passionate about creating beautiful, responsive, and user-friendly web experiences
            </p>
            <div className="about-content flex flex-col md:flex-row items-stretch gap-0">
              <div className="about-image md:w-1/2 fade-in">
                <img
                  src="./assets/profile.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-l-lg shadow-xl transition-transform duration-300"
                />
              </div>
              <div className="about-text md:w-1/2 fade-in">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 h-full rounded-r-lg shadow-xl transition-all duration-500 flex flex-col justify-between">
                  <div className="flex flex-col justify-center h-full">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6 leading-relaxed text-center">
                      Dynamic Front-End Engineer with a solid foundation in web development and a commitment to creating innovative solutions since September 2021. Expertise in modern technologies, including JavaScript and React, paired with a full grasp of HTML and CSS, drives the development of user-centric web applications.
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6 leading-relaxed text-center">
                      Known for optimizing performance and enhancing accessibility through responsive design, while maintaining project organization with version control systems. Passionate about continuous learning and collaboration, aiming to elevate user experiences and functionality in fast-paced environments.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="skills flex flex-wrap gap-3 mb-8 justify-center">
                      {Object.values(skills.core).map((skill) => (
                        <span key={skill.name} className="skill px-4 py-2 bg-gray-100/80 dark:bg-gray-700/80 rounded-full text-gray-800 dark:text-gray-200 font-semibold transition-transform hover:scale-105">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                    <a
                      href="./assets/resume.pdf"
                      className="button-hover-effect inline-flex items-center px-6 py-3 bg-gray-100/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                    >
                      <Download size={20} className="mr-2" />
                      Download Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <section id="projects" className="section py-24 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm" style={{ marginBottom: '200px', paddingBottom: '100px' }}>
          <div className="w-full max-w-[1800px] mx-auto px-2 md:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center fade-in">
              <span className="text-gradient">Featured</span> Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 text-center max-w-2xl mx-auto alt-text">
              A selection of my recent work, showcasing my skills and expertise
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center relative" style={{ zIndex: 20, marginBottom: '100px' }}>
              {projects.map((project, index) => {
                // 2-column layout: even index = left, odd = right
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={project.title}
                    className="project-hover-area flex items-stretch justify-center h-full"
                    style={{ padding: 32, boxSizing: 'border-box', height: '100%' }}
                    onMouseEnter={e => e.currentTarget.querySelector('.project-card')?.dispatchEvent(new Event('mouseenter', { bubbles: true }))}
                    onMouseLeave={e => e.currentTarget.querySelector('.project-card')?.dispatchEvent(new Event('mouseleave', { bubbles: true }))}
                  >
                    <div className="project-card-wrapper w-full flex justify-center h-full" style={{ height: '100%' }}>
                      <ProjectCard project={project} direction={isLeft ? 'right' : 'left'} />
                    </div>
                  </div>
                );
              })}
              <div className="project-card-overlay" />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section py-24 px-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm" style={{ position: 'relative', zIndex: 10 }}>
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center fade-in">Get In <span className="text-gradient">Touch</span></h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 text-center max-w-2xl mx-auto alt-text">
              Let's talk about your project and how I can help you bring your ideas to life
            </p>
            <div className="contact-content flex flex-col md:flex-row gap-12">
              <div className="contact-info md:w-1/2 fade-in">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Let's work together</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                </p>
                <div className="contact-links space-y-6">
                  <a href="mailto:gn_farag02@outlook.com" className="contact-link flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <Mail size={24} className="mr-4" />
                    Mail
                  </a>
                  <a href="https://github.com/AGeorge556" target="_blank" rel="noopener noreferrer" className="contact-link flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <Github size={24} className="mr-4" />
                    Github
                  </a>
                  <a href="https://www.linkedin.com/in/andrew-george-610535309" target="_blank" rel="noopener noreferrer" className="contact-link flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <Linkedin size={24} className="mr-4" />
                    Linkedin
                  </a>
                </div>
              </div>
              <div className="contact-form md:w-1/2 fade-in">
                {/* Check if the form has been submitted successfully */}
                {state.succeeded ? (
                  <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thank you for your message!</h3>
                    <p className="text-gray-700 dark:text-gray-300">I will get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-lg shadow-lg">
                    <div className="form-group mb-6">
                      <label htmlFor="name" className="form-label block mb-2 text-gray-700 dark:text-gray-300">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input input-focus-effect w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                        required
                      />
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="email" className="form-label block mb-2 text-gray-700 dark:text-gray-300">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input input-focus-effect w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                        required
                      />
                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                      />
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="message" className="form-label block mb-2 text-gray-700 dark:text-gray-300">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="form-textarea input-focus-effect w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 resize-y"
                        required
                      ></textarea>
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="button-hover-effect w-full py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                    >
                      Send Message <ArrowRight className="ml-2" size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Updated with 13g inspired design */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="footer-content flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="footer-logo text-2xl font-bold mb-6 md:mb-0 text-gradient">AG</div>
            <div className="footer-links mb-6 md:mb-0">
              <ul className="flex flex-wrap justify-center space-x-6">
                <li><a href="#home" className="hover:text-indigo-400 transition-colors duration-300">Home</a></li>
                <li><a href="#about" className="hover:text-indigo-400 transition-colors duration-300">About</a></li>
                <li><a href="#skills" className="hover:text-indigo-400 transition-colors duration-300">Skills</a></li>
                <li><a href="#projects" className="hover:text-indigo-400 transition-colors duration-300">Projects</a></li>
                <li><a href="#contact" className="hover:text-indigo-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div className="social-links flex space-x-4">
              <a href="https://github.com/AGeorge556" target="_blank" rel="noopener noreferrer" className="social-link hover:text-indigo-400 transition-colors duration-300">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/andrew-george-610535309" target="_blank" rel="noopener noreferrer" className="social-link hover:text-indigo-400 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="mailto:gn_farag02@outlook.com" className="social-link hover:text-indigo-400 transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>
          <div className="footer-bottom text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
            <p>&copy; {new Date().getFullYear()} AG Portfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-[1800px] mx-auto px-2 md:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {Object.entries(skills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-10 shadow-2xl flex flex-col items-center">
              <h3 className="text-2xl font-bold text-center mb-8 capitalize tracking-wide">{category}</h3>
              <div className="flex flex-col gap-6 w-full">
                {categorySkills.map((skill) => (
                  <div key={skill.name} className="relative group w-full">
                    <div className="flex items-center w-full cursor-pointer">
                      <div className="w-14 h-14 bg-indigo-200 dark:bg-indigo-900 rounded-xl flex items-center justify-center mr-5 transition-transform hover:scale-110">
                        <skill.icon size={32} className="text-indigo-700 dark:text-indigo-300" />
                      </div>
                      <h3 className="text-lg font-semibold">{skill.name}</h3>
                    </div>
                    {/* Dropdown appears below the icon row, not over it */}
                    <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white dark:bg-gray-900 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-5 min-w-[220px]">
                      <ul className="space-y-3">
                        {skill.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-indigo-500 mr-2 text-base">•</span>
                            <span className="text-sm text-gray-700 dark:text-gray-200">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demo?: string;
  github?: string;
  metrics?: {
    performance?: string;
    accessibility?: string;
    userSatisfaction?: string;
    bookingTime?: string;
    userEngagement?: string;
    loadTime?: string;
  };
  technicalHighlights?: string[];
  challenges?: Array<{
    problem: string;
    solution: string;
    impact: string;
  }>;
}

function ProjectCard({ project, direction }: { project: Project, direction: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`project-card relative rounded-lg overflow-hidden shadow-lg transition-all duration-500 ${
        isHovered ? 'hovered' : ''
      }`}
      data-direction={direction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: '100%', maxWidth: '600px' }}
    >
      <div className="project-image relative h-64 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-2xl font-extrabold text-white mb-2 project-title drop-shadow-lg">{project.title}</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-white/20 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`p-6 transition-all duration-500 relative z-10`}>
        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium mb-4">{project.description}</p>
        {isHovered && project.technicalHighlights && (
          <div className="mb-6 animate-fade-in">
            <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-2">Technical Highlights</h4>
            <ul className="space-y-2">
              {project.technicalHighlights.map((highlight: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-base font-medium text-gray-800 dark:text-gray-200">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {isHovered && project.challenges && (
          <div className="mb-6 animate-fade-in">
            <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-2">Key Challenges</h4>
            <div className="space-y-4">
              {project.challenges.map((challenge, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-base font-bold text-gray-900 dark:text-white mb-1">Problem: {challenge.problem}</div>
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">Solution: {challenge.solution}</div>
                  <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Impact: {challenge.impact}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex space-x-4">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
            >
              <ExternalLink size={16} className="mr-2" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;