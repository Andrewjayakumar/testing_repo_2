import { Injectable } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { MetalChartStackBar, MetalChartStackBar2 } from '../chart-ref/combo-chart-data';

@Injectable()
export class ChartService {
    //chart mapping data
    ChartFieldList: any;

    //chart select filter
    ChartFilterlist: any = [];

    //result
    single: any = {};
    multi: any = {};
    bubble: any = {};

    IsRefreshComplete: any = {};

    constructor(private _dataService: DataService) { }

    public singleData(api: string, apiparam: any, ResultDisplayField: any, DirectMapping: boolean, key: string) {
        this.single[key] = [];
        this.IsRefreshComplete[key] = false;
        if (!api) return;
        this.GetSingleChartData(api, apiparam, ResultDisplayField, DirectMapping, key);
    }
    public MultiData(api: string, apiparam: any, ResultDisplayField: any, key: string, collectionmapping?: any) {

        this.multi[key] = [];
        this.IsRefreshComplete[key] = false;
        if (!api) return;
        this.GetMultiChartData(api, apiparam, ResultDisplayField, key, collectionmapping);
    }
    public BubbleData(api: string, apiparam: any, ResultDisplayField: any, key: string) {

        this.bubble[key] = [];
        this.IsRefreshComplete[key] = false;
        if (!api) return;
        this.GetBubbleChartData(api, apiparam, ResultDisplayField, key);
    }

    private GetSingleChartData(api: string, params: any, ResultDisplayField: any, DirectMapping: boolean, key: string) {
        if (DirectMapping == true)
            this.DirectMapping(api, params, ResultDisplayField, key)
        else
            this.IndirectMapping(api, params, ResultDisplayField, key)

    }
    private DirectMapping(api: string, params: any, ResultDisplayField: any, key: string) {
        var mapping: any = {};
        ResultDisplayField.forEach(item => {
            if (item.BindingField && item.ChartField) {
                mapping[item.ChartField] = item.BindingField;
            }
        })
        this._dataService.get(api, params)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(
                (data: any) => {
                    var result = data && Array.isArray(data) ? data : [];
                    result.forEach(item => {
                        var singleSeries: any = {}
                        singleSeries.name = item[mapping["X"]];
                        singleSeries.value = item[mapping["Y"]];

                        this.single[key].push(singleSeries);
                    })
                    this.IsRefreshComplete[key] = true;
                })
    }
    private IndirectMapping(api: string, params: any, ResultDisplayField: any, key: string) {
        var mapping = [];
        var filter1 = ResultDisplayField.filter(x => x.ChartField == "X");
        var filter2 = ResultDisplayField.filter(x => x.ChartField == "Y");

        if (filter1.length > 1) {
            filter1.forEach(item => {
                if (item.BindingField) {
                    mapping.push(item.BindingField);
                }
            })
        } else if (filter2.length > 1) {
            filter2.forEach(item => {
                if (item.BindingField) {
                    mapping.push(item.BindingField);
                }
            })
        }

        this._dataService.get(api, params)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(
                (data: any) => {
                    //var result = data.reverse();
                    var result = data;
                    result = result.slice(0, 50);
                    result.forEach(item => {
                        mapping.forEach(mapItem => {
                            var singleSeries: any = {}
                            singleSeries.name = mapItem;
                            singleSeries.value = item[mapItem];
                            this.single[key].push(singleSeries);
                        })
                    })
                    this.IsRefreshComplete[key] = true;
                })
    }
    private GetMultiChartData(api: string, params: any, ResultDisplayField: any, key: string, collectionmapping: any = []) {
        // debugger;
        var mapping: any;
        var mapSeriesName = "";

        var filter1 = ResultDisplayField.find(x => x.ChartField == "X");
        var filter2 = ResultDisplayField.find(x => x.ChartField == "Y");

        var collectionField: string = '';
        if (filter1.iscollection || filter2.iscollection) {
            mapping = {};
            if (filter1.iscollection) {
                collectionField = filter1.BindingField;
                collectionmapping.forEach(item => {
                    mapping = item;
                })

                mapSeriesName = filter2.BindingField;

            } else if (filter2.iscollection) {
                collectionField = filter2.BindingField;
                collectionmapping.forEach(item => {
                    mapping = item;
                })

                mapSeriesName = filter1.BindingField;
            }

            this._dataService.get(api, params)
                .debounceTime(400)
                .distinctUntilChanged()
                .subscribe(
                    (data: any) => {
                        var result = data;
                        // var result = MetalChartStackBar2;
                        var mapkeys = this.getKeys(result, collectionField, mapping.key); // result.length > 0 ? result[0] : {};
                        mapkeys.forEach(mapKey => {
                            var MultiList: any = {};
                            MultiList.name = mapKey;
                            MultiList.series = [];
                            var singleSeries = [];
                            result.forEach(_result => {
                                var _data2 = _result[collectionField] ? _result[collectionField].filter(x => x[mapping.key] == mapKey) : [];
                                _data2.forEach(_collection => {
                                    var singleSeriesList: any = {};
                                    singleSeriesList.name = _result[mapSeriesName];
                                    singleSeriesList.value = _collection[mapping.value];
                                    singleSeries.push(singleSeriesList);
                                })
                            })
                            MultiList.series = singleSeries;
                            this.multi[key].push(MultiList);
                        });
                        this.IsRefreshComplete[key] = true;
                        //console.log(JSON.stringify(this.multi[key]));
                    })
        } else {
            filter1 = ResultDisplayField.filter(x => x.ChartField == "X");
            filter2 = ResultDisplayField.filter(x => x.ChartField == "Y");
            mapping = [];
            if (filter1.length > 1) {
                filter1.forEach(item => {
                    if (item.BindingField) {
                        mapping.push(item.BindingField);
                    }
                })

                let filter = ResultDisplayField.filter(x => x.ChartField == "Y");
                mapSeriesName = filter.length > 0 ? filter[0].BindingField : '';

            } else if (filter2.length > 1) {
                filter2.forEach(item => {
                    if (item.BindingField) {
                        mapping.push(item.BindingField);
                    }
                })

                let filter = ResultDisplayField.filter(x => x.ChartField == "X");
                mapSeriesName = filter.length > 0 ? filter[0].BindingField : '';
            }

            //filter = ResultDisplayField.filter(x => x.ChartField == "seriesValue");
            //var mapSeriesValue = filter.length > 0 ? filter[0].BindingField : '';


            this._dataService.get(api, params)
                .debounceTime(400)
                .distinctUntilChanged()
                .subscribe(
                    (data: any) => {
                        // debugger;
                        var result = data;
                        //var result = MetalChartStackBar2;
                        mapping.forEach(mapItem => {
                            var MultiList: any = {};
                            MultiList.name = mapItem;
                            MultiList.series = [];
                            var singleSeries = [];
                            result.forEach(item => {
                                var singleSeriesList: any = {};
                                singleSeriesList.name = item[mapSeriesName];
                                singleSeriesList.value = item[mapItem];
                                singleSeries.push(singleSeriesList);
                            })
                            MultiList.series = singleSeries;
                            this.multi[key].push(MultiList);
                        })
                        this.IsRefreshComplete[key] = true;
                        //console.log(JSON.stringify(this.multi[key]));
                    })
        }
    }
    private getKeys(result, collectionField, mappingkey) {
        var keys = [];
        if (result.length > 0) {
            result.forEach(item => {
                const collection: any = item[collectionField] ? item[collectionField] : []
                collection.forEach(_item => {
                    if (!keys.find(x => x === _item[mappingkey])) {
                        keys.push(_item[mappingkey]);
                    }
                })
            });
        }
        return keys;
    }
    private GetBubbleChartData(api: string, params: any, ResultDisplayField: any, key: string) {

        var mapping = [];
        var mapSeriesName = "";
        var mapSeriesR = "";

        var filter1 = ResultDisplayField.filter(x => x.ChartField == "X");
        var filter2 = ResultDisplayField.filter(x => x.ChartField == "Y");

        if (filter1.length > 1) {
            filter1.forEach(item => {
                if (item.BindingField) {
                    mapping.push(item.BindingField);
                }
            })

            let filter = ResultDisplayField.filter(x => x.ChartField == "Y");
            mapSeriesName = filter.length > 0 ? filter[0].BindingField : '';

            filter = ResultDisplayField.filter(x => x.ChartField == "R");
            mapSeriesR = filter.length > 0 ? filter[0].BindingField : '';

        } else if (filter2.length > 1) {
            filter2.forEach(item => {
                if (item.BindingField) {
                    mapping.push(item.BindingField);
                }
            })

            let filter = ResultDisplayField.filter(x => x.ChartField == "X");
            mapSeriesName = filter.length > 0 ? filter[0].BindingField : '';

            filter = ResultDisplayField.filter(x => x.ChartField == "R");
            mapSeriesR = filter.length > 0 ? filter[0].BindingField : '';
        }


        this._dataService.get(api, params)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(
                (data: any) => {
                    var result = data.reverse();
                    result = result.slice(0, 50);
                    if (filter1.length > 1) {
                        mapping.forEach(mapItem => {
                            let BubbleList: any = {};
                            BubbleList.name = mapItem;
                            BubbleList.series = [];
                            let singleSeries = [];
                            result.forEach(item => {
                                let singleSeriesList: any = {};
                                singleSeriesList.name = item[mapSeriesName];
                                singleSeriesList.x = item[mapItem];
                                singleSeriesList.y = item[mapSeriesName];
                                singleSeriesList.r = item[mapSeriesR];
                                singleSeries.push(singleSeriesList);
                            })
                            BubbleList.series = singleSeries;
                            this.bubble[key].push(BubbleList);
                        })
                    } else if (filter2.length > 1) {
                        mapping.forEach(mapItem => {
                            let BubbleList: any = {};
                            BubbleList.name = mapItem;
                            BubbleList.series = [];
                            let singleSeries = [];
                            result.forEach(item => {
                                let singleSeriesList: any = {};
                                singleSeriesList.name = item[mapSeriesName];
                                singleSeriesList.x = item[mapSeriesName];
                                singleSeriesList.y = item[mapItem];
                                singleSeriesList.r = item[mapSeriesR];
                                singleSeries.push(singleSeriesList);
                            })
                            BubbleList.series = singleSeries;
                            this.bubble[key].push(BubbleList);
                        })
                    }

                    this.IsRefreshComplete[key] = true;
                })
    }
}
