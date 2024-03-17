import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import { config } from '@/config'
import Web3ModalProvider from './context'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

import { cookieToInitialState } from 'wagmi'

export default function RootLayout({ children }) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Web3ModalProvider initialState={initialState}>
          <Layout>{children}</Layout>
        </Web3ModalProvider>
      </body>
    </html>
  )
}
