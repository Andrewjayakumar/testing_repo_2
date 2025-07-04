import {
  Component, OnInit, Input, OnDestroy, AfterViewChecked, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { Observable } from 'rxjs/Observable';
// import { of } from 'rxjs/Observable/of';
// import { concat } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
 import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter } from 'rxjs/operators'
import '@angular/http';
import { Response } from '@angular/http';
import { of } from 'rxjs/Observable/of';
import { concat } from 'rxjs/Observable/concat';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../core/authservice/db-Keys';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dropdown3-ui',
  templateUrl: './dropdown3-ui.component.html',
  styleUrls: ['./dropdown3-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dropdown3UiComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges, DoCheck {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = "write";
  @Input() public AuthService: any;
  @Input() public disabled: boolean = false;

  dropdownList: any = [];
  control_id: any = null;
  isApiCalling: boolean = false;
  selectedNode: any = { name: '', id: '' };
  selectedNodeColl = [];
  form: FormGroup;
  advanceSearchformJson: any;
  advanceSearchModelJson: any;
  apidata$: Observable<any[]>;
  apidataLoading: boolean = false;
  apidatainput$ = new Subject<string>();
  modalRef: any
  title: any = "";
  image: any = "";
  description: any = "";
  mappingFields: any = [];
  highlight: any;
  highlighter: any;
  skill: any;
  textfield: string = null;
  isTypaheadInitialize: boolean = false;
  busy: Subscription;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private localStorage: LocalStoreManager,
    private modalService: NgbModal,
    public _appService: DataService,
    public _controlService: FormControlService,
    private _sanitizer: DomSanitizer,
    private _Router: Router, private cd: ChangeDetectorRef) {
    this._controlService.dropdownRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe((data: any) => {
        debugger;
        if (data && data.props === 'refresh') {
          if (this.modalRef) {
            this._controlService.formvalidation = {};
            this._controlService.formvalid = false;
            this._controlService.dataModel = [];
            this.modalRef.close();
          }
          this.dropdownList = [];
          this.getdata();
        } else {
          this.RefreshModalFromOtherControl(data)
        }
        this.cd.markForCheck()
      });
  }
  ngDoCheck() {
    if (this.control.require && this.formGroup.controls[this.control_id] && this.formGroup.controls[this.control_id].touched) {
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.cd.detectChanges();
      }
    }
  }
  RefreshModalFromOtherControl(param: any) {
    if (param) {
      var data = JSON.parse(param.props);
      if (this.control.key === data.controlkey) {
        this.dropdownList = [];
        this.isApiCalling = false;
        //this.data[this.control.key] = null;
        if (this.control.isLazyLoad) {
          this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
          this.loadAPi();
        } else {
          if (data.props == 'refresh') {
            this.getdata();
            this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
          } else {
            this.getdata(data);
          }
        }
      }
    }
    else {
      // this.getdata();
    }
  }
    ngOnDestroy() {
      
        if (this.control.require) {
          
            this._controlService.removeValidationOnDestroy(this.control);
            //this._controlService.RefreshDropdown(null, false);
            this.cd.markForCheck();
          //  this.cd.detectChanges();
        }
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    // Now let's also unsubscribe from the subject itself:
      // this.unsubscribe.unsubscribe();

    if (this.busy)
      this.busy.unsubscribe();
  }
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    // this.RefreshBindingControls();
    this.setMappingFields();
  }
  ngOnChanges(control: any) {
    debugger;
    this.textfield = this.control.textsearchfield ? this.control.textsearchfield : this.control.textfield
    this.dropdownList = [];
    if (this.data[this.control.key] === "" && this.control.selectiontype == 'single')
      this.data[this.control.key] = null;

    if (this._controlService.formData[this.control.key]) {
      this.RefreshModalFromOtherControl(this._controlService.formData[this.control.key]);
    }
    else if (this.control.isLazyLoad) {
      this.loadAPi();
    } else {
      this.getdata();
    }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
  }
  onFocus(e) {
    if (!this.isTypaheadInitialize) {
      this.isTypaheadInitialize = true;
      this.loadAPi(false);
    }
  }
  onChange(event: any = null) {
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);


    if (this.control.selectiontype == 'single' && this.control.storejsonnode == true) {
      var data;
      if (this.dropdownList.length > 0) {
        data = this.dropdownList.find(x => x[this.control.valuefield] == this.data[this.control.key])
        this.data[this.control.key + "_node"] = data;
      }
    }
    if (this.control.isLazyLoad || this.control.storetextfield) {
      if (event && event[this.textfield]) {
        this.data[this.textfield] = event[this.textfield];
      }
    }
    if (this.control.refreshpanelonchange) {
      this._controlService.RefreshPanelControl(this.control.panelkey);
    }
    this.RefreshBindingControls();
    this.updatePageVarible();
    this.cd.markForCheck()
  }
  ngAfterViewChecked() {
    if (this.access != 'write' && this.access != 'filter') {
      if (this.dropdownList && this.isApiCalling == false && this.dropdownList.length == 0) {
        // console.log("ngAfterViewChecked - Api Called")
        // this.isApiCalling = true;
        this.getdata();
      } else {
        if (this.control.selectiontype == 'single') {
          if (this.selectedNode.id != this.data[this.control.key]) {
            const selected: any = this.dropdownList.find(x => x[this.control.valuefield] == this.data[this.control.key]);
            // console.log("ngAfterViewChecked - selectedNode Called -" + JSON.stringify(selected) + " - dropdownList : " + JSON.stringify(this.dropdownList) + ' - value - ' + this.data[this.control.key]);
            this.selectedNode = { name: '', id: '' };
            this.selectedNode.name = selected ? selected.name : ""
            this.selectedNode.id = selected ? selected.id : ""
          }
          this.cd.markForCheck()
        } else {
          this.selectedNodeColl = [];
          this.data[this.control.key].forEach(value => {
            const selected: any = this.dropdownList.find(x => x[this.control.valuefield] == value);
            let data: any = {};
            data["name"] = selected ? selected.name : ""
            data["id"] = selected ? selected.id : ""
            this.selectedNodeColl.push(data);
          })
          this.cd.markForCheck()
        }
      }
    }
    //else if (this.selectedItems.length == 0 && this.data[this.control.key]) {
    //  this.getdata();
    //}
  }

  getClass() {
    if (this.control.require && this.formGroup.controls[this.control_id] && this.formGroup.controls[this.control_id].hasError('required') && this.formGroup.controls[this.control_id].touched)
      return 'border-danger';
    else
      return '';
  }
  addTag(name) {
    // debugger;
    var val: any = {};

    const event: any = this;
    const bindLabel: any = event.bindLabel ? event.bindLabel : 'key';

    const bindValue: any = event.bindValue ? event.bindValue : 'value';
    val[bindLabel] = name;
    val[bindValue] = name;
    return val;
  }
  selectAll() {
    // debugger;
    this.data[this.control.key] = this.dropdownList.map(x => x[this.control.valuefield]);
  }

  unselectAll() {
    this.data[this.control.key] = [];
  }
    getdata(refreshParam: any = null) {
    if (this.control.apiurl || this.control.ResultApi) {
      if (!this.isApiCalling) {
        this.isApiCalling = true;
        this.SearchApiCall(refreshParam);
      }
    }
    else {
      var data = null;
      if (this.control.outputtype == "number") {
        this.control.optionlist.forEach((item: any) => {
          item.value = parseInt(item.value) === NaN ? null : parseInt(item.value);
        })
      }
      if (refreshParam) {
        var list = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;
        this.dropdownList = list.filter(x => x[refreshParam.fieldbindingapi] == this.data[refreshParam.sourcecontrolkey]);
      }
      else
        this.dropdownList = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;

      this.setDefaultValue();

      this.updatePageVarible();

      this.cd.markForCheck()
    }
  }
  setDefaultValue() {
    if (Array.isArray(this.dropdownList) && this.dropdownList.length > 0) {
      var val = this.dropdownList ? this.dropdownList.find(x => x[this.control.valuefield] == this.data[this.control.key]) : null;
      if (this.control.autoselectfirstvalue == true) {
        if (this.control.selectiontype == 'single' && !val) {
          var _val = this.dropdownList[0];
          this.data[this.control.key] = _val[this.control.valuefield]
          this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
        } else if (this.control.selectiontype == 'multi' && Array.isArray(this.data[this.control.key]) && this.data[this.control.key].length == 0) {
          var _val = this.dropdownList[0];
          this.data[this.control.key].push(_val[this.control.valuefield]);
          this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
        }
      } else if (this.control.defaultselectedvalue) {
        if (this.control.selectiontype == 'single' && !val) {
          _val = this.dropdownList.find(x => x[this.control.valuefield] == this.control.defaultselectedvalue);
          if (_val) {
            this.data[this.control.key] = _val[this.control.valuefield]
            this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
          }
        } else if (this.control.selectiontype == 'multi' && Array.isArray(this.data[this.control.key]) && this.data[this.control.key].length == 0) {
          _val = this.dropdownList.find(x => x[this.control.valuefield] == this.control.defaultselectedvalue);
          if (_val) {
            this.data[this.control.key].push(_val[this.control.valuefield]);
            this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
          }
        }
      }
      this.onChange();
    }
  }
  SearchApiCall(refreshParam: any = null) {
    let url = this.control.ResultApi ? this.control.ResultApi : this.control.apiurl;
    let searchapiparam: any = {};
    var ParamList = this.control.ResultApi ? this.control.ResultApiParam : this.control.ApiParam;
    ParamList.forEach(option => {
      if (option.isdatamodel)
        searchapiparam[option.key] = this.data[option.value];
      else
        searchapiparam[option.key] = option.value;

      if (option.key == this.control.from)
        searchapiparam[option.key] = this.dropdownList.length == 0 ? option.value : this.dropdownList.length;

      if (option.key == this.control.search) {
        var _data = this.data[this.textfield] ? this.data[this.textfield] : this.data[this.control.key] ? this.data[this.control.key] : null;

        searchapiparam[option.key] = _data ? _data.substr(0, 1) : "";
      }
    })
    if (refreshParam) {
      if (this.data[refreshParam.sourcecontrolkey] && (this.data[refreshParam.sourcecontrolkey].length > 0 || !Number.isNaN(this.data[refreshParam.sourcecontrolkey]))) {
        if (Array.isArray(this.data[refreshParam.sourcecontrolkey])) {
          var parentModel = this.data[refreshParam.sourcecontrolkey];
          searchapiparam[refreshParam.bindingfieldapi] = JSON.stringify(parentModel);
        } else {
          searchapiparam[refreshParam.bindingfieldapi] = this.data[refreshParam.sourcecontrolkey];
        }
      }
      else {
        this.data[this.control.key] = null;
        this.onChange();
        this.isApiCalling = false;
        return;
      }
    }
    if (this.control.rawquery) {
      searchapiparam.query = this.control.rawquery;
      if (refreshParam) {
        var query = this.control.rawquery;
        var param = "{{" + refreshParam.bindingfieldapi + "}}";
        query = query.replace(param, this.data[refreshParam.sourcecontrolkey])
        searchapiparam.query = query;
      }
    }
    this._controlService.setPageVarible(ParamList, searchapiparam, this.AuthService);
    this.busy = this._appService.get(url, searchapiparam, this.control.enablecache)
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((data: any) => {
        this.isApiCalling = false;
        this.dropdownList = data;

        this.setDefaultValue();
        this.updatePageVarible();
        this.cd.detectChanges();
      },
        err => {
          this.isApiCalling = false;
          console.log(err);
          this.cd.detectChanges();
        },
        () => {
          //console.log("done")
        });
  }
  resetLazyLoading() {
    this.apidataLoading = false;
    return of([]);
  }
  private loadAPi(initialize = true) {
    debugger;
    var data = this.data[this.textfield] ? this.data[this.textfield] : this.data[this.control.key] ? this.data[this.control.key] : null;
    if (initialize && data && typeof data == 'string' && data.length > 0) {
      this.isTypaheadInitialize = false;
      let result: any = concat(
        of([]), // default items
        this.getApiData(data))
      this.apidata$ = result;
      this.RefreshBindingControls();
    } else {
        const minchars = this.control.minsearchchars ? this.control.minsearchchars : 0;
      let result: any = concat(
        of([]), // default items
        this.apidatainput$.pipe(
            filter(t => t && t.length > minchars),
          distinctUntilChanged(),
            tap(() => this.apidataLoading = true),
            debounceTime(200),
          switchMap(term => term ? this.getApiData(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.apidataLoading = false)
          ) : this.resetLazyLoading())
        )
      );
      this.apidata$ = result;
    }
    this.cd.markForCheck()
  }
    getApiData(term) {
    let url = this.control.ResultApi ? this.control.ResultApi : this.control.apiurl;
    let searchapiparam: any = {};
    var ParamList = this.control.ResultApi ? this.control.ResultApiParam : this.control.ApiParam;
    ParamList.forEach(option => {
      // searchapiparam[option.key] = option.value;
      if (option.isdatamodel)
        searchapiparam[option.key] = this.data[option.value];
      else
        searchapiparam[option.key] = option.value;

      if (option.key == this.control.from)
        searchapiparam[option.key] = this.dropdownList.length == 0 ? option.value : this.dropdownList.length;

      if (option.key == this.control.search) {
        searchapiparam[option.key] = term;
      }
    })

    return this._appService.get(url, searchapiparam);
  }
    RefreshBindingControls() {
    var apiRefrshCtrls = this.control.bindingwithothercontrols.filter(item => item.controltype != "");
    if (this.control.allowbindingwithcontrols == true && apiRefrshCtrls.length > 0) {
      this._controlService.RefreshBindingControls(this.control.key, this.control.bindingwithothercontrols, this.data, this.control.optionlist);
    }
    if (this.control.api) {
      this.refreshBindingControlsFromApi();
    }
  }
  refreshBindingControlsFromApi() {
    var apiurl = "";
    var apiparam: any = {};
    if (this.control.bindingwithothercontrols) {
      this.control.bindingwithothercontrols.forEach(control => {
        if (control.controltype == "") {
          this.data[control.controlkey] = '';
          if (this.control.storeaspagesearch) {
            this._controlService.setPageSearchVarible(this.data[control.controlkey] ? this.data[control.controlkey].split(",") : [], control.controlkey)
          }
        }
      });
    }
    // ...using get request
    apiurl = this.control.api;
    if (apiurl !== "") {
      this.control.apiparam.forEach(option => {
        apiparam[option.key] = option.value;
      })
      if (this.control.bindingqueryfield) {
        apiparam[this.control.bindingqueryfield] = this.data[this.control.key];
      }
      var _othis = this;
      this._appService.get(apiurl, apiparam, false)
        .subscribe((data: any) => {
          var dataOtption: any = {}
          if (Array.isArray(data) && data.length > 0)
            dataOtption = data[0];
          else if (typeof data == "object")
            dataOtption = data;

          _othis.control.bindingwithothercontrols.forEach(control => {
            if (control.controltype == "" && dataOtption) {
              _othis.data[control.controlkey] = dataOtption[control.bindingfield];
              if (this.control.storeaspagesearch) {
                this._controlService.setPageSearchVarible(_othis.data[control.controlkey] ? _othis.data[control.controlkey].split(",") : [], control.controlkey)
              }
            }
          });
          this.cd.markForCheck();
        });
    }
  }
  getValue() {
    var data = this.data[this.control.key + '_node']
    return data && data[this.control.key + '_name'] ? data[this.control.key + '_name'] : '';
  }
  getBackground(image, item) {
    if (image && item[image.value] && item[image.value] != '')
      return this._sanitizer.bypassSecurityTrustStyle(`url(${item[image.value]})`);
    else
      return this._sanitizer.bypassSecurityTrustStyle(`url(` + this.control.defaultcardimage + `)`);
  }
  setMappingFields() {
    this.mappingFields = [];
    var arr: any = {};
    if (Array.isArray(this.control.ResultDisplayField)) {
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
          this.image = arr;
        } else if (item.fieldtype == 'highlight') {
          arr = {};
          arr.key = item.DisplayName;
          arr.value = item.BindingField;
          arr.fieldtype = item.fieldtype;
          arr.webnametype = item.webnametype;
          arr.webicon = item.WebIcon;
          this.highlight = arr;
        } else if (item.enablehighlighter) {
          arr = {};
          arr.key = item.DisplayName;
          arr.value = item.BindingField;
          arr.fieldtype = item.fieldtype;
          arr.webnametype = item.webnametype;
          arr.webicon = item.WebIcon;
          arr.highlighterprop = item.highlighterprop;
          this.highlighter = arr;
        } else if (item.fieldtype == 'skill') {
          arr = {};
          arr.key = item.DisplayName;
          arr.value = item.BindingField;
          arr.fieldtype = item.fieldtype;
          arr.webnametype = item.webnametype;
          arr.webicon = item.WebIcon;
          this.skill = arr;
        } else {
          arr = {};
          arr.key = item.DisplayName;
          arr.value = item.BindingField;
          arr.fieldtype = item.fieldtype;
          arr.redirecturl = item.RedirectParam ? this.control.redirectOptions.formid : null;;
          arr.redirectparam = item.TargetField;
          arr.webnametype = item.webnametype;
          arr.webicon = item.WebIcon;
          this.mappingFields.push(arr);
        }
      });
    }
  }
  updatePageVarible() {
    // debugger;
    if (this.control.islinkpagevarible) {
      let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
      var currentUrl = this._Router.url ? this._Router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      if (currentUrl.indexOf('/forms/Edit') > -1) {
        currentUrl = "/forms/Edit";
      }
      var currentPage: any = menu.Nav.find(x => x.Url == currentUrl.substring(1));
      if (currentPage) {
        currentPage.Params.forEach(_item => {
          if (_item.name === this.control.pagevariblelink && _item.value !== "&") {
            _item.value = this.data[this.control.key];
          }
        });
      }
      this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
    }
    if (this.control.storeaspagesearch) {
      var data: any = [];
      if (this.control.selectiontype == 'single' && this.data[this.control.key]) {
        var _data: any = this.dropdownList.find(x => x[this.control.valuefield] === this.data[this.control.key]);
        if (_data) {
          data.push(_data[this.control.textfield]);
        }
      } else if (Array.isArray(this.data[this.control.key])) {
        this.data[this.control.key].forEach(item => {
          var _data: any = this.dropdownList.find(x => x[this.control.valuefield] === item);
          if (_data) {
            data.push(_data[this.control.textfield])
          } else {
            data.push(item)
          }
        })
      }
      if (data.length > 0) {
        this._controlService.setPageSearchVarible(data, this.control.key)
      }
    }
  }
  additemAction(content: any) {
    //this._controlService.ActionMode = 'write';
    //this._controlService._openedEditForm = !this._controlService._openedEditForm;
    //const isOtherForm = 'otherform';
    //this._controlService.InitializeEditForm(null, true,
    //  this.control.additemformid, null, "sidebar", this.AuthService);

    this.modalRef = this.modalService.open(content, { size: 'lg', windowClass: 'model-cw', backdrop: false, keyboard: false });
    //this.ActionMode = this.control.ViewType === "otherform" ? 'write' : action.SidebarViewType;
    this.loadMetadata(this.control.additemformid);


  }
  loadMetadata(formid) {
    this._controlService.formvalidation = {};
    this._controlService.formvalid = false;
    this._controlService.dataModel = [];
    this.advanceSearchformJson = null;
    this.advanceSearchModelJson = null;
    let apiparam: any = {};
    apiparam.id = formid;
    this._appService.get("api/AppData/get", apiparam)
      .takeUntil(this.unsubscribe)
      .subscribe(
        (data: any) => {
          this.form = this._controlService.toControlGroup(data.controls);
          this.advanceSearchformJson = this._controlService.deepcopy(data);
          this.advanceSearchModelJson = this._controlService.deepcopy(data.ModelJson);
          // this.advanceSearchformJson.controls.forEach(control => {
          //   this._controlService.addValidation(control, this.form);
          // })
          this.cd.markForCheck();
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }
}
