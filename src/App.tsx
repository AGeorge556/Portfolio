import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Code2,
  FileCode,
  Globe,
  Terminal,
  Wind,
  Smartphone,
  Database,
  Server,
} from "lucide-react";
import { projects } from "./data";
import CursorLens from "./components/CursorLens";
import SectionBlock from "./components/SectionBlock";
import LoadingScreen from "./components/LoadingScreen";
import SiteHeader from "./components/SiteHeader";
import HeroHud from "./components/HeroHud";
import ProjectCard from "./components/ProjectCard";

const FloatingSkillsCloud = React.lazy(
  () => import("./components/FloatingSkillsCloud"),
);
const CertificationsCarousel = React.lazy(
  () => import("./components/CertificationsCarousel"),
);
const ContactSection = React.lazy(
  () => import("./components/ContactSection"),
);

const navLinks = [
  { label: "HOME", id: "hero" },
  { label: "ABOUT ME", id: "about" },
  { label: "SKILLS", id: "skills" },
  { label: "PROJECTS", id: "projects" },
  { label: "EXPERIENCE", id: "experience" },
  { label: "CONTACT", id: "contact" },
];

const techBadges = [
  { label: "React", icon: Code2, left: "5%", top: "68%", delay: "0s" },
  { label: "TypeScript", icon: FileCode, left: "12%", top: "42%", delay: "0.4s" },
  { label: "Next.js", icon: Globe, left: "26%", top: "22%", delay: "0.8s" },
  { label: "JavaScript", icon: Terminal, left: "44%", top: "12%", delay: "1.2s" },
  { label: "Tailwind", icon: Wind, left: "62%", top: "14%", delay: "1.6s" },
  { label: "Flutter", icon: Smartphone, left: "78%", top: "28%", delay: "2s" },
  { label: "Supabase", icon: Database, left: "90%", top: "48%", delay: "2.4s" },
  { label: "Node.js", icon: Server, left: "94%", top: "72%", delay: "2.8s" },
];

