import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function GeometricShape() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state: { mouse: THREE.Vector2; clock: THREE.Clock }) => {
    if (meshRef.current) {
      // Add constant clockwise rotation
      meshRef.current.rotation.z -= 0.01; // Negative value for clockwise rotation
      
      // Gentler rotation based on mouse position
      const mouseX = (state.mouse.x * Math.PI) / 16
      const mouseY = (state.mouse.y * Math.PI) / 16
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.03)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.03)
    }
  })

  return (
    <Float
      speed={1} 
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh
        ref={meshRef}
        scale={[2, 2, 2]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <torusGeometry args={[1, 0.2, 16, 32]} />
        <meshStandardMaterial
          color="#4f46e5"
          wireframe={true}
          metalness={0.8}
          roughness={0.2}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </Float>
  )
}

function BackgroundParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 700

  const positions = new Float32Array(count * 5)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    positions[i * 5] = (Math.random() - 0.5) * 15
    positions[i * 5 + 1] = (Math.random() - 0.5) * 15
    positions[i * 5 + 2] = (Math.random() - 0.5) * 15
    positions[i * 5 + 3] = (Math.random() - 0.5) * 15
    positions[i * 5 + 4] = (Math.random() - 0.5) * 15   
  }

  useFrame((state: { clock: THREE.Clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.02
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4f46e5"
        transparent
        opacity={0.2}
        sizeAttenuation={true}
      />
    </points>
  )
}

export function Scene3D() {
  return (
    <div className="scene3d-container" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
      width: '100vw',
      height: '100vh'
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <GeometricShape />
        <BackgroundParticles />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
} 