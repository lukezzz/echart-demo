import {
    Row,
    Col,
    Card,
} from 'antd'
import React, { useRef, useState, useEffect, memo } from 'react'


import RGL, { WidthProvider } from "react-grid-layout";
import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'

import { useTranslation } from 'react-i18next';
import { BasicChart2 } from '../../components/Chart/Basic2.chart'

const ReactGridLayout = WidthProvider(RGL);

const Grid = () => {

    const { t } = useTranslation();

    const ref = useRef(null)

    const [layout, setLayout] = useState(
        [
            { i: '1', x: 0, y: 0, w: 1, h: 2, minH: 2, maxH: 2 },         // *** -- minH & maxH doesnt effect the grid items
            { i: '2', x: 1, y: 0, w: 1, h: 2, minH: 2, maxH: 2 },
            { i: '3', x: 0, y: 1, w: 1, h: 2, minH: 2, maxH: 2 },
            { i: '4', x: 1, y: 1, w: 1, h: 2, minH: 2, maxH: 2 }
        ])

    const onResize = () => {
        setLayout(layout)
    };

    useEffect(() => {
        console.log(ref.current)
        onResize()
    }, [])

    return (
        <Row>
            <Col span={24}>
                <ReactGridLayout
                    rowHeight={150}
                    cols={3}
                    onResize={onResize}
                    width={100}
                    layout={layout}
                    onLayoutChange={layout => setLayout(layout)}
                    draggableHandle=".MyDragHandleClassName"
                    draggableCancel=".MyDragCancel"
                    ref={ref}
                >
                    <div className="item" key={1}>
                        <div className='MyDragHandleClassName'>
                            Drag from Here - <span className="text">1</span>
                        </div>
                        <div style={{ height: 200 }}>
                            <BasicChart2 config={{ smooth: false }} url="type1" />
                        </div>
                    </div>
                    <div className="item" key={2}>
                        <div className='MyDragHandleClassName'>
                            Drag from Here - <span className="text">2</span>
                        </div>
                        <BasicChart2 config={{ smooth: false }} url="type2" />
                    </div>
                </ReactGridLayout>
            </Col>
        </Row>

    )
}

export const GridContainer = memo(Grid)