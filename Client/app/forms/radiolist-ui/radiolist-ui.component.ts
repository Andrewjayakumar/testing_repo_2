import {
  Component, OnChanges, Input, OnInit, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
// import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-radiolist-ui',
  templateUrl: './radiolist-ui.component.html',
  styleUrls: ['./radiolist-ui.component.scss'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadiolistUiComponent implements OnChanges, OnInit, DoCheck {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  @Input() public disabled: boolean = false;

  control_id = null;
  public hide = true;
  public dataoptions: any[];
  // public uniqueId: string = UUID.UUID();
  IsOtherSelected: boolean = false;
  constructor(private _appService: DataService, private _sanitizer: DomSanitizer, public _controlService: FormControlService, private cd: ChangeDetectorRef) {

  }
  detectChanges() {
    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.detectChanges();
    }
  }
  model: any
  ngDoCheck() {
    if (this.model != this.data[this.control.key]) {
      this.model = this.data[this.control.key];
      this.detectChanges();
    }
    if (this.control.require && this.formGroup.controls[this.control_id] && this.formGroup.controls[this.control_id].touched) {
      this.detectChanges();
    }
  }
  ngOnInit() {
    
  }
  ngOnChanges(control: any) {
    debugger;
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    this.getdata();
    this.RefreshBindingControls();
  }
  focusout() {
    // debugger;
    if (this.formGroup.controls[this.control_id] && !this.formGroup.controls[this.control_id].touched && !this.data[this.control.key]) {
      this.formGroup.controls[this.control_id].markAsTouched();
    }
  }
  getdata() {
    this.dataoptions = [];
    if (this.control.apiurl) {
      this.ServiceCall();
    }
    else if (this.control.optionlist.length > 0) {
      this.dataoptions = []; // this.deepcopy(this.control.optionlist);
      if (this.control.optionlist.find(x => x.value == 'true' || x.value == 'false')) {
        this.control.optionlist.forEach(item => {
          if (item.value.trim().toLowerCase() == 'true') {
            item.value = true;
          } else if (item.value.trim().toLowerCase() == 'false') {
            item.value = false;
          }
          this.dataoptions.push(item);
        });
      } else {
        this.dataoptions = this.deepcopy(this.control.optionlist);
      }
      if (this.control.allowother) {
        var otheroption = this.deepcopy(this.dataoptions[0]);
        otheroption[this.control.textfield] = "Other";
        otheroption[this.control.valuefield] = "Other";
        this.dataoptions.push(otheroption);
        if (this.data[this.control.key] && this.data[this.control.key].length > 0) {
          var option = this.dataoptions.filter(x => x.value == this.data[this.control.key]);
          if (option.length == 0 || this.data[this.control.key].toLowerCase() == "other") {
            this.dataoptions.find(x => x.key == "Other").value = this.data[this.control.key];
            this.IsOtherSelected = true;
          }
        }
      }
      this.detectChanges();
    }
  }
  setOtherValue(opt) {
    if (opt.key == "Other") {
      this.IsOtherSelected = true;
    } else
      this.IsOtherSelected = false;

    this.detectChanges();
  }
  RefreshBindingControls() {
    debugger;
    if (this.control.allowbindingwithcontrols == true) {
      this._controlService.RefreshBindingControls(this.control.key, this.control.bindingwithothercontrols, this.data, this.control.optionlist);
    }
    this.detectChanges();
  }
  safehtml(value) {
    return this._sanitizer.bypassSecurityTrustHtml(value);

  }
  ServiceCall() {

    let url = this.control.apiurl;
    let searchapiparam = {};

    this.control.optionlist.forEach(option => {
      searchapiparam[option.key] = option.value;
    })
    this._appService.get(url, searchapiparam, this.control.enablecache)
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((data: any) => {
        this.dataoptions = data;
        if (this.control.allowother) {
          var otheroption = this.deepcopy(this.dataoptions[0]);
          otheroption[this.control.textfield] = "Other";
          otheroption[this.control.valuefield] = "Other";
          this.dataoptions.push(otheroption);
        }
        if (this.data[this.control.key] == "" || this.data[this.control.key] == null) {
          var _data = this.dataoptions.length > 0 ? this.dataoptions[0] : null;
          this.data[this.control.key] = _data ? _data[this.control.valuefield] : null;
        }
        this.detectChanges();
      });
  }

  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
}
