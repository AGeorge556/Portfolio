import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { education, experience } from "../data";

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

const row1Base: CarouselCard[] = [
  {
    id: "ibm-cert",
    title: education.certification.name,
    subtitle: "Coursera / IBM",
    date: education.certification.period,
    gradient: gradients[0],
    link: education.certification.link,
    image: education.certification.image,
  },
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], ["15%", "-35%"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["-25%", "15%"]);

  const row1 = [...row1Base, ...row1Base, ...row1Base, ...row1Base];
  const row2 = [...row2Base, ...row2Base, ...row2Base, ...row2Base];

  return (
    <div ref={containerRef} className="cert-gallery-root">
      <h2 className="section-title section-title-center">Experience & Certifications</h2>

      <motion.div style={{ x: row1X }} className="cert-gallery-row">
        {row1.map((card, i) => (
          <CertCard key={`r1-${card.id}-${i}`} card={card} />
        ))}
      </motion.div>

      <motion.div style={{ x: row2X }} className="cert-gallery-row">
        {row2.map((card, i) => (
          <CertCard key={`r2-${card.id}-${i}`} card={card} />
        ))}
      </motion.div>
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
