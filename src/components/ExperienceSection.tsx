import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ExternalLink } from "lucide-react";
import { certifications, education, experience } from "../data";
import { useMediaQuery } from "../hooks/useMediaQuery";
import CertificatesRoom from "./certificates/CertificatesRoom";
import { certificates } from "./certificates/roomData";

const VISIBLE_HIGHLIGHTS = 3;

const credentialPrograms = certifications.filter((group) => group.credential);

type Entry = {
  key: string;
  when: string;
  heading: string;
  role: string;
  highlights: string[];
  technologies: string[];
  current: boolean;
};

const entries: Entry[] = [
  ...experience.map((job) => ({
    key: job.company,
    when: job.period,
    heading: job.company,
    role: `${job.title} · ${job.location}`,
    highlights: job.highlights,
    technologies: job.technologies,
    current: job.current,
  })),
  {
    key: education.university,
    when: `Graduated ${education.graduated}`,
    heading: education.university,
    role: `${education.degree} · ${education.location}`,
    highlights: [`Graduation project: ${education.gradProject}`],
    technologies: [],
    current: false,
  },
];

const STEPS = entries.length;
// Width (in progress units) of each panel fade and of each marker hop
const FADE = 0.25 / STEPS;

// The marker rests on stop k while entry k is readable and hops to k + 1
// exactly while the panels cross-fade around boundary (k + 1) / STEPS.
const markerInput = [0];
const markerOutput = [0];
for (let k = 1; k < STEPS; k++) {
  markerInput.push(k / STEPS - FADE, k / STEPS + FADE);
  markerOutput.push(k - 1, k);
}
markerInput.push(1);
markerOutput.push(STEPS - 1);

function EntryContent({ entry }: { entry: Entry }) {
  const shown = entry.highlights.slice(0, VISIBLE_HIGHLIGHTS);
  const rest = entry.highlights.slice(VISIBLE_HIGHLIGHTS);
  return (
    <>
      <h3 className="exp-company">{entry.heading}</h3>
      <p className="exp-role">{entry.role}</p>
      <ul className="exp-highlights">
        {shown.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {rest.length > 0 && (
        <details className="exp-more">
          <summary>
            <span className="exp-more-closed">Show {rest.length} more</span>
            <span className="exp-more-open">Show less</span>
          </summary>
          <ul className="exp-highlights">
            {rest.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
      )}
      {entry.technologies.length > 0 && (
        <ul className="exp-tech tech-chips">
          {entry.technologies.map((tech) => (
            <li key={tech} className="tech-chip-compact">{tech}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function ExperienceTimeline() {
  return (
    <ol className="exp-timeline">
      {entries.map((entry) => (
        <li key={entry.key} className={entry.current ? "exp-item exp-item--current" : "exp-item"}>
          <p className="exp-when">{entry.when}</p>
          <div className="exp-body">
            <EntryContent entry={entry} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function StagePanel({
  entry,
  index,
  progress,
  active,
  onFocusInactive,
}: {
  entry: Entry;
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  onFocusInactive: () => void;
}) {
  const start = index / STEPS;
  const end = (index + 1) / STEPS;
  const input = [start, start + FADE, end - FADE, end];
  const first = index === 0;
  const last = index === STEPS - 1;
  const opacity = useTransform(progress, input, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, input, [first ? 0 : 48, 0, 0, last ? 0 : -48]);
  return (
    <motion.div
      className={active ? "exp-panel is-active" : "exp-panel"}
      style={{ opacity, y }}
      onFocusCapture={active ? undefined : onFocusInactive}
    >
      <EntryContent entry={entry} />
    </motion.div>
  );
}

function ExperienceStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(STEPS - 1, Math.floor(p * STEPS)));
  });
  const markerIndex = useTransform(scrollYProgress, markerInput, markerOutput);
  const markerY = useTransform(markerIndex, (i) => `${i * 100}%`);
  const fill = useTransform(markerIndex, (i) => (i + 0.5) / STEPS);

  const scrollToStep = (step: number) => {
    const track = trackRef.current;
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: trackTop + ((step + 0.5) / STEPS) * (track.offsetHeight - window.innerHeight),
    });
  };

  return (
    <div ref={trackRef} className="exp-track" style={{ "--exp-steps": STEPS } as CSSProperties}>
      <div className="exp-stage">
        <div className="exp-rail">
          <ol className="exp-rail-stops">
            {entries.map((entry, i) => (
              <li key={entry.key}>
                <button
                  type="button"
                  className={i === active ? "exp-rail-stop is-active" : "exp-rail-stop"}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => scrollToStep(i)}
                >
                  {entry.when}
                </button>
              </li>
            ))}
          </ol>
          <motion.span className="exp-rail-fill" style={{ scaleY: fill }} aria-hidden="true" />
          <motion.span className="exp-rail-marker" style={{ y: markerY }} aria-hidden="true" />
        </div>
        <div className="exp-panels">
          {entries.map((entry, i) => (
            <StagePanel
              key={entry.key}
              entry={entry}
              index={i}
              progress={scrollYProgress}
              active={i === active}
              onFocusInactive={() => scrollToStep(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const pinned =
    useMediaQuery("(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)") &&
    CSS.supports("overflow", "clip");

  return (
    <div className="exp-root">
      <h2 className="section-title section-title-center">Experience</h2>

      {pinned ? <ExperienceStage /> : <ExperienceTimeline />}

      <h3 className="exp-subtitle">Certifications</h3>
      <p className="exp-cert-summary">
        {certificates.length} certificates across {certifications.length} programs.
      </p>
      <ul className="exp-cert-links">
        {credentialPrograms.map((group) => (
          <li key={group.id}>
            <a href={group.credential} target="_blank" rel="noopener noreferrer">
              {group.program.replace(" Professional Certificate", "")}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <CertificatesRoom />
    </div>
  );
}
