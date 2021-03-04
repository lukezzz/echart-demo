import {
    HomeOutlined,
    BgColorsOutlined,
    PieChartOutlined,
} from '@ant-design/icons'

const routeData = [
    {
        name: 'echart',
        key: 2,
        path: '/echart',
        authority: [''],
        title: 'Echart',
        exact: false,
        icon: <PieChartOutlined />,
        sub: [
            {
                name: 'chart1',
                key: 3,
                path: '/echart/chart1',
                authority: [''],
                title: 'Chart1',
                exact: false,
                icon: <PieChartOutlined />,
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