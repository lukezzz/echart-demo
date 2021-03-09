import { Form, Row, Col, Switch, Select, Input, Button, Space } from 'antd';
import { SeriesModel } from 'echarts';


const { Option } = Select;


export const OptionsForm = ({ options, updateOption }) => {
    const [form] = Form.useForm();

    const { title, url, chartType } = options
    console.log(chartType)

    const onFinish = () => {
        form.validateFields()
            .then(values => {
                options.title.text = values.title
                options.url = values.url
                options.chartType.smooth = values.smooth
                options.chartType.colType = values.series_type
                updateOption(options)
            })
    }

    return (
        <div>

            <Form
                layout="horizontal"
                form={form}
                onFinish={onFinish}
                hideRequiredMark
                initialValues={{
                    title: title.text,
                    url,
                    smooth: chartType.smooth,
                    series_type: chartType.colType
                }}
            >
                <Row gutter={[8]}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="名称"
                            rules={[{ required: true, message: '请输入名称' }]}
                        >
                            <Input placeholder="请输入名称" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="url"
                            label="数据源"
                            rules={[{ required: true, message: '请输入数据源' }]}
                        >
                            <Input placeholder="请输入数据源" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="series_type"
                            label="类型"
                        >
                            <Select>
                                <Select.Option value="line">line</Select.Option>
                                <Select.Option value="bar">bar</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="smooth"
                            label="平滑"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button type="primary" htmlType="submit">update</Button>
                    </Col>

                </Row>
            </Form>
        </div>
    )
}
