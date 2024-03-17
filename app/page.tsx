'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree, extend } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls'
import { TextureLoader } from 'three'
import { OrbitControls } from '@react-three/drei'
import Box from './components/Box'
import { Three } from '@/helpers/components/Three'
import Skybox from './components/Skybox'
import TopFace from './components/TopFace'
import { Pawn } from './components/Pawns'

extend({ OrbitControlsImpl })

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree()
  const controls = useRef()

  useFrame(() => controls.current.update())

  return <orbitControlsImpl ref={controls} args={[camera, domElement]} minDistance={0.1} maxDistance={5} />
}

export default function App() {
  const [activePlayer, setActivePlayer] = useState<number>(0)
  const [gameState, setGameState] = useState<string | undefined>('roll') // Initial gameState
  const [targetSquare, setTargetSquare] = useState<number>(0)

  let dice = {
    sides: 6,
    roll: function () {
      let randomNumber = Math.floor(Math.random() * this.sides) + 1
      return randomNumber
    },
  }

  useEffect(() => {
    console.log(targetSquare, 'target Square')
  }, [targetSquare])

  // Turn -> If my turn enable a roll then if property not owned set to buy, if property owned pay rent, else noRoll

  const handleButtonClick = () => {
    switch (gameState) {
      case 'buy':
        console.log('Buying property')
        // Implement buy logic here
        setGameState('roll') // Change to the next state if needed
        break
      case 'roll':
        console.log('Rolling dice')
        // Implement roll logic here
        let results = dice.roll()
        const max = 39
        if (results + targetSquare > max) {
          let newValue = targetSquare + results - max
          setTargetSquare(newValue)
          break
        } else {
          setTargetSquare((prevTargetSquare) => prevTargetSquare + 1)
          setGameState('roll') // Change to the next state if needed
          break
        }
      case 'noRoll':
        console.log('Cannot roll now')
        // Implement noRoll logic here
        setGameState('end') // Change to the next state if needed
        break
      case 'end':
        console.log('Game over')
        // Implement end logic here
        setGameState('buy') // Reset or change to the next state if needed
        break
      default:
        console.log('Invalid game state')
        break
    }
  }

  const getButtonLabel = () => {
    switch (gameState) {
      case 'buy':
        return 'Buy'
      case 'roll':
        return 'Roll'
      case 'noRoll':
        return 'Wait'
      case 'end':
        return 'End'
      default:
        return 'Action'
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0.75, 0] }}>
        <ambientLight intensity={4.5} />
        <Box activePlayer={activePlayer} />
        <TopFace position={[0, 0.02501, 0]} />
        <Pawn gameState={gameState} targetSquare={targetSquare} />
        <CameraControls />
        <Skybox />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {/* Your UI elements go here, they will stick to the screen */}
        <div style={{ pointerEvents: 'auto' }}>
          {/* Interactable UI elements need pointerEvents set to 'auto' */}
          <button
            className='rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600'
            onClick={() => setActivePlayer(0)}
          >
            Corner 1
          </button>
          <button
            className='rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600'
            onClick={() => setActivePlayer(1)}
          >
            Corner 2
          </button>
          <button
            className='rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600'
            onClick={() => setActivePlayer(2)}
          >
            Corner 3
          </button>
          <button
            className='rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600'
            onClick={() => setActivePlayer(3)}
          >
            Corner 4
          </button>
          <button
            className='rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600'
            onClick={() => setActivePlayer(4)}
          >
            Top Down View
          </button>
          <div className='fixed inset-x-0 bottom-0 flex items-center justify-center space-x-5 pb-5'>
            <button className='rounded bg-blue-500 px-4 py-2 text-xs text-blue-100 duration-300 hover:bg-blue-600'>
              Left Button
            </button>
            <button
              className='rounded-lg bg-red-500 px-8 py-2 text-xl text-white duration-300 hover:bg-red-600'
              onClick={handleButtonClick}
            >
              {getButtonLabel()}
            </button>
            <button className='rounded bg-blue-500 px-4 py-2 text-xs text-blue-100 duration-300 hover:bg-blue-600'>
              Right Button
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
