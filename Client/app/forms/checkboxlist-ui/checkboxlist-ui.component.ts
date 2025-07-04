import { Component, OnChanges, Input, OnDestroy,OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-checkboxlist-ui',
  templateUrl: './checkboxlist-ui.component.html',
  styleUrls: ['./checkboxlist-ui.component.scss']
})
export class CheckboxlistUiComponent implements OnChanges, OnDestroy,OnInit {

  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  @Input() public disabled: boolean = false;
  
  public dataoptions: any[];
  public otheroption: boolean = false;
  public hide = true;
  control_id:any="";
  IsOtherSelected: boolean = false;
  subscription: Subscription;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _appService: DataService, private _sanitizer: DomSanitizer, public _controlService: FormControlService) {
    this._controlService.componentRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
      () => {
        this.getdata();
      }
    );
    this.subscription = this._controlService.checkboxlistRefreshCalled$.subscribe((data: any) => { this.RefreshModalFromOtherControl(data) });
  }
  RefreshModalFromOtherControl(param: any) {
    
    if (param) {
      var data = JSON.parse(param.props);
      if (this.control.key === data.controlkey) {
        this.getdata(data)
      }
    }
    else {
      this.getdata();
    }
  }

  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    // this.subscription.unsubscribe();
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  safehtml(value) {
    return this._sanitizer.bypassSecurityTrustHtml(value);
    // return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient( rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${image})`);
  }
  ngOnChanges(control: any) {
    
    this.RefreshModalFromOtherControl(this._controlService.formData[this.control.key]);
    if (!this.control.apiurl) {
      this.SelectValue();
    }
  }
  getdata(refreshData: any = null) {
    this.dataoptions = [];
    if (this.control.apiurl) {
      this.ServiceCall(refreshData);
    }
    else if (this.control.optionlist.length > 0) {
      if (refreshData) {
        this.dataoptions = this.deepcopy(this.control.optionlist.filter(x => x[refreshData.bindingfield] == this.data[refreshData.sourcecontrolkey]));
      }
      else
        this.dataoptions = this.deepcopy(this.control.optionlist);

      for (var i = 0; i < this.dataoptions.length; i++) {
        this.dataoptions[i].checked = false;
      }
      if (this.control.allowother) {
        var otheroption = this.deepcopy(this.dataoptions[0]);
        otheroption[this.control.textfield] = "Other";
        otheroption[this.control.valuefield] = "Other";
        otheroption.checked = false;
        this.dataoptions.push(otheroption);
      }
      if (Array.isArray(this.data[this.control.key])) {
        this.data[this.control.key].forEach(item => {
          var option = this.dataoptions.filter(x => x.value == item);
          if (option.length == 0) {
            this.dataoptions.find(x => x.key == "Other").value = item;
            this.dataoptions.find(x => x.key == "Other").checked = true;
          }
          else {
            this.dataoptions.find(x => x.value == item).checked = true;
          }
        })
      }
      //console.log(this.dataoptions[0]);
    }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
  }
  SelectValue() {
    this.data[this.control.key] = [];

    this.dataoptions.forEach(selected => {
      if (selected.checked) {
        this.data[this.control.key].push(selected[this.control.valuefield]);
      }
    })

    if (Array.isArray(this.data[this.control.key])) {
      this.data[this.control.key].forEach(item => {
        var option = this.dataoptions.filter(x => x.value == item);
        if (option.length == 0 || item.toLowerCase() == "other") {
          this.IsOtherSelected = true;
          return;
        } else if (option.length > 0 && option[0].key == 'Other') {
          this.IsOtherSelected = true;
          return;
        } else {
          this.IsOtherSelected = false;
        }
      })
    }
    else
      this.IsOtherSelected = false;

  }
  ServiceCall(refreshData: any = null) {

    let url = this.control.apiurl;
    let searchapiparam: any = {};

    this.control.optionlist.forEach(option => {
      searchapiparam[option.key] = option.value;
    })
    if (refreshData) {
      searchapiparam[refreshData.bindingfieldapi] = this.data[refreshData.sourcecontrolkey];
    }
    this._appService.get(url, searchapiparam, this.control.enablecache)
  .debounceTime(400)
  .distinctUntilChanged()
  .subscribe((data: any) => {

    this.dataoptions = data;
    //for (var i = 0; i < this.dataoptions.length; i++) {
    //    this.dataoptions[i].checked = false;
    //}
    if (this.data[this.control.key]) {
      this.dataoptions.forEach(selected => {
        selected.checked = false;

        this.data[this.control.key].forEach(cussertvalue => {

          if (cussertvalue == selected[this.control.valuefield]) {
            selected.checked = true;
          }

        })

      })
    }
    this.SelectValue();
  });
  }

deepcopy<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}
}
