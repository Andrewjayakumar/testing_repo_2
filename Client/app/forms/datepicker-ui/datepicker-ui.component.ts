import {
  Component, OnInit, Input, OnChanges, ViewChild, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "./ngb-date-fr-parser-formatter"
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'app-datepicker-ui',
  templateUrl: './datepicker-ui.component.html',
  styleUrls: ['./datepicker-ui.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DatepickerUiComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @ViewChild('container') container;
  datePipe = new DatePipe('en-US');
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  @Input() public disabled: boolean = false;
  
  public hide = true;
  public control_id = null;
  public is_dateTyped = false;
  dynamicId: any;
  selectedTime: any = "00:00";
  selectedDateFrom: any = null;
  selectedDateTo: any = null;
  selectedDate = null;
  isFirstLoad: boolean = true;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(public parserFormatter: NgbDateParserFormatter, public _controlService: FormControlService,
    private atp: AmazingTimePickerService, private cd: ChangeDetectorRef) {
    //this.time = { "hour": "00", "minute": "00" };
    this._controlService.dateDetectedChanges$
      .takeUntil(this.unsubscribe)
      .subscribe(
          (componentkey?) => {
          if (this.control.startdatebindingtype == 'model') {
              this.detectChanges();
              if (!this.isFirstLoad && componentkey == this.control.key) { //clear as the model of erlier Date had changed
                  this.selectedDate = null;
              }
          }
        }
      );

    this._controlService.componentResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.selectedDateFrom = null;
          this.selectedDateTo = null;
          this.selectedDate = null;
        }
      );
    document.addEventListener('click', this.offClickHandler.bind(this));
  }
  open() {
     debugger;
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedTime = time;

        var _date = this.parserFormatter.format(this.selectedDate);
        if (_date === "undefined") {
            //soemtimes date comes as a string when types from keyboard
            _date = this.selectedDate;
        }
      if (_date == "01/01/1" || _date == "")
        this.data[this.control.key] = null;
      else
        this.data[this.control.key] = _date + ' ' + this.selectedTime;

      this.MarkforCheck();
    });
  }
  MarkforCheck() {
    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.markForCheck();
    }
  }
  detectChanges() {
    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.detectChanges();
    }
  }
  offClickHandler(event: any) {

    if (this.container && this.container.nativeElement) {
      if (!this.container.nativeElement.contains(event.target)) {
        if (this.dynamicId) {
          this.dynamicId.close();
        }
        // check click origin
        // this.control_id.close();    
      }
    }
  }
  SetId(id) {
    this.dynamicId = id;
  }

  model: any
  ngDoCheck() {
    if (this.model != this.data[this.control.key]) {
      this.model = this.data[this.control.key];
      this.MarkforCheck();
    }
    if (this.control.require && this.formGroup.controls[this.control_id] && this.formGroup.controls[this.control_id].touched) {
      this.detectChanges();
    }
  }
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
  }
  ngOnDestroy() {
      if(this.control.require)
          this._controlService.removeValidationOnDestroy(this.control);

      //this.cd.markForCheck();
     // this.cd.detectChanges();

      this.unsubscribe.next(true);
      this.unsubscribe.complete();
  }
  isDisabled() {
    if ((!this.data[this.control.modelid] || this.data[this.control.modelid] == '') && this.control.startdatebindingtype == 'model') {
       debugger;
      this.data[this.control.key] = null;
      this.selectedDate = null;
      return true;
    }
    else {
      return false;
    }
  }
  ngOnChanges(control: any) {
    debugger;
    this.isFirstLoad = true;
    this.selectedDate = null;
    if (this.data[this.control.key] == "undefined--" || this.data[this.control.key] == "undefined")
      this.data[this.control.key] = null;
    if (this.data[this.control.key] && this.data[this.control.key] != "") {
      var val: any = new Date(this.data[this.control.key]); //(this.data[this.control.key] && typeof (this.data[this.control.key]) == "string" && this.data[this.control.key] != "") ? this.data[this.control.key].split("/") : "";

      if (val && val != "Invalid Date") {
        // const options: any = {
        //   hour: 'numeric',
        //   minute: 'numeric',
        //   hour12: true
        // };
        // let datetimeString = val.toLocaleString('en-US', options);

          if (this.control.addRemoveDays) {
              val = this.addRemoveDaysfromBindingDate(val);
          }
        this.selectedDate = {}
        this.selectedDate.year = val.getFullYear(); //parseInt(val[2]);// this.getSelectedVal();
        this.selectedDate.month = val.getMonth() + 1;//parseInt(val[0]);
        this.selectedDate.day = val.getDate(); //parseInt(val[1]);
          this.selectedTime = (val.getHours().toString().length == 2 ? val.getHours().toString() : '0' + val.getHours().toString()) + ':' + (val.getMinutes().toString().length == 2 ? val.getMinutes().toString() : '0' + val.getMinutes().toString());
      }
    } else {
      this.selectedDate = new Date();
    }
    this.MarkforCheck();
  }
  getSelectedVal() {
    var val = (this.data[this.control.key] && this.data[this.control.key] != "") ? this.data[this.control.key].split("-") : "---".split('-');

    return val.length == 3 ? { "year": val[0], "month": val[1], "day": val[2] } : null;
  }
  defaultMinDate: any = { year: 1970, month: 1, day: 1 };
  MinDate() {
    var minDate = null;
    var date: any
    if (this.control.startdatebindingtype == 'currentdate') {
      date = new Date();
    } else if (this.control.startdatebindingtype == 'date') {
      date = new Date(this.control.minDate);
    } else if (this.data[this.control.modelid] != "" && this.data[this.control.modelid] && this.control.startdatebindingtype == 'model') {
        date = new Date(this.data[this.control.modelid]);
    }
    if (date && typeof date == 'object') {
      minDate = {};
      minDate.year = date.getFullYear();// this.getSelectedVal();
      minDate.month = date.getMonth() + 1;
      minDate.day = date.getDate();
    }
    return minDate ? minDate : this.defaultMinDate;
  }
  //modelChange(event) {
  //  debugger;
  //  this.data[this.control.key] = this.parserFormatter.format(this.selectedDate);
  //  this._controlService.getCssforMandatory(this.control, this.data[this.control.key])
  //}
  modelChange(event, target) {
     debugger;
    var _date = this.parserFormatter.format(this.selectedDate);
      if (_date == "01/01/1" || _date == "" || event == null)
          this.data[this.control.key] = null;
      else if (typeof (this.selectedDate) === 'string' || _date === "undefined") {
          //soemtimes date comes as a string when types from keyboard
          _date = this.formatForServer(this.selectedDate);
      }
      else if (_date.length >= 10 ) {
          if (this.is_dateTyped) {
              _date = this.formatForServer(_date);
              this.data[this.control.key] = _date;
              this.is_dateTyped = false;
          }
          else
             this.data[this.control.key] = _date;
      }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key])

      //Clear Model any other date controls are binded with this date
      if (this.control.tobeclearedfields && !this.isFirstLoad) {
          let ref = this;
          this.control.tobeclearedfields.forEach(key => {
              if (ref.data[key]) {
                  ref.data[key] = null;
                  this._controlService.dateComponentDetectChanges(key);
              }
          }, ref);
      }
    if (this.control.istimeenable && !this.isFirstLoad) {
      if (this.control.openpopup) {
        this.open();
      } else {
        this.data[this.control.key] = this.data[this.control.key] + ' ' + this.selectedTime;
      }
    }
    else {
      this.isFirstLoad = false;
      }
     
    this.MarkforCheck();    
    this._controlService.dateComponentDetectChanges();
    }

    isNumber(value: any): boolean {
        if(value)
           return !isNaN(value);
        else
          return false;
    }
  timeChange(e) {
    // debugger;
    const _date = this.parserFormatter.format(this.selectedDate);
    if (_date == '01/01/1' || _date == '')
      this.data[this.control.key] = null;
    else
      this.data[this.control.key] = _date;

    this.data[this.control.key] = this.data[this.control.key] + ' ' + e.srcElement.value;

    this.MarkforCheck();
    this._controlService.dateComponentDetectChanges();
  }
  setServerDate(changes: any) {
    // debugger;
    if (changes)
      this.data[this.control.key] = this.formatForServer(this.selectedDate)
  }
    formatForServer(date: any): string {
        debugger;
     try {
      if (!date) {
        return '';
      } else if (typeof date == "string") {
          const dateParts = date.trim().split('/');
          let d :Date;
          if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
            d = new Date(parseInt(dateParts[0]), null, null );
          } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
              d = new Date(parseInt(dateParts[1]), parseInt(dateParts[0])-1, null);
          } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
              d = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
              let obj:any = {};

              obj.year = parseInt(dateParts[2]);
              obj.month= parseInt(dateParts[0]);
              obj.day = parseInt(dateParts[1]);

              this.selectedDate = obj;
          }
       return this.datePipe.transform(d, 'MM/dd/y');
      }
      return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), 'MM/dd/y');
    } catch (e) {
      return '';
    }
    }

    onKeydown(event: any) {
        let keydwn = event.target.value;
        if (event.key.toLowerCase() == 'backspace') {
            this.selectedDate = null;
            return;
        }
        this.is_dateTyped = true;
    };

    addRemoveDaysfromBindingDate(date): Date {
        if (this.control.addRemoveDays === "add") {
            let endDate = date.setDate(date.getDate() + this.control.numofDays);
            return new Date(endDate);
        }
        else if (this.control.addRemoveDays === "remove") {
            let endDate = new Date();
            endDate = date.setDate(date.getDate() - this.control.numofDays);
            return endDate;
        }
    }

}
