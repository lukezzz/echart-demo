import useSWR from "swr";
import { fetcher } from '../config/fetcher'

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}

export const useBar = (chartType) => {
    const { data, error } = useSWR(`/chart/basic/${chartType}`, fetcher);

    // let options = chartInitOpt
    // if (data) {
    //     options.xAxis.category = data.category
    //     let series = []
    //     Object.keys(data.data).forEach(key => {
    //         series.push({
    //             name: key,
    //             type: 'bar',
    //             // stack: '总量',
    //             // areaStyle: { normal: {} },
    //             data: data.data[key]
    //         })
    //     })

    //     options.series = series
    // }

    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
    };
}

export const useLine = (chartType) => {
    const { data, error } = useSWR(`/chart/basic/line`, fetcher, { refreshInterval: 2000 });

    let options = chartInitOpt
    if (data) {
        options.xAxis.category = data.category
        let series = []
        Object.keys(data.data).forEach(key => {
            series.push({
                name: key,
                type: 'line',
                // stack: '总量',
                areaStyle: { normal: {} },
                data: data.data[key]
            })
        })

        options.series = series
    }

    return {
        options: options,
        isLoading: !error && !data,
        isError: error,
    };
}

