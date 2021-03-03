import { Layout, Menu, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import routeData from '../../Routes.map'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,

} from '@ant-design/icons'
const { Sider } = Layout;
const { SubMenu } = Menu;


export const SideMenu = () => {

    const [collapsed, setCollapsed] = useState(false)

    // active currrent menu
    const location = useLocation()
    const [curKey, setCurKey] = useState([1])


    useEffect(() => {

        let curMenuItem = routeData.find(item => item.path === location.pathname)
        if (curMenuItem) {
            setCurKey([curMenuItem.id])
        }

    }, [location.pathname])


    const onSelect = key => {
        // console.log(key.selectedKeys)
        setCurKey(key.selectedKeys)
    }

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    const clickCollapse = () => {
        setCollapsed(!collapsed);
    }

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            trigger={null}
            width={200}>
            {/* {collapsed ?
                <Button onClick={clickCollapse} style={{ marginBottom: 16 }}><MenuFoldOutlined /></Button>
                :
                <Button onClick={clickCollapse} style={{ marginBottom: 16 }}><MenuUnfoldOutlined /></Button>

            } */}
            <Menu
                mode="inline"
                defaultSelectedKeys={['4']}
                style={{ height: '100%', borderRight: 0 }}
            >
                {
                    routeData.map(menu =>
                        menu.sub.length === 0 ?
                            <Menu.Item
                                key={menu.key}
                                icon={menu.icon}
                            >
                                {menu.title} < Link to={menu.path} />
                            </Menu.Item>
                            :
                            <SubMenu
                                key="sub1"
                                icon={menu.icon}
                                title={menu.title}>
                                {
                                    menu.sub.map(sub =>
                                        <Menu.Item
                                            key={sub.key}
                                            icon={sub.icon}>
                                            {sub.title} < Link to={sub.path} />
                                        </Menu.Item>
                                    )
                                }

                            </SubMenu>
                    )
                }
            </Menu>
        </Sider>
    )
}
