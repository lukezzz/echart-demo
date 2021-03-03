import {
    HomeOutlined,
    BgColorsOutlined,
    PieChartOutlined,
} from '@ant-design/icons'

const routeData = [
    {
        name: 'home',
        key: 1,
        path: '/',
        authority: [''],
        title: 'Styles',
        icon: <BgColorsOutlined />,
        sub: []
    },
    {
        name: 'echart',
        key: 2,
        path: '/echart',
        authority: [''],
        title: 'Echart',
        icon: <PieChartOutlined />,
        sub: [
            {
                name: 'chart1',
                key: 3,
                path: '/echart/chart1',
                authority: [''],
                title: 'Chart1',
                icon: <PieChartOutlined />,
            }
        ]
    }
]

export default routeData