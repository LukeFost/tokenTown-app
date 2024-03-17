'use client'
import React, { use, useEffect, useState } from 'react'
import ConnectButton from './ConnectButton'
import { config } from '../config/index'
import { writeContract, readContract } from 'wagmi/actions'
import { abi, address_sepolia } from '@/ABI/game'
import { approvals_abi } from '@/ABI/approvals'
import { buyIn, currencyAddress } from '@/page'
import { useAtom } from 'jotai'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'

const ModalWindow = ({ setActivePlayer }) => {
  const { address } = useAccount()
  const [theBuyIn, setTheBuyIn] = useAtom(buyIn)
  const [theCurrencyAddress, setTheCurrencyAddress] = useAtom(currencyAddress)
  const [isLoadingSetup, setIsLoadingSetup] = useState(false)
  const [isLoadingJoin, setIsLoadingJoin] = useState(false)
  const [isLoadingStart, setIsLoadingStart] = useState(false)
  const [isLoadingMint, setIsLoadingMint] = useState(false)
  const [buttonLabelSetup, setButtonLabelSetup] = useState('Setup Game')
  const [buttonLabelJoin, setButtonLabelJoin] = useState('Join Game')
  const [buttonLabelStart, setButtonLabelStart] = useState('Start Game')
  const [buttonLabelMint, setButtonLabelMint] = useState('Mint eDAI')
  const [hideJoinMenu, setHideJoinMenu] = useState(false)

  const [currentAllowance, setCurrentAllowance] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readContract(config, {
          address: address_sepolia,
          abi: abi,
          functionName: 'getActivePlayers',
          args: [],
          account: address,
        })

        // Check if the address is in the data
        const isAddressInData = data.includes(address)

        // Set hideJoinMenu based on the presence of the address in the data
        setHideJoinMenu(isAddressInData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [address])

  useEffect(() => {
    async function doRead() {
      const data = await readContract(config, {
        address: theCurrencyAddress,
        abi: approvals_abi,
        functionName: 'allowance',
        args: [address, address_sepolia],
        account: address,
      })
      setCurrentAllowance(data)
      console.log(data, 'This is the read Data for allowance')
    }
    doRead()
  }, [address, currentAllowance, theCurrencyAddress])

  useEffect(() => {
    if (currentAllowance >= 100000000000000000000000) {
      setButtonLabelSetup('Setup Game')
    } else {
      setButtonLabelSetup('Approve')
    }
  }, [currentAllowance])

  const handleSetupGame = async () => {
    setIsLoadingSetup(true)
    console.log(theCurrencyAddress, 'Currency address')
    if (buttonLabelSetup == 'Approve') {
      setButtonLabelSetup('Approve')
      const result = await writeContract(config, {
        address: theCurrencyAddress,
        abi: approvals_abi,
        functionName: 'approve',
        args: [address_sepolia, 100000000000000000000000000],
        account: address,
      })
      result
    } else if (currentAllowance >= 1000000000000000000000 && theBuyIn >= 10) {
      console.log('writeContract setupvars', theCurrencyAddress, ' ', theBuyIn, ' ', address)
      const result = await writeContract(config, {
        address: address_sepolia,
        abi: abi,
        functionName: 'setUp',
        args: [theCurrencyAddress, theBuyIn],
        account: address,
      })
      result
    }
    setIsLoadingSetup(false)
  }

  const handleJoinGame = async () => {
    setIsLoadingJoin(true)
    const result = await writeContract(config, {
      address: address_sepolia,
      abi: abi,
      functionName: 'joinGame',
      args: [],
      account: address,
    })
    result
    setIsLoadingJoin(false)
  }

  const handleStartGame = async () => {
    setIsLoadingStart(true)
    const result = await writeContract(config, {
      address: address_sepolia,
      abi: abi,
      functionName: 'startGame',
      args: [],
      account: address,
    })
    result
    setIsLoadingStart(false)
  }

  const handleMintEDai = async () => {
    setIsLoadingMint(true)
    const result = await writeContract(config, {
      address: theCurrencyAddress,
      abi: approvals_abi,
      functionName: 'mint',
      args: [1000000000000000000000],
      account: address,
    })
    result
    setIsLoadingMint(false)
  }

  const nothing = () => {}

  return (
    <div className='relative max-h-full max-w-full overflow-auto rounded-lg bg-white p-8'>
      <button className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='size-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      </button>
      <div className='mb-8 flex justify-center'>
        <span onClick={nothing}>
          <ConnectButton />
        </span>
      </div>
      <div>
        <button onClick={handleMintEDai} className='btn btn-secondary' disabled={isLoadingMint}>
          {isLoadingMint ? <span className='loading loading-spinner'></span> : buttonLabelMint}
        </button>
      </div>
      {hideJoinMenu ? (
        'Game Currently in Progress...'
      ) : (
        <div className='grid grid-cols-3 gap-4'>
          <div className='grid grid-cols-1 gap-4 border-2 border-dashed border-indigo-600'>
            <button onClick={handleSetupGame} className='btn btn-secondary' disabled={isLoadingSetup}>
              {isLoadingSetup ? <span className='loading loading-spinner'></span> : buttonLabelSetup}
            </button>
            {/* <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Currency Address</span>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full max-w-xs'
              onChange={(e) => setTheCurrencyAddress(e.target.value)}
            />
          </label> */}
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Buy In</span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setTheBuyIn(BigInt(parseEther(e.target.value)))}
              />
            </label>
          </div>
          <div className='grid grid-cols-1 gap-4 border-2 border-dashed border-indigo-600'>
            <button onClick={handleStartGame} className='btn btn-primary' disabled={isLoadingStart}>
              {isLoadingStart ? <span className='loading loading-spinner'></span> : buttonLabelStart}
            </button>
          </div>
          <div className='grid grid-cols-1 gap-4 border-2 border-dashed border-indigo-600'>
            <button onClick={handleJoinGame} className='btn btn-success' disabled={isLoadingJoin}>
              {isLoadingJoin ? <span className='loading loading-spinner'></span> : buttonLabelJoin}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModalWindow
