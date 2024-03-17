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
import ModalWindow from './components/ModalWindow'
import { atom, useAtom } from 'jotai'
import { config } from '@/config/index'
import { writeContract, readContract } from 'wagmi/actions'
import { abi, address_sepolia } from '@/ABI/game'
import { approvals_abi } from '@/ABI/approvals'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { watchContractEvent } from '@wagmi/core'

export const currencyAddress = atom<`0x${string}`>('0x33438d89AA3a00323D9269d672fB43E43CE589c0')
export const buyIn = atom(0)

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

// get current player data
// get other players data
// set the pawns to the player data
// player model, owned properties, cash,

export default function App() {
  const { address } = useAccount()
  const [activePlayer, setActivePlayer] = useState<number>(4)
  const [gameState, setGameState] = useState<string | undefined>('roll') // Initial gameState
  const [targetSquare, setTargetSquare] = useState<number>(0)
  const [refreshValue, setRefreshValue] = useState<number>(0)

  const [isTurn, setIsTurn] = useState<boolean | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readContract(config, {
          address: address_sepolia,
          abi: abi,
          functionName: 'getCurrentPlayer',
          args: [],
          account: address,
        })

        const myPosition = await readContract(config, {
          address: address_sepolia,
          abi: abi,
          functionName: 'getMyPosition',
          args: [],
          account: address,
        })
        console.log(myPosition, 'my current position')
        console.log(data, 'getCurrentPlayer')

        // Check if the address is in the data
        const isAddressInData = data.includes(address)

        if (address) {
          setTargetSquare(Number(myPosition))
          console.log('set targetsquare to current pos', targetSquare)
        }

        // Set hideJoinMenu based on the presence of the address in the data
        setIsTurn(isAddressInData)
        console.log(isTurn, 'is it your turn?')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [address, isTurn, targetSquare, refreshValue])

  // let dice = {
  //   sides: 4,
  //   roll: function () {
  //     let randomNumber = Math.floor(Math.random() * this.sides) + 1
  //     return randomNumber
  //   },
  // }

  useEffect(() => {
    console.log(targetSquare, 'target Square')
  }, [targetSquare])

  // Turn -> If my turn enable a roll then if property not owned set to buy, if property owned pay rent, else noRoll

  const handleButtonClick = () => {
    switch (gameState) {
      case 'buy':
        console.log('Buying property')

        setGameState('roll') // Change to the next state if needed
        break
      case 'roll':
        console.log('Rolling dice')
        // Implement roll logic here
        // let results = dice.roll()
        // const max = 20
        // if (results + targetSquare > max) {
        //   let newValue = targetSquare + results - max
        //   setTargetSquare(newValue)
        //   break
        // } else {
        //   setTargetSquare((prevTargetSquare) => prevTargetSquare + results)
        //   setGameState('roll') // Change to the next state if needed
        //   break
        // }

        if (isTurn) {
          const handleRollDice = async () => {
            const result = await writeContract(config, {
              address: address_sepolia,
              abi: abi,
              functionName: 'beginMove',
              args: [],
              account: address,
            })
            result
            setGameState('noRoll')
          }
          handleRollDice()
        }
        break
      case 'noRoll':
        console.log('Cannot roll now')
        // if noRoll
        // if on property unowned
        // show buy
        // if on property owned
        // pay rent
        // else
        // set game state to wait
        setGameState('wait') // Change to the next state if needed
        break
      case 'end':
        console.log('Game over')
        // if user has no mony
        // set to game over and exit game
        break
      case 'wait':
        console.log('Waiting...')
        // Implement waiting logic here

        //if turn set to roll else do nuthin
        setGameState('roll')
      default:
        console.log('Invalid game state')
        break
    }
  }

  const getButtonLabel = () => {
    switch (gameState) {
      case 'buy':
        return (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z'
              />
            </svg>
            BUY
          </>
        )
      case 'roll':
        return (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z'
              />
            </svg>
            ROLL
          </>
        )
      case 'noRoll':
        return (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21'
              />
            </svg>
            WAIT
          </>
        )
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
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <dialog id='my_modal_1' className='modal'>
            <div className='modal-box'>
              <div className='modal-action'>
                <form method='dialog'>
                  {/* if there is a button in form, it will close the modal */}
                  <ModalWindow setActivePlayer={setActivePlayer} />
                </form>
              </div>
            </div>
          </dialog>
          <div className='fixed inset-x-0 top-0 flex items-center justify-center space-x-5 pt-5'>
            <button
              className='btn btn-outline btn-info'
              onClick={() => document.getElementById('my_modal_1').showModal()}
            >
              Menu
            </button>
            <button className='btn-sqaure btn btn-outline btn-primary btn-md' onClick={() => setActivePlayer(4)}>
              Top Down View
            </button>
          </div>

          <div className='fixed inset-x-0 bottom-0 flex items-center justify-center space-x-5 pb-5'>
            <button className='btn btn-outline btn-info'>Left Button</button>
            <button className='btn-sqaure btn btn-primary btn-lg' onClick={handleButtonClick}>
              {getButtonLabel()}
            </button>
            <button className='btn btn-outline btn-info'>Right Button</button>
          </div>
        </div>
      </div>
    </div>
  )
}
