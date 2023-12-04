'use client'
import { Button, CheckList, Form, Input, NavBar, Popup, TextArea, Toast } from "antd-mobile";
import { useEffect, useState } from "react";
import { productApi } from "./platform/mobile/actions";
import { getToken } from "@/shared/auth";
import { WmsProduct } from "@prisma/client";
import { Checklist } from "@mui/icons-material";
import Item from "antd-mobile/es/components/dropdown/item";

export function ProductPage() {
    const [products, setProducts] = useState<WmsProduct[]>([]);
    const [enableIds, setEnableIds] = useState<string[]>([]);
    const [addProductVisible, setAddProductVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');

    const reload = () => {
        productApi.listProduct(getToken()).then(res => setProducts(res));
    }
    useEffect(() => {
        reload();
    }, []);


    return <div>
        <NavBar back={null}>
            产品列表
        </NavBar>
        <CheckList defaultValue={enableIds} onChange={setEnableIds} style={{ paddingBottom: '80px' }}>
            {products.map(p => <CheckList.Item key={p.id} value={p.id}  title={p.name} description={p.note}> </CheckList.Item>)}
            <div style={{ position: 'fixed', bottom: '60px', width: '100%' }}>
                {enableIds.length > 0 && <Button block color='warning' style={{ marginBottom: '20px' }} onClick={() => setSelectedProductId(enableIds[0])} >修改</Button>}
                <Button block color="primary" onClick={() => setAddProductVisible(true)}>新增</Button>
                {addProductVisible && <AddProductPage onClose={() => { setAddProductVisible(false); reload() }}></AddProductPage>}
                {selectedProductId && <ModifyProductPage onClose={()=>{setSelectedProductId('');reload()}} productId={selectedProductId}></ModifyProductPage>}
            </div>
        </CheckList></div>
}

export function AddProductPage(props: { onClose: Function }) {
    const submit = (e) => {
        productApi.addProduct({ ...e }, getToken()).then(res => {
            if (res.ok) {
                Toast.show({ content: res.msg });
                props.onClose();
            }
        })
    }
    return <Popup visible={true} bodyStyle={{ height: '100vh' }}
    >
        <NavBar back={'返回'} onBack={() => props.onClose()}>
            新增产品
        </NavBar>
        <Form onFinish={submit}>
            <Form.Item
                name='name'
                label='名称'
                childElementPosition='normal'
            >
                <Input onChange={console.log} placeholder='名称' />

            </Form.Item>
            <Form.Item
                name='note'
                label='备注'
                childElementPosition='normal'
            >
                <TextArea rows={5} onChange={console.log} placeholder='备注' />

            </Form.Item>
            <Button style={{ position: 'fixed', bottom: '80px', width: '100%' }} block type="submit" color={'primary'}>提交</Button>

        </Form>
    </Popup>
}

export function ModifyProductPage(props: { onClose: Function, productId: string }) {
    const [productDetail, setProductDetail] = useState<WmsProduct>(null);
    const loadDetail = () => {
        productApi.detail(props.productId, getToken()).then(res => setProductDetail(res));
    }
    useEffect(() => {
        loadDetail();
    },[])
    const submit = async (e) => {
        console.log('submit')
       await productApi.update({ ...e,id:props.productId }, getToken()).then(res => {
            if (res.ok) {
                Toast.show({ content: res.msg });
            }
            props.onClose();

        }) 
    }
    return <Popup visible={true} bodyStyle={{ height: '100vh' }}>
        <NavBar back={'返回'} onBack={() => props.onClose()}>
            修改产品
        </NavBar>
        {productDetail && <Form onFinish={submit} initialValues={productDetail}> 
            <Form.Item
                name='name'
                label='名称'
                childElementPosition='normal'
            >
                <Input onChange={console.log} placeholder='名称' />

            </Form.Item>
            <Form.Item
                name='note'
                label='备注'
                childElementPosition='normal'
            >
                <TextArea rows={5} onChange={console.log} placeholder='备注' />

            </Form.Item>
            <Button style={{ position: 'fixed', bottom: '80px', width: '100%' }} block type="submit" color={'primary'}>提交</Button>
        </Form>}

    </Popup>
}