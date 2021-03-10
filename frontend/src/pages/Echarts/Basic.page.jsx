import {
    Row,
    Col,
} from 'antd'

import '../Pages.style.scss'

import { ChartCard } from '../../components/Chart/Chart.card'
import { BasicChartWithDataSet } from '../../components/Chart/Basic.chart'
const option1 = {
    grid: { top: 35, right: 8, bottom: 24, left: 50 },
    title: {
        text: 'Basic Line Chart',
        left: 'center'

    },
    xAxis: {
        type: 'value',
    },
    yAxis: {
        type: 'value'
    },
    chartType: {
        colType: 'line',
        smooth: false,
    },
    url: '/chart/basic/type1',

}

const option2 = {
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    title: {
        text: 'Smoothed Line Chart',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis'
    },
    toolbox: {
        feature: {
            magicType: { show: true, type: ['stack', 'tiled'] },
            saveAsImage: { show: true }
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
    },
    yAxis: {
        type: 'value'
    },
    chartType: {
        colType: 'line',
        smooth: true,
    },
    url: '/chart/basic/type2',

}


export const BasicChartContainer = () => {


    return (

        <div style={{ padding: 20 }}>
            <Row justify="space-around" gutter={[12, 12]}>
                <Col span={12}>
                    <ChartCard
                        options={option1}
                    >
                    </ChartCard>
                </Col>

                <Col span={12} >
                    <ChartCard
                        options={option2}
                    >
                    </ChartCard>
                </Col>

                <Col span={12} >

                    <BasicChartWithDataSet
                        config={{ smooth: true }}
                        url="/chart/basic/type3"
                        dataset={
                            [{
                                id: 'dataset_since_1950_of_germany',
                                fromDatasetId: 'dataset_raw',
                                transform: {
                                    type: 'filter',
                                    config: {
                                        and: [
                                            { dimension: 'Year', gte: 1950 },
                                            { dimension: 'Country', '=': 'Germany' }
                                        ]
                                    }
                                }
                            }, {
                                id: 'dataset_since_1950_of_france',
                                fromDatasetId: 'dataset_raw',
                                transform: {
                                    type: 'filter',
                                    config: {
                                        and: [
                                            { dimension: 'Year', gte: 1950 },
                                            { dimension: 'Country', '=': 'France' }
                                        ]
                                    }
                                }
                            }]
                        }
                    />

                </Col>
            </Row>
        </div>
    )
}
