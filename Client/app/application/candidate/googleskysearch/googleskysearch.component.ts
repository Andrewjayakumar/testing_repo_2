import {
  Component, OnInit, Input, ViewChild, AfterViewInit,
  ChangeDetectorRef, OnDestroy
} from '@angular/core';import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from "../../../core/authservice/auth.service";
import { UUID } from "angular2-uuid";
import { GoogleskysearchService } from './googleskysearch.service';
import { Subscription, Subject } from 'rxjs';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { FormControlService } from '../../../forms/form-control.service';
import { DBkeys } from '../../../core/authservice/db-Keys';
import { Location } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
@Component({
  selector: 'app-googleskysearch',
  templateUrl: './googleskysearch.component.html',
  styleUrls: ['./googleskysearch.component.scss'],
  providers: [GoogleskysearchService],


})
export class GoogleskysearchComponent implements OnInit {

  googleskyresults: any;
  busy: Subscription;
  search: any;
  totalResults: any;
  pagesize: number = 10;
  pageindex: number = 1;
  showLoader = false;
  errorMessage: any;
  SearchTypeArray = [0];
  searchForm: FormGroup;
  socialSelectList = [{ "name": "LinkedIn", "value": 0 }, { "name": "GitHub", value: 1 }, { "name": "Stack Overflow", value: 2 }];

  content: any;
  
  PinArray = [];
  bookmarks: any
  ErrorMsg: any
 // private options: NgbModalOptions = { size: 'lg', windowClass: 'modal-full', keyboard: true, backdrop: 'static' };
  form: FormGroup;
  modalpopupformJson: any;
  modalpopupModelJson: any;
  title: any
  modalRef: any






  constructor(private auth: AuthService, public route: Router, public GoogleskysearchService: GoogleskysearchService, private localStorage: LocalStoreManager, private fb: FormBuilder, public _authservice: AuthService, private _controlService: FormControlService, private _router: Router, private location: Location, private _appService: DataService) {


  }

  ngOnInit() {
    this.skySearchForm();
  
  }
  ngAfterViewInit() {
  //  debugger;
 
  }

  skySearchForm() {
    this.searchForm = this.fb.group({
      socialSelectArray: [[], [Validators.required]],
      search: [null, Validators.required]
    });

  }

  onChange(socialval, isChecked) {

    if (isChecked) {
      this.SearchTypeArray.push(socialval);
    } else {
      const index = this.SearchTypeArray.indexOf(socialval);
      if (index > -1) {
        this.SearchTypeArray.splice(index, 1);
      }
    }

  }
  // get All the Qualification
  onSubmit(pageindex) {
    //  this.googleskyresults = [];
    this.showLoader = true;
    if (pageindex == 'submit') {
      pageindex = 1;
      this.pageindex = 1;
    }
    var reqparam = {
      "query": this.searchForm.value['search'],
      "page": pageindex,
      "pagesize": 10,
      "searchtype": this.SearchTypeArray,
      "PageCode":"XCS01"
    }
    this.busy = this.GoogleskysearchService.googleSkySearch(reqparam)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.googleskyresults = JSON.parse(res._body)['response'];
            this.showLoader = false;
          }
          else {
            this.showLoader = false;
            this.errorMessage = JSON.parse(res._body)['message'];
            this.totalResults = '';
            this.googleskyresults = [];

            setTimeout(() => {
              this.errorMessage = "";
            }, 5000);

          }
        if (JSON.parse(res._body)['response'].totalResults) {
            this.totalResults = JSON.parse(res._body)['response'].totalResults;
          }

        },
        err => {
          this.showLoader = false;

        },
        () => {
          this.showLoader = false;

        }
      );
  }


  // On page changed for pagination on results
  onPageChanged(event) {
    this.pageindex = event;

    window.scroll(0, 0);

    if (this.pageindex && this.pageindex > 1) {

      this.onSubmit(this.pageindex);
    }

  }

  pinclicked(event, current_record: any, pintype: string) {
   // debugger;
    let content = '';
    if (pintype === "candidate") {
      var candidate = {
        "id": UUID.UUID(),
        "url": "apps/candidateprofile",
        "title": current_record.candidatename,
        "subtitle": "",
        "icon": "user-o",
        "params": [
          { "name": "candidateid", "id": UUID.UUID(), "value": current_record.candidateid } 
        ],
        "openinpopup": true,
        "popupparams": { value: current_record.candidateid, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
      };
      this.pinClickedHandler(candidate);

    }



  }

  public pinClickedHandler(pinObject: any) {

    if (pinObject && pinObject.params) {
      let primaryKey = pinObject.params[0].name;
      let primaryKeyValue = pinObject.params[0].value;
      if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
        this._authservice.AddtoBookmark(pinObject);
        this.PinArray.push(pinObject);


      }
    }
  }

  isbookmarked(item: any, primaryKey, primarykeyValue) {
    let itembookmarked = false;
    // debugger;
    if (this._authservice.bookmark) {
      this._authservice.bookmark.forEach(item => {
        const param = item.params.find(x => x.name === primaryKey && x.value === primarykeyValue);
        if (param) {
          itembookmarked = item;
        }
      })
    }
    if (itembookmarked) {
      this._authservice.RemoveBookmark(itembookmarked);
    }
    return itembookmarked;
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

  removebookmark(item: any) {
 
    this._authservice.RemoveBookmark(item);
  //  this._controlService.cardComponentDtectChanges();
  }


  removeAllbookmark() {

    this.localStorage.deleteData(DBkeys.BookMarklist);
    this._authservice.bookmarklist();
   // this._controlService.cardComponentDtectChanges();
    if (this._authservice && this._authservice.Menu && this._authservice.Menu.Nav && this._authservice.Menu.Nav.length > 0) {
      this._router.navigate([this._authservice.Menu['Nav'][0].Url])
    }
  }
}