function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="section-reveal"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function AppContent({
  isDarkMode,
  toggleDarkMode,
}: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const aboutRef = useRef<HTMLElement | null>(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress: heroToAboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "start start"],
  });

  const aboutContentOpacity = useTransform(
    heroToAboutProgress,
    [0, 0.45, 1],
    [0.2, 0.65, 1],
  );

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 },
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Section blob configs — mobile uses fewer, smaller, simpler blobs for performance
  const bc = isMobile
    ? { count: 4, sizeMult: 0.65, complexMult: 0.45 }
    : { count: 1, sizeMult: 1, complexMult: 1 };

  const blobConfigs = isDarkMode
    ? {
        about: {
          backgroundColor: "#0d0b1e",
          blobColor: "#818cf8",
          blobCount: isMobile ? 4 : 9,
          blobSize: Math.round(300 * bc.sizeMult),
          blobComplexity: Math.round(180 * bc.complexMult),
          blobSpeed: 0.6,
          strokeOpacity: 0.18,
        },
        skills: {
          backgroundColor: "#0b0e18",
          blobColor: "#6366f1",
          blobCount: isMobile ? 4 : 11,
          blobSize: Math.round(260 * bc.sizeMult),
          blobComplexity: Math.round(140 * bc.complexMult),
          blobSpeed: 0.8,
          strokeOpacity: 0.15,
        },
        projects: {
          backgroundColor: "#110d18",
          blobColor: "#a855f7",
          blobCount: isMobile ? 4 : 10,
          blobSize: Math.round(320 * bc.sizeMult),
          blobComplexity: Math.round(200 * bc.complexMult),
          blobSpeed: 0.5,
          strokeOpacity: 0.16,
        },
        experience: {
          backgroundColor: "#0b0d14",
          blobColor: "#4f46e5",
          blobCount: isMobile ? 3 : 8,
          blobSize: Math.round(340 * bc.sizeMult),
          blobComplexity: Math.round(160 * bc.complexMult),
          blobSpeed: 0.65,
          strokeOpacity: 0.2,
        },
        contact: {
          backgroundColor: "#0e0b1a",
          blobColor: "#7c3aed",
          blobCount: isMobile ? 4 : 9,
          blobSize: Math.round(290 * bc.sizeMult),
          blobComplexity: Math.round(150 * bc.complexMult),
          blobSpeed: 0.55,
          strokeOpacity: 0.18,
        },
      }
    : {
        about: {
          backgroundColor: "#f0eeff",
          blobColor: "#c7d2fe",
          blobCount: isMobile ? 4 : 9,
          blobSize: Math.round(300 * bc.sizeMult),
          blobComplexity: Math.round(180 * bc.complexMult),
          blobSpeed: 0.6,
          strokeOpacity: 0.3,
        },
        skills: {
          backgroundColor: "#eef0ff",
          blobColor: "#a5b4fc",
          blobCount: isMobile ? 4 : 11,
          blobSize: Math.round(260 * bc.sizeMult),
          blobComplexity: Math.round(140 * bc.complexMult),
          blobSpeed: 0.8,
          strokeOpacity: 0.25,
        },
        projects: {
          backgroundColor: "#f3eeff",
          blobColor: "#d8b4fe",
          blobCount: isMobile ? 4 : 10,
          blobSize: Math.round(320 * bc.sizeMult),
          blobComplexity: Math.round(200 * bc.complexMult),
          blobSpeed: 0.5,
          strokeOpacity: 0.28,
        },
        experience: {
          backgroundColor: "#eef0ff",
          blobColor: "#c7d2fe",
          blobCount: isMobile ? 3 : 8,
          blobSize: Math.round(340 * bc.sizeMult),
          blobComplexity: Math.round(160 * bc.complexMult),
          blobSpeed: 0.65,
          strokeOpacity: 0.3,
        },
        contact: {
          backgroundColor: "#f0eeff",
          blobColor: "#c4b5fd",
          blobCount: isMobile ? 4 : 9,
          blobSize: Math.round(290 * bc.sizeMult),
          blobComplexity: Math.round(150 * bc.complexMult),
          blobSpeed: 0.55,
          strokeOpacity: 0.28,
        },
      };

  return (
    <div className="page-root">
      <SiteHeader
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        activeSection={activeSection}
        navLinks={navLinks}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onToggleDarkMode={toggleDarkMode}
        onNavigate={scrollToSection}
      />

      {/* Hero */}
      <section id="hero" className="hero-section">
        <HeroHud badges={techBadges} />
        <CursorLens
          revealImage="/assets/profile.webp"
          objectFit="contain"
          backgroundPosition="center bottom"
          backgroundColor={isDarkMode ? "#0f0e1a" : "#f5f5ff"}
          blobOutlineColor={isDarkMode ? "#4f46e5" : "#a5b4fc"}
          parallaxStrength={8}
          showBackground={true}
          bgBlobCount={isMobile ? 5 : 11}
          bgBlobSize={isMobile ? 200 : 300}
          bgBlobComplexity={isMobile ? 90 : 200}
          bgBlobSpeed={0.8}
          blobStrokeWidth={1.5}
          blobSize={400}
          shapeComplexity={1.5}
          roughness={50}
          speed={600}
          viscosity={4}
        />
      </section>

      {/* About */}
      <SectionBlock
        id="about"
        className="about-section"
        sectionRef={aboutRef}
        blob={blobConfigs.about}
      >
        <SectionReveal>
          <motion.div
            className="about-layout"
            style={{ opacity: aboutContentOpacity }}
          >
            <div className="about-photo-wrap">
              <picture>
                <source srcSet="/assets/profile.webp" type="image/webp" />
                <img
                  src="/assets/profile.jpg"
                  alt="Andrew George"
                  className="about-photo"
                  loading="lazy"
                  width="400"
                  height="533"
                />
              </picture>
            </div>

            <div className="about-copy">
              <h2 className="about-heading">About Me</h2>
              <p>
                Hi, I'm Andrew George — a Computer Science graduate from Nile
                University and a passionate full-stack developer based in Cairo,
                Egypt. I specialize in building modern, performant web
                applications with React.js, Supabase, and API integration.
              </p>
              <p>
                Currently working as a Full-Stack Developer at Streams Of Living
                Water, where I architect cross-platform ERP systems spanning Web,
                Mobile, and Desktop. I thrive on turning complex requirements
                into clean, scalable code.
              </p>
              <blockquote className="about-quote">
                I believe great software is built at the intersection of clean
                architecture, user empathy, and relentless curiosity.
              </blockquote>
            </div>
          </motion.div>
        </SectionReveal>
      </SectionBlock>

      {/* Skills */}
      <SectionBlock id="skills" blob={blobConfigs.skills}>
        <SectionReveal>
          <div className="skills-layout">
            <div className="skills-copy">
              <h2 className="section-title skills-title">Skills</h2>
              <p className="skills-description">
                A comprehensive toolkit spanning frontend frameworks to backend
                architectures, mobile development, and DevOps.
                <br />
                <br />
                Drag and rotate the interactive 3D cloud to explore the
                languages, frameworks, and tools that power my work.
              </p>
            </div>

            <div className="skills-canvas-container">
              <React.Suspense
                fallback={
                  <div className="section-loading-fallback">
                    Loading 3D Engine...
                  </div>
                }
              >
                <FloatingSkillsCloud />
              </React.Suspense>
            </div>
          </div>
        </SectionReveal>
      </SectionBlock>

      {/* Projects */}
      <SectionBlock
        id="projects"
        className="projects-section"
        blob={blobConfigs.projects}
      >
        <div className="projects-shell">
          <SectionReveal>
            <h2 className="section-title section-title-center">Projects</h2>
            <div className="projects-grid">
              {projects.map((project, i) => (
                <ProjectCard key={project.title} project={project as any} index={i} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </SectionBlock>

      {/* Experience */}
      <SectionBlock
        id="experience"
        className="experience-section"
        blob={blobConfigs.experience}
      >
        <SectionReveal>
          <React.Suspense
            fallback={
              <div className="section-loading-fallback padded">
                Loading Experience...
              </div>
            }
          >
            <CertificationsCarousel />
          </React.Suspense>
        </SectionReveal>
      </SectionBlock>

      {/* Contact */}
      <SectionBlock
        id="contact"
        className="contact-section"
        blob={blobConfigs.contact}
      >
        <SectionReveal>
          <React.Suspense
            fallback={
              <div className="section-loading-fallback padded">
                Loading Contact...
              </div>
            }
          >
            <ContactSection />
          </React.Suspense>
        </SectionReveal>
      </SectionBlock>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">Andrew George</div>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} &mdash; Built with React,
            TypeScript & Three.js
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const onDone = useCallback(() => {
    setLoaded(true);
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("cursor-prime"));
    });
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </motion.div>

      <AnimatePresence>
        {!loaded && <LoadingScreen key="loader" onDone={onDone} />}
      </AnimatePresence>
    </>
  );
}

export default App;
