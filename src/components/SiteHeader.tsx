import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Moon, Sun, Github, Linkedin } from "lucide-react";

type NavLink = { label: string; id: string };

type SiteHeaderProps = {
  isDarkMode: boolean;
  isMenuOpen: boolean;
  activeSection: string;
  navLinks: NavLink[];
  onToggleMenu: () => void;
  onToggleDarkMode: () => void;
  onNavigate: (id: string) => void;
};

const menuVariants: Variants = {
  initial: { y: "-100%" },
  animate: {
    y: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    y: "-100%",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

const navLinksVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 + i * 0.1 },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 20,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 },
  }),
};

export default function SiteHeader({
  isDarkMode,
  isMenuOpen,
  activeSection,
  navLinks,
  onToggleMenu,
  onToggleDarkMode,
  onNavigate,
}: SiteHeaderProps) {
  return (
    <>
      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
      >
        <div className={`brand-wrap ${isMenuOpen ? "menu-open" : ""}`}>
          <span className="brand-first">Andrew</span>
          <span className="brand-last">George</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            style={{
              opacity: isMenuOpen ? 0 : 1,
              pointerEvents: isMenuOpen ? "none" : "auto",
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="/assets/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-btn"
            style={{
              opacity: isMenuOpen ? 0 : 1,
              pointerEvents: isMenuOpen ? "none" : "auto",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            RESUME
          </a>

          <button
            className={`nav-btn ${isMenuOpen ? "open" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            onClick={onToggleMenu}
          >
            <span className="nav-btn-lines" aria-hidden="true">
              <span className="nav-line-1" />
              <span className="nav-line-2" />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="fullscreen-nav"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="nav-content">
              <ul className="nav-links">
                {navLinks.map(({ label, id }, i) => {
                  const isActive = activeSection === id;
                  return (
                    <motion.li
                      key={id}
                      custom={i}
                      variants={navLinksVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={isActive ? "active-link" : ""}
                    >
                      <a
                        href={`#${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(id);
                        }}
                      >
                        <span className="nav-link-text">{label}</span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                className="nav-social-icons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.55, duration: 0.45 }}
              >
                <a href="https://github.com/AGeorge556" target="_blank" rel="noopener noreferrer" className="nav-social-link" aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/andrew-george-610535309" target="_blank" rel="noopener noreferrer" className="nav-social-link" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </motion.div>

              <motion.div
                className="nav-footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="nav-subtitle">FULL STACK DEVELOPER | CS GRADUATE</p>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
