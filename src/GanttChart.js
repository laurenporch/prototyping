import React from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';

class GanttChart extends React.Component {
    // All chart creation should take place here
    componentDidMount() {
        const root = am5.Root.new("chartdiv");
        const chart = root.container.children.push(am5percent.PieChart.new(root, {}));
        const series = chart.series.push(
            am5percent.PieSeries.new(
                root, {
                    valueField: "value",
                    categoryField: "category"
                }
            )
        );

        // Data - add this last!
        series.data.setAll([{
            category: "Research",
            value: 1000
        }, {
            category: "Marketing",
            value: 1200
        }, {
            category: "Sales",
            value: 850
        }]);

        // Set objects
        this.chart = chart;
        this.root = root;
    }

    render() {
        return(
            <>
            {/* Render the chart itself inside a div. id should match whatever we passed to Root.new() */}
            <div id="chartdiv" style={{width: "100%", height: "500px"}}></div>
            </>
        );
    }

    // All chart updates need to be checked and updated here
    componentDidUpdate() {
        if (oldProps.paddingRight !== this.props.paddingRight) {
            this.chart.set("paddingRight", this.props.paddingRight);
        }
    }

    // Make sure to dispose of chart when we're done!
    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }
}

export default GanttChart;