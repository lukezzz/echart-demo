// import BasicChart from './Basic.chart'

import React, { useState, useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}




export const BarChart = ({ options }) => {

    const [opt, setOpt] = useState(Object.assign(chartInitOpt, options))
    const ref = useRef(null)

    // useEffect(() => {
    //     let xAxis =
    //     {
    //         type: 'category',
    //         data: Object.keys(data)

    //     }
    //     let dataset = {}
    //     Object.keys(data).forEach(key => {
    //         let d = data[key]
    //         d.map(item => {
    //             if (dataset[item.name]) {
    //                 dataset[item.name].push(item.value)
    //             } else {
    //                 dataset[item.name] = []
    //                 dataset[item.name].push(item.value)

    //             }
    //             return item
    //         })
    //     })

    //     let series = []
    //     Object.keys(dataset).forEach(key => {
    //         series.push({
    //             type: 'bar',
    //             name: key,
    //             data: dataset[key]
    //         })
    //     })
    //     console.log(series)
    //     console.log(xAxis)

    //     setOptions(Object.assign(chartInitOpt, {
    //         xAxis,
    //         series
    //     }))
    // }, [data])

    useEffect(() => {
        console.log(options)
        setOpt(Object.assign(chartInitOpt, options))
    }, [options])

    return (
        <ReactECharts
            ref={ref}
            option={opt}
        />
    )
}
