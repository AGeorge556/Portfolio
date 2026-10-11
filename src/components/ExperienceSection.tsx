import { ExternalLink } from "lucide-react";
import { certifications, education, experience } from "../data";

const proCerts = certifications.filter((g) => g.credential);
const totalCourses = certifications.reduce((n, g) => n + g.courses.length, 0);

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
      <div className="cert-pro-grid">
        {proCerts.map((g) => (
          <article key={g.id} className="cert-pro">
            <img
              src={g.image}
              alt={`${g.program.replace(" Professional Certificate", "")} certificate`}
              loading="lazy"
              width="800"
              height="618"
            />
            <div className="cert-pro-body">
              <h4 className="cert-pro-title">{g.program}</h4>
              <p className="job-meta">{g.issuer} &middot; {g.date}</p>
              <a href={g.credential} target="_blank" rel="noopener noreferrer" className="verify-link">
                Verify credential <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <details className="certs-all">
        <summary>View all {totalCourses} course certificates</summary>
        <div className="certs-groups">
          {certifications.map((group) => (
            <section key={group.id} className="certs-group">
              <h4 className="certs-group-title">
                {group.program}
                <span>
                  {group.courses.length} courses &middot; {group.issuer}
                </span>
              </h4>
              <div className="certs-grid">
                {group.courses.map((course) => (
                  <div key={course.pdf} className="cert-course-card">
                    <a href={course.pdf} target="_blank" rel="noopener noreferrer" className="cert-course-link">
                      <img src={course.image} alt="" loading="lazy" width="800" height="618" />
                      <span className="cert-course-title">{course.title}</span>
                    </a>
                    <div className="cert-course-meta">
                      <span>{course.date}</span>
                      {course.honors && <em className="cert-honors">Honors</em>}
                      <a href={course.verify} target="_blank" rel="noopener noreferrer">
                        Verify
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </details>
    </div>
  );
}
