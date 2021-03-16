import useNext from "react-next-ui";
import { ThemeContext } from '../../providers/config/Theme.provider'
import React, { useContext, useRef, useEffect, useState } from 'react'
import { Row, Col, Button } from 'antd'

import "react-next-ui/build/css/next.min.css";


const topoData = {
    nodes: [
        { "id": 0, "x": 410, "y": 100, "name": "node1", "label": 'test', "icon": "router", "color": "#fff" },
        { "id": 1, "x": 410, "y": 280, "name": "12K-2", "icon": "switch" },
        { "id": 2, "x": 660, "y": 280, "name": "Of-9k-03", "icon": "server" },
        { "id": 3, "x": 660, "y": 100, "name": "Of-9k-02", "icon": "host" },
        { "id": 4, "x": 180, "y": 190, "name": "Of-9k-01", "icon": "cloud" }
    ],
    links: [
        { "source": 0, "target": 1, "linkType": "curve" },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 0, "target": 1 },
        { "source": 1, "target": 2 },
        { "source": 1, "target": 3 },
        { "source": 4, "target": 1 },
        { "source": 2, "target": 3 },
        { "source": 2, "target": 0 },
        { "source": 3, "target": 0 },
        { "source": 3, "target": 0 },
        { "source": 3, "target": 0 },
        { "source": 3, "target": 0 },
        { "source": 3, "target": 0 },
        { "source": 3, "target": 0 },
        { "source": 0, "target": 4 },
        { "source": 0, "target": 4 },
        { "source": 0, "target": 3 }
    ]
};
var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];


export const NextContainer = () => {
    // const topoData = {
    //     nodes: [
    //         { name: "Router1", id: 1, type: "router" },
    //         { name: "Router2", id: 2, type: "router" },
    //     ],
    //     links: [{ source: 1, target: 2 }],
    // };

    const { theme } = useContext(ThemeContext)
    const topoRef = useRef()

    const [nodeColor, setNodeColor] = useState("blue");

    const initConfig = {
        autoLayout: true,
        adaptive: true,
        identityKey: "id",
        showIcon: true,
        nodeConfig: {
            label: function (vertex) {
                return vertex.get("name") + "abu";
            },
            iconType: item => {
                // console.log(item.get('icon'))
                return item.get("icon")
            }
        },
        theme: theme === 'dark' ? theme : null
    };

    const [config, setConfig] = useState(initConfig)


    let i = 10;
    const eventHandlers = {
        clickLink: (sender, event) => {
            // Display an alert to the user
            alert(`You clicked a link with id ${event.id()}`);
        },
        pressA: (sender, event) => {
            // Insert Data
            sender.addNode({ id: i++ });
        },
    };

    const handleResize = () => {
        if (topoRef) {
            nxApp?.width(topoRef.current.offsetWidth)
            nxApp?.fit()
        }
    };

    window.addEventListener("resize", handleResize)

    const afterLoad = (nxApp) => {
        window.nx.define("testTooltipPolicy", window.nx.graphic.Topology.TooltipPolicy, {
            properties: {
                topology: {},
                tooltipManager: {},
            },
            methods: {
                init(args) {
                    this.sets(args);
                    this._tm = this.tooltipManager();
                },
                clickNode(node) {
                    // Overwrite click behavior: Do nothing.
                    // This prevents the popup from displaying in the Next container
                    console.log('click', node)
                },
                clickLink(link) {
                    // Overwrite click behavior: Do nothing.
                    // This prevents the popup from displaying in the Next container
                },
            },
        });
        nxApp.tooltipManager().tooltipPolicyClass("testTooltipPolicy");

    }

    const { NextUI, nxApp } = useNext({
        topologyData: topoData,
        topologyConfig: config,
        eventHandlers: eventHandlers,
        callback: afterLoad,
        style: { height: "100vh", width: "100vw" },
    });






    const changeTheme = () => {
        setNodeColor((nodeColor) => (nodeColor === "red" ? "blue" : "red"));
        nxApp?.eachNode((node) => {
            node.color(nodeColor);
        });
    }


    useEffect(() => {
        nxApp?.theme(theme === 'dark' ? theme : null)
    }, [theme])




    return <Row>
        <Col span={24}>
            <Button onClick={changeTheme}>change icon color</Button>
        </Col>
        <Col span={24} ref={topoRef}>
            {NextUI}
        </Col>
    </Row>;
};