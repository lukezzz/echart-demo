import React, { useEffect, useState, useRef, useContext } from 'react'
import * as echarts from "echarts";
import {
    Spin
} from 'antd'

import { useFetch } from '../../data/testchart'
import { theme_sec } from '../../config/echart_theme'

import { ThemeContext } from '../../providers/config/Theme.provider'

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}


export const BasicChart = ({ config }) => {
    // const [config, setConfig] = useState(chartInitOpt)


    const { theme } = useContext(ThemeContext)
    const chartRef = useRef()
    const { url } = config

    const { data, isLoading, isError } = useFetch(url);

    // if (isError) return <div>failed to load</div>;

    let chartInstance = null;

    const renderChart = (options) => {
        console.log("chart render", chartRef.current)
        const renderedInstance = echarts.getInstanceByDom(chartRef.current);
        if (renderedInstance) {
            chartInstance = renderedInstance;
        } else {
            chartInstance = echarts.init(chartRef.current, theme === 'dark' ? theme_sec : null);
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

    const configOption = (options, data) => {

        options.xAxis = {
            data: data.category
        }

        let series = []
        let smooth = config.chartType.smooth
        let colType = config.chartType.colType
        console.log(colType)
        Object.keys(data.data).forEach(key => {
            series.push({
                name: key,
                type: colType,
                smooth: smooth,
                // stack: '总量',
                // areaStyle: { normal: {} },
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

        let options = config
        if (data) {
            console.log("chart option/theme updated", data);

            options = configOption(options, data)
            // if (chartInstance) {
            //     chartInstance.dispose();
            // }

            console.log('render options:', options)
            renderChart(options);
        }


        return () => {
            console.log("chart disposed");
            chartInstance && chartInstance.dispose();
            window.removeEventListener("resize", handleResize);
        }


    }, [config, data, theme]);





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


export const BasicChartWithDataSet = ({ config, url, dataset }) => {
    // const [config, setConfig] = useState(chartInitOpt)

    const { theme } = useContext(ThemeContext)

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
            chartInstance = echarts.init(chartRef.current, theme === 'dark' ? theme_sec : null);
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

    const configOptionWithDataset = data => {

        let options = chartInitOpt

        options.dataset = [{
            id: 'dataset_raw',
            source: data
        }]

        options.dataset = options.dataset.concat(dataset)

        console.log(options.dataset)

        options.title = {
            text: 'Income of Germany and France since 1950'
        }

        options.tooltip = {
            trigger: 'axis'
        }

        options.xAxis = {
            type: 'category',
            nameLocation: 'middle'
        }

        options.series = [{
            type: 'line',
            datasetId: 'dataset_since_1950_of_germany',
            showSymbol: false,
            encode: {
                x: 'Year',
                y: 'Income',
                itemName: 'Year',
                tooltip: ['Income'],
            }
        }, {
            type: 'line',
            datasetId: 'dataset_since_1950_of_france',
            showSymbol: false,
            encode: {
                x: 'Year',
                y: 'Income',
                itemName: 'Year',
                tooltip: ['Income'],
            }
        }]
        return options
    }

    useEffect(() => {

        // if (chartInstance) {
        //     handleResize()
        // }

        if (data) {
            console.log("chart option/theme updated", data);
            let options = chartInitOpt
            options = configOptionWithDataset(data)
            // if (chartInstance) {
            //     chartInstance.dispose();
            // }
            renderChart(options);
        }


        return () => {
            console.log("chart disposed");
            chartInstance && chartInstance.dispose();
            window.removeEventListener("resize", handleResize);
        }


    }, [data, theme]);


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
