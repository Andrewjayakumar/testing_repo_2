import { Component, OnInit, Input, AfterContentChecked, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IMultiSelectOption, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-dropdown2-ui',
  templateUrl: './dropdown2-ui.component.html',
  styleUrls: ['./dropdown2-ui.component.scss']
})
export class Dropdown2UiComponent implements OnInit, AfterContentChecked, AfterViewChecked, OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = "write";

  dataApi: any = [];
  dropdownList: IMultiSelectOption[] = [];
  selectedItems = [];
  //dropdownSettings: IMultiSelectSettings : any = {};
  // Text configuration
  control_id: any = null;
  myTexts: IMultiSelectTexts = {};
  busy: Subscription;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(public _appService: DataService, public _controlService: FormControlService) {
    this._controlService.componentResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.data[this.control.key] = [];
        }
      );
    this._controlService.dropdownRefreshCalled$.takeUntil(this.unsubscribe).subscribe((data: any) => { this.RefreshModalFromOtherControl(data) });
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  RefreshModalFromOtherControl(param: any) {
    if (param) {
      var data = JSON.parse(param.props);
      if (this.control.key === data.controlkey) {
        this.selectedItems = [];
        this.dropdownList = [];
        this.dataApi = [];
        //this.data[this.control.key] = "";
        this.getdata(data)
      }
    }
    else {
      //this.getdata();
    }
  }
  focus(event: any) {
    this.isdefaultload = true;
  }
  focusOut() {
    this.isdefaultload = true;
    //this.formGroup.controls[this.control_id].markAsTouched();
    // Observable.interval(2000)
    // .takeWhile(() => !this.formGroup.controls[this.control_id].touched && this.selectedItems.length==0)
    // .subscribe(i => { 
    //   this.formGroup.controls[this.control_id].markAsTouched();
    // })
    if (!this.formGroup.controls[this.control_id].touched && this.selectedItems.length == 0) {
      // setInterval(a => {
      //   this.setAsTouch();
      // }, 3000, []);
      this.formGroup.controls[this.control_id].markAsTouched();

    }
  }
  setAsTouch() {
    // debugger;
    if (!this.formGroup.controls[this.control_id].touched && this.selectedItems.length == 0) {
      this.formGroup.controls[this.control_id].markAsTouched();
    }
  }
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    this.RefreshBindingControls();
  }
  ngOnChanges(control: any) {
    this.selectedItems = [];
    this.dropdownList = [];
    this.myTexts = {
      checkAll: this.control.selectalltext,
      uncheckAll: this.control.unselectalltext,
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: this.control.defaulttext,
      allSelected: 'All selected',
    };
    //set modal value
    if (this.control.selectiontype == 'single') {
      if (this.data[this.control.key])
        this.selectedItems.push(this.data[this.control.key]);
    } else {
      if (this.data[this.control.key]) {
        this.data[this.control.key].forEach(value => {
          if (value)
            this.selectedItems.push(value);
        });
      }
    }
    if (this._controlService.formData[this.control.key]) {
      this.RefreshModalFromOtherControl(this._controlService.formData[this.control.key]);
    }
    else {
      this.getdata();
    }
    if (!this.data[this.control.key] || this.data[this.control.key] == "" && this.control.selectiontype == 'single')
      this.data[this.control.key] = this.control.outputtype == "number" ? null : "";
  }
  isApiCalling: boolean = false;
  isdefaultload: boolean = true;
  selectedNode: { name: string, id: string } = { name: '', id: '' };
  selectedNodeColl = [];
  ngAfterViewChecked() {
    if (this.access != 'write' && this.access != 'filter') {
      if (this.isApiCalling == false) {
        //console.log("ngAfterViewChecked - Api Called")
        //this.isApiCalling = true;
        this.getdata();
      } else {
        if (this.control.selectiontype == 'single') {
          if (this.selectedNode.id != this.data[this.control.key]) {
            var selected = this.dropdownList.find(x => x["id"] == this.data[this.control.key]);
            //console.log("ngAfterViewChecked - selectedNode Called -" + JSON.stringify(selected) + " - dropdownList : " + JSON.stringify(this.dropdownList) + ' - value - ' + this.data[this.control.key]);
            this.selectedNode = { name: '', id: '' };
            this.selectedNode.name = selected ? selected.name : ""
            this.selectedNode.id = selected ? selected.id : ""

          }
        } else {
          this.selectedNodeColl = [];
          this.selectedItems.forEach(value => {
            var selected = this.dropdownList.find(x => x["id"] == value);
            var data: any = {};
            data["name"] = selected ? selected.name : ""
            data["id"] = selected ? selected.id : ""
            this.selectedNodeColl.push(data);
          })
        }
      }
    }
    //else if (this.selectedItems.length == 0 && this.data[this.control.key]) {
    //  this.getdata();
    //}
  }
  ngAfterContentChecked() {
    //console.log("ngAfterContentChecked")
  }
  onChange(event) {
    if (event && event.length == 0 && this.control.selectiontype == 'single') {
      Observable.interval(1)
        .takeWhile(() => this.formGroup.controls[this.control_id].touched)
        .subscribe(i => {
          this.formGroup.controls[this.control_id].markAsUntouched();
        })
      // setInterval(a => {
      //   this.formGroup.controls[this.control_id].markAsUntouched();
      // }, 1000, []);
    }

    if (this.control.selectiontype == 'single') {
      if (this.selectedItems.length > 0)
        this.data[this.control.key] = this.control.outputtype == "number" ? parseInt(this.selectedItems[0]) : this.selectedItems[0];
      else {
        if (this.control.autoselectfirstvalue == true && this.data[this.control.key]) {
          this.selectedItems.push(this.data[this.control.key])
        } else if (this.dropdownList.length > 0) {
          this.data[this.control.key] = this.control.outputtype == "number" ? null : "";
        }
      }
    } else {
      this.data[this.control.key] = this.selectedItems;
    }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);

    this.RefreshBindingControls();

    if (this.control.selectiontype == 'single') {
      var data;
      if (this.dataApi.length > 0 && this.control.storejsonnode == true) {
        data = this.dataApi.find(x => x[this.control.valuefield] == this.data[this.control.key])
        this.data[this.control.key + "_node"] = data;
      }
    }
  }
  getdata(refreshParam: any = null) {

    if (this.control.apiurl) {
      if (this.dataApi.length > 0) {
        this.generatedropdownList(this.dataApi);
      } else if (!this.isApiCalling) {
        this.isApiCalling = true;
        this.SearchApiCall(refreshParam);
      }
    }
    else {
      var data = null;
      if (refreshParam) {
        var list = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;
        data = list.filter(x => x[refreshParam.fieldbindingapi] == this.data[refreshParam.sourcecontrolkey]);
      }
      else
        data = this.control.isTableView ? this.data[this.control.Name] ? this.data[this.control.Name] : this.control.optionlist : this.control.optionlist;

      this.generatedropdownList(data);
    }
  }
  generatedropdownList(data: any, filterText: string = '') {

    this.selectedItems = [];
    var options = JSON.parse(JSON.stringify(this.dropdownList));
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        let _item: IMultiSelectOption = { id: item[this.control.valuefield], name: item[this.control.textfield] }
        options.push(_item)
      })
    }
    if (this.control.isLazyLoad && filterText && filterText.trim().length > 0) {
      this.dropdownList = options.filter(x => x.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1);
    } else {
      this.dropdownList = options;
    }

    //set modal value
    if (this.control.selectiontype == 'single') {
      var item = this.dropdownList.find(x => x["id"] == this.data[this.control.key]);
      if (item)
        this.selectedItems.push(item.id);
    } else {
      if (this.data[this.control.key]) {
        this.data[this.control.key].forEach(value => {
          var item = this.dropdownList.find(x => x["id"] == value);
          if (item)
            this.selectedItems.push(item.id);
        });
      }
    }
  }
  SearchApiCall(refreshParam: any = null, event: any = null) {
    //this.dropdownList = [];
    //debugger;
    let url = this.control.apiurl;
    let searchapiparam: any = {};
    this.control.ApiParam.forEach(option => {
      searchapiparam[option.key] = option.value;

      if (option.key == this.control.from)
        searchapiparam[option.key] = this.dropdownList.length == 0 ? option.value : this.dropdownList.length;

      if (option.key == this.control.search) {
        if (event && event.filter.trim().length > 0)
          searchapiparam[option.key] = event.filter;
        else
          searchapiparam[option.key] = this.data[this.control.key] ? this.data[this.control.key].substr(0, 1) : "";
      }
      this.dropdownList = [];
    })

    if (refreshParam) {
      //if (this.control.selectiontype == 'single') {
      //  this.data[this.control.key] = "";
      //} else {
      //  this.data[this.control.key] = [];
      //}
      if (this.data[refreshParam.sourcecontrolkey] && (this.data[refreshParam.sourcecontrolkey].length > 0 || !Number.isNaN(this.data[refreshParam.sourcecontrolkey]))) {
        if (Array.isArray(this.data[refreshParam.sourcecontrolkey])) {
          var parentModel = this.data[refreshParam.sourcecontrolkey];
          searchapiparam[refreshParam.bindingfieldapi] = JSON.stringify(parentModel);
        } else {
          searchapiparam[refreshParam.bindingfieldapi] = this.data[refreshParam.sourcecontrolkey];
        }
      }
      else {
        this.isApiCalling = false;
        return;
      }
    }
    this.busy = this._appService.get(url, searchapiparam, this.control.enablecache)
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((data: any) => {
        if (this.control.isLazyLoad)
          this.dropdownList = [];

        this.isApiCalling = false;
        this.dataApi = data;
        this.generatedropdownList(data, event ? event.filter : null);

        if (Array.isArray(data)) {
          var val = data ? data.find(x => x[this.control.valuefield] == this.data[this.control.key]) : null;
          if (!val && this.control.autoselectfirstvalue == true) {
            if (data.length > 0) {
              var _val = data[0];
              this.data[this.control.key] = _val[this.control.valuefield]
              this.selectedItems.push(this.data[this.control.key]);
            }
          }
        }
      },
        err => {
          this.isApiCalling = false;
          console.log(err);
        },
        () => {
          //console.log("done")
        });
  }
  RefreshBindingControls() {
    if (this.control.allowbindingwithcontrols == true) {
      this._controlService.RefreshBindingControls(this.control.key, this.control.bindingwithothercontrols, this.data, this.control.optionlist);
    }
  }
  getValue() {
    var data = this.data[this.control.key + '_node']
    return data && data[this.control.key + '_name'] ? data[this.control.key + '_name'] : '';
  }
}
