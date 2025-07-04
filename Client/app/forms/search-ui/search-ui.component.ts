declare var require;
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
const _ = require('lodash');
import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'app-search-ui',
    templateUrl: './search-ui.component.html',
    styleUrls: ['./search-ui.component.scss']
})
export class SearchUiComponent implements OnInit, OnChanges {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    busy: Subscription;
    page: number = 1;
    Pagination: string = "";
    filteredList: any;
    AutoSearchList: any
    resultList: any;
    DisplayField: any
    searchtext: string;
    showloadmore: boolean = false;
    DefaultUrl = 'http://suggestqueries.google.com/complete/search';
    DefaultParams = {
        hl: 'en',
        ds: 'yt',
        xhr: 't',
        client: 'youtube'
    };
    Pickfield: any;
    constructor(private _appService: DataService) { }

    ngOnInit() {
        this.filteredList = [];
        this.resultList = [];
        this.AutoSearchList = [];
    }
    ngOnChanges(control: any) {

        this.filteredList = [];
        this.resultList = [];
        this.AutoSearchList = [];

    }
    filter() {

        //if (this.data[this.control.key] !== "") {
        //        this.SearchApiCall(this.control.SearchApi);
        //} else {
        //    this.filteredList = [];
        //}
        var val = this.searchtext; //this.data[this.control.key];
        if (val) {
            this.SearchApiCall(this.control.SearchApi);

            if (this.filteredList.length > 0) {
                this.AutoSearchList = val ? this.filteredList.filter((s) => s[this.control.textfield].match(new RegExp(val, 'gi'))) : this.filteredList;
            }
        }
        else {
            this.AutoSearchList = [];
        }
    }

    GetResultView() {

        this.DisplayField = {};
        this.control.ResultDisplayField.forEach(option => {
            this.DisplayField[option.DisplayName] = option.BindingField;
        })

        this.ResultApiCall(this.control.ResultApi);
    }
    Search() {
        this.Pagination = "";

        this.resultList = [];
        this.GetResultView();

        this.AutoSearchList = [];
    }
    select(item: any) {

        if (item !== null)
            this.searchtext = item[this.control.textfield];

        this.AutoSearchList = [];
    }

    public datalist: any[];
    SearchApiCall(apiUrl: string) {

        let url = apiUrl;
        if (url) {
            let searchapiparam: any = {};
            if (this.searchtext.length >= 3) {
                if (apiUrl) {
                    this.control.SearchApiParams.forEach(option => {
                        searchapiparam[option.key] = option.value;
                    })
                    if (this.control.SearchApiQuery !== "")
                        searchapiparam[this.control.SearchApiQuery] = this.searchtext; //this.data[this.control.key];
                    // }
                    // else {
                    //     url = this.DefaultUrl;
                    //     searchapiparam = this.DefaultParams;
                    // }
                    //var List;
                    this._appService.get(url, searchapiparam)
                        .debounceTime(400)
                        .distinctUntilChanged()
                        .subscribe((data: any) => {
                            this.datalist = data;

                            this.SetData();
                        });
                }
            }
        }
    }

    SetData() {

        //this.datalist.forEach(option => {
        //    alert(JSON.stringify(option));
        //})
        this.datalist.forEach(item => {
            var arr: any = {};
            arr[this.control.textfield] = item[this.control.textfield];
            arr[this.control.valuefield] = item[this.control.valuefield];
            if (this.filteredList.filter(x => x[this.control.textfield] == arr[this.control.textfield]).length == 0) {
                this.filteredList.push(arr);
            }
        });

    }
    ResultApiCall(apiUrl: string) {
        let url = apiUrl;
        let resultapiparam: any = {};
        // ...using get request

        if (url) {
            this.control.ResultApiParam.forEach(option => {
                resultapiparam[option.key] = option.value;
            })
            if (this.control.SearchApiQuery !== "")
                resultapiparam[this.control.SearchApiQuery] = this.searchtext;//this.data[this.control.key];

            if (this.control.PageSizeParam !== "") {
                resultapiparam[this.control.PageSizeParam] = this.control.PageSize;
            }
            if (this.control.PageFromParam !== "") {
                resultapiparam[this.control.PageFromParam] = this.Pagination;
            }
            // }
            // else {
            //     url = this.DefaultUrl;
            //     resultapiparam = this.DefaultParams;
            // }
            //var List;
            this.busy = this._appService.get(url, resultapiparam)
                .debounceTime(400)
                .distinctUntilChanged()
                .subscribe((data: any) => {
                    //  var val = this.searchtext; //this.data[this.control.key].trim();
                    //this.resultList = data;

                    this.resultList = this.resultList.concat(data);

                    if (this.resultList) {
                        var rec = this.resultList.length
                        if (rec >= 20) {

                            this.showloadmore = true;
                        } else {
                            this.showloadmore = false;
                        }
                        if (this.resultList.length > 0) {
                            this.Pagination = this.resultList[this.resultList.length - 1].Bookmark;
                        }
                    }
                    //alert(this.Pagination);
                });
        }
    }

    validUrl(url: string) {
        var regex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
        return regex.test(url);
    }
    Add(data: any) {

        this.Pickfield = {};

        this.control.CollectionList.forEach(option => {

            this.Pickfield[option.CollectionField] = data[option.SearchField];
        })

        this.data[this.control.Collection].push(this.Pickfield);
        _.remove(this.resultList, function (item) {
            return item === data;
        });
    }
    Edit(data: any) {
        // alert(JSON.stringify(data));
    }
    Delete(data: any) {
        _.remove(this.data[this.control.Collection], function (item) {
            return item === data;
        });

    }

    Moveup(data: any) {

        var idx = this.data[this.control.Collection].findIndex(x => x.ID == data.ID);
        this.swap(this.data[this.control.Collection], idx, idx - 1);

    }
    Movedown(data: any) {
        var idx = this.data[this.control.Collection].findIndex(x => x.ID == data.ID);
        this.swap(this.data[this.control.Collection], idx, idx + 1);
    }
    swap(input: any, oldindex: any, newindex: any) {
        var temp = input[oldindex];

        input[oldindex] = input[newindex];
        input[newindex] = temp;
        return input;
    }
}
