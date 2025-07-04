import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from "../../interview/interview.service";


@Component({
  selector: 'app-submit-to-client-action.component',
  templateUrl: './submit-to-client-action.component.html',
  styleUrls: ['./submit-to-client-action.component.scss'],
  providers: [InterviewService]

})
export class SubmitToClientActionComponent implements OnInit {

  @Input() candidateid;
  @Input() candidateStatus;
  requisitionId: number;
  public model = {
    "isSubmitToClient": false
  }
  vForm: FormGroup;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;

  RequestObj = {
    candidateid: null,
    requisitionid: null
  }

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private interviewService: InterviewService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    this.model['isSubmitToClient'] = true;
    this.submitToClientForm();
  }

  submitToClientForm() {
    this.vForm = this.fb.group({
    });
  }

  OnSubmitToClientToggled(toggled) {
    if (toggled) {
      this.model.isSubmitToClient = true;
    } else {
      this.model.isSubmitToClient = false;
    }
  }

  createRequestBody() {
    this.RequestObj.requisitionid = this.requisitionId.toString();
    this.RequestObj.candidateid = this.candidateid;
  }

  onSubmit() {
    if (this.vForm.valid && this.model.isSubmitToClient) {
      this.createRequestBody();
      this.interviewService
        .postSubmitToClient(this.RequestObj)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            let body = JSON.parse(response._body);
            if (body.response) {
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Candidate submitted to client successfully";
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
