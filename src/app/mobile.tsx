'use client'

import { checkLogin } from "@/shared/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



import React, { useState } from 'react'
import { Badge, List, TabBar, Image, FloatingBubble, Button, Popup, Space, Form, Switch, Stepper, Input, TextArea, Selector, Tag, NavBar, Card, Divider } from 'antd-mobile'
import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
    AddCircleOutline,
    TeamFill,
    TeamOutline
} from 'antd-mobile-icons'
import { WmsStockUser, getToken } from "./platform/mobile/utils"
import { stockApi, productApi } from "./platform/mobile/actions"
import { StockTypesOptions, StockTypesToLabel } from "@/shared/types"
import { WmsProduct, WmsStock, WmsStockDetail } from "@prisma/client"
import { messageHandle } from "@/shared/handle"
import { ProductPage } from "./mobilePage"
import { MobileUserPage } from "./mobileUserPage"
import { MobileUserCenterPage } from "./center"
import { MobileCenterPage } from "./mobileCenterPage"

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
            component= <MobileUserPage></MobileUserPage>
            break;
        case 'center':
            component=<MobileCenterPage></MobileCenterPage>
            break;

    }


    const onClick = () => {
        console.log('on click')
        setVsible(true)
    };

    return (
        <>
            {!visible && component}
            {visible && <AddStockPage visible={visible} setVisible={() => { setVsible(false); }}   ></AddStockPage>}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
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
    const reload = () => {
        stockApi.listUserStock(getToken()).then((res) => {
            setStockts(res);
        });
    };
    useEffect(() => {
        if (checkLogin()) {
            reload();
        } else {
        }
    }, []);
    return <List header='库存列表'>
        {selectedRecordId && <StockDetail stockId={selectedRecordId} cancel={() => setSelectedRecordId(null)}></StockDetail>}
        {stocks.map(stock => (
            <List.Item

                key={stock.id}
                prefix={
                    <Image
                        src={stock.ownerUser?.avatar || ''}
                        style={{ borderRadius: 20 }}
                        fit='cover'
                        width={40}
                        height={40}
                    />
                }
                description={<div >
                    <Space>
                        {stock.details.map(s => { return <Tag key={s.id} round>{StockTypesToLabel(s.type) + ' ' + s.num + ' kg'}</Tag> })}
                    </Space>
                </div>}
                onClick={() => { setSelectedRecordId(stock.id); return {} }}
            >
                {new Date(stock.created_at).toLocaleString()}
                <Tag round color='#2db7f5'>
                    {stock.num}kg
                </Tag>
            </List.Item>
        ))}
    </List>
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

    const submit = (e) => stockApi.createUserStock({ ...e, product_id: e.product_id[0], type: e.type[0] }, getToken()).then(res => messageHandle(res)).then(res => res.ok ? props.setVisible() : null);
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
    const reload = () => {
        stockApi.stockDetail(props.stockId, getToken()).then(res => {
            setStock(res)

        });
    }
    useEffect(() => {
        reload();

    }, [])

    return <Popup
        visible={visible}
        onMaskClick={() => {
            setVisible(false)
        }}
        bodyStyle={{ height: '100vh' }}
    >
        <NavBar back='返回' onBack={props.cancel}>
            库存详情
        </NavBar>
        {stock && <h1 style={{ textAlign: 'center', color: 'gray' }}>{stock.product.name}</h1>}
        {stock && <Card title={<>            <Tag color='primary'>    {stock.product.name}</Tag>
            {new Date(stock?.created_at).toLocaleDateString()}</>} >

            <span style={{ color: 'gray' }}>  原始重量</span>: {stock.origin_num} kg
        </Card>}
        <Divider />

        {stock?.details.map(d => {
            return <><Card key={d.id} title={<><Tag color="success">{StockTypesToLabel(d.type)}</Tag> {new Date(d.created_at).toLocaleDateString()} </>} >
                <span style={{ color: 'gray' }}> 类型</span>:{StockTypesToLabel(d.type)}
                <br />
                <span style={{ color: 'gray' }}> 重量</span>: {d.num}kg

            </Card>
                <Divider />
            </>
        })}

        <FloatingBubble
            style={{
                '--initial-position-bottom': '64px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
            }}
            onClick={() => setAddStockDetailVisible(true)}
        >
            <AddCircleOutline
                fontSize={32} />
        </FloatingBubble>

        {addStockDetailVisible && <AddStockDetail close={() => { setAddStockDetailVisible(false); reload() }} stockId={stock?.id}></AddStockDetail>}
    </Popup>
}

/**新增入库详情 */
function AddStockDetail(props: { stockId?: string, close: () => void }) {
    const submit = (e) => {
        console.log(e)
        stockApi.addStockDetail({ stock_id: props.stockId, ...e, type: e.type[0], }, getToken()).then(res => {
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


