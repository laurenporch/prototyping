import React from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';

class GanttChart extends React.Component {
    componentDidMount() {
        // am5.ready(() => {
            const root = am5.Root.new("chartdiv");
        // });

        const chart = root.container.children.push(am5percent.PieChart.new(root, {}));

        const series = chart.series.push(
            am5percent.PieSeries.new(
                root, {
                    valueField: "value",
                    categoryField: "category"
                }
            )
        );

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

        this.root = root;
    }

    render() {
        return(
            <>
            Made a thing.
            <div id="chartdiv" style={{width: "100%", height: "500px"}}></div>
            </>
        );
    }

    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }
}

export default GanttChart;