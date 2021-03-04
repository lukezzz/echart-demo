import BasicChart from './Basic.chart'

import React, { useState, useEffect } from 'react'


export const BarChart = ({ data }) => {

    const [options, setOptions] = useState({})


    useEffect(() => {
        let xAxis =
        {
            type: 'category',
            data: Object.keys(data)

        }
        let dataset = {}
        Object.keys(data).forEach(key => {
            let d = data[key]
            d.map(item => {
                if (dataset[item.name]) {
                    dataset[item.name].push(item.value)
                } else {
                    dataset[item.name] = []
                    dataset[item.name].push(item.value)

                }
                return item
            })
        })

        let series = []
        Object.keys(dataset).forEach(key => {
            series.push({
                type: 'bar',
                name: key,
                data: dataset[key]
            })
        })
        console.log(series)
        console.log(xAxis)
        setOptions({
            xAxis,
            series
        })
    }, [data])

    return (
        <BasicChart
            options={options}
        />
    )
}
