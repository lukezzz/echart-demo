import { Layout, Menu } from 'antd';

import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined

} from '@ant-design/icons'

const { Sider } = Layout;


export const SideMenu = () => {

    return (
        <Sider style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
        }}>
            <div className="logo" />
            <Menu mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    nav 1
            </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    nav 2
            </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                    nav 3
            </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined />}>
                    nav 4
            </Menu.Item>
            </Menu>
        </Sider>
    )
}
