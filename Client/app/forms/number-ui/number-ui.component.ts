import {
  Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-number-ui',
  templateUrl: './number-ui.component.html',
  styleUrls: ['./number-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberUiComponent implements OnInit, OnDestroy, DoCheck {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  @Input() public disabled: boolean = false;

  public control_id = null;
  public Modeldata = null;
  symbol: any = { "0": "", "1": "$", "2": "₹", "3": "£", "4": "€", "5": "¥" };
  public hide = true;

  numberFrom: any = null;
  numberTo: any = null;
  private unsubscribe: Subject<true> = new Subject<true>();
  constructor(public _controlService: FormControlService, private cd: ChangeDetectorRef) {
    this._controlService.componentResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.numberFrom = null;
          this.numberTo = null;
        }
      );
  }
  model: any
  ngDoCheck() {
    if (this.model != this.data[this.control.key]) {
      this.model = this.data[this.control.key];
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.Modeldata = this.data[this.control.key];
        this.Format();
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
  ngOnInit() {
    //console.log(this.control.key + "  -  " + this.data[this.control.key])
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    this.Modeldata = this.data[this.control.key];
    this.Format();
    this.setDefaultValue();

    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.detectChanges();
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  setDefaultValue() {
    if (!this.data[this.control.key] && this.control.defaultvalue != null && this.control.defaultvalue != 'undefined' && this.control.defaultvalue !== '') {
      this.data[this.control.key] = this.control.defaultvalue;
      this.Modeldata = this.data[this.control.key];

      this._controlService.getCssforMandatory(this.control, this.Modeldata);
      this._controlService.setFilterValue(this.control.key, this.Modeldata, this.filterdata)
    }
  }
  getPlaceholder(label) {
    if (this.control.formatoption) {
      if (this.control.formatoption.format == "number") {
        return label + " [" + this.control.formatoption.numbersample + "]";
      } else {
        return label + " [" + this.control.formatoption.currencysample + "]";
      }
    }
    else
      return label;
  }
  AllowNumericValue(event: any) {
    if (this.control.formatoption) {
      if (this.control.formatoption.format == "number") {
        if (this.control.formatoption.descimalplaces > 0)
          return event.charCode === 0 || ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 46 && event.key == '.'));
        else if (this.control.formatoption.negativenumbers == "0")
          return (event.charCode == 45 && event.key == '-') || String.fromCharCode(event.charCode).match(/[0-9]/g) != null;
        else
          String.fromCharCode(event.charCode).match(/[0-9]/g) != null;
      } else {
        if (this.control.formatoption.cdescimalplaces > 0)
          return event.charCode === 0 || ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 46 && event.key == '.'));
        else if (this.control.formatoption.cnegativenumbers == "0")
          return (event.charCode == 45 && event.key == '-') || String.fromCharCode(event.charCode).match(/[0-9]/g) != null;
        else
          String.fromCharCode(event.charCode).match(/[0-9]/g) != null;
      }
    }
    else
      return String.fromCharCode(event.charCode).match(/[0-9]/g) != null;
  }
  AllowOneDecimal(event: any) {
    var val = this.Modeldata ? this.Modeldata.toString() : "";
    if (this.control.formatoption.cnegativenumbers == "0" || this.control.formatoption.negativenumbers == "0")
      val = val.replace(/[^0-9\.-]/g, '');
    else
      val = val.replace(/[^0-9\.]/g, '');
    if (val.split('.').length > 2)
      val = val.replace(/\.+$/, "");

    this.Modeldata = val;
  }
  getFormatForView() {
    this.Modeldata = this.data[this.control.key];
    this.Format();

    return this.Modeldata;
  }
  maxminmassege: string = "";
  Format() {
    this.maxminmassege = "";
    if (this.control.max && this.Modeldata > this.control.max) {
      this.data[this.control.key] = this.Modeldata;
      this.Modeldata = null;
      return;
    }
    if (this.control.min && this.Modeldata < this.control.min) {
      this.data[this.control.key] = this.Modeldata;
      this.Modeldata = null;
      return;
    }
    if (this.control.minmodel && this.Modeldata <= this.data[this.control.minmodel]) {
      this.data[this.control.key] = this.Modeldata;
      this.Modeldata = null;
      this.maxminmassege = this.control.label + " should greater than " + this.data[this.control.minmodel];
      return;
    }
    if (this.control.maxmodel && this.Modeldata >= this.data[this.control.maxmodel]) {
      this.data[this.control.key] = this.Modeldata;
      this.Modeldata = null;
      this.maxminmassege = this.control.label + " should less than " + this.data[this.control.maxmodel];
      return;
    }
    if (!this.control.formatoption)
      return;
    var isNegative = false;
    var data = this.Modeldata ? this.Modeldata.toString() : "";

    if (data.length > 0) {
      if (data.indexOf("-") > -1) {
        data = data.replace(/-/g, '');
        isNegative = true;
      }

      if (!data.substring(0, 1).match(/[0-9]/g)) {
        data = data.substring(1);
      }
    }
    if (data.trim() == "") {
      this.data[this.control.key] = null;
      return;
    }
    var dataDecimal = data.split(".")
    var BeforeDecimal = dataDecimal[0];
    var AfterDecimal = dataDecimal.length > 1 ? dataDecimal[1] : "";

    var descimalplaces = "";
    if (this.control.formatoption.format == "number") {
      for (let i = 0; i < this.control.formatoption.descimalplaces; i++) {
        if (AfterDecimal.length > i) {
          descimalplaces = descimalplaces + AfterDecimal.substr(i, 1);
        }
        else {
          descimalplaces = descimalplaces + "0";
        }
      }
      if (descimalplaces == "") {
        AfterDecimal = "";
      }
      else {
        AfterDecimal = "." + descimalplaces;
      }
      if (this.control.formatoption.separator == true)
        BeforeDecimal = this.numberWithCommas(BeforeDecimal);

      //if (this.control.formatoption.negativenumbers == "0")
      //    data = "-" + BeforeDecimal + AfterDecimal;
      //else
      //    data = BeforeDecimal + AfterDecimal;
      data = BeforeDecimal + AfterDecimal;
    }
    else if (this.control.formatoption.format == "currency") {
      for (let i = 0; i < this.control.formatoption.cdescimalplaces; i++) {
        if (AfterDecimal.length > i) {
          descimalplaces = descimalplaces + AfterDecimal.substr(i, 1);
        }
        else {
          descimalplaces = descimalplaces + "0";
        }
      }
      if (descimalplaces == "") {
        AfterDecimal = "";
      }
      else {
        AfterDecimal = "." + descimalplaces;
      }
      BeforeDecimal = this.numberWithCommas(BeforeDecimal);
      BeforeDecimal = (this.symbol[this.control.formatoption.symbol] ? this.symbol[this.control.formatoption.symbol] : "") + BeforeDecimal;

      //if (this.control.formatoption.cnegativenumbers == "0")
      //    data = "-" + BeforeDecimal + AfterDecimal;
      //else
      //    data = BeforeDecimal + AfterDecimal;
      data = BeforeDecimal + AfterDecimal;
    }


    if (data.length > 0) {

      if (this.control.formatoption.cnegativenumbers == "0") {
        let _data = data.replace(/,/g, '');
        if (!_data.substring(0, 1).match(/[0-9]/g)) {
          this.data[this.control.key] = parseFloat(_data.substring(1));
        }
        else
          this.data[this.control.key] = parseFloat(_data);
      } else {
        let _data = data.replace(/,/g, '');
        if (!_data.substring(0, 1).match(/[0-9]/g)) {
          this.data[this.control.key] = parseFloat(_data.substring(1));
        }
        else
          this.data[this.control.key] = parseFloat(data);
      }

      if (isNegative == true && this.data[this.control.key] != 0) {
        this.data[this.control.key] = -Math.abs(this.data[this.control.key]);
      }
    }
    else
      this.data[this.control.key] = null;

    if (isNegative == true && this.data[this.control.key] != 0)
      this.Modeldata = "-" + data;
    else
      this.Modeldata = data;

    // if (this.cd !== null &&
    //   this.cd !== undefined &&
    //   !(this.cd as any).destroyed) {
    //   this.cd.detectChanges();
    // }
  }
  refreshPanel() {
    if (this.control.refreshpanelonchange) {
      this._controlService.RefreshPanelControl(this.control.panelkey);
    }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
//MetaData
/* {
   "id": "1",
   "key": "Attributes",
   "Name": "Number",
   "label": "Number",
   "placeholder": "Number",
   "icon": "fa fa-sort-numeric-desc",
   "type": "number",
   "width": 6,
   "order": 2,
   "require": false,
   "showinlist": true,
   "addinfilter": false,
   "filterheader": "",
   "textalign": "left",
   "haschildren": false,
   "isTableView": false,
   "hasdatasource": false,
   "formatoption": { "format": "number", "numbersample": "1234", "descimalplaces": "0", "separator": false, "negativenumbers": "1", "currencysample": "1,234", "cdescimalplaces": "0", "symbol": "0", "cnegativenumbers": "1" }
 }*/
