import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../core/services/data.service';
import { Subject } from 'rxjs/Subject';
import { UUID } from 'angular2-uuid';
// import { AuthService } from "../core/authservice/auth.service";
import { CustomValidators } from 'ng2-validation';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStoreManager } from '../core/authservice/local-store-manager.service';
import { DBkeys } from '../core/authservice/db-Keys';

@Injectable()
export class FormControlService {
  
    private cardgridRefreshCall = new Subject<any>();
    private componentRefreshCall = new Subject<any>();
    private componentResetCall = new Subject<any>();
    private googlePlacesResetCall = new Subject<any>();
    private dynamicFormFilterRefreshCall = new Subject<any>();
    private gridRefreshCall = new Subject<any>();
    private checkboxlistRefreshCall = new Subject<any>();
    private tableRefreshCall = new Subject<any>();
    private dropdownRefreshCall = new Subject<any>();
    private kanbanPinCall = new Subject<any>();
    private ButtonSideBarCall = new Subject<any>();
    private LabelCall = new Subject<any>();
    private TabRefreshCall = new Subject<any>();
    private fileuploadCall = new Subject<any>();
    private cardDtectChanges = new Subject<any>();
    private ruleDetectChanges = new Subject<any>();
    private dateDetectChanges = new Subject<any>();
    private pageRefreshCall = new Subject<any>();
    private hiddenRefreshCall = new Subject<any>();
    private chartRefreshCall = new Subject<any>();
    private panelrefreshCall = new Subject<any>();

    public componentResetCalled$ = this.componentResetCall.asObservable(); // Reset Components which are not directly bind with datajson.
    public componentRefreshCalled$ = this.componentRefreshCall.asObservable(); // Refresh Components which needs to be refresh from outside events.
    public cardgridRefreshCalled$ = this.cardgridRefreshCall.asObservable(); // refresh cardgrid component
    public dynamicFormFilterRefreshCalled$ = this.dynamicFormFilterRefreshCall.asObservable(); // refresh dynamic form for filter result.
    public googlePlacesResetCalled$ = this.googlePlacesResetCall.asObservable(); // Reset Components which are not directly bind with datajson.
    //refresh based on control binding
    public gridRefreshCalled$ = this.gridRefreshCall.asObservable();
    public checkboxlistRefreshCalled$ = this.checkboxlistRefreshCall.asObservable();
    public tableRefreshCalled$ = this.tableRefreshCall.asObservable();
    public dropdownRefreshCalled$ = this.dropdownRefreshCall.asObservable();

    public kanbanPinCalled$ = this.kanbanPinCall.asObservable();
    public ButtonSideBarCalled$ = this.ButtonSideBarCall.asObservable();
    public LabelCalled$ = this.LabelCall.asObservable();
    public TabRefreshCallCalled$ = this.TabRefreshCall.asObservable();
    public fileuploadCalled$ = this.fileuploadCall.asObservable();
    public cardDtectedChanges$ = this.cardDtectChanges.asObservable();
    public ruleDetectedChanges$ = this.ruleDetectChanges.asObservable();
    public dateDetectedChanges$ = this.dateDetectChanges.asObservable();
    public pageRefresh$ = this.pageRefreshCall.asObservable();
    public hiddenRefresh$ = this.hiddenRefreshCall.asObservable();
    public chartRefresh$ = this.chartRefreshCall.asObservable();
    public panelrefreshCalled$ = this.panelrefreshCall.asObservable();

    AuthService: any; // only using in formbuilder
    serviceData: any;
    formData: any = {};
    formDataId: string = '';
    formParams: any = {};
    formInput: any = {};
    _opened: boolean = false;
    _openedbuttonsidebar: boolean = false;
    _openedEditForm: boolean = false;
    _btnSidebarOpened: boolean = false;
    isSmallSidebar: boolean = false;
    formvalid: boolean = false;
    formvalidation: any = {};
    Id: string;
    // FormName: string;
    // ModelName: string;
    // CreateEndpoint: string;
    // UpdateEndpoint: string;
    // GetEndpoint: string;
    // DeleteEndpoint: string;
    // ListEndpoint: string;
    filterEditformId: string = '';
    filterEditformJson: any = null;
    formFilter: FormGroup;
    isReadOnlyMode: boolean = false;
    ActionMode: string = 'write';
    dataModel: any = [];
    actionlitemlist: any = [];
    constructor(private _dataService: DataService, private _router: Router,
        private localStorage: LocalStoreManager, public _activatedRoute: ActivatedRoute) { }

    RefreshPanelControl(refreshcomponentkey) {
        this.panelrefreshCall.next({ key: refreshcomponentkey });
    }
    RefreshhiddenControl() {
        this.hiddenRefreshCall.next();
    }
    cardComponentDtectChanges() {
        this.cardDtectChanges.next();
    }
    ruleComponentDetectChanges() {
        this.ruleDetectChanges.next();
    }
    dateComponentDetectChanges(componentkey?) {
        this.dateDetectChanges.next(componentkey? componentkey : null);
    }
    FileUploadComponentCall(refreshcomponentonclose: string, sidebarcloseonsubmit: boolean, formParams = null, _message: any, refreshcomponentkey?) {
        this.fileuploadCall.next({
            refreshcomponentonclose: refreshcomponentonclose,
            sidebarcloseonsubmit: sidebarcloseonsubmit, formParams: formParams,
            successmessage: _message,
            controlkey: refreshcomponentkey
        });
    }
    RefreshLabel() {
        this.LabelCall.next();
    }
    PinKanban() {
        this.kanbanPinCall.next();
    }
    buttonSidebarAction() {
        this.ButtonSideBarCall.next();
    }
    FilterRefresh(data, successmessage?, refreshcomponentkey?) {
        this.dynamicFormFilterRefreshCall.next({ isSearchClicked: data, successmessage: successmessage, formId: refreshcomponentkey });
    }

    ResetComponent() {
        this.componentResetCall.next();
    }

    ResetGooglePlaces() {
        this.googlePlacesResetCall.next();
    }

    RefreshComponent(controltype = null, message = null, refreshcomponentkey = null) {
        if (controltype === 'tab') {
            this.TabRefreshCall.next({ successmsg: message, controlkey: refreshcomponentkey });
        } else if (controltype === 'dropdown') {
            this.RefreshDropdown('refresh', false);
        } else if (controltype === 'page') {
            this.pageRefreshCall.next();
        } else if (controltype === 'panel') {
            this.RefreshPanelControl(refreshcomponentkey);
        } else if (controltype === 'update') {
            this.FilterRefresh('norefresh', message, refreshcomponentkey);
        }
        else if (controltype === "customaction" && !refreshcomponentkey) {
            this.componentRefreshCall.next(message);
        }
        else if (message != null) {
            this.componentRefreshCall.next();
            this.FilterRefresh('norefresh', message, refreshcomponentkey);
        } else {
            this.componentRefreshCall.next();
        }
    }

    RefreshCardGrid() {
        this.cardgridRefreshCall.next();
    }

    RefreshGrid(data: any = null) {
        if (data)
            this.gridRefreshCall.next({ props: JSON.stringify(data) });
        else
            this.gridRefreshCall.next();
    }

    RefreshCheckboxlist(data: any = null) {
        if (data)
            this.checkboxlistRefreshCall.next({ props: JSON.stringify(data) });
        else
            this.checkboxlistRefreshCall.next();
    }

    RefreshTableGrid(data: any = null) {
        if (data)
            this.tableRefreshCall.next({ props: JSON.stringify(data) });
        else
            this.tableRefreshCall.next();
    }

    RefreshDropdown(data: any = null, refreshfromothercontrol: boolean = true) {
        debugger;
        if (data && refreshfromothercontrol) {
            this.dropdownRefreshCall.next({ props: JSON.stringify(data) });
        } else if (!refreshfromothercontrol && data) {
            this.dropdownRefreshCall.next({ props: 'refresh' });
        } else {
            this.dropdownRefreshCall.next();
        }
    }
    RefreshChart(data: any = null) {
        if (data)
            this.chartRefreshCall.next({ props: JSON.stringify(data) });
        else
            this.chartRefreshCall.next();
    }

