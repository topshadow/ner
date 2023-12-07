'use client'
import { RbacUser } from "@prisma/client";
import { Button, Divider, List, NavBar } from "antd-mobile";
import { useEffect, useState } from "react"
import { productApi, userApi } from "./platform/mobile/actions";
import { getToken } from "@/shared/auth";
import { useRouter } from "next/navigation";

export function MobileCenterPage() {
    const [user, setUser] = useState<RbacUser>();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useRouter();
    const logout = () => {
        localStorage.clear();
        navigate.push('/passport/login')

    }
    const [stockCount, setStockCount] = useState({ totalWeight: 0, totalCount: 0 });
    const [companyStockCount, setCompanyStockCount] = useState({ totalWeight: 0, totalCount: 0 });
    
    const loadUserInfo = () => {
        userApi.loadUserInfo(getToken()).then(res => setUser(res as any));
    }
    const loadUserProducts = () => {
        userApi.loadUserStockCount(getToken()).then(res => setStockCount(res as any));
    }
    const loadCompanyProducts=()=>{
        userApi.loadCompanyStockCount(getToken()).then(res=>setCompanyStockCount(res as any))
    }
    useEffect(() => {
        loadUserInfo();
        loadUserProducts();
        userApi.isAdmin(getToken()).then(res=>{setIsAdmin(res);if(res){loadCompanyProducts()} } );
    }, []);
    return <div>
        <NavBar back={null}>
            个人中心
        </NavBar>
        {user && <List>
            <List.Item title={'昵称'}>{user.nickname}</List.Item>
            <List.Item title={'账号'}>{user.username}</List.Item>

        </List>}
        <Divider >我的存货</Divider>
        <List >
            <List.Item title={'存货'} onClick={() => { return {} }}>  {stockCount.totalCount} 批</List.Item>
            <List.Item title={'总库存'} onClick={() => { return {} }}>  {stockCount.totalWeight} kg</List.Item>

        </List>
        <div style={{ position: 'fixed', left: 0, bottom: '80px', width: '100%' }}>
            <Button color='danger' block onClick={logout} >注销</Button>
        </div>
        {isAdmin && <><Divider>所有存货</Divider>
        <List >
            <List.Item title={'总存货'} onClick={() => { return {} }}>  {companyStockCount.totalCount} 批</List.Item>
            <List.Item title={'公司总库存'} onClick={() => { return {} }}>  {companyStockCount.totalWeight} kg</List.Item>
        </List></>}
    </div>
}