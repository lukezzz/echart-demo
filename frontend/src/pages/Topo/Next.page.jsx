import useNext from "react-next-ui";
import { ThemeContext } from '../../providers/config/Theme.provider'
import React, { useContext, useRef, useEffect, useState } from 'react'
import { Row, Col, Button } from 'antd'

import "react-next-ui/build/css/next.min.css";



const topoData = {
    nodes: [
        { "id": 0, "x": 285, "y": 2, "name": "router", "label": 'test', "icon": "router", "color": "#fff" },
        { "id": 1, "x": 410, "y": 280, "name": "switch", "icon": "switch" },
        { "id": 2, "x": 660, "y": 280, "name": "server", "icon": "server" },
        { "id": 3, "x": 660, "y": 100, "name": "host", "icon": "host" },
        { "id": 4, "x": 141, "y": 190, "name": "cloud", "icon": "cloud" },
        { "id": 5, "x": 542, "y": -58, "name": "baidu1", "icon": "baidu" }
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
    // const topoData = {
    //     nodes: [
    //         { name: "Router1", id: 1, type: "router" },
    //         { name: "Router2", id: 2, type: "router" },
    //     ],
    //     links: [{ source: 1, target: 2 }],
    // };

    const { theme } = useContext(ThemeContext)
    const topoRef = useRef()

    const [nodeColor, setNodeColor] = useState("blue")

    const initConfig = {
        autoLayout: false,
        adaptive: true,
        identityKey: "id",
        showIcon: true,
        nodeConfig: {
            label: vertex => {
                return vertex.get("name") + " test";
            },
            iconType: vertex => {
                // console.log(vertex.get('icon'))
                return vertex.get("icon")
            }
        },
        theme: theme === 'dark' ? theme : null
    };

    const [config, setConfig] = useState(initConfig)



    let i = 10;
    const eventHandlers = {

        ready: (sender, event) => {
            //register icon to instance
            sender.registerIcon("baidu", "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png", 80, 32);
            sender.setData(topoData)
            // add custom icon
            // window.nx.define('Base.Icon', window.nx.ui.Component, {
            //     view: {
            //         content: {
            //             events: {
            //                 'ready': '{#_ready}'
            //             }
            //         }
            //     },
            //     methods: {
            //         _ready: function (sender, event) {
            //             var topo = this.view('topo');
            //             //register icon to instancesrpr/logo11w.png
            //             topo.registerIcon("baidu", "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png", 80, 32);
            //         }
            //     }
            // });
            // sender.fire('ready')
        },
        clickLink: (sender, event) => {
            // Display an alert to the user
            alert(`You clicked a link with id ${event.id()}`);
        },
        pressA: (sender, event) => {
            // Insert Data
            console.log('press A')
            sender.addNode({ id: i++ });
        },
        dragNodeEnd: (sender, event) => {
            console.log('x', event._x)
            console.log('y', event._y)
        },
        topologyGenerated: (sender, event) => {

            console.log('topologyGenerated')

            // draw layer
            window.nx.define("MyLayer", window.nx.graphic.Topology.Layer, {
                methods: {
                    draw: function () {
                        //init a Bezier Curves
                        var line = this.line = new window.nx.graphic.BezierCurves({
                            radian: 2
                        });
                        //set style
                        line.sets({
                            'stroke-width': '2px',
                            stroke: '#f00'

                        });
                        // register topology event
                        this.topology().on("zoomend", function () {
                            this._updateLine();
                        }, this);
                        this.topology().on("resetzooming", function () {
                            this._updateLine();
                        }, this);


                        //set data to line
                        this._updateLine();
                        // append to topology stage
                        line.attach(this);
                    },
                    _updateLine: function () {
                        var topo = this.topology();
                        var sourceNode = topo.getNode(1);
                        var targetNode = topo.getNode(4);
                        this.line.sets({
                            x1: sourceNode.x(),
                            y1: sourceNode.y(),
                            x2: targetNode.x(),
                            y2: targetNode.y()
                        })
                    }
                }
            });
            sender.insertLayerAfter('mylayer', 'MyLayer', 'nodes')


            //add status to node
            window.nx.define("NodeStatus", window.nx.graphic.Topology.Layer, {
                methods: {
                    draw: function () {
                        var topo = this.topology();
                        topo.eachNode(function (node) {
                            var dot = new window.nx.graphic.Circle({
                                r: 6,
                                cx: 20,
                                cy: -20
                            });
                            var color = "#f00";
                            if (node.model().get("id") > 2) {
                                color = "#0f0";
                            }
                            dot.set("fill", color);
                            dot.attach(node);
                            node.dot = dot;
                        }, this);
                    },
                    turnGreen: function () {
                        var topo = this.topology();
                        topo.eachNode(function (node) {
                            node.dot.set("fill", "#0f0");

                        })
                    },
                    random: function () {
                        var topo = this.topology();
                        topo.eachNode(function (node) {
                            node.dot.set("fill", colorTable[Math.floor(Math.random() * 5)]);

                        })
                    }
                }
            });
            sender.attachLayer("status", "NodeStatus");

            // add path

            var pathLayer = sender.getLayer("paths");
            var links1 = [nxApp?.getLink(8), nxApp?.getLink(11)];
            var path1 = new window.nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            pathLayer.addPath(path1);
            var links2 = [nxApp?.getLink(9), nxApp?.getLink(10), nxApp?.getLink(6)];
            var path2 = new window.nx.graphic.Topology.Path({
                links: links2,
                arrow: 'end'
            });
            // pathLayer.addPath(path2);



        },
        resizeStage: (sender, event) => {
            console.log('resizeStage', sender.getData())
        },

    };

    const handleResize = () => {
        if (topoRef) {
            nxApp?.width(topoRef.current.offsetWidth)
            nxApp?.height(topoRef.current.offsetHeight)
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



        // window.nx.define('Path.Base', window.nx.ui.Component, {
        //     view: {
        //         content: {
        //             events: {
        //                 'ready': '{#_ready}',
        //                 'topologyGenerated': '{#_path}'
        //             }
        //         }
        //     },
        //     methods: {
        //         _ready: function (sender, events) {
        //             console.log("ready")
        //         },
        //         _path: function (sender, events) {
        //             var pathLayer = sender.getLayer("paths");


        //             var links1 = [sender.getLink(2)];

        //             var path1 = new window.nx.graphic.Topology.Path({
        //                 links: links1,
        //                 arrow: 'cap'
        //             });

        //             pathLayer.addPath(path1);
        //         }
        //     }
        // });

        handleResize()

    }

    const { NextUI, nxApp } = useNext({
        topologyData: topoData,
        topologyConfig: config,
        eventHandlers: eventHandlers,
        callback: afterLoad,
        style: { height: "90vh", width: "90vw" },
    });






    const changeIconColor = () => {
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
            <Button onClick={changeIconColor}>change icon color</Button>
        </Col>
        <Col span={24} ref={topoRef}>
            {NextUI}
        </Col>
    </Row>;
};