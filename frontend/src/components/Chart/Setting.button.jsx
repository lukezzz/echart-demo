import { Space, Button } from 'antd'
import {
    SettingOutlined,
    ReloadOutlined,
    CodepenOutlined
} from '@ant-design/icons'

export const OptionsButton = ({ openModal, reloadChart, viewCode }) => {

    const onClickReload = () => {
        console.log('reload chart')
        reloadChart()
    }
    const onClickSetting = () => {
        console.log('open options modal')
        openModal()
    }
    const onClickCode = () => {
        console.log('open options modal')
        viewCode()
    }

    return (
        <Space>
            <Button size='small' type='text' onClick={onClickReload} icon={<ReloadOutlined />} />
            <Button size='small' type='text' onClick={onClickSetting} icon={<SettingOutlined />} />
            <Button size='small' type='text' onClick={onClickCode} icon={<CodepenOutlined />} />
        </Space>
    )
}
