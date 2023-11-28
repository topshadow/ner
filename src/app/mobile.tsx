'use client'

import { checkLogin } from "@/shared/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Mobile(){
   const router= useRouter();
    useEffect(()=>{
        if(!checkLogin()){
                router.push('/passport/login')
        }
    },[])
    return <div>mobile</div>
}