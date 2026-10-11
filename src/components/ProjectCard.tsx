import { useRef } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, X } from "lucide-react";
import type { Project } from "../data";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `proj-${index}-title`;

  return (
    <>
      <motion.button
        type="button"
        className="project-card"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {project.image ? (
          <img className="project-card-thumb" src={project.image} alt="" loading="lazy" width="800" height="500" />
        ) : (
          <div className="project-thumb-nda">Under NDA</div>
        )}
        <span className="project-card-body">
          <span className="project-card-title">
            {project.title}
            {project.nda && <span className="nda-chip">NDA</span>}
          </span>
          <span className="project-card-desc">{project.description}</span>
          <span className="tech-chips">
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech} className="tech-chip-compact">{tech}</span>
            ))}
          </span>
        </span>
      </motion.button>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <button type="button" aria-label="Close" className="modal-close-btn" onClick={() => dialogRef.current?.close()}>
          <X size={20} />
        </button>
        <div className="modal-card">
          {project.image ? (
            <img className="modal-thumb" src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
          ) : (
            <div className="modal-thumb project-thumb-nda">Under NDA</div>
          )}
          <h3 id={titleId} className="modal-title">{project.title}</h3>
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

          {project.nda && (
            <p className="modal-nda-note">
              Built under NDA. Client name, source code, and live system are not shared; the description above is intentionally general.
            </p>
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
        </div>
      </dialog>
    </>
  );
}
