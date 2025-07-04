import {
  Component, OnInit, Input, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
const _ = require('lodash');

@Component({
  selector: 'app-checkbox-ui',
  templateUrl: './checkbox-ui.component.html',

  styleUrls: ['./checkbox-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxUiComponent implements OnInit, OnChanges, DoCheck {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public disabled: boolean = false;

  public control_id = null;
  public displayValue: boolean = false;
  constructor(public _controlService: FormControlService, private cd: ChangeDetectorRef) { }
  model: any
  ngDoCheck() {
    if (this.model != this.data[this.control.key]) {
      this.model = this.data[this.control.key];
      this.initialize();
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.cd.detectChanges();
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
    //this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    if (this.control.isTableView) {
      this.control_id = this.data['id'] + this.control.key;
    } else {
      this.control_id = this.control.id;
    }
    if (this.data[this.control.key] == null || this.data[this.control.key] == 'undefined') {
      this.data[this.control.key] = false;
    }
    this.initialize();
  }
  initialize() {
    if (this.control.isTableView) {
      this.control_id = this.data['id'] + this.control.key;
      this.data[this.control.key] = this.data[this.control.key] == "" ? false : this.data[this.control.key];
      if (this.control.Truevalue) {
        if (this.data[this.control.key] == this.control.Truevalue) {
          this.displayValue = true;
        } else {
          this.displayValue = false;

        }
      } else {
        this.displayValue = this.data[this.control.key];
      }
    } else {
      this.control_id = this.control.id;
      if (this.control.Truevalue) {
        if (this.data[this.control.key] == this.control.Truevalue) {
          this.displayValue = true;
        } else {
          this.displayValue = false;

        }
      } else {
        this.displayValue = this.data[this.control.key];
      }
    }
  }
  ngOnChanges() {
    
  }
  setDisplayValue(checked) {
    debugger;
    this.displayValue = checked;
    if (this.control.Truevalue) {
      if (checked) {
        this.data[this.control.key] = this.control.Truevalue;
      } else {
        this.data[this.control.key] = this.control.Falsevalue;
      }
    } else {
      this.data[this.control.key] = checked;
    }
    if (this.control.storemodel) {
      this.PinDataModel(checked);
    }
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key])
  }
  PinDataModel(checked) {
    // debugger;
    var _data = this._controlService.deepcopy(this.data);
      delete _data[this.control.key];
    if (checked) {
      this._controlService.dataModel.push(_data)
    } else {
      _.remove(this._controlService.dataModel, function (child) {
        return JSON.stringify(child) === JSON.stringify(_data);
      });
    }
  }
}
