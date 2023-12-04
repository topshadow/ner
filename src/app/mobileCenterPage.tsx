'use client'
import { RbacUser } from "@prisma/client";
import { Button, Divider, List, NavBar } from "antd-mobile";
import { useEffect, useState } from "react"
import { productApi, userApi } from "./platform/mobile/actions";
import { getToken } from "@/shared/auth";
import { useRouter } from "next/navigation";

export function MobileCenterPage() {
    const [user, setUser] = useState<RbacUser>();
    const navigate = useRouter();
    const logout = () => {
        localStorage.clear();
        navigate.push('/passport/login')

    }
    const [stockCount, setStockCount] = useState({ totalWeight: 0, totalCount: 0 });
    const loadUserInfo = () => {
        userApi.loadUserInfo(getToken()).then(res => setUser(res));
    }
    const loadUserProducts = () => {
        userApi.loadUserStockCount(getToken()).then(res => setStockCount(res));
    }
    useEffect(() => {
        loadUserInfo();
        loadUserProducts();
    }, []);
    return <div>
        <NavBar back={null}>
            个人中心
        </NavBar>
        {user && <List>
            <List.Item title={'昵称'}>{user.nickname}</List.Item>
            <List.Item title={'账号'}>{user.username}</List.Item>

        </List>}
        <Divider></Divider>
        <List>
            <List.Item title={'存货'} onClick={() => { return {} }}>  {stockCount.totalCount} 批</List.Item>
            <List.Item title={'总库存'} onClick={() => { return {} }}>  {stockCount.totalWeight} kg</List.Item>

        </List>
        <div style={{ position: 'fixed', left: 0, bottom: '80px', width: '100%' }}>
            <Button color='danger' block onClick={logout} >注销</Button>
        </div>
    </div>
}