import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
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
  { name: "Next.js",       color: "#F7F7FF", Icon: SiNextdotjs },
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
  { name: "Vercel",        color: "#F7F7FF", Icon: SiVercel },
  { name: "Figma",         color: "#f24e1e", Icon: SiFigma },
  { name: "VS Code",       color: "#007acc", Icon: Code2 },
  { name: "Docker",        color: "#00C5CC", Icon: SiDocker },
];

const SkillNodeCard = ({
  skill,
  position,
}: {
  skill: SkillDef;
  position: THREE.Vector3;
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const Icon = skill.Icon;
  const color = skill.color;
  const stemLength = 0.9;

  // Anchor pad lies tangent to the globe; stem and label go out along the normal.
  const { normal, padQuaternion, stemQuaternion } = useMemo(() => {
    const n = position.clone().normalize();
    return {
      normal: n,
      padQuaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n),
      stemQuaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n),
    };
  }, [position]);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh quaternion={padQuaternion}>
        <ringGeometry args={[0.14, 0.18, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={normal.clone().multiplyScalar(stemLength / 2)} quaternion={stemQuaternion}>
        <cylinderGeometry args={[0.012, 0.012, stemLength, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      <Html
        position={normal.clone().multiplyScalar(stemLength + 0.15)}
        center
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
  radius,
}: {
  positions: THREE.Vector3[];
  radius: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Each node linked to its 3 nearest neighbours, pairs de-duplicated.
  const linkGeometry = useMemo(() => {
    const seen = new Set<string>();
    const verts: number[] = [];
    positions.forEach((p, i) => {
      positions
        .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
        .filter((n) => n.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          const q = positions[j];
          verts.push(p.x, p.y, p.z, q.x, q.y, q.z);
        });
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geom;
  }, [positions]);

  useEffect(() => () => linkGeometry.dispose(), [linkGeometry]);

  useFrame((_, delta) => {
    if (groupRef.current && !reduceMotion) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[radius * 0.985, 32, 20]} />
        <meshBasicMaterial
          color="#AFA8BA"
          wireframe
          transparent
          opacity={0.10}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[radius * 0.97, 24, 16]} />
        <meshBasicMaterial
          color="#27187E"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial
          color="#AFA8BA"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </lineSegments>

      {allSkills.map((skill, i) => (
        <SkillNodeCard
          key={skill.name}
          skill={skill}
          position={positions[i]}
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

  const radius = 5;

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < allSkills.length; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / allSkills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, [radius]);

  // ponytail: phones get a plain list (20 labels overlap on a small globe and the canvas traps
  // scrolling). The three.js chunk still downloads there; split this component if that matters.
  if (isMobile) {
    return (
      <ul className="tech-chips">
        {allSkills.map(({ name, Icon }) => (
          <li key={name} className="tech-chip-compact">
            <Icon /> {name}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.cloudRoot}>
      <div className={styles.instruction}>
        Drag to rotate
      </div>

      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        flat
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[-10, 10, -10]} color="#E8615C" intensity={2} />
        <pointLight position={[10, -10, 10]} color="#AE231F" intensity={1.5} />

        <SpinningCloud positions={positions} radius={radius} />

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
