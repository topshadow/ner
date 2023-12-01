'use client'

import { Toast } from "antd-mobile"

export function messageHandle(res:any){
    if(res.msg){
        Toast.show({
            content:res.msg
        })
    }
   return res;
}

