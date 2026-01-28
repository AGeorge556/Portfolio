/// <reference types="node" />
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Menu, X, Moon, Sun, Github, Linkedin, Mail, ExternalLink, ArrowRight, ArrowDown, MapPin, Phone } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { skills, projects } from './data';
import { AnimatedBackground } from './components/AnimatedBackground'
import { useForm, ValidationError } from '@formspree/react';

const Scene3D = React.lazy(() =>
  import('./components/Scene3D').then(m => ({ default: m.Scene3D }))
);

// Smooth scroll utility
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Animated section wrapper with mobile-responsive scroll detection
const AnimatedSection = ({ children, className = '', id }: { children: React.ReactNode, className?: string, id?: string }) => {
  const ref = useRef(null);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  
  // Track screen size changes for responsive animation settings
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  
  // Mobile-responsive intersection observer settings with increased buffer
  const isMobile = screenSize.width <= 768;
  const isTablet = screenSize.width <= 1024;
  
  const intersectionConfig = {
    once: false,
    amount: isMobile ? 0.1 : isTablet ? 0.2 : 0.3, // Much lower threshold for mobile - only 10% visibility required
    rootMargin: isMobile ? "0px 0px -10% 0px" : isTablet ? "0px 0px -20% 0px" : "0px 0px -25% 0px" // Reduced buffer for mobile
  };
  
  const isInView = useInView(ref, intersectionConfig);
  
  // Mobile-responsive animation timing with optimized durations
  const animationDuration = isMobile ? 0.8 : isTablet ? 1.0 : 1.2; // Faster animations for mobile
  const animationEase = isMobile ? [0.25, 0.46, 0.45, 0.94] as const : [0.25, 0.25, 0.25, 0.75] as const;
  const staggerDelay = isMobile ? 0.1 : 0.2; // Faster staggering for mobile

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: isMobile ? 30 : 60 }} // Reduced offset for mobile
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 30 : 60 }}
      transition={{ 
        duration: animationDuration, 
        ease: animationEase,
        staggerChildren: staggerDelay,
        delay: 0.1 // Small initial delay for better timing
      }}
    >
      {children}
    </motion.section>
  );
};

