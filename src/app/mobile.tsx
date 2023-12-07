'use client'

import { checkLogin } from "@/shared/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



import React, { useState } from 'react'
import { Badge, List, TabBar, Image, FloatingBubble, Button, Popup, Space, Form, Switch, Stepper, Input, TextArea, Selector, Tag, NavBar, Card, Divider, Tabs } from 'antd-mobile'
import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
    AddCircleOutline,
    TeamFill,
    TeamOutline,
    CheckCircleOutline,
    CloseCircleOutline
} from 'antd-mobile-icons'
import { WmsStockUser, getToken } from "./platform/mobile/utils"
import { stockApi, productApi, userApi } from "./platform/mobile/actions"
import { StockTypesOptions, StockTypesToLabel } from "@/shared/types"
import { WmsProduct, WmsStock, WmsStockDetail } from "@prisma/client"
import { messageHandle } from "@/shared/handle"
import { ProductPage } from "./mobilePage"
import { MobileUserPage } from "./mobileUserPage"
import { MobileCenterPage } from "./mobileCenterPage"
import res from "antd-mobile-icons/es/AaOutline"
import { isAdmin } from "./platform/mobile/actions/user"

export default () => {
    const [activeKey, setActiveKey] = useState('home')
    const [visible, setVsible] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (!checkLogin()) {
            router.push('/passport/login');
        }
    }, [])
    const tabs = [
        {
            key: 'home',
            title: '首页',
            icon: <AppOutline />,
            badge: Badge.dot,
        },
        {
            key: 'product',
            title: '产品列表',
            icon: <UnorderedListOutline />,
            badge: '5',
        },
        {
            key: 'user',
            title: '用户',
            icon: (active: boolean) =>
                active ? <TeamFill /> : <TeamOutline />,
            badge: '99+',
        },
        {
            key: 'center',
            title: '我的',
            icon: <UserOutline />,
        },
    ]
    let component = null;
    switch (activeKey) {
        case 'home':
            component = <HomePage></HomePage>
            break;
        case 'product':
            component = <ProductPage></ProductPage>
            break;
        case 'user':
            component = <MobileUserPage></MobileUserPage>
            break;
        case 'center':
            component = <MobileCenterPage></MobileCenterPage>
            break;

    }


    const onClick = () => {
        console.log('on click')
        setVsible(true)
    };

    return (
        <>
            <div style={{ paddingBottom: '50px' }}>
                {!visible && component}
            </div>
            {visible && <AddStockPage visible={visible} setVisible={() => { setVsible(false); }}   ></AddStockPage>}
            <div style={{ position: 'fixed', bottom: 0, zIndex: 1000, left: 0, width: '100%', marginTop: '60px' }}>
                {activeKey == 'home' && <FloatingBubble
                    style={{
                        '--initial-position-bottom': '64px',
                        '--initial-position-right': '24px',
                        '--edge-distance': '24px',
                    }}
                    onClick={onClick}
                >
                    <AddCircleOutline
                        fontSize={32} />
                </FloatingBubble>}
                <TabBar activeKey={activeKey} onChange={setActiveKey} >
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
        </>
    )
}


