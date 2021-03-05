import React, { useRef } from 'react'
import { BasicChart } from './Basic.chart'
import { useBar } from '../../data/testchart'

import {
    Spin
} from 'antd'
export const LineChart = ({ chartType }) => {

    const chartRef = useRef(null);

    const { data, isLoading, isError } = useBar(chartType);
    if (isError) return <div>failed to load</div>;
    if (isLoading) return <Spin spinning />;


    return (
        <BasicChart chartRef={chartRef} data={data} />
    )
}
