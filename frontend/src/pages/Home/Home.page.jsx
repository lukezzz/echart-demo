import { Button, Descriptions, Spin } from 'antd'


export const Home = ({ data, isLoading }) => {


    return (

        <div>
            {
                isLoading ?
                    <Spin spinning />
                    :
                    <Descriptions title="API Info">
                        <Descriptions.Item label="api_base_url">{data.api_base_url}</Descriptions.Item>
                        <Descriptions.Item label="api_version">{data.api_version}</Descriptions.Item>
                        <Descriptions.Item label="authentication_url">{data.authentication_url}</Descriptions.Item>
                        <Descriptions.Item label="current_user_url">{data.current_user_url}</Descriptions.Item>

                    </Descriptions>
            }
        </div>
    )
}
