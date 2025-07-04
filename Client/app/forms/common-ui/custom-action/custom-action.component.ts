import {
  Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef,

  AfterViewInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControlService } from '../../form-control.service';
// import { AuthService } from "../../../core/authservice/auth.service";
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../../core/authservice/db-Keys';
import { UUID } from "angular2-uuid";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { UtilityService } from '../../../core/services/utility.service';
import { CandidatesubmissionComponent } from '../../candidatesubmission/candidatesubmission.component';
import { CandidateResumeUploadComponent } from '../../candidatesubmission/candidate-resumeupload/candidate-resumeupload.component';
import { UploadRecordingComponent} from '../../../application/requisitions/upload-recording/upload-recording.component';
import { SecureCandidateComponent } from "../../../application/candidate/secure-candidate/secure-candidate.component";
import { FormatResumeComponent } from "../../format-resume/format-resume.component";

@Component({
  selector: 'custom-action',
  templateUrl: './custom-action.component.html',
  styleUrls: ['./custom-action.component.scss'],
  providers: [LocalStoreManager, DBkeys],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomActionComponent implements OnInit, OnDestroy {
  @Input() public customaction: any = [];
  @Input() public actionview: any = "";
  @Input() public customActionAlign: any = "";
  @Input() public data: any = [];
  @Input() public value: string = null;
  @Input() public AuthService: any;

  busy: Subscription;
  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
  modalcloseConfirm: string = 'NO'
  form: FormGroup;
  modalpopupformJson: any;
  modalpopupModelJson: any;
    redirectActionBoth: any;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor(public _controlService: FormControlService, private _router: Router
        , private localStorage: LocalStoreManager,
    private _appService: DataService,
    private modalService: NgbModal, private location: Location, private cd: ChangeDetectorRef) {
    this._controlService.cardDtectedChanges$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          debugger;
          this.cd.detectChanges();
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
    ngOnInit() {

      /**
        this.customaction.forEach(action => {
            if (action.showbadge) {
                action.showbadge = this.data[action.showbadge];
            }
        });
        *
        * */ 
    }

    @ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;
    confirmDialogOptions = { "title": "Are you sure? ", "message" : "Closing the pop up will discard your changes. Do you want to proceed?" };


  addbookmark(action) {
    debugger;
    if (this.isbookmarked(action)) {
      this.removebookmark(action);
    } else {
      let currentUrl = action.RedirectUrl;

      var menu = this.AuthService.Menu;

      var page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      var item = {
        "id": UUID.UUID(),
        "url": page.Url,
        "title": this.data[action.titlebinding] ? this.data[action.titlebinding] : page.Title,
        "subtitle": this.data[action.subtitlebinding] != 'undefined' && this.data[action.subtitlebinding] != null ? this.data[action.subtitlebinding] : action.subtitlebinding,
        "icon": action.WebIcon ? action.WebIcon : "",
        "params": page.Params,
        "openinpopup": action.openbookmarkinpopup,
        "popupparams": { value: this.data[action.PrimaryKey], key: action.PrimaryKey, formid: action.sidebarformid }
      };
      this.AuthService.AddtoBookmark(item);
    }
    this._controlService.ruleComponentDetectChanges();
  }
  removebookmark(action) {
    // debugger;
    var itembookmarked;
    const currentUrl = action.RedirectUrl;
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
    const currentUrl = action.RedirectUrl;
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
  setParam(action) {
    let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
    var _index = 0;
    var redirectUrl = null;
    if (action.RedirectUrl) {
      redirectUrl = action.RedirectUrl;
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
      if (redirectUrl == "../story/summary") {
        _index = 0;
      }
      var page: any = this._controlService.find(menu['Nav'], redirectUrl.substring(_index));
      if (page && (action.ActionType == 'sidebar' || action.ActionType == 'popup')) {
        page.Params.forEach(_item => {
          if (_item.name == action.PrimaryKey) {
            _item.value = this.data[action.PrimaryKey];
          } else if (this.data[_item.name] || this.data[_item.name] == false) {
            _item.value = this.data[_item.name];
          }
        });
      } else {
        var currentUrl = this._router.url ? this._router.url : "/";
        if (currentUrl.indexOf('?') > -1) {
          currentUrl = currentUrl.split('?')[0];
        }
        var currentPage: any = this._controlService.find(menu['Nav'], currentUrl.substring(1));//this._controlService.deepcopy(menu).Nav.find(x => x.Url == currentUrl.substring(1));
        if (currentPage && page) {
          //page.Params = [];
          currentPage.Params.forEach(_item => {
            var arr: any = {}
            if (_item.name == action.PrimaryKey) {
              arr.name = _item.name;
              if (_item.value == "&")
                arr.value = this.data[_item.name];
              else
                arr.value = this.data[action.PrimaryKey];

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
    //this.setValue(menu['Nav'], action.RedirectUrl.substring(_index), action);
    //if (page)
    //  page.Params.push({ "key": action.PrimaryKey, "value": this.data[action.PrimaryKey] });
  }
  getQueryParams(action) {
    var QueryParams: any = {};
    
    debugger;
    let pagevariables = this.getPageVariable();
    if (action.PrimaryKey.indexOf(',') > 0) {
      let keys = action.PrimaryKey.split(',');
      keys.forEach(i => {
        i = i.trim();

        if (this.data[i])
          QueryParams[i] = this.data[i];
        else {
          //if this variable is not found , search in page variables
          QueryParams[i] = pagevariables[i];
        }
      }
      );

    }
    else {
      QueryParams[action.PrimaryKey] = this.data[action.PrimaryKey];

    }



    return QueryParams;
  }
 
  customAction(action, content) {
    if (action.ActionType === 'sidebar') {
      this._controlService.formData = {};
      this._controlService.formvalidation = {}
      this.setParam(action);
      this._controlService.ActionMode = action.SidebarViewType === "otherform" ? 'write' : action.SidebarViewType;
      this._controlService._openedEditForm = !this._controlService._openedEditForm;
      const isOtherForm = action.SidebarViewType === 'otherform' ? true : false;
      var currentUrl = this._router.url ? this._router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      // this._router.navigate([action.RedirectUrl], { queryParams: this.getQueryParams(action), queryParamsHandling: 'merge' });
      var urlTree: string = this._router.createUrlTree([], {
        queryParams: this.getQueryParams(action),
        queryParamsHandling: "merge",
        preserveFragment: true
      }).toString();
      // this._router.navigateByUrl(urlTree);
        this.location.go(urlTree);
     //   debugger;
      this._controlService.InitializeEditForm(this.data[action.PrimaryKey], isOtherForm,
          action.sidebarformid, currentUrl.substring(1), "sidebar", this.AuthService, action.isSmallSidebar);
    } else if (action.ActionType === 'bookmarkinaction') {
      this.setParam(action);
      this.addbookmark(action);
    } else if (action.ActionType === 'popup') {
      // this._router.navigate([action.RedirectUrl], { queryParams: this.getQueryParams(action), queryParamsHandling: 'merge' });
      this._controlService.formData = {};
      this._controlService.formvalidation = {}
      var urlTree: string = this._router.createUrlTree([], {
        queryParams: this.getQueryParams(action),
        queryParamsHandling: "merge",
        preserveFragment: true
      }).toString();
      // this._router.navigateByUrl(urlTree);
      this.location.go(urlTree);
      this.setParam(action);
      this.openPopup(action, content);
    } else if (action.ActionType === 'submit' || action.ActionType === 'submitredir' || action.ActionType === 'submitredirNew'
      || action.ActionType === 'submitredirboth' || action.ActionType === 'submitredirNewWindow'
      || action.ActionType === 'submitbookamrk') {
      if (action.ActionType === 'submitbookamrk') {
        this.isAppiCalling = true;
      }
      this.submit(action);
    } else if (action.RedirectUrl && (action.ActionType === 'sametab' || this.redirectActionBoth === 'sametab')) {
      
      this.setParam(action);
      if (action.pageleavewarning) {
        if (confirm(action.pageleavewarning)) {
          if (action.PrimaryKey) {
            this._router.navigate([action.RedirectUrl], { queryParams: this.getQueryParams(action) }).then(() => {
              this._controlService.RefreshComponent("page");
            });
          } else {
            this._router.navigate([action.RedirectUrl]).then(() => {
              this._controlService.RefreshComponent("page");
            });
          }
        }
      } else {
        if (action.PrimaryKey) {
          const queryParams = this.getQueryParams(action);
              if (action.RedirectUrl.includes('#')) {
                const fragment =  action.RedirectUrl.split('#')[1]
                action.RedirectUrl = action.RedirectUrl.split('#')[0];
            this._router.navigate([action.RedirectUrl], { fragment:fragment, queryParams }).then(() => {
              this._controlService.RefreshComponent("page");
            });
          } else {
            // Navigate only with query parameters
            this._router.navigate([action.RedirectUrl], { queryParams }).then(() => {
              this._controlService.RefreshComponent("page");
            });
          }
        } else {
          this._router.navigate([action.RedirectUrl]).then(() => {
            this._controlService.RefreshComponent("page");
          });
        }
      }
    } else if (action.RedirectUrl && (action.ActionType === 'newtab' || this.redirectActionBoth === 'newtab')) {
      this.setParam(action);
      if (action.PrimaryKey) {
        window.open(action.RedirectUrl + '?' + action.PrimaryKey + '=' + this.data[action.PrimaryKey], '_blank')
      } else {
        window.open(action.RedirectUrl, '_blank')
      }
    } else if (action.RedirectUrl && action.ActionType === 'newwindow') {
      this.setParam(action);
      if (action.PrimaryKey) {
        window.open(action.RedirectUrl + '?' + action.PrimaryKey + '=' + this.data[action.PrimaryKey], '_blank'
          , 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700');
      } else {
        window.open(action.RedirectUrl, '_blank'
          , 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700');
      }
    }
  }
  isAppiCalling: boolean = false;
  ErrorMsg: any
  submit(action) {
    let url = "";
    this.ErrorMsg = null;
    // debugger;
    let apiparam: any = {};

    var currentUrl = this._router.url ? this._router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    const menu = this.AuthService.Menu;
    const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));

    url = action.apiurl;
    var dataModel: any = {};
    if (!action.enablerowquery) {
      action.apiparam.forEach(option => {
        if (page && option.ispagevarible) {
          page.Params.forEach(pOption => {
            if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
              apiparam[option.key] = pOption.value;
            }
          })
        } else if (option.ismodelvarible) {
          apiparam[option.key] = this.data[option.value];
        } else {
          apiparam[option.key] = option.value;
        }
      })

      //this._controlService.setPageVarible(action.apiparam, apiparam);
    } else {
      var rowQuery = action.rowquery;
      const activateParams = this._controlService.getQueryParams();
      action.apiparam.forEach(option => {
        if (!option.ispagevarible) {
          rowQuery = rowQuery.replace("{{" + option.key + "}}", this.data[option.value] ? this.data[option.value] : null);
        } else if (page) {
          page.Params.forEach(pOption => {
            if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
              let activeParam = activateParams.find(x => x[pOption.name]);
              if (activeParam) {
                rowQuery = rowQuery.replace("{{" + option.key + "}}", activeParam[pOption.name] ? activeParam[pOption.name] : null);
              } else {
                rowQuery = rowQuery.replace("{{" + option.key + "}}", pOption.value ? pOption.value : null);
              }
            }
          })
        }
      })

      dataModel = JSON.parse(rowQuery);
    }

    //this._controlService.setPageVarible(action.apiparam, apiparam);

    this.busy = this._appService.post(url, JSON.stringify(dataModel), apiparam)
      .subscribe((res: any) => {
        var redirect: boolean = true;
          var _message: any = {}
        if (action.mappingfieldforprimarykey) {
          if (res[action.mappingfieldforprimarykey]) {
            this.data[action.PrimaryKey] = res[action.mappingfieldforprimarykey];
            this.setParam(action);
          } else {
            redirect = false;
          }
        }
        if ((action.ActionType === 'submitredir' || this.redirectActionBoth === 'sametab') && redirect) {
          this._router.navigate([action.RedirectUrl], { queryParams: this.getQueryParams(action) });
        } else if ((action.ActionType === 'submitredirNew' || this.redirectActionBoth === 'newtab') && redirect) {
          if (action.successmessage) {
            _message.text = action.successmessage ? action.successmessage : "Information saved successfully";
            _message.title = "Awesome";
            _message.icon = "fa fa-thumbs-o-up";
            this._controlService.RefreshComponent(null, _message);
          }
          window.open(action.RedirectUrl + '?' + action.PrimaryKey + '=' + this.data[action.PrimaryKey], '_blank');
        } else if (action.ActionType === 'submitredirNewWindow' && redirect) {
          if (action.successmessage) {
            _message.text = action.successmessage ? action.successmessage : "Information saved successfully";
            _message.title = "Awesome";
            _message.icon = "fa fa-thumbs-o-up";
            this._controlService.RefreshComponent(null, _message);
          }
          window.open(action.RedirectUrl + '?' + action.PrimaryKey + '=' + this.data[action.PrimaryKey],
            '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=700')
        } else if ((action.ActionType === 'submitredirNewWindow' || action.ActionType === 'submitredir'
          || action.ActionType === 'submitredirNew' || action.ActionType === 'submitredirboth') && !redirect) {
          var _message: any = {}
          _message.text = "Try again";
          _message.title = "Something went wrong";
          _message.icon = "fa fa-thumbs-o-down";
          this._controlService.RefreshComponent(null, _message);

        } else if (action.ActionType === 'submitbookamrk' && redirect) {
          // this.setParam(action);
          this.addbookmark(action);
        } else if (action.ActionType == 'submitbookamrk' && !redirect) {
            this.ErrorMsg = res.message ? res.message : res;
            if (res.status == "error") {
                _message.text = res.message ? res.message : "An Error Occurred.";
                _message.title = "Error!";
                _message.icon = "fa fa-thumbs-o-down";
                this._controlService.RefreshComponent("update", _message);
            }
        } else {
          if (res.status == "success") {
            _message.text = action.successmessage ? action.successmessage : res.message;
            _message.title = "Awesome";
              _message.icon = "fa fa-thumbs-o-up";
              _message.status = "success";
              this._controlService.RefreshComponent("customaction", _message);
          } else if (res.status == "error") {
            _message.text = res.message;
            _message.title = "Oops!";
              _message.icon = "fa fa-thumbs-o-down";
              _message.status = "error";
              this._controlService.RefreshComponent("customaction", _message);
          }
        }
      },
        err => {
          console.log(err);
        },
        () => {
          this.isAppiCalling = false;
          if (action.ActionType === 'submitbookamrk') {
            this.cd.markForCheck(); // marks path
          }
          //this.msg = "Post shared successfully";
          //console.log("done!")
        }
      );
  }
  ActionMode: any = "write";
    openPopup(action, content) {
        if (action.metalpopupwindow) {
            debugger;
            let pagevariables = this.getPageVariable();
            let popupkey = this.data[action.PrimaryKey] ? this.data[action.PrimaryKey]: [];
            if (action.PrimaryKey.indexOf(',') > 0) {
                let keys = action.PrimaryKey.split(',');
                keys.forEach(i => {
                    i = i.trim();
                    if(this.data[i])
                      popupkey.push({ "key": i, "value": this.data[i] });
                    else {
                        //if this variable is not found , search in page variables
                        popupkey.push({ "key": i, "value": pagevariables[i] });
                    }
                }
               );
            }
           
            let ngbModalOptions: NgbModalOptions = {
                backdrop: 'static',
                size: 'lg',
                //  scrollable: true,
                windowClass: 'overrides'
            };
            let modalRef = null;
            switch (action.metalpopupwindow) {
                
                case 'submit':
                    
                  /*  ngbModalOptions.beforeDismiss : () => {
                        debugger;
                        this.modalService.open(this.confirmDialog, { size: 'sm', windowClass: 'model-cw', backdrop: false, keyboard: false }).result.then((result) => {
                            let close = false;
                            if (result == 'OK') {
                                close = true;
                              //  return true;
                            }
                            else {
                                close = false;
                            }
                            return close;
                        });
                    }); */
                    if (this.data['isresumeupload']) {
                        modalRef = this.modalService.open(CandidateResumeUploadComponent, ngbModalOptions);
                        modalRef.componentInstance.inputdata = popupkey ? popupkey : "";
                        modalRef.result.then((result) => {
                          
                            if (result == 'success') {
                                this._controlService.RefreshComponent();
                            }
                            

                        });
                    }
                    else {
                        ngbModalOptions.windowClass = 'model-cw';
                        modalRef = this.modalService.open(CandidatesubmissionComponent, ngbModalOptions);
                        modalRef.componentInstance.inputdata = popupkey ? popupkey : "";
                        modalRef.result.then((result) => {
                            
                            if (result == 'success') {
                                this._controlService.RefreshComponent();
                            }
                            else {

                            }

                        });
                    }
                  

                    break;
                case 'videoupload':
                            modalRef = this.modalService.open(UploadRecordingComponent, ngbModalOptions);
                            modalRef.componentInstance.inputdata = popupkey ? popupkey : "";
                            modalRef.result.then((result) => {

                                if (result == 'success') {
                                  this._controlService.RefreshComponent();
                                }

                                });
    
                        break;
                case 'SecureCandidate':
                    debugger;
                    modalRef = this.modalService.open(SecureCandidateComponent, ngbModalOptions);
                    modalRef.componentInstance.inputdata = popupkey ? popupkey : "";
                break;
              case 'formatresume':
              debugger;
              ngbModalOptions.windowClass = 'model-lg';

                modalRef = this.modalService.open(FormatResumeComponent, ngbModalOptions);
              modalRef.componentInstance.inputdata = popupkey ? popupkey : "";
                break;
                default:
                    this.modalpopupformJson = '';
                    this.ErrorMsg = "Error occurred.  Nothing to Display."
                    this.modalService.open(content, {
                        size: 'lg', windowClass: 'model-cw', backdrop: false
                    });
                    break;
            }
           
              
        }
        else {
            this.modalService.open(content, { size: 'lg', windowClass: 'model-cw', backdrop: false, keyboard: false });
            this.ActionMode = action.SidebarViewType === "otherform" ? 'write' : action.SidebarViewType;
            this.loadMetadata(this.data[action.PrimaryKey],
                action.sidebarformid);
        }  
  }
  closePopup(content) {
    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
      if (this.modalcloseConfirm == "YES") {

      }
      else {
        this.modalcloseConfirm = "NO";
      }
    });
  }
  loadMetadata(id, formid) {
    this.modalpopupformJson = null;
    this.modalpopupModelJson = null;
    let apiparam: any = {};
    if (formid) {
      this._controlService.formvalidation = {};
      this._controlService.formvalid = false;
      apiparam.id = formid;
    } else
      apiparam.id = this._controlService.filterEditformId;

    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.form = this._controlService.toControlGroup(data.controls);
          this.modalpopupformJson = this._controlService.deepcopy(data);
          this.GetModalData(id);
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }
  GetModalData(id) {
    // debugger;
    let apiparam: any = {};
    var url = this.modalpopupformJson.GetEndpoint;

    this.modalpopupformJson.GetEndpointParams.forEach(option => {
      if (option.primarykey)
        apiparam[option.key] = id;
      else
        apiparam[option.key] = option.value;
    })
    this._controlService.setPageVarible(this.modalpopupformJson.GetEndpointParams, apiparam, this.AuthService);
    if (url) {
      this._appService.get(url, apiparam, false)
        .subscribe(
          (data: any) => {
            // debugger;
            if (Array.isArray(data))
              this.modalpopupModelJson = data.length > 0 ? data[0] : this.modalpopupformJson.ModelJson;
            else
              this.modalpopupModelJson = data;

            this._controlService.GenerateDataJson(this.modalpopupformJson.controls, this.modalpopupModelJson, this.form);

            if (this.modalpopupModelJson["id"] == "")
              delete this.modalpopupModelJson["id"];

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
      this.modalpopupModelJson = this.modalpopupformJson.ModelJson;
      this._controlService.GenerateDataJson(this.modalpopupformJson.controls, this.modalpopupModelJson, this.form);

      if (this.modalpopupModelJson["id"] == "")
        delete this.modalpopupModelJson["id"];
    }
  }
  actionType(action) {
    return Array.isArray(action.rules) && action.rules.length > 0 ? action.rules[0].action : '';
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
           if (rule.value == "null") {
                  rule.value = null;
            }
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
              if (rule.value == "null") {
                  rule.value = null;
              }
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
}
