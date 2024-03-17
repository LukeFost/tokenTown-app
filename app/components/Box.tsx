'use client'
import React, { useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { OrbitControls } from '@react-three/drei'

function Box({ activePlayer }) {
  function setCameraPosition(camera, position, lookAt) {
    camera.position.set(...position)
    camera.lookAt(...lookAt)
    camera.updateProjectionMatrix()
  }

  const playerCameraPositions = [
    { position: [2, 2, 2], lookAt: [0, 0, 0] },
    { position: [-2, 2, 2], lookAt: [0, 0, 0] },
    { position: [2, 2, -2], lookAt: [0, 0, 0] },
    { position: [-2, 2, -2], lookAt: [0, 0, 0] },
    { position: [0, 0.75, 0], lookAt: [0, 0, 0] },
  ]

  const {
    camera,
    gl: { domElement },
  } = useThree()
  useEffect(() => {
    const { position, lookAt } = playerCameraPositions[activePlayer]
    camera.position.set(...position)
    camera.lookAt(...lookAt)
    camera.updateProjectionMatrix()
  }, [activePlayer, camera])

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 0.05, 1]} />
      <meshStandardMaterial color='#999' />
    </mesh>
  )
}
export default Box
