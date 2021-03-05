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
        console.log("chart render", chartRef.current)
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

    const handleResize = () => {
        console.log("resize")
        chartInstance.resize()
    };

    useEffect(() => {
        console.log("chart option updated", data);

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
                // smooth: false,
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
            <div style={{ height: "250px" }} ref={chartRef} />
        </div>
    )
}
