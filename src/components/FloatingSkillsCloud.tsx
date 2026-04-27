import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFlutter,
  SiBootstrap,
  SiFramer,
  SiSupabase,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiVercel,
  SiFigma,
  SiDocker,
} from "react-icons/si";
import { Code2, Network } from "lucide-react";
import styles from "./FloatingSkillsCloud.module.css";

type SkillDef = {
  name: string;
  color: string;
  Icon: IconType | React.ComponentType<{ className?: string }>;
};

const allSkills: SkillDef[] = [
  { name: "React.js",      color: "#61dafb", Icon: SiReact },
  { name: "TypeScript",    color: "#3178c6", Icon: SiTypescript },
  { name: "Next.js",       color: "#a78bfa", Icon: SiNextdotjs },
  { name: "JavaScript",    color: "#f7df1e", Icon: SiJavascript },
  { name: "HTML5",         color: "#e34f26", Icon: SiHtml5 },
  { name: "CSS3",          color: "#1572b6", Icon: SiCss },
  { name: "Tailwind CSS",  color: "#06b6d4", Icon: SiTailwindcss },
  { name: "Flutter",       color: "#54c5f8", Icon: SiFlutter },
  { name: "Bootstrap",     color: "#7952b3", Icon: SiBootstrap },
  { name: "Framer Motion", color: "#bb4b96", Icon: SiFramer },
  { name: "Supabase",      color: "#3ecf8e", Icon: SiSupabase },
  { name: "Node.js",       color: "#339933", Icon: SiNodedotjs },
  { name: "PostgreSQL",    color: "#336791", Icon: SiPostgresql },
  { name: "MongoDB",       color: "#47a248", Icon: SiMongodb },
  { name: "REST APIs",     color: "#ff6c37", Icon: Network },
  { name: "Git",           color: "#f05032", Icon: SiGit },
  { name: "Vercel",        color: "#818cf8", Icon: SiVercel },
  { name: "Figma",         color: "#f24e1e", Icon: SiFigma },
  { name: "VS Code",       color: "#007acc", Icon: Code2 },
  { name: "Docker",        color: "#00C5CC", Icon: SiDocker },
];

const SkillNodeCard = ({
  skill,
  position,
  isMobile,
}: {
  skill: SkillDef;
  position: THREE.Vector3;
  isMobile: boolean;
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const Icon = skill.Icon;
  const color = skill.color;

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.12, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          distort={isMobile ? 0.12 : 0.3}
          speed={isMobile ? 1.5 : 4}
          roughness={0}
        />
      </mesh>

      <Html
        distanceFactor={isMobile ? 11 : 14}
        center
        transform
        sprite
        zIndexRange={[100, 0]}
      >
        <div
          ref={labelRef}
          className={styles.skillTag}
          style={{
            ["--skill-color" as string]: color,
            ["--skill-color-alpha" as string]: `${color}70`,
            ["--skill-color-shadow" as string]: `${color}80`,
            ["--skill-color-dim" as string]: `${color}38`,
            ["--skill-color-inner" as string]: `${color}18`,
          }}
          onPointerOver={() => labelRef.current?.classList.add(styles.skillTagHovered)}
          onPointerOut={() => labelRef.current?.classList.remove(styles.skillTagHovered)}
        >
          <Icon className={styles.skillIcon} />
          <span>{skill.name}</span>
        </div>
      </Html>
    </group>
  );
};

function SpinningCloud({
  positions,
  isMobile,
}: {
  positions: THREE.Vector3[];
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isMobile ? 0.10 : 0.18);
    }
  });

  return (
    <group ref={groupRef}>
      {allSkills.map((skill, i) => (
        <SkillNodeCard
          key={skill.name}
          skill={skill}
          position={positions[i]}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}

export default function FloatingSkillsCloud() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const radius = isMobile ? 4.5 : 6;

  const positions = useMemo(() => {
    const seeded = (s: number) => {
      const v = Math.sin(s * 9301.0 + 49297.0) * 233280.0;
      return v - Math.floor(v);
    };
    const pos = [];
    for (let i = 0; i < allSkills.length; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / allSkills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = radius * (0.85 + seeded(i) * 0.3);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, [radius]);

  return (
    <div className={styles.cloudRoot}>
      <div className={styles.instruction}>
        {isMobile ? "Drag to rotate \u2022 Pinch to zoom" : "Drag around \u2022 Scroll to zoom"}
      </div>

      <Canvas
        camera={{ position: [0, 0, isMobile ? 12 : 15], fov: 60 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        flat
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[-10, 10, -10]} color="#818cf8" intensity={2} />
        <pointLight position={[10, -10, 10]} color="#a855f7" intensity={1.5} />

        <SpinningCloud positions={positions} isMobile={isMobile} />

        <OrbitControls
          enablePan={false}
          minDistance={isMobile ? 6 : 8}
          maxDistance={isMobile ? 25 : 35}
        />
      </Canvas>
    </div>
  );
}
