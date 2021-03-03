import React from 'react';
import { Layout, Row, Col } from 'antd';
import './MainLayout.style.scss'
import { MainFooter } from '../components/Footer/Footer.component'
import { SideMenu } from '../components/Sidebar/Menu.component'
import Toolbar from '../components/Header/Toolbar.component'


const { Header, Content } = Layout;

export const MainLayout = props => {

    const { children } = props;


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ padding: '0 20px' }}>
                <Row justify="space-between">
                    <Col flex="200px">
                        <div className='logo-title'>
                            <span className='logo-title-platform'>Echart Demo</span>
                        </div>
                    </Col>
                    <Col flex="84px">
                        <Toolbar />
                    </Col>
                </Row>
            </Header>
            <Layout>
                <SideMenu />
                <Layout
                    style={{
                        padding: '0 0 24px 24px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >

                    <Content style={{ padding: '0 24px', marginTop: 24 }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
            <MainFooter />
        </Layout>
    )
}
