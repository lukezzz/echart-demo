import {
    Card,
    Button
} from 'antd'
import React, { useRef, useState, useEffect, memo } from 'react'
import _ from "lodash"
import RGL, { WidthProvider } from "react-grid-layout";
import { Responsive } from 'react-grid-layout';

import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'

import { useTranslation } from 'react-i18next';
// import { BasicChart2 } from '../../components/Chart/Basic2.chart'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const generateLayout = () => {
    return _.map(_.range(0, 10), function (item, i) {
        var y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: Math.round(Math.random() * 5) * 2,
            y: Math.floor(i / 6) * y,
            w: 2,
            h: y,
            i: i.toString(),
            static: Math.random() < 0.05
        };
    });
}


const Grid = () => {

    // const { t } = useTranslation();

    // const ref = useRef(null)

    const gridProps = {
        className: "layout",
        rowHeight: 30,
        onLayoutChange: function () { },
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    }

    const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
    const [compactType, setCompactType] = useState("vertical")
    const [mounted, setMounted] = useState(false)
    const [layouts, setLayouts] = useState({ lg: generateLayout() })

    // const [layout, setLayout] = useState(
    //     [
    //         { i: '1', x: 0, y: 0, w: 1, h: 2, minH: 2, maxH: 2 },         // *** -- minH & maxH doesnt effect the grid items
    //         { i: '2', x: 1, y: 0, w: 1, h: 2, minH: 2, maxH: 2 },
    //         { i: '3', x: 0, y: 1, w: 1, h: 2, minH: 2, maxH: 2 },
    //         { i: '4', x: 1, y: 1, w: 1, h: 2, minH: 2, maxH: 2 }
    //     ])

    // const onResize = () => {
    //     setLayout(layout)
    // };

    useEffect(() => {
        setMounted(true)
    }, [])


    const onNewLayout = () => {
        setLayouts({ lg: generateLayout() })
    }

    const onLayoutChange = (layout, layouts) => {
        gridProps.onLayoutChange(layout, layouts);
    };

    const onDrop = elemParams => {
        console.log(elemParams)
        // alert(`Element parameters: ${JSON.stringify(elemParams)}`);
    }

    const onCompactTypeChange = () => {
        // const { compactType: oldCompactType } = this.state;
        const oldCompactType = compactType
        const newCompactType =
            oldCompactType === "horizontal"
                ? "vertical"
                : oldCompactType === "vertical"
                    ? null
                    : "horizontal";
        setCompactType(newCompactType);
    };

    const onBreakpointChange = breakpoint => {
        setCurrentBreakpoint(breakpoint)
    }

    return (
        <div>
            <div>
                Current Breakpoint: {currentBreakpoint} (
          {gridProps.cols[currentBreakpoint]} columns)
        </div>
            <div>
                Compaction type:{" "}
                {_.capitalize(compactType) || "No Compaction"}
            </div>
            <Button onClick={onNewLayout}>Generate New Layout</Button>
            <Button onClick={onCompactTypeChange}>
                Change Compaction Type
        </Button>
            <ResponsiveReactGridLayout
                {...gridProps}
                layouts={layouts}
                onBreakpointChange={onBreakpointChange}
                onLayoutChange={onLayoutChange}
                onDrop={(elemParams) => onDrop(elemParams)}
                // WidthProvider option
                measureBeforeMount={false}
                // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                // and set `measureBeforeMount={true}`.
                useCSSTransforms={mounted}
                compactType={compactType}
                preventCollision={!compactType}
            >
                {
                    _.map(layouts.lg, (l, i) => {
                        return (
                            <div key={i} className={l.static ? "static" : ""}>
                                {l.static ? (
                                    <Card
                                        hoverable={true}
                                        // title="This card is static and cannot be removed or resized."
                                        style={{ height: '100%', width: '100%' }}
                                        bodyStyle={{ background: "#e2afaf", height: '100%', width: '100%' }}
                                    >
                                        <p>
                                            Static - {i}
                                        </p>
                                        <p>This card is static and cannot be removed or resized</p>
                                    </Card>
                                ) : (
                                        <Card
                                            hoverable={true}
                                            // title='This card can be dragged and resize'
                                            style={{ height: '100%', width: '100%' }}
                                            bodyStyle={{ background: "#95e0c1", height: '100%', width: '100%' }}


                                        >
                                            <p>
                                                {i}
                                            </p>
                                            <p>This card can be dragged and resize</p>
                                        </Card>
                                    )}
                            </div>
                        )
                    })
                }
            </ResponsiveReactGridLayout>
        </div>
    )
}

export const GridContainer = memo(Grid)