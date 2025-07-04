import {
  Component, OnInit, OnChanges, Input, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-rules-container',
  templateUrl: './rules-container.component.html',
  styleUrls: ['./rules-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesContainerComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _controlService: FormControlService, private cd: ChangeDetectorRef) {
    this._controlService.ruleDetectedChanges$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          if (this.cd !== null &&
            this.cd !== undefined &&
            !(this.cd as any).destroyed) {
            this.cd.detectChanges();
          }
        }
      );

    // this.cd.detach()
    // setInterval(() => {
    //   if (this.cd !== null &&
    //     this.cd !== undefined &&
    //     !(this.cd as any).destroyed) {
    //     this.cd.detectChanges();
    //   }
    // }, 500)
  }
  actionType: any
  modeljson: any
  ngOnInit() {
    debugger;
    this.actionType = Array.isArray(this.control.rules) && this.control.rules.length > 0 ? this.control.rules[0].action : '';
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngDoCheck() {
    if (JSON.stringify(this.modeljson) != JSON.stringify(this.data)) {
      this.modeljson = this._controlService.deepcopy(this.data);
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.cd.detectChanges();
      }
    }
  }
  ngOnChanges(control: any) {
    debugger;
  }
  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  convertToString(val) {
    var _data = this.deepcopy(this.data);
    if (_data[val] || _data[val]==false) {
      return _data[val].toString().trim().toLowerCase()
    } else {
      return "";
    }
  }
  isVisible(control) {
    var visible = false;
    if (Array.isArray(this.control.rules)) {
      var rules = this.control.rules.filter(x => x.action == 'show');
      rules.forEach(rule => {
        if (visible == false) {
          switch (rule.operator[0]) {
            case '=':
              visible = rule.value.toString() == this.convertToString(rule.control[0]);
              break;
            case '<>':
              visible = rule.value.toString() != this.convertToString(rule.control[0]);
              break;
            case '>':
              visible = parseInt(rule.value) < parseInt(this.data[rule.control[0]]);
              break;
            case '<':
              visible = parseInt(rule.value) > parseInt(this.data[rule.control[0]]);
              break;
            case 'in':
              visible = rule.value.toString().indexOf(this.convertToString(rule.control[0])) > -1;
              break;
          }
        }
      })
    }
    if (!visible && this._controlService.formvalidation[control.key] && control.require && !control.isduplicatekeyinhidden) {
      // console.log(JSON.stringify(this._controlService.formvalidation[control.key]))
      delete this._controlService.formvalidation[control.key];
    }
    if ((this.data[this.control.controlkey] || this.data[this.control.controlkey]===false) && this.control.resetdatamodel && this.control.controlvalue && this.control.controlvalue.find(x => x.toString().toLowerCase() == this.data[this.control.controlkey].toString().toLowerCase())) {
      // console.log(this.control.key);
      this._controlService.GenerateDataJson(this.control.children, this.data, null, true, null, true);
      this._controlService.RefreshhiddenControl();
    }
    return visible;
  }
  isEnable(control) {

    var enable = false;
    if (Array.isArray(this.control.rules)) {
      var rules = this.control.rules.filter(x => x.action == 'enable');
      rules.forEach(rule => {
        if (enable == false) {
          switch (rule.operator[0]) {
            case '=':
              enable = rule.value.toString() == this.convertToString(rule.control[0]);
              break;
            case '<>':
              enable = rule.value.toString() != this.convertToString(rule.control[0]);
              break;
            case '>':
              enable = parseInt(rule.value) < parseInt(this.data[rule.control[0]]);
              break;
            case '<':
              enable = parseInt(rule.value) > parseInt(this.data[rule.control[0]]);
              break;
            case 'in':
              enable = rule.value.toString().indexOf(this.convertToString(rule.control[0])) > -1;
              break;
          }
        }
      })
    }
    if (!enable && this._controlService.formvalidation[control.key] && control.require && !control.isduplicatekeyinhidden) {
      delete this._controlService.formvalidation[control.key];
    }
    return enable;
  }
  isDisabled(control) {

    var disabled = false;
    if (Array.isArray(this.control.rules)) {
      var rules = this.control.rules.filter(x => x.action == 'disable');
      rules.forEach(rule => {
        if (disabled == false) {
          switch (rule.operator[0]) {
            case '=':
              disabled = rule.value.toString() == this.convertToString(rule.control[0]);
              break;
            case '<>':
              disabled = rule.value.toString() != this.convertToString(rule.control[0]);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control[0]]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control[0]]);
              break;
            case 'in':
              disabled = rule.value.toString().indexOf(this.convertToString(rule.control[0])) > -1;
              break;
          }
        }
      })
    }
    if (disabled && this._controlService.formvalidation[control.key] && control.require && !control.isduplicatekeyinhidden) {
      delete this._controlService.formvalidation[control.key];
    }
    return disabled;
  }
  isHidden(control) {
    var hidden = false;
    if (Array.isArray(this.control.rules)) {
      var rules = this.control.rules.filter(x => x.action == 'hide');
      rules.forEach(rule => {
        if (hidden == false) {
          switch (rule.operator[0]) {
            case '=':
              hidden = rule.value.toString() == this.convertToString(rule.control[0]);
              break;
            case '<>':
              hidden = rule.value.toString() != this.convertToString(rule.control[0]);
              break;
            case '>':
              hidden = parseInt(rule.value) < parseInt(this.data[rule.control[0]]);
              break;
            case '<':
              hidden = parseInt(rule.value) > parseInt(this.data[rule.control[0]]);
              break;
            case 'in':
              hidden = rule.value.toString().indexOf(this.convertToString(rule.control[0])) > -1;
              break;
          }
        }
      })
    }
    if (hidden && this._controlService.formvalidation[control.key] && control.require && !control.isduplicatekeyinhidden) {
      delete this._controlService.formvalidation[control.key];
    }
    if ((this.data[this.control.controlkey] || this.data[this.control.controlkey]===false) && this.control.resetdatamodel && this.control.controlvalue && this.control.controlvalue.find(x => x.toString().toLowerCase() == this.data[this.control.controlkey].toString().toLowerCase())) {
      // console.log(this.control.key);
      this._controlService.GenerateDataJson(this.control.children, this.data, null, true, null, true);
      this._controlService.RefreshhiddenControl();
    }
    return hidden;
  }
}
