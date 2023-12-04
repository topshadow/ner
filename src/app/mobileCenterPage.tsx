import { RbacUser } from "@prisma/client";
import { List } from "antd-mobile";
import { useEffect, useState } from "react"
import { userApi } from "./platform/mobile/actions";
import { getToken } from "@/shared/auth";

export function MobileCenterPage(){
    const [user,setUser]=useState<RbacUser>()
    const loadUserInfo=()=>{
        userApi.loadUserInfo(getToken()).then(res=>setUser(res));
    }
    useEffect(()=>{
        loadUserInfo();
    },[]);
    return <div>用户中心
        {user&&<List>
            <List.Item title={'昵称'}>{user.nickname}</List.Item>
            <List.Item title={'账号'}>{user.username}</List.Item>
            
        </List>}

    </div>
}