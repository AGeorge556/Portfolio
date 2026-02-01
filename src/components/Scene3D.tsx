import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'

// Utility: detect theme
function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

// Shared scroll state that persists across components
const scrollState = { progress: 0, velocity: 0 };

function useScrollTracker() {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const velocity = (scrollY - lastScrollY) / 100; // Normalized velocity

      scrollState.progress = progress;
      scrollState.velocity = THREE.MathUtils.lerp(scrollState.velocity, velocity, 0.1);
      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll(); // Initial call

    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

function GeometricShape({
  scale = 2,
  color = '#4f46e5',
  shimmer = false,
  breathing = false,
  speed = 1,
  opacity = 0.3,
  scrollMultiplier = 1,
  scrollOffsetY = 0
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseY = useRef(0)

  useFrame((state: { mouse: THREE.Vector2; clock: THREE.Clock }) => {
    if (meshRef.current) {
      // Scroll-based vertical movement (parallax depth effect)
      const scrollY = scrollState.progress * scrollMultiplier * 4;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        baseY.current + scrollOffsetY - scrollY,
        0.05
      );

      // Scroll affects rotation speed
      const scrollBoost = 1 + Math.abs(scrollState.velocity) * 2;
      meshRef.current.rotation.z -= 0.01 * speed * scrollBoost;

      // Scroll-based tilt
      const scrollTilt = scrollState.progress * Math.PI * 0.15;

      // Mouse parallax combined with scroll
      const mouseX = (state.mouse.x * Math.PI) / 16
      const mouseY = (state.mouse.y * Math.PI) / 16
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY + scrollTilt, 0.03)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.03)

      // Breathing scale with scroll influence
      if (breathing) {
        const scrollScale = 1 + scrollState.progress * 0.15;
        const s = (scale + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.12) * scrollScale;
        meshRef.current.scale.set(s, s, s)
      }

      // Shimmering color
      if (shimmer) {
        const t = state.clock.getElapsedTime()
        const mat = meshRef.current.material as THREE.MeshStandardMaterial
        mat.opacity = opacity + Math.sin(t * 2) * 0.08
        mat.color.setHSL(0.65 + Math.sin(t * 0.5) * 0.03, 0.7, 0.6)
      }
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={[scale, scale, scale]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1, 0.2, 16, 32]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          metalness={0.8}
          roughness={0.2}
          transparent={true}
          opacity={opacity}
        />
      </mesh>
    </Float>
  )
}

function BokehParticles({
  count = 120,
  color = '#6366f1',
  size = 0.18,
  twinkle = true,
  parallax = true,
  speed = 0.01,
  opacity = 0.18,
  scrollMultiplier = 1
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  // Sprite texture: soft white circle
  const sprite = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64; canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  // Particle positions
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16
    }
    return arr
  }, [count])

  // Animate
  useFrame((state) => {
    if (particlesRef.current) {
      // Scroll-based vertical shift (different rate creates parallax)
      const scrollY = scrollState.progress * scrollMultiplier * 3;
      particlesRef.current.position.y = THREE.MathUtils.lerp(
        particlesRef.current.position.y,
        -scrollY,
        0.08
      );

      // Scroll affects rotation
      const scrollBoost = 1 + Math.abs(scrollState.velocity) * 3;
      particlesRef.current.rotation.z += speed * scrollBoost;

      // Parallax from mouse + scroll-based tilt
      if (parallax) {
        const scrollTiltX = scrollState.progress * 0.3;
        particlesRef.current.rotation.y = THREE.MathUtils.lerp(
          particlesRef.current.rotation.y,
          mouse.x * 0.2,
          0.05
        );
        particlesRef.current.rotation.x = THREE.MathUtils.lerp(
          particlesRef.current.rotation.x,
          mouse.y * 0.2 + scrollTiltX,
          0.05
        );
      }

      // Twinkle with scroll influence
      if (twinkle) {
        const mat = particlesRef.current.material as THREE.PointsMaterial
        const scrollOpacity = opacity * (1 - scrollState.progress * 0.3); // Fade slightly as you scroll
        mat.opacity = scrollOpacity + Math.sin(state.clock.getElapsedTime() * 2 + 1) * 0.08
      }
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation={true}
        map={sprite}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  )
}

// Camera that reacts to scroll
function ScrollCamera() {
  const { camera } = useThree();
  const baseZ = 8;

  useFrame(() => {
    // Subtle camera movement based on scroll
    const targetZ = baseZ + scrollState.progress * 2; // Pull back as you scroll
    const targetY = -scrollState.progress * 1.5; // Drift down slightly

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
  });

  return null;
}

export function Scene3D() {
  // Track scroll position
  useScrollTracker();

  // Responsive: reduce intensity on mobile
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const theme = useTheme();

  // Theme-based colors
  const bgGradient = theme === 'dark'
    ? 'radial-gradient(ellipse at 50% 40%, #181a2a 60%, #23244a 100%)'
    : 'radial-gradient(ellipse at 50% 40%, #f3f4f6 60%, #e0e7ef 100%)';
  const mainTorusColor = theme === 'dark' ? '#6366f1' : '#818cf8';
  const secondTorusColor = theme === 'dark' ? '#818cf8' : '#a5b4fc';
  const particles1Color = theme === 'dark' ? '#818cf8' : '#a5b4fc';
  const particles2Color = theme === 'dark' ? '#a5b4fc' : '#c7d2fe';

  return (
    <div className="scene3d-container" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      width: '100vw',
      height: '100vh',
      background: bgGradient
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true, stencil: false, depth: false }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ScrollCamera />
        <ambientLight intensity={0.18} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />
        {/* Main torus: breathing, shimmer, scroll-reactive */}
        <GeometricShape
          scale={isMobile ? 1.5 : 2.2}
          color={mainTorusColor}
          shimmer
          breathing
          opacity={0.32}
          scrollMultiplier={1.2}
          scrollOffsetY={0}
        />
        {/* Second torus: larger, slower, different scroll rate */}
        <GeometricShape
          scale={isMobile ? 2.2 : 3.2}
          color={secondTorusColor}
          speed={0.5}
          opacity={0.13}
          scrollMultiplier={0.6}
          scrollOffsetY={1}
        />
        {/* Bokeh/twinkle particles - faster scroll rate */}
        <BokehParticles
          count={isMobile ? 40 : 90}
          color={particles1Color}
          size={isMobile ? 0.09 : 0.18}
          scrollMultiplier={1.5}
        />
        {/* Second layer - slower scroll rate for depth */}
        <BokehParticles
          count={isMobile ? 30 : 60}
          color={particles2Color}
          size={isMobile ? 0.07 : 0.13}
          speed={0.005}
          opacity={0.12}
          scrollMultiplier={0.8}
        />
        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} mipmapBlur levels={3} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
