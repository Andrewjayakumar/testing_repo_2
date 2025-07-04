import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RejectCandidateService } from '../reject-candidate/reject-candidate.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reject-candidate.component',
  templateUrl: './reject-candidate.component.html',
  styleUrls: ['./reject-candidate.component.scss'],
  providers: [RejectCandidateService]

})
export class RejectCandidateComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;

  @Input() candidateid;
  @Input() candidateStatus;
  typeid: number;
  type: string;
  requisitionId: number;
  public model = {
    "isRejected":false
  }
  rejectcategory: any;
  categoryid: any;
  rejectedReasons: any;
  vForm: FormGroup;
  rejectedCategory: string;
  rejectedReason: number;
  commentLengthRem = 4000;
  title: string;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;
  badDeliveryType: string;
  incorrectWorkflowStatus: string;
  hideIncorrectWorkflow: boolean;
  isIWLoading = true;

  RequestObj = {
    wishtoreject: false,
    categoryid: 0,
    rejectreasonid: 0,
    comments: "",
    requisitionid: "",
    candidateid: "",
    offerdeclined: 0,
    type: 0
  }

  BadDeliveryReqObj = {
    baddeliverytype: "",
    rejectreasonid: 0,
    comments: "",
    categoryid: null,
    requisitionid: "",
    candidateid: "",
    ishire: 1,
    offerdeclined: 1,
    wishtoreject: true
  }

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private RejectCandidateService: RejectCandidateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    this.getIncorrectWorkflowStatus();
    this.model['isRejected'] = false;
    this.rejectCandidateForm();
    this.setTypeValue();
    this.getrejectCategory();
  }

  setTypeValue() {
    console.log('candidate status: ' + this.candidateStatus);
    if (this.candidateStatus == 'In Process') {
      this.typeid = 1;
      this.type = 'submission';
      this.title = 'Reject Candidate';
      this.vForm.controls['rejectedcategory'].setValidators([Validators.required]);
      this.vForm.controls['rejectedreason'].setValidators([Validators.required]);
    }
    else if (this.candidateStatus == 'Interview') {
      this.typeid = 2;
      this.type = 'interview';
      this.title = 'Reject Candidate - Interview';
      this.model.isRejected = true;
      this.vForm.controls['rejectedcategory'].setValidators([Validators.required]);
      this.vForm.controls['rejectedreason'].setValidators([Validators.required]);
    }
    else if (this.candidateStatus == 'Hired') {
      this.typeid = 3;
      this.type = 'hired';
      this.title = 'Reject Candidate - Bad Delivery';
    }
    this.vForm.controls['rejectedcategory'].updateValueAndValidity();
    this.vForm.controls['rejectedreason'].updateValueAndValidity();
  }

  rejectCandidateForm() {
    this.vForm = this.fb.group({
      comments: ['', [Validators.required, Validators.maxLength(4000)]],
      rejectedcategory: ['', null],
      rejectedreason: ['', null],
      badDeliveryType: ['']
    });
  }

  getIncorrectWorkflowStatus() {
    this.RejectCandidateService.getIncorrectWorkflowStatus(this.candidateid, this.requisitionId).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)) {
          this.isIWLoading = false;
          this.incorrectWorkflowStatus = JSON.parse(res._body).response.status;
          if (this.incorrectWorkflowStatus == 'Hide') {
            this.hideIncorrectWorkflow = true;
          }
        }
      }
    );
  }

  getrejectCategory() {
    this.RejectCandidateService.getrejectCategory(this.typeid).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)['response']) {
          this.rejectcategory = JSON.parse(res._body)['response']['rejectcategory'];
        }
      }
    )
  }

  getrejectedReasons() {
    this.RejectCandidateService.getrejectedReasons(this.categoryid, this.type).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)['response']) {
          this.rejectedReasons = JSON.parse(res._body)['response']['rejectreason'];

        }

      }
    )
  }

  getBadDeliveryReasons() {
    this.RejectCandidateService.getBadDeliveryReason(this.categoryid).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)['response']) {
          this.rejectedReasons = JSON.parse(res._body)['response']['baddeliveryreason'];
        }
      }
    );
  }

  getCategoryID(event) {
    if (event.categoryid) {
      this.rejectedReason = null;
      this.categoryid = event.categoryid;
      if (this.typeid == 1 || this.typeid == 2) {
        this.getrejectedReasons();
      }
      else {
        this.getBadDeliveryReasons();
      }
    }
  }

  OnrejectedToggled(toggeled) {
    if (toggeled) {
      this.model.isRejected = true;

    } else {
      this.model.isRejected = false;

    }
  }

  onRadioSelected(event) {
    if (this.vForm.value.badDeliveryType == '1') {
      this.badDeliveryType = 'client';
      this.vForm.controls['rejectedcategory'].setValidators(null);
      this.vForm.controls['rejectedreason'].setValidators([Validators.required]);
      this.categoryid = 4;
      this.type = 'client';
      this.getrejectedReasons();
    }
    else if (this.vForm.value.badDeliveryType == '2') {
      this.badDeliveryType = 'ascendion';
      this.vForm.controls['rejectedcategory'].setValidators([Validators.required]);
      this.vForm.controls['rejectedreason'].setValidators([Validators.required]);
    }
    else if (this.vForm.value.badDeliveryType == '3') {
      this.badDeliveryType = 'incorrectworkflow';
      this.vForm.controls['rejectedcategory'].setValidators(null);
      this.vForm.controls['rejectedreason'].setValidators(null);
    }
    this.vForm.controls['rejectedcategory'].updateValueAndValidity();
    this.vForm.controls['rejectedreason'].updateValueAndValidity();
  }

  maxLength(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  onBackSpace(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  createRequestBody() {
    this.RequestObj.wishtoreject = this.model.isRejected;
    this.RequestObj.categoryid = this.categoryid;
    this.RequestObj.rejectreasonid = this.rejectedReason;
    this.RequestObj.comments = this.vForm.value.comments;
    this.RequestObj.requisitionid = this.requisitionId.toString();
    this.RequestObj.candidateid = this.candidateid;
    this.RequestObj.offerdeclined = 0;
    this.RequestObj.type = this.typeid;
  }

  createBadDeliveryRequestBody() {
    this.BadDeliveryReqObj.baddeliverytype = this.badDeliveryType;
    this.BadDeliveryReqObj.rejectreasonid = this.rejectedReason;
    this.BadDeliveryReqObj.comments = this.vForm.value.comments;
    this.BadDeliveryReqObj.categoryid = this.categoryid;
    this.BadDeliveryReqObj.requisitionid = this.requisitionId.toString();
    this.BadDeliveryReqObj.candidateid = this.candidateid;
  }

  onSubmit() {
    if (this.vForm.valid) {
      let reqBody;
      if (this.typeid == 1 || this.typeid == 2) {
        this.createRequestBody();
        reqBody = this.RequestObj;
      }
      else {
        this.createBadDeliveryRequestBody();
        reqBody = this.BadDeliveryReqObj;
      }
      this.RejectCandidateService
        .postRejectCandidate(this.candidateid, this.requisitionId, reqBody)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            const body = JSON.parse(response._body);
            if (body.response) {
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Candidate rejected successfully";
              setTimeout(() => {
                this.displayMessage = "";
                this.modal.close("success");
              }, 3000);
            }
            else {
              this.errorMessage = body.message ? body.message : "";
              this.isUploading = false;
              setTimeout(() => {
                this.errorMessage = "";
              }, 3000);
            }
          }
        }
      );
    }
  }
}
