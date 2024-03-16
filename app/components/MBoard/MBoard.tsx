import React from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'

const TexturedPlane = ({ position }) => {
  const texture = useLoader(TextureLoader, '/anth-poly.png')

  return (
    <group position={position}>
      {/* Front side with texture */}
      <mesh position={[0, 2, -0.8]} rotation={[-0.75, 0, -0.5]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Back side without texture */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color='lightgray' />
      </mesh>

      {/* Sides - to create thickness */}
      {/* Top */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.16]} />
        <meshStandardMaterial color='lightgray' />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.16]} />
        <meshStandardMaterial color='lightgray' />
      </mesh>
      {/* Left */}
      <mesh position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.16, 1]} />
        <meshStandardMaterial color='lightgray' />
      </mesh>
      {/* Right */}
      <mesh position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.16, 1]} />
        <meshStandardMaterial color='lightgray' />
      </mesh>
    </group>
  )
}

export default TexturedPlane