// Navigation component
function Navigation({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Debounce scroll events for better mobile performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }, 10); // 10ms debounce for smooth but responsive updates
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.nav 
      className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ANDREW.
            </span>
          </motion.div>

          {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
            
            <motion.button
                onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            </div>

            {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
            </div>
          </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
          onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    activeSection === item.id 
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const ref = useRef(null);
  
  // Mobile-responsive settings for hero section
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
  
  const isInView = useInView(ref, { 
    once: false, 
    amount: isMobile ? 0.25 : isTablet ? 0.3 : 0.35, // Increased thresholds
    margin: isMobile ? "0px 0px -15% 0px" : "0px 0px -20% 0px" // Increased margins
  });
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-indigo-900/10" />
      </div>
      
      {/* Content */}
      <motion.div 
        ref={ref}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        style={{ y }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }} // Increased from 0.6s and 0.2s
        >
          <motion.p 
            className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-4"
            initial={{ opacity: 0, y: 40 }} // Increased from 30px
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.0, delay: 0.5 }} // Increased from 0.6s and 0.4s
          >
            Available for Freelance Work
          </motion.p>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }} // Increased from 40px
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1.2, delay: 0.7 }} // Increased from 0.8s and 0.6s
          >
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Andrew George
            </span>
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 40 }} // Increased from 30px
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.2, delay: 0.9 }} // Increased from 0.8s and 0.8s
          >
            Full-Stack Developer
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 40 }} // Increased from 30px
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.2, delay: 1.1 }} // Increased from 0.8s and 1s
          >
            I craft responsive web applications where technologies meet creativity. Building exceptional digital experiences with modern full stack frameworks.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 40 }} // Increased from 30px
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.2, delay: 1.3 }} // Increased from 0.8s and 1.2s
          >
            <motion.button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1.5 }} // Increased from 0.5s and 1.4s
            >
              <span>View My Work</span>
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1.6 }} // Increased from 0.5s and 1.5s
            >
              Contact Me
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, delay: 1.7 }} // Increased from 0.8s and 1.6s
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tech I work with:</p>
            <div className="flex justify-center space-x-6 text-gray-600 dark:text-gray-400">
              {[
                { label: "TypeScript", color: "#3B82F6", path: "M0 12v12h24V0H0zm19.34-1.47c.64.15 1.13.41 1.52.83.2.22.49.63.51.72l-1.77 1.2c-.07-.1-.23-.33-.4-.47-.42-.33-.96-.47-1.65-.42-.5.04-.73.12-.95.3-.22.2-.34.46-.34.78 0 .3.08.47.28.65.26.21.55.32 1.78.7 2.27.7 3.24 1.16 3.87 1.86.7.77.86 2 .4 3.03-.5 1.12-1.74 1.88-3.46 2.1-.53.07-1.79.04-2.37-.05-1.27-.2-2.48-.77-3.2-1.5-.28-.28-.83-1.02-.78-1.05l.48-.3.97-.57.75-.44.16.23c.22.33.72.77 1.02.9.87.39 2.07.34 2.66-.1.12-.1.24-.3.28-.47.05-.2.03-.62-.04-.8-.1-.24-.34-.44-.82-.66-.25-.11-1.3-.5-1.63-.6-1.55-.48-2.7-1.27-3.2-2.2-.2-.37-.4-1.02-.43-1.4-.04-.46.02-1.35.12-1.7.5-1.67 1.9-2.68 3.86-2.82.6-.04 2.2.05 2.8.17zm-6.7 1.52L12.65 12h2.35v9.65h-2.37V12h2.35l.01.05z" },
                { label: "React", color: "#61DAFB", path: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.31 0-.592.06-.838.174C4.498.652 3.834 2.158 4.19 4.776c-2.07.75-3.446 1.86-3.446 3.228 0 1.37 1.388 2.49 3.467 3.238-.366 2.63.318 4.14 2.094 5.166.246.114.528.174.838.174 1.346 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.31 0 .592-.06.838-.174 1.776-1.026 2.46-2.536 2.094-5.166 2.08-.748 3.467-1.868 3.467-3.238 0-1.37-1.386-2.478-3.446-3.228.356-2.618-.328-4.124-2.104-5.15a1.955 1.955 0 0 0-.838-.175zM21.1 6.12c.209 1.524-.065 2.65-.648 3.12-.084-.07-.177-.14-.28-.21l-.485-.303c.088-.405.14-.82.16-1.24.04-.88-.07-1.73-.32-2.46.24.02.49.08.72.19.36.19.63.5.85.9zM12 15.55c-.354-.37-.705-.78-1.048-1.222.35.018.7.028 1.048.028s.7-.01 1.048-.028c-.343.442-.694.852-1.048 1.222zm-3.9-4.04c-.063.41-.093.83-.093 1.26 0 .418.03.828.088 1.228-.63.3-1.18.6-1.63.88-.1.06-.19.13-.27.19-.58-.47-.85-1.6-.64-3.12.06-.02.12-.04.19-.05.52-.1 1.2-.12 2.02-.04.11-.11.22-.23.33-.35zm7.8 0l.33.35c.82-.08 1.5-.06 2.02.04.07.01.13.03.19.05.21 1.52-.06 2.65-.64 3.12-.08-.06-.17-.13-.27-.19-.46-.28-1-.58-1.63-.88.057-.4.088-.81.088-1.228 0-.43-.03-.85-.09-1.26zM12 8.45c.354.37.705.78 1.048 1.222-.35-.018-.7-.028-1.048-.028s-.7.01-1.048.028c.343-.442.694-.852 1.048-1.222zM7.148 5.21c.25.73.36 1.58.4 2.46.02.42.07.835.16 1.24l-.485.303c-.103.07-.196.14-.28.21-.583-.47-.857-1.596-.648-3.12.22-.11.47-.17.71-.19.05 0 .1 0 .14.01v.09zm-.3 10.69c-.59-.34-.98-.74-1.15-1.2-.17-.44-.14-.92.09-1.45.35.36.77.69 1.26 1 .49.3 1 .55 1.52.74-.28.37-.5.67-.65.88-.04.06-.08.1-.1.14-.33-.03-.66-.07-.97-.11zm10.3 0c-.31.04-.64.08-.97.11-.02-.04-.06-.08-.1-.14-.15-.21-.37-.51-.65-.88.52-.19 1.03-.44 1.52-.74.49-.31.91-.64 1.26-1 .23.53.26 1.01.09 1.45-.17.46-.56.86-1.15 1.2z" },
                { label: "Next.js", color: "#000000", path: "M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.006-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10513.38 10513.38 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" },
                { label: "Tailwind CSS", color: "#06B6D4", path: "M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" },
                { label: "MongoDB", color: "#47A248", path: "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.208c.063-.33.186-.67.31-.998 3.49-1.178 5.58-4.122 5.58-7.73 0-2.107-.73-4.224-1.815-5.717zm-5.638 10.033s-.84-.69-.97-.993c-.135-.327-.24-.676-.242-.992 0 0 .55.397.857.986.27.518.355 1 .355 1z" }
              ].map(({ label, color, path }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                  transition={{ duration: 0.8, delay: 1.9 + (index * 0.15) }}
                  whileHover={{ scale: 1.2, color }}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-label={label}>
                    <path d={path} />
                  </svg>
                </motion.div>
              ))}
              </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: isInView ? 1 : 0
          }}
          transition={{ 
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, // Increased from 2s
            opacity: { duration: 1.2, delay: 2.2 } // Increased from 0.8s and 2s
          }}
        >
          <ArrowDown className="text-gray-400 dark:text-gray-600" size={24} />
        </motion.div>
      </motion.div>
        </section>
  );
}

