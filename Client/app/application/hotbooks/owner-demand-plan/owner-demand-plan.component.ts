import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnChanges, SimpleChanges} from "@angular/core";
import { SlicePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { HotBooksService } from "../hotbooks.service";
import {
  NgbModal,
  NgbModalOptions,
  NgbTooltip,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { AddDemandPlanComponent } from "../add-demand-plan/add-demand-plan.component";

@Component({
  selector: "app-owner-demand-plan",
  templateUrl: "./owner-demand-plan.component.html",
  styleUrls: ["./owner-demand-plan.component.scss"],
})
export class OwnerDemandPlanComponent implements OnInit{
  busy: Subscription;
    @ViewChild('content') content: TemplateRef<any>;

  demandPlans = [];
  selectedDemandplan = { id: null, name: null };
  pageindex = 1;
  pagesize = 20;
 // searchText;

  querystring: any;
  errormesg = false;
  pagename: string = "DM_DemandPlanning";
  showLoader: boolean = false;
  demandplanActiveCandidates: any;
  loaderforcandidates: boolean = false;
  pendingCandidates: any[] = null;
  totalnumberofrecords: number;
  selectedCandidates: any[];
    totalnumberofpendingrecords: number;

    currentActiveTab = 'candidates';
    public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
    confirmModal: any;
  demandPlanName: any;
  pendingCandidatesCountfromSelectedDp:number;
  constructor(
    private hotbookservice: HotBooksService,
    public _modalService: NgbModal
  ) {
      this.selectedCandidates = [];
  }

  ngOnInit() {
    this.hotbookservice.trackActivityPageOpened({
      pagename: "DM_DemandPlanning",
    });
    this.getDemandPlansList();
  }

  getDemandPlansList() {
    this.demandPlans = [];
    if (this.demandPlans.length <= 0) {
      this.showLoader = true;
    }
    this.hotbookservice.getDemandPlansList().subscribe((res) => {
     // debugger;
      let response = JSON.parse(res._body)["response"];
        this.demandPlans = response;
      
        if (this.demandPlans.length >= 0) {

          this.showLoader = false;
          this.selectedDemandplan.id = this.demandPlans[0].demandid;
          this.selectedDemandplan.name = this.demandPlans[0].demandname;
          this.pendingCandidatesCountfromSelectedDp = this.demandPlans[0].pendingcount;
          this.LoadApprovedCandidates();
      }
    });
  }
  showDemandPlanPopup() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "overrides",
    };
    const modalRef = this._modalService.open(
      AddDemandPlanComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.mode = 'add';

    modalRef.result.then((result) => {
      this.getDemandPlansList();
    });
  }

  // searchInDemandPlans() {
  //   this.hotbookservice
  //     .searchInHotbook(this.tagType, this.searchText)
  //     .subscribe((res) => {
  //       let response = JSON.parse(res._body)["response"];
  //       this.demandPlans = response;
  //     });
  // }

  getActiveCandidates(currentDemandPlan) {
    this.loaderforcandidates = true;

    if (currentDemandPlan.demandname) {
      this.demandPlanName = currentDemandPlan.demandname;
    }
    if (currentDemandPlan.pendingcount || currentDemandPlan.pendingcount == 0) {
      this.pendingCandidatesCountfromSelectedDp = currentDemandPlan.pendingcount;
    } 
    this.pendingCandidates = [];
    this.currentActiveTab = 'candidates';


    var obj = {
        "demandid": currentDemandPlan.demandid,
      //  "query": "",
        "pageindex": this.pageindex,
        "pagesize": this.pagesize,
        "pendingapproval": false
    }
    this.hotbookservice.getActiveCandidatesDemandPlan(obj).subscribe((res) => {
        if (JSON.parse(res._body)["response"]) {
            let response = JSON.parse(res._body)["response"];
            this.demandplanActiveCandidates = response['demandplancandidates'];
            this.totalnumberofrecords = response['totalprofilesfound'];
            this.loaderforcandidates = false;

}
      else {
        this.demandplanActiveCandidates = null;
        this.loaderforcandidates = false;
        this.totalnumberofrecords = 0;
        this.pendingCandidates = [];

      }
     
    });
  }

    LoadApprovedCandidates() {
        this.pageindex = 1;
        //change tab to first tab
        this.currentActiveTab = 'candidates';
        this.getActiveCandidates({ "demandid": this.selectedDemandplan.id });
    }

    LoadPendingCandidates() {
        this.pendingCandidates = [];
      this.selectedCandidates = [];
      console.log("Pending", this.pendingCandidates);
        // reset selected candidates here only so as to capture selected candidates across pagination
        this.pageindex = 1
        let demandid = this.selectedDemandplan.id;
      this.getPendingCandidates(demandid);
      debugger;
    }

    getPendingCandidates(demandid) {
        this.loaderforcandidates = true;
        this.currentActiveTab = 'pending';
 
        var reqObj = {
            "demandid": demandid,
            "pageindex": this.pageindex,
            "pagesize": this.pagesize,
            "pendingapproval": true
        }

        this.hotbookservice.getActiveCandidatesDemandPlan(reqObj).subscribe(
            (res) => {
                if (JSON.parse(res._body)["response"]) {
                    let response = JSON.parse(res._body)["response"];
                    this.pendingCandidates = response['demandplancandidates'];
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
        this.pageindex = event;
        let demandid = this.selectedDemandplan.id;
        this.getPendingCandidates(demandid);
    }

    onActiveCandidatesPageChanged(event) {
        this.pageindex = event;
        this.getActiveCandidates({ "demandid": this.selectedDemandplan.id });
    }

/** capture canddiateids of selected candidates**/
    
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

    approveCandidate() {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };

        let reqObj = {
            "candidateid": this.selectedCandidates,
            "demandplanid": this.selectedDemandplan.id,
            "approved": true

        }
        this.popupConfig.title = "Alert !";
        this.popupConfig.message = `Are you sure you want to approve ${this.selectedCandidates.length} candidates ?`;
        this.popupConfig.type = "";
        this.popupConfig.isConfirm = true;
        this.popupConfig.negativebtnText = "No";
        this.popupConfig.positivebtnText = "Yes";

        this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

        this.confirmModal.result.then((result) => {

            debugger;
            if (result !== 'cross' && result !== 'cancel') {

            }
        }, (approvereason) => {
            debugger;
                if (approvereason !== 'cross' && approvereason !== 'cancel') {

                this.busy = this.hotbookservice.approveOrRejectCandidatesinDemandPlan(reqObj).subscribe(
                    (res: any) => {
                        let response = JSON.parse(res._body)["response"];
                        if (response) {
                          this.LoadApprovedCandidates();
                          this.getDemandPlansList(); // to reflect the number on left side max count

                        }
                    },
                    (err) => {
                        console.error("Error in Approving Candidates in Demandplan");
                    }
                );
            }

        });
    }

    rejectCandidate() {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };

        this.popupConfig.title = "Alert !";
        this.popupConfig.message = `Are you sure to reject ${this.selectedCandidates.length} candidates ?`;
        this.popupConfig.type = "";
        this.popupConfig.isConfirm = true;
        this.popupConfig.negativebtnText = "No";
        this.popupConfig.positivebtnText = "Yes"; 

        let reqObj = {
            "candidateid": this.selectedCandidates,
            "demandplanid": this.selectedDemandplan.id,
            "rejected": true

        }


         this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

        this.confirmModal.result.then((result) => {

            debugger;
            if (result !== 'cross' && result !== 'cancel') {

                this.busy = this.hotbookservice.approveOrRejectCandidatesinDemandPlan(reqObj).subscribe(
                    (res: any) => {
                        let response = JSON.parse(res._body)["response"];
                        if (response) {
                            this.LoadApprovedCandidates();
                        }
                    },
                    (err) => {
                        console.error("Error in Rejecting Candidates in Demandplan");
                    }
                );
            }
        }, (rejectreason) => {
                debugger;
                if (rejectreason !== 'cross' && rejectreason !== 'cancel') {

                    this.busy = this.hotbookservice.approveOrRejectCandidatesinDemandPlan(reqObj).subscribe(
                        (res: any) => {
                            let response = JSON.parse(res._body)["response"];
                            if (response) {
                                this.LoadApprovedCandidates();
                            }
                        },
                        (err) => {
                            console.error("Error in Rejecting Candidates in Demandplan");
                        }
                    );
                }
        
        });
    }


  deleteOrCloseDemandPlan(value) {
   // event.preventDefault();

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
   let reqObj = {
      "demandid": this.selectedDemandplan.id
    }
    if (value == 'deleted') {
      reqObj['dpaction'] = 3;
      this.popupConfig.message = `Are you sure you want to Delete this Demand Plan ?`;

    } else {
      reqObj['dpaction'] = 2;
      this.popupConfig.message = `Are you sure you want to Close this Demand Plan ?`;


    }
   

    this.popupConfig.title = "Alert !";
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Yes";

    this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

    this.confirmModal.result.then((result) => {

      debugger;
      if (result !== 'cross' && result !== 'cancel') {

      }
    }, (approvereason) => {
      debugger;
      if (approvereason !== 'cross' && approvereason !== 'cancel') {

        this.busy = this.hotbookservice.deleteDemandPlan(reqObj).subscribe(
          (res: any) => {
            let response = JSON.parse(res._body)["response"];
            if (response) {
              this.getDemandPlansList();
            }
          },
          (err) => {
            console.error("Error in Deleting the Demand Plan!!");
          }
        );
      }

    });
  }

  editDemandPlan(event, demadpid) {
    event.preventDefault();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "overrides",
    };
    const modalRef = this._modalService.open(
      AddDemandPlanComponent,
      ngbModalOptions
    );
    if (demadpid) {
      modalRef.componentInstance.id = demadpid;
      modalRef.componentInstance.mode = 'edit';


    }
    modalRef.result.then((result) => {
      this.getDemandPlansList();
    });
  }

  removeCandidatesFromDP(value) {
    // event.preventDefault();

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    let candidateObj = {
      "demandid": this.selectedDemandplan.id,
      "candidateid": this.selectedCandidates,
      "deleted":true
    }

    this.popupConfig.title = "Alert !";
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Yes";
    this.popupConfig.message = `Are you sure you want to remove profiles from this Demand Plan ?`;


    this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

    this.confirmModal.result.then((result) => {

      debugger;
      if (result !== 'cross' && result !== 'cancel') {

      }
    }, (approvereason) => {
      debugger;
      if (approvereason !== 'cross' && approvereason !== 'cancel') {

        this.busy = this.hotbookservice.removeCandidatesFromDP(candidateObj).subscribe(
          (res: any) => {
            let response = JSON.parse(res._body)["response"];
            if (response) {
              this.getDemandPlansList();
            }
          },
          (err) => {
            console.error("Error in Deleting the Demand Plan!!");
          }
        );
      }

    });
  }

}
