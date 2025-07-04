import { Component, OnInit, Input, OnDestroy, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../core/services/data.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-ui',
  templateUrl: './tab-ui.component.html',
  styleUrls: ['./tab-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TabUiComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService;

  activePanelIndex: any = [];
  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw', backdrop: 'static', keyboard: false };
  Submitconfirm: string = "";
  Message: string = "Note: Selecting #NEW will remove any values you may have entered when you previously selected #OLD";
  SubmitMessage: string = "";
  ConfirmedText: string = "";
  advanceSearchformJson: any
  advanceSearchModelJson: any
  form: FormGroup

  private _success = new Subject<string>();
  successMessage: string = "";
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(public _controlService: FormControlService,
    private modalService: NgbModal,
    private _appService: DataService, private cd: ChangeDetectorRef, private _router: Router) {
    this._controlService.TabRefreshCallCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        (data) => {
          debugger;
          if (data && (data.controlkey == this.control.key || data.controlkey == null)) {
            if (data && data.successmsg) {
              this.changeSuccessMessage(data.successmsg);
              this.cd.detectChanges();
            }
            this.GetModalData();
          }
        }
      );
  }

  ngOnInit() {
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
    this.activePanelIndex = [];
    if (this.access != "write") {
      for (let i = 0; i < this.control.children.length; i++) {
        this.activePanelIndex[i] = this.control.children[i];
      }
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  defaulttabindex: any = null;
  ngOnChanges() {
    debugger;
    if (this.control.IsExternalFormLoad && this.control.children.length > 0) {
      var defaulttabindex: number = this.control.defaulttabindex && this.control.defaulttabindex >= 0 ? this.control.defaulttabindex : 0;
      if (this.control.rememberlastselectedtab) {
        const key = this._controlService.getLocalStorage(this.control.key, this.AuthService);
        this.defaulttabindex = key ? key : this.control.children[defaulttabindex].formid
        this.initTab(this.defaulttabindex);
      } else {
        this.defaulttabindex = this.control.children[defaulttabindex].formid;
        this.initTab(this.defaulttabindex);
      }
    } else if (this.control.IsImageButtonView && this.control.children.length > 0) {
      if (this.control.rememberlastselectedtab) {
        var tab: any = this._controlService.getLocalStorage(this.control.key, this.AuthService);
        this.data[this.control.key] = tab ? tab.label : this.control.children[0].label;
        if (tab) {
          this.ResetChildren(null, tab, true);
        } else {
          tab = this.control.children.find(x => x.label == this.data[this.control.key]);
          this.ResetChildren(null, tab, true);
        }
      } else {
        this.data[this.control.key] = this.control.children[0].label;
        this.ResetChildren(null, this.control.children[0], true);
      }
    } else if (this.control.IsButtonView || this.control.IsImageButtonView || this.control.IsExternalFormLoad) {
      let tab = this.control.children.find(x => x.label == this.data[this.control.key]);
      if (tab) {
        this.ResetChildren(null, tab, true);
      } else {
        this.data[this.control.key] = this.control.children.length > 0 ? this.control.children[0].label : this.data[this.control.key];
        tab = this.control.children.find(x => x.label == this.data[this.control.key]);
        if (tab) {
          this.ResetChildren(null, tab, true);
        }
      }
    }
    this.ConfirmedText = this.data[this.control.key];
  }
  panelChange(i, tab) {
    if (this.activePanelIndex[i] == null)
      this.activePanelIndex[i] = tab;
    else
      this.activePanelIndex[i] = null;
  }
  selectedTab: any
  ResetChildren(content: any, tab: any, firstLoad: boolean = false) {
    this.selectedTab = tab;
    if (this.control.rememberlastselectedtab) {
      this._controlService.resetPageSearchVarible();
      this._controlService.setLocalStorage(tab, this.control.key, this.AuthService);
    }
    if (tab && tab.formid) {
      this.loadMetadata(tab.formid);
    }
    if (this.ConfirmedText && this.ConfirmedText != '') {
      this.SubmitMessage = this.Message.replace("#NEW", tab.label);
      this.control.children.forEach(child => {
        if (tab.label != child.label) {
          this.SubmitMessage = this.SubmitMessage.replace("#OLD", child.label);
        }
      })
      if (!firstLoad) {
        this.clearButtonViewData();
      }
      this.ConfirmedText = this.data[this.control.key];
      //this.modalService.open(content, this.options).result.then((result) => {
      //    if (this.Submitconfirm == "OK") {
      //        this.clearButtonViewData();
      //        this.ConfirmedText = this.data[this.control.key];
      //    }
      //    else {
      //        this.data[this.control.key] = this.ConfirmedText;
      //        this.Submitconfirm = "Cancel";
      //    }
      //});
    } else {
      this.ConfirmedText = this.data[this.control.key];
      if (!firstLoad) {
        this.clearButtonViewData();
      }
    }
  }
  clearButtonViewData() {
    if (!this.control.IsallowChilddata) {
      this.control.children.forEach(child => {
        child.children.forEach(_child => {
          if (Array.isArray(this.data[_child.key])) {
            this.data[_child.key] = [];

          }
          else if (_child.type == 'date') {
            this.data[_child.key] = "2017-10-01";
          } else if (this.data[_child.key]) {
            this.data[_child.key] = "";
          }
        })
      })
    }
  }
  /**
   * This is common method use for copy json data into another object
   * @param o
   */
  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
  tabChange(event) {
    // debugger;
    this.initTab(event.nextId);
  }
  initTab(formid) {
    if (this.control.rememberlastselectedtab) {
      this._controlService.resetPageSearchVarible();
      this._controlService.setLocalStorage(formid, this.control.key, this.AuthService);
    }
    this.loadMetadata(formid);
  }

  loadMetadata(formid) {
    this._controlService.formvalidation = {};
    this._controlService.formvalid = false;
    this._controlService.dataModel = [];
    // debugger;
    this.advanceSearchformJson = null;
    this.advanceSearchModelJson = null;
    let apiparam: any = {};
    apiparam.id = formid;
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          // debugger;
          this.form = this._controlService.toControlGroup(data.controls);
          this.advanceSearchformJson = this._controlService.deepcopy(data);
          // this.advanceSearchformJson.controls.forEach(control => {
          //   this._controlService.addValidation(control, this.form);
          // })
          this.GetModalData();
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }
  GetModalData() {
    // debugger;
    let apiparam: any = {};
    var url = this.advanceSearchformJson ? this.advanceSearchformJson.GetEndpoint : null;
    if (url) {
      this.advanceSearchformJson.GetEndpointParams.forEach(option => {
        apiparam[option.key] = option.value;
      })
      this._controlService.setPageVarible(this.advanceSearchformJson.GetEndpointParams, apiparam, this.AuthService);

      this._appService.get(url, apiparam, false)
        .subscribe(
          (data: any) => {
            // debugger;
            if (Array.isArray(data))
              this.advanceSearchModelJson = data.length > 0 ? data[0] : this.advanceSearchformJson.ModelJson;
            else
              this.advanceSearchModelJson = data;

            this._controlService.GenerateDataJson(this.advanceSearchformJson.controls, this.advanceSearchModelJson, this.form, null, this.advanceSearchformJson.Id);

            if (this.advanceSearchModelJson["id"] == "")
              delete this.advanceSearchModelJson["id"];

            this._controlService.ruleComponentDetectChanges();
                this.cd.detectChanges();

              /** setTimeout(() => {
                    if (this.cd !== null && this.cd !== undefined &&
                        !(this.cd as ViewRef_).destroyed) {
                        this.cd.detectChanges();
                    }
            }, 250);
        **/
          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    } else if (this.advanceSearchformJson) {
      // debugger;
      this.advanceSearchModelJson = this.advanceSearchformJson ? this.advanceSearchformJson.ModelJson : {};

      this._controlService.GenerateDataJson(this.advanceSearchformJson.controls, this.advanceSearchModelJson, this.form, null, this.advanceSearchformJson.Id);

      if (this.advanceSearchModelJson["id"] == "")
        delete this.advanceSearchModelJson["id"];

      this._controlService.ruleComponentDetectChanges();
    }
  }
  changeSuccessMessage(messages: any = null) {
    if (messages)
      this._success.next(messages);
    else
      this._success.next("Save successfully");
  }
  actionType(action) {
    return Array.isArray(action.rules) && action.rules.length > 0 ? action.rules[0].action : '';
  }
  ruleCheck(action) {
    if (action.rules && action.rules.length > 0) {
      if (this.actionType(action) == 'hide') {
        return !this.isHidden(action.rules);
      } else if (this.actionType(action) == 'show') {
        return this.isVisible(action.rules);
      } else if (this.actionType(action) == 'disable') {
        return this.isDisabled(action.rules);
      } else if (this.actionType(action) == 'enable') {
        return !this.isEnable(action.rules);
      }
    }
    else {
      return true;
    }
  }
  isVisible(ActionRules) {
    var disabled = false;
    if (Array.isArray(ActionRules)) {
      var rules = ActionRules.filter(x => x.action == 'show' && (x.condition == 'or' || !x.condition));
      rules.forEach(rule => {
        if (disabled == false) {
          switch (rule.operator[0]) {
            case '=':
              disabled = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              disabled = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              disabled = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        }
      })

      rules = ActionRules.filter(x => x.action == 'show' && x.condition == 'and');
      if (rules.length > 0 && disabled) {
        disabled = false;
        rules.forEach(rule => {
          switch (rule.operator[0]) {
            case '=':
              disabled = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              disabled = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              disabled = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        })
      }
    }
    return disabled;
  }
  isEnable(ActionRules) {

    var disabled = false;
    if (Array.isArray(ActionRules)) {
      var rules = ActionRules.filter(x => x.action == 'enable' && (x.condition == 'or' || !x.condition));
      rules.forEach(rule => {
        if (disabled == false) {
          switch (rule.operator[0]) {
            case '=':
              disabled = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              disabled = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              disabled = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        }
      })

      rules = ActionRules.filter(x => x.action == 'enable' && x.condition == 'and');
      if (rules.length > 0 && disabled) {
        disabled = false;
        rules.forEach(rule => {
          switch (rule.operator[0]) {
            case '=':
              disabled = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              disabled = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              disabled = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        })
      }
    }
    return disabled;
  }
  isDisabled(ActionRules) {

    var disabled = false;
    if (Array.isArray(ActionRules)) {
      var rules = ActionRules.filter(x => x.action == 'disable' && (x.condition == 'or' || !x.condition));
      rules.forEach(rule => {
        if (disabled == false) {
          switch (rule.operator[0]) {
            case '=':
              disabled = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              disabled = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              disabled = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        }
      })

      rules = ActionRules.filter(x => x.action == 'disable' && x.condition == 'and');
      if (rules.length > 0 && disabled) {
        disabled = false;
        rules.forEach(rule => {
          switch (rule.operator[0]) {
            case '=':
              disabled = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              disabled = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              disabled = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              disabled = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              disabled = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        })
      }
    }
    return disabled;
  }
  isHidden(ActionRules) {
    var hidden = false;
    if (Array.isArray(ActionRules)) {
      var rules = ActionRules.filter(x => x.action == 'hide' && (x.condition == 'or' || !x.condition));
      rules.forEach(rule => {
        if (hidden == false) {
          switch (rule.operator[0]) {
            case '=':
              hidden = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              hidden = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              hidden = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              hidden = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              hidden = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        }
      })

      rules = ActionRules.filter(x => x.action == 'hide' && (x.condition == 'and' || !x.condition));
      if (rules.length && hidden) {
        hidden = false;
        rules.forEach(rule => {
          switch (rule.operator[0]) {
            case '=':
              hidden = this.convertToString(rule.value) == this.convertToString(this.data[rule.control], rule.control);
              break;
            case '<>':
              hidden = this.convertToString(rule.value) != this.convertToString(this.data[rule.control], rule.control);
              break;
            case '>':
              hidden = parseInt(rule.value) < parseInt(this.data[rule.control]);
              break;
            case '<':
              hidden = parseInt(rule.value) > parseInt(this.data[rule.control]);
              break;
            case 'in':
              hidden = this.convertToString(rule.value).replace(/, /g, ",").split(",").indexOf(this.convertToString(this.data[rule.control], rule.control)) > -1;
              break;
          }
        })
      }
    }
    return hidden;
  }
  getPageVariable() {
    var data = {};
    let currentUrl = this._router.url ? this._router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    const activateParams = this._controlService.getQueryParams();
    if (currentUrl) {
      let menu = this.AuthService.Menu;
      let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      if (page) {
        page.Params.forEach(option => {
          let activeParam = activateParams.find(x => x[option.name]);
          if (activeParam) {
            data[option.name] = activeParam[option.name];
          } else {
            data[option.name] = option.value;
          }

        })
      }
    }
    return data;
  }
  convertToString(val, field = null) {
    if (val === undefined && field) {
      const data = this.getPageVariable();
      return data[field] ? data[field].toString().trim().toLowerCase() : '';
    } else if (val) {
      return val.toString().trim().toLowerCase()
    } else {
      return "";
    }
  }
}
