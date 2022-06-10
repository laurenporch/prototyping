import React from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
// import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

class GanttChart extends React.Component {
    // All chart creation should take place here
    componentDidMount() {
        // Create root element
        let root = am5.Root.new("chartdiv");

        // [Gantt] Set date format
        root.dateFormatter.setAll({
            dateFormat: "yyyy-MM-dd",
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

        yAxis.data.setAll([
            { category: "John" },
            { category: "Jane" },
            { category: "Peter" },
            { category: "Melania" },
            { category: "Donald" }
        ]);

        let xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: "minute", count: 1 }, // SETS THE LOWEST TIME UNIT AVAILABLE
                renderer: am5xy.AxisRendererX.new(root, {})
            })
        );

        // [Gantt] Add series
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            openValueXField: "fromDate",    // THIS IS WHAT MAKES IT A HORIZONTAL "BAR" (GANTT) CHART ??
            valueXField: "toDate",
            categoryYField: "category",
            sequencedInterpolation: true
        }));

        series.columns.template.setAll({
            templateField: "columnSettings",
            strokeOpacity: 0,
            tooltipText: "{category}: {openValueX.formateDate('yyyy-MM-dd HH:mm')} - {valueX.formatDate('yyyy-MM-dd HH:mm')}"
        });

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

        // [Gantt] Add legend
        // let legend = chart.children.push(am5.Legend.new(root, {
        //     centerX: am5.p50,   // am5.p50 = percent 50
        //     x: am5.p50
        // }));
        // legend.data.setAll(chart.series.values);
        
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
    // componentDidUpdate() {

    // }

    // Make sure to dispose of chart when we're done!
    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }
}

export default GanttChart;