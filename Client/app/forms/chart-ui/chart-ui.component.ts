//declare var APP_VERSION: string;

import { Component, OnInit, Input, ViewEncapsulation, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { data as countries } from 'emoji-flags'; //npm install emoji-flags
import * as shape from 'd3-shape';
import * as d3 from 'd3';
//const weekdayName = new Intl.DateTimeFormat('en-us', { weekday: 'short' });
import { FormControlService } from '../form-control.service';
import { ChartService } from './chart-ref/chart.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
function multiFormat(value) {
    if (value < 1000) return `${value.toFixed(2)}ms`;
    value /= 1000;
    if (value < 60) return `${value.toFixed(2)}s`;
    value /= 60;
    if (value < 60) return `${value.toFixed(2)}mins`;
    value /= 60;
    return `${value.toFixed(2)}hrs`;
}

@Component({
    selector: 'app-chart-ui',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./chart-ui.component.scss'], //npm i @swimlane/ngx-ui --S '../node_modules/@swimlane/ngx-ui/release/index.css',
    templateUrl: './chart-ui.component.html'
})
export class ChartUiComponent implements OnInit, OnChanges, OnDestroy {

    //version = APP_VERSION;
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public AuthService: any;
    Filters: any[];
    treeMapField: any;
    countries: any[];
    sumBy: string = 'Size';
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
    private unsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor(private _chartService: ChartService, private _controlService: FormControlService, private _router: Router) {
        Object.assign(this, {
            countries,
        });
        this._controlService.chartRefresh$
            .takeUntil(this.unsubscribe)
            .subscribe((data: any) => {
                this.RefreshModalFromOtherControl(data)
            });
    }
    RefreshModalFromOtherControl(param: any) {
        if (param) {
            var data = JSON.parse(param.props);
            if (this.control.key === data.controlkey) {
                this.Search(data)
            }
        } else {
            this.Search();
        }
    }
    ngOnInit() {

        if (this.control.isTableView == false)
            this.RefreshData(false, null);
    }
    ngOnChanges(changes) {
        if (this.control.chartOptions.chartType == 'tree-map') {
            var val = this.control.ResultDisplayField.filter(x => x.ChartField == 'Y')
            this.treeMapField = val.length > 0 ? val[0].BindingField : '';
        }
        this.AddFilter();

    }
    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    AddFilter() {
        this.Filters = [];

        this.control.ResultApiParam.forEach(item => {
            if (item.Filter == true) {
                var filter: any = {};
                filter.label = item.key;
                filter.id = item.id;
                filter.value = item.value;
                if (item.List.trim() == '') {
                    filter.type = 'textbox';

                } else {
                    filter.type = 'list';
                    filter.data = item.List.split(',')
                }
                this.Filters.push(filter);
            }
        })
    }
    Search(refreshParam: any = null) {

        var apiparam: any = {};
        this.Filters.forEach(item => {
            apiparam[item.label] = item.value;
        });
        this._controlService.setPageVarible(this.Filters, apiparam, this.AuthService);
        //this.control.chartOptions.chartTypeRefresh = this.control.chartOptions.chartType;
        //this.control.chartOptions.chartType = "";
        if (this.control.rawquery) {
            var query = this.control.rawquery;
            let currentUrl = this._router.url ? this._router.url : "/";
            if (currentUrl.indexOf('?') > -1) {
                currentUrl = currentUrl.split('?')[0];
            }
            let menu = this.AuthService.Menu;
            let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
            this.control.ResultApiParam.forEach(option => {
                var value = option.value;
                if (page) {
                    const activateParams = this._controlService.getQueryParams();
                    page.Params.forEach(pageoption => {
                        var param = this.control.ResultApiParam.find(x => x.value == pageoption.name);
                        if (param) {
                            let activeParam = activateParams.find(x => x[pageoption.name]);
                            if (activeParam) {
                                value = activeParam[pageoption.name];
                            } else {
                                value = pageoption.value;
                            }
                        }
                    })
                }
                var param = "{{" + option.key + "}}";
                query = query.replace(param, value)
                // query.replace(param, value)

            })
            apiparam.query = query;
        }
        if (refreshParam) {
            if (this.data[refreshParam.sourcecontrolkey] != '' && this.data[refreshParam.sourcecontrolkey] != undefined && this.data[refreshParam.sourcecontrolkey] != null) {
                apiparam[refreshParam.bindingfieldapi] = this.data[refreshParam.sourcecontrolkey];
            } else {
                return;
            }
        }
        this.RefreshData(true, apiparam)
    }

    select(data) {
        //console.log('Item clicked', data);
        var nameField = "";
        var valueField = "";
        var RField = ""; //for bubble chart
        this.control.ResultDisplayField.forEach(item => {
            if (item.ChartClickFilter.trim() !== '') {
                if (item.ChartField == 'X')
                    nameField = item.ChartClickFilter;
                else if (item.ChartField == 'Y')
                    valueField = item.ChartClickFilter;
                else
                    RField = item.ChartClickFilter;

                return;
            }
        });
        switch (this.control.chartOptions.inputFormat) {
            case "singleSeries": {
                if (nameField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": nameField, "Value": data.value });
                else if (valueField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": valueField, "Value": data.value });
                break;
            }
            case "multiSeries": {
                if (nameField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": nameField, "Value": data.name });
                else if (valueField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": valueField, "Value": data.value });
                break;
            }
            case "bubble": {
                if (nameField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": nameField, "Value": data.name });
                else if (valueField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": valueField, "Value": data.value });
                else if (RField !== '')
                    this._chartService.ChartFilterlist.push({ "Key": RField, "Value": data.value });
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
    }
    RefreshData(IsSearchClick: boolean, searchParam: any) {
        var apiparam: any = {};
        if (IsSearchClick == true) {
            apiparam = searchParam;
        }
        else {
            this.control.ResultApiParam.forEach(option => {
                apiparam[option.key] = option.value;
            })
            this._controlService.setPageVarible(this.control.ResultApiParam, apiparam, this.AuthService);
        }
        if (this.control.rawquery) {
            var query = this.control.rawquery;
            let currentUrl = this._router.url ? this._router.url : "/";
            if (currentUrl.indexOf('?') > -1) {
                currentUrl = currentUrl.split('?')[0];
            }
            let menu = this.AuthService.Menu;
            let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
            this.control.ResultApiParam.forEach(option => {
                var value = option.value;
                if (page) {
                    const activateParams = this._controlService.getQueryParams();
                    page.Params.forEach(pageoption => {
                        var param = this.control.ResultApiParam.find(x => x.value == pageoption.name);
                        if (param) {
                            let activeParam = activateParams.find(x => x[pageoption.name]);
                            if (activeParam) {
                                value = activeParam[pageoption.name];
                            } else {
                                value = pageoption.value;
                            }
                        }
                    })
                }
                var param = "{{" + option.key + "}}";
                query = query.replace(param, value)
                // query.replace(param, value)

            })
            apiparam.query = query;
        }
        switch (this.control.chartOptions.inputFormat) {
            case "singleSeries": {
                this._chartService.singleData(this.control.ResultApi, apiparam, this.control.ResultDisplayField, this.control.chartOptions.DirectMapping, this.control.key);
                break;
            }
            case "multiSeries": {
                this._chartService.MultiData(this.control.ResultApi, apiparam, this.control.ResultDisplayField, this.control.key, this.control.collectionmapping);
                break;
            }
            case "bubble": {
                this._chartService.BubbleData(this.control.ResultApi, apiparam, this.control.ResultDisplayField, this.control.key);
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
    }

    selectChart() {

        if (this._chartService.IsRefreshComplete[this.control.key] == false) return;

        this.control.chartOptions.chartType = this.control.chartOptions.chartTypeRefresh;
    }

    onLegendLabelClick(entry) {
        console.log('Legend clicked', entry);
    }

    statusValueFormat(c): string {
        switch (c.data.extra ? c.data.extra.format : '') {
            case 'currency':
                return `\$${Math.round(c.value).toLocaleString()}`;
            case 'time':
                return multiFormat(c.value);
            case 'percent':
                return `${Math.round(c.value * 100)}%`;
            default:
                return c.value.toLocaleString();
        }
    }

    currencyFormatting(c) {
        //return `\$${Math.round(c.value).toLocaleString()}`;
        return `\${Math.round(c.value).toLocaleString()}`;
    }

    gdpLabelFormatting(c) {
        //return `${c.label}<br/><small class="number-card-label">GDP Per Capita</small>`;
        return `${c.label}<br/><small class="number-card-label"></small>`;
    }

    statusLabelFormat(c): string {
        return `${c.label}<br/><small class="number-card-label">This week</small>`;
    }

    getFlag(country) {
        return this.countries.find(c => c.name === country).emoji;
    }

    onFilter(event) {
        console.log('timeline filter', event);
    }

    onSelect(event) {
        console.log(event);
    }

}

