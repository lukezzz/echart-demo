import {
    Row,
    Col,
    Button,
    Card,
    Typography,
    Pagination,
    Checkbox,
    DatePicker

} from 'antd'
import { useTranslation } from 'react-i18next';


const { Title } = Typography;
const { RangePicker } = DatePicker;

export const Home = () => {

    const { t } = useTranslation();

    return (

        <div>
            <Row gutter={[12, 12]}>
                <Col span={6}>
                    <Card size="small" title="Button">
                        <Button type="primary">Primary Button</Button>
                        <Button>Default Button</Button>
                        <Button type="dashed">Dashed Button</Button>
                        <br />
                        <Button type="text">Text Button</Button>
                        <Button type="link">Link Button</Button>
                        <Button danger type="primary">Danger</Button>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Title">
                        <Title>{t('Welcome to React')}</Title>
                        <Title level={2}>h2. {t('Welcome to React')}</Title>
                        <Title level={3}>h3. {t('Welcome to React')}</Title>
                        <Title level={4}>h4. {t('Welcome to React')}</Title>
                        <Title level={5}>h5. {t('Welcome to React')}</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Pagination">
                        <Pagination defaultCurrent={1} total={50} showSizeChanger />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="Checkbox">
                        <Checkbox onChange={e => console.log(e.target.checked)}>Checkbox</Checkbox>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" title="DatePicker">
                        <RangePicker showTime />
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
