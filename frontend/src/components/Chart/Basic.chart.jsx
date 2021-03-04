// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
// Import charts, all with Chart suffix
import {
    LineChart,
    BarChart
} from 'echarts/charts';

// import components, all suffixed with Component
import {
    GridComponent,
    // PolarComponent,
    // RadarComponent,
    // GeoComponent,
    // SingleAxisComponent,
    // ParallelComponent,
    // CalendarComponent,
    // GraphicComponent,
    // ToolboxComponent,
    TooltipComponent,
    // AxisPointerComponent,
    // BrushComponent,
    TitleComponent,
    // TimelineComponent,
    // MarkPointComponent,
    // MarkLineComponent,
    // MarkAreaComponent,
    // LegendComponent,
    // LegendScrollComponent,
    // LegendPlainComponent,
    // DataZoomComponent,
    // DataZoomInsideComponent,
    // DataZoomSliderComponent,
    // VisualMapComponent,
    // VisualMapContinuousComponent,
    // VisualMapPiecewiseComponent,
    // AriaComponent,
    // TransformComponent,
    // DatasetComponent,
} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers';

import React, { useState, useEffect } from 'react'


// Register the required components
echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, LineChart, BarChart, CanvasRenderer,]
)

const chartInitOpt = {
    grid: { top: 8, right: 8, bottom: 24, left: 50 },
    legend: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: []
}


const BasicChart = ({ options }) => {


    const [chartOptions, setChartOptions] = useState(chartInitOpt)

    useEffect(() => {
        let newOpt = Object.assign(chartInitOpt, options)
        console.log(newOpt)
        setChartOptions(newOpt)
    }, [options])


    return (
        <ReactEChartsCore
            echarts={echarts}
            option={chartOptions}
            notMerge={true}
            lazyUpdate={true}
        // theme={"dark"}
        //   onChartReady={this.onChartReadyCallback}
        //   onEvents={EventsDict}
        // opts={ chartOptions}
        />
    )
}

export default BasicChart
