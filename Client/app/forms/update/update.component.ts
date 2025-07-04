import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControlService } from '../form-control.service';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, OnChanges {
    @Input() public AuthService;

    page: number = 1;
    formList = [];
    deleteconfirm: string = "NO";
    filter: { formname: string, modalname: string } = { formname: "", modalname: "" };
    private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
    constructor(public _controlService: FormControlService, private _router: Router, private _appService: DataService, private modalService: NgbModal) { }
    ngOnInit() {
        //this.formList.push({ "Id": "abfb52ad-e27b-4355-6856-38f3d78eea5f", "FormName": "Register", "ModelName": "", "CreateEndpoint": "", "UpdateEndpoint": "", "GetEndpoint": "", "DeleteEndpoint": "", "ListEndpoint": "", "controls": [{ "id": "5296e079-6790-1e8a-7f1e-7cc137c0e637", "key": "FirstName", "Name": "Textbox", "label": "First Name", "placeholder": "First Name", "icon": "text_fields", "type": "textbox", "width": 6, "order": 1, "require": true, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "uuid": 3457331577700 }, { "id": "299e1668-e32d-051a-c409-1221eaa115a2", "key": "LastName", "Name": "Textbox", "label": "Last Name", "placeholder": "Last Name", "icon": "text_fields", "type": "textbox", "width": 6, "order": 2, "require": true, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "uuid": 7993798524870 }, { "key": "Email", "Name": "Email", "label": "Email", "placeholder": "Email", "icon": "email", "type": "email", "width": 6, "order": 3, "require": true, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "id": "6f0c7561-415a-62a5-1fbd-a3d3ff58c7fa", "uuid": 3129377562727 }, { "key": "Active", "Name": "Checkbox", "label": "Active", "placeholder": "Active", "icon": "check", "type": "checkbox", "width": 6, "order": 4, "require": false, "showinlist": false, "haschildren": false, "isTableView": false, "hasdatasource": false, "id": "792d5648-08f2-d9ed-06b3-e87ce59dc1a1", "uuid": 5535750115258 }, { "key": "Attributes", "Name": "Radio List", "label": "Radio List", "placeholder": "Radio List", "icon": "radio_button_checked", "type": "radio", "width": 6, "order": 5, "textfield": "key", "valuefield": "value", "require": false, "showinlist": false, "haschildren": false, "hasdatasource": true, "isTableView": false, "apiurl": "", "optionlist": [{ "key": "Male", "id": "5faa3645-50b2-0484-9365-982d186c5c66", "value": "Male" }, { "key": "Female", "id": "c89d06e9-276e-748d-2b8a-1209fc14d829", "value": "Female" }], "id": "56d149ec-4e8e-ed8a-6207-779e912180d0", "uuid": 2127342401156 }], "data": [{ "id": "abfb52ad-e27b-4355-6856-38f3d78eea5f", "FirstName": "Arun", "LastName": "Yadav", "Email": "arunyadav13@gmail.com", "Active": false, "Attributes": "Male" }] })
        //this.formList.push({ "Id": "7b951852-9807-6a62-3675-95988812b0b6", "FormName": "Contact", "ModelName": "", "CreateEndpoint": "", "UpdateEndpoint": "", "GetEndpoint": "", "DeleteEndpoint": "", "ListEndpoint": "", "controls": [{ "key": "Phone", "Name": "Phone", "label": "Phone", "placeholder": "Phone", "icon": "phone", "type": "phonenumber", "width": 6, "order": 3, "require": false, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "id": "79878291-adbf-24a0-58d7-bb9942ffd439", "uuid": 5403377384473 }, { "key": "Email", "Name": "Email", "label": "Email", "placeholder": "Email", "icon": "email", "type": "email", "width": 6, "order": 2, "require": true, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "id": "e0f64e8e-1a55-efb8-5ada-8af55352b136", "uuid": 5428239496165 }, { "id": "bca84a95-b575-6acb-c39f-166288e9ecb8", "key": "Website", "Name": "Textbox", "label": "Website", "placeholder": "Website", "icon": "text_fields", "type": "textbox", "width": 6, "order": 1, "require": false, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "uuid": 6902420909138 }, { "id": "ce46282b-283b-4585-0620-9857c0d38bd9", "key": "Comment", "Name": "Textbox", "label": "Comment", "placeholder": "Comment", "icon": "text_fields", "type": "textbox", "width": 6, "order": 4, "require": true, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "uuid": 4471452988380 }], "data": [{ "id": "7b951852-9807-6a62-3675-95988812b0b6", "Website": "www.arunyadav.com", "Email": "", "Phone": "7718006144", "Comment": "NA" }] })
        this.CallService();
    }
    ngOnChanges(change: any) {
        debugger;
        this._controlService.AuthService = this.AuthService;
    }
    Edit(data: any) {
        this._controlService.serviceData = data;
        this._router.navigate(['./forms/Edit']);
    }
    Create() {
        this._controlService.serviceData = null;
        this._router.navigate(['./Edit']);
    }
    Delete(item: any, content) {
        this.modalService.open(content, this.options).result.then((result) => {
            if (this.deleteconfirm == "YES") {
                //item.Isactive = "0";
                item.IsDeleted = "true";
                this._appService.post("api/AppData/update", item)
                    .subscribe(
                        (res: any) => {
                            this.CallService();
                        }
                    );
            }
            else {
                this.deleteconfirm == "NO";
            }
        });
    }
    Active(item: any) {
        item.Isactive = "0";
        //item.IsDeleted = "0";
        this._appService.post("api/AppData/update", item)
            .subscribe(
                (res: any) => {
                    this.CallService();
                }
            );
    }
    //Activate(item: any) {
    //    item.Isactive = "1";
    //    item.IsDeleted = "1";
    //    this._appService.post("api/AppData/update", item)
    //        .subscribe(
    //        (res: any) => {
    //            this.CallService();
    //        }
    //        );
    //}
    CallService() {
        let apiparam: any = {};
        apiparam.search = "";

        this.formList = [];
        this._appService.get("api/AppData/list", apiparam)
            .subscribe(
                (data: any) => {
                    data.forEach(item => {
                        var _arr: any = {};
                        _arr.Id = item.Id;
                        _arr.Formname = item.Formname;
                        _arr.ModelName = item.ModelName;
                        _arr.CreateEndpoint = item.CreateEndpoint;
                        _arr.DeleteEndpoint = item.DeleteEndpoint;
                        _arr.GetEndpoint = item.GetEndpoint;
                        _arr.ListEndpoint = item.ListEndpoint;
                        _arr.UpdateEndpoint = item.UpdateEndpoint;

                        _arr.AppName = item.AppName;
                        _arr.Isactive = item.Isactive;
                        _arr.UpdateDate = item.UpdateDate;//this.dateFormat(item.updateDate);

                        _arr.IsDeleted = item.IsDeleted;
                        _arr.CreateDate = item.CreateDate;//this.dateFormat(item.createDate);
                        _arr.DoaminName = item.DoaminName;

                        //_arr.CreateEndpointParams = item.CreateEndpointParams ? JSON.parse(item.CreateEndpointParams) : [];
                        //_arr.UpdateEndpointParams = item.UpdateEndpointParams ? JSON.parse(item.UpdateEndpointParams) : [];
                        //_arr.GetEndpointParams = item.GetEndpointParams ? JSON.parse(item.GetEndpointParams):[];
                        //_arr.DeleteEndpointParams = item.DeleteEndpointParams ? JSON.parse(item.DeleteEndpointParams) : [];
                        //_arr.ListEndpointParams = item.ListEndpointParams ? JSON.parse(item.ListEndpointParams) : [];

                        //_arr.controls = JSON.parse(item.controls);

                        this.formList.push(_arr);
                    })
                    // @ts-ignore
                    this.formList.sort(function (a, b) { return new Date(b.UpdateDate).getTime() - new Date(a.UpdateDate).getTime() });
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done")
                }
            );
    }
    dateFormat(originalTime: any) {
        var reTime = /(\d+\-\d+\-\d+)\D\:(\d+\:\d+\:\d+).+/;
        return originalTime.replace(reTime, '$1 $2');
    }
    getformList() {
        if (this.filter.formname.length > 0 && this.filter.modalname.length > 0) {
            return this.formList.filter(x => (x.Formname ? x.Formname : "").toLowerCase().indexOf((this.filter.formname ? this.filter.formname : "").toLowerCase()) > -1 || (x.ModelName ? x.ModelName : "").toLowerCase().indexOf((this.filter.modalname ? this.filter.modalname : "").toLowerCase()) > -1)
        } else
            if (this.filter.formname.length > 0) {

                return this.formList.filter(x => (x.Formname ? x.Formname : "").toLowerCase().indexOf((this.filter.formname ? this.filter.formname : "").toLowerCase()) > -1);
            } else if (this.filter.modalname.length > 0) {
                return this.formList.filter(x => (x.ModelName ? x.ModelName : "").toLowerCase().indexOf((this.filter.modalname ? this.filter.modalname : "").toLowerCase()) > -1)
            } else
                return this.formList;

    }
}
