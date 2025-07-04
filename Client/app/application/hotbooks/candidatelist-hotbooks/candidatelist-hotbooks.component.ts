import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { HotBooksService } from "../hotbooks.service";
import { AuthService } from "../../../core/authservice/auth.service";
import {
  NgbModal,
  NgbModalOptions,
  NgbTooltip, ModalDismissReasons
} from "@ng-bootstrap/ng-bootstrap";
import { AddHotbookFolderComponent } from "../add-hotbook-folder/add-hotbook-folder.component";
import { HotbookActionPopupComponent } from "../hotbook-action-popup/hotbook-action-popup.component";
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime } from "rxjs/operators";

import { MetalCardResumeComponent } from "../../../shared/components/metal-card-resume/metal-card-resume.component";

@Component({
  selector: "app-candidatelist-hotbooks",
  templateUrl: "./candidatelist-hotbooks.component.html",
  styleUrls: ["./candidatelist-hotbooks.component.scss"],
})
export class CandidatelistHotbooksComponent implements OnInit {
  busy: Subscription;
  @ViewChild('content') content: TemplateRef<any>;

  listofHotbooks = [];
  hotbooks = [];
  sharedhotbooks = [];
  candidatesList: any;
  selectedhotbook = { id: null, name: null };
  showLoader: boolean = false;
  PinArray = [];
  isPersonal: boolean = true;
  isShared: boolean;
  tagType: string = "Personal";
  pageindex = 1;
  pagesize = 21;
  searchText;
  isactiveFocus: boolean;
  ispassiveFocus: boolean;
  tagid: any;
  currentHotbookID: any;
  querystring: any;
  errormesg = false;
  activeFocusCount = 0;
  passiveFocusCount = 0;
  isActionShared: boolean = true;
  pagename: string = "hotbooks";
  candidateidArray = [];
  showSpinner: boolean = false;
  selectedNotContactedItems: any = null;
  demandPlansList: any;
  demandPlanValue: any = null;
  @ViewChild('closebutton') closebutton;
  enableActions: boolean = false;
  current_user_role: any = 8;
  successMessage: string = "";
  failureMessage: string = "";
  private _success = new Subject<string>();
  private _failure = new Subject<string>();
  @ViewChild("selfClosingAlert") selfClosingAlert: NgbAlert;
  addCandidateToDemandPlanobject = {
    "candidateid": [],
    "demandplanid": 0,
    "approved": true,
    "rejected": true
  }
  pageTrackerResp: any;
  modalRef: any;
  totalRecords: any;
  currentTagID: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  constructor(
    private fb: FormBuilder,
    private hotbookservice: HotBooksService,
    private _authservice: AuthService,
    public _modalService: NgbModal,
    private localStorage: LocalStoreManager
  ) {
    let current_user = this.localStorage.getData('current_user');
    this.current_user_role = current_user.activerole;
    let index = current_user.email.indexOf('@');
  }

  ngOnInit() {
    this.hotbookservice.trackActivityPageOpened({
      pagename: "Hotbooks Candidates",
    });
    this.getMyHotbooksList();
    this.getDemandPlans();
    this.successAndFailureMsgs();
    this.demandPlanValue = "";
  }

