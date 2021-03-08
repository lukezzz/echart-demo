import {
    Row,
    Col,
    Card,
} from 'antd'
import React, { useRef, useState, useEffect } from 'react'

// import { LineChart } from '../../components/Chart/Line.chart'
import { BasicChart2 } from '../../components/Chart/Basic2.chart'

import { useTranslation } from 'react-i18next';
import '../Pages.style.scss'

export const LineChartContainer = () => {

    const { t } = useTranslation();

    return (

        <div>
            <Row justify="space-between">
                <Col span={12}>
                    <Card
                        size="small"
                        title={t('Basic Line Chart')}
                    // bodyStyle={{ maxWidth: 500 }}
                    // className='chart-card'
                    >
                        <BasicChart2 config={{ smooth: false }} url="type1" />

                    </Card>
                </Col>
                <Col span={12} >
                    <Card
                        size="small"
                        title={t('Smoothed Line Chart')}
                    // bodyStyle={{ maxWidth: 500 }}
                    // className='chart-card'
                    >
                        <BasicChart2 config={{ smooth: true }} url="type2" />

                    </Card>
                </Col>
            </Row>

        </div>
    )
}
