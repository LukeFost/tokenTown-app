import React, { useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
function TopFace(props) {
  // Load texture
  const texture = useLoader(TextureLoader, 'board_town.png') // Adjust the path to where your texture is located

  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.95, 0.95]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
export default TopFace
