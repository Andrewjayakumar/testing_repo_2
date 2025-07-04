import {
  Component, OnInit, Input, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
const _ = require('lodash');
@Component({
  selector: 'app-email-ui',
  templateUrl: './email-ui.component.html',
  styleUrls: ['./email-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailUiComponent implements OnInit, OnChanges, DoCheck, OnDestroy {

  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public disabled: boolean = false;
  
  public control_id = null;

  model: string = "";
  emailmodel: any = []
  constructor(public _controlService: FormControlService, private cd: ChangeDetectorRef) {

  }
  modelData: any
  ngDoCheck() {
    if (this.modelData != this.data[this.control.key]) {
      this.modelData = this.data[this.control.key];
      this.Initialize();
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
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
  }
  ngOnChanges() {
    debugger;
    this.Initialize();
    }

    ngOnDestroy() {
        if (this.control.require) {
           
            this._controlService.removeValidationOnDestroy(this.control);
            //this.cd.detectChanges();
        }
    }

  Initialize() {
    if (this.control.multipleemail) {
      this.model = "";
      if (this.data[this.control.key]) {
        this.emailmodel = this.data[this.control.key].split(',');
      }
    } else {
      this.model = this.data[this.control.key];
    }
  }
  remove(item) {
    this.emailmodel.splice(this.emailmodel.indexOf(item), 1);
    this.focusout();
  }
  checkEmail(email) {
    var regExp = /[a-zA-Z0-9!#$%&amp;'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*/i;
    return regExp.test(email);
  }
  checkEmails() {
    var hasErrors = false;
    var errorMessage = "";
    for (var i = 0; i <= (this.emailmodel.length - 1); i++) {
      if (this.checkEmail(this.emailmodel[i])) {
        //Do what ever with the email.
      } else {
        hasErrors = true;
        // errorMessage += "invalid email: " + emailArray[i] + "\n\r";
      }
    }
    return this.emailmodel.length == 0 ? true : hasErrors;
  }
  keypress(e) {
    debugger;
    if (this.control.multipleemail) {
      if (e.key == " " || e.key == ',') {
        this.emailmodel.push(this.model);
        this.model = "";
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  focusout() {
    debugger;
    if (this.control.multipleemail) {
      this.data[this.control.key] = _.map(this.emailmodel).join(', ');
    } else {
      this.data[this.control.key] = this.model;
    }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key])

    this.cd.markForCheck();
  }
}
