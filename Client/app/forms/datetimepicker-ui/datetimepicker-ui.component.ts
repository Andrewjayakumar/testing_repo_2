import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';
import { DatePicker } from 'angular2-datetimepicker';

@Component({
  selector: 'app-datetimepicker-ui',
  templateUrl: './datetimepicker-ui.component.html',
  styleUrls: ['./datetimepicker-ui.component.scss']
})
export class DatetimepickerUiComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('en-US');
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  public hide = true;
  public control_id = null;

  selectedDateFrom: any = null;
  selectedDateTo: any = null;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'mm-dd-yyyy hh:mm a',
    defaultOpen: false
  }
  selectedDate: Date = new Date();
  constructor(public parserFormatter: NgbDateParserFormatter, public _controlService: FormControlService) {
    this._controlService.componentResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.selectedDateFrom = null;
          this.selectedDateTo = null;
          //this.selectedDate = null;
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
      this.unsubscribe.complete();

      if (this.control.require)
          this._controlService.removeValidationOnDestroy(this.control);

  }
  ngOnInit() {
    // debugger;
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    DatePicker.prototype.ngOnInit = function () {
      this.settings = Object.assign(this.defaultSettings, this.settings);
      if (this.settings.defaultOpen) {
        this.popover = true;
      }
    };

    if (this.control.format) {
      if (this.control.format == "date") {
        this.settings.format = "MM-dd-yyyy";
        this.settings.timePicker = false;
        var dt = new Date();
        this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear();

      }
      if (this.control.format == "datetime") {
        this.settings.format = "MM-dd-yyyy hh:mm a";
        this.settings.timePicker = true;
        var dt = new Date();
        this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear() + " " + ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
      }
      if (this.control.format == "time") {
        this.settings.format = "h:mm a";
        this.settings.timePicker = true;
        var dt = new Date();
        this.data[this.control.key] = ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
      }
    }
    else {
      if (!this.data[this.control.key]) {
        this.settings.format = "MM-dd-yyyy hh:mm a";
        this.settings.timePicker = true;
        var dt = new Date();
        this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear() + " " + ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
      } else {
        this.settings.format = "MM-dd-yyyy hh:mm a";
        this.settings.timePicker = true;
        var dt = new Date(this.data[this.control.key]);
        this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear() + " " + ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
      }
    }
  }
  MinDate() {
    var dt: any = null;
    if (this.control.startdatebindingtype == 'currentdate') {
      dt = new Date();
    } else if (this.control.startdatebindingtype == 'date') {
      dt = new Date(this.control.minDate);
    } else if (this.data[this.control.modelid] != "" && this.data[this.control.modelid] && this.control.startdatebindingtype == 'model') {
      dt = new Date(this.data[this.control.modelid]);
    }
    if (dt && typeof dt == 'object') {
      //minDate = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear() + " " + ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
    }
    return dt;
  }
  onDateSelect(event) {
    // debugger;
    var dt = new Date(event);
    if (this.control.format) {
      if (this.control.format == "date") {
        this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear();
      }
      if (this.control.format == "datetime") {
        this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear() + " " + ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
      }
      if (this.control.format == "time") {
        this.data[this.control.key] = ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
      }
    }
    else {
      this.data[this.control.key] = ("00" + (dt.getMonth() + 1)).slice(-2) + "-" + ("00" + dt.getDate()).slice(-2) + "-" + dt.getFullYear() + " " + ("00" + dt.getHours()).slice(-2) + ":" + ("00" + dt.getMinutes()).slice(-2);
    }
  }

  ngOnChanges(control: any) {
    // debugger;
    //this.selectedDate = {};
    if (this.data[this.control.key] == "undefined--" || this.data[this.control.key] == 'undefined')
      this.data[this.control.key] = "";

    if (this.data[this.control.key] && this.data[this.control.key] != "") {
      //var val = (this.data[this.control.key] && typeof (this.data[this.control.key]) == "string" && this.data[this.control.key] != "") ? this.data[this.control.key].split("-") : "";
      var val = (this.data[this.control.key] && typeof (this.data[this.control.key]) == "string" && this.data[this.control.key] != "") ? this.data[this.control.key] : "";

      if (val != "") {
        //this.selectedDate.year = parseInt(val[0]);// this.getSelectedVal();
        //this.selectedDate.month = parseInt(val[1]);
        //this.selectedDate.day = parseInt(val[2]);
        this.selectedDate = val;
      }
    }
  }
  getSelectedVal() {
    var val = (this.data[this.control.key] && this.data[this.control.key] != "") ? this.data[this.control.key].split("-") : "---".split('-');

    return val.length == 3 ? { "year": val[0], "month": val[1], "day": val[2] } : null;
  }
  setServerDate(changes: any) {
    if (changes)
      this.data[this.control.key] = this.selectedDate;//this.formatForServer(this.selectedDate)
  }
  formatForServer(date: any): string {
    if (date === null) {
      return '';
    } else if (typeof date == "string") {
      return date;
    }
    try {
      return this.datePipe.transform(new Date(date.day, date.month - 1, date.year, date.hours, date.minutes), 'dd-MMM-yyyy hh:mm a');
    } catch (e) {
      return '';
    }
  }

}
