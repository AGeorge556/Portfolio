import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X } from "lucide-react";

type Project = {
  title: string;
  description: string;
  technologies: string[];
  demo: string;
  github: string;
  technicalHighlights: string[];
  metrics: Record<string, string>;
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardId = `proj-${index}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  return (
    <>
      <div
        className="project-folder-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ zIndex: isHovered ? 100 : 1, position: "relative" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="project-root"
        >
          {/* Folder back */}
          <div className="folder-back">
            <div className="folder-tab">
              <div className="folder-tab-label">Proj // {String(index + 1).padStart(2, "0")}</div>
            </div>
          </div>

          {/* Paper card with content */}
          <motion.div
            layoutId={cardId}
            onClick={() => setIsExpanded(true)}
            animate={{
              y: isHovered ? -220 : 0,
              scale: isHovered ? 1.02 : 1,
              rotateZ: isHovered ? (index % 2 === 0 ? 1 : -1) : 0,
              opacity: isExpanded ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="project-paper"
          >
            <div className={`paper-content ${isHovered ? "active" : ""}`}>
              <h3 className="paper-title">{project.title}</h3>
              <p className="paper-description">{project.description}</p>
              <div className="tech-chips">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span key={tech} className="tech-chip-compact">{tech}</span>
                ))}
              </div>
            </div>
            <div className="paper-hint" style={{ opacity: isHovered ? 1 : 0 }}>
              Click to view details
            </div>
          </motion.div>

          {/* Folder front flap */}
          <motion.div
            animate={{
              rotateX: isHovered ? -55 : 0,
              y: isHovered ? 15 : 0,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="folder-front"
            style={{
              boxShadow: isHovered
                ? "0 30px 40px rgba(0,0,0,0.6)"
                : "0 8px 30px rgba(0,0,0,0.4), inset 0 2px 20px rgba(255,255,255,0.2)",
            }}
          >
            <motion.div
              animate={{ opacity: isHovered ? 0.4 : 1, scale: isHovered ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}
              className="folder-front-icon"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Full-screen expanded modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isExpanded && (
              <div className="modal-root">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="modal-backdrop"
                  onClick={() => setIsExpanded(false)}
                />
                <motion.div layoutId={cardId} className="modal-card">
                  <button onClick={() => setIsExpanded(false)} className="modal-close-btn">
                    <X size={18} />
                  </button>

                  <h2 className="modal-title">{project.title}</h2>
                  <p className="modal-description">{project.description}</p>

                  {project.technicalHighlights.length > 0 && (
                    <>
                      <h4 className="modal-section-heading">Technical Highlights</h4>
                      <ul className="modal-highlights">
                        {project.technicalHighlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h4 className="modal-section-heading">Technologies</h4>
                  <div className="modal-tech-chips">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="modal-tech-chip">{tech}</span>
                    ))}
                  </div>

                  {Object.keys(project.metrics).length > 0 && (
                    <div className="modal-metrics">
                      {Object.entries(project.metrics).map(([key, val]) => (
                        <div key={key} className="modal-metric">
                          <span className="metric-value">{val}</span>
                          <span className="metric-label">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="modal-actions">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="action-link action-github">
                        <Github size={18} /> Source Code
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="action-link action-live">
                        <ExternalLink size={18} /> Live Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
