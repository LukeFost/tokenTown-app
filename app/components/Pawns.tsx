import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const models = ['/dog.glb', '/duck.glb']

export function Pawn({ gameState, targetSquare }) {
  const [modelIndex, setModelIndex] = useState(0)
  const [positionState, setPositionState] = useState(1)
  const [currentPosition, setCurrentPosition] = useState({ x: -0.4, z: 0.4 })

  const gltf = useLoader(GLTFLoader, models[modelIndex])
  const pawnRef = useRef()

  const positions = [
    [-0.4, 0.4], //
    [-0.4, 0.18], //
    [-0.4, 0.03], //
    [-0.4, -0.12], //
    [-0.4, -0.27], //
    [-0.4, -0.43], //
    [-0.25, -0.43], //
    [-0.1, -0.43], //
    [0.08, -0.43], //
    [0.22, -0.43], //
    [0.4, -0.43], //
    [0.4, -0.29], //
    [0.4, -0.14], //
    [0.4, 0.02], //
    [0.4, 0.18], //
    [0.4, 0.4], //
    [0.22, 0.33], //
    [0.08, 0.33], //
    [-0.08, 0.33], //
    [-0.25, 0.33], //
  ]

  useEffect(() => {
    if (gameState === 'jail') {
      setModelIndex(1) // Switch to a different model when in 'jail'
    } else {
      setModelIndex(0) // Default model
    }
  }, [gameState])

  useEffect(() => {
    if (targetSquare) {
      setPositionState(targetSquare)
    }
  }, [targetSquare])

  const calculatePosition = (index) => {
    if (index > positions.length) {
      index = index - positions.length
    }

    let x = positions[index - 1][0]
    let z = positions[index - 1][1]

    return { x, z }
  }

  useFrame(() => {
    const targetPosition = calculatePosition(positionState)
    let { x, z } = currentPosition

    // Move along x if not at target x, regardless of z position
    if (x !== targetPosition.x) {
      x += (targetPosition.x - x) / 30 // Incrementally update x
    }

    // Move along z if not at target z, regardless of x position
    if (z !== targetPosition.z) {
      z += (targetPosition.z - z) / 30 // Incrementally update z
    }

    setCurrentPosition({ x, z })

    // Calculate the vertical position based on the distance to the target position
    const distanceToTarget = Math.sqrt(Math.pow(targetPosition.x - x, 2) + Math.pow(targetPosition.z - z, 2))
    const maxHeight = 0.05 // Adjust this value to control the maximum height of the vertical movement
    const verticalPosition = Math.sin((1 - distanceToTarget / 0.1) * Math.PI) * maxHeight

    pawnRef.current.position.set(x, verticalPosition + 0.028, z)
  })

  return <primitive ref={pawnRef} object={gltf.scene} scale={[0.05, 0.05, 0.05]} />
}
