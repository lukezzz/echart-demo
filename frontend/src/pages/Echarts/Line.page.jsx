import {
    Row,
    Col,
    Card,
} from 'antd'
import React, { useRef, useState, useEffect } from 'react'

// import { LineChart } from '../../components/Chart/Line.chart'
import { BasicChart } from '../../components/Chart/Basic.chart'

import { useTranslation } from 'react-i18next';
import '../Pages.style.scss'

export const LineChartContainer = () => {

    const { t } = useTranslation();

    return (

        <div>
            <Row justify="space-between" gutter={[12, 12]}>
                <Col span={12}>
                    <Card
                        size="small"
                        title={t('Basic Line Chart')}
                        hoverable
                    // bodyStyle={{ maxWidth: 500 }}
                    // className='chart-card'
                    >
                        <BasicChart config={{ smooth: false }} url='/chart/basic/type1' />

                    </Card>
                </Col>
                <Col span={12} >
                    <Card
                        size="small"
                        title={t('Smoothed Line Chart')}
                        hoverable
                    // bodyStyle={{ maxWidth: 500 }}
                    // className='chart-card'
                    >
                        <BasicChart config={{ smooth: true }} url="/chart/basic/type2" />

                    </Card>
                </Col>
                <Col span={12} >
                    <Card
                        size="small"
                        title={t('Data set and transform')}
                        hoverable
                    >
                        <BasicChart
                            config={{ smooth: true }}
                            url="/chart/basic/type3"
                            dataset={
                                [{
                                    id: 'dataset_since_1950_of_germany',
                                    fromDatasetId: 'dataset_raw',
                                    transform: {
                                        type: 'filter',
                                        config: {
                                            and: [
                                                { dimension: 'Year', gte: 1950 },
                                                { dimension: 'Country', '=': 'Germany' }
                                            ]
                                        }
                                    }
                                }, {
                                    id: 'dataset_since_1950_of_france',
                                    fromDatasetId: 'dataset_raw',
                                    transform: {
                                        type: 'filter',
                                        config: {
                                            and: [
                                                { dimension: 'Year', gte: 1950 },
                                                { dimension: 'Country', '=': 'France' }
                                            ]
                                        }
                                    }
                                }]
                            }
                        />

                    </Card>
                </Col>
            </Row>

        </div>
    )
}
