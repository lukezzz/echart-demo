import React, { useEffect } from 'react'
import * as echarts from "echarts";

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}
export const BasicChart = ({ chartRef, data, config, isLoading }) => {
    // const [config, setConfig] = useState(chartInitOpt)

    // const chartRef = useRef(null);

    const { smooth } = config
    console.log(isLoading)


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
        if (isLoading) {
            chartInstance.showLoading()
        } else {
            chartInstance.hideLoading()
            chartInstance.setOption(options);
        }


        chartInstance.on("click", function (params) {
            console.log("params：", params);
        });

    }

    const handleResize = () => {
        console.log("resize")
        chartInstance.resize()
    };

    const configOption = options => {

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
    }

    useEffect(() => {
        console.log("chart option updated", data);

        if (chartInstance) {
            handleResize()
        }

        let options = chartInitOpt
        if (!isLoading) {
            configOption(options)
        }

        renderChart(options);

        return () => {
            console.log("chart disposed");
            chartInstance && chartInstance.dispose();
            window.removeEventListener("resize", handleResize);
        }


    }, [data, isLoading]);

    // useEffect(() => {
    //     handleResize()
    //     return () => {
    //         console.log("chart disposed");
    //         chartInstance && chartInstance.dispose();
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, []);

    return (
        <div style={{ height: "250px" }} ref={chartRef} />
    )
}
