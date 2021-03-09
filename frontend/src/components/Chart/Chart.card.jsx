import { Card, Modal, Drawer } from 'antd'
import React, { useState, useContext } from 'react'

import { BasicChart } from '../../components/Chart/Basic.chart'

import { useTranslation } from 'react-i18next';

import { OptionsButton } from './Setting.button'
import { OptionsForm } from './Options.form'
import { mutate } from 'swr'
import Editor from '@monaco-editor/react'

import { ThemeContext } from '../../providers/config/Theme.provider'



export const ChartCard = ({ options }) => {

    const title = options.title.text

    const { theme } = useContext(ThemeContext)

    const { t } = useTranslation();

    const [opt, setOpt] = useState(options)

    const [modalVisible, setModalVisible] = useState(false)

    const openModal = option => {
        setModalVisible(true)
    }

    const updateChart = opt => {
        console.log('update chart config')
        setOpt(opt)
        mutate(opt.url)
    }

    const reloadChart = () => {
        mutate(options.url)
    }

    const [drawlVisible, setDrawlVisible] = useState(false)

    const viewCode = () => {
        setDrawlVisible(true)
    }




    return (
        <div style={{ overflow: 'hidden', position: 'relative' }}>
            <Card
                size="small"
                title={t(title)}
                hoverable
                extra={<OptionsButton openModal={openModal} reloadChart={reloadChart} viewCode={viewCode} />}
            >
                <BasicChart config={opt} />

            </Card>
            <Drawer
                title="Options"
                placement="right"
                closable={false}
                onClose={() => setDrawlVisible(false)}
                visible={drawlVisible}
                getContainer={false}
                destroyOnClose
                width="50%"
                style={{ position: 'absolute' }}
            >
                <Editor
                    height="100%"
                    language="json"
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    value={JSON.stringify(opt, null, 2)}
                />

            </Drawer>
            <Modal
                title={title}
                centered
                destroyOnClose
                visible={modalVisible}
                footer={null}
                onOk={() => {
                    setModalVisible(false)
                }}
                onCancel={() => {
                    setModalVisible(false)
                }}
                width={500}
            >
                <OptionsForm options={options} updateOption={opt => updateChart(opt)} />

            </Modal>
        </div>
    )
}
