import {
    Row,
    Col,
    Card,
} from 'antd'
import { LineChart } from '../../components/Chart/Line.chart'
import { useTranslation } from 'react-i18next';
import '../Pages.style.scss'

export const LineChartContainer = () => {

    const { t } = useTranslation();


    return (

        <div>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Card
                        size="small"
                        title={t('Basic Line Chart')}
                    // className='chart-card'
                    >
                        <LineChart config={{ smooth: false }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        size="small"
                        title={t('Smoothed Line Chart')}
                    // className='chart-card'
                    >
                        <LineChart config={{ smooth: true }} />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
