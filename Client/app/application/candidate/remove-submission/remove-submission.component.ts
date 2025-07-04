import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RemoveSubmissionService } from '../remove-submission/remove-submission.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-remove-submission.component',
  templateUrl: './remove-submission.component.html',
  styleUrls: ['./remove-submission.component.scss'],
  providers: [RemoveSubmissionService]

})
export class RemoveSubmissionComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;

  @Input() candidateid;
  
  requisitionId: number;
  vForm: FormGroup;
  commentLengthRem = 4000;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private RemoveSubmissionService: RemoveSubmissionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    this.removeSubmissionForm();
  }

  removeSubmissionForm() {
    this.vForm = this.fb.group({
      comments: ['', [Validators.required, Validators.maxLength(4000)]],
    });
  }

  maxLength(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  onBackSpace(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  createRequestBody() {
    const requestbody: {
      candidateid: number,
      requisitionid: number,
      cancelledreason: string
    } = {
      candidateid: this.candidateid,
      requisitionid: this.requisitionId,
      cancelledreason: this.vForm.value.comments
    };
    return requestbody;
  }

  onSubmit() {
    if (this.vForm.valid) {
      const requestBody = this.createRequestBody();
      this.isUploading = true;
      this.RemoveSubmissionService
        .postRemoveSubmission(this.candidateid, this.requisitionId, requestBody)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            const resParsed = JSON.parse(response._body);
            let body = JSON.parse(response._body);
            if (body.response) {
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Submission removed successfully";
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