function HomePage() {
    const [selectedRecordId, setSelectedRecordId] = React.useState("");
    const [stocks, setStockts] = useState([] as WmsStockUser[]);
    const [activeKey,setActiveKey]=useState<'all'|'true'|'false'>('all')
    const reload = () => {
        stockApi.listUserStock(activeKey, getToken()).then((res) => {
            setStockts(res);
        });
    };
    useEffect(() => {
        if (checkLogin()) {
            reload();
        } else {
        }
    }, []);
    useEffect(()=>{
        reload()
    },[activeKey])

    const list = <List header='库存列表' style={{ paddingBottom: '100px' }} >
        {selectedRecordId && <StockDetail stockId={selectedRecordId} cancel={() => setSelectedRecordId('')}></StockDetail>}
        {stocks.map(stock => (
            <>
            <Divider></Divider>
            <div style={{textAlign:'center',padding:'10px'}}><Tag color={stock.is_lock?'default':'success'}>{stock.is_lock?'已封账':'激活'}</Tag></div>
            <List.Item

                key={stock.id}
                prefix={
                    <><Image
                        src={stock.ownerUser?.avatar || 'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'}
                        style={{ borderRadius: 20 }}
                        fit='cover'
                        width={40}
                        height={40}
                    />
                       <span style={{fontSize:'.8rem'}}> {stock.ownerUser.nickname}</span>
                    </>
                }
                description={<div >
                    <Space>
                        {stock.details.map(s => { return <Tag key={s.id} round>{StockTypesToLabel(s.type as any) + ' ' + s.num + ' kg'}</Tag> })}
                    </Space>
                </div>}
                onClick={() => { setSelectedRecordId(stock.id); return {} }}
            >
                {new Date(stock.created_at).toLocaleString()}
                <Tag round color='success'>
                    {stock.product.name}
                </Tag>

                <Tag round color='#2db7f5'>
                    {stock.num}kg
                </Tag>

            </List.Item>
            </>
        ))}
    </List>;
    return <>
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
            <Tabs.Tab title='全部' key='all'>
                {list}
            </Tabs.Tab>
            <Tabs.Tab title='激活' key='false'>
                {list}
            </Tabs.Tab>
            <Tabs.Tab title='已封账' key='true'>
                {list}
            </Tabs.Tab>
        </Tabs>

    </>
}



function AddStockPage(props: { visible: boolean, setVisible: () => void }) {
    const { visible, setVisible } = props;
    const [products, setProducts] = useState<WmsProduct[]>([]);
    useEffect(() => {
        productApi.listProduct(getToken()).then(res => {
            console.log(res)
            setProducts(res)
        })
    }, []);

    const submit = (e: any) => stockApi.createUserStock({ ...e, product_id: e.product_id[0], type: e.type[0] }, getToken()).then(res => messageHandle(res)).then(res => res.ok ? props.setVisible() : null);
    return (
        <>
            <Popup
                visible={visible}
                onMaskClick={() => {
                    setVisible()
                }}
                bodyStyle={{ height: '100vh' }}
            >
                {/* <div style={{ padding: '24px' }}> */}
                <Form
                    layout='horizontal'
                    footer={
                        <>
                            <Button block type='submit' color='primary' size='large'>
                                提交
                            </Button>
                            <Button block style={{ marginTop: '30px' }} color='success' onClick={setVisible} size='large'>
                                返回
                            </Button>
                        </>
                    }
                    onFinish={submit}
                >
                    <Form.Header>新增进货记录</Form.Header>
                    <Form.Item
                        name='num'
                        label='重量'
                        rules={[{ required: true, message: '重量必填' }]}
                    >
                        <Stepper min={0.01} step={0.1} defaultValue={0.1} formatter={value => `${value}公斤`}
                            parser={text => parseFloat(text.replace('公斤', ''))}

                        />
                    </Form.Item>
                    <Form.Item name='product_id' label='品种' help='产品种类'>

                        <Selector multiple={false} options={products?.map(p => { return { label: p.name, value: p.id } })}></Selector>
                    </Form.Item>
                    <Form.Item name='type' label='方式' childElementPosition='normal'>
                        <Selector options={StockTypesOptions}></Selector>

                    </Form.Item>
                    <Form.Item
                        name='note'
                        label='备注'
                        childElementPosition='normal'
                    >
                        <TextArea rows={5} onChange={console.log} placeholder='备注' />

                    </Form.Item>
                </Form>
                {/* </div> */}
            </Popup>
            {/* <Popup
          visible={visible2}
          onMaskClick={() => {
            setVisible2(false)
          }}
          bodyStyle={{ height: '20vh' }}
        >
          <div style={{ padding: '24px' }}>
            <div>这是弹出层2</div>
          </div>
        </Popup> */}
        </>
    )
}



