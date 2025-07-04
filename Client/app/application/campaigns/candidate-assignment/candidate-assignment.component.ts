


import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnChanges, SimpleChanges} from "@angular/core";
import { SlicePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { CampaignsService } from "../campaigns.service";
import { Observable, ObservableInput } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import {
  filter,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
  debounceTime,
  concat,
  map,
} from "rxjs/operators";
import {
    NgbModal,
   // NgbActiveModal,
  NgbModalOptions,
  NgbTooltip,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-candidate-assignment',
  templateUrl: './candidate-assignment.component.html',
  styleUrls: ['./candidate-assignment.component.scss']
})
export class CandidateAssignmentComponent implements OnInit{
  busy: Subscription;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('content2') content2: TemplateRef<any>;
  @ViewChild('content3') content3: TemplateRef<any>;

  recruiters = [];
  selectedRecruiter = { id: null, name: null };
  activePageindex = 1;
  pendingPageindex = 1;
  pagesize = 20;
  
  searchText: any;
 recruiterdetails: Observable<any>;
 public recruiterinput$ = new Subject<string | null>();
 isRecruiterLoading = false;

  querystring: any;
  errormesg = false;
  pagename: string = "DM_DemandPlanning";
  showLoader: boolean = false;
  showRecruitersList: boolean = true;
  assignedCandidates: any;
  loaderforcandidates: boolean = false;
  pendingCandidates: any[] = null;
  totalnumberofrecords: number;
  selectedCandidates: any[];
  totalnumberofpendingrecords: number;
  recruiterClear: any;
  reassignRecruiter: any;

    currentActiveTab = 'assign';
    public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
    confirmModal: any;
    recruitername: any;
  pendingCandidatesCountfromSelectedDp:number;
  constructor(
    private campaignservice: CampaignsService,
    public _modalService: NgbModal
  ) {
      this.selectedCandidates = [];
      this.initializeTypeAheads();
  }

  ngOnInit() {
    // this.hotbookservice.trackActivityPageOpened({
    //   pagename: "DM_DemandPlanning",
    // });
    this.getRecruitersList();
  }