// About Section
function AboutSection() {
  return (
    <AnimatedSection id="about" className="py-24 bg-white/30 dark:bg-gray-900/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }} // Increased from 30px
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }} // Increased from 0.6s
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get to know the person behind the code
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -60 }} // Increased from -50px
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }} // Increased from 0.6s and 0.2s
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="./assets/profile.jpg"
                  alt="Andrew George"
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 60 }} // Increased from 50px
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }} // Increased from 0.6s and 0.4s
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Full-Stack Developer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                I'm Andrew George, a dedicated developer with 1+ year of experience creating exceptional digital solutions that blend aesthetics with functionality.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                My journey in development has equipped me with expertise across the entire stack, specializing in React, Next.js, and modern backend technologies that deliver scalable, high-performance applications.
                    </p>
                  </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Development Philosophy
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Clean, maintainable code as a foundation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Performance optimization from day one</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Accessibility as a priority, not an afterthought</span>
                </li>
              </ul>
                    </div>
            
            {/* Download CV Button */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a
                href="/assets/resume.pdf"
                download="Andrew_George_Resume.pdf"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download CV</span>
              </a>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">👨‍💻</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Name</span>
                  </div>
                <p className="text-gray-600 dark:text-gray-400">Andrew George</p>
                </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">✉️</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Email</span>
              </div>
                <p className="text-gray-600 dark:text-gray-400">gn_farag02@outlook.com</p>
            </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">📍</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Location</span>
          </div>
                <p className="text-gray-600 dark:text-gray-400">Cairo,Egypt</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">🔍</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Status</span>
                </div>
                <p className="text-green-600 dark:text-green-400">Open to opportunities</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Focus
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Expanding expertise in cloud architectures and advanced React patterns
              </p>
            </div>
          </motion.div>
        </div>
    </div>
    </AnimatedSection>
  );
}

