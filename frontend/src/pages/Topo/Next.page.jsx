import { NextTopology } from '../../components/Topo/Basic.topo'
import React, { useRef } from 'react'

import { Row, Col, Button } from 'antd'

import "react-next-ui/build/css/next.min.css";



const topoData = {
    nodes: [
        { "id": 0, "x": 285, "y": 2, "name": "router", "label": 'test', "icon": "router", "color": "#fff" },
        { "id": 1, "x": 410, "y": 280, "name": "switch", "icon": "switch" },
        { "id": 2, "x": 660, "y": 280, "name": "server", "icon": "server" },
        { "id": 3, "x": 660, "y": 100, "name": "host", "icon": "host" },
        { "id": 4, "x": 141, "y": 190, "name": "cloud", "icon": "cloud" },
        { "id": 5, "x": 444, "y": -58, "name": "F5", "icon": "f5" },
        { "id": 6, "x": 333, "y": -58, "name": "baidu", "icon": "baidu" },
        { "id": 7, "x": 521, "y": -88, "name": "ElasticSearch", "icon": "elasticsearch" },
    ],
    links: [
        { "source": 0, "target": 1, id: 1 },
        { "source": 0, "target": 1, id: 2 },
        { "source": 0, "target": 1, id: 3 },
        { "source": 0, "target": 1, id: 4 },
        { "source": 1, "target": 2, id: 5 },
        { "source": 1, "target": 3, id: 6 },
        { "source": 4, "target": 1, id: 7 },
        { "source": 2, "target": 3, id: 8 },
        { "source": 2, "target": 0, id: 9 },
        { "source": 3, "target": 0, id: 10 },
        { "source": 3, "target": 0, id: 11 },
        { "source": 0, "target": 4, id: 12 },
        { "source": 0, "target": 4, id: 13 },
        { "source": 0, "target": 3, id: 14 }
    ]
};
var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];


export const NextContainer = () => {

    const topoRef = useRef()

    return <Row>

        <Col span={24} ref={topoRef}>
            <NextTopology
                url={`/topo/data`}
                topoRef={topoRef} />
        </Col>
    </Row>;
};