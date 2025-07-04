import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ViewChild,
  AfterViewInit,
  Injector
} from "@angular/core";
import {
  NgbTimeStruct,
  NgbDateStruct,
  NgbPopoverConfig,
  NgbPopover,
  NgbDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateTimePickerModel } from "./date-time-picker.model";


@Component({
  selector: "app-date-time-picker",
  templateUrl: "./date-time-picker.component.html",
  styleUrls: ["./date-time-picker.component.scss"],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent
  implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = "M/d/yyyy H:mm:ss";
  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 15;
  @Input()
  secondStep = 30;
  @Input()
  seconds = true;

  @Input()
  disabled = false;
  minDate = new Date();
  timePickerselected: any;
  btndisabled = false;



  private showTimePickerToggle = false;

  @ViewChild('timepicker') timepicker: any;

  private datetime: DateTimePickerModel = new DateTimePickerModel();
  private firstTimeAssign = true;

  // @ViewChild(NgbDatepicker, { static: true })
  // private dp: NgbDatepicker;

  @ViewChild(NgbPopover,)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  private ngControl: NgControl;

  constructor(private config: NgbPopoverConfig, private inj: Injector) {
    //config.autoClose = "outside";
    config.placement = "auto";



  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);


  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(
        this.datetime,
        DateTimePickerModel.fromLocalString(newModel)
      );
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimePickerModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimePickerModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === "") {
      this.datetime = new DateTimePickerModel();
      this.dateString = "";
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: string | NgbDateStruct, dp: NgbDatepicker) {
    const date = new DateTimePickerModel($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;

    const adjustedDate = new Date(this.datetime.toString());


    this.setDateStringModel();

  }

  onTimeChange(event: NgbTimeStruct) {
    this.datetime.hour = event.hour;
    this.datetime.minute = event.minute;
    this.datetime.second = event.second;
    this.timePickerselected = true;
    this.setDateStringModel();
    // this.config.close
  }

  cancelToggle() {
    if (!this.popover.isOpen()) {
      this.popover.open();
      console.log("open")
    } else {
      this.dateString = null;
      this.btndisabled = false;
      this.popover.close();

    }
  }
  Toggle() {
    if (!this.popover.isOpen()) {
      this.btndisabled = true

    } else {

      this.btndisabled = false

    }
  }




  setToggle() {
    if (!this.popover.isOpen()) {
      this.popover.open();
    } else {
      this.btndisabled = false;
      this.popover.close();
    }
  }

  closePopup() {
    if (this.timePickerselected) {
      this.setToggle();
    } else {
      this.timePickerselected = false;
    }
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event) {
    this.onTouched();
  }
}

function noop(): void {
  throw new Error("Function not implemented.");
}