// Skills Section
function SkillsSection() {
  return (
    <AnimatedSection id="skills" className="py-24 bg-white/30 dark:bg-gray-900/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Skills</span>
            </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            I've worked with a variety of technologies in front-end development. Here are some of my key areas of expertise:
          </p>
        </motion.div>
        
        {/* Main Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {Object.entries(skills).map(([category, skillList], categoryIndex) => {
            const categoryTitles = {
              'core': 'Front-End Development',
              'frameworks': 'Styling & UI Frameworks', 
              'tools': 'State Management',
              'backend': 'Back-End Integration'
            };
            
            const categoryDescs = {
              'core': 'Building responsive and optimized web applications with modern frameworks.',
              'frameworks': 'Crafting modern and maintainable UI components with efficient styling techniques.',
              'tools': 'Handling application state efficiently for scalable applications.',
              'backend': 'Connecting front-end applications to databases and back-end services.'
            };
            
                return (
              <motion.div 
                key={category} 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: categoryIndex * 0.15,
                  ease: [0.25, 0.25, 0.25, 0.75] as const
                }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {categoryTitles[category as keyof typeof categoryTitles] || category}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {categoryDescs[category as keyof typeof categoryDescs]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill, skillIndex) => (
                    <motion.span
                      key={skill.name}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                    </div>
              </motion.div>
                );
              })}
            </div>
        
        {/* Development Tools Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Development Tools
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Optimizing workflows with modern development and build tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Webpack', desc: 'Module bundling' },
              { name: 'ESLint', desc: 'Code quality' },
              { name: 'Prettier', desc: 'Code formatting' },
              { name: 'Git', desc: 'Version control' },
              { name: 'GitHub', desc: 'Code collaboration' },
              { name: 'Vercel', desc: 'Deployment' }
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {tool.name}
          </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tool.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function App() {
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

  // Initialize useForm hook for contact form
  const [state, handleSubmit] = useForm("meogyobe");

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-200">
      {/* Scene3D and background elements are site-wide */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={
          <div className="fixed inset-0" style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at 50% 40%, #181a2a 60%, #23244a 100%)'
              : 'radial-gradient(ellipse at 50% 40%, #f3f4f6 60%, #e0e7ef 100%)'
          }} />
        }>
          <Scene3D />
        </Suspense>
        <AnimatedBackground />
      </div>

      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="relative z-1">
        {/* Hero Section - 13g inspired design */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <AnimatedSection id="projects" className="py-24 bg-gray-50/30 dark:bg-gray-800/30">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }} // Increased from 30px
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }} // Increased from 0.6s
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                My <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Work</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore my collection of projects showcasing different technologies and solutions I've built.
              </p>
            </motion.div>
            
            <div className="grid gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.title} project={project} direction={index % 2 === 0 ? 'left' : 'right'} />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection id="contact" className="py-24 bg-white/30 dark:bg-gray-900/30">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Get In <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Have a project in mind or want to discuss potential opportunities? Feel free to reach out to me using the form below or through my contact information.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Contact Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Feel free to reach out to me through any of the following methods. I'm always open to discussing new projects, creative ideas, or opportunities.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                      <p className="text-gray-600 dark:text-gray-400">Cairo, Egypt</p>
                    </div>
                  </motion.div>
                  
                  <motion.a
                    href="mailto:gn_farag02@outlook.com"
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Email</h4>
                      <p className="text-gray-600 dark:text-gray-400">gn_farag02@outlook.com</p>
                    </div>
                  </motion.a>
                  
                  <motion.div 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Phone className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                      <p className="text-gray-600 dark:text-gray-400">+201020012398</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Social Links */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    <motion.a
                      href="https://github.com/AGeorge556"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={20} />
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/andrew-george-610535309"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin size={20} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
              
              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send Me a Message
                </h3>
                
                {state.succeeded ? (
                  <motion.div 
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-xl text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ArrowRight className="text-green-600 dark:text-green-400 transform rotate-45" size={24} />
                  </div>
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                      Thank you for your message!
                    </h4>
                    <p className="text-green-600 dark:text-green-400">
                      I will get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          name
                        </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                        required
                      />
                    </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          email
                        </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                        required
                      />
                        <ValidationError prefix="Email" field="email" errors={state.errors} />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                        required
                      />
                      <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full py-4 px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {state.submitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2" size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
              </div>
            </div>
        </AnimatedSection>
      </main>

      {/* Enhanced Footer */}
      <AnimatedSection className="bg-gray-900/50 dark:bg-gray-800/50 text-white border-t border-gray-800/30">
        <footer className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand Section */}
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Andrew George
                  </span>
            </div>
                <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                  Full-Stack Developer passionate about creating exceptional digital experiences. 
                  Let's build something amazing together.
                </p>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://github.com/AGeorge556"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                <Github size={20} />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/andrew-george-610535309"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                <Linkedin size={20} />
                  </motion.a>
                  <motion.a
                    href="mailto:gn_farag02@outlook.com"
                    className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                <Mail size={20} />
                  </motion.a>
            </div>
              </motion.div>
              
              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Home', id: 'home' },
                    { label: 'About', id: 'about' },
                    { label: 'Skills', id: 'skills' },
                    { label: 'Projects', id: 'projects' },
                    { label: 'Contact', id: 'contact' }
                  ].map((link) => (
                    <li key={link.id}>
                      <motion.button
                        onClick={() => scrollToSection(link.id)}
                        className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-left"
                        whileHover={{ x: 5 }}
                      >
                        {link.label}
                      </motion.button>
                          </li>
                        ))}
                      </ul>
              </motion.div>
              
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="text-lg font-semibold text-white mb-4">Get In Touch</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin size={16} />
                    <span className="text-sm">Cairo, Egypt</span>
                    </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail size={16} />
                    <a 
                      href="mailto:gn_farag02@outlook.com" 
                      className="text-sm hover:text-indigo-400 transition-colors duration-200"
                    >
                      gn_farag02@outlook.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Phone size={16} />
                    <span className="text-sm">+201020012398</span>
              </div>
            </div>
              </motion.div>
        </div>
            
            {/* Bottom Section */}
            <motion.div 
              className="border-t border-gray-800/50 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} Andrew George. All rights reserved.
      </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <span>Built with React & TypeScript</span>
                  <span>•</span>
                  <span>Designed with ❤️</span>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </AnimatedSection>
    </div>
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
  const ref = useRef(null);
  // const [isHovered, setIsHovered] = useState(false);
  
  // Mobile-responsive settings for project cards
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
  
  const isInView = useInView(ref, { 
    once: false, 
    amount: isMobile ? 0.05 : isTablet ? 0.15 : 0.2, // Much lower threshold for mobile - only 5% visibility required
    margin: isMobile ? "0px 0px -5% 0px" : "0px 0px -15% 0px" // Reduced buffer for mobile
  });

  return (
    <motion.div 
      ref={ref}
      className={`grid lg:grid-cols-2 gap-8 items-center ${direction === 'right' ? 'lg:grid-flow-col-dense' : ''}`}
      initial={{ opacity: 0, y: isMobile ? 25 : 50 }} // Reduced offset for mobile
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 25 : 50 }}
      transition={{ duration: isMobile ? 0.8 : 1.0 }} // Faster animations for mobile
    >
      {/* Project Image */}
      <motion.div 
        className={`relative group ${direction === 'right' ? 'lg:col-start-2' : ''}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img 
          src={project.image} 
          alt={project.title}
            className="w-full h-[300px] lg:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          
          {/* Technology tags overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <motion.span 
                  key={tech}
                  className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-sm font-medium rounded-full backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-sm font-medium rounded-full backdrop-blur-sm">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Content */}
      <motion.div 
        className={`space-y-6 ${direction === 'right' ? 'lg:col-start-1 lg:text-right' : ''}`}
        initial={{ opacity: 0, x: direction === 'right' ? (isMobile ? 25 : 50) : (isMobile ? -25 : -50) }} // Reduced offset for mobile
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: direction === 'right' ? (isMobile ? 25 : 50) : (isMobile ? -25 : -50) }}
        transition={{ duration: isMobile ? 0.8 : 1.0, delay: 0.2 }} // Faster animations for mobile
      >
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {project.title}
          </h3>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/20 dark:border-gray-700/20">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
      </div>
          </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(project.metrics).slice(0, 4).map(([key, value]) => (
              <motion.div 
                key={key}
                className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {value}
                </div>
              </motion.div>
              ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex gap-4 ${direction === 'right' ? 'lg:justify-end' : ''}`}>
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={16} className="mr-2" />
              Live Demo
            </motion.a>
          )}
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={16} className="mr-2" />
              Code
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default App;