    public _toggleSidebar(id: any = null, data: any = null) {
        if (id) {
            this.formDataId = id;
            this.formData[id] = data;
        }
        else
            this.formData = [];

        this._opened = !this._opened;
    }
    public _toggleEditFormSidebar() {
        this._openedEditForm = !this._openedEditForm;
    }
    public GetStory(url: string, id: string) {
        let apiparam: any = {};
        if (id)
            apiparam.storyid = id;

        this._dataService.get(url, apiparam)
            .subscribe(
                (data: any) => {
                    this.formData[this.Id] = data;
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done")
                }
            );
    }
    public setFilterValue(key, data, filterdata, key2: string = '') {
        debugger;
        const model = filterdata.find(x => x.id === key)
        if (model) {
            if (model.type !== 'range' && model.type !== 'daterange' && model.type !== 'number')
                model.value = data;
            else {
                model.value[key2] = data;
            }
        }
    }
  public MandatoryPercComplete() {
    debugger;
        let _percentage = 0;
        if (this.formvalidation !== {}) {
            const arr = [];
            Object.keys(this.formvalidation).forEach(
                (key) => {
                    arr.push(this.formvalidation[key]);
                }
            );
            const Total = arr.length;
            const passCount = arr.filter(item => item === 'pass').length;


            _percentage = (passCount / Total) * 95;
        }
        return Math.round(_percentage);
    }

