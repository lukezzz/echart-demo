import {
    LineChartOutlined,
    BgColorsOutlined,
    DashboardOutlined,
    LayoutOutlined,
    TableOutlined
} from '@ant-design/icons'

const routeData = [
    {
        name: 'echart',
        key: 2,
        path: '/echart',
        authority: [''],
        title: 'Echart',
        exact: false,
        icon: <DashboardOutlined />,
        sub: [
            {
                name: 'basic',
                key: 2.1,
                path: '/echart/basic',
                authority: [''],
                title: 'Demo',
                exact: false,
                icon: <LineChartOutlined />,
            }
        ]
    },
    {
        name: 'topology',
        key: 3,
        path: '/topo',
        authority: [''],
        title: 'Topology',
        exact: false,
        icon: <DashboardOutlined />,
        sub: [
            {
                name: 'next',
                key: 3.1,
                path: '/topo/next',
                authority: [''],
                title: 'Next',
                exact: false,
                icon: <LineChartOutlined />,
            }
        ]
    },
    {
        name: 'layout',
        key: 4,
        path: '/layout',
        authority: [''],
        title: 'Layout',
        exact: false,
        icon: <LayoutOutlined />,
        sub: [
            {
                name: 'grid',
                key: 5,
                path: '/layout/grid',
                authority: [''],
                title: 'Demo',
                exact: false,
                icon: <TableOutlined />,
            }
        ]
    },
    {
        name: 'home',
        key: 1,
        path: '/',
        authority: [''],
        title: 'Styles',
        icon: <BgColorsOutlined />,
        exact: false,
        sub: []
    }
]

export default routeData