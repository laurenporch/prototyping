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

        // [Gantt] Set date format
        root.dateFormatter.setAll({
            dateFormat: "yyyy-MM-dd HH:mm",
            dateFields: ["valueX", "openValueX"]
        });

        // [Gantt] Set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // [Gantt] Create chart
        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
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
                fromDate: "2018-01-01 08:00",
                toDate: "2018-01-01 10:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), 0)
                }
            },
            {
                category: "John",
                fromDate: "2018-01-01 12:00",
                toDate: "2018-01-01 15:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), 0.4)
                }
            },
            {
                category: "John",
                fromDate: "2018-01-01 15:30",
                toDate: "2018-01-01 21:30",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), 0.8)
                }
            },
            // Jane
            {
                category: "Jane",
                fromDate: "2018-01-01 09:00",
                toDate: "2018-01-01 12:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(2), 0)
                }
            },
            {
                category: "Jane",
                fromDate: "2018-01-01 13:00",
                toDate: "2018-01-01 17:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(2), 0.4)
                }
            },
            // Peter
            {
                category: "Peter",
                fromDate: "2018-01-01 11:00",
                toDate: "2018-01-01 16:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(4), 0)
                }
            },
            {
                category: "Peter",
                fromDate: "2018-01-01 16:00",
                toDate: "2018-01-01 19:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(4), 0.4)
                }
            },
            // Melania
            {
                category: "Melania",
                fromDate: "2018-01-01 16:00",
                toDate: "2018-01-01 20:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(6), 0)
                }
            },
            {
                category: "Melania",
                fromDate: "2018-01-01 20:30",
                toDate: "2018-01-02 00:00",
                columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(6), 0.4)
                }
            },
            // Donald
            {
                category: "Donald",
                fromDate: "2018-01-01 13:00",
                toDate: "2018-01-02 00:00",
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
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: "millisecond", count: 1 }, // Sets the LOWEST time unit available
                renderer: am5xy.AxisRendererX.new(root, {})
            })
        );

        // [Gantt] Add series
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            openValueXField: "fromDate",    // THIS IS WHAT MAKES IT A HORIZONTAL "BAR" (GANTT) CHART ???
            valueXField: "toDate",
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

        series.data.processor = am5.DataProcessor.new(root, {
            dateFields: ["fromDate", "toDate"],
            dateFormat: "yyyy-MM-dd HH:mm"
        });

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
            <div style={{width: "100%", height: '200px'}}>
            
            </div>
            </>
        );
    }

    // Set border stroke on click
    handleColumnClick(ev) {
        // Get column name, formatted fromDate, and formatted toDate --> ev.target.dataItem.dataContext.category, new Date(ev.target.dataItem.dataContext.fromDate), new Date(ev.target.dataItem.dataContext.toDate)
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