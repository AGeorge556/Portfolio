import { education, experience } from "../data";
import CertificatesRoom from "./certificates/CertificatesRoom";

export default function ExperienceSection() {
  return (
    <div className="experience-root">
      <h2 className="section-title section-title-center">Experience</h2>

      <div className="jobs">
        {experience.map((job) => (
          <article key={`${job.company}-${job.period}`} className="job">
            <h3 className="job-title">{job.title}</h3>
            <p className="job-meta">
              {job.company} &middot; {job.location} &middot; {job.period}
              {job.current && <span className="current-chip">Current</span>}
            </p>
            <ul className="modal-highlights">
              {job.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="tech-chips">
              {job.technologies.map((tech) => (
                <span key={tech} className="tech-chip-compact">{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="education">
        <h3 className="experience-subtitle">Education</h3>
        <p className="job-title">{education.degree}</p>
        <p className="job-meta">
          {education.university} &middot; {education.location} &middot; Graduated {education.graduated}
        </p>
        <p className="education-project">Graduation project: {education.gradProject}</p>
      </div>

      <h3 className="experience-subtitle">Certifications</h3>
      <CertificatesRoom />
    </div>
  );
}
