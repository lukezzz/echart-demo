import React, { useEffect, useRef } from 'react'
import * as echarts from "echarts";

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}
export const BasicChart = ({ chartRef, data }) => {
    // const [config, setConfig] = useState(chartInitOpt)

    // const chartRef = useRef(null);


    let chartInstance = null;

    const renderChart = (options) => {
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
        window.addEventListener("resize", handleResize);
        // console.log(chartRef.current)
    }

    const handleResize = () => {
        chartInstance.resize()
    };

    useEffect(() => {
        // console.log("chart option updated", options);

        let options = chartInitOpt
        console.log(data)
        options.xAxis = {
            data: data.category
        }

        let series = []
        Object.keys(data.data).forEach(key => {
            series.push({
                name: key,
                type: 'bar',
                // stack: '总量',
                // areaStyle: { normal: {} },
                data: data.data[key]
            })
        })

        options.series = series


        renderChart(options);
        window.addEventListener("resize", handleResize);

    }, [data]);

    useEffect(() => {
        return () => {
            console.log("chart disposed");
            chartInstance && chartInstance.dispose();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <div style={{ width: '100%', height: "300px" }} ref={chartRef} />
        </div>
    )
}
