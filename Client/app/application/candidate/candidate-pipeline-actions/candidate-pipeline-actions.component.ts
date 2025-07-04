import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RejectCandidateComponent } from '../reject-candidate/reject-candidate.component';
import { ViewScAndTypeComponent } from '../view-sc-and-type/view-sc-and-type.component';
import { VendorAttestationComponent } from '../vendor-attestation/vendor-attestation.component';
import { CandidateAttestationComponent } from '../candidate-attestation/candidate-attestation.component';
import { RemoveSubmissionComponent } from '../remove-submission/remove-submission.component';
import { AuthService } from "../../../core/authservice/auth.service";
import { UUID } from "angular2-uuid";
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatesubmissionComponent } from '../../../forms/candidatesubmission/candidatesubmission.component';
import { UploadRecordingComponent } from '../../requisitions/upload-recording/upload-recording.component';
import { HireCandidateComponent } from '../hire-candidate/hire-candidate.component';
import { SubmitToClientActionComponent } from '../submit-to-client-action/submit-to-client-action.component';
import { FormatResumeComponent } from '../../../forms/format-resume/format-resume.component';
import { InitiateWorkflowComponent } from '../initiate-workflow/initiate-workflow.component';



@Component({
  selector: 'app-pipeline-card.component',
  templateUrl: './candidate-pipeline-actions.component.html',
  styleUrls: ['./candidate-pipeline-actions.component.scss']
})
export class CandidatePipelineActionsComponent implements OnInit {

  @Input() public candidateid;
  @Input() public fullname;
  @Input() public candidate;
  @Input() public position;
  @Input() public cardDisplayRight;
  @Input() public candDiv;
  @Input() requisitionDetails;
  @Output() actionCompleted: EventEmitter<string> = new EventEmitter<string>();

  requisitionId: number;
  candidateStatus: string;
  isInitiateWorkflow: boolean;
  reqTypeSet1: string[] = ['Process', 'Project', 'Replacement', 'Qualified Process', 'Passthrough', 'Payrolling', 'Direct', 'Replacement Direct'];
  reqTypeSet2: string[] = ['Process', 'Qualified Process', 'Passthrough', 'Payrolling', 'Direct'];

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private _authservice: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    this.candidateStatus = this.candidate.candidatestatus;
    if (this.requisitionDetails) {
      if ((this.requisitionDetails.clientrtr == 'Standard' ||
        this.requisitionDetails.clientrtr == null ||
        this.requisitionDetails.clientrtr == 'Specific') &&
        (!this.requisitionDetails.isresumefield)) {

        this.isInitiateWorkflow = this.reqTypeSet1.includes(this.requisitionDetails.requisitiontype);
      }
      else {
        this.isInitiateWorkflow = this.reqTypeSet2.includes(this.requisitionDetails.requisitiontype);
      }
    }
  }

  refreshCandidateList() {
    this.actionCompleted.emit('');
  }

  pinClicked() {

    var candidatePinning = {
      "id": UUID.UUID(),
      "url": "apps/candidateprofile",
      "title": this.fullname,
      "subtitle": "",
      "icon": "user-o",
      "params": [
        { "name": "candidateid", "id": UUID.UUID(), "value": this.candidateid },

      ],
      "openinpopup": true,
      "popupparams": { value: this.candidateid, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
    };
    this.pinClickedHandler(candidatePinning);
    this.modal.close(true);

  }

  rejectedClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'linkedinpopup'
    };
    let modalRef = this._modalService.open(RejectCandidateComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;
    modalRef.componentInstance.candidateStatus = this.candidateStatus;

    modalRef.result.then(
      (result) => {
        this.refreshCandidateList();
      },
      (reason) => {
        this.refreshCandidateList();
      }
    );
    this.modal.close(true);
  }

  vendorAttestationClicked(){
    this.modal.close(true);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'coPopup'
    };
    let modalRef = this._modalService.open(VendorAttestationComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;
  }

  viewSCandTypeClicked(){
  this.modal.close(true);
  let ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    size: 'lg',
    windowClass: 'coPopup'
  };
  let modalRef = this._modalService.open(ViewScAndTypeComponent, ngbModalOptions);
  modalRef.componentInstance.candidateid = this.candidateid;
}

AttestationClicked(){
  this.modal.close(true);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'coPopup'
    };
    let modalRef = this._modalService.open(CandidateAttestationComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;
}

  removeSubmissionClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'linkedinpopup'
    };
    let modalRef = this._modalService.open(RemoveSubmissionComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;

    modalRef.result.then(
      (result) => {
        this.refreshCandidateList();
      },
      (reason) => {
        this.refreshCandidateList();
      }
    );
    this.modal.close(true);
  }

  SubmitClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'coPopup'
    };
    let modalRef = this._modalService.open(CandidatesubmissionComponent, ngbModalOptions);
    modalRef.componentInstance.candId = this.candidateid;

    modalRef.result.then(
      (result) => {
        this.refreshCandidateList();
      }
    );
    this.modal.close(true);
  }

  attachTechRecClicked() {
    this.modal.close(true);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'attachTechRecPopup'
    };
    let modalRef = this._modalService.open(UploadRecordingComponent, ngbModalOptions);
    modalRef.componentInstance.candId = this.candidateid;
  }

  hireCandidateClicked() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'linkedinpopup'
    };
    let modalRef = this._modalService.open(HireCandidateComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;
    modalRef.componentInstance.candidateStatus = this.candidateStatus;

    modalRef.result.then(
      (result) => {
        this.refreshCandidateList();
      },
      (reason) => {
        this.refreshCandidateList();
      }
    );
    this.modal.close(true);
  }

  SubmitToClientClicked() {
    this.modal.close(true);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'linkedinpopup'
    };
    let modalRef = this._modalService.open(SubmitToClientActionComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;
    modalRef.componentInstance.candidateStatus = this.candidateStatus;
  }

  FormattedResumeClicked() {
    this.modal.close(true);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'formattedresumepopup'
    };
    let modalRef = this._modalService.open(FormatResumeComponent, ngbModalOptions);
    modalRef.componentInstance.candId = this.candidateid;
  }

  InterviewClicked() {
    this.modal.close(true);
    this.router.navigateByUrl('/apps/interview?candidateid=' + this.candidateid + '&id=' + this.requisitionId + '&reqid=' + this.requisitionId);
  }

  InitiateWorkflowClicked() {
    this.modal.close(true);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'linkedinpopup'
    };
    let modalRef = this._modalService.open(InitiateWorkflowComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidateid;
  }

  public pinClickedHandler(pinObject: any) {

    if (pinObject && pinObject.params) {
      let primaryKey = pinObject.params[0].name;
      let primaryKeyValue = pinObject.params[0].value;
      if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
        this._authservice.AddtoBookmark(pinObject);
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
}
