import {
    Row,
    Col,
    Card,


} from 'antd'

import ReactECharts from 'echarts-for-react';


export const Chart1 = () => {

    const options = {
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
    };

    return (

        <div>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Card size="small" title="Chart1">
                        <ReactECharts option={options} />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
