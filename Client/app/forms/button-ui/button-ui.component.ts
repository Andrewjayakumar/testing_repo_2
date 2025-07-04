declare var require;
import {
  Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
const _ = require('lodash');
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormControlService } from '../form-control.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../core/authservice/db-Keys';
import { Location } from '@angular/common';
import { UUID } from "angular2-uuid";
import { LinkedInpopupComponent } from "../linkedinpopup/linkedinpopup.component";
import { LinkedinMailComponent } from '../linkedin-mail/linkedin-mail.component';
import { ShareMultipleUserComponent } from '../share-multiple-user/share-multiple-user.component';
import { UpdateClientComponent } from "../../application/requisitions/update-client/update-client.component";
import { CandidateResumeUploadComponent } from "../candidatesubmission/candidate-resumeupload/candidate-resumeupload.component";
import { PinToReqPopupComponent } from "../candidatesubmission/pin-to-req-popup/pin-to-req-popup.component";
import { AddToHotbooksPopupComponent } from "../candidatesubmission/add-to-hotbooks-popup/add-to-hotbooks-popup.component";
import { DncPopupComponent } from "../candidatesubmission/dnc-popup/dnc-popup.component";
import { MetalCardNotesComponent } from "../../shared/components/metal-card-notes/metal-card-notes.component";
import { CandidateBotResponseComponent } from "../../application/candidate/candidate-bot-response/candidate-bot-response.component";
import { SendSmsComponent } from "../candidatesubmission/send-sms/send-sms.component";
import { AcaDocumentsComponent } from '../../application/requisitions/add-requisition/recdetails/aca-documents/aca-documents.component';
import { ChatGPTComponent } from '../../application/requisitions/add-requisition/chat-gpt/chat-gpt.component';
import { CoPopupComponent } from '../candidatesubmission/co-popup/co-popup.component';
/*
CreatedBy:Arun
ModifiedBy:Arun,
Modify Date:11/10/2017
*/
@Component({
  selector: 'app-button-ui',
  templateUrl: './button-ui.component.html',
  styleUrls: ['./button-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ButtonUiComponent implements OnInit, OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService: any;
  @Input() public disabled: boolean = false;

  isApiCalling: boolean = false;
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string = "";
  errorMessage: string = null;
  Submitconfirm: string = "NO";
  busy: Subscription;
  status: any = null;
  form: FormGroup;
  advanceSearchformJson: any;
  advanceSearchModelJson: any;
  IsNewEntry: boolean = true;
  modalRef: any
  _opened: boolean = false;
  control_id: any
  
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  private options: NgbModalOptions = { size: 'sm', windowClass: 'model-cw', backdrop: true };
  constructor(private _appService: DataService,
    private modalService: NgbModal,
    public _controlService: FormControlService,
    private _router: Router, private localStorage: LocalStoreManager,
    private location: Location, private cd: ChangeDetectorRef) {
    // setTimeout(() => this.setChanged(), 0);
    // this.cd.detach()
    // setInterval(() => {
    //   if (this.cd !== null &&
    //     this.cd !== undefined &&
    //     !(this.cd as any).destroyed) {
    //     this.cd.detectChanges();
    //   }
    // }, 1)
    this._controlService.ButtonSideBarCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          // debugger;
          this.closeSidebarEvent();
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.unsubscribe.unsubscribe();
    if (this.busy)
      this.busy.unsubscribe();
  }
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    if (this.control.enableautovalidateonsubmit) {
      this.control.require = true;
      this._controlService.getCssforMandatory(this.control, this.data[this.control.key])
    }
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.takeUntil(this.unsubscribe).subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).takeUntil(this.unsubscribe).subscribe(() => this.successMessage = null);
  }
  getClass() {
    var outline = "";
    if (this.control.outline == true && this.control.buttontype !== 'circle')
      outline = 'outline-';

    return 'btn btn-' + this.control.size + ' btn-' + outline + this.control.buttontype;
  }
  failedItems: any = [];
  buttonState() {
    if (this.control.novalidationcheck) {
      return false;
    } else {
      if (this._controlService.formvalidation != {}) {
        var arr = [];
        Object.keys(this._controlService.formvalidation).forEach(
          (key) => {
            var ignorekey = this.control.ignorevalidationcontrols ? this.control.ignorevalidationcontrols.find(x => x.toLowerCase() === key) : null;
            if (!ignorekey) {
              const value: any = this._controlService.formvalidation[key] ? this._controlService.formvalidation[key] : {};
              arr.push({ "key": key, "value": value.status, "control": value.control });
            }
          }
        );
        var isValid = arr.filter(item => item.value == 'fail');
        //if (arr.length > 0 && isValid.length == 0 && this._controlService.formvalid == false)
        if (arr.length == 0) {
          this._controlService.formvalid = true;
          this.failedItems = [];
        } else {
          if (arr.length > 0 && isValid.length == 0) {
            this._controlService.formvalid = true;
            this.failedItems = [];
          }
          else {
            if (Array.isArray(isValid))
              this.failedItems = isValid;

            this._controlService.formvalid = false;
          }
        }
      }

      return !this._controlService.formvalid;
    }
  }
  InitializeSidebar() {
    // debugger;
    this._controlService.formData = {};
    this._controlService.formvalidation = {}
    if (this.control.Api) {
      this.submit(null);
    } else {
      var params: any = this._controlService.getQueryParams();
      var _queryParams: any = {};
      Object.assign(_queryParams, ...params);
      if (this.control.PrimaryKey) {
        _queryParams[this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey] = this.data[this.control.PrimaryKey];
      }
      var urlTree: string = this._router.createUrlTree([], {
        queryParams: _queryParams,
        queryParamsHandling: "merge",
        preserveFragment: true
      }).toString();
      // this._router.navigateByUrl(urlTree);
      this.location.go(urlTree);
      this.setParam(this.control.buttonredirecturl);
      this._opened = !this._opened;
      this._controlService._openedbuttonsidebar = !this._controlService._openedbuttonsidebar;
      this.loadMetadata(this.control.actionformid);
    }

  }
  _onEditSidebarClosed() {
    // this._controlService.resetPageSearchVarible();
    if (this._controlService.dataModel.length > 0) {
      //this._controlService.RefreshLabel();
      //this._controlService.PinKanban();
    }
    this.advanceSearchformJson = null;
    this.advanceSearchModelJson = null;
    if (this.form) {
      this.form.reset();
    }
    this.form = null;
  }
  _onEditSidebarStart() {
    this._controlService.dataModel = [];
  }
  closeSidebar(content) {
    if (this.control.disablesidebarclose) {
      this.status = 'sidebarwarning';
      this.changeSuccessMessage(this.control.sidebarclosewarningmsg);
      return false;
    } else {
      if (this._controlService.dataModel.length > 0 && content) {
        this.modalService.open(content, { size: 'sm' }).result.then((result) => {
          if (this.Submitconfirm == "YES") {
            this._opened = !this._opened;
            this._controlService._openedbuttonsidebar = !this._controlService._openedbuttonsidebar;
          }
          else {
            this.Submitconfirm = "NO";
          }
        });
      } else {
        this._opened = !this._opened;
        this._controlService._openedbuttonsidebar = !this._controlService._openedbuttonsidebar;
      }
      return true;
    }
  }
  closeSidebarEvent() {
    // this._controlService.resetPageSearchVarible();
    this._opened = false;
    this._controlService._openedbuttonsidebar = false;
    if (this.modalRef) {
      this.modalRef.close();
      this.advanceSearchformJson = null;
      this.advanceSearchModelJson = null;
      if (this.form) {
        this.form.reset();
      }
      this.form = null;
    }
    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.detectChanges();
    }
  }
  loadMetadata(formid) {
    this.advanceSearchformJson = null;
    this.advanceSearchModelJson = null;
    let apiparam: any = {};
    apiparam.id = formid;
    this._appService.get("api/AppData/get", apiparam)
      .takeUntil(this.unsubscribe)
      .subscribe(
        (data: any) => {
          this.form = this._controlService.toControlGroup(data.controls);
          this.advanceSearchformJson = this._controlService.deepcopy(data);
          //this.advanceSearchModelJson = this._controlService.deepcopy(data.ModelJson);
          // this.advanceSearchformJson.controls.forEach(control => {
          //   this._controlService.addValidation(control, this.form);
          // })
          debugger;
          if (this.control.binddataoninitialize || this.control.binddataoninitialize == false) {

            if (this.control.binddataoninitialize == true) {
              this.GetModalData();
            } else {
              this.advanceSearchModelJson = this.advanceSearchformJson.ModelJson;
            }


          } else {
            this.GetModalData();
          }
          if (this.cd !== null &&
            this.cd !== undefined &&
            !(this.cd as any).destroyed) {
            this.cd.detectChanges();
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
  GetModalData() {
    // debugger;
    let apiparam: any = {};
    var url = this.advanceSearchformJson.GetEndpoint;

    this.advanceSearchformJson.GetEndpointParams.forEach(option => {
      apiparam[option.key] = option.value;
    })
    this._controlService.setPageVarible(this.advanceSearchformJson.GetEndpointParams, apiparam, this.AuthService);
    if (url) {
      this._appService.get(url, apiparam, false)
        .subscribe(
          (data: any) => {
            // debugger;
            if (data) {
              if (Array.isArray(data))
                this.advanceSearchModelJson = data.length > 0 ? data[0] : this.advanceSearchformJson.ModelJson;
              else
                this.advanceSearchModelJson = data;

              this._controlService.GenerateDataJson(this.advanceSearchformJson.controls, this.advanceSearchModelJson, this.form);

              if (this.advanceSearchModelJson["id"] == "")
                delete this.advanceSearchModelJson["id"];
            } else {
              this.advanceSearchModelJson = this.advanceSearchformJson.ModelJson;
              this._controlService.GenerateDataJson(this.advanceSearchformJson.controls, this.advanceSearchModelJson, this.form);

              if (this.advanceSearchModelJson["id"] == "")
                delete this.advanceSearchModelJson["id"];
            }
            if (this.cd !== null &&
              this.cd !== undefined &&
              !(this.cd as any).destroyed) {
              this.cd.detectChanges();
            }

          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    } else {
      // debugger;
      this.advanceSearchModelJson = this.advanceSearchformJson.ModelJson;
      this._controlService.GenerateDataJson(this.advanceSearchformJson.controls, this.advanceSearchModelJson, this.form);

      if (this.advanceSearchModelJson["id"] == "")
        delete this.advanceSearchModelJson["id"];

      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.cd.detectChanges();
      }
    }
  }
  addaction() {
    debugger;
    if (this.isbookmarked(this.control)) {
      this.removebookmark(this.control);
    } else {
      let currentUrl = this._router.url;
      if (this.control.buttonredirecturl) {
        this.setParam(this.control.buttonredirecturl);
        currentUrl = this.control.buttonredirecturl;
      } else {
        if (currentUrl.indexOf('?') > -1) {
          currentUrl = currentUrl.split('?')[0];
        }
      }
      var menu = this.AuthService.Menu;

      var page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      var item = {
        "id": UUID.UUID(),
        "url": page.Url,
        "title": this.data[this.control.titlemodel] ? this.data[this.control.titlemodel] : page.Title,
        "subtitle": this.data[this.control.subtitlemodel] != 'undefined' && this.data[this.control.subtitlemodel] != null ? this.data[this.control.subtitlemodel] : this.control.subtitlemodel,
        "icon": this.control.icon ? this.control.icon : "",
        "params": page.Params,
        "openinpopup": this.control.openbookmarkinpopup,
        "popupparams": { value: this.data[this.control.PrimaryKey], key: this.control.PrimaryKey, formid: this.control.actionformid }

      };
      this.AuthService.AddtoBookmark(item);
    }
    this._controlService.ruleComponentDetectChanges();
  }
  removebookmark(action) {
    // debugger;
    var itembookmarked;
    // const currentUrl = action.buttonredirecturl;
    // const menu = this.auth.Menu;
    // const bookmark = this.localStorage.getDataObject<any>(DBkeys.BookMarklist);
    // const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
    if (this.AuthService.bookmark) {
      this.AuthService.bookmark.forEach(item => {
        const param = item.params.find(x => x.name === action.PrimaryKey && x.value === this.data[action.PrimaryKey]);
        if (param) {
          itembookmarked = item;
        }
      })
    }
    if (itembookmarked) {
      this.AuthService.RemoveBookmark(itembookmarked);
    }
  }
  isbookmarked(action) {
    var isbookmarked = false;
    let currentUrl = this._router.url;
    if (action.buttonredirecturl) {
      this.setParam(action.buttonredirecturl);
      currentUrl = action.buttonredirecturl;
    } else {
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
    }
    // const menu = this.auth.Menu;
    const bookmark = this.AuthService.bookmark ? this.AuthService.bookmark.filter(x => x.url == currentUrl.substring(1)) : [];
    // const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
    if (bookmark) {
      bookmark.forEach(item => {
        const param = item.params.find(x => x.name === action.PrimaryKey && x.value == this.data[action.PrimaryKey]);
        if (param) {
          isbookmarked = true;
        }
      })
    }
    return isbookmarked;
  }
  setParam(redirecturl) {
    let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
    var _index = 0;
    var redirectUrl = null;
    if (redirecturl) {
      redirectUrl = redirecturl;
    } else {
      redirectUrl = this._router.url ? this._router.url : "/";
      if (redirectUrl.indexOf('?') > -1) {
        redirectUrl = redirectUrl.split('?')[0];
      }
    }

    if (redirectUrl) {
      var arr = redirectUrl.split('');
      arr.forEach((char, i) => {
        if (/^[a-zA-Z]*$/g.test(char) && _index == 0) {
          _index = i;
          return false;
        } else {
          return true;
        }
      });
    }
    if (menu) {
      // const page = menu.Nav.find(x => x.Url == redirectUrl.substring(_index));
      const page = this._controlService.find(menu['Nav'], redirectUrl.substring(_index));
      if (page && this.control.actiontype == 'sidebar' && !this.control.Api) {
        page.Params.forEach(_item => {
          if (_item.name == this.control.PrimaryKey) {
            _item.value = this.data[this.control.PrimaryKey];
          } else if (this.data[_item.name] || this.data[_item.name] == false) {
            _item.value = this.data[_item.name];
          }
        });
      } else if (page && this.control.key.toLowerCase().indexOf('back') < 0 && redirectUrl) {
        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
          currentUrl = currentUrl.split('?')[0];
        }
        var currentPage = this._controlService.find(menu['Nav'], currentUrl.substring(1));//this._controlService.deepcopy(menu).Nav.find(x => x.Url == currentUrl.substring(1));
        if (currentPage && page) {
          //page.Params = [];
          currentPage.Params.forEach(_item => {
            var arr: any = {}
            if (_item.name == this.control.PrimaryKey) {
              arr.name = _item.name;
              if (_item.value == "&")
                arr.value = this.data[_item.name];
              else
                arr.value = this.data[this.control.PrimaryKey];

              let _param = page.Params.find(x => x.name == _item.name);
              if (_param) {
                _param.value = arr.value;
              } else {
                page.Params.push(arr);
              }
            } else {
              if (_item.value == "&")
                _item.value = this.data[_item.name];

              let _param = page.Params.find(x => x.name == _item.name);
              if (_param) {
                _param.value = _item.value;
              } else {
                page.Params.push(_item);
              }
            }
          });
        }
      }
      this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
    }
  }
  openPopup(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg', windowClass: 'model-cw', backdrop: false, keyboard: false });
    //this.ActionMode = this.control.ViewType === "otherform" ? 'write' : action.SidebarViewType;
    this.loadMetadata(this.control.actionformid);
  }
  customAction(content) {
    debugger;
      if (this.control.isexternalurl) {
          var url = '';
          if (this.control.isexternalurlfromapidata && this.control.PrimaryKey) {
              url = this.data[this.control.PrimaryKey];
              if (url && url.indexOf('?') > -1 && this.control.isprimarynodefromresponse) {
                  url = url + "?" + this.control.primarynode + "=" + this.data[this.control.primarynode];
              }
          } else if (this.control.buttonredirecturl && this.control.buttonredirecturl.indexOf('?') > -1 && this.control.PrimaryKey) {
              url = this.control.buttonredirecturl + "&" + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + "=" + this.data[this.control.PrimaryKey];;
          } else if (this.control.buttonredirecturl && this.control.PrimaryKey) {
              url = this.control.buttonredirecturl + "?" + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + "=" + this.data[this.control.PrimaryKey];
          } else if (this.control.buttonredirecturl) {
              url = this.control.buttonredirecturl;
          }
          if (this.control.isprimarynodefromresponse) {
              this.submit(null);
          } else {
              window.open(url, '_blank')
          }
      } else if (this.control.actiontype == 'sidebar' && !this.control.Api) {
          this._controlService.formData = {};
          this._controlService.formvalidation = {}
          var params: any = this._controlService.getQueryParams();
          var _queryParams: any = {};
          Object.assign(_queryParams, ...params);
          if (this.control.PrimaryKey) {
              _queryParams[this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey] = this.data[this.control.PrimaryKey];
          }
          var urlTree: string = this._router.createUrlTree([], {
              queryParams: _queryParams,
              queryParamsHandling: "merge",
              preserveFragment: true
          }).toString();
          // this._router.navigateByUrl(urlTree);
          this.location.go(urlTree);
          this.setParam(this.control.buttonredirecturl);
          this.openPopup(content);
      } else if (this.control.actiontype == 'sidebar' && this.control.Api) {
          this._controlService.formData = {};
          this._controlService.formvalidation = {}
          this.setParam(this.control.buttonredirecturl);
          this.submit(null, content);
      } else if (this.control.actiontype == 'Scrolltotop') {
          if (document.getElementsByClassName("modal") && document.getElementsByClassName("modal").length > 0) {
              document.getElementsByClassName("modal")[0].scrollTop = 0;
          } else if (document.getElementsByClassName('ng-sidebar--opened') && document.getElementsByClassName('ng-sidebar--opened').length > 0) {
              if (document.getElementsByClassName('ng-sidebar--opened')[0].getElementsByClassName("sidbar-body")
                  && document.getElementsByClassName('ng-sidebar--opened')[0].getElementsByClassName("sidbar-body").length > 1) {
                  document.getElementsByClassName('ng-sidebar--opened')[0].getElementsByClassName("sidbar-body")[1].scrollTop = 0;
              }
          } else {
              const userAgent = typeof navigator !== 'undefined' && navigator.userAgent || '';
              const isSafari = /Safari\//.test(userAgent) && !/(Chrome\/|Android\s)/.test(userAgent);
              if (isSafari) {
                  document.body.scrollTop = 0;
              } else {
                  document.documentElement.scrollTop = 0;
              }
          }
      } else if (this.control.actiontype === 'Back') {
          this.location.back(); // <-- go back to previous location
      } else if (this.control.actiontype === 'Print') {
          this.print();
      } else if (this.control.actiontype == 'copytoclipboard') {
          /* Get the text field */
          var copyText: any = document.getElementById(this.control.copyfield);
          var textArea = document.createElement("textarea");
          textArea.value = copyText.innerText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("Copy");
          textArea.remove();
      }
      else if (this.control.actiontype == 'setter') {
          this.setDataModelValues(this.control.datakeys);
      }
      else if (this.control.buttonredirecttype === 'newtab') {
          this.setParam(this.control.buttonredirecturl);
          if (this.control.PrimaryKey && this.control.PrimaryKey !== '') {
              window.open(this.control.buttonredirecturl + '?' + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + '=' + this.data[this.control.PrimaryKey], '_blank')
          } else {
              window.open(this.control.buttonredirecturl, '_blank')
          }
      } else if (this.control.buttonredirecttype === 'sametab') {
          this.setParam(this.control.buttonredirecturl);
          if (this.control.PrimaryKey && this.control.PrimaryKey !== '') {
              var queryParam: any = {};
              queryParam[this.control.PrimaryKey] = this.data[this.control.PrimaryKey];
              this._router.navigate([this.control.buttonredirecturl], { queryParams: queryParam });
          } else {
              this._router.navigate([this.control.buttonredirecturl]);
        }
      if (
        document.getElementsByClassName("modal") &&
        document.getElementsByClassName("modal").length > 0
      ) {
        var x = document.getElementsByClassName("modal");
        x[0].remove();
        var y = document.getElementsByClassName("modal-backdrop");
          y[0].remove();
          var body = document.getElementsByTagName("body")[0];
          body.classList.remove('modal-open');
      }
      } else if (this.control.buttonredirecttype === 'submitredirNew' || this.control.buttonredirecttype === 'submitredir' || this.control.buttonredirecttype === 'submitredirNewWindow') {
          this.submit(null);
      } else if (this.control.buttonredirecttype === 'newwindow') {
          this.setParam(this.control.buttonredirecturl);
          if (this.control.PrimaryKey && this.control.PrimaryKey !== '') {
              window.open(this.control.buttonredirecturl + '?' + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + '=' + this.data[this.control.PrimaryKey], '_blank'
                  , 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700')
          } else {
              window.open(this.control.buttonredirecturl, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700')
          }
      } else if (this.control.buttonredirecttype === 'bookmark') {
          this.setParam(this.control.buttonredirecturl);
          this.addaction();
      }
      else if (this.control.actiontype == 'metalpopup') {
          let classname = this.control.popupclassname;
          let popupkey = this.data[this.control.primarykey];
        let dataforpopup = this.control.additionaldata;

          //TODO if additionaldata is present, iterate and send data to popup param
          let ngbModalOptions: NgbModalOptions = {
              backdrop: 'static',
              size: 'lg',
            //  scrollable: true,
              windowClass: 'linkedinpopup'
          };
        //let ngbModaloptions: NgbModalOptions = {
        //  backdrop: 'static',
        //  windowClass: 'overrides'
        //};
          switch (classname) {
              case 'linkedinpopup':
                 // debugger;
                  let modalRef = this.modalService.open(LinkedInpopupComponent, ngbModalOptions);
                  modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                  break;
              case 'updateclient':
                    // debugger;
                     modalRef = this.modalService.open(UpdateClientComponent, ngbModalOptions);
                     modalRef.componentInstance.inputdata = popupkey ? popupkey : "";
                     break;
              case 'linkedinmail':
                  modalRef = this.modalService.open(LinkedinMailComponent, ngbModalOptions);
                  let additionaldata = [];
                  if (dataforpopup.length > 0) {
                         dataforpopup.forEach(attr => {
                          let obj = {};
                          obj[attr] = this.data[attr];
                          additionaldata.push(obj); 
                      });
                  }
                  modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                  modalRef.componentInstance.additionaldata = additionaldata;
                  break;

            case 'sharedinpopup':
              // ngbModalOptions.windowClass = "overrides";
              modalRef = this.modalService.open(ShareMultipleUserComponent, ngbModalOptions);
              modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
              break;
            case 'updateresumepopup':
              modalRef = this.modalService.open(CandidateResumeUploadComponent, ngbModalOptions);
              modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
              modalRef.componentInstance.action = 'profileresume';

              break;
            case 'notesinpopup':
              modalRef = this.modalService.open(MetalCardNotesComponent, ngbModalOptions);
              modalRef.componentInstance.id = popupkey ? popupkey : "";
              break;
            case 'candidatebotresponse':
                 ngbModalOptions.windowClass = "overrides";

              modalRef = this.modalService.open(CandidateBotResponseComponent, ngbModalOptions);
              modalRef.componentInstance.id = popupkey ? popupkey : "";
             break;
              case 'pintoreqpopup':
                modalRef = this.modalService.open(PinToReqPopupComponent, ngbModalOptions);
                modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                modalRef.result.then((result) => {
                  if (result == 'success') {
                      this._controlService.RefreshComponent();
                  }
              });
                break;
              case 'addtohotbookpopup':
                modalRef = this.modalService.open(AddToHotbooksPopupComponent, ngbModalOptions);
                modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                modalRef.result.then((result) => {
                  if (result == 'success') {
                      this._controlService.RefreshComponent();
                  }
              });
              break;
              case 'dncpopup':
                modalRef = this.modalService.open(DncPopupComponent, ngbModalOptions);
                modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                modalRef.result.then((result) => {
                  if (result == 'success') {
                      this._controlService.RefreshComponent();
                  }
              });
              break;
              case 'sendSMS':
                modalRef = this.modalService.open(SendSmsComponent, ngbModalOptions);
                modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                modalRef.result.then((result) => {
                  if (result == 'success') {
                      this._controlService.RefreshComponent();
                  }
              });
              break;
              case 'coPopup':
                modalRef = this.modalService.open(CoPopupComponent, {
                  backdrop: 'static', size: 'lg', windowClass: 'coPopup'
              });
                modalRef.componentInstance.candidateid = popupkey ? popupkey : "";
                modalRef.result.then((result) => {
                  if (result == 'success') {
                      this._controlService.RefreshComponent();
                  }
                });
              break;
              case 'acaPopup':
                let ngbModalOption: NgbModalOptions = {backdrop: "static", keyboard: true,  size: "lg", };
            
              modalRef = this.modalService.open(AcaDocumentsComponent, ngbModalOption );
                  modalRef.componentInstance.requisitionid = popupkey ? popupkey : "";
                  break;
              case 'chatgpt':
                  let modaloption: NgbModalOptions = { backdrop: "static", keyboard: true, size: "lg", };

                  modalRef = this.modalService.open(ChatGPTComponent, modaloption);
                  modalRef.componentInstance.requisitionid = popupkey ? popupkey : "";
                  modalRef.componentInstance.source = "overview";
                  break;
             case 'STSSendLinkRedirect':
                    
                  let userid = '';
                  let current_user = this.localStorage.getData('current_user');
                  if (current_user.email) {
                     userid = current_user.email.split('@')[0];
                  }
                  const queryParams = `?eid=${encodeURIComponent(popupkey)}&uid=${encodeURIComponent(userid)}`;
      
                  // Open the URL with query parameters in a new tab
                  window.open('http://apps.ascendion.com/sts/collabera/Default.aspx' + queryParams, '_blank');
                  break;
              case '':
              default:
                  this.errorMessage = "Nothing to show. Please try again";
                  this.modalService.open(content, { size: 'lg', backdrop: false, keyboard: false });
                  break;
              
          }
      }

    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.detectChanges();
    }
    }

    setDataModelValues(datakeys: any) {
        if (datakeys && datakeys.length > 0) {
            datakeys.forEach(option => {
               // debugger;
                if (option.modelkey) {
                    this.data[option.modelkey] = option.modelvalue;
                    //booleans
                    if (option.modelvalue == 'true' || option.modelvalue == 'false') {
                        this.data[option.modelkey] = (option.modelvalue == 'true');
                    }
                }
            })
        }
    }
  resetParaentWidnow() {
    if (document.getElementsByClassName("modal") && document.getElementsByClassName("modal").length > 0) {
      document.body.className = "modal-open";
    }
  }
  messagefromsubmit: any
  submitonconfirm(content, contentpopup, contentSubmitConfirm, issubmitonconfirm: boolean = false, responseMessage) {
    if (this.control.submitonconfirm && (!this.control.calladditionalapi || issubmitonconfirm) && !this.control.nopopup) {
      if (responseMessage) {
        this.messagefromsubmit = responseMessage;
      } else {
        this.messagefromsubmit = "";
      }
      this.modalService.open(contentSubmitConfirm, { size: 'sm', backdrop: false, keyboard: false }).result.then((result) => {
        if (this.Submitconfirm == "YES") {
          this.submit(content, contentpopup, contentSubmitConfirm, issubmitonconfirm);
        } else {
          this.Submitconfirm = "NO";
        }
      });
    } else {
      this.submit(content, contentpopup, contentSubmitConfirm, issubmitonconfirm)
    }
    if (this.cd !== null &&
      this.cd !== undefined &&
      !(this.cd as any).destroyed) {
      this.cd.detectChanges();
    }
  }
  submit(content, contentpopup?, contentSubmitConfirm?, issubmitonconfirm?) {
    this.isApiCalling = true;
    this.cd.detectChanges();
    if (this.control.submitpinneditems) {
      this.submitPinnedModel();
    } else {
      let url = "";
      debugger;


      let apiparam: any = {};
      var dataModel = this._controlService.deepcopy(this.data);

      if (this.control.deletemodelitems && this.control.deletemodelitems.length > 0) {
        this.control.deletemodelitems.forEach(item => {
          delete dataModel[item];
        })
      }

      var IsNewEntry = dataModel[this.control.primarykey] && dataModel[this.control.primarykey] != "" && dataModel[this.control.primarykey] != 0 ? false : true;

      this.IsNewEntry = IsNewEntry;
      var ModelJson = null;
      if (issubmitonconfirm && this.control.calladditionalapi) {
        url = this.control.confirmapiurl;
        this.control.confirmapiaparam.forEach(option => {
          if (option.isdatamodel) {
            apiparam[option.key] = this.data[option.value];
          } else {
            apiparam[option.key] = option.value;
          }
        })
      } else if (!this.control.enablerowquery) {
        if (IsNewEntry) {
          url = this.control.Api;
          this.control.paramlist.forEach(option => {
            if (option.isdatamodel) {
              apiparam[option.key] = this.data[option.value];
            } else {
              apiparam[option.key] = option.value;
            }
          })
        } else {
          url = this.control.updateApi;
          var updateparamlist = this.control.updateparamlist ? this.control.updateparamlist : [];
          updateparamlist.forEach(option => {
            apiparam[option.key] = option.value;
          })
        }
        if (this.control.paramlist.length > 0) {
          this._controlService.setPageVarible(this.control.paramlist, apiparam, this.AuthService);
        }
      }
      else {

        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
          currentUrl = currentUrl.split('?')[0];
        }
        const menu = this.AuthService.Menu;
        const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));

          url = this.control.Api;
        var rowQuery = this.control.rowquery;
        const activateParams = this._controlService.getQueryParams();
          this.control.paramlist.forEach(option => {
          if (!option.ispagevarible)
            rowQuery = rowQuery.replace("{{" + option.value + "}}", this.data[option.value] ? this.data[option.value] : null);
          else if (page) {
            page.Params.forEach(pOption => {
              if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
                let activeParam = activateParams.find(x => x[pOption.name]);
                if (activeParam) {
                  // apiparam[param.key] = activeParam[pOption.name];
                  rowQuery = rowQuery.replace("{{" + option.value + "}}", activeParam[pOption.name] ? activeParam[pOption.name] : null);
                } else {
                  rowQuery = rowQuery.replace("{{" + option.value + "}}", pOption.value ? pOption.value : null);
                }
              }
            })
          }
        })

          try {
          dataModel = JSON.parse(rowQuery);
        } catch (objError) {
          if (objError instanceof SyntaxError) {
            console.error(objError.name);
          } else {
            console.error(objError.message);
          }
        }
      }

      if (this.control.createdby && this.control.createdby.trim() != "") {
        dataModel[this.control.createdby] = this.control.createdby;
      }
      if (this.control.updatedby && this.control.updatedby.trim() != "") {
        dataModel[this.control.updatedby] = this.control.createdby;
      }
      if (this.control.resetcacheapidetails && this.control.resetcacheapidetails.length > 0) {
        this.ResetCaching(this.control.resetcacheapidetails);
      }
      const _othis = this;
        if (url) {
        this.busy = this._appService.post(url, JSON.stringify(dataModel), apiparam)
          .subscribe((res: any) => {
            debugger;
            this.isApiCalling = false;
            this.cd.detectChanges();
            // alert(JSON.stringify(res));
            if (res.status == "success") {
              if (this.control.harddelete) {
                if (this.control.deletemodelitems && this.control.deletemodelitems.length > 0) {
                  this.control.deletemodelitems.forEach(item => {
                    delete this.data[item];
                  })
                }
              }
              if (this.control.enablenotification) {
                if (this.IsNewEntry) {
                  this.sendnotification("create");

                } else {
                  this.sendnotification("update");
                }
              }
            }
            this.status = res.status;
            if (this.control.enableautovalidateonsubmit && res.status === "success") {
              if (res.data[this.control.responsefield] || res.data[this.control.responsefield] === false) {
                this.data[this.control.key] = res.data[this.control.responsefield];
                this._controlService.getCssforMandatory(this.control, this.data[this.control.key])
                // this.formGroup.controls[this.control_id].markAsTouched();
              }
            }

            if (!this.control.isfileuploadonsubmit && res.status === "success" && this.control.actiontype === 'submit' && issubmitonconfirm == false && this.control.submitonconfirm && this.control.calladditionalapi) {
              var _confirmMsg = null;
              if (this.control.responsefieldfrommessage) {
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                  _confirmMsg = res.data[0][this.control.responsefieldfrommessage];
                } else if (res.data && typeof res.data == 'object') {
                  _confirmMsg = res.data[this.control.responsefieldfrommessage]
                }
              }
              this.submitonconfirm(null, null, contentSubmitConfirm, true, _confirmMsg);
            } else if (res.status === "success" && this.control.actiontype == 'sidebar' && this.control.showinpopup) {
              var params: any = this._controlService.getQueryParams();
              var _queryParams: any = {};
              Object.assign(_queryParams, ...params);
              if (this.control.PrimaryKey) {
                _queryParams[this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey] = this.data[this.control.PrimaryKey];
              }
              var urlTree: string = this._router.createUrlTree([], {
                queryParams: _queryParams,
                queryParamsHandling: "merge",
                preserveFragment: true
              }).toString();
              // this._router.navigateByUrl(urlTree);
              this.location.go(urlTree);
              this.setParam(this.control.buttonredirecturl);
              this.openPopup(contentpopup);
            } else if (res.status === "success" && this.control.actiontype === "sidebar" && !this.control.showinpopup) {
              this.changeSuccessMessage(res.message ? res.message : null);
              this._opened = !this._opened;
              //this._controlService._openedbuttonsidebar = !this._controlService._openedbuttonsidebar;
              this.loadMetadata(this.control.actionformid);
            } else if (res.status === "success" && this.control.actiontype === "redirect" && this.control.isexternalurl) {
                var url = '';
                if (this.control.buttonredirecturl) {
                    if (this.control.buttonredirecturl.indexOf('?') > -1 && this.control.PrimaryKey && this.control.isprimarynodefromresponse) {
                        url = this.control.buttonredirecturl + "&" + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + "=" + res.data[this.control.PrimaryKey];
                    } else if (this.control.buttonredirecturl.indexOf('?') > -1 && this.control.PrimaryKey && !this.control.isprimarynodefromresponse) {
                        url = this.control.buttonredirecturl + "&" + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + "=" + this.data[this.control.PrimaryKey];
                    } else if (this.control.PrimaryKey && this.control.isprimarynodefromresponse) {
                        url = this.control.buttonredirecturl + "?" + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + "=" + res.data[this.control.PrimaryKey];
                    } else if (this.control.PrimaryKey && !this.control.isprimarynodefromresponse) {
                        url = this.control.buttonredirecturl + "?" + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + "=" + this.data[this.control.PrimaryKey];
                    } else {
                        url = this.control.buttonredirecturl;
                    }
                }
                else if (this.control.isExternalUrlfromResponse && this.control.isprimarynodefromresponse) {
                    debugger;
                    url = res.data[this.control.primarynode];
                 }
              
              if (this.control.successmsgtext) {
                let _message: any = {}
                _message.text = this.control.successmsgtext;
                _message.title = this.control.successmsgtitle;
                _message.icon = this.control.successmsgicon;
                this._controlService.RefreshComponent(null, _message, this.control.refreshcomponentkey);
              }
              window.open(url, '_blank');
            } else if (res.status === "success" && this.control.actiontype === "redirect" && this.control.buttonredirecttype === "submitredir") {
              if (this.control.PrimaryKey && this.control.PrimaryKey !== '') {
                var queryParam: any = {};
                queryParam[this.control.PrimaryKey] = this.data[this.control.PrimaryKey];
                this._router.navigate([this.control.buttonredirecturl], { queryParams: queryParam });
              } else {
                this._router.navigate([this.control.buttonredirecturl]);
              }
            } else if (res.status === "success" && this.control.actiontype === "redirect" && this.control.buttonredirecttype === "submitredirNew") {
              if (this.control.successmsgtext) {
                let _message: any = {}
                _message.text = this.control.successmsgtext;
                _message.title = this.control.successmsgtitle;
                _message.icon = this.control.successmsgicon;
                this._controlService.RefreshComponent(null, _message, this.control.refreshcomponentkey);
              }
              if (this.control.PrimaryKey && this.control.PrimaryKey !== '') {
                window.open(this.control.buttonredirecturl + '?' + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + '=' + this.data[this.control.PrimaryKey], '_blank')
              } else {
                window.open(this.control.buttonredirecturl, '_blank')
              }
            } else if (res.status === "success" && this.control.actiontype === "redirect" && this.control.buttonredirecttype === "submitredirNewWindow") {
              if (this.control.successmsgtext) {
                let _message: any = {}
                _message.text = this.control.successmsgtext;
                _message.title = this.control.successmsgtitle;
                _message.icon = this.control.successmsgicon;
                this._controlService.RefreshComponent(null, _message, this.control.refreshcomponentkey);
              }
              if (this.control.PrimaryKey && this.control.PrimaryKey !== '') {
                window.open(this.control.buttonredirecturl + '?' + (this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey) + '=' + this.data[this.control.PrimaryKey], '_blank'
                  , 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700')
              } else {
                window.open(this.control.buttonredirecturl, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700')
              }
            } else if (res.status == "success") {
              if (this.control.isfileuploadonsubmit) {
                if (issubmitonconfirm) {
                  return;
                }
                let _message: any = {}
                if (IsNewEntry && this.control.successmsgtext) {
                  _message.text = this.control.successmsgtext;
                  _message.title = this.control.successmsgtitle;
                  _message.icon = this.control.successmsgicon;
                } else if (!IsNewEntry && this.control.updatemsgtext) {
                  _message.text = this.control.updatemsgtext;
                  _message.title = this.control.updatemsgtitle;
                  _message.icon = this.control.updatemsgicon;
                } else {
                  if (IsNewEntry) {
                    _message.text = res.message;
                    _message.title = this.control.successmsgtitle;
                    _message.icon = this.control.successmsgicon;
                  } else {
                    _message.text = res.message;
                    _message.title = this.control.updatemsgtitle;
                    _message.icon = this.control.updatemsgicon;
                  }
                  // this.changeSuccessMessage(res.message ? res.message : null);
                }
                var btnparams: any = {};
                if (this.control.fileuploadonsubmitparams && this.control.fileuploadonsubmitparams.length > 0 && res.data) {
                  this.control.fileuploadonsubmitparams.forEach(item => {
                    btnparams[item] = res.data[item];
                  })
                }

                this._controlService.FileUploadComponentCall(this.control.refreshcomponentonclose, this.control.sidebarcloseonsubmit, btnparams, _message, this.control.refreshcomponentkey);

                if (this.control.sidebarcloseonsubmit && !this._controlService._opened && !this._controlService._openedEditForm) {
                  this._controlService.buttonSidebarAction();
                }
                if (this.control.submitonconfirm && this.control.calladditionalapi) {
                  var _confirmMsg = null;
                  if (this.control.responsefieldfrommessage) {
                    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                      this.data[this.control.key] = res.data[0][this.control.responsefieldfrommessage];
                    } else if (res.data && typeof res.data == 'object') {
                      this.data[this.control.key] = res.data[this.control.responsefieldfrommessage]
                    }
                  }
                  if (res.data[this.control.responsefield] || res.data[this.control.responsefield] === false) {
                    this.data[this.control.responsefield] = res.data[this.control.responsefield];
                  }
                  this.submitonconfirm(null, null, contentSubmitConfirm, true, _confirmMsg);
                }
              } else {
                if (this.control.refreshcomponentonclose == "update") {
                  this.changeSuccessMessage(res.message ? res.message : null);

                  if (this._controlService._opened && this.control.sidebarcloseonsubmit)
                    this._controlService._toggleSidebar();

                  if (this._controlService._openedEditForm && this.control.sidebarcloseonsubmit)
                    this._controlService._toggleEditFormSidebar();

                  if (this.control.sidebarcloseonsubmit) {
                    this._controlService.buttonSidebarAction();
                  }
                } else if (this.control.refreshcomponentonclose) {
                  var _message: any = {}
                  if (IsNewEntry && this.control.successmsgtext) {
                    _message.text = this.control.successmsgtext;
                    _message.title = this.control.successmsgtitle;
                    _message.icon = this.control.successmsgicon;
                  } else if (!IsNewEntry && this.control.updatemsgtext) {
                    _message.text = this.control.updatemsgtext;
                    _message.title = this.control.updatemsgtitle;
                    _message.icon = this.control.updatemsgicon;
                  } else {
                    if (IsNewEntry) {
                      _message.text = res.message;
                      _message.title = this.control.successmsgtitle;
                      _message.icon = this.control.successmsgicon;
                    } else {
                      _message.text = res.message;
                      _message.title = this.control.updatemsgtitle;
                      _message.icon = this.control.updatemsgicon;
                    }
                    // this.changeSuccessMessage(res.message ? res.message : null);
                  }
                  this._controlService.RefreshComponent(this.control.refreshcomponentonclose, _message, this.control.refreshcomponentkey);

                  if (this._controlService._opened && this.control.sidebarcloseonsubmit)
                    this._controlService._toggleSidebar();

                  if (this._controlService._openedEditForm && this.control.sidebarcloseonsubmit)
                    this._controlService._toggleEditFormSidebar();

                  if (this.control.sidebarcloseonsubmit) {
                    this._controlService.buttonSidebarAction();
                  }
                }
                else if (this.control.actiontype != "sidebar") {
                  var _message: any = {}
                  if (IsNewEntry && this.control.successmsgtext) {
                    _message.text = this.control.successmsgtext;
                    _message.title = this.control.successmsgtitle;
                    _message.icon = this.control.successmsgicon;
                  } else if (!IsNewEntry && this.control.updatemsgtext) {
                    _message.text = this.control.updatemsgtext;
                    _message.title = this.control.updatemsgtitle;
                    _message.icon = this.control.updatemsgicon;
                  } else {
                    if (IsNewEntry) {
                      _message.text = res.message;
                      _message.title = this.control.successmsgtitle;
                      _message.icon = this.control.successmsgicon;
                    } else {
                      _message.text = res.message;
                      _message.title = this.control.updatemsgtitle;
                      _message.icon = this.control.updatemsgicon;
                    }
                    // this.changeSuccessMessage(res.message ? res.message : null);
                  }
                  this._controlService.FilterRefresh(this.control.sidebarcloseonsubmit ? false : true, _message, this.control.refreshcomponentkey);

                  if (this._controlService._opened && this.control.sidebarcloseonsubmit) {
                    this._controlService._toggleSidebar();
                  }

                  // if (_othis.control.sidebarcloseonsubmit && _othis._controlService._openedbuttonsidebar) {
                  //   _othis._controlService._openedbuttonsidebar = !_othis._controlService._openedbuttonsidebar;
                  // }
                  if (this._controlService._openedEditForm && this.control.sidebarcloseonsubmit)
                    this._controlService._toggleEditFormSidebar();

                  if (this.control.sidebarcloseonsubmit) {
                    this._controlService.buttonSidebarAction();
                  }
                }

                // if (this.control.actiontype == "sidebar") {
                //   this.changeSuccessMessage(res.message ? res.message : null);
                //   this._opened = !this._opened;
                //   //this._controlService._openedbuttonsidebar = !this._controlService._openedbuttonsidebar;
                //   this.loadMetadata(this.control.actionformid);
                // }
              }

            } else if (res.status == "error") {
              //this.changeSuccessMessage(res.message ? res.message : null);
              if (this.control.errormsgtext) {
                this.errorMessage = this.control.errormsgtext;
              } else {
                this.errorMessage = res.message;
              }
            } else {
              this.changeSuccessMessage(res.message ? res.message : null);
              this._controlService.FilterRefresh(true, null, this.control.refreshcomponentkey);
            }
            this.formGroup.controls[this.control_id].markAsTouched();
            this.cd.detectChanges();
          },
            err => {
              this.isApiCalling = false;
              this.cd.detectChanges();
              console.log(err);
            },
            () => {
              this.isApiCalling = false;
              this.cd.detectChanges();
              //this.msg = "Post shared successfully";
              //console.log("done!")
            }
          );
      } else {
        this.control.PrimaryKey = this.control.primarykey
        this.setParam(null);
        this.isApiCalling = false;
          this.cd.detectChanges();
          if (this._controlService._opened && this.control.sidebarcloseonsubmit)
              this._controlService._toggleSidebar();

          if (this._controlService._openedEditForm && this.control.sidebarcloseonsubmit)
              this._controlService._toggleEditFormSidebar();

          if (this.control.sidebarcloseonsubmit) {
              this._controlService.buttonSidebarAction();
          }
        this._controlService.RefreshComponent(this.control.refreshcomponentonclose, null, this.control.refreshcomponentkey);
      }
    }
  }
  sendnotification(action: string) {
    // debugger;
    let apiparam: any = {};
    apiparam.id = this.control.notificationformid;
    this.busy = this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.isApiCalling = false;
          this.cd.detectChanges();
          var Notification = data.Notification;
          if (action == "create") {

            if (Notification.create) {
              var body = Notification.createtemplate;
              var keys = Object.keys(this.data);
              keys.forEach(Option => {

                // debugger;
                body = body.replace("{{" + Option + "}}", this.data[Option]);

              });
              var users: any;
              users = [];

              Notification.createmodelfiled.forEach(Option => {
                users.push(this.data[Option]);
              });
              var mail = { "body": body, "to": users, "subject": Notification.createsubject };

              let apiparam: any = {};
              apiparam.includecurrentuser = Notification.isloginusercreateenable;
              this.busy = this._appService.post("api/application/sendemail", JSON.stringify(mail), apiparam)
                .subscribe(res => {

                });
            }
          }
          if (action == "update") {

            if (Notification.update) {
              var body = Notification.updatetemplate;

              var keys = Object.keys(this.data);
              keys.forEach(Option => {

                // debugger;
                body = body.replace("{{" + Option + "}}", this.data[Option]);

              });
              var users: any;
              users = [];
              Notification.updatemodelfiled.forEach(Option => {
                users.push(this.data[Option]);
              });
              let apiparam: any = {};
              apiparam.includecurrentuser = Notification.isloginusercreateenable;
              var mail = { "body": body, "to": users, "subject": Notification.updatesubject };
              this.busy = this._appService.post("api/application/sendemail", JSON.stringify(mail), apiparam)
                .subscribe(res => {

                });
            }
          }

        },
        err => {
          console.log(err);

        },
        () => {
          console.log("done");
        }
      );
  }
  submitPinnedModel() {
    // debugger;
    var _pinnedData = this._controlService.deepcopy(this._controlService.dataModel);
    let url = this.control.Api;
    let currentUrl = this._router.url ? this._router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    const menu = this.AuthService.Menu;
    const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
    _pinnedData.forEach((_dataModel, index) => {
      var ModelJson = null;
      let apiparam: any = {};
      if (!this.control.enablerowquery) {
        ModelJson = _dataModel;
        const activateParams = this._controlService.getQueryParams();
        this.control.paramlist.forEach(option => {
          if (!option.ispagevarible)
            apiparam[option.key] = option.value;
          else if (page) {
            page.Params.forEach(pOption => {
              if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
                let activeParam = activateParams.find(x => x[pOption.name]);
                if (activeParam) {
                  apiparam[option.key] = activeParam[pOption.name];
                } else {
                  apiparam[option.key] = pOption.value;
                }
              }
            })
          }
        })
      }
      else {
        var rowQuery = this.control.rowquery;
        const activateParams = this._controlService.getQueryParams();
        this.control.paramlist.forEach(option => {
          if (!option.ispagevarible)
            rowQuery = rowQuery.replace("{{" + option.key + "}}", _dataModel[option.value] ? _dataModel[option.value] : null);
          else if (page) {
            page.Params.forEach(pOption => {
              if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
                let activeParam = activateParams.find(x => x[pOption.name]);
                if (activeParam) {
                  // apiparam[param.key] = activeParam[pOption.name];
                  rowQuery = rowQuery.replace("{{" + option.key + "}}", activeParam[pOption.name] ? activeParam[pOption.name] : null);
                } else {
                  rowQuery = rowQuery.replace("{{" + option.key + "}}", pOption.value ? pOption.value : null);
                }
              }
              // rowQuery = rowQuery.replace("{{" + option.key + "}}", pOption.value ? pOption.value : null);
            })
          }
        })

        ModelJson = JSON.parse(rowQuery);

        // if (!ModelJson[this.control.status]) {
        //   var _status = this.control.status.length > 0 ? this.control.status[0] : {};
        //   ModelJson[this.control.statusfield] = _status.value;
        // }
      }


      if (this.control.createdby && this.control.createdby.trim() != "") {
        // ModelJson[this.control.createdby] = "khushbu.brahmbhatt";
      }
      if (this.control.updatedby && this.control.updatedby.trim() != "") {
        // ModelJson[this.control.updatedby] = "khushbu.brahmbhatt";
      }
      this.busy = this._appService.post(url, JSON.stringify(ModelJson), apiparam)
        .subscribe((res: any) => {
          //this._controlService.dataModel.push(_dataModel);
          this.isApiCalling = false;
          this.cd.detectChanges();
          this.status = res.status;
          if (index == _pinnedData.length - 1) {
            this._controlService.dataModel = []
            if (this.control.sidebarcloseonsubmit && res.status != 'error') {
              this._controlService.buttonSidebarAction();
            }
            if (this.control.refreshcomponentonclose) {
              if (res.status == 'error') {
                if (this.control.errormsgtext) {
                  this.errorMessage = this.control.errormsgtext;
                } else {
                  this.errorMessage = res.message;
                }

              } else {
                let _message: any = {}
                _message.text = this.control.successmsgtext;
                _message.title = this.control.successmsgtitle;
                _message.icon = this.control.successmsgicon;
                this._controlService.RefreshComponent(this.control.refreshcomponentonclose, _message, this.control.refreshcomponentkey);
              }
            }
          }
        },
          err => {
            this.isApiCalling = false;
            this.cd.detectChanges();
            console.log(err);
            _.remove(this._controlService.dataModel, function (child) {
              return JSON.stringify(child) == JSON.stringify(_dataModel);
            });
          },
          () => {
            //console.log("done!")
          }
        );
    })
  }
  public changeSuccessMessage(messages: any = null) {
    if (messages)
      this._success.next(messages);
    else
      this._success.next("Data saved successfully.");
  }
  getDateTime() {
    var today = new Date();
    var dd = today.getDate().toString();
    var mm = (today.getMonth() + 1).toString(); //January is 0!

    var yyyy = today.getFullYear();


    if (parseInt(dd) < 10) {
      dd = '0' + dd;
    }
    if (parseInt(mm) < 10) {
      mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy + " " + today.getHours() + ":" + today.getMinutes();
  }
  ResetCaching(resetcacheapidetails: any) {
    let currentUrl = this._router.url ? this._router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    var cachedUrl = null;
    const menu = this.AuthService.Menu;
    const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
    resetcacheapidetails.array.forEach(ele => {
      if (ele.url && ele.primarykey && ele.primarykeyvaluefield && !cachedUrl) {
        var pkeyValue = null;
        if (ele.isdatamodel) {
          pkeyValue = this.data[ele.primarykeyvaluefield];
        } else {
          const activateParams = this._controlService.getQueryParams();

          if (page) {
            page.Params.forEach(pOption => {
              if (pOption.name.trim().toLowerCase() == ele.primarykeyvaluefield.trim().toLowerCase()) {
                let activeParam = activateParams.find(x => x[pOption.name]);
                if (activeParam) {
                  pkeyValue = activeParam[pOption.name];
                } else {
                  pkeyValue = pOption.value;
                }
              }
            })
          }
        }
        if (pkeyValue) {
          for (let stream in this._appService.stream) {
            let urlPart: any = stream.split('?');
            const esc = encodeURIComponent;
            let url = urlPart && urlPart.length > 0 ? urlPart[0] : null;
            let urlparams = urlPart && urlPart.length > 1 ? urlPart[1] : null;
            let IsParamExists = urlparams ? urlparams.indexOf(esc(ele.primarykey) + '=' + esc(pkeyValue)) : -1;
            if (url && urlparams && url === ele.url && IsParamExists > -1) {
              cachedUrl = stream;
            }
          }
        }
      }
    });

    if (cachedUrl) {
      delete this._appService.stream[cachedUrl];
    }
  }
  private getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements = document.getElementsByTagName(tag);
    for (let index = 0; index < elements.length; index++) {
      html.push(elements[index].outerHTML);
    }
    return html.join('\r\n');
  }
  print() {
    if (this.control.printcontainerkey && this.control.printcontainerkey != undefined && this.control.printcontainerkey != '') {
      var printContents = document.getElementById(this.control.printcontainerkey).innerHTML;
      var originalContents = document.body.innerHTML;
      var styles = this.getElementTag('style');
      var links = this.getElementTag('link');
      var title = this.control.printtitle && this.data[this.control.printtitle] ? this.data[this.control.printtitle] : document.title;
      if (window) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          var popup = window.open('', '_blank',
            'width=1100,height=650,top=120,left=120,scrollbars=no,menubar=no,toolbar=no,'
            + 'location=no,status=no,titlebar=no');

          popup.window.focus();
          popup.document.write('<!DOCTYPE html><html><head><title>' + title + '</title>  '
            + styles
            + ' '
            + links
            + ' </head><body class="container" onload="window.print();window.close()"><div class="row">'
            + printContents + '</div></html>');
          popup.onbeforeunload = function (event) {
            popup.close();
            return '.\n';
          };
          popup.onabort = function (event) {
            popup.document.close();
            popup.close();
          }
        } else {
          var popup = window.open('', '_blank', 'width=1100,height=650,top=120,left=120');
          //popup.document.open();
          popup.document.write('<html><head><title>' + title + '</title> ' +
            + styles
            + ' '
            + links
            + '</head><body onload="window.print();window.close()">' + printContents + '</html>');
          popup.document.close();
        }

        popup.document.close();
      }
      return true;
    }
  }
}

