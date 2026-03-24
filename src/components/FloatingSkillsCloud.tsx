import { useRef, useMemo } from "react";
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

type SkillDef = {
  name: string;
  color: string;
  Icon: IconType | React.ComponentType<{ size?: number; color?: string }>;
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

function SkillNode({
  skill,
  position,
}: {
  skill: SkillDef;
  position: THREE.Vector3;
}) {
  const ref = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const Icon = skill.Icon;

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position.y + Math.sin(state.clock.elapsedTime * 1.2 + offset) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshDistortMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={0.6}
          distort={0.4}
          speed={3}
          roughness={0.2}
        />
      </mesh>

      <Html distanceFactor={14} center transform sprite zIndexRange={[100, 0]}>
        <div
          className="skill-tag-3d"
          style={{
            borderColor: `${skill.color}60`,
            boxShadow: `0 4px 12px ${skill.color}30`,
          }}
        >
          <Icon size={14} color={skill.color} />
          <span>{skill.name}</span>
        </div>
      </Html>
    </group>
  );
}

export default function FloatingSkillsCloud() {
  const positions = useMemo(() => {
    const pos = [];
    const radius = 6;
    for (let i = 0; i < allSkills.length; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / allSkills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = radius * (0.8 + Math.random() * 0.4);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, []);

  return (
    <div className="skills-cloud-root">
      <div className="skills-cloud-instruction">Drag around &bull; Scroll to zoom</div>

      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 10, -10]} color="#818cf8" intensity={1.5} />
        <pointLight position={[10, -10, 10]} color="#a855f7" intensity={1} />

        <group>
          {allSkills.map((skill, i) => (
            <SkillNode key={skill.name} skill={skill} position={positions[i]} />
          ))}
        </group>

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={35}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
