import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { Format } from "./datagrid/format";
import { DataGridUtil } from "./datagrid.util";
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-table-ui',
    templateUrl: './table-ui.component.html',
    styleUrls: ['./table-ui.component.scss']
})
export class TableUiComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    //private _success = new Subject<string>();
    staticAlertClosed = false;
    successMessage: string;
    busy: Subscription;
    page: number = 1;
    Pagination: string = "";
    resultList: any;
    searchtext: any;
    datefilter: string;
    usertypefilter: string;
    mindate: Date;
    maxdate: Date;
    AlldataList: any;
    AddformId: string = "b0b466fe-c0cb-4c65-b9ac-bded219f789c";
    addForm: any;
    AddModel: any;
    columns: any = [];// = [{ prop: "id" }, { prop: "Email", name: "Email Login" }, { prop: "First_name", name: "First Name" }, { prop: "Last_name", name: "Last Name" }, { prop: "CompanyName", name: "Company Name" }, { prop: "CreatedDate", name: "Creation Date" }];
    private unsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor(public _controlService: FormControlService, private _appService: DataService) {
        this._controlService.componentRefreshCalled$
            .takeUntil(this.unsubscribe)
            .subscribe(
                () => {
                    this.ResultApiCall();
                }
            );
    }
    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    ngOnInit() {
        //setTimeout(() => this.staticAlertClosed = true, 20000);
        //this._success.subscribe((message) => this.successMessage = message);
    }
    ngOnChanges(control: any) {
        this.setcolumn();
        this.ResultApiCall();
    }
    setcolumn() {
        this.control.ResultDisplayField.forEach(option => {
            this.columns.push({ prop: option.BindingField, name: option.DisplayName });
        })
    }

    ResultApiCall() {

        this.AlldataList = [];
        this.resultList = [];
        if (this.control.filterresult == true) {
            this.AlldataList = this.data[this.control.key] ? this.data[this.control.key] : [];
            this.resultList = this.data[this.control.key] ? this.data[this.control.key] : [];
        } else {
            let url = this.control.ResultApi;
            let resultapiparam: any = {};
            // ...using get request
            if (url) {
                this.control.ResultApiParam.forEach(option => {
                    resultapiparam[option.key] = option.value;
                })
                //var List;
                this.busy = this._appService.get(url, resultapiparam)
                    .debounceTime(400)
                    .distinctUntilChanged()
                    .subscribe((data: any) => {
                        this.AlldataList = data;
                        this.resultList = data;
                        // alert(JSON.stringify(this.resultList));
                    });
            }
        }
    }
    getUrl(type: string, row: any) {
        if (type == 'edit')
            return this.control.editurl + '?' + this.control.primarykeyfield + '=' + row[this.control.primarykeyfield]
        else if (type == 'delete')
            return this.control.deleteurl + '?' + this.control.primarykeyfield + '=' + row[this.control.primarykeyfield];
        else if (type == 'view')
            return this.control.viewurl + '?' + this.control.primarykeyfield + '=' + row[this.control.primarykeyfield];
        else return '';
    }
    IsChild(col: any) {
        return col ? col.BindingField.indexOf("~") >= 0 ? true : false : false;
    }
    getChildvalue(row: any, col: any) {
        var arr = col.BindingField.split("~")
        var data = arr.length > 0 ? row[arr[0]] : null;
        return data != null && arr.length > 1 ? this.GetValue(data, { "BindingField": arr[1] }) : "";
    }
    GetValue(row, col: any) {

        if (row[col.BindingField] != null) {
            if (typeof row[col.BindingField] === "number" || typeof row[col.BindingField] === "string") {
                return row[col.BindingField];
            }
            var date = new Date(row[col.BindingField]);
            if (date instanceof Date) {
                return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' at ' + this.formatAMPM(date);
            }
            else
                return row[col.BindingField];
        } else {
            return row[col.BindingField];
        }
    }

    filter() {
        this.resultList = this.AlldataList;
        var val = this.searchtext;
        if (val) {


            if (this.AlldataList.length > 0) {
                this.resultList = val ? this.AlldataList.filter((s) =>

                    s.First_name.match(new RegExp(val, 'gi')) || s.Email.match(new RegExp(val, 'gi')) || s.Last_name.match(new RegExp(val, 'gi'))


                ) : this.AlldataList;
            }
        }
        else {
            // this.resultList = [];
        }
        // alert(JSON.stringify(this.resultList));
        if (this.mindate && this.maxdate) {
            this.resultList = this.resultList.filter((s) => Date.parse(s.LastLogin) >= Date.parse(this.mindate.toString()));
        }
    }
    clearfilter() {
        this.maxdate = null;
        this.mindate = null;
        this.datefilter = "";
        this.searchtext = "";
        this.resultList = this.AlldataList;
    }
    setFilterdate() {
        if (this.datefilter == "1") {

            this.maxdate = new Date();
            this.mindate = new Date();
            this.mindate.setDate(this.maxdate.getDate() - 1);

        }
        if (this.datefilter == "2") {

            this.maxdate = new Date();
            this.mindate = new Date();
            this.mindate.setDate(this.maxdate.getDate() - 2);

        }
        if (this.datefilter == "3") {

            this.maxdate = new Date();
            this.mindate = new Date();
            this.mindate.setDate(this.maxdate.getDate() - 3);

        }
        if (this.datefilter == "7") {

            this.maxdate = new Date();
            this.mindate = new Date();
            this.mindate.setDate(this.maxdate.getDate() - 7);


        }

        this.filter();
    }
    exporttoCSV() {
        let exprtcsv: any[] = [];
        (<any[]>JSON.parse(JSON.stringify(this.resultList))).forEach(x => {
            var obj = new Object();
            var frmt = new Format();
            for (var i = 0; i < this.control.ResultDisplayField.length; i++) {

                var date = new Date(x[this.control.ResultDisplayField[i].BindingField]);
                var type = "text"
                if (date instanceof Date) {
                    type = "date";
                }

                let transfrmVal = frmt.transform(x[this.control.ResultDisplayField[i].BindingField], type);
                obj[this.control.ResultDisplayField[i].BindingField] = transfrmVal;
            }
            exprtcsv.push(obj);
        }
        );
        DataGridUtil.downloadcsv(exprtcsv, "Userlist");
    }
    private _openedPreview: boolean = false;
    private _toggleSidebarPreview() {

        this._openedPreview = !this._openedPreview;

    }
    private _opened: boolean = false;
    private _toggleSidebarAdd() {
        this._opened = !this._opened;
        if (this._opened) {
            this.GetMetadata();
        }
    }
    GetMetadata() {
        this.addForm = null
        let apiparam: any = {};
        apiparam.id = this.AddformId;
        this.busy = this._appService.get("api/AppData/get", apiparam)
            .subscribe(
                (data: any) => {
                    this.addForm = this._controlService.deepcopy(data);
                    this.ResultApiCall();
                },
                err => {
                    console.log(err);

                },
                () => {
                    //console.log("done")
                }
            );
    }
    SaveData() {
        this.busy = this._appService.post(this.addForm.CreateEndpoint, JSON.stringify(this.addForm.ModelJson))
            .subscribe(
                (data: any) => {
                    // this.changeSuccessMessage();
                },
                err => {
                    console.log(err);
                },
                () => {

                }
            );
    }
    public changeSuccessMessage() {

        //this._success.next("User created successfully.");
    }
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }


}
