import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InitiateWorkflowService } from '../initiate-workflow/initiate-workflow.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-initiate-workflow.component',
  templateUrl: './initiate-workflow.component.html',
  styleUrls: ['./initiate-workflow.component.scss'],
  providers: [InitiateWorkflowService]

})
export class InitiateWorkflowComponent implements OnInit {

  @Input() candidateid;
  requisitionId: number;
  vForm: FormGroup;
  commentLengthRem = 3000;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;
  businessunit: string;

  RequestObj = {
    businessunit: "",
    comments: "",
    requisitionid: "",
    candidateid: "",
    isworkflowinitiated: false,
    employeecode: ""
  }

  workflowUrl: string;

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private initiateWorkflowService: InitiateWorkflowService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    this.initiateWorkflowForm();
  }

  initiateWorkflowForm() {
    this.vForm = this.fb.group({
      employeeId: ['', null],
      comments: ['', [Validators.required, Validators.maxLength(3000)]],
      businessUnit: ['', Validators.required]
    });
  }

  onRadioSelected(event) {    
    if (this.vForm.value.businessUnit == '2') {
      this.businessunit = 'cognixia';
      this.vForm.controls['employeeId'].setValidators([Validators.required]);
    } else {
      this.businessunit = 'collabera';
      this.vForm.controls['employeeId'].setValidators(null);
    }
    this.vForm.controls['employeeId'].updateValueAndValidity();
  }

  maxLength(event: any) {
    this.commentLengthRem = 3000 - event.target.textLength;
  }

  onBackSpace(event: any) {
    this.commentLengthRem = 3000 - event.target.textLength;
  }

  createRequestBody() {
    this.RequestObj.businessunit = this.businessunit;
    this.RequestObj.comments = this.vForm.value.comments;
    this.RequestObj.requisitionid = this.requisitionId.toString();
    this.RequestObj.candidateid = this.candidateid;
    this.RequestObj.isworkflowinitiated = true;
    this.RequestObj.employeecode = this.vForm.value.employeeId;
  }

  onSubmit() {
    if (this.vForm.valid) {
      this.createRequestBody();
      this.initiateWorkflowService
        .postInitiateWorkflow(this.candidateid, this.requisitionId, this.RequestObj, this.businessunit)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            let body = JSON.parse(response._body);
            if (body.response) {
              this.workflowUrl = body.response.workflowurl;
              window.open(this.workflowUrl, "_blank");
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Workflow Initiated successfully";
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
