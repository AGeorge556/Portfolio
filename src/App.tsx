import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Github, Linkedin, Mail, ExternalLink, Download } from 'lucide-react';
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

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation - Add nav-link class to links */}
      <nav className="fixed w-full bg-white dark:bg-gray-900 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 animate-fade-in">AG</span>
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
        {/* Hero Section */}
        <section id="home" className="section pt-20 pb-32 px-4 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mt-10 lg:mt-0 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Crafting Clean, Responsive Interfaces
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Front-end developer specializing in building exceptional digital experiences
              </p>
              <div className="flex space-x-4">
                <a
                  href="#contact"
                  className="button-hover-effect px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Get in Touch
                </a>
                <a
                  href="#projects"
                  className="button-hover-effect px-8 py-3 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition duration-300"
                >
                  View Work
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Developer workspace"
                className="rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 animate-fade-in">About Me</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fade-in">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Dynamic Front-End Engineer with a solid foundation in web development and a commitment to creating innovative solutions since September 2021. Expertise in modern technologies, including JavaScript and React, paired with a full grasp of HTML and CSS, drives the development of user-centric web applications.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Known for optimizing performance and enhancing accessibility through responsive design, while maintaining project organization with version control systems. Passionate about continuous learning and collaboration, aiming to elevate user experiences and functionality in fast-paced environments.
                </p>
                <a
                  href="/resume.pdf"
                  className="button-hover-effect inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                >
                  <Download size={20} className="mr-2" />
                  Download Resume
                </a>
              </div>
              <div className="space-y-6 animate-slide-in">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Core Technologies</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.core.map((skill) => (
                    <div key={skill.name} className="skill-icon flex items-center space-x-2">
                      <skill.icon size={20} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 animate-fade-in">Skills & Expertise</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, items], index) => (
                <div
                  key={category}
                  className="stagger-item bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {items.map((skill) => (
                      <div key={skill.name} className="skill-icon flex items-center space-x-2">
                        <skill.icon size={20} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 animate-fade-in">Featured Projects</h2>
            <div className="projects-grid stagger-container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className="project-card stagger-item bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-hover-effect flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Live Demo
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-hover-effect flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <Github size={16} className="mr-1" />
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 animate-fade-in">Get in Touch</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fade-in">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="input-focus-effect w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="input-focus-effect w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="input-focus-effect w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="button-hover-effect w-full px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
              <div className="space-y-6 animate-slide-in">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Connect With Me</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:gn_farag02@outlook.com"
                    className="button-hover-effect flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Mail size={20} />
                    <span>gn_farag02@outlook.com</span>
                  </a>
                  <a
                    href="https://github.com/AGeorge556"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-hover-effect flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Github size={20} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/andrew-george-610535309"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-hover-effect flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center animate-fade-in">
            <div className="text-gray-600 dark:text-gray-400">
              © 2024 Andrew George. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://github.com/AGeorge556"
                target="_blank"
                rel="noopener noreferrer"
                className="skill-icon text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/andrew-george-610535309"
                target="_blank"
                rel="noopener noreferrer"
                className="skill-icon text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:gn_farag02@outlook.com"
                className="skill-icon text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;