  successAndFailureMsgs() {
    this._success.subscribe((message) => (this.successMessage = message));
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
        // this.modal.close(true);
      }
    });

    this._failure.subscribe((message) => (this.failureMessage = message));
    this._failure.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
        // this.modal.close(true);
      }
    });
  }

  // get demand plans
  getDemandPlans() {
    let demandName = "";
    this.demandPlanValue = "";
    this.busy = this.hotbookservice.getDemandPlans(demandName)
      .subscribe(
        (res: any) => {
          this.demandPlansList = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // close modal for demand plans
  submitCandidates() {
    this.addCandidateToDemandPlanobject.candidateid = this.candidateidArray;
    this.addCandidateToDemandPlanobject.demandplanid = this.demandPlanValue;
    this.addCandidateToDemandPlanobject.approved = null;
    this.addCandidateToDemandPlanobject.rejected = null;

    this.busy = this.hotbookservice.AddCandidatesInDemandPlan(this.addCandidateToDemandPlanobject)
      .subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)['response'];
          let responseMsg = JSON.parse(res._body)["message"];
          if (response) {
            this._success.next("Success!");
            setTimeout(() => {
              this._success.next("");
              this.closebutton.nativeElement.click();
              this.demandPlanValue = "";
              this.candidateidArray = [];
              this.enableActions = false;
              this.getCandidatesByHotbookSelected(0, this.currentHotbookID);
            }, 3000);
          } else {
            this._failure.next(responseMsg);
            setTimeout(() => {
              this._failure.next("");
              this.closebutton.nativeElement.click();
              this.demandPlanValue = "";
              this.candidateidArray = [];
              this.enableActions = false;
              this.getCandidatesByHotbookSelected(0, this.currentHotbookID);
            }, 3000);
          }

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  openDeleteModal(tagid, isSharedHotbook?) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "overrides",
    };

    const modalRef = this._modalService.open(
      HotbookActionPopupComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.tagId = tagid;
    modalRef.componentInstance.sharedHotBook = isSharedHotbook
      ? isSharedHotbook
      : false;
    modalRef.result.then((result) => {
      if (result) {
        this.getMyHotbooksList();
      }
    });
  }

  openShareModal(tagid) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      //  scrollable: true,
      windowClass: "overrides",
    };

    const modalRef = this._modalService.open(
      HotbookActionPopupComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.tagId = tagid;
    modalRef.componentInstance.isShared = this.isActionShared;
  }

  openEditModal(tagid) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      //  scrollable: true,
      windowClass: "overrides",
    };

    const modalRef = this._modalService.open(
      AddHotbookFolderComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.tagId = tagid;
    modalRef.componentInstance.isEdit = this.isActionShared;
    modalRef.result.then((result) => {
      debugger;
      this.getMyHotbooksList();
    });
  }

  getMyHotbooksList() {
    this.hotbooks = [];
    if (this.hotbooks.length <= 0) {
      this.showSpinner = true;
    }
    this.hotbookservice.getMyHotbooksList(this.tagType).subscribe((res) => {
      debugger;
      let response = JSON.parse(res._body)["response"];
      this.hotbooks = response;
      if (this.hotbooks.length >= 0) {
        this.showSpinner = false;
      }
    });
  }

  getCandidatesByHotbookSelected(pageIndex?, hotbookid?) {
    this.showLoader = true;
    this.errormesg = false;

    var hotbooksReq = {
      tagid: hotbookid,
      pageindex: pageIndex,
      pagesize: this.pagesize,
    };
    if (this.isactiveFocus) {
      hotbooksReq["activefocus"] = this.isactiveFocus;
    }
    if (this.ispassiveFocus) {
      hotbooksReq["passivefocus"] = this.ispassiveFocus;
    }
    if (this.querystring) {
      hotbooksReq["query"] = this.querystring;
    }
    this.busy = this.hotbookservice
      .getCandidatesByHotbookId(hotbooksReq)
      .subscribe(
        (res: any) => {
          debugger;
          this.candidatesList = null;
          let response = JSON.parse(res._body)["response"];
          if (response) {
            this.candidatesList = response ? response["hotbookcandidates"] : [];
            this.totalRecords = response ? response["totalprofilesfound"] : [];
            this.showLoader = false;
          } else {
            this.showLoader = false;
            this.errormesg = true;
          }
        },
        (err) => {
          console.log(err);
          this.showLoader = false;
        },
        () => { }
      );
  }

  personalClicked(e) {
    this.tagType =
      this.isPersonal && this.isShared
        ? "Both"
        : this.isShared
          ? "Shared"
          : "Personal";

    this.candidatesList = [];
    this.selectedhotbook = { id: null, name: null };
    this.getMyHotbooksList();
  }

  sharedClicked(e) {
    this.tagType =
      this.isPersonal && this.isShared
        ? "Both"
        : this.isShared
          ? "Shared"
          : "Personal";
    this.candidatesList = [];
    this.selectedhotbook = { id: null, name: null };
    this.getMyHotbooksList();
  }

  OnHotbookSelected(id, name, activeCount, passiveCount) {
    this.selectedNotContactedItems = null;
    //  debugger;
    this.candidatesList = [];
    this.totalRecords = [];
    let pageIndex = 1;
    this.activeFocusCount = 0;
    this.passiveFocusCount = 0;
    let tagid = parseInt(id);
    this.tagid = tagid;
    this.currentTagID = this.tagid;
    this.currentHotbookID = this.tagid;
    this.getCandidatesByHotbookSelected(pageIndex, tagid);
    this.selectedhotbook.id = id;
    this.selectedhotbook.name = name;
    this.activeFocusCount = activeCount;
    this.passiveFocusCount = passiveCount;
    this.pageTrackHotbook(id);
  }

  pageTrackHotbook(hotbookID) {
    let payload = {
      pagename: "HotBook",
      actionname: null,
      objecttype: null,
      objectid: hotbookID,
    };
    this.busy = this.hotbookservice.pageTracker(payload).subscribe(
      (res: any) => {
        this.pageTrackerResp = JSON.parse(res._body)["response"];
      },
      (err) => {

      }
    );
  }

  onPageChanged(pageIndex) {
      this.getCandidatesByHotbookSelected(pageIndex, this.currentTagID);
  }

  showHotbookPopup() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      //  scrollable: true,
      windowClass: "overrides",
    };
    const modalRef = this._modalService.open(
      AddHotbookFolderComponent,
      ngbModalOptions
    );
    modalRef.result.then((result) => {
      this.getMyHotbooksList();
    });
  }

  searchInHotbook() {
    this.hotbookservice
      .searchInHotbook(this.tagType, this.searchText)
      .subscribe((res) => {
        let response = JSON.parse(res._body)["response"];
        this.hotbooks = response;
      });
  }

  activeClicked(e) {
    this.isactiveFocus = e.target.checked;
    this.candidatesList = [];
    this.getCandidatesByHotbookSelected(0, this.tagid);
  }

  passiveClicked(e) {
    this.ispassiveFocus = e.target.checked;
    this.candidatesList = [];
    this.getCandidatesByHotbookSelected(0, this.tagid);
  }

  onNotContactedClicked(days) {
    this.showLoader = true;
    this.errormesg = false;
    let notContactedPayload = {
      tagid: 0,
      query: "",
      activefocus: false,
      passivefocus: false,
      pageindex: 0,
      pagesize: 0,
      datefilter: 0,
    };
    notContactedPayload.tagid = this.tagid;
    notContactedPayload.pageindex = this.pageindex;
    notContactedPayload.pagesize = this.pagesize;
    notContactedPayload.datefilter = +days;
    if (this.isactiveFocus) {
      notContactedPayload.activefocus = this.isactiveFocus;
    }
    if (this.ispassiveFocus) {
      notContactedPayload.passivefocus = this.ispassiveFocus;
    }
    if (this.querystring) {
      notContactedPayload.query = this.querystring;
    }

    this.busy = this.hotbookservice
      .getCandidatesByHotbookId(notContactedPayload)
      .subscribe(
        (res: any) => {
          debugger;
          this.candidatesList = null;
          let response = JSON.parse(res._body)["response"];
          if (response) {
            this.candidatesList = response ? response["hotbookcandidates"] : [];
            this.showLoader = false;
          } else {
            this.showLoader = false;
            this.errormesg = true;
          }
        },
        (err) => {
          console.log(err);
          this.showLoader = false;
        },
        () => { }
      );
  }

  searchCandidates() {
    this.candidatesList = [];
    this.getCandidatesByHotbookSelected(0, this.tagid);
  }

  onActionClicked(event) {
    switch (event.actiontype) {
      default:
        break;
    }
  }

  showCandidateResume(id) { }

   deleteCandidateProfiles() {

     let deleteObj = {
       "candidateid": this.candidateidArray,
       "tagid": this.tagid,
       "deleted": true
     }
     this.busy = this.hotbookservice.deleteCandidateProfilesfromHotbook(deleteObj).subscribe(
       (res: any) => {
         let response = JSON.parse(res._body)["response"];
         this.getCandidatesByHotbookSelected(0, this.tagid);


       },
       (err) => {

       }
     );
   }
  actionchecked(event) {
    // debugger;
  //  if (this.current_user_role != 3 && this.current_user_role != 4) {
      if (event.isChecked) {
        this.candidateidArray.push(event.candidateid);
        // console.log("This candidate ID", this.candidateidArray);
      } else {
        const index = this.candidateidArray.indexOf(event.candidateid);
        if (index > -1) {
          this.candidateidArray.splice(index, 1);
        }
      }
      if (this.candidateidArray.length > 0) {
         this.enableActions = true;
       } else {
        this.enableActions = false;
       }
  //  }
  //  else {
   //   this.candidateidArray = [];
   // }
  }

   openPopup(closePopup?: boolean) {

     this.modalRef = this._modalService.open(this.content, this.ngbModalOptions);

     this.modalRef.result.then((result) => {

       if (result === 'Close click') {

       }
     }, (reason) => {
       if (reason === ModalDismissReasons.ESC ||
         reason === ModalDismissReasons.BACKDROP_CLICK) {

       }
     });


   }
}
