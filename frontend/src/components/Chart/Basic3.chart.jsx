import React, { useEffect, useState, useRef } from 'react'
import {
    Spin
} from 'antd'

import ReactECharts from 'echarts-for-react';



import { useFetch } from '../../data/testchart'


const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}


export const BasicChart3 = ({ chartRef, config, url }) => {
    // const [config, setConfig] = useState(chartInitOpt)

    const [option, setOption] = useState(chartInitOpt)
    const [loading, setLoading] = useState(true)

    const { smooth } = config

    const { data, isLoading, isError } = useFetch(url);
    // if (isError) return <div>failed to load</div>;


    const configOption = data => {

        let options = chartInitOpt
        options.xAxis = {
            data: data.category
        }

        let series = []
        Object.keys(data.data).forEach(key => {
            series.push({
                name: key,
                type: 'line',
                // stack: '总量',
                // areaStyle: { normal: {} },
                smooth: smooth,
                data: data.data[key]
            })
        })

        options.series = series
        return options
    }

    useEffect(() => {

        if (data) {
            console.log("chart option updated", data);
            setOption(configOption(data))
        }

    }, [data]);




    return (
        <Spin spinning={isLoading} >
            <ReactECharts
                option={option}
                notMerge={true}
                lazyUpdate={false}
                ref={chartRef}
                //   theme={"theme_name"}
                //   onChartReady={this.onChartReadyCallback}
                //   onEvents={EventsDict}
                opts={option}
            />
        </Spin>
    )
}
