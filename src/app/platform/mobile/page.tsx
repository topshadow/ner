'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('./app'))

export default function () {
    return      <><App></App></> 
}