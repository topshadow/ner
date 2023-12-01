'use client'
import {useState, useTransition} from 'react';
import { PlatformUi, usePlatform } from '@/shared/platform';
import React from 'react';

const Pc=React.lazy(()=>import('./pc'))
const Mobile=React.lazy(()=>import('./mobile'))


export default function Home() {
  const platform= usePlatform();

  const [status,setStatus]=useState(false);
  return (
      
      <PlatformUi pc={<Pc></Pc>} mobile={<Mobile></Mobile>} ></PlatformUi>
  )
}
