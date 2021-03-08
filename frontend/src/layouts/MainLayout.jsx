import React from 'react';
import { Layout, Row, Col } from 'antd';
import './MainLayout.style.scss'
import { MainFooter } from '../components/Footer/Footer.component'
// import { SideMenu } from '../components/Sidebar/Menu.component'
import { HeaderMenu } from '../components/Header/Menu.component'
import Toolbar from '../components/Header/Toolbar.component'


const { Header, Content } = Layout;

export const MainLayout = props => {

    const { children } = props;


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: "#1f1f1f" }}>
                <Row type='flex'>
                    <Col flex="200px">
                        <div className='logo-title'>
                            <span className='logo-title-platform'>Echart Demo</span>
                        </div>
                    </Col>
                    <Col flex='auto'>
                        <HeaderMenu />
                    </Col>
                    <Col flex="84px">
                        <Toolbar />
                    </Col>
                </Row>
            </Header>
            {/* <Layout > */}
            {/* <SideMenu /> */}
            <Layout
            // style={{
            //     display: 'flex',
            //     flexDirection: 'column'
            // }}
            >
                <Content style={{ marginTop: 24, width: '100vw' }}>
                    {children}
                </Content>
            </Layout>
            {/* </Layout> */}
            <MainFooter />
        </Layout>
    )
}
