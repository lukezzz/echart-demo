import {
    Row,
    Col,
    Card,
    Button
} from 'antd'
import { LineChart } from '../../components/Chart/Line.chart'
import { useBar } from '../../data/testchart'
// import ReactECharts from 'echarts-for-react'
import React, { useState, useEffect, useRef } from 'react'
// import useECharts from '../../components/Chart/useECharts'
import * as echarts from "echarts";

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}

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
const data2 = {
    'Matcha Latte2': [
        {
            name: '2015',
            value: 89.3
        },
        {
            name: '2016',
            value: 95.8
        },
        {
            name: '2019',
            value: 97.7
        },
    ],
    'Milk Tea2': [
        {
            name: '2015',
            value: 92.1
        },
        {
            name: '2016',
            value: 89.4
        },
        {
            name: '2019',
            value: 83.1
        },
    ],
    'Cheese Cocoa2': [
        {
            name: '2015',
            value: 94.4
        },
        {
            name: '2016',
            value: 91.2
        },
        {
            name: '2019',
            value: 92.5
        },
    ],
    'Walnut Brownie2': [
        {
            name: '2015',
            value: 85.4
        },
        {
            name: '2016',
            value: 76.9
        },
        {
            name: '2019',
            value: 78.1
        },
    ],

}

const options = {
    title: {
        text: '堆叠区域图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销', '联盟广告', '视频广告']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [150, 232, 201, 154, 190, 330, 410]
        }
    ]
}
const options2 = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
        data: ['销量']
    },
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
}


export const LineChartContainer = () => {

    return (

        <div>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Card size="small" title="Chart1" >
                        <LineChart chartType='type2' />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="Chart2" >
                        <LineChart chartType='type3' />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