    // initialize type heads for search
    initializeTypeAheads() {
      this.recruiterdetails = this.recruiterinput$.pipe(
        filter((t) => t && t.length > 1),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => this.searchRecruiter("", term))
      );
    }

      // get Recruiter based on search
  searchRecruiter(clientid: any, name: any): ObservableInput<any> {
    clientid = "";
    if (!name) return of([]);
    this.isRecruiterLoading = true;
    return this.campaignservice.getRecruiter(clientid, name).pipe(
      map((res: any) => {
        this.isRecruiterLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })
    );
  }

    getRecruitersList() {
    this.recruiters = [];
    let recruiterId = "";
    if (this.recruiters.length <= 0) {
      this.showLoader = true;
    }
    this.campaignservice.getRecruitersList(recruiterId).subscribe((res) => {
      let response = JSON.parse(res._body)["response"];
        this.recruiters = response;
      
        if (this.recruiters.length >= 0) {

          this.showLoader = false;
          this.selectedRecruiter.id = this.recruiters[0].recruiterid;
          this.selectedRecruiter.name = this.recruiters[0].recruitername;
          // this.pendingCandidatesCountfromSelectedDp = this.recruiters[0].pendingcount;
          this.LoadPendingCandidates();
      }
    });
  }

  deleteRecruiter(recruiter) {
    let delObj = {
      "recruiterid": recruiter.recruiterid
    }
    this.campaignservice.deleteRecruiter(delObj).subscribe((res) => {
      let response = JSON.parse(res._body)["response"];
      this.getRecruitersList();
    });
  }

  FindRecruiters() {
    if(this.searchText && this.searchText.length >= 1) {
      this.recruiters = [];
      let recruiterId = this.searchText;
      if (this.recruiters.length <= 0) {
        this.showLoader = true;
      }
      this.campaignservice.getRecruitersList(recruiterId).subscribe((res) => {
        let response = JSON.parse(res._body)["response"];
          this.recruiters = response;
        
          if (this.recruiters.length >= 0) {
  
            this.showLoader = false;
            this.selectedRecruiter.id = this.recruiters[0].recruiterid;
            this.selectedRecruiter.name = this.recruiters[0].recruitername;
            // this.pendingCandidatesCountfromSelectedDp = this.recruiters[0].pendingcount;
            // this.LoadApprovedCandidates();
        }
      });
    } else if(!this.searchText || this.searchText.length == 0){
      this.getRecruitersList();
    }
  }

  clearText() {
    this.searchText = null;
    this.getRecruitersList();
  }

  getAssignedCandidates(currentRecruiter) {
    this.loaderforcandidates = true;

    if (currentRecruiter.recruitername) {
      this.recruitername = currentRecruiter.recruitername;
    }
    // one line commented here
    this.pendingCandidates = [];
    this.currentActiveTab = 'assign';


    var obj = {
        "pageindex": this.activePageindex,
        "pagesize": this.pagesize,
        "searchcategory": "Assign",
        "recruiterid": currentRecruiter.recruiterid
    }
    this.campaignservice.getActiveAndPendingCandidates(obj).subscribe((res) => {
        if (JSON.parse(res._body)["response"]) {
            let response = JSON.parse(res._body)["response"];
            this.assignedCandidates = response['metalcandidates'];
            this.totalnumberofrecords = response['totalprofilesfound'];
            this.loaderforcandidates = false;

}
      else {
        this.assignedCandidates = null;
        this.loaderforcandidates = false;
        this.totalnumberofrecords = 0;
        this.pendingCandidates = [];

      }
     
    });
  }

    LoadApprovedCandidates() {
      this.showRecruitersList = true;
        this.activePageindex = 1;
        this.selectedCandidates = [];
        //change tab to first tab
        this.currentActiveTab = 'assign';
        this.getAssignedCandidates({ "recruiterid": this.selectedRecruiter.id });
    }

    LoadPendingCandidates() {
        this.showRecruitersList = false;
        this.pendingCandidates = [];
        this.selectedCandidates = [];

        // reset selected candidates here only so as to capture selected candidates across pagination
        this.pendingPageindex = 1
        let recruiterid = this.selectedRecruiter.id;
      this.getPendingCandidates(recruiterid);
      debugger;
    }

    getPendingCandidates(recruiterid) {
        this.loaderforcandidates = true;
        this.currentActiveTab = 'pending';
 
        var reqObj = {
            "pageindex": this.pendingPageindex,
            "pagesize": this.pagesize,
            "searchcategory": "Pending",
            "recruiterid": recruiterid
        }

        this.campaignservice.getActiveAndPendingCandidates(reqObj).subscribe(
            (res) => {
                if (JSON.parse(res._body)["response"]) {
                    let response = JSON.parse(res._body)["response"];
                    this.pendingCandidates = response['metalcandidates'];
                    this.pendingCandidatesCountfromSelectedDp = response['totalprofilesfound'];
                    this.loaderforcandidates = false; 
            }
            else {
                this.pendingCandidates = null;
                this.loaderforcandidates = false;
                this.pendingCandidatesCountfromSelectedDp = 0;
            }
            },
            () => { this.loaderforcandidates = false; }
        );
    }

    onPendingApprovalPageChanged(event) {
        this.pendingPageindex = event;
        let recruiterid = this.selectedRecruiter.id;
        this.getPendingCandidates(recruiterid);
    }

    onActiveCandidatesPageChanged(event) {
        this.activePageindex = event;
        this.getAssignedCandidates({ "recruiterid": this.selectedRecruiter.id });
    }

