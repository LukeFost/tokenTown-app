// handlers.tsx
'use server'

import { config } from '../config/index'
import { writeContract, readContract } from 'wagmi/actions'
import { abi, address_sepolia } from '@/ABI/game'
import { approvals_abi } from '@/ABI/approvals'

export const handleSetupGame = async (
  setIsLoadingSetup,
  setButtonLabelSetup,
  theCurrencyAddress,
  gameAddress,
  userAddress,
  address,
  theBuyIn,
) => {
  setIsLoadingSetup(true)
  const { data } = await readContract(config, {
    address: theCurrencyAddress,
    abi: approvals_abi,
    functionName: 'allowance',
    args: [userAddress, gameAddress],
    account: address,
  })
  if (data < 1000000000000000000000) {
    setButtonLabelSetup('Approve')
    const result = await writeContract(config, {
      address: theCurrencyAddress,
      abi: approvals_abi,
      functionName: 'approve',
      args: [gameAddress, 1000000000000000000000000000],
      account: address,
    })
    result
  } else {
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

export const handleJoinGame = async (setIsLoadingJoin, address) => {
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

export const handleStartGame = async (setIsLoadingStart, address) => {
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

export const handleMintEDai = async (setIsLoadingMint, address) => {
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
