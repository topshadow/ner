'use client'
import { Button, CheckList, Form, Input, List, NavBar, Popup, Switch } from "antd-mobile";
import { userApi } from "./platform/mobile/actions";
import { getToken } from "@/shared/auth";
import { useEffect, useState } from "react";
import { RbacUser } from "@prisma/client";
import { messageHandle } from "@/shared/handle";

export function MobileUserPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<RbacUser[]>([]);
    const [checkIds, setCheckIds] = useState<string[]>([]);
    const [addUserVisible, setAddUserVisible] = useState(false);
    const [userDetailVisible, setUserDetailVisible] = useState(false);
    const [userModifyVisible, setUserModifyVisible] = useState(false);
    


    const reloadAdmin = () => {
        userApi.isAdmin(getToken()).then(res => setIsAdmin(res));
    }
    const reloadUsers = () => {
        userApi.loadUsers(getToken()).then(res => {
            setUsers(res);
        });
    }
    useEffect(() => {
        reloadAdmin();
        reloadUsers();
    }, [])

    return <><NavBar back={null}>
        用户列表
    </NavBar>
        {isAdmin && <CheckList value={checkIds} onChange={setCheckIds}>
            {users.map(u => <CheckList.Item key={u.id} value={u.id}>
                {u.nickname}
            </CheckList.Item>)}

        </CheckList>}
        <div style={{ position: 'fixed', bottom: '80px', width: '100%' }}>
            {checkIds.length > 0 && isAdmin && <Button block color={'primary'} onClick={() => setUserDetailVisible(true)} style={{ marginBottom: '20px' }}>查看</Button>}
            {checkIds.length > 0 && isAdmin && <Button onClick={()=>setUserModifyVisible(true)} block color={'warning'} style={{ marginBottom: '20px' }}>修改</Button>}
            {isAdmin && <Button block color={'primary'} onClick={() => setAddUserVisible(true)}>新增</Button>}
            {addUserVisible && <AddUserPage onClose={() => { setAddUserVisible(false); reloadUsers() }}></AddUserPage>}
            {checkIds.length > 0 && userDetailVisible && <UserDetailPage userId={checkIds[0]} close={() => setUserDetailVisible(false)}></UserDetailPage>}
            {checkIds.length > 0 && userModifyVisible && <UserModifyPage userId={checkIds[0]} close={() => {setUserModifyVisible(false);reloadUsers()} }></UserModifyPage>}
        </div>
    </>
}

export function AddUserPage(props: { onClose: Function }) {
    const submit = (e) => {
        userApi.addUser({ ...e }, getToken()).then(res => messageHandle(res)).then(res => {
            if (res.ok) {
                props.onClose();
            }
        })
    }
    return <Popup visible={true} bodyStyle={{ height: '100vh' }}>
        <NavBar back={'返回'} onBack={props.onClose}>
            新增用户
        </NavBar>
        <Form onFinish={submit} >
            <Form.Item
                name='nickname'
                label='昵称'
                childElementPosition='normal'
                rules={[{ required: true, message: '昵称必填' }]}

            >
                <Input onChange={console.log} placeholder='名称' />

            </Form.Item>
            <Form.Item
                name='username'
                label='账号/手机号'
                childElementPosition='normal'
                rules={[{ required: true, message: '账号/手机号必填' }]}

            >
                <Input onChange={console.log} placeholder='账号/手机号' />

            </Form.Item>
            <Form.Item
                name='password'
                label='密码'
                childElementPosition='normal'
                rules={[{ required: true, message: '密码必填' }]}
            >
                <Input type={'password'} onChange={console.log} placeholder='密码' />

            </Form.Item>
            <Form.Item
                name='is_admin'
                label='是否管理员'
                childElementPosition='normal'
            >
                <Switch defaultChecked={false} />

                <Button style={{ position: 'fixed', left: 0, bottom: '40px', width: '100%' }} block color={'primary'} type={'submit'}>提交</Button>
            </Form.Item>
        </Form>
    </Popup>
}
export function UserDetailPage(props: { userId: string, close: Function }) {
    const [user, setUser] = useState<RbacUser>();
    const loadUserDetail = () => {
        userApi.loadUserInfoById(props.userId).then(res => {
            setUser(res);
        });
    }
    useEffect(() => {
        loadUserDetail();
    }, [])

    return <Popup visible={true} bodyStyle={{ height: '100vh' }}>

        <NavBar back={'返回'} onBack={props.close}>
            用户详情
        </NavBar>
        <List>
            <List.Item title={'姓名'}>{user?.nickname}</List.Item>
            <List.Item title={'账号'}>{user?.username}</List.Item>
            <List.Item title={'密码'}>{user?.password}</List.Item>
            <List.Item title={'是否管理员'}>
            <Switch defaultChecked={user?.is_admin||false}  disabled />

            </List.Item>
        </List>
    </Popup>
}

export async function UserModifyPage(props: { userId: string, close: Function }) {
    const [user,setUser]=useState(null);
    const reloadUserInfo=()=>{
        userApi.loadUserInfoById(props.userId).then(res=>setUser(res));
    }
    useEffect(()=>{
        reloadUserInfo();
    },[])
    const submit=(e)=>{
        userApi.updateUserInfo({...e,id:props.userId},getToken()).then(res=>messageHandle(res)).then(res=>{
            if(res.ok){
                props.close();
            }
        })

    }
    return <Popup visible={true} bodyStyle={{ height: '100vh' }}>
        <NavBar back={'返回'} onBack={props.close}>
            修改用户信息
        </NavBar>
       {user&& <Form onFinish={submit} initialValues={user}>
            <Form.Item
                name='nickname'
                label='昵称'
                childElementPosition='normal'
                rules={[{ required: true, message: '昵称必填' }]}

            >
                <Input onChange={console.log} placeholder='名称' />

            </Form.Item>
            <Form.Item
                name='username'
                label='账号/手机号'
                childElementPosition='normal'
                rules={[{ required: true, message: '账号/手机号必填' }]}

            >
                <Input onChange={console.log} placeholder='账号/手机号' />

            </Form.Item>
            <Form.Item
                name='password'
                label='密码'
                childElementPosition='normal'
                rules={[{ required: true, message: '密码必填' }]}
            >
                <Input type={'password'} onChange={console.log} placeholder='密码' />

            </Form.Item>
            <Form.Item
                name='is_admin'
                label='是否管理员'
                childElementPosition='normal'
            >
              a:  {user.is_admin}
                <Switch defaultChecked={user.is_admin} />

                <Button style={{ position: 'fixed', left: 0, bottom: '40px', width: '100%' }} type='submit' block color={'primary'} type={'submit'}>提交</Button>
            </Form.Item>
        </Form>}
    </Popup>
}