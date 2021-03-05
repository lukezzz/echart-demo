import ReactECharts from 'echarts-for-react'
import useBar from '../../data/testchart'
import {
    Spin
} from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import * as echarts from "echarts";


const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}


const BasicChart = ({ chartRef, chartType }) => {
    const { data, isLoading, isError } = useBar(chartType);
    const [options, setOptions] = useState(chartInitOpt)
    const [loading, setLoading] = useState(isLoading)

    let chartInstance = null;

    const renderChart = () => {
        const renderedInstance = echarts.getInstanceByDom(chartRef.current);
        if (renderedInstance) {
            chartInstance = renderedInstance;
        } else {
            chartInstance = echarts.init(chartRef.current);
        }
        chartInstance.setOption(options);

        chartInstance.on("click", function (params) {
            console.log("params：", params);
        });
    }

    useEffect(() => {
        console.log(data)
        if (data) {
            let series = []
            Object.keys(data.data).forEach(key => {
                series.push({
                    name: key,
                    type: chartType,
                    stack: '总量',
                    areaStyle: { normal: {} },
                    data: data.data[key]
                })
            })

            let options = chartInitOpt
            options.series = series
            options.xAxis.data = data.category
            setOptions(options)
            renderChart()
        }
    }, [data])


    return (
        <ReactECharts
            option={options}
        />
    )
}

export default BasicChart
