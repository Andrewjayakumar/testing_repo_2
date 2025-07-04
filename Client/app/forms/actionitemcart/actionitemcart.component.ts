

import {
  Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef, DoCheck, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../core/authservice/db-Keys';
import { Router, NavigationEnd } from '@angular/router';
import { DynamicformInitComponent } from '../dynamicform-init/dynamicform-init.component';
import { FormControlService } from '../form-control.service';
import { DataService } from '../../core/services/data.service';
import { SwiperComponent } from 'angular2-useful-swiper';
import { Subject } from 'rxjs/Subject';
import { NgbModal, NgbModalOptions, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';


@Component({
  selector: 'app-actionitemcart',
  templateUrl: './actionitemcart.component.html',
  styleUrls: ['./actionitemcart.component.scss'],
  providers: [LocalStoreManager, DBkeys, NgbActiveModal],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionitemcartComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  @Input() public AuthService: any;

  @ViewChild('bookmarkslider') bookmarkslider: SwiperComponent;


  bookmarks: any
  ErrorMsg: any
  private options: NgbModalOptions = { size: 'lg', windowClass: 'modal-full', keyboard: true, backdrop: 'static' };
  form: FormGroup;
  modalpopupformJson: any;
  modalpopupModelJson: any;
  title: any
  modalRef: any
  candidateId: any;

  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _router: Router
    , private localStorage: LocalStoreManager,
    private _controlService: FormControlService,
    private _appService: DataService, private cd: ChangeDetectorRef, private modalService: NgbModal, private location: Location, public modal: NgbActiveModal,
) {

    this._controlService.ruleDetectedChanges$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          debugger;
          if (this.cd !== null &&
            this.cd !== undefined &&
            !(this.cd as any).destroyed) {
            this.cd.detectChanges();
          }
          if (!this.isBookmarkActive()) {
            if (this.modalRef) {
              this.modalRef.close();
              this.modalpopupformJson = null;
              this.modalpopupModelJson = null;
              if (this.form) {
                this.form.reset();
              }
              this.form = null;
            }
          }
          if (this.bookmarkslider && this.bookmarkslider.swiper) {
            this.bookmarkslider.swiper.update()
          }
        }
      );
  }
  isBookmarkActive() {
    var isOpened = false;
    var params: any = this._controlService.getQueryParams();
    if (params.length > 0) {
      var _item = params.find(x => x['tabkey']);
      isOpened = _item ? true : false;
    }
    return isOpened;
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngOnInit() {
    this.AuthService.bookmarklist();
  }
  ngAfterViewInit() {
    debugger;
    this.cd.markForCheck();
    if (this.bookmarkslider && this.bookmarkslider.swiper) {
      var val = this.AuthService.bookmark.indexOf(this.AuthService.bookmark.find(x => x.id == (this._controlService.getQueryParams().length > 0 ? this._controlService.getQueryParams()[0].tabkey : null))) / 8;
      const _sliderIndex = parseInt(val.toString());
      //this.bookmarkslider.swiper.slideTo(Math.round(this._sliderIndex / 6));
      if (_sliderIndex) {
        for (let i = 0; i < _sliderIndex; i++) {
          this.bookmarkslider.swiper.slideNext();
        }
      }
    }
  }
  getQueryParams(action) {
    var QueryParams: any = {};
    QueryParams["tabkey"] = action.id
    QueryParams[action.popupparams.key] = action.popupparams.value
    return QueryParams;
  }
  Action(action: any, content) {
    debugger;
    if (action.openinpopup) {
      this.title = action.title;
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

      if (action.popupparams.value) {
        this.candidateId = action.popupparams.value;

      }
      this.openPopup(action, content);
    } else {
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.cd.markForCheck();
      }
      this._router.navigateByUrl(action.url + "?tabkey=" + action.id).then(() => {
        this.setParam(action);
        this._controlService.RefreshComponent("page");
      });
    }
  }
  ngDoCheck() {
    if (!this.bookmarks || JSON.stringify(this.bookmarks) != JSON.stringify(this.AuthService.bookmark)) {
      this.bookmarks = this._controlService.deepcopy(this.AuthService.bookmark);
      if (this.cd !== null &&
        this.cd !== undefined &&
        !(this.cd as any).destroyed) {
        this.cd.markForCheck();
      }
    }
  }
  isItemOpend(item: any) {
    var isOpened = false;
    var params: any = this._controlService.getQueryParams();
    if (params.length > 0) {
      var _item = params.find(x => x['tabkey']);
      isOpened = _item ? _item["tabkey"] === item.id : false;
    }
    return isOpened;
  }
  openPopup(action, content) {
    this.modalRef = this.modalService.open(content, this.options);

    this.modalRef.result.then((result) => {
      if (result === 'Close click') {
        this.closePopup()
      }
    }, (reason) => {
      if (reason === ModalDismissReasons.ESC ||
        reason === ModalDismissReasons.BACKDROP_CLICK) {
        this.closePopup();
      }
    });
    this.loadMetadata(action.popupparams.value, action.popupparams.formid);
  }
  closePopup() {
    debugger;
    var params: any = this._controlService.getQueryParams();
    var _queryParams: any = {};
    params = params.filter(x => !x['tabkey']);
    Object.assign(_queryParams, ...params);

    var urlTree: string = this._router.createUrlTree([], {
      queryParams: _queryParams
    }).toString();
    // this._router.navigateByUrl(urlTree);
    this.location.go(urlTree);
  }
  loadMetadata(id, formid) {
    this.modalpopupformJson = null;
    this.modalpopupModelJson = null;
    let apiparam: any = {};
    this.ErrorMsg = '';
    if (formid) {
      this._controlService.formvalidation = {};
      this._controlService.formvalid = false;
      apiparam.id = formid;

      this._appService.get("api/AppData/get", apiparam)
        .subscribe(
          (data: any) => {
            this.form = this._controlService.toControlGroup(data.controls);
            this.modalpopupformJson = this._controlService.deepcopy(data);
            this.GetModalData(id);
          },
          err => {
            console.log(err);
            this.ErrorMsg = 'Something wrong, Please refresh the page.';
          },
          () => {
            //console.log("done")
          }
        );
    } else {
      this.ErrorMsg = 'Error!';
    }
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
            var _data = {};
            if (Array.isArray(data))
              _data = data.length > 0 ? data[0] : this.modalpopupformJson.ModelJson;
            else
              _data = data;

            this._controlService.GenerateDataJson(this.modalpopupformJson.controls, _data, this.form);
            this.modalpopupModelJson = _data;

            if (this.modalpopupModelJson["id"] == "")
              delete this.modalpopupModelJson["id"];

            // this.cd.detectChanges();
          },
          err => {
            this.ErrorMsg = err;
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    } else {
      // debugger;
      var _data = this.modalpopupformJson.ModelJson;
      this._controlService.GenerateDataJson(this.modalpopupformJson.controls, _data, this.form);
      this.modalpopupModelJson = _data;
      if (this.modalpopupModelJson["id"] == "")
        delete this.modalpopupModelJson["id"];

      // this.cd.detectChanges();
    }
  }
  removebookmark(item: any) {
    this.cd.markForCheck();
    // debugger;
    this.AuthService.RemoveBookmark(item);
    this._controlService.cardComponentDtectChanges();
  }
  removeAllbookmark() {
    this.cd.markForCheck();
    this.localStorage.deleteData(DBkeys.BookMarklist);
    this.AuthService.bookmarklist();
    this._controlService.cardComponentDtectChanges();
    /**
     * dontnavigate to dashboard on closeall
     * if (this.AuthService && this.AuthService.Menu && this.AuthService.Menu.Nav && this.AuthService.Menu.Nav.length > 0) {
      this._router.navigate([this.AuthService.Menu['Nav'][0].Url])
    } **/
  }
  setParam(action) {
    let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
    var _index = 0;
    if (action.url) {
      var arr = action.url.split('');
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
      var page: any = menu.Nav.find(x => x.Url == action.url);

      if (page) {
        page.Params = action.params;

        this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
      }
    }

  }
  isbookmarkOpened(item) {
    var isbookmarked = false;
    if (item) {
      let currentUrl = this._router.url;
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      const page = this._controlService.find(this.AuthService.Menu['Nav'], currentUrl.substring(1));

      if (page && item.url == page.Url && JSON.stringify(item.params.filter(x => x.name !== "pagesearchparam")) == JSON.stringify(page.Params.filter(x => x.name !== "pagesearchparam"))) {
        isbookmarked = true;
        // this._sliderIndex = Math.round(this.AuthService.bookmark.indexOf(item) / 6);
      }
    }
    return isbookmarked;
  }
  trackByFn(index, item) {
    return index;
  }
}
