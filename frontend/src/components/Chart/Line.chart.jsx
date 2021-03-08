import React, { useRef } from 'react'
import { BasicChart } from './Basic.chart'
import { useFetch } from '../../data/testchart'

import {
    Spin
} from 'antd'
export const LineChart = ({ parentRef, chartRef, config }) => {

    const { data, isLoading, isError } = useFetch('line');
    if (isError) return <div>failed to load</div>;
    // if (isLoading) return <Spin spinning />;
    // console.log("loading state: ", isLoading)

    return (
        <BasicChart parentRef={parentRef} chartRef={chartRef} data={data} config={config} isLoading={isLoading} />
    )
}
