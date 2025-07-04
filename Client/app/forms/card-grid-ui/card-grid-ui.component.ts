import {
    Component, OnInit, Input, OnChanges, OnDestroy, ViewChild, ChangeDetectionStrategy,
    ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControlService } from '../form-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FindValueSubscriber } from 'rxjs/operators/find';
import { ExportToCsv } from '../../forms/export-to-csv';

@Component({
    selector: 'app-card-grid-ui',
    templateUrl: './card-grid-ui.component.html',
    styleUrls: ['./card-grid-ui.component.scss'],
    providers: [ExportToCsv],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardGridUiComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public AuthService: any;
    @ViewChild('usefulSwiper') usefulSwiper: any;
    page: number = 1;
    showloadmore: boolean = false;
    busy: Subscription;
    resultList: any = [];
    mappingFields: any = [];
    title: any = "";
    description: any = "";
    image: any = "";
    highlight: any = "";
    highlighter: any = []
    html: any;
    skill: any = "";
    loadingText: string = "";
    RedirectParams: any = [];
    RedirectFormId: any = "";
    advanceSearchformJson: any;
    advanceSearchModelJson: any;

    FormCardUI: any = null;
    CardformGroup: FormGroup;

    isApiCalling: boolean = false;
    totalCount: any
    defaultpagesearchsize: any;
    nosearchform: any = false;
    private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
    private _success = new Subject<string>();
    successMessage: string = "";
    Submitconfirm: string = "NO";
    config: any = {
        slidesPerView: 4,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 0
    };
    private unsubscribe: Subject<true> = new Subject<true>();
    constructor(private _appService: DataService,
        private _controlservice: FormControlService,
        private route: ActivatedRoute,
        private modalService: NgbModal, private _router: Router, private exportToCsv: ExportToCsv, private cd: ChangeDetectorRef) {
        this._controlservice.cardgridRefreshCalled$
            .takeUntil(this.unsubscribe)
            .subscribe(
                () => {
                    this.showloadmore = true;
                    this.resultList = [];
                    this.loadMore();
                }
            );
        this._controlservice.componentRefreshCalled$
            .takeUntil(this.unsubscribe)
            .subscribe(
                () => {
                   
                    if (this._controlservice.dataModel.length > 0) {
                        this.AddModelJson();
                        this.isApiCalling = false;
                        debugger;
                        if (this._controlservice.dataModel.length >= parseInt(this.control.PageSize)) {
                            this.showloadmore = true;
                        }
                    } else {
                        this.resultList = [];
                        this.loadMore();
                    }
                    this.cd.detectChanges();
                }
            );
    }
    detectChanges() {
        if (this.cd !== null &&
            this.cd !== undefined &&
            !(this.cd as any).destroyed) {
            this.cd.detectChanges();
        }
    }
    AddModelJson() {
        this._controlservice.dataModel.forEach(item => {
            this.resultList.push(item);
        });
    }
    ngOnInit() {
        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
        if (this.control.enableadvancesearch) {
            if (this.control.hiddenpageparamfield && this.control.hiddenpageparamfield.length > 0) {
                let pagevariablesToBeSet = [];
                let pageVariableValues = {};
                this.control.hiddenpageparamfield.forEach(item => {
                    pageVariableValues[item] = "";
                    pagevariablesToBeSet.push(item);
                });
                this._controlservice.setPageSearchVarible(pageVariableValues, null, pagevariablesToBeSet);
            }
            this.loadMetadata(this.control.advancesearchapimappingform);
        }
    }
    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
        debugger;
        if (this.usefulSwiper) {
            //this.usefulSwiper.swiper.clear();
        }
    }
    setMappingFields() {
        if (this.control.cardtype == 'CommonCard') {
            this.mappingFields = [];
            this.highlighter = [];
            var arr: any = {};

            this.control.ResultDisplayField.forEach(item => {
                if (item.fieldtype == 'title') {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.redirecturl = item.RedirectParam ? this.control.redirectOptions.formid : null;;
                    arr.redirectparam = item.TargetField;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.oneline = item.oneline;

                    this.title = arr;
                } else if (item.fieldtype == 'description') {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.redirecturl = item.RedirectParam ? this.control.redirectOptions.formid : null;;
                    arr.redirectparam = item.TargetField;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.oneline = item.oneline;
                    this.description = arr;
                } else if (item.fieldtype == 'image') {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.redirecturl = item.RedirectParam ? this.control.redirectOptions.formid : null;;
                    arr.redirectparam = item.TargetField;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.oneline = item.oneline;
                    this.image = arr;
                } else if (item.fieldtype == 'highlight') {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.infohighlighterprop = item.infohighlighterprop;
                    arr.oneline = item.oneline;
                    this.highlight = arr;
                } else if (item.enablehighlighter) {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.highlighterprop = item.highlighterprop;
                    arr.oneline = item.oneline;
                    this.highlighter.push(arr);
                } else if (item.fieldtype == 'skill') {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.oneline = item.oneline;
                    this.skill = arr;
                } else if (item.fieldtype == 'html') {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    this.html = arr;
                } else {
                    arr = {};
                    arr.key = item.DisplayName;
                    arr.value = item.BindingField;
                    arr.fieldtype = item.fieldtype;
                    arr.redirecturl = item.RedirectParam ? this.control.redirectOptions.formid : null;;
                    arr.redirectparam = item.TargetField;
                    arr.webnametype = item.webnametype;
                    arr.webicon = item.WebIcon;
                    arr.oneline = item.oneline;
                    if (item.Show === 'cardgrid' || item.Show === 'all' || !item.Show || item.Show == true) {
                        this.mappingFields.push(arr);
                    }
                }
            });
        }
    }
    cancelCall() {
        if (this.busy) {
            this.busy.unsubscribe();
            this.isApiCalling = false;
            this.cd.detectChanges();
        }
    }
    ngOnChanges(control: any) {

        if (this.route.children.length > 0) {
            this.route.children[this.route.children.length - 1].params.subscribe(params => {
                this.RedirectFormId = params["id"];
            });
        }

        this.resultList = [];
        if (this.control.enablecardfromfromui) {
            this.loadCardUI();
        } else {
            this.loadMore();
        }
    }
    loadCardUI() {
        this.FormCardUI = null;
        this.CardformGroup = null;
        let apiparam: any = {};
        apiparam.id = this.control.cardformid;
        this._appService.get("api/AppData/get", apiparam)
            .subscribe(
                (data: any) => {
                    this.CardformGroup = this._controlservice.toControlGroup(data.controls);
                    this.FormCardUI = this._controlservice.deepcopy(data);
                   
                    this.loadMore();
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done")
                }
            );
    }
    loadMore() {
        //if (this.control.enableadvancesearch) {
        //  this.SearchApiCall();
        //}
        //else
      
        this.setMappingFields();
        if (!this.control.enableadvancesearch) {
            if (this.control.filterresult == true) {
                if (this.control.PagingType == 'server') {
                    if (this.control.isNestedResult) {

                        this.resultList = this._controlservice.formatResult(Array.isArray(this.data[this.control.key]) ? this.data[this.control.key].slice(0, this.control.PageSize) : []);
                    } else {
                        this.resultList = Array.isArray(this.data[this.control.key]) ? this.data[this.control.key].slice(0, this.control.PageSize) : [];
                    }
                    if (this.resultList.length >= this.control.PageSize) {
                        this.showloadmore = true;
                    }
                    // if (this.resultList.length == 0) {
                    //     this.ResultApiCall();
                    // }
                } else {
                    if (this.control.isNestedResult) {

                        this.resultList = this._controlservice.formatResult(this.data[this.control.key] ? this.data[this.control.key] : []);
                    } else {
                        this.resultList = this.data[this.control.key] ? this.data[this.control.key] : [];
                    }

                }
                this.detectChanges();
            } else {
                this.ResultApiCall();
            }
        }
    }
    ResultApiCall(isExportClick = false) {
        var url = this.data[this.control.key + '_filterParam'] ? this.data[this.control.key + '_filterParam'].apiurl : this.control.ResultApi;
        var resultapiparam: any = this.data[this.control.key + '_filterParam'] ? this.data[this.control.key + '_filterParam'].params : {};
        // ...using get request
        if (url) {
            this.isApiCalling = true;
            var _return = false;
            if (this._controlservice.formInput[this._controlservice.Id] && this._controlservice.formInput[this._controlservice.Id].length > 0) {
                let filterParams = this._controlservice.formInput[this._controlservice.Id];
                this.control.ResultApiParam.forEach(option => {
                    let val = filterParams.find(x => x.key == option.key)
                    if (val) {
                        resultapiparam[option.key] = val.value;
                    }
                    else
                        resultapiparam[option.key] = option.value;
                })
            } else if (this._controlservice.formParams[this.RedirectFormId]) {
                if (this._controlservice.formParams[this.RedirectFormId].length > 0) {

                    this.control.ResultApiParam.forEach(option => {
                        var val = this._controlservice.formParams[this.RedirectFormId].find(x => x.key == option.key)
                        if (val)
                            resultapiparam[option.key] = val.value;
                        else
                            resultapiparam[option.key] = option.value;
                    })

                } else {
                    this.control.ResultApiParam.forEach(option => {
                        resultapiparam[option.key] = option.value;
                    })
                }
            } else if (this.control.isTableView == true) {
                console.log("parameters not set!");
                _return = true;
            } else if (!this.data[this.control.key + '_filterParam']) {
                this.control.ResultApiParam.forEach(option => {
                    //if (option.value == "" && option.Filter == true) _return = true;
                    resultapiparam[option.key] = option.value;
                })
                if (this.control.currenttime) {
                    resultapiparam[this.control.currenttimeparam] = new Date().toLocaleString('local', { hour12: false });
                }
                this._controlservice.setPageVarible(this.control.ResultApiParam, resultapiparam, this.AuthService);
            }
            if (_return) {
                return;
            }
            if (this.control.PagingType == 'server') {
               // debugger;
                if (this.control.PageSizeParam !== "") {
                    resultapiparam[this.control.PageSizeParam] = this.control.PageSize;
                }
                if (this.control.PageFromParam !== "") {
                    const index = isExportClick ? 0 : Math.ceil(this.resultList.length / parseInt(this.control.PageSize)) + 1;

                    resultapiparam[this.control.PageFromParam] = index;

                    if (this.control.pagenumbers) {
                        resultapiparam[this.control.PageFromParam] = this.page;
                    }
                }
            }

            this.loadingText = "loading..";
            if (this.control.rawquery) {
                var query = this.control.rawquery;
                let currentUrl = this._router.url ? this._router.url : "/";
                if (currentUrl.indexOf('?') > -1) {
                    currentUrl = currentUrl.split('?')[0];
                }
                let menu = this.AuthService.Menu;
                let page = this._controlservice.find(menu['Nav'], currentUrl.substring(1));
                this.control.ResultApiParam.forEach(option => {
                    var value = option.value;
                    if (page) {
                        const activateParams = this._controlservice.getQueryParams();
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
                resultapiparam.query = query;
            }
            this.busy = this._appService.get(url, resultapiparam, false)
                .debounceTime(400)
                .distinctUntilChanged()
                .subscribe((data: any) => {
                    this._controlservice.dataModel = [];
                    if (isExportClick) {
                        if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
                            this.ExportToExcel(data[this.control.apifieldforresponse]);
                        } else if (Array.isArray(data)) {
                            this.ExportToExcel(data);
                        }
                    } else {
                        if (this.control.PagingType == 'client' && Array.isArray(data)) {
                            if (this.control.isNestedResult) {
                                this.resultList = this._controlservice.formatResult(data);
                            } else {
                                this.resultList = data;
                            }

                        } else if (Array.isArray(data)) {

                            if (this.control.apifieldforcounts) {
                                this.totalCount = data[this.control.apifieldforcounts];
                            }

                            if (this.control.isNestedResult) {

                                this.resultList = this.resultList.concat(this._controlservice.formatResult(data));
                            } else {
                                if(this.control.pagenumbers)
                                    this.resultList = data; // pagination override the result set for every page
                                else
                                  this.resultList = this.resultList.concat(data);
                            }
                            var rec = this.resultList.length
                            if (Array.isArray(data) && data.length == parseInt(this.control.PageSize)) {
                                this.showloadmore = true;
                            } else {
                                this.showloadmore = false;
                            }
                        }
                    }
                    this.detectChanges();
                },
                    err => {
                        this.isApiCalling = false;
                        this.loadingText = "";
                        this.detectChanges();
                        console.log(err);
                    },
                    () => {
                        this.isApiCalling = false;
                        this.loadingText = "";
                        this.detectChanges();
                    });
        }
    }

    SearchApiCall(isExportClick = false) {
        debugger;
        var url = this.control.ResultApi;
        let resultapiparam: any = {};
        //this.resultList = [];
        // ...using get request
        if (this.control.rememberlastsearched) {
            this._controlservice.setLocalStorage(this.advanceSearchModelJson, this.control.advancesearchapimappingform, this.AuthService);
        }
        if (!this.nosearchform && this.control.enableadvancesearch && !this.validateForm()) {
            return;
        }
        if (url) {
            this.isApiCalling = true;
            if (this.control.apimethod == "post") {
                var _searchModel: any = {};
                this.control.ResultApiParam.forEach(option => {
                    if (option.isdatamodel) {
                        _searchModel[option.key] = this.data[option.value];
                        resultapiparam[option.key] = this.data[option.value];
                    } else {
                        _searchModel[option.key] = option.value;
                        resultapiparam[option.key] = option.value;
                    }
                })
                if (this.advanceSearchformJson && this.advanceSearchModelJson) {
                    this.control.advancesearchapimapping.forEach(option => {
                        _searchModel[option.ApiParam] = this.advanceSearchModelJson[option.advancesearchfield];
                    })
                }
                if (this.control.PagingType == 'server') {
                    if (this.control.PageSizeParam !== "") {
                        //_searchModel[this.control.PageSizeParam] = this.control.PageSize;
                        if (this.defaultpagesearchsize) {
                            _searchModel[this.control.PageSizeParam] = this.defaultpagesearchsize;
                        } else {
                            _searchModel[this.control.PageSizeParam] = _searchModel[this.control.PageSizeParam] ? _searchModel[this.control.PageSizeParam] : this.control.PageSize;
                        }
                    }
                    if (this.control.PageFromParam !== "") {
                        const index = isExportClick ? 0 : Math.ceil(this.resultList.length / parseInt(_searchModel[this.control.PageSizeParam])) + 1;

                        // _searchModel[this.control.PageFromParam] = index;
                        _searchModel[this.control.PageFromParam] = _searchModel[this.control.PageFromParam] ? _searchModel[this.control.PageFromParam] : index;

                        if (this.control.pagenumbers) {
                            _searchModel[this.control.PageFromParam] = this.page;
                        }
                    }
                }
                this._controlservice.setPageVarible(this.control.ResultApiParam, _searchModel, this.AuthService);
                this._controlservice.setPageVarible(this.control.ResultApiParam, resultapiparam, this.AuthService);

                this.loadingText = "loading..";
                this.busy = this._appService.post(url, JSON.stringify(_searchModel), resultapiparam)
                    .debounceTime(400)
                    .distinctUntilChanged()
                    .subscribe((data: any) => {
                        this._controlservice.dataModel = [];
                        if (isExportClick) {
                            if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
                                this.ExportToExcel(data[this.control.apifieldforresponse]);
                            } else if (Array.isArray(data)) {
                                this.ExportToExcel(data);
                            }
                        } else {
                           // debugger;
                            if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
                                if (this.control.apifieldforcounts) {
                                    
                                    this.totalCount = data[this.control.apifieldforcounts];
                                }
                                /*
                                 * SAve Page Variables from the response api so that can be used in other pages
                                 * */
                                if (this.control.hiddenpageparamfield && this.control.hiddenpageparamfield.length > 0) {
                                    let pagevariablesToBeSet = [];
                                    let pageVariableValues = {};
                                    this.control.hiddenpageparamfield.forEach(item => {
                                        pageVariableValues[item] = data[item];
                                        pagevariablesToBeSet.push(item);
                                    });
                                    this._controlservice.setPageSearchVarible(pageVariableValues, null, pagevariablesToBeSet);
                                    this._controlservice.RefreshhiddenControl();
                                }
                                if (this.control.PagingType == 'client') {
                                    if (this.control.isNestedResult) {
                                        this.resultList = this._controlservice.formatResult(data[this.control.apifieldforresponse]);
                                    } else {
                                        this.resultList = data[this.control.apifieldforresponse];
                                    }
                                }
                                else {
                                  //  debugger;
                                    if (this.control.isNestedResult) {

                                        this.resultList = this.resultList.concat(this._controlservice.formatResult(data[this.control.apifieldforresponse]));

                                        if (this.control.pagenumbers) {
                                            //TODO change for pagenumbers
                                            this.resultList = data[this.control.apifieldforresponse];
                                        }
                                    } else {
                                        if (this.control.pagenumbers) {
                                            //TODO change for pagenumbers
                                            this.resultList = data[this.control.apifieldforresponse];
                                        }
                                        else 
                                          this.resultList = this.resultList.concat(data[this.control.apifieldforresponse]);
                                    }
                                    if (Array.isArray(data[this.control.apifieldforresponse]) && data[this.control.apifieldforresponse].length == 0) {
                                        this.showloadmore = false;
                                    } else {
                                        this.showloadmore = true;
                                    }
                                }
                            }
                            else if (Array.isArray(data)) {
                                if (this.control.PagingType == 'client') {
                                    if (this.control.isNestedResult) {
                                        this.resultList = this._controlservice.formatResult(data);
                                    } else {
                                        this.resultList = data;
                                    }
                                }
                                else {
                                    if (this.control.isNestedResult) {

                                        this.resultList = this.resultList.concat(this._controlservice.formatResult(data));
                                    } else {
                                        //TODO change for page numebrs
                                        this.resultList = this.resultList.concat(data);
                                    }
                                    var rec = this.resultList.length
                                    if (Array.isArray(data) && data.length == parseInt(this.control.PageSize)) {
                                        this.showloadmore = true;
                                    } else {
                                        this.showloadmore = false;
                                    }
                                }
                            } else {
                                if (this.control.PagingType == 'client') {
                                    this.resultList = [];
                                }
                            }
                            this.defaultpagesearchsize = null;
                            if (this.control.rememberlastsearched) {
                                this._controlservice.setLocalStorage(this.resultList.length, this.control.advancesearchapimappingform + 'pagesize', this.AuthService);
                            }

                            if (this.control.storeaspagesearchfromapi) {
                                this._controlservice.setPageSearchKeywords(data[this.control.storeaspagesearchapifield]);
                            }
                        }
                    },
                        err => {
                            this.isApiCalling = false;
                            this.loadingText = "";
                            this.detectChanges();
                            console.log(err);
                        },
                        () => {
                            this.isApiCalling = false;
                            this.loadingText = "";
                            this.detectChanges();
                        });
            } else {
                this.control.ResultApiParam.forEach(option => {
                    if (option.isdatamodel) {
                        resultapiparam[option.key] = this.data[option.value];
                    } else {
                        resultapiparam[option.key] = option.value;
                    }
                })
                if (this.advanceSearchformJson && this.advanceSearchModelJson) {
                    this.control.advancesearchapimapping.forEach(option => {
                        resultapiparam[option.ApiParam] = this.advanceSearchModelJson[option.advancesearchfield];
                    })
                }
                if (this.control.PagingType == 'server') {
                    if (this.control.PageSizeParam !== "") {
                        if (this.defaultpagesearchsize) {
                            resultapiparam[this.control.PageSizeParam] = this.defaultpagesearchsize;
                        } else {
                            resultapiparam[this.control.PageSizeParam] = resultapiparam[this.control.PageSizeParam] ? resultapiparam[this.control.PageSizeParam] : this.control.PageSize;
                        }
                    }
                    if (this.control.PageFromParam !== "") {
                        if (this.control.pagenumbers) {
                            resultapiparam[this.control.PageFromParam] = this.page;
                        } else {
                            const index = isExportClick ? 0 : Math.ceil(this.resultList.length / parseInt(this.control.PageSize)) + 1;

                            resultapiparam[this.control.PageFromParam] = resultapiparam[this.control.PageFromParam] ? resultapiparam[this.control.PageFromParam] : index;
                        }
                    }
                }
                this._controlservice.setPageVarible(this.control.ResultApiParam, resultapiparam, this.AuthService);

                this.loadingText = "loading..";
                this.busy = this._appService.get(url, resultapiparam)
                    .debounceTime(400)
                    .distinctUntilChanged()
                    .subscribe((data: any) => {
                        this._controlservice.dataModel = [];
                        if (isExportClick) {
                            if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
                                this.ExportToExcel(data[this.control.apifieldforresponse]);
                            } else if (Array.isArray(data)) {
                                this.ExportToExcel(data);
                            }
                        } else {
                            if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
                                if (this.control.apifieldforcounts) {
                                    this.totalCount = data[this.control.apifieldforcounts];
                                }
                                if (this.control.PagingType == 'client') {
                                    if (this.control.isNestedResult) {
                                        this.resultList = this._controlservice.formatResult(data[this.control.apifieldforresponse]);
                                    } else {
                                        this.resultList = data[this.control.apifieldforresponse];
                                    }
                                }
                                else {
                                    if (this.control.isNestedResult) {
                                        // TODO changes for page numbers
                                        this.resultList = this.resultList.concat(this._controlservice.formatResult(data[this.control.apifieldforresponse]));
                                    } else {
                                        this.resultList = this.resultList.concat(data[this.control.apifieldforresponse]);
                                    }
                                    if (Array.isArray(data[this.control.apifieldforresponse]) && data[this.control.apifieldforresponse].length == 0) {
                                        this.showloadmore = false;
                                    } else {
                                        this.showloadmore = true;
                                    }
                                }
                            }
                            else if (Array.isArray(data)) {
                                if (this.control.PagingType == 'client') {
                                    if (this.control.isNestedResult) {
                                        this.resultList = this._controlservice.formatResult(data);
                                    } else {
                                        this.resultList = data;
                                    }
                                }
                                else {
                                    if (this.control.isNestedResult) {

                                        this.resultList = this.resultList.concat(this._controlservice.formatResult(data));
                                    } else {
                                        this.resultList = this.resultList.concat(data);
                                    }
                                    var rec = this.resultList.length
                                    if (Array.isArray(data) && data.length == parseInt(this.control.PageSize)) {
                                        this.showloadmore = true;
                                    } else {
                                        this.showloadmore = false;
                                    }
                                }
                            } else {
                                if (this.control.PagingType == 'client') {
                                    this.resultList = [];
                                }
                            }
                            this.defaultpagesearchsize = null;
                            if (this.control.rememberlastsearched) {
                                this._controlservice.setLocalStorage(this.resultList.length, this.control.advancesearchapimappingform + 'pagesize', this.AuthService);
                            }
                            if (this.control.storeaspagesearchfromapi) {
                                this._controlservice.setPageSearchKeywords(data[this.control.storeaspagesearchapifield]);
                            }
                        }
                        this.detectChanges();
                    },
                        err => {
                            this.isApiCalling = false;
                            this.loadingText = "";
                            this.detectChanges();
                            console.log(err);
                        },
                        () => {
                            this.isApiCalling = false;
                            this.loadingText = "";
                            this.detectChanges();
                        });
            }
        }
    }
    form: FormGroup;
    loadMetadata(formid) {
        this._controlservice.formvalidation = {};
        this._controlservice.formvalid = false;
        this.advanceSearchformJson = null;
        this.advanceSearchModelJson = null;        
        this.form = null;
        let apiparam: any = {};
        apiparam.id = formid;
        if (formid) {
            this._appService.get("api/AppData/get", apiparam)
                .subscribe(
                    (data: any) => {
                        // debugger;
                        this._controlservice.formData = {};
                        this.form = this._controlservice.toControlGroup(data.controls);
                        this.advanceSearchformJson = this._controlservice.deepcopy(data);
                        if (this.control.rememberlastsearched) {
                            var _data: any = this._controlservice.deepcopy(this._controlservice.getLocalStorage(formid, this.AuthService));
                            this.advanceSearchModelJson = _data ? _data : this._controlservice.deepcopy(data.ModelJson);
                            // this.SearchApiCall();
                           
                        } else {
                            this.advanceSearchModelJson = this._controlservice.deepcopy(data.ModelJson);
                            // useful for reset
                        }
                        if (this.control.enabledefaultsearch) {
                            this.defaultpagesearchsize = this._controlservice.getLocalStorage(formid + 'pagesize', this.AuthService);
                            this.SearchApiCall();
                        } else {
                            this.defaultpagesearchsize = null;
                        }
                        this.detectChanges();
                    },
                    err => {
                        console.log(err);
                    },
                    () => {
                        //console.log("done")
                    }
                );
        } else {
            this.nosearchform = true;
            this.SearchApiCall();
        }
    }
    submitPin(content) {
        if (this._controlservice.dataModel.length > 0) {
            this.modalService.open(content, this.options).result.then((result) => {
                if (this.Submitconfirm == "YES") {
                    this._controlservice.buttonSidebarAction();
                }
                else {
                    this.Submitconfirm = "NO";
                }
            });
        }
        else
            this.changeSuccessMessage("Please select at least one item.")

        this.detectChanges();
    }
    changeSuccessMessage(messages: any = null) {
        this._success.next(messages);
    }
    ExportToExcel(data) {
        debugger;
        this.exportToCsv = new ExportToCsv();
        this.exportToCsv.GeneratecsvReport(this.control.exportfieldmapping, data, this.control.exportbuttontext);
    }
    validateForm() {
        debugger;
        var valid = true;
        var mandatoryCtrl = [];
        // This function deals with validation of the form fields
        this.advanceSearchformJson.controls.forEach(child => {
            if (child.haschildren) {
                child.children.forEach(_child => {
                    if (_child.require) {
                        mandatoryCtrl.push(_child)
                    }
                })
            }
            else if (child.require) {
                mandatoryCtrl.push(child)
            }
        })
        if (mandatoryCtrl.length > 0) {
            Object.keys(this._controlservice.formvalidation).forEach(
                (key) => {
                    const value: any = this._controlservice.formvalidation[key] ? this._controlservice.formvalidation[key] : {};
                    var control = mandatoryCtrl.find(x => x.key == key);
                    if (control && value.status == 'fail') {
                        valid = false;
                        var control_id = control.isTableView ? this.data['id'] + control.key : control.id;
                        if (this.form.controls[control_id]) {
                            this.form.controls[control_id].markAsTouched();
                        }
                    }
                    //arr.push({ "key": key, "value": value.status, "control": value.control });
                }
            );
        }
        return valid; // return the valid status
    }
    trackByFn(index, item) {
        if (!item) return null;
        return index;
    }

    resetSearchFields() {
        if (!this.nosearchform && this.control.enableadvancesearch) {
            this.advanceSearchModelJson = this._controlservice.deepcopy(this.advanceSearchformJson.ModelJson);
        }
    }

    onPageChange(event) {
        
        this.page = event;
        
        this.control.enableadvancesearch ? this.SearchApiCall() : this.ResultApiCall();
    }
}
