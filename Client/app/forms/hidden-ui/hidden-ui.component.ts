import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from "../../core/authservice/auth.service";
import { FormControlService } from '../form-control.service';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-hidden-ui',
  templateUrl: './hidden-ui.component.html',
  styleUrls: ['./hidden-ui.component.scss']
})
export class HiddenUiComponent implements OnDestroy, OnChanges {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public AuthService: any;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(
      private _router: Router,
      private _controlService: FormControlService, private localStorage: LocalStoreManager) {
    this._controlService.hiddenRefresh$
      .takeUntil(this.unsubscribe)
      .subscribe((data: any) => {
        if (this.control.stoprefresh != true) {
          this.setHiddenField();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngOnChanges(control: any) {
    this.setHiddenField();
  }
  setHiddenField() {
   // debugger;
      if (this.control.sourcetype == 'static') {
          this.data[this.control.key] = this.getStaticValue();
          // console.log(this.data[this.control.key]);
      }
      else if (this.control.sourcetype == 'pagevariable') {
          let currentUrl = this._router.url ? this._router.url : "/";
          if (currentUrl.indexOf('?') > -1) {
              currentUrl = currentUrl.split('?')[0];
          }
          const activateParams = this._controlService.getQueryParams();
          //var menu = this.AuthService.Menu;
          //var page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
          if (currentUrl) {
              let menu = this.AuthService.Menu;
              let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
              if (page) {
                  var _othis = this;
                  page.Params.forEach(option => {
                      if (option.name == _othis.control.modelvalue) {
                          let activeParam = activateParams.find(x => x[option.name]);
                          if (activeParam) {
                              _othis.data[_othis.control.key] = activeParam[option.name];
                          } else {
                                _othis.data[_othis.control.key] = option.value;
                          }
                      }
                  })
              }
          }
      } else if (this.control.sourcetype === 'userid') {
          this.data[this.control.key] = this.AuthService.currentUser.email;
      } else if (this.control.sourcetype === 'date') {
          this.data[this.control.key] = new Date();
      } else if (this.control.sourcetype === 'day') {
          this.data[this.control.key] = new Date().getDay();
      } else if (this.control.sourcetype === 'month') {
          this.data[this.control.key] = new Date().getMonth();
      } else if (this.control.sourcetype === 'time') {
          this.data[this.control.key] = new Date().toLocaleTimeString();
      } else if (this.control.sourcetype === 'roleid') {
          if (this.control.modelvalue) {
              const role = this.AuthService.currentUser.roles.find(x => x.rolename == this.AuthService.currentUser.activerolename && x.roleid.toString() === this.AuthService.currentUser.activerole.toString())
              if (role) {
                  this.data[this.control.key] = role[this.control.modelvalue];
              } else {
                  this.data[this.control.key] = this.AuthService.currentUser.activerole;
              }
          } else {
              this.data[this.control.key] = this.AuthService.currentUser.activerole;
          }
      } else if (this.control.sourcetype === 'rolename') {
          //const role = this.AuthService.currentUser.roles.find(x => x.activerolename==this.AuthService.currentUser.activerolename && x.roleid.toString() === this.AuthService.currentUser.activerole.toString())

          this.data[this.control.key] = this.AuthService.currentUser.activerolename;
      } else if (this.control.sourcetype === 'hierarchy') {
          const role = this.AuthService.currentUser.roles.find(x => x.rolename == this.AuthService.currentUser.activerolename && x.roleid.toString() === this.AuthService.currentUser.activerole.toString())

          this.data[this.control.key] = role && Array.isArray(role.roleslink) && role.roleslink.length > 0 ? role.roleslink[0].hierarchy : '';
      }
      else if (this.control.sourcetype === 'localstorage') {
          //only one level of drilling down object is possible
          let localstorageKey = this.control.modelvalue;
          let dotSeparatedKeys = localstorageKey.split(".");

          let Obj = this.localStorage.getDataObject(dotSeparatedKeys[0]);
          if (dotSeparatedKeys[1] && dotSeparatedKeys[1] !== "") {
              this.data[this.control.key] = Obj[dotSeparatedKeys[1]];
          }
          else
              this.data[this.control.key] = Obj;
         // console.debug("From localstorage" + Obj + " hidden val" + this.data[this.control.key]);

      }
      else if (this.control.modelvalue) {
      this.data[this.control.key] = this.data[this.control.modelvalue];
    }
  }
  getStaticValue() {
    var value = this.control.modelvalue ? this.control.modelvalue : "''";
    const reg = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (value == 'false') {
      return false;
    } else if (value == 'true') {
      return true;
    } else if (reg.test(value) && value.substring(0, 1) != "'") {
      return JSON.parse(value);
    }
    else {
      if (value.substring(0, 1) == "'") {
        return value.slice(1, -1);
      } else {
        if (isNaN(parseFloat(value)))
          return value;
        else
          return parseFloat(value);
      }
    }
  }
}
