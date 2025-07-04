import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import 'rxjs/add/operator/map';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-dropdown-ui',
  templateUrl: './dropdown-ui.component.html',
  styleUrls: ['./dropdown-ui.component.scss'],
  providers: [DataService]
})

export class DropdownUiComponent implements OnInit, OnChanges,OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  public dataoptions = [];
  public dataApi = [];
  public control_id = null;
  mouseover: boolean = false;
  selectedvalue: string = "";
  isFilterApply: boolean = true;
  Filter: any = {};
  selvalueineditmode: any = { text: '', value: '' };

  busy: Subscription;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(public _appService: DataService, public _controlService: FormControlService) {
    this._controlService.componentResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
      () => {
        this.selectedvalue = "";
      }
      );
  }
  ngOnDestroy(){
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    // Now let's also unsubscribe from the subject itself:
    // this.unsubscribe.unsubscribe();
    if(this.busy)
      this.busy.unsubscribe();
  }
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;

    this.dataoptions = [];
    this.dataApi = [];

    //this.getdata();
    if (!this.control.apiurl)
      this.initializeddl();
  }
  ngOnChanges(control: any) {


    this.dataoptions = [];
    this.dataApi = [];
    if (this.data[this.control.key] && this.data[this.control.key].length > 0) {
      this.getValue(this.data[this.control.key], true);
      this.isFilterApply = true;
    }
  }
  filterStates(val: string) {

    //this.getdata();
    var options = this.dataoptions;

    var FiltrRes = val ? options.filter((s) => s[this.control.textfield].match(new RegExp(val, 'gi'))) : options;

    return FiltrRes;

  }
  Resetdata() {
    this.validateText();
    if (this.selectedvalue && this.selectedvalue.trim() == "" && this.mouseover == false)
      this.dataoptions = [];
  }
  validateText() {
    var dataoptions = [];

    if (this.control.apiurl) {
      dataoptions = this.dataApi;
    }
    else {
      dataoptions = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;
    }
    var _val = dataoptions.find(x => x[this.control.textfield] == this.selectedvalue);
    if (!_val) {
      this.data[this.control.key] = this.selectedvalue;
    }

  }
  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
  getdata() {
    this.dataoptions = [];

    if (this.control.apiurl) {
      if (this.dataApi.length > 0 && this.control.refreshfromparent != true)
        this.dataoptions = this.dataApi;
      else
        this.SearchApiCall();
    }
    else {

      if (this.control.refreshfromparent == true) {
        var list = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;
        this.dataoptions = list.filter(x => x[this.control.apifieldforparentcontrol] == this.data[this.control.parentcontrolkey]);
      }
      else
        this.dataoptions = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;

      //this.dataoptions = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;
    }
  }
  initializeddl() {
    var _val = this.dataoptions ? this.dataoptions.find(x => x[this.control.valuefield] == this.data[this.control.key]) : null;
    if (_val) {
      var item : any = {};
      item[this.control.textfield] = _val[this.control.textfield]
      item[this.control.valuefield] = _val[this.control.valuefield]
      this.select(item)
    } else {
      var item : any = {};
      item[this.control.textfield] = this.data[this.control.key]
      item[this.control.valuefield] = this.data[this.control.key]
      this.select(item)
    }
  }
  select(item) {
    
    this.selectedvalue = item[this.control.textfield];

    this.data[this.control.key] = item[this.control.valuefield];

    this.dataoptions = [];
    this.isFilterApply = true;
    this.RefreshBindingControls();

    if (this.dataApi.length > 0 && this.control.storejsonnode == true) {
      this.data[this.control.key + "_node"] = this.dataApi.find(x => x[this.control.valuefield] == this.data[this.control.key])
    }
  }
  ApiCallInitiated: boolean = false;
  SearchApiCall() {
    
    if (this.ApiCallInitiated == true && this.control.refreshfromparent != true)
      return;

    this.ApiCallInitiated = true
    let url = this.control.apiurl;
    let searchapiparam : any = {};

    this.control.optionlist.forEach(option => {
      searchapiparam[option.key] = option.value;
    })
    if (this.control.refreshfromparent == true) {
      this.data[this.control.key] = "";
      this.selectedvalue = "";
      if (this.data[this.control.parentcontrolkey] && this.data[this.control.parentcontrolkey].length > 0)
        searchapiparam[this.control.apifieldforparentcontrol] = this.data[this.control.parentcontrolkey];
      else
        return;
    }
    this.busy = this._appService.get(url, searchapiparam)
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((data: any) => {

        this.dataoptions = data;
        this.dataApi = data;


        var val = this.dataoptions ? this.dataoptions.find(x => x[this.control.valuefield] == this.data[this.control.key]) : null;
        if (!val && this.control.autoselectfirstvalue == true) {
          val = data.length > 0 ? data[0] : null;
        }

        if (val) {
          this.selvalueineditmode.text = val[this.control.textfield];
          this.selectedvalue = this.selvalueineditmode.text;
          this.selvalueineditmode.value = val[this.control.valuefield];

          var item : any = {};
          item[this.control.textfield] = val[this.control.textfield]
          item[this.control.valuefield] = val[this.control.valuefield]
          this.select(item)
        }
      });
  }

  getValue(value, allowRun: boolean = false) {
    if (this.access != 'write' || allowRun == true) {
      if (this.selvalueineditmode.value != value) {
        if (this.dataoptions.length == 0) {
          this.getdata();
        }
        this.dataoptions.forEach(item => {
          if (item[this.control.valuefield] == value) {
            this.selvalueineditmode.text = item[this.control.textfield];
            this.selvalueineditmode.value = value;
            //this.dataoptions = [];
            return this.selvalueineditmode.text;
          }
        })
      }
    }
    return this.selvalueineditmode.text;
  }
  RefreshBindingControls() {
    if (this.control.allowbindingwithcontrols == true) {
      this.control.bindingwithothercontrols.forEach(control => {
        if (control.actiontype == "filter") {
          control.sourcecontrolkey = this.control.key;
          this._controlService.formData[control.controlkey] = { props: JSON.stringify(control) };
          if (control.controltype == 'grid') {
            this._controlService.RefreshGrid(control);
          } else if (control.controltype == 'table') {

          } else if (control.controltype == 'checkboxlist') {

          } else if (control.controltype == 'dropdown') {

          }
        }
        else if (control.actiontype == "populate") {
          var selctedOption = this.control.optionlist.find(x => x.value == this.data[this.control.key]);

          if (control.controltype == 'grid' || control.controltype == 'table' || control.controltype == 'checkboxlist') {
            this.data[control.controlkey] = selctedOption.populatejson && selctedOption.populatejson != '' ? JSON.parse(selctedOption.populatejson)[control.controlkey] : [];
            if (control.controltype == 'grid') {
              this._controlService.RefreshGrid(control);
            }
          }
          else
            this.data[control.controlkey] = selctedOption.populatejson && selctedOption.populatejson != '' ? JSON.parse(selctedOption.populatejson)[control.controlkey] : "";
        }
      })
    }
  }
}
