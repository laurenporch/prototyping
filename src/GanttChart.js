import React from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// [Gantt] Gantt demo: https://www.amcharts.com/demos/gantt-chart/
// [TODO] Legend: https://www.amcharts.com/docs/v4/tutorials/highlighting-column-series-on-legend-click/
// [TODO] Custom theme: https://www.amcharts.com/docs/v5/concepts/themes/creating-themes/
// [TODO] Rollup (can probably be done with show/hide functionality for rows, maybe attached to arrow button on row title)

class GanttChart extends React.Component {
    constructor(props) {
        super(props);
        this.root = null;
        this.chart = null;
        this.series = null;
        this.xAxis = null;
        this.yAxis = null;
        this.originalColumns = null;
        this.selectedColumn = null;
        this.previousColumns = null;
        this.handleColumnClick = this.handleColumnClick.bind(this);
        this.hideColumn = this.hideColumn.bind(this);
        this.showColumn = this.showColumn.bind(this);
    }
    // All chart creation should take place here
    componentDidMount() {
        // Create root element
        let root = am5.Root.new("chartdiv");

        // [Gantt] Set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // [Gantt] Create chart
        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelY: "zoomX",
            layout: root.verticalLayout
        }));

        // [Gantt] Get colors
        let colors = chart.get("colors");

        // [Gantt] Data object
        let data = [
            // John
            {
                category: "John",
                fromTime: 8,
                toTime: 10,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), 0)
                }
            },
            {
                category: "John",
                fromTime: 12,
                toTime: 15,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), 0.4)
                }
            },
            {
                category: "John",
                fromTime: 15.5,
                toTime: 21.5,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), 0.8)
                }
            },
            // Jane
            {
                category: "Jane",
                fromTime: 9,
                toTime: 12,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(2), 0)
                }
            },
            {
                category: "Jane",
                fromTime: 13,
                toTime: 17,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(2), 0.4)
                }
            },
            // Peter
            {
                category: "Peter",
                fromTime: 11,
                toTime: 16,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(4), 0)
                }
            },
            {
                category: "Peter",
                fromTime: 16,
                toTime: 19,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(4), 0.4)
                }
            },
            // Melania
            {
                category: "Melania",
                fromTime: 16,
                toTime: 20,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(6), 0)
                }
            },
            {
                category: "Melania",
                fromTime: 20.5,
                toTime: 24,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(6), 0.4)
                }
            },
            // Donald
            {
                category: "Donald",
                fromTime: 13,
                toTime: 24,
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(8), 0)
                }
            }
        ];

        // [Gantt] Create axes
        let yAxis = chart.yAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "category",
                renderer: am5xy.AxisRendererY.new(root, { inversed: true }),
                tooltip: am5.Tooltip.new(root, {
                    themeTags: ["axis"],
                    animationDuration: 200
                })
            })
        );

        this.originalColumns = [
            { category: "John" },
            { category: "Jane" },
            { category: "Peter" },
            { category: "Melania" },
            { category: "Donald" }
        ]

        yAxis.data.setAll(this.originalColumns);

        let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {})
            })
        );

        // [Gantt] Add series
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            openValueXField: "fromTime",    // THIS IS WHAT MAKES IT A HORIZONTAL "BAR" (GANTT) CHART ???
            valueXField: "toTime",
            categoryYField: "category",
            sequencedInterpolation: true
        }));

        series.columns.template.setAll({
            templateField: "columnSettings",
            strokeOpacity: 0,
            tooltipText: "{category}: {openValueX} - {valueX}"
        });

        // [Gantt] Add onClick event for "column" (bar)
        series.columns.template.events.on("click", this.handleColumnClick);

        // [Gantt] Load the data to the chart
        series.data.setAll(data);

        // [Gantt] Add scrollbars
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
        }));

        // Set objects
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.series = series;
        this.chart = chart;
        this.root = root;
    }

    render() {
        return(
            <>
                <button type="button" onClick={() => this.hideColumn()}>Hide Column</button>
                <button type="button" onClick={() => this.showColumn()}>Show Column</button>
                {/* Render the chart itself inside a div. id should match whatever we passed to Root.new() */}
                <div id="chartdiv" style={{width: "100%", height: "500px"}}></div>            
            </>
        );
    }

    // Set border stroke on click
    handleColumnClick(ev) {
        // Get column name, formatted fromTime, and formatted toTime --> ev.target.dataItem.dataContext.category, new Date(ev.target.dataItem.dataContext.fromTime), new Date(ev.target.dataItem.dataContext.toTime)
        // Get all columns on chart --> this.series.columns.values

        if (this.selectedColumn !== null && this.selectedColumn !== ev)
        {
            // Reset last selection
            this.selectedColumn.setAll({
                strokeOpacity: 0
            })
        }
        // Set border on current selection
        ev.target.setAll({
            strokeOpacity: 1,
            stroke: am5.color("#000000"),
            strokeWidth: 3
        });

        this.selectedColumn = ev.target;
    }

    // Hide the bottom column
    hideColumn() {
        this.previousColumns = this.chart.yAxes.values[0].data.values;
        let newColumns = [...this.previousColumns];
        newColumns.pop();
        this.yAxis.data.setAll(newColumns);
    }

    // Show the last deleted column
    showColumn() {
        let newColumns = this.originalColumns.slice(0, this.chart.yAxes.values[0].data.values.length + 1);
        this.yAxis.data.setAll(newColumns);
    }

    // Make sure to dispose of chart when we're done!
    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }
}

export default GanttChart;