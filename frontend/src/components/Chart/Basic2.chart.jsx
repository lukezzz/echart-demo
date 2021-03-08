import React, { useEffect, useState, useRef } from 'react'
import * as echarts from "echarts";
import {
    Spin
} from 'antd'

import { useFetch } from '../../data/testchart'


const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}


export const BasicChart2 = ({ config, url }) => {
    // const [config, setConfig] = useState(chartInitOpt)

    const [loading, setLoading] = useState(true)

    const chartRef = useRef()

    const { smooth } = config

    const { data, isLoading, isError } = useFetch(url);
    // if (isError) return <div>failed to load</div>;


    let chartInstance = null;

    const renderChart = (options) => {
        console.log("chart render", chartRef.current)
        const renderedInstance = echarts.getInstanceByDom(chartRef.current);
        if (renderedInstance) {
            chartInstance = renderedInstance;
        } else {
            chartInstance = echarts.init(chartRef.current);
            window.addEventListener("resize", handleResize);

        }
        // if (isLoading) {
        //     chartInstance.showLoading()
        // } else {
        //     chartInstance.hideLoading()
        //     chartInstance.setOption(options);
        // }
        console.log('run reize at render', chartInstance.getWidth())
        handleResize()
        chartInstance.setOption(options)


        chartInstance.on("click", function (params) {
            console.log("params：", params);
        });

    }

    const handleResize = () => {
        // console.log("resize")
        chartInstance.resize()
        // setMaxWidth(chartInstance.getWidth())
        console.log('after resize width:', chartInstance.getWidth())
    };

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

        // if (chartInstance) {
        //     handleResize()
        // }

        if (data) {
            console.log("chart option updated", data);
            const options = configOption(data)
            renderChart(options);
        }


        return () => {
            console.log("chart disposed");
            chartInstance && chartInstance.dispose();
            window.removeEventListener("resize", handleResize);
        }


    }, [data]);


    // useEffect(() => {

    //     console.log('update loading state')
    //     setLoading(isLoading)
    //     if (data) {
    //         console.log("chart option updated", data);
    //         const options = configOption(data)
    //         renderChart(options);
    //     }
    // }, [isLoading])



    return (
        <div>
            {
                isError ?
                    <div>{isError.message}</div>
                    :
                    <Spin spinning={isLoading} >
                        <div style={{ height: "300px", maxWidth: "100%" }} ref={chartRef} />
                    </Spin>

            }
        </div>
    )
}
