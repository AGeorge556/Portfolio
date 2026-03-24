import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";

type CarouselCard = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  gradient: string;
  link?: string;
};

const cards: CarouselCard[] = [
  {
    id: "ibm-cert",
    title: "IBM Professional Front-End Developer",
    subtitle: "Coursera / IBM",
    date: "Mar 2025 - Apr 2025",
    gradient: "linear-gradient(135deg, #4f46e5, #6366f1)",
    link: "https://coursera.org/share/899f937de16ce48448f5f09d6d11bf1d",
  },
  {
    id: "nile-uni",
    title: "B.Sc. Computer Science",
    subtitle: "Nile University",
    date: "Graduated Jul 2025",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  },
  {
    id: "immerse-ai",
    title: "ImmerseAI - Graduation Project",
    subtitle: "Deep Learning Web App",
    date: "2025",
    gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
  },
  {
    id: "streams",
    title: "Full-Stack Developer",
    subtitle: "Streams Of Living Water",
    date: "Aug 2025 - Present",
    gradient: "linear-gradient(135deg, #059669, #34d399)",
  },
  {
    id: "clearview",
    title: "Full-Stack Developer",
    subtitle: "Clear View Clinics",
    date: "Jan 2025 - May 2025",
    gradient: "linear-gradient(135deg, #0891b2, #67e8f9)",
  },
  {
    id: "trustpharma",
    title: "Full-Stack Developer",
    subtitle: "Trust Pharma LTD",
    date: "Jun 2023 - Dec 2023",
    gradient: "linear-gradient(135deg, #d946ef, #f0abfc)",
  },
];

export default function CertificationsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], ["15%", "-35%"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["-25%", "15%"]);

  const row1Base = cards.filter((c) =>
    ["ibm-cert", "nile-uni", "immerse-ai"].includes(c.id),
  );
  const row2Base = cards.filter((c) =>
    ["streams", "clearview", "trustpharma"].includes(c.id),
  );

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
