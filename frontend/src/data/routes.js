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
                name: 'line',
                key: 3,
                path: '/echart/line',
                authority: [''],
                title: 'Line',
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