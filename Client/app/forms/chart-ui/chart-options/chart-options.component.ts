//declare var APP_VERSION: string;

import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { colorSets } from '../chart-ref/color-sets';
import { dataTypes } from '../chart-ref/data';
import chartGroups from '../chart-ref/chartTypes';
import { barChart, lineChartSeries } from '../chart-ref/combo-chart-data';
import { ChartService } from '../chart-ref/chart.service';
import * as shape from 'd3-shape';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart-options',
    templateUrl: './chart-options.component.html',
    styleUrls: ['./chart-options.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChartOptionsComponent implements OnInit {

    //version = APP_VERSION;
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;

    chartGroupsFilt: any[];
    chartGroups: any[];
    chart: any;
    dataTypes: any[];

    chartOptions: any = {};

    interpolationTypes = [
        'Basis', 'Bundle', 'Cardinal', 'Catmull Rom', 'Linear', 'Monotone X',
        'Monotone Y', 'Natural', 'Step', 'Step After', 'Step Before'
    ];


    closedInterpolationTypes = [
        'Basis Closed', 'Cardinal Closed', 'Catmull Rom Closed', 'Linear Closed'
    ];

    colorSets: any;


    // Combo Chart
    barChart: any[] = barChart;
    lineChartSeries: any[] = lineChartSeries;
    lineChartScheme = {
        name: 'coolthree',
        selectable: true,
        group: 'Ordinal',
        domain: [
            '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
        ]
    };

    comboBarScheme = {
        name: 'singleLightBlue',
        selectable: true,
        group: 'Ordinal',
        domain: [
            '#01579b'
        ]
    };
    curves = {
        Basis: shape.curveBasis,
        'Basis Closed': shape.curveBasisClosed,
        Bundle: shape.curveBundle.beta(1),
        Cardinal: shape.curveCardinal,
        'Cardinal Closed': shape.curveCardinalClosed,
        'Catmull Rom': shape.curveCatmullRom,
        'Catmull Rom Closed': shape.curveCatmullRomClosed,
        Linear: shape.curveLinear,
        'Linear Closed': shape.curveLinearClosed,
        'Monotone X': shape.curveMonotoneX,
        'Monotone Y': shape.curveMonotoneY,
        Natural: shape.curveNatural,
        Step: shape.curveStep,
        'Step After': shape.curveStepAfter,
        'Step Before': shape.curveStepBefore,
        default: shape.curveLinear
    };

    constructor(private _chartService: ChartService) {

        Object.assign(this, {
            dataTypes,
            chartGroups,
            colorSets,
        });
    }

    ngOnInit() {
      
      this.setchartOptions(this.data[this.control.key]=="" || this.data[this.control.key].chartType == "" ? true : false);
        this.chartGroupsFilter(this.chartOptions.chartDataType, false);
        //const state = this.location.path(true);
        this.selectChart(this.chartOptions.chartType);
        if (!this.chartOptions.fitContainer) {
            this.applyDimensions();
        }
    }
    setchartOptions(IsNewOption: boolean) {
        if (IsNewOption == true) {
            this.chartOptions.theme = 'light';
            this.chartOptions.dataview = 'Json';
            this.chartOptions.itemsPerPage = 5;
            this.chartOptions.chartDataType = "0";
            this.chartOptions.chartType = "bar-vertical";
            this.chartOptions.chartTypeRefresh = "";
            this.chartOptions.chartName = "";
            this.chartOptions.inputFormat = "";
            this.chartOptions.realTimeData = false;
            this.chartOptions.linearScale = false;
            this.chartOptions.range = false;
            this.chartOptions.width = 700;
            this.chartOptions.height = 300;
            this.chartOptions.view = [this.chartOptions.width, this.chartOptions.height];
            this.chartOptions.fitContainer = false;
            this.chartOptions.showXAxis = true;
            this.chartOptions.showYAxis = true;
            this.chartOptions.gradient = false;
            this.chartOptions.showLegend = true;
            this.chartOptions.legendTitle = 'Legend';
            this.chartOptions.showXAxisLabel = true;
            this.chartOptions.tooltipDisabled = false;
            this.chartOptions.xAxisLabel = 'x-Axis';
            this.chartOptions.showYAxisLabel = true;
            this.chartOptions.yAxisLabel = 'y-Axis';
            this.chartOptions.showGridLines = true;
            this.chartOptions.innerPadding = '10%';
            this.chartOptions.barPadding = 8;
            this.chartOptions.groupPadding = 16;
            this.chartOptions.roundDomains = false;
            this.chartOptions.maxRadius = 10;
            this.chartOptions.minRadius = 3;
            this.chartOptions.showSeriesOnHover = true;
            this.chartOptions.roundEdges = true;
            this.chartOptions.curveType = 'Linear';
            this.chartOptions.closedCurveType = 'Linear Closed';
            this.chartOptions.schemeType = 'ordinal';
            this.chartOptions.selectedColorScheme = "cool";
            this.chartOptions.colorScheme = this.colorSets.find(s => s.name === this.chartOptions.selectedColorScheme);
            this.chartOptions.rangeFillOpacity = 0.15;
            this.chartOptions.showLabels = true;
            this.chartOptions.explodeSlices = false;
            this.chartOptions.doughnut = false;
            this.chartOptions.arcWidth = 0.25;
            this.chartOptions.autoScale = true;
            this.chartOptions.timeline = false;
            this.chartOptions.margin = false;
            this.chartOptions.marginTop = 40;
            this.chartOptions.marginRight = 40;
            this.chartOptions.marginBottom = 40;
            this.chartOptions.marginLeft = 40;
            this.chartOptions.gaugeMin = 0;
            this.chartOptions.gaugeMax = 100;
            this.chartOptions.gaugeLargeSegments = 10;
            this.chartOptions.gaugeSmallSegments = 5;
            this.chartOptions.gaugeTextValue = '';
            this.chartOptions.gaugeUnits = 'alerts';
            this.chartOptions.gaugeAngleSpan = 240;
            this.chartOptions.gaugeStartAngle = -120;
            this.chartOptions.gaugeShowAxis = true;
            this.chartOptions.gaugeValue = 50; // linear gauge value
            this.chartOptions.gaugePreviousValue = 70;
            this.chartOptions.showRefLines = true;
            this.chartOptions.showRefLabels = true;
            this.chartOptions.showRightYAxisLabel = true;
            this.chartOptions.yAxisLabelRight = 'Utilization';
            this.chartOptions.DirectMapping = false;
        }
        else {
            this.chartOptions = this.data[this.control.key];
        }
        this.data[this.control.key] = this.chartOptions;
    }

    chartGroupsFilter(inputFormat, reset: boolean = true) {
        this.chartOptions.chartDataType = inputFormat ? inputFormat : '0';
        this.chartGroupsFilt = [];
        if (inputFormat == "0") {
            this.chartGroupsFilt = this.chartGroups;
            return;
        }
        for (const group of this.chartGroups) {
            var _arr : any = {};
            _arr.name = group.name;
            _arr.charts = group.charts.filter(x => x.inputFormat === inputFormat);
            if (_arr.charts.length > 0)
                this.chartGroupsFilt.push(_arr);
        }
        if (reset == true)
            this.selectChart(inputFormat == "0" || inputFormat == "singleSeries" ? "bar-vertical" : inputFormat == "multiSeries" ? "bar-vertical-2d" : "bubble-chart");
    }
    RefreshData() {
        
        var apiparam : any = {};
        this.data.ResultApiParam.forEach(option => {
            apiparam[option.key] = option.value;
        })
        switch (this.chartOptions.inputFormat) {
            case "singleSeries": {
                this._chartService.singleData(this.data.ResultApi, apiparam, this.data.ResultDisplayField, this.chartOptions.DirectMapping, this.data.key);
                break;
            }
            case "multiSeries": {
                this._chartService.MultiData(this.data.ResultApi, apiparam, this.data.ResultDisplayField, this.data.key);
                break;
            }
            case "bubble": {
                this._chartService.BubbleData(this.data.ResultApi, apiparam, this.data.ResultDisplayField, this.data.key);
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
        this.selectChart(this.chartOptions.chartType);
    }

    applyDimensions() {
        this.chartOptions.view = [this.chartOptions.width, this.chartOptions.height];
    }

    toggleFitContainer(event) {
        this.chartOptions.fitContainer = event;

        if (this.chartOptions.fitContainer) {
            this.chartOptions.view = undefined;
        } else {
            this.applyDimensions();
        }
    }

    selectChart(chartSelector) {
        
        this.chartOptions.chartType = chartSelector = chartSelector.replace('/', '');
        //this.location.replaceState(this.chartOptions.chartType);
        this.chartOptions.chartTypeRefresh = this.chartOptions.chartType;
        for (const group of this.chartGroups) {
            this.chart = group.charts.find(x => x.selector === chartSelector);
            if (this.chart) break;
        }
        this.chartOptions.chartName = this.chart.name;
        this.chartOptions.inputFormat = this.chart.inputFormat;

        var dataTypes = this.dataTypes.filter(x => x.inputFormat == this.chart.inputFormat);

        this.control.ResultDisplayField = [];
        var _List = [];

        for (const dataType of dataTypes) {
            for (const item of dataType.data) {
                var arr : any = {};
                arr["key"] = item;
                arr["value"] = item;
                _List.push(arr);
            }
        }
        this._chartService.ChartFieldList = _List;

        Object.assign(this, this.chart.defaults);

        if (!this.chartOptions.fitContainer) {
            this.applyDimensions();
        }
    }

    getInterpolationType(curveType) {
        return this.curves[curveType] || this.curves['default'];
    }

    setColorScheme(name) {
        this.chartOptions.selectedColorScheme = name;
        this.chartOptions.colorScheme = this.colorSets.find(s => s.name === name);
    }
}