    public getCssforMandatory(control, data) {
        if (control.require === true) {
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    if (control.minimumselect > 0) {
                        if (data.length < control.minimumselect) {
                            this.formvalidation[control.key] = { "status": "fail", "control": control };
                            return "highlighted";
                        } else {
                            this.formvalidation[control.key] = { "status": "pass", "control": control };
                            return '';
                        }
                    } else if (control.maximumselect > 0) {
                        if (data.length > control.maximumselect) {
                            this.formvalidation[control.key] = { "status": "fail", "control": control };
                            return "highlighted";
                        } else {
                            this.formvalidation[control.key] = { "status": "pass", "control": control };
                            return '';
                        }
                    } else {
                        this.formvalidation[control.key] = { "status": "pass", "control": control };
                        return '';
                    }
                } else {
                    this.formvalidation[control.key] = { "status": "fail", "control": control };
                    this.formvalid = false;
                    return "highlighted";
                }
            } else if (control.charlimit > 0 && data) {
                if (data.length > control.charlimit || data.length == 0) {
                    this.formvalidation[control.key] = { "status": "fail", "control": control };
                    return "highlighted";
                } else {
                    this.formvalidation[control.key] = { "status": "pass", "control": control };
                    return '';
                }
            }
            else if (control.type === "phonenumber") {
                if (data.indexOf("_") > -1 || data.replace("-", "").length < 10) {
                    this.formvalidation[control.key] = { "status": "fail", "control": control };;
                    this.formvalid = false;
                    return "highlighted";
                }
                else {
                    this.formvalidation[control.key] = { "status": "pass", "control": control };;
                    return '';
                }
            }
            else if (data!==null && data!== undefined && ((typeof(data) === "object" && Object.keys(data).length > 0) || (typeof (data) != "object" && data.toString().trim() != ""))) {
                   
                this.formvalidation[control.key] = { "status": "pass", "control": control };;
                return '';
            }
            else {
                this.formvalidation[control.key] = { "status": "fail", "control": control };;
                this.formvalid = false;
                return "highlighted";
            }
        }
        else return '';
    }
    InitializeEditForm(dataId: any, isOtherForm = false, formid = null, pageUrl = "", actiontype = null, auth, isSmallsidebar?) {
       
        //if (this.filterEditformJson) {
        //  this.filterEditformJson.ModelJson = null;
        //  this.GetModalData(dataId);
        //} else if (this.filterEditformJson == null) {
        if (isSmallsidebar) {
            this.isSmallSidebar = true;
        }
        else
            this.isSmallSidebar = false;

        this.filterEditformJson = null;
        let apiparam: any = {};
        if (isOtherForm) {
            this.formvalidation = {};
            this.formvalid = false;
            apiparam.id = formid;
        } else
            apiparam.id = this.filterEditformId;

        this._dataService.get("api/AppData/get", apiparam)
            .subscribe(
                (data: any) => {
                    if (dataId && data && data.GetEndpoint && data.GetEndpoint != "")
                        data.ModelJson = null;
                    this.formFilter = this.toControlGroup(data.controls);
                    this.filterEditformJson = this.deepcopy(data);

                    this.GetModalData(dataId, pageUrl, actiontype, auth);
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done")
                }
            );
        //}
    }
    GetModalData(id: any, pageUrl = "", actiontype = null, auth) {
        let apiparam: any = {};
        var type = "";
        var paramtype = ""
        var url = this.filterEditformJson.GetEndpoint;

        if (actiontype == "sidebar") {
            this.filterEditformJson.GetEndpointParams.forEach(option => {
                if (option.key == "type") {
                    type = option.value;
                    apiparam[option.key] = option.value;
                }
                else if (option.key == "paramtype") {
                    paramtype = option.value;
                }
                else {
                    if (option.primarykey)
                        apiparam[option.key] = id;
                    else
                        apiparam[option.key] = option.value;
                }
            })
            if (pageUrl) {
                const activateParams = this.getQueryParams();
                let menu = auth.Menu;
                let page = this.find(menu['Nav'], pageUrl);
                if (page) {
                    page.Params.forEach(option => {
                        var param = this.filterEditformJson.GetEndpointParams.find(x => x.value == option.name)
                        if (param) {
                            let activeParam = activateParams.find(x => x[option.name]);
                            if (activeParam) {
                                apiparam[param.key] = activeParam[option.name];
                            } else {
                                apiparam[param.key] = option.value;
                            }
                        }
                    })
                }
            }
            if (paramtype == "inlineparam") {
                url = url + "/" + id;
            } else if (paramtype.toLowerCase() == "id") {
                apiparam.Id = id;
                if (type) {
                    apiparam.type = type;
                }
            }
        } else {

            this.filterEditformJson.GetEndpointParams.forEach(option => {
                apiparam[option.key] = option.value;
            })
            if (pageUrl) {
                const activateParams = this.getQueryParams();
                let menu = auth.Menu;
                let page = this.find(menu['Nav'], pageUrl);
                if (page) {
                    page.Params.forEach(option => {
                        var param = this.filterEditformJson.GetEndpointParams.find(x => x.value == option.name)
                        let activeParam = activateParams.find(x => x[option.name]);
                        if (activeParam) {
                            apiparam[param.key] = activeParam[option.name];
                        } else {
                            apiparam[param.key] = option.value;
                        }
                    })
                }
            }
        }
        if (url && url != "") {
            this._dataService.get(url, apiparam, false)
                .subscribe(
                    (data: any) => {
                        if (Array.isArray(data)) {
                            if (data.length > 0) {
                                this.filterEditformJson.ModelJson = data[0];
                            }
                        } else {
                            this.filterEditformJson.ModelJson = data;
                        }
                        if (!this.filterEditformJson.ModelJson) {
                            this.filterEditformJson.ModelJson = {};
                        }

                        this.GenerateDataJson(this.filterEditformJson.controls, this.filterEditformJson.ModelJson, this.formFilter, this.filterEditformJson.id);

                        if (this.filterEditformJson.ModelJson["id"] == "")
                            delete this.filterEditformJson.ModelJson["id"];

                        this.ruleComponentDetectChanges();
                    },
                    err => {
                        console.log(err);
                    },
                    () => {
                        //console.log("done")
                    }
                );
        } else {
            this.GenerateDataJson(this.filterEditformJson.controls, this.filterEditformJson.ModelJson, this.formFilter, this.filterEditformJson.id);

            if (this.filterEditformJson.ModelJson["id"] == "")
                delete this.filterEditformJson.ModelJson["id"];

            this.ruleComponentDetectChanges();
        }
    }
    validateModelJson() {

    }
    find(source, url) {
        for (var key in source) {
            var item = source[key];
            if (item.Url == url)
                return item;

            // Item not returned yet. Search its children by recursive call.
            if (item.children) {
                var subresult = this.find(item.children, url);

                // If the item was found in the subchildren, return it.
                if (subresult)
                    return subresult;
            }
        }
        // Nothing found yet? return null.
        return null;
    }
    public getLocalStorage(key, auth) {
        return this.localStorage.getDataObject(auth.currentUser.Fist_name + '~' + key);
    }
    public setLocalStorage(searchedModel, key, auth) {
        this.localStorage.savePermanentData(searchedModel, auth.currentUser.Fist_name + '~' + key);
    }
    public resetPageSearchVarible() {
        let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
        }
        // var currentPage = menu.Nav.find(x => x.Url == currentUrl.substring(1));
        var currentPage = this.find(menu['Nav'], currentUrl.substring(1));
       /* if (currentPage) {
            currentPage.Params.forEach(_item => {
                if (_item.name === 'pagesearchparam') {
                    _item.value = '';
                }
            });
        }*/
        this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
    }
    public setPageSearchKeywords(Keywords) {
        let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
        }
        // var currentPage = menu.Nav.find(x => x.Url == currentUrl.substring(1));
        var currentPage = this.find(menu['Nav'], currentUrl.substring(1));
        if (currentPage) {
            var pagesearchparam = currentPage.Params.find(x => x.name === 'pagesearchparam');
            if (pagesearchparam && Keywords) {
                pagesearchparam['value'] = Keywords;
            } else {
                if(Keywords)
                  currentPage.Params.push({ 'name': 'pagesearchparam', 'value': Keywords });
            }
        }
        this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
    }
    public setPageSearchVarible(data, controlkey, pagevariables = []) {
        let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
        }
        // var currentPage = menu.Nav.find(x => x.Url == currentUrl.substring(1));
        var currentPage = this.find(menu['Nav'], currentUrl.substring(1));
        if (currentPage) {
            let isExist = false;
            currentPage.Params.forEach(_item => {
                /*if (_item.name === 'pagesearchparam' && _item.value !== '&' && Array.isArray(data)) {
                    debugger;
                    var _data: any = _item.value ? JSON.parse(_item.value) : [];
                    // const _data1:any = this.deepcopy(_data);
                    _data = _data.filter(item => item.key !== controlkey);

                    data.forEach(item => {
                        if (item.trim() !== '') {
                            var arr: any = {};
                            arr.key = controlkey;
                            arr.value = item;
                            _data.push(arr);
                        }
                    })
                    _item.value = JSON.stringify(_data);
                    isExist = true;
                } else */
                if (Array.isArray(pagevariables)) {
                    isExist = true;
                    pagevariables.forEach(pagevariable => {
                        if (pagevariable == _item.name) {
                            _item.value = data[pagevariable];
                        }
                    })
                }
            });
            /*if (!isExist) {
                currentPage.Params.push({ 'name': 'pagesearchparam', 'value': JSON.stringify(data) });
            }*/
        }
        this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
    }
    getQueryParams() {
        var activateParams: any = [];

        var currentUrl = decodeURIComponent(window.location.href).split('?');
        if (currentUrl.length == 2) {
            var QueryParams = currentUrl[1].split('&');
            QueryParams.forEach(params => {
                var arr: any = params.split('=');
                if (arr.length == 2) {
                    var _arr: any = {};
                    _arr[arr[0]] = arr[1];
                    activateParams.push(_arr);
                }
            })
            // this._activatedRoute.queryParams.subscribe(params => {
            //   activateParams.push(params);
            // })
        }

        return activateParams;
    }
    public setPageVarible(ResultApiParam, apiparam, auth) {
        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
        }
        if (auth) {
            const menu = auth.Menu;
            const page = this.find(menu['Nav'], currentUrl.substring(1));
            const activateParams = this.getQueryParams();
            if (apiparam && page && Array.isArray(ResultApiParam)) {
                page.Params.forEach(option => {
                    const param = ResultApiParam.find(x => x.value == option.name)
                    if (param) {
                        let activeParam = activateParams.find(x => x[option.name]);
                        if (activeParam) {
                            apiparam[param.key] = activeParam[option.name];
                        } else {
                            apiparam[param.key] = option.value;
                        }
                    }
                })
            }
        }
    }
    RefreshBindingControls(controlKey: string, bindingControls: any = [], dataModal: any, optionlist: any) {
        bindingControls.forEach(control => {
            if (control.actiontype == "filter") {
                control.sourcecontrolkey = controlKey;
                this.formData[control.controlkey] = { props: JSON.stringify(control) };
                if (control.controltype == 'grid') {
                    this.RefreshGrid(control);
                } else if (control.controltype == 'table') {

                } else if (control.controltype == 'checkboxlist') {
                    this.RefreshCheckboxlist(control);
                } else if (control.controltype == 'dropdown') {
                    this.RefreshDropdown(control);
                } else if (control.controltype == 'chart') {
                    this.RefreshChart(control);
                }
            }
            else if (control.actiontype == "populate") {
                var selctedOption = optionlist.find(x => x.value == dataModal[controlKey]);

                if (control.controltype == 'grid' || control.controltype == 'table' || control.controltype == 'checkboxlist') {
                    dataModal[control.controlkey] = selctedOption.populatejson && selctedOption.populatejson != '' ? JSON.parse(selctedOption.populatejson)[control.controlkey] : [];
                    if (control.controltype == 'grid') {
                        this.RefreshGrid(control);
                    }
                }
                else
                    dataModal[control.controlkey] = selctedOption.populatejson && selctedOption.populatejson != '' ? JSON.parse(selctedOption.populatejson)[control.controlkey] : "";
            }
        })
    }
    public findControl(key: string, controls: any) {
        var _control;
        controls.forEach(control => {
            if (control.haschildren == true) {
                _control = this.findChildControl(key, control);
            }
            else {
                _control = control;
            }
        })
        return _control;
    }
    private findChildControl(key: string, control: any): any {
        if (control.haschildren == true) {
            for (let child of control.children) {
                if (child.key == key) {
                    return child;
                }
                if (child.haschildren == true) {
                    var _child = this.findChildControl(key, child);
                    if (_child)
                        return _child;
                }
            }
        }
        else if (control.key == key) {
            return control;
        }
    }
    /**
  * GenerateDataJson : This is final method called after control added to form and use to call SetControlValidator function.
  * @param control
  */
    GenerateDataJson(control: any,
        datamodel: any,
        form: any,
        resetData: boolean = false,
        formid: string = '',
        resetDataFromRules: boolean = false) {
        // if (datamodel.id !== "" && datamodel.id != null)
        //   this.Id = datamodel.id;
        for (var index = 0; index < control.length; index++) {
            if (datamodel[control[index].key] === '' || datamodel[control[index].key] == undefined || datamodel[control[index].key] == null || resetData == true) {
                if (control[index].type == 'dropdown') {
                    debugger;
                }
                if (control[index].type == 'checkbox') {
                    datamodel[control[index].key] = false;

                } else if (control[index].type == 'grid') {
                    datamodel[control[index].key] = [];
                }
                else if (control[index].type == 'list') {
                    datamodel[control[index].key] = [];
                }
                else if (control[index].type == 'multiselect') {
                    datamodel[control[index].key] = [];
                }
                else if (control[index].type == 'number') {
                    datamodel[control[index].key] = null;
                }
                else if (control[index].type == 'date') {
                    datamodel[control[index].key] = null;
                    // if (resetData)
                    //   this._controlService.ResetComponent();
                    if (resetData && !resetDataFromRules)
                        this.ResetComponent();
                }
                else if (control[index].type == 'label') {
                    if (control[index].viewtype != 'name') {
                        datamodel[control[index].key] = "";
                    }
                }
                else if (control[index].type == 'calender') {
                    if (control[index].filterresult != true)
                        datamodel[control[index].key] = [];
                    else
                        delete datamodel[control[index].key]
                }
                else if (control[index].type == 'table') {
                    if (control[index].filterresult != true)
                        datamodel[control[index].key] = [];
                    else
                        delete datamodel[control[index].key]
                } else if (control[index].type == 'cardgrid') {
                    if (control[index].filterresult != true)
                        datamodel[control[index].key] = [];
                    else
                        delete datamodel[control[index].key]
                } else if (control[index].type == 'kanban') {
                    if (control[index].filterresult != true)
                        datamodel[control[index].key] = [];
                    else
                        delete datamodel[control[index].key]
                } else if (control[index].type == 'map') {
                    if (control[index].filterresult != true)
                        datamodel[control[index].key] = [];
                    else
                        delete datamodel[control[index].key]
                } else if (control[index].type == 'advancegrid') {
                    if (control[index].filterresult != true)
                        datamodel[control[index].key] = [];
                    else
                        delete datamodel[control[index].key]
                }
                else if (control[index].type == 'button') {
                    control[index].notificationformid = formid;
                    if (!control[index].enableautovalidateonsubmit) {
                        delete datamodel[control[index].key];
                    }
                }
                else if (control[index].type == 'import') {
                    control[index].notificationformid = formid;
                }
                else if (control[index].type == 'bookmark') {
                    delete datamodel[control[index].key]
                }
                else if (control[index].type == 'googleplaces') {
                    datamodel[control[index].key] = null;
                    // if (resetData)
                    //   this._controlService.ResetComponent();
                    if (resetData && !resetDataFromRules)
                        this.ResetComponent();
                }
                else if (control[index].type == 'dropdown2') {
                    if (control[index].selectiontype === 'single') {
                        datamodel[control[index].key] = null;
                    } else {
                        datamodel[control[index].key] = [];
                    }
                }
                else if (control[index].haschildren == true) {
                    if (control[index].type == 'tab') {
                        datamodel[control[index].key] = "";
                    }
                    this.GenerateDataJson(control[index].children, datamodel, form, resetData, formid, resetDataFromRules);
                }
                else if (control[index].type == 'hidden' && resetData) {
                    // this.RefreshhiddenControl();
                }
                else {
                    datamodel[control[index].key] = '';
                    // if (resetData && control[index].type == 'dropdown')
                    //   this._controlService.ResetComponent();
                    if (resetData && control[index].type == 'dropdown' && !resetDataFromRules) {
                        this.ResetComponent();
                    }
                }
            }
            if (form) {
                this.addValidation(control[index], form);
            }
        }
    }
    public addValidation(control: any, form: any) {
        if (control.haschildren == true && control.type !== "grid") {
            for (let child of control.children) {
                this.SetControlValidator(child.type, child.id, child.require, child.haschildren, form, control.charlimit);
                if (control.haschildren == true)
                    this.addValidation(child, form);
            }
        }
        else {
            this.SetControlValidator(control.type, control.id, control.require, control.haschildren, form, control.charlimit);
        }
    }
    /**
     *  If any control is deleted on teh fly, remove it's corresponding id from formvalidation. e..g in table grid delete row
     * @param control
     */
    removeValidationOnDestroy(control: any) {

        if(this.formvalidation[control.key])
          delete this.formvalidation[control.key];
      
    }

    /**
   * SetControlValidator : This function dynmically set validation based of user selection and control type
   * @param type
   * @param key
   * @param require
   * @param haschild
   */
    SetControlValidator(type: string, key: string, require: boolean, haschild: boolean, form: any, charlimit: any) {
        if (form.controls[key]) {
            if (type === 'email') {
                if (require == true)
                    form.controls[key].validator = Validators.compose([Validators.required, CustomValidators.email]);
                else
                    form.controls[key].validator = Validators.compose([CustomValidators.email]);;
            }
            else if (type === 'phonenumber') {
                if (require == true)
                    form.controls[key].validator = Validators.compose([Validators.required, Validators.pattern("\\d{3}[\\-]?\\d{3}[\\-]?\\d{4}")]);
                else
                    form.controls[key].validator = Validators.compose([Validators.pattern("\\d{3}[\\-]?\\d{3}[\\-]?\\d{4}")]);
            }
            else if (type === 'date') {
                if (require == true)
                    form.controls[key].validator = Validators.compose([Validators.required, CustomValidators.date]);
                else
                    form.controls[key].validator = Validators.compose([CustomValidators.date]);
            }
            else if (type === 'website') {
                if (require == true)
                    form.controls[key].validator = Validators.compose([Validators.required, Validators.pattern("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})")]);
                else
                    form.controls[key].validator = Validators.compose([Validators.pattern("https?://.+")]);
            }
            else if (type === 'autocomplete') {
                if (charlimit && charlimit > 0) {
                    if (require == true) {
                        form.controls[key].validator = Validators.compose([Validators.required, Validators.maxLength(charlimit)]);
                    }
                    else {
                        form.controls[key].validator = Validators.compose([Validators.maxLength(charlimit)]);
                    }
                } else {
                    if (require == true) {
                        form.controls[key].validator = Validators.compose([Validators.required]);
                    }
                }
            }
            else if (type === 'textbox') {
                if (charlimit && charlimit > 0) {
                    if (require == true) {
                        form.controls[key].validator = Validators.compose([Validators.required, Validators.maxLength(charlimit)]);
                    }
                    else {
                        form.controls[key].validator = Validators.compose([Validators.maxLength(charlimit)]);
                    }
                } else {
                    if (require == true) {
                        form.controls[key].validator = Validators.compose([Validators.required]);
                    }
                }
            }
            else if (key === 'apiurl') {
                if (require == true)
                    form.controls[key].validator = Validators.compose([Validators.required, CustomValidators.url]);
                else
                    form.controls[key].validator = Validators.compose([CustomValidators.url]);
            }
            else if (haschild == false) {
                if (require == true)
                    form.controls[key].validator = Validators.compose([Validators.required]);
                else
                    form.controls[key].validator = Validators.compose([]);
            }
        }
    }
    public toControlGroup(controls: any[]) {
        const group: any = {};
        // Required
        controls.forEach(control => {
            this.addChildControls(control, group);
        });

        return new FormGroup(group);
    }

    private addChildControls(control: any, group: any) {
        if (control.haschildren == true && control.type !== "grid") {
            for (let child of control.children) {
                //if (child.id == "")
                child.id = UUID.UUID();

                //if (child.id)
                group[child.id] = new FormControl();

                if (control.haschildren == true)
                    this.addChildControls(child, group);
            }
        }
        else {
            control.id = UUID.UUID();
            //if (control.id)
            group[control.id] = new FormControl();
        }
    }

    /*****************************************************************COMMON FUNCTION********************************************************************************/
    /**
     * Common Functions
     * @param time
     */
    public tConvert24HrTo12Hr(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }
    /**
     * "2017-01-18T17:02:09.000+05:30" required
     * @param time
     */
    public ConvertToDate(time) {

        var t = new Date(time)

        return t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear();
    }
    /**
     * "2017-01-18T17:02:09.000+05:30" required
     * @param time
     */
    public ConvertToTime(time) {

        var t = new Date(time)

        var hr = ("0" + t.getHours()).slice(-2);
        var min = ("0" + t.getMinutes()).slice(-2);
        var sec = ("0" + t.getSeconds()).slice(-2);

        return hr + ":" + min + ":" + sec
    }
    groupBy(jsondata, key) {
        return jsondata.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    /**
    * This is common method use for copy json data into another object
    * @param o
    */
    deepcopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }
    formatResult(data: any) {
        // debugger;
        var Datalist: any = [];
        data.forEach((item) => {
            var row: any = {};

            for (var key in item) {
                if (item.hasOwnProperty(key)) {

                    if (typeof item[key] === 'object') {
                        var item2 = item[key];
                        for (var key2 in item2) {
                            if (item2.hasOwnProperty(key2)) {
                                row[key + "~" + key2] = item2[key2];
                            }
                        }

                    } else {
                        row[key] = item[key];
                    }

                }
            }
            Datalist.push(row);
        });
        return Datalist;
    }
    /*****************************************************************END COMMON FUNCTION********************************************************************************/

}
