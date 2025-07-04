import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { HotBooksService } from "../../hotbooks/hotbooks.service";
import { AuthService } from "../../../core/authservice/auth.service";
import {
  NgbModal,
  NgbModalOptions,
  NgbTooltip,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MyRequisitionsService } from ".././my-requisitions/my-requisitions.service";
import { LocalStoreManager } from "../../../core/authservice/local-store-manager.service";
import { ReqSummaryComponent } from "../my-requisitions/req-summary/req-summary.component";
import { ReqAssignmentComponent } from "../my-requisitions/req-assignment/req-assignment.component";
import { ReqQualificationComponent } from "../my-requisitions/req-qualification/req-qualification.component";
import { CandidateMatchingFilterComponent } from "../candidate-matching-filter/candidate-matching-filter.component";
import { MatchReasonComponent } from '../../jobboardsearch/match-reason/match-reason.component';
import { JobboardsearchService } from '../../jobboardsearch/jobboardsearch.service';
// import { AddHotbookFolderComponent } from "../add-hotbook-folder/add-hotbook-folder.component";
// import { HotbookActionPopupComponent } from "../hotbook-action-popup/hotbook-action-popup.component";
declare var $: any;

@Component({
  selector: "app-candidate-matching",
  templateUrl: "./candidate-matching.component.html",
    styleUrls: ["./candidate-matching.component.scss"],
    providers: [HotBooksService, AuthService, MyRequisitionsService, JobboardsearchService],
})
export class CandidateMatchingComponent implements OnInit {
  busy: Subscription;
  listofHotbooks = [];
  hotbooks = [];
  sharedhotbooks = [];
  candidatesList = [];
  selectedhotbook = { id: null, name: null };
  showLoader: boolean = false;
  PinArray = [];
  isPersonal: boolean = true;
  isShared: boolean;
  tagType: string = "Personal";
  pageindex = 1;
  pagesize = 20;
  searchText;
  isactiveFocus: boolean;
  ispassiveFocus: boolean;
  tagid: any;
  querystring: any;
  errormesg = false;
  activeFocusCount = 0;
  passiveFocusCount = 0;
  isActionShared: boolean = true;
  pagename: string = "hotbooks";
  candidateidArray = [];
  showSpinner: boolean = false;
  selectedNotContactedItems: any = null;
  candidateID: any;
  candidateSearch = {
    candidateid: 0,
    pageindex: 0,
    pagesize: 0,
    jobtitles: [],
    country: "",
    cities: [],
    ismanual: true,
    requisitiontypeid: 0,
    agebydays: 0,
    zipcodes: [],
    distance: 0,
    qualificationid: [],
    skills: [],
    isremote: false,
    isunattended: false,
    skilltype: 1,
    state:[],
    minbillrate: 0,
    maxbillrate: 0,
    currencytype: ""
  };
  current_user_role: any = 8;
  totalRecords;
  successMessage: any;
  successMessageHide = false;
  assignmentErrorMessage;
  noRecordMsg: string = null;
  filterObjectdd: any;
  candidateName;
  reqResponse;
  reqMessage;
  candidateTitle: any;
  pageTrackerResp: any;
  isCandidateMatchLink: boolean = true;
  role: number;

  filterData = {
    allReqTypes: 0,
    ageByDays: 0,
    jobtitles: [],
    skills: [],
    country: "",
    cities: [],
    zipcodes: [],
    distance: 0,
    qualification: [],
    remote: false,
    unattendedReq: false,
    state :[],
    minBill: 0.01,
    maxBill: 0,
    selectedCurrency: "",
  };