function StockDetail(props: { stockId: string, cancel: () => void }) {
    const [visible, setVisible] = useState(!!props.stockId);
    const [stock, setStock] = useState<WmsStockUser>();
    const [addStockDetailVisible, setAddStockDetailVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const reload = () => {
        stockApi.stockDetail(props.stockId, getToken()).then(res => {
            setStock(res as any)
        });
        userApi.isAdmin(getToken()).then(res => setIsAdmin(res));
    }
    useEffect(() => {
        reload();

    }, []);
    const toggleLock = async (is_lock: boolean) => {
        await stockApi.toggleStockLock(props.stockId, is_lock).then(messageHandle);
        await reload();
    }

    return <Popup
        visible={visible}
        onMaskClick={() => {
            setVisible(false)
        }}
        bodyStyle={{ height: '100vh' }}
    >
        <NavBar back='返回' onBack={props.cancel}>
            库存详情  {stock?.is_lock == true ? <div style={{ color: 'red' }}><CloseCircleOutline />已封账</div> : <div style={{ color: 'lightgreen' }} ><CheckCircleOutline />有效激活</div>}
        </NavBar>
        {stock && <h1 style={{ textAlign: 'center', color: 'gray' }}>{stock.product.name}</h1>}
        {stock && <Card title={<>            <Tag color='primary'>    {stock.product.name}</Tag>
            {new Date(stock?.created_at).toLocaleDateString()}</>} >

            <span style={{ color: 'gray' }}>  原始重量</span>: {stock.origin_num} kg
        </Card>}
        <Divider />

        {stock?.details.map(d => {
            return <><Card key={d.id} title={<><Tag color="success">{StockTypesToLabel(d.type as any)}</Tag> {new Date(d.created_at).toLocaleDateString()} </>} >
                <span style={{ color: 'gray' }}> 类型</span>:{StockTypesToLabel(d.type as any)}
                <br />
                <span style={{ color: 'gray' }}> 重量</span>: {d.num}kg

            </Card>
                <Divider />
            </>
        })}

        {stock?.is_lock != true && <FloatingBubble
            style={{
                '--initial-position-bottom': '84px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
            }}
            onClick={() => setAddStockDetailVisible(true)}
        >
            <AddCircleOutline
                fontSize={32} />
        </FloatingBubble>}

        <div style={{ position: 'fixed', left: 0, bottom: '40px', width: '100%' }}>
            {stock?.is_lock != true && isAdmin && <Button block color="primary" onClick={() => { toggleLock(true) }}>封账</Button>}
            {stock?.is_lock && isAdmin && <Button block color="primary" onClick={() => toggleLock(false)}>解封</Button>}
        </div>
        {addStockDetailVisible && <AddStockDetail close={() => { setAddStockDetailVisible(false); reload() }} stockId={stock?.id}></AddStockDetail>}
    </Popup>
}

/**新增入库详情 */
function AddStockDetail(props: { stockId?: string, close: () => void }) {
    const submit = (e: any) => {
        console.log(e)
        stockApi.addStockDetail({ stock_id: props.stockId, ...e, type: e.type[0], }, getToken()).then(res => messageHandle(res)).then(res => {
            res.ok ? props.close() : null;
        });
    };

    return <Popup visible={true} bodyStyle={{ height: '100vh' }}
    >
        <Form
            layout='horizontal'
            footer={
                <>
                    <Button block type='submit' color='primary' size='large'>
                        提交
                    </Button>
                    <Button block style={{ marginTop: '30px' }} color='success' onClick={props.close} size='large'>
                        返回
                    </Button>
                </>
            }
            onFinish={submit}
        >
            <Form.Header>新增进货记录</Form.Header>
            <Form.Item
                name='num'
                label='重量'
                rules={[{ required: true, message: '重量必填' }]}
            >
                <Stepper min={0.01} step={0.1} defaultValue={0.1} formatter={value => `${value}公斤`}
                    parser={text => parseFloat(text.replace('公斤', ''))}

                />
            </Form.Item>

            <Form.Item name='type' label='方式' childElementPosition='normal'>
                <Selector options={StockTypesOptions}></Selector>

            </Form.Item>
            <Form.Item
                name='note'
                label='备注'
                childElementPosition='normal'
            >
                <TextArea rows={5} onChange={console.log} placeholder='备注' />

            </Form.Item>
        </Form>
    </Popup>
}