/** capture candidateids of selected candidates**/
    
    onCandidateSelected(event) {
    if (event.isChecked) {
      this.selectedCandidates.push(event.candidateid);
    } else {
        const index = this.selectedCandidates.indexOf(event.candidateid);
      if (index > -1) {
          this.selectedCandidates.splice(index, 1);
      }
    }
  }

    assignCandidate() {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };

        this.popupConfig.title = "Assign Candidates";
        this.popupConfig.type = "";
        this.popupConfig.isConfirm = true;
        this.popupConfig.negativebtnText = "Cancel";
        this.popupConfig.positivebtnText = "Ok";

        this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

        this.confirmModal.result.then((result) => {

            debugger;
            if (result !== 'cross' && result !== 'cancel') {

            }
        }, (approvereason) => {
            debugger;
                if (approvereason !== 'cross' && approvereason !== 'cancel') {

                  let reqObj = {
                    "candidateid": this.selectedCandidates,
                    "assignto": this.recruiterClear,
                    "assignaction": "Assign"
                }

                this.busy = this.campaignservice.assigneOrReassignOrDeleteCandidates(reqObj).subscribe(
                    (res: any) => {
                        let response = JSON.parse(res._body)["response"];
                        if (response) {
                          this.selectedCandidates = [];
                          this.getRecruitersList(); // to reflect the number on left side max count
                          this.LoadApprovedCandidates();

                        }
                    },
                    (err) => {
                        console.error("Error in Approving Candidates in Demandplan");
                    }
                );
            }

        });
    }

    reassignCandidates() {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };

        this.popupConfig.title = "Reassign Candidates";
        this.popupConfig.type = "";
        this.popupConfig.isConfirm = true;
        this.popupConfig.negativebtnText = "Cancel";
        this.popupConfig.positivebtnText = "Ok"; 

        this.confirmModal = this._modalService.open(this.content2, ngbModalOptions);

        this.confirmModal.result.then((result) => {

            debugger;
            if (result !== 'cross' && result !== 'cancel') {

              let reqObj = {
                "candidateid": this.selectedCandidates,
                "assignto": this.reassignRecruiter,
                "assignaction": "ReAssign"
            }

                this.busy = this.campaignservice.assigneOrReassignOrDeleteCandidates(reqObj).subscribe(
                    (res: any) => {
                        let response = JSON.parse(res._body)["response"];
                        if (response) {
                          this.selectedCandidates = [];
                          this.getRecruitersList(); // to reflect the number on left side max count
                            this.LoadApprovedCandidates();
                          
                        }
                    },
                    (err) => {
                        console.error("Error in Reassigning Candidates");
                    }
                );
            }
        }, (rejectreason) => {
                debugger;
                if (rejectreason !== 'cross' && rejectreason !== 'cancel') {

                  let reqObj = {
                    "candidateid": this.selectedCandidates,
                    "assignto": this.reassignRecruiter,
                    "assignaction": "ReAssign"
                }

                    this.busy = this.campaignservice.assigneOrReassignOrDeleteCandidates(reqObj).subscribe(
                        (res: any) => {
                            let response = JSON.parse(res._body)["response"];
                            if (response) {
                              this.selectedCandidates = [];
                              this.getRecruitersList(); // to reflect the number on left side max count
                                this.LoadApprovedCandidates();
                            }
                        },
                        (err) => {
                            console.error("Error in Reassigning Candidates");
                        }
                    );
                }
        
        });
    }


  removeCandidates(value) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };


    this.popupConfig.title = "Remove Candidates";
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Yes";
    this.popupConfig.message = `Are you sure to remove ${this.selectedCandidates.length} candidates ?`;


    this.confirmModal = this._modalService.open(this.content3, ngbModalOptions);

    this.confirmModal.result.then((result) => {

      debugger;
      if (result !== 'cross' && result !== 'cancel') {

      }
    }, (approvereason) => {
      debugger;
      if (approvereason !== 'cross' && approvereason !== 'cancel') {

        let candidateObj = {
          "candidateid": this.selectedCandidates,
          "assignto": " ",
          "assignaction": "Delete"
        }

        this.busy = this.campaignservice.assigneOrReassignOrDeleteCandidates(candidateObj).subscribe(
          (res: any) => {
            let response = JSON.parse(res._body)["response"];
            if (response) {
              this.selectedCandidates = [];
              this.getRecruitersList();
              this.LoadApprovedCandidates();
            }
          },
          (err) => {
            console.error("Error in removing candidates!!");
          }
        );
      }

    });
  }

}
