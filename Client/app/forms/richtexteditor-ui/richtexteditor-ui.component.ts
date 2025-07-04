import { Component, OnInit, Input, OnChanges, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
    selector: 'app-richtexteditor-ui',
    templateUrl: './richtexteditor-ui.component.html',
    styleUrls: ['./richtexteditor-ui.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichtexteditorUiComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';
    @Input() public AuthService: any;
    @Input() public disabled: boolean = false;

    @ViewChild('editorRef') editor: ViewContainerRef;
    control_id: any
    pagesearchtext: any;
    ispagesearchparam: any = false;
    typingTimer: any
    constructor(private _Router: Router, public _controlService: FormControlService, private cd: ChangeDetectorRef,
        private _appService: DataService) { }

    model: any
    ngDoCheck() {
        if (this.model != this.data[this.control.key]) {
            this.model = this.data[this.control.key];
            if (this.cd !== null &&
                this.cd !== undefined &&
                !(this.cd as any).destroyed) {
                this.cd.markForCheck();
            }
        }
        if (this.control.require && this.formGroup.controls[this.control_id] && this.formGroup.controls[this.control_id].touched) {
            if (this.cd !== null &&
                this.cd !== undefined &&
                !(this.cd as any).destroyed) {
                this.cd.detectChanges();
            }
        }
    }
    ngOnDestroy() {
        if (this.editor) {
            this.editor = null;
        }
    }
    public editorOptions = {
        placeholder: "insert content..."

    };
    style: any = { height: '200px' }
    ngOnChanges() {
        this.style.height = this.control.height + 'px';
    }
    onEditorBlured(event) {
        this.data[this.control.key] = event;
        if (this.control.require && this.data[this.control.key] && this.data[this.control.key].trim() != '') {
            this.formGroup.controls[this.control_id].markAsUntouched();
        } else if (this.control.require && (!this.data[this.control.key] || this.data[this.control.key].trim() == '')) {
            this.formGroup.controls[this.control_id].markAsTouched();
        }
       
        this._controlService.getCssforMandatory(this.control, event);

        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }

        if (this.control.responseapiurl && !this.isApiCalling) {
            this.isApiCalling = true;
            this.typingTimer = setTimeout(this.CallResponseApi(this), 2000);
        }

        this.cd.markForCheck();
    }

    onContentChanged({ quill, html, text }) {
        if (this.control.require && this.data[this.control.key] && this.data[this.control.key].trim() != '') {
            this.formGroup.controls[this.control_id].markAsUntouched();
        } else if (this.control.require && (!this.data[this.control.key] || this.data[this.control.key].trim() == '')) {
            this.formGroup.controls[this.control_id].markAsTouched();
        }
        this._controlService.getCssforMandatory(this.control, this.data[this.control.key])

        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        if (this.control.responseapiurl && !this.isApiCalling) {
            this.isApiCalling = true;
            this.typingTimer = setTimeout(this.CallResponseApi(this), 2000);
        }

        this.cd.markForCheck();
    }
   /** onEditorKeyup(event) {
        if (this.control.require && this.data[this.control.key] && this.data[this.control.key].trim() != '') {
            this.formGroup.controls[this.control_id].markAsUntouched();
        } else if (this.control.require && (!this.data[this.control.key] || this.data[this.control.key].trim() == '')) {
            this.formGroup.controls[this.control_id].markAsTouched();
        }
        this.data[this.control.key] = event;
       // this._controlService.getCssforMandatory(this.control, event)

        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }

        // Don't trigger on every key press
        
        if (this.control.responseapiurl && !this.isApiCalling) {
            this.isApiCalling = true;
            this.typingTimer = setTimeout(this.CallResponseApi(this), 2000);
        }
       
        this.cd.markForCheck();
    }  **/
    isApiCalling: boolean = false;
    CallResponseApi(_this) {
        debugger;
        if (_this.typingTimer) {
            _this.isApiCalling = false;
            clearTimeout(_this.typingTimer);
        }
        try {
            if (_this.control.responseapiurl) {
                var currentUrl = _this._Router.url ? _this._Router.url : "/";
                if (currentUrl.indexOf('?') > -1) {
                    currentUrl = currentUrl.split('?')[0];
                }
                const menu = _this.AuthService.Menu;
                const page = _this._controlService.find(menu['Nav'], currentUrl.substring(1));


                const activateParams = _this._controlService.getQueryParams();
                let apiUrl = _this.control.responseapiurl;
                var param: any = {};
                var dataModel = {};
                if (!_this.control.rowquery) {
                    _this.control.responseapiparam.forEach(item => {
                        if (item.isdatamodel) {
                            param[item.key] = _this.data[item.value];
                        } else {
                            param[item.key] = item.value;
                        }
                        if (param[item.key] == item.value && page) {
                            const _param = page.Params.find(x => x.name == item.value)
                            if (_param) {
                                let activeParam = activateParams.find(x => x[_param.name]);
                                if (activeParam) {
                                    param[item.key] = activeParam[_param.name];
                                } else {
                                    param[item.key] = _param.value;
                                }
                            }
                        }
                    })
                    //_this._controlService.setPageVarible(_this.control.ApiParam.filter(x => x.isuploadonsubmitparam != true), param);

                    if (_this.control.responseapiparam && _this.control.responseapiparam.length > 0) {
                        var QueryStr = Object.keys(param)
                            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(param[k]))
                            .join('&');
                        apiUrl = apiUrl + '?' + QueryStr;
                    }
                } else {
                    // var rowQuery = _this.control.rowquery;
                    var rowQuery = JSON.parse(_this.control.rowquery);
                    _this.control.responseapiparam.forEach(option => {
                        if (option.isdatamodel) {
                            for (let item in rowQuery) {
                                if (rowQuery[item].indexOf(option.key) > 0) {
                                    rowQuery[item] = _this.data[option.value];
                                }
                            }
                            // rowQuery = rowQuery.replace("{{" + option.key + "}}", _this.data[option.value] ? _this.data[option.value] : null);
                        }
                        else if (page) {
                            page.Params.forEach(pOption => {
                                if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
                                    let activeParam = activateParams.find(x => x[pOption.name]);
                                    if (activeParam) {
                                        for (let item in rowQuery) {
                                            if (rowQuery[item].indexOf(option.key) > 0) {
                                                rowQuery[item] = activeParam[pOption.name] ? activeParam[pOption.name] : null;
                                            }
                                        }
                                        // rowQuery = rowQuery.replace("{{" + option.key + "}}", activeParam[pOption.name] ? activeParam[pOption.name] : null);
                                    } else {
                                        // rowQuery = rowQuery.replace("{{" + option.key + "}}", pOption.value ? pOption.value : null);
                                        for (let item in rowQuery) {
                                            if (rowQuery[item].indexOf(option.key) > 0) {
                                                rowQuery[item] = pOption.value ? pOption.value : null;
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    })

                    dataModel = rowQuery;
                }
                _this._appService.post(apiUrl, JSON.stringify(dataModel), param)
                    .subscribe((res: any) => {
                        debugger;
                        var data = res.data;
                        if (!data && res.status == "error") {
                            if (Array.isArray(_this.data[_this.control.modelmappingfield]) && _this.data[_this.control.modelmappingfield].length > 0)
                                _this.data[_this.control.modelmappingfield] = [];
                            return;
                        }
                        if (typeof data == 'object' && Array.isArray(data[_this.control.responsebindingfield])) {
                            if (Array.isArray(_this.data[_this.control.modelmappingfield]) && _this.data[_this.control.modelmappingfield].length > 0) {
                                if (data[_this.control.responsebindingfield].length > 0) {
                                    _this.data[_this.control.modelmappingfield] = data[_this.control.responsebindingfield];
                                    _this._controlService.RefreshDropdown({ controlkey: _this.control.modelmappingfield, props: 'refresh' });
                                }
                            } else {
                                _this.data[_this.control.modelmappingfield] = data[_this.control.responsebindingfield];
                                _this._controlService.RefreshDropdown({ controlkey: _this.control.modelmappingfield, props: 'refresh' });
                            }
                        }
                    },
                        err => {
                            console.log(err);
                        },
                        () => {
                            _this.isApiCalling = false;
                        }
                    );
            }
        } catch (e) {
            _this.isApiCalling = false;
        }
    }
    ngOnInit() {
        debugger;
        this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
        this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);

        if (!this.control.editable) {
            var currentUrl = this._Router.url ? this._Router.url : "/";
            if (currentUrl.indexOf('?') > -1) {
                currentUrl = currentUrl.split('?')[0];
            }
            const redirectUrl = currentUrl.substring(1);
            const menu = this.AuthService.Menu;
            const page = this._controlService.find(menu['Nav'], redirectUrl);
            this.pagesearchtext = '';

            if (page) {
                const activateParams = this._controlService.getQueryParams();
                page.Params.forEach(option => {
                    if (option.name === this.control.valueField) {
                        // this.pagesearchtext = option.value;
                        let activeParam = activateParams.find(x => x[option.name]);
                        if (activeParam) {
                            this.pagesearchtext = activeParam[option.name];
                        } else {
                            this.pagesearchtext = option.value;
                        }
                    } else if (option.name === 'pagesearchparam' && option.value != '') {
                        this.ispagesearchparam = true;
                        this.pagesearchtext = option.value;
                    }
                })
            }

            if (this.pagesearchtext && this.ispagesearchparam && this.data[this.control.key]) {
                const pagesearchtext = JSON.parse(this.pagesearchtext);
                pagesearchtext.forEach((item) => {
                    if (typeof item === "string" && item && item.trim() !== '' && this.data[this.control.key] && this.data[this.control.key].length > 50) {
                        item = item.replace('”', '');
                        item = item.replace('“', '');
                        item = item.replace('*', '');
                        if (item.trim() !== '') {
                            this.data[this.control.key] = this.data[this.control.key].replace(new RegExp(item.trim(), 'gi'), match => {
                                return '<span style="background-color:#ffff00;">' + match + '</span>';
                            });
                        }
                    } else if (item.value && item.value.trim() !== '' && this.data[this.control.key] && this.data[this.control.key].length > 50) {
                        this.data[this.control.key] = this.data[this.control.key].replace(new RegExp(item.value.trim(), 'gi'), match => {
                            return '<span style="background-color:#ffff00;">' + match + '</span>';
                        });
                    }
                })
            }
        }
        this.cd.markForCheck();
    }
}
