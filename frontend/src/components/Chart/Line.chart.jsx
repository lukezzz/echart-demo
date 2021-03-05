import React, { useState, useEffect, useRef } from 'react'
import { BasicChart } from './Basic.chart'
import { useBar } from '../../data/testchart'


export const LineChart = ({ chartType }) => {

    const chartRef = useRef(null);
    const { data, isLoading, isError } = useBar(chartType);
    if (isError) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;


    return (
        <BasicChart chartRef={chartRef} data={data} />
    )
}
