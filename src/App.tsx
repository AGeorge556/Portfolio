import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Github, Linkedin, Mail, ExternalLink, Download, ArrowRight } from 'lucide-react';
import { skills, projects } from './data';

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
          // Add a small delay before animation starts
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

    // Create background elements for hero section
    const bgElements = document.querySelector('.bg-elements');
    if (bgElements) {
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

    // Custom cursor effect
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      document.addEventListener('mousemove', (e) => {
        cursor.setAttribute('style', `left: ${e.clientX}px; top: ${e.clientY}px;`);
      });
    }

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
      if (cursor) {
        document.removeEventListener('mousemove', () => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
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

      {/* Main Content */}
      <main>
        {/* Hero Section - 13g inspired design */}
        <section id="home" className="section min-h-screen pt-20 flex items-center relative overflow-hidden">
          <div className="pattern-bg"></div>
          <div className="bg-elements absolute inset-0 pointer-events-none">
            {/* Background elements will be added via JS */}
          </div>
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

        {/* About Section - 13g inspired diagonal section */}
        <section id="about" className="section py-24 px-4 bg-white dark:bg-gray-900 diagonal-top">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center fade-in">About <span className="text-gradient">Me</span></h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 text-center max-w-2xl mx-auto alt-text">
              Passionate about creating beautiful, responsive, and user-friendly web experiences
            </p>
            <div className="about-content flex flex-col md:flex-row items-center gap-12">
              <div className="about-image md:w-1/2 fade-in image-mask">
                <img
                  src="./assets/profile.jpg"
                  alt="Profile"
                  className="rounded-lg shadow-xl w-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="about-text md:w-1/2 fade-in">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Dynamic Front-End Engineer with a solid foundation in web development and a commitment to creating innovative solutions since September 2021. Expertise in modern technologies, including JavaScript and React, paired with a full grasp of HTML and CSS, drives the development of user-centric web applications.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Known for optimizing performance and enhancing accessibility through responsive design, while maintaining project organization with version control systems. Passionate about continuous learning and collaboration, aiming to elevate user experiences and functionality in fast-paced environments.
                </p>
                <div className="skills flex flex-wrap gap-3 mt-8">
                  {Object.values(skills.core).map((skill) => (
                    <span key={skill.name} className="skill px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 transition-transform hover:scale-105">
                      {skill.name}
                    </span>
                  ))}
                </div>
                <a
                  href="./assets/resume.pdf"
                  className="button-hover-effect inline-flex items-center px-6 py-3 mt-8 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                >
                  <Download size={20} className="mr-2" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section py-24 px-4 bg-gray-50 dark:bg-gray-800 diagonal-bottom">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center fade-in">Skills & <span className="text-gradient">Expertise</span></h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 text-center max-w-2xl mx-auto alt-text">
              A collection of technologies I've worked with to create exceptional digital experiences
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, items], index) => (
                <div
                  key={category}
                  className="stagger-item bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-5">
                    {items.map((skill, skillIndex) => (
                      <div 
                        key={skill.name} 
                        className="skill-icon flex items-center space-x-3 transform transition-all duration-300 hover:translate-x-1"
                        style={{ transitionDelay: `${skillIndex * 0.05}s` }}
                      >
                        <div className="p-2 rounded-md bg-indigo-50 dark:bg-gray-800">
                          <skill.icon size={20} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section - 13g inspired cards */}
        <section id="projects" className="section py-24 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center fade-in"><span className="text-gradient">Featured</span> Projects</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 text-center max-w-2xl mx-auto alt-text">
              A selection of my recent work, showcasing my skills and expertise
            </p>
            <div className="projects grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className="project project-card fade-in bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-3 flex flex-col"
                >
                  <div className="project-image h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="project-info p-6 flex-grow flex flex-col">
                    <h3 className="project-title text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <div className="project-category text-indigo-600 dark:text-indigo-400 text-sm mb-3 alt-text">
                      {project.technologies[0]}
                    </div>
                    <p className="project-description text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                      {project.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn px-8 py-3 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors duration-300"
                      >
                        <ExternalLink size={16} /> <span>Live Demo</span>
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn px-8 py-3 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-300"
                      >
                        <Github size={16} /> <span>View Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section - 13g inspired layout */}
        <section id="contact" className="section py-24 px-4 bg-gray-50 dark:bg-gray-800 diagonal-top">
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
                  <a href="gn_farag02@outlook.com" className="contact-link flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <Mail size={24} className="mr-4" />
                    Mail
                  </a>
                  <a href="https://github.com/AGeorge556" target="_blank" rel="noopener noreferrer" className="contact-link flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <Github size={24} className="mr-4" />
                    Github
                  </a>
                  <a href="www.linkedin.com/in/andrew-george-610535309" target="_blank" rel="noopener noreferrer" className="contact-link flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <Linkedin size={24} className="mr-4" />
                    Linkedin
                  </a>
                </div>
              </div>
              <div className="contact-form md:w-1/2 fade-in">
                <form className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
                  <div className="form-group mb-6">
                    <label htmlFor="name" className="form-label block mb-2 text-gray-700 dark:text-gray-300">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="form-input input-focus-effect w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300" 
                      required 
                    />
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="email" className="form-label block mb-2 text-gray-700 dark:text-gray-300">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="form-input input-focus-effect w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300" 
                      required 
                    />
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="message" className="form-label block mb-2 text-gray-700 dark:text-gray-300">Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="form-textarea input-focus-effect w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 resize-y" 
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="button-hover-effect w-full py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    Send Message <ArrowRight className="ml-2" size={18} />
                  </button>
                </form>
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
              <a href="www.linkedin.com/in/andrew-george-610535309" target="_blank" rel="noopener noreferrer" className="social-link hover:text-indigo-400 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="gn_farag02@outlook.com" className="social-link hover:text-indigo-400 transition-colors duration-300">
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

export default App;