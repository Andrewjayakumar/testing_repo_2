import {
  Component, OnInit, Input, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { AnonymousSubject } from 'rxjs/Rx';

@Component({
  selector: 'app-autocomplete2-ui',
  templateUrl: './autocomplete2-ui.component.html',
  styleUrls: ['./autocomplete2-ui.component.scss'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Autocomplete2UiComponent implements OnInit, OnChanges, DoCheck {

  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  @Input() public disabled: boolean = false;
  
  public filteredList: any;
  public AutoSearchList: any;
  dataApi: any = [];
  url = 'http://suggestqueries.google.com/complete/search';
  params = {
    hl: 'en',
    ds: 'yt',
    xhr: 't',
    client: 'youtube'
  };

  control_id = null;
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    this.filteredList = [];
    this.AutoSearchList = [];

  }
  firstLoad: boolean = false;
  ngOnChanges(control: any) {
    this.updatePageVarible();
    if (this.control.refreshbindingonfirstload != false) {
      this.refreshBindingControls();
    } else {
      this.firstLoad = true;
    }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key])
  }

  constructor(private _appService: DataService, public _controlService: FormControlService, private cd: ChangeDetectorRef) {
  }
  model: any
  ngDoCheck() {
    var ViewRef_: any
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
  keypress(event) {
    if (this.control.textonly && this.control.numberonly && (/^[a-zA-Z\s]*$/.test(event.key) || /^[0-9]*$/.test(event.key))) {
      if (this.control.charlimit) {
        return this.data[this.control.key].length < this.control.charlimit;
      } else {
        return true;
      }
    } else if (this.control.textonly && !/^[a-zA-Z\s]*$/.test(event.key)) {
      return false;
    } else if (this.control.numberonly && !/^[0-9]*$/.test(event.key)) {
      return false;
    } if (this.control.charlimit) {
      return this.data[this.control.key].length < this.control.charlimit;
    } else {
      return true;
    }
  }
  clearBindingControls() {
    if (this.control.bindingwithothercontrols && !this.firstLoad) {
      this.control.bindingwithothercontrols.forEach(control => {
        this.data[control.controlkey] = '';
        if (this.control.storeaspagesearch) {
          this._controlService.setPageSearchVarible(this.data[control.controlkey] ? this.data[control.controlkey].split(",") : [], control.controlkey)
        }
      });
    } else {
      this.firstLoad = false;
    }
  }
  refreshBindingControls() {
    this.cd.markForCheck();
    var apiurl = "";
    var apiparam: any = {};
    if (this.control.bindingwithothercontrols) {
      this.control.bindingwithothercontrols.forEach(control => {
        this.data[control.controlkey] = '';
        if (this.control.storeaspagesearch) {
          this._controlService.setPageSearchVarible(this.data[control.controlkey] ? this.data[control.controlkey].split(",") : [], control.controlkey)
        }
      });
    }
    // ...using get request
    apiurl = this.control.ResultApi ? this.control.ResultApi : "";
    if (apiurl !== "") {
      this.control.ResultApiParam.forEach(option => {
        apiparam[option.key] = option.value;
      })
      if (this.control.bindingqueryfield) {
        apiparam[this.control.bindingqueryfield] = this.data[this.control.key];
      }
      var _othis = this;
      this._appService.get(apiurl, apiparam, true)
        .subscribe((data: any) => {
          var dataOtption: any = {}
          if (Array.isArray(data) && data.length > 0)
            dataOtption = data[0] ? data[0] : {};
          else if (typeof data == "object")
            dataOtption = data ? data : {};

          _othis.control.bindingwithothercontrols.forEach(control => {
            _othis.data[control.controlkey] = dataOtption[control.bindingfield];
            if (this.control.storeaspagesearch) {
              this._controlService.setPageSearchVarible(_othis.data[control.controlkey] ? _othis.data[control.controlkey].split(",") : [], control.controlkey)
            }
            this.cd.markForCheck();
          });
        });
    }
  }
  isLoading: boolean = false;
  CallService(term) {
    debugger;
    this.SearchDropDown = true;
    var apiurl = "";
    var apiparam: any = {};

    // ...using get request
    if (this.data[this.control.key].length >= 2) {
      if (this.control.apiurl !== "") {
        this.isLoading = true;
        apiurl = this.control.apiurl;
        this.control.optionlist.forEach(option => {
          apiparam[option.key] = option.value;
        })
        if (this.control.queryfield !== "")
          apiparam[this.control.queryfield] = this.data[this.control.key];
        // }
        // else {
        //   apiurl = this.url;
        //   apiparam = this.params;
        // }

        this._appService.get(apiurl, apiparam, this.control.enablecache)
          .debounceTime(200)
          .distinctUntilChanged()
          .subscribe((data: any) => {
            this.isLoading = false;
            data.forEach(item => {
              var arr: any = {};
              arr[this.control.textfield] = item[this.control.textfield];
              arr[this.control.valuefield] = item[this.control.valuefield];
              if (this.filteredList.filter(x => x[this.control.textfield] == arr[this.control.textfield]).length == 0) {
                this.filteredList.push(arr);
                this.dataApi.push(item);
              }
            })
            //this.AutoSearchList = [];
            if (term == this.data[this.control.key]) {
              this.filteredList.forEach(item => {
                if (item[this.control.textfield].match(new RegExp(term, 'gi')) && this.AutoSearchList.filter(x => x[this.control.textfield] == item[this.control.textfield]).length == 0) {
                  this.AutoSearchList.push(item);
                }
              })
            }
            this.cd.markForCheck();
          },
            err => {
              this.isLoading = false;
            },
            () => {
              this.isLoading = false;
            }
          );
      }
    } else {
      this.AutoSearchList = [];
      this.isLoading = false;
    }

  }
  filter() {
    var val = this._controlService.deepcopy(this.data[this.control.key]);
    if (val && this.SearchDropDown) {
      this.CallService(val);

      if (this.filteredList.length > 0) {
        //this.AutoSearchList = val ? this.filteredList.filter((s) => s[this.control.textfield].match(new RegExp(val, 'gi'))) : this.filteredList;
        this.AutoSearchList = [];
        this.filteredList.forEach(item => {
          if (item[this.control.textfield].match(new RegExp(val, 'gi')) || item[this.control.valuefield].startsWith(val)) {
            this.AutoSearchList.push(item);
          }
        })
        this.cd.markForCheck();
      }
    }
    else {
      this.AutoSearchList = [];
    }
  }

  select(item: any) {
    // debugger;
    this.SearchDropDown = false;
    this.data[this.control.key] = item[this.control.valuefield];
    this._controlService.setFilterValue(this.control.key, this.data[this.control.key], this.filterdata)
    this.AutoSearchList = [];
    this.refreshBindingControls();
    if (this.dataApi.length > 0 && this.control.storejsonnode == true) {
      this.data[this.control.key + "_node"] = this.dataApi.find(x => x[this.control.valuefield] == this.data[this.control.key])
    }

    this.cd.markForCheck();
  }
  selectedIndex: number = -1;
  SearchDropDown: boolean = false;
  eventHandler(event) {
    this.SearchDropDown = true;
    // console.log(event, event.keyCode);
    // console.log(this.SearchDropDown)
    // console.log(event.keyCode);
    if (event.keyCode == 40) {
      event.stopPropagation();
      this.SearchDropDown = true;
      //console.log(event);

      if (this.selectedIndex >= -1 && (this.selectedIndex < this.AutoSearchList.length)) {
        this.selectedIndex++;
      }
      else {
        this.selectedIndex = 0;
      }
      if (this.selectedIndex > 0 && event.currentTarget.nextElementSibling && event.currentTarget.nextElementSibling.children.length > 0 && event.currentTarget.nextElementSibling.children[0].children[this.selectedIndex]) {
        event.currentTarget.nextElementSibling.scrollTop += event.currentTarget.nextElementSibling.children[0].children[this.selectedIndex].scrollHeight;
      } else if (event.currentTarget.nextElementSibling) {
        event.currentTarget.nextElementSibling.scrollTop = 0;
      }
      //console.log("ArrowDown " + this.selectedIndex)
    }
    if (event.key == "ArrowUp") {
      event.stopPropagation();
      this.SearchDropDown = true;
      //console.log(event);

      if (this.selectedIndex > -1 && (this.selectedIndex != 0)) {
        this.selectedIndex--;
      }
      else {
        this.selectedIndex = this.AutoSearchList.length - 1;
      }
      if (event.currentTarget.nextElementSibling && event.currentTarget.nextElementSibling.children.length > 0 && event.currentTarget.nextElementSibling.children[0].children[this.selectedIndex]) {
        //event.currentTarget.nextElementSibling.scrollTop = this.selectedIndex * 26;
        event.currentTarget.nextElementSibling.scrollTop -= event.currentTarget.nextElementSibling.children[0].children[this.selectedIndex].scrollHeight;
      }
      //console.log("ArrowUp " + this.selectedIndex)
    }

    if (event.code == "Enter" && this.selectedIndex > -1) {
      //console.log("Enter " + this.selectedIndex)
      event.stopPropagation();
      this.select(this.AutoSearchList[this.selectedIndex]);
    }

    this.cd.markForCheck();
  }

  setIndex(index) {
    this.selectedIndex = index;
  }

  resetIndex() {
    this.selectedIndex = -1;
  }
  updatePageVarible() {
    if (this.control.storeaspagesearch && this.data[this.control.key]) {
      this._controlService.setPageSearchVarible(this.data[this.control.key].split(','), this.control.key)
    }
  }
}
//Metadata
/*{
     "key": "Attributes",
     "Name": "Autocomplete",
     "label": "",
     "placeholder": "",
     "icon": "fa fa-search",
     "type": "autocomplete",
     "width": 6,
     "order": 9,
     "textfield": "key",
     "valuefield": "value",
     "queryfield": "",
     "require": false,
     "showinlist": true,
     "haschildren": false,
     "hasdatasource": true,
     "isTableView": false,
     "apiurl": "",
     "optionlist": [],
     "storejsonnode": false
   }*/
