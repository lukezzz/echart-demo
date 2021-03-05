import {
    Row,
    Col,
    Button,
    Card,
    Typography,
    Pagination,
    Checkbox,
    DatePicker,
    Modal,
    notification,
    Space,
    message,
    Drawer,
    Alert,
    Spin,
    Tag,
    Divider,
    Table,
    Badge,
    Switch

} from 'antd'
import React, { useState } from 'react'
import {
    LoadingOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';


const { Title } = Typography;
const { RangePicker } = DatePicker;

const openNotificationWithIcon = type => {
    notification[type]({
        message: 'Notification Title',
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

export const Home = () => {

    const { t } = useTranslation();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const success = () => {
        message
            .loading('Action in progress..', 2.5)
            .then(() => message.success('Loading finished', 2.5))
            .then(() => message.error('Loading finished is finished', 2.5));
    };

    const [drawVisible, setDrawVisible] = useState(false);
    const showDrawer = () => {
        setDrawVisible(true);
    };
    const onClose = () => {
        setDrawVisible(false);
    };


    const [show, setShow] = useState(true);

    return (

        <div>
            <Row gutter={[12, 12]}>
                <Col span={6}>
                    <Card size="small" title="Button">
                        <Button type="primary">Primary Button</Button>
                        <Button>Default Button</Button>
                        <Button type="dashed">Dashed Button</Button>
                        <br />
                        <Button type="text">Text Button</Button>
                        <Button type="link">Link Button</Button>
                        <Button danger type="primary">Danger</Button>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Title">
                        <Title>{t('Welcome to React')}</Title>
                        <Title level={2}>h2. {t('Welcome to React')}</Title>
                        <Title level={3}>h3. {t('Welcome to React')}</Title>
                        <Title level={4}>h4. {t('Welcome to React')}</Title>
                        <Title level={5}>h5. {t('Welcome to React')}</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Pagination">
                        <Pagination defaultCurrent={1} total={50} showSizeChanger />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Checkbox">
                        <Checkbox onChange={e => console.log(e.target.checked)}>Checkbox</Checkbox>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="DatePicker">
                        <RangePicker showTime />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Message">
                        <Button onClick={success}>Display sequential messages</Button>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Alert">
                        <Alert
                            message="Success Tips"
                            description="Detailed description and advice about successful copywriting."
                            type="success"
                            showIcon
                            closable
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Notification">
                        <Space>
                            <Button onClick={() => openNotificationWithIcon('success')}>Success</Button>
                            <Button onClick={() => openNotificationWithIcon('info')}>Info</Button>
                            <Button onClick={() => openNotificationWithIcon('warning')}>Warning</Button>
                            <Button onClick={() => openNotificationWithIcon('error')}>Error</Button>
                        </Space>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Modal">
                        <Button type="primary" onClick={showModal}>Open Modal</Button>
                        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Modal>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Draw">
                        <Button type="primary" onClick={showDrawer}>Open</Button>
                        <Drawer
                            title="Basic Drawer"
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            visible={drawVisible}
                            width={500}
                        >
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Drawer>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Loading">
                        <Spin indicator={antIcon} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Badge">
                        <Space>
                            <Switch
                                checked={show}
                                onChange={() => {
                                    setShow(!show);
                                }}
                            />
                            <Badge count={show ? 25 : 0} />
                            <Badge count={show ? <ClockCircleOutlined style={{ color: '#f5222d' }} /> : 0} />
                            <Badge count={show ? 4 : 0} className="site-badge-count-4" />
                            <Badge
                                className="site-badge-count-109"
                                count={show ? 109 : 0}
                                style={{ backgroundColor: '#52c41a' }}
                            />
                        </Space>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Draw">
                        <Divider orientation="left">Custom</Divider>
                        <div>
                            <Tag color="#f50">#f50</Tag>
                            <Tag color="#2db7f5">#2db7f5</Tag>
                            <Tag color="#87d068">#87d068</Tag>
                            <Tag color="#108ee9">#108ee9</Tag>
                        </div>
                        <Divider orientation="left">With icon</Divider>
                        <div>
                            <Tag icon={<CheckCircleOutlined />} color="success">success</Tag>
                            <Tag icon={<SyncOutlined spin />} color="processing">processing</Tag>
                            <Tag icon={<CloseCircleOutlined />} color="error">error</Tag>
                            <Tag icon={<ExclamationCircleOutlined />} color="warning">warning</Tag>
                            <Tag icon={<ClockCircleOutlined />} color="default">waiting</Tag>
                            <Tag icon={<MinusCircleOutlined />} color="default">stop</Tag>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="Draw">
                        <Table columns={columns} dataSource={data} />
                    </Card>
                </Col>
            </Row>

        </div >
    )
}
