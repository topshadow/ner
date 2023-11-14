'use client'

import { useEffect, useState,useTransition } from "react"
import {AddUser,listUser} from '@/actions/test/index'
import type {User} from '@prisma/client'
export default  function l() {
    const [users,setUsers]=useState<User[]>([] );
    const [transation,startTranstation]=useTransition();
    useEffect(()=>{
        startTranstation(async ()=>listUser().then(rtn=>setUsers(rtn)))
    },[])
    
    return <div>index
        {users.map(u=><li key={u.email}>{u.name}</li>)}

        <button onClick={()=>{
            startTranstation(async ()=>{
             let rtn=   await AddUser({name:'zhangsan',email:'2121718894@qq.com'});
             setUsers(rtn)
            })
        }}>新增用户</button>
    </div>

}