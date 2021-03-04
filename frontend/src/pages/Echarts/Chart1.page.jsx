import {
    Row,
    Col,
    Card,


} from 'antd'

import { BarChart } from '../../components/Chart/Bar.chart'

const data = {
    'Matcha Latte': [
        {
            name: '2015',
            value: 89.3
        },
        {
            name: '2016',
            value: 95.8
        },
        {
            name: '2017',
            value: 97.7
        },
    ],
    'Milk Tea': [
        {
            name: '2015',
            value: 92.1
        },
        {
            name: '2016',
            value: 89.4
        },
        {
            name: '2017',
            value: 83.1
        },
    ],
    'Cheese Cocoa': [
        {
            name: '2015',
            value: 94.4
        },
        {
            name: '2016',
            value: 91.2
        },
        {
            name: '2017',
            value: 92.5
        },
    ],
    'Walnut Brownie': [
        {
            name: '2015',
            value: 85.4
        },
        {
            name: '2016',
            value: 76.9
        },
        {
            name: '2017',
            value: 78.1
        },
    ],

}



export const Chart1 = () => {




    return (

        <div>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Card size="small" title="Chart1">
                        <BarChart
                            data={data}
                        />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
