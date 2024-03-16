'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import TexturedPlane from './components/MBoard/MBoard'

const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <div className='flex h-96 w-full flex-col items-center justify-center'></div>,
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='align-center mx-auto w-full  lg:w-4/5'>
        <div className='w-full text-center md:w-3/5'>
          <View className='flex h-96 w-full flex-col items-center justify-center'>
            <ambientLight intensity={3.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <TexturedPlane position={[0, 0, 0]} />
            </Suspense>
          </View>
        </div>
      </div>
    </>
  )
}