  showNotifyBadge: boolean = false;

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private recservice: MyRequisitionsService,
    private fb: FormBuilder,
    private hotbookservice: HotBooksService,
    private _authservice: AuthService,
      public _modalService: NgbModal,
      private jobboardsearchService: JobboardsearchService,
    private localStorage: LocalStoreManager
  ) {
    this.currentRoute.queryParams.subscribe((params) => {
     
      this.candidateID = parseInt(params["candidateid"]);

      if(isNaN(this.candidateID) || this.candidateID == null || this.candidateID == undefined) {
       
        this.candidateID = sessionStorage.getItem("currentCandidateID");
      }
    });


    let current_user = this.localStorage.getData("current_user");
    this.current_user_role = current_user.activerole;
  }

  ngOnInit() {
    this.getCandidateName();
    this.getMatchingReq();
    this.pageTrackCandidateMatch();
    this.role = +sessionStorage.getItem("selectedrole");
  }

  getCandidateName() {
    this.recservice
      .getCandidateTitle(this.candidateID)
      .subscribe((res: any) => {
        let candiResponse = JSON.parse(res._body)["response"];
        this.candidateTitle = candiResponse[0].fullname;
      });
  }

  getMatchingReq() {
    this.showSpinner = true;
    this.candidateSearch.candidateid = this.candidateID;
    this.candidateSearch.pageindex = this.pageindex;
    this.candidateSearch.pagesize = this.pagesize;

    if (!this.candidateSearch.jobtitles  || this.candidateSearch.jobtitles.length < 1) {
      this.candidateSearch.jobtitles = [];
    }
    if ( !this.candidateSearch.skills  || this.candidateSearch.skills.length < 1) {
      this.candidateSearch.skills = [];
    }
    if (!this.candidateSearch.cities||  this.candidateSearch.cities.length < 1) {
      this.candidateSearch.cities = [];
    }
    if (!this.candidateSearch.qualificationid ||  this.candidateSearch.qualificationid.length < 1) {
      this.candidateSearch.qualificationid = [];
    }
    if (!this.candidateSearch.zipcodes || this.candidateSearch.zipcodes.length < 1) {
      this.candidateSearch.zipcodes = [];
    }

    this.candidatesList = [];
    this.recservice
      .getMatchingReqs(this.candidateSearch)
      .subscribe((res) => {
      
        this.reqResponse = JSON.parse(res._body)["response"];
        this.reqMessage = JSON.parse(res._body)["message"];
        this.candidateName = this.reqResponse.candidatename;
        this.candidatesList = this.reqResponse.results;
        this.totalRecords = this.reqResponse.totalrecord;
        this.showSpinner = false;
      });
  }

  pageTrackCandidateMatch() {
    let payload = {
      pagename: "CandidateOverViewMatch",
      actionname: null,
      objecttype: null,
      objectid: this.candidateID,
    };
    this.recservice.pageTracker(payload).subscribe((res: any) => {
      this.pageTrackerResp = JSON.parse(res._body)["response"];
    });
  }

  onPageChanged(event) {
    // debugger;
    this.pageindex = event;
    this.getMatchingReq();
  }

  showCandidateResume(id) {}

  onActionClicked(event) {
    //event.type= hyperlink, clone, reqsummary
    switch (event.actiontype) {
      case "hyperlink":
        this.redirectToRecPage(event.id, event.matchLink);
        break;
      case "quickview":
        this.showSummaryPopup(event.id);
        break;
      case "assign":
        this.showAssignpopup(event.id);
        break;
      case "qualification":
        this.showQualification(event.id);
            break;
        case "candidatescore":
            this.showCandidateScorepopup(event);
            break;
      default:
        break;
    }
  }
   
  redirectToRecPage(id: any, matchLink: boolean) {
    let urlRoute = "/apps/recoverview";
    let url = urlRoute + "?requisitionid=" + id;
    if (this.candidateID && id) {
      debugger;
      sessionStorage.setItem("currentCandidateID", this.candidateID);

      let reqObj = {
        "requisitionid": id,
        "objectreferenceid": this.candidateID,
        "pagename":"CandidateMatch"
      }
      this.busy = this.recservice
        .trackActivityrecIsOpened(reqObj)
        .subscribe(
          (res: any) => {
            //  debugger;
            let response = JSON.parse(res._body)["response"];
            if (response) {
            }

          },
          (err) => {

          }
        );
    }
 

    // this.router.navigateByUrl(url);

     // this.router.navigateByUrl(url);

    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree([urlRoute + "?requisitionid=" + id])
    // );
  
    // window.open(url, '_blank');

    if(matchLink) {
      this.router.navigate([]).then(result => {  window.open( url, '_blank'); });
    } else {
      this.router.navigateByUrl(url);
    }



  }

  showSummaryPopup(id: any) {
    if (this.candidateID && id) {
      let reqObj = {
        "requisitionid": id,
        "objectreferenceid": this.candidateID,
        "pagename": "ResumeQuickView-QV"
      }
      this.busy = this.recservice
        .trackActivityrecIsOpened(reqObj)
        .subscribe(
          (res: any) => {
            //  debugger;
            let response = JSON.parse(res._body)["response"];
            if (response) {
            }

          },
          (err) => {

          }
        );
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      //  scrollable: true,
      windowClass: "overrides",
    };
    const modalRef = this._modalService.open(
      ReqSummaryComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.id = id;
  }

  showAssignpopup(requisitionObj: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      //  scrollable: true,
      windowClass: "overrides",
    };
    const modalRef = this._modalService.open(
      ReqAssignmentComponent,
      ngbModalOptions
    );
    modalRef.result.then(
      (result) => {
        if (result == "ok") {
          this.successMessage = "Requisition assigned successfully!";
          this.successMessageHide = true;
          this.getMyTeamRequisitions(1, this.pagesize, {});
          setTimeout(() => {
            this.successMessageHide = false;
            this.successMessage = "";
          }, 5000);
        } else {
          if (result && result != true) {
            this.assignmentErrorMessage = result;
            window.scroll(0, 0);
            setTimeout(() => {
              this.assignmentErrorMessage = "";
            }, 10000);
          }
        }
      },
      (reason) => {}
    );
    $("ngb-modal-backdrop").addClass("modal-background");
    if (requisitionObj) {
      modalRef.componentInstance.id = requisitionObj.requisitionid;
      modalRef.componentInstance.recruiter = requisitionObj.assignedto;
    }
  }

  getMyTeamRequisitions(pageIndex?, size?, filterOptions?) {
    if (!size) size = this.pagesize;
    this.noRecordMsg = null;
    if (filterOptions) {
      this.filterObjectdd = filterOptions;
    }

    this.filterObjectdd["pageindex"] = pageIndex;
    this.filterObjectdd["pagesize"] = size;

    this.busy = this.recservice
      .getMyTeamRequisitions(this.filterObjectdd)
      .subscribe(
        (res: any) => {
          //  debugger;
          let response = JSON.parse(res._body)["response"];
          //JSON.parse(res._body)['response'];
          if (response) {
            this.candidatesList = response.results;
          }
          if (response && response.totalrecord) {
            this.totalRecords = response.totalrecord;
          } else {
            this.noRecordMsg = "No Requisitions Found !! ";
            this.totalRecords = 0;
            this.candidatesList = [];
          }
        },
        (err) => {
          this.noRecordMsg = "No Requisitions Found !! ";
          this.totalRecords = 0;
        }
      );
  }

  showQualification(id: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      //  scrollable: true,
      windowClass: "overrides",
    };
    const modalRef = this._modalService.open(
      ReqQualificationComponent,
      ngbModalOptions
    );
    //  window.scrollTo(0,1000);
    modalRef.componentInstance.id = id;
  }

  actionchecked(event) {
    if (event.isChecked) {
      this.candidateidArray.push(event.requisitionid);
    } else {
      const index = this.candidateidArray.indexOf(event.requisitionid);
      if (index > -1) {
        this.candidateidArray.splice(index, 1);
      }
    }
  }

  // source the candidates
  sourceCandidates() {
    let apiparam: any = {
      requisitionid: this.candidateidArray,
      candidateid: this.candidateID,
      sourcefrom: "CandidateMatch",
    };

  
    this.busy = this.recservice
      .sourceRequisitions(apiparam)
      .subscribe(
        (res: any) => {
          //debugger;
          let sourceReqsResp = JSON.parse(res._body)["response"];
          if (sourceReqsResp) {
            this.candidateidArray = [];
            this.getMatchingReq();
            this.successMessage = "Sourced successfully!";
            this.successMessageHide = true;
            setTimeout(() => {
              this.successMessageHide = false;
              this.successMessage = "";
            }, 5000);
          } else {
            this.assignmentErrorMessage =
              "Something went wrong! Please try again";
            setTimeout(() => {
              this.assignmentErrorMessage = "";
            }, 10000);
          }
        },
        (err) => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  goToHome() {
    if(this.role == 3){
      this.router.navigateByUrl("/apps/dddashboard");
    } else if(this.role == 4) {
      this.router.navigateByUrl("/apps/dmdashboard");
    } else {
      this.router.navigateByUrl("/apps/dashboardrecruiternew");
    }
  }

  openFilters() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "overrides",
    };

    const modalRef = this._modalService.open(
      CandidateMatchingFilterComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.filters = this.filterData;
    modalRef.result.then((result) => {
      if (result) {
        this.candidateSearch.requisitiontypeid = result.allReqTypes;
        this.candidateSearch.agebydays = result.ageByDays;
        this.candidateSearch.jobtitles = result.jobtitles;
        this.candidateSearch.skills = result.skills;
        this.candidateSearch.country = result.country;
        this.candidateSearch.cities = result.cities;
        this.candidateSearch.zipcodes = result.zipcodes;
        this.candidateSearch.distance = result.distance;
        this.candidateSearch.qualificationid = result.qualification;
        this.candidateSearch.isremote = result.remote;
        this.candidateSearch.isunattended = result.unattendedReq;
        this.candidateSearch.state = result.state;
        this.candidateSearch.minbillrate = result.minBill;
        this.candidateSearch.maxbillrate = result.maxBill;
        this.candidateSearch.currencytype = result.selectedCurrency;


        this.filterData.allReqTypes = result.allReqTypes;
        this.filterData.ageByDays = result.ageByDays;
        this.filterData.jobtitles = result.jobtitles;
        this.filterData.skills = result.skills;
        this.filterData.country = result.country;
        this.filterData.cities = result.cities;
        this.filterData.zipcodes = result.zipcodes;
        this.filterData.distance = result.distance;
        this.filterData.qualification = result.qualification;
        this.filterData.remote = result.remote;
        this.filterData.unattendedReq = result.unattendedReq;
        this.filterData.state = result.state;
        this.filterData.minBill = result.minBill;
        this.filterData.maxBill = result.maxBill;
        this.filterData.selectedCurrency = result.selectedCurrency;

        if (this.candidateSearch.requisitiontypeid || this.candidateSearch.jobtitles.length > 0  || this.candidateSearch.skills.length > 0 || this.candidateSearch.cities.length > 0 || this.candidateSearch.country != "" || (this.candidateSearch.agebydays) || this.candidateSearch.zipcodes.length > 0 || this.candidateSearch.distance || this.candidateSearch.isremote || this.candidateSearch.qualificationid.length > 0 || this.candidateSearch.currencytype == "USD" || this.candidateSearch.currencytype == "CAD" || this.candidateSearch.isunattended) {
          this.showNotifyBadge = true;
          this.candidateSearch.ismanual = true;
        } else {
          this.showNotifyBadge = false;
          this.candidateSearch.ismanual = false;
        }
      }
    });
  }

    showCandidateScorepopup(event) {
       
            let ngbModalOptions: NgbModalOptions = {
                backdrop: "static",
                keyboard: true,
                size: "lg",
                windowClass: "overrides",
            };

        const modalRef = this._modalService.open(MatchReasonComponent, ngbModalOptions);
        modalRef.componentInstance.candidateId = this.candidateID;
        modalRef.componentInstance.candidateFullName = this.candidateTitle;
        modalRef.componentInstance.requisitionId = event.requisition ? event.requisition.requisitionid : null;
        modalRef.componentInstance.candidateMatching = true;
        modalRef.componentInstance.reqName = event.requisition? event.requisition.requisitionname : 'NA';
       // modalRef.componentInstance.reqDescription = null;

        

    }
}
