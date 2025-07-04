import { Component, Input, DoCheck, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { DataService } from '../../core/services/data.service';
import { Subject } from 'rxjs/Subject';
import { RuntimeDirective } from '../runtime-component/runtime.directive';
import { RuntimeService } from '../runtime-component/runtime.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-panel-ui',
    templateUrl: './panel-ui.component.html',
    styleUrls: ['./panel-ui.component.scss']
})
export class PanelUiComponent implements DoCheck, OnInit, OnChanges, OnDestroy, AfterViewInit {

    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';

    @ViewChild(RuntimeDirective) appRuntime: RuntimeDirective;

    @Input() public filterdata: any = [];
    @Input() public AuthService;
    externalformJson: any
    externalModelJson: any
    externalformGroup: FormGroup
    isApiCalling: boolean = false;
    private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
    public hide = true;
    public Isvalid = false;
    private unsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor(public _controlService: FormControlService, private modalService: NgbModal,
        private _appService: DataService, private runtimeservice: RuntimeService, private cfr: ComponentFactoryResolver, private _router: Router) {

        this._controlService.panelrefreshCalled$
            .takeUntil(this.unsubscribe)
            .subscribe(
                (data) => {
                    debugger;
                    if (this.control.apiUrl && data && data.key === this.control.key) {
                        this.apiCall();
                    } else if (this.control.IsExternalFormLoad && data && (!data.key || data.key === this.control.key)) {
                        this.loadMetadata(this.control.formid);
                    } else if (this.control.isLoadAngularComponent && data) {
                        this.loadAngularComponent();
                    } 
                }
            );
    }
    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        // since we are using viewcontainerref call the method after view init and not in other lifecycles
        if (this.control.isLoadAngularComponent) {
            this.loadAngularComponent();
        } 
    }
    ngOnChanges() {
        if (this.control.IsExternalFormLoad && this.control.stopfirstload !== true) {
            this.loadMetadata(this.control.formid);
        }
        if (this.control.apiUrl) {
            this.apiCall();
        }
    }
    ngDoCheck(): void {
        this.checkvalidation();
    }
    getHeight() {
        const height = this.control.height && this.control.height > 0 ? this.control.height.toString() + 'px' : null;
        return height ? height : 'auto'
    }
    checkvalidation() {
        //  console.log("call");

        var totalfield = 2;
        var validfield = 0;

        // var str_array = str.split(',');
        if (this.control.validationfield && this.control.validationfield != "") {
            var str_array = this.control.validationfield.split(',');
            // console.log(JSON.stringify(str_array));
            totalfield = str_array.length;
            // console.log(JSON.stringify(totalfield));
            for (var i = 0; i < str_array.length; i++) {
                // alert(str_array[i]);
                // alert(this.data[str_array[i]]);
                if (str_array[i] != "") {
                    if (this.data[str_array[i]] && (this.data[str_array[i]] != "")) {
                        validfield++;
                    }
                }
            }
            // console.log(JSON.stringify(validfield));
        }
        // if (this.control.apiUrl) {
        //     this.apiCall();
        // }
        if (totalfield == validfield) {
            this.Isvalid = true;
        } else {
            this.Isvalid = false;
        }

    }
    apiCall() {
        let url = this.control.apiUrl;
        let apiparam: any = {};
        if (url) {
            this.control.apiParams.forEach(option => {
                if (option.isdatamodel) {
                    apiparam[option.key] = this.data[option.value];
                } else {
                    apiparam[option.key] = option.value;
                }
            })
            this._controlService.setPageVarible(this.control.apiParams, apiparam, this.AuthService);

            this._appService.get(url, apiparam).subscribe((data: any) => {
                if (Array.isArray(data)) {
                    const _data = data.length > 0 ? data[0] : {};
                    if (_data) {
                        this.control.responsemapping.forEach(item => {
                            if (item.responsefield) {
                                this.data[item.sourcefield] = _data[item.responsefield];
                            } else {
                                this.data[item.sourcefield] = data;
                            }
                        });
                    }
                } else if (data && typeof data === 'object') {
                    this.control.responsemapping.forEach(item => {
                        this.data[item.sourcefield] = data[item.responsefield];
                    });
                }
                this._controlService.ruleComponentDetectChanges();
            });
        }
    }
    loadMetadata(formid) {
        this.isApiCalling = true;
        this._controlService.formvalidation = {};
        this._controlService.formvalid = false;
        // debugger;
        this.externalformJson = null;
        this.externalModelJson = null;
        let apiparam: any = {};
        apiparam.id = formid;
        this._appService.get("api/AppData/get", apiparam)
            .subscribe(
                (data: any) => {
                    // debugger;
                    this.isApiCalling = false;
                    this.externalformGroup = this._controlService.toControlGroup(data.controls);
                    this.externalformJson = this._controlService.deepcopy(data);
                    // this.externalformJson.controls.forEach(control => {
                    //   this._controlService.addValidation(control, this.externalformGroup);
                    // })
                    this.GetModalData();
                },
                err => {
                    this.isApiCalling = false;
                    console.log(err);
                },
                () => {
                    //console.log("done")
                }
            );
    }
    GetModalData() {
        // debugger;
        let apiparam = {};
        var url = this.externalformJson.GetEndpoint;

        this.externalformJson.GetEndpointParams.forEach(option => {
            apiparam[option.key] = option.value;
        })
        this._controlService.setPageVarible(this.externalformJson.GetEndpointParams, apiparam, this.AuthService);
        if (url) {
            this.isApiCalling = true;
            this._appService.get(url, apiparam, false)
                .subscribe(
                    (data: any) => {
                        // debugger;
                        if (Array.isArray(data))
                            this.externalModelJson = data.length > 0 ? data[0] : this.externalformJson.ModelJson;
                        else if (typeof data == 'object')
                            this.externalModelJson = data;
                        else {
                            this.externalModelJson = { '': data };
                        }

                        this._controlService.GenerateDataJson(this.externalformJson.controls, this.externalModelJson, this.externalformGroup);

                        if (this.externalModelJson["id"] == "")
                            delete this.externalModelJson["id"];

                        this._controlService.ruleComponentDetectChanges();
                    },
                    err => {
                        console.log(err);
                    },
                    () => {
                        this.isApiCalling = false;
                        //console.log("done")
                    }
                );
        } else {
            // debugger;
            this.externalModelJson = this.externalformJson.ModelJson;

            this._controlService.GenerateDataJson(this.externalformJson.controls, this.externalModelJson, this.externalformGroup);

            if (this.externalModelJson["id"] == "")
                delete this.externalModelJson["id"];

            this._controlService.ruleComponentDetectChanges();
        }
    }

    loadAngularComponent() {
       // debugger;
        let angularcomponentname = this.control.component;
        let component = this.runtimeservice.getComponent(angularcomponentname);
        const componentFactory = this.cfr.resolveComponentFactory<any>(component);
        
        const viewContainerRef = this.appRuntime.viewcontainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        if (this.control.componentdata) {
            let pagevariables = this.getPageVariable();
            let dataobject = {};

          //  resolve the values of keys provided
            this.control.componentdata.forEach(obj => {
                let value = obj.value.trim();
                let key = obj.key.trim();
                if (this.data[value])
                    dataobject[key] = this.data[value] ;
                else if (pagevariables[value]) {
                    //if this variable is not found , search in page variables
                    dataobject[key] = pagevariables[value];
                } else {
                    // if not found anywhere, simply use the string form of value - no change to compoennet obj
                    dataobject[key] = obj.value;
                }
            }
            );

            componentRef.instance.data = dataobject;
        }
    }

    getPageVariable() {
        var data = {};
        let currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
        }
        const activateParams = this._controlService.getQueryParams();
        if (currentUrl) {
            let menu = this.AuthService.Menu;
            let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
            if (page) {
                page.Params.forEach(option => {
                    let activeParam = activateParams.find(x => x[option.name]);
                    if (activeParam) {
                        data[option.name] = activeParam[option.name];
                    } else {
                        data[option.name] = option.value;
                    }

                })
            }
        }
        return data;
    
    }
}
