import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { certifications, education, experience } from "../data";

type CarouselCard = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  gradient: string;
  link?: string;
  image: string;
};

const gradients = [
  "linear-gradient(135deg, #4f46e5, #6366f1)",
  "linear-gradient(135deg, #7c3aed, #a78bfa)",
  "linear-gradient(135deg, #2563eb, #60a5fa)",
  "linear-gradient(135deg, #059669, #34d399)",
  "linear-gradient(135deg, #0891b2, #67e8f9)",
  "linear-gradient(135deg, #d946ef, #f0abfc)",
];

const gradProjectTitle = education.gradProject.split(" - ")[0];

const proCerts: CarouselCard[] = certifications
  .filter((g) => g.credential)
  .map((g, i) => ({
    id: g.id,
    title: g.program.replace(" Professional Certificate", ""),
    subtitle: g.issuer,
    date: g.date,
    gradient: gradients[i],
    link: g.credential,
    image: g.image!,
  }));

const row1Base: CarouselCard[] = [
  ...proCerts,
  {
    id: "nile-uni",
    title: education.degree,
    subtitle: education.university,
    date: `Graduated ${education.graduated}`,
    gradient: gradients[1],
    image: education.image,
  },
  {
    id: "immerse-ai",
    title: gradProjectTitle,
    subtitle: education.gradProjectSubtitle,
    date: "2025",
    gradient: gradients[2],
    image: education.gradProjectImage,
  },
];

const row2Base: CarouselCard[] = experience.map((exp, i) => ({
  id: `exp-${i}`,
  title: exp.title,
  subtitle: exp.company,
  date: exp.period,
  gradient: gradients[3 + i],
  image: exp.image,
}));

export default function CertificationsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  // No pointer to drive the scroll-linked drift on touch devices: give them a
  // native swipe strip instead, with the list shown once rather than looped.
  const isTouch = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
    [],
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Offsets are a share of the row's own width, so they must stay <= 0: a positive
  // start pushed the whole row past a phone's right edge and the rows looked empty.
  const row1X = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["-45%", "-15%"]);

  const loop = (cards: CarouselCard[]) => (isTouch ? cards : [...cards, ...cards, ...cards, ...cards]);
  const rowClass = isTouch ? "cert-gallery-row cert-gallery-row--swipe" : "cert-gallery-row";

  return (
    <div ref={containerRef} className="cert-gallery-root">
      <h2 className="section-title section-title-center">Experience & Certifications</h2>

      <motion.div style={{ x: isTouch ? 0 : row1X }} className={rowClass}>
        {loop(row1Base).map((card, i) => (
          <CertCard key={`r1-${card.id}-${i}`} card={card} />
        ))}
      </motion.div>

      <motion.div style={{ x: isTouch ? 0 : row2X }} className={rowClass}>
        {loop(row2Base).map((card, i) => (
          <CertCard key={`r2-${card.id}-${i}`} card={card} />
        ))}
      </motion.div>

      <div className="certs-groups">
        {certifications.map((group) => (
          <section key={group.id} className="certs-group">
            <h3 className="certs-group-title">
              {group.program}
              <span>
                {group.courses.length} courses &middot; {group.issuer}
              </span>
            </h3>
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
    </div>
  );
}

function CertCard({ card }: { card: CarouselCard }) {
  const content = (
    <div className="cert-card" style={{ background: card.gradient }}>
      <img className="cert-card-thumb" src={card.image} alt="" loading="lazy" width="800" height="500" />
      <div className="cert-card-content">
        <h3 className="cert-card-title">{card.title}</h3>
        <p className="cert-card-subtitle">{card.subtitle}</p>
        <span className="cert-card-date">{card.date}</span>
      </div>
      {card.link && (
        <div className="cert-card-overlay">
          <ExternalLink size={24} color="white" />
          <span className="cert-overlay-text">View Credential</span>
        </div>
      )}
    </div>
  );

  if (card.link) {
    return (
      <a href={card.link} target="_blank" rel="noopener noreferrer" className="cert-card-link">
        {content}
      </a>
    );
  }

  return content;
}
