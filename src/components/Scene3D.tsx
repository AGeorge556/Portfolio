import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'

// Utility: detect mobile
function useIsMobile() {
  const { size } = useThree()
  return size.width < 768
}

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

function GeometricShape({ scale = 2, color = '#4f46e5', shimmer = false, breathing = false, speed = 1, opacity = 0.3 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state: { mouse: THREE.Vector2; clock: THREE.Clock }) => {
    if (meshRef.current) {
      // Constant rotation
      meshRef.current.rotation.z -= 0.01 * speed
      // Mouse parallax
      const mouseX = (state.mouse.x * Math.PI) / 16
      const mouseY = (state.mouse.y * Math.PI) / 16
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.03)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.03)
      // Breathing scale
      if (breathing) {
        const s = scale + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.12
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

function BokehParticles({ count = 120, color = '#6366f1', size = 0.18, twinkle = true, parallax = true, speed = 0.01, opacity = 0.18 }) {
  const particlesRef = useRef<THREE.Points>(null)
  const { mouse, size: viewport } = useThree()
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
      // Parallax
      if (parallax) {
        particlesRef.current.rotation.y = mouse.x * 0.2
        particlesRef.current.rotation.x = mouse.y * 0.2
      }
      // Slow rotation
      particlesRef.current.rotation.z += speed
      // Twinkle
      if (twinkle) {
        const mat = particlesRef.current.material as THREE.PointsMaterial
        mat.opacity = opacity + Math.sin(state.clock.getElapsedTime() * 2 + 1) * 0.08
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

export function Scene3D() {
  // Responsive: reduce intensity on mobile
  // (use fewer particles, less bloom, smaller torus)
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
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.18} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} />
        {/* Main torus: breathing, shimmer, bloom */}
        <GeometricShape scale={isMobile ? 1.5 : 2.2} color={mainTorusColor} shimmer breathing opacity={0.32} />
        {/* Second torus: larger, slower, subtle */}
        <GeometricShape scale={isMobile ? 2.2 : 3.2} color={secondTorusColor} speed={0.5} opacity={0.13} />
        {/* Bokeh/twinkle particles */}
        <BokehParticles count={isMobile ? 40 : 90} color={particles1Color} size={isMobile ? 0.09 : 0.18} />
        {/* Second layer, different color/size */}
        <BokehParticles count={isMobile ? 30 : 60} color={particles2Color} size={isMobile ? 0.07 : 0.13} speed={0.005} opacity={0.12} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.8} intensity={isMobile ? 0.5 : 1.1} />
        </EffectComposer>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
} 