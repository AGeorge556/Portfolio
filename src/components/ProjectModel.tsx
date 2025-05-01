import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ProjectModelProps {
  modelPath: string
  scale?: number
}

export function ProjectModel({ modelPath, scale = 1 }: ProjectModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelPath)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={scale}
      position={[0, 0, 0]}
    />
  )
} 