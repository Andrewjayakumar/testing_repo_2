import {
  Component, OnInit, Input, OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-form-wizard-ui',
  templateUrl: './form-wizard-ui.component.html',
  styleUrls: ['./form-wizard-ui.component.scss']
})
export class FormWizardUiComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public formdata: any = {};
  @Input() public AuthService;

  activeTabIndex: number = 0;
  activePanelIndex: any = [];
  LastIndex: number;
  IsComplete: boolean = false;
  TotalChildren: number = 0;
  controlList: any = [];
  innerHeight: any;
  innerWidth: any;

  constructor(public _controlService: FormControlService) {
    this.innerHeight = window.screen.height;
    this.innerWidth = window.screen.width;
  }
  ngOnInit() {
    this.activeTabIndex = 0;
    this.LastIndex = 1;
    this.controlList.push(this.control);

    this.activePanelIndex = [];
    if (this.access != "write") {
      for (let i = 0; i < this.control.children.length; i++) {
        this.activePanelIndex[i] = this.control.children[i];
      }
    }
  }
  GenerateHTML(children: any, i: number) {
    var html = "";
    this.GenerateHTMLRecursive(children, i, html);
    return html;
  }
  GenerateHTMLRecursive(children: any, i: number, html: string) {
    for (let ch of children) {
      html = "<ng-container>";
      if (this.activeTabIndex >= i) {
        html = html + "<div class='step-sub-list'><label>" + ch.label + ":</label><div class='lableData'>" + this.data[ch.key] + "</div></div></ng-container>";
        if (ch.haschildren == true)
          this.GenerateHTMLRecursive(children, i, html);
      }
    }
  }
  ngOnChanges(control: any) {
    this.TotalChildren = 0;

    this.control.children.forEach(tab => {
      tab.children.forEach(item => {
        this.TotalChildren++;
      })
    })

    this.TotalChildren = this.TotalChildren * this.control.children.length;

  }
  tabChange(id: any, tab) {

    this.LastIndex = this.control.children.length - 1;
    if (id == this.activeTabIndex + 1 || tab.enabled == true) {
      this.IsComplete = false;
      this.activeTabIndex = id;
    }
    window.scrollTo(0, 0)

  }
  panelChange(i, tab) {
    if (this.activePanelIndex[i] == null)
      this.activePanelIndex[i] = tab;
    else
      this.activePanelIndex[i] = null;
  }
  SetTabindex(type: any) {
    if (this.validateForm() || type == "Prev") {
      this.LastIndex = this.control.children.length - 1;
      if (type == "Next") {
        this.activeTabIndex++;
        this.Save();
      } else {
        if (this.activeTabIndex == 1) {
          this._controlService.formvalidation = {};
        }
        this.activeTabIndex--;
      }
      window.scrollTo(0, 0)
    }
  }
  Save() {

  }
  Complete() {
    this.IsComplete = true;
  }
  GetLink(id: string) {
    return '#' + id;
  }
  GetClass(id) {
    return this.activeTabIndex == id ? 'tab-pane active' : 'tab-pane';
  }
  GetTabClass(item, id) {
    var _class = '';
    if (item.enabled == true && this.IsComplete == true && this.LastIndex == id)
      _class = 'nav-item enabled';
    else if (this.LastIndex == id && this.IsComplete == true) {
      item.enabled = true;
      _class = 'nav-item active';
    } else if (this.activeTabIndex == id) {
      item.enabled = true;
      _class = 'nav-item active';
    } else if (item.enabled == true)
      _class = 'nav-item enabled';
    else
      _class = 'nav-item';

    return _class;
  }
  GetSidebarClass(id) {
    var _class = '';
    if (id == this.activeTabIndex) {
      _class = 'step completed';
    } else {
      _class = 'step';
    }
    return _class;
  }
  SidebarChange(id: any) {
    if (this.validateForm() || id < this.activeTabIndex) {
      if (id == 0) {
        this._controlService.formvalidation = {};
      }
      this.activeTabIndex = id;
      //$('html, body').animate({
      //    scrollTop: 0
      //}, 400);
      this.LastIndex = this.control.children.length - 1;
    }
  }
  validateForm() {
    debugger;
    var valid = true;
    if (this.control.enablestepvalidation) {
      var mandatoryCtrl = [];
      // This function deals with validation of the form fields
      var currentTab = this.control.children[this.activeTabIndex];
      currentTab.children.forEach(child => {
        if (child.haschildren) {
          child.children.forEach(_child => {
            if (_child.require) {
              mandatoryCtrl.push(_child)
            }
          })
        }
        else if (child.require) {
          mandatoryCtrl.push(child)
        }
      })
      if (mandatoryCtrl.length > 0) {
        Object.keys(this._controlService.formvalidation).forEach(
          (key) => {
            const value: any = this._controlService.formvalidation[key] ? this._controlService.formvalidation[key] : {};
            var control = mandatoryCtrl.find(x => x.key == key);
            if (control && value.status == 'fail') {
              valid = false;
              var control_id = control.isTableView ? this.data['id'] + control.key : control.id;
              if (this.formGroup.controls[control_id]) {
                this.formGroup.controls[control_id].markAsTouched();
              }
            }
            //arr.push({ "key": key, "value": value.status, "control": value.control });
          }
        );
        this._controlService.ruleComponentDetectChanges();
      }
    }
    return valid; // return the valid status
  }
  GetPositionMargin() {
    return this.control.position == 'left' ? '0 auto 20px' : this.control.position == 'top' ? '80px auto' : '0 auto 20px';
  }
  getValidationFailedCount() {
    var arr: any = [];
    Object.keys(this._controlService.formvalidation).forEach(
      (key) => {
        arr.push(this._controlService.formvalidation[key]);
      }
    );
    var isValid = arr.filter(item => item == 'fail');

    return isValid;
  }
}
