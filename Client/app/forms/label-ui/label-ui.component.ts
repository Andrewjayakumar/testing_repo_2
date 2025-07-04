import {
  Component, OnInit, Input, OnDestroy, AfterViewInit, DoCheck, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControlService } from '../form-control.service';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import { AuthService } from "../../core/authservice/auth.service";
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
const _ = require('lodash');

@Component({
  selector: 'app-label-ui',
  templateUrl: './label-ui.component.html',
  styleUrls: ['./label-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelUiComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService: any;

  busy: Subscription;
  pagesearchtext: any;
  ispagesearchparam: any = false;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _Router: Router,
    private _formservice: FormControlService,
    private _sanitizer: DomSanitizer,
    private _appService: DataService, private cd: ChangeDetectorRef) {
    this._formservice.LabelCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.Refresh();
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngOnInit() {
    var currentUrl = this._Router.url ? this._Router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    const redirectUrl = this.control.pageurl ? this.control.pageurl : currentUrl.substring(1);
    const menu = this.AuthService.Menu;
    const page = this._formservice.find(menu['Nav'], redirectUrl);
    this.pagesearchtext = '';

    if (page) {
      const activateParams = this._formservice.getQueryParams();
      page.Params.forEach(option => {
        if (option.name === this.control.valueField) {
          // this.pagesearchtext = option.value;
          let activeParam = activateParams.find(x => x[option.name]);
          if (activeParam) {
            this.pagesearchtext = activeParam[option.name];
          } else {
            this.pagesearchtext = option.value;
          }
        } else if (option.name === 'pagesearchparam' && option.value != '') {
          this.ispagesearchparam = true;
          this.pagesearchtext = option.value;
        }
      })
    }

    // if (this.data[this.control.valueField] && typeof this.data[this.control.valueField] == 'string') {
    //     this.data[this.control.valueField] = this.data[this.control.valueField].replace('<style>', '<style scoped>');
    // }
  }
  value: any
  ngAfterViewInit() {
    if (this.control.viewtype == 'value' || this.control.viewtype == 'namevalue') {
      this.value = this.getValue();
      this.Title = this.getTitle();
    }
  }
  model: any
  ngDoCheck() {
    if ((this.control.viewtype == 'value' || this.control.viewtype == 'namevalue') && (this.value == "" || this.value == null || this.value == undefined)) {
      this.value = this.getValue();
      this.Title = this.getTitle();
    }
    if (this.model != this.data[this.control.valueField]) {
      this.model = this.data[this.control.valueField];
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.value = this.getValue();
        this.cd.markForCheck();
      }
    }
  }
  Title: string;
  getTitle() {
    if ((this.control.viewtype == 'value' || this.control.viewtype == 'namevalue') && this.control.maxlength > 0 && this.data[this.control.valueField] && this.control.maxlength < this.data[this.control.valueField].length) {
      return this.data[this.control.valueField];
    } else {
        return this.control.title ? this.control.title : null;
    }
  }
  gethtml(Text) {
    if (typeof Text == 'string' && this.control.maxlength > 0) {
      Text = Text.length > this.control.maxlength ? (Text.substring(0, this.control.maxlength) + '..') : Text;
    }
    var s = "<" + this.control.formattype + ">" + Text + "</" + this.control.formattype + ">";
    return s;
  }
  safehtml(value) {
    if (typeof value == 'string' && this.control.maxlength > 0) {
      value = value.length > this.control.maxlength ? (value.substring(0, this.control.maxlength) + '..') : value;
    }
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
  getValue() {
    this.cd.markForCheck();

if(this.control.valueField=="resume")
{
  const txt = document.createElement('textarea');
  txt.innerHTML = this.data[this.control.valueField];
  this.data[this.control.valueField]=txt.value;
  }


if (this.control.ispagevarible) {
      if (this.control.formattype === 'plain') {
        return this.safehtml(this.pagesearchtext);
      } else {
        return this.gethtml(this.pagesearchtext);
      }
    } else {
      if (this.data[this.control.valueField] !== "" && this.data[this.control.valueField] !== undefined && this.data[this.control.valueField] != null) {
        var _data = !Array.isArray(this.data[this.control.valueField]) ? this._formservice.deepcopy(this.data[this.control.valueField].toString().trim()) : _.map(this.data[this.control.valueField]).join(', ');
        if (this.control.defaultvalue && !_data) {
          _data = this.control.defaultvalue;
        }

        
        if (this.control.enablehighlighter && _data && this.pagesearchtext && this.ispagesearchparam && typeof this.data[this.control.valueField] == 'string') {
          const pagesearchtext = JSON.parse(this.pagesearchtext);
          pagesearchtext.forEach((item) => {
            if (typeof item === "string" && item && item.trim() !== '' && _data) {
              item = item.replace('”', '');
              item = item.replace('“', '');
              item = item.replace(/"/g, '');
              // item = item.replace('*', '');
              if (item.indexOf("*") > -1) {
                try {
                  var matched = _data.match(new RegExp("\\b(" + item.trim().replace("*", "\\w*)\\b"), 'gi'));
                  if (matched && matched.length > 0) {
                    matched = _.uniqBy(matched);
                    matched.forEach(_match => {
                      _data = _data.replace(new RegExp("\\b(" + _match.trim() + ")\\b", 'gi'), match => {
                        return '<mark>' + match.trim() + '</mark>';
                      });
                    })
                  }
                } catch (e) {

                }
              } else {
                try {
                  if (item.trim() !== '' && _data.match(new RegExp("\\b(" + item.trim() + ")\\b", 'gi'))) {
                    _data = _data.replace(new RegExp("\\b(" + item.trim() + ")\\b", 'gi'), match => {
                      return '<mark>' + match.trim() + '</mark>';
                    });
                  } else if (item.trim() !== '' && _data.match(new RegExp(item.trim() + "(?:$|\W)", 'gi'))) {
                    _data = _data.replace(new RegExp(item.trim() + "(?:$|\W)", 'gi'), match => {
                      return '<mark>' + match.trim() + '</mark>';
                    });
                  } else if (item.trim() !== '' && _data.match(new RegExp('(?:^|)' + item.trim() + '(?:$|)', 'gi'))) {
                    _data = _data.replace(new RegExp('(?:^|\\W)' + item.trim() + '(?:$|\\W)', 'gi'), match => {
                      return '<mark>' + match.trim() + '</mark>';
                    });
                  }
                } catch (e) {
                  try {
                    if (item.trim() !== '' && _data.match(new RegExp(item.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi"))) {
                      _data = _data.replace(new RegExp(item.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi"), match => {
                        return '<mark>' + match.trim() + '</mark>';
                      });
                    }
                  } catch (e) {
                  }
                }
              }
            } else if (item.value && item.value.trim() !== '' && _data) {
              try {
                _data = _data.replace(new RegExp("\\b(" + item.value.trim() + ")\\b", 'gi'), match => {
                  return '<mark>' + match.trim() + '</mark>';
                });
              } catch (e) {

              }
            }
          })
        }
        if (_data && typeof _data == "string" && _data.indexOf("<style") > 0 && _data.indexOf("<style") < _data.indexOf("</style>")) {
          _data = _data.replace(_data.substring(_data.indexOf("<style"), _data.indexOf("</style>") + 8), "");
        }
        if (this.control.formattype && this.control.formattype !== "") {

          if (this.control.outputtype) {
            if (this.control.outputtype == "date") {
              var date = new Date(_data);
              if (date instanceof Date) {
                _data = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
              }
            } else if (this.control.outputtype == "number") {

            }

          }
          if (this.control.formattype === 'plain') {
            return this.safehtml(_data);
          } else if (this.control.formattype !== 'plain') {
            return this.gethtml(_data);
          }
        } else {
          if (this.control.outputtype) {
            if (this.control.outputtype == "date") {
              var date = new Date(_data);
              if (date instanceof Date) {
                _data = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
              }
            } else if (this.control.outputtype == "number") {

            }

          }
          return _data
        }
      } else {
        return this.control.defaultvalue ? this.control.defaultvalue : '';
      }
    }
  }
  Refresh() {
    var currentUrl = this._Router.url ? this._Router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    const apiparam: any = {};
    const url = this.control.apiurl;
    const menu = this.AuthService.Menu;
    const page = this._formservice.find(menu['Nav'], currentUrl.substring(1));
    if (this.control.apiparam) {
      this.control.apiparam.forEach(option => {
        apiparam[option.key] = option.value;
      })
    }
    if (page) {
      const activateParams = this._formservice.getQueryParams();
      page.Params.forEach(option => {
        const param = this.control.apiparam ? this.control.apiparam.find(x => x.value == option.name) : null;
        if (param) {
          // apiparam[param.key] = option.value;
          let activeParam = activateParams.find(x => x[option.name]);
          if (activeParam) {
            apiparam[param.key] = activeParam[option.name];
          } else {
            apiparam[param.key] = option.value;
          }
        }
      })
    }
    var _othis = this;
    if (url) {
      this.busy = this._appService.get(url, apiparam)
        .subscribe(
          (data: any) => {
            var _data = null;
            if (Array.isArray(data) && data.length > 0)
              _data = data[0];
            else if (typeof data == "object")
              _data = data;
            if (_data) {
              _othis.data[_othis.control.valueField] = data[_othis.control.valueField];
            }
          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    }
  }
}
