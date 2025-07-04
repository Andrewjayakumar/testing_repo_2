import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HireCandidateService } from '../hire-candidate/hire-candidate.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-hire-candidate.component',
  templateUrl: './hire-candidate.component.html',
  styleUrls: ['./hire-candidate.component.scss'],
  providers: [HireCandidateService]

})
export class HireCandidateComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;

  @Input() candidateid;
  @Input() candidateStatus;
  requisitionId: number;
  public model = {
    "ishire": false
  }
  vForm: FormGroup;
  commentLengthRem = 4000;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;

  RequestObj = {
    ishire: false,
    comments: "",
    requisitionid: "",
    candidateid: ""
  }

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private HireCandidateService: HireCandidateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    this.model['ishire'] = true;
    this.hireCandidateForm();
  }

  hireCandidateForm() {
    this.vForm = this.fb.group({
      comments: ['', null]
    });
  }

  OnrejectedToggled(toggeled) {
    if (toggeled) {
      this.model.ishire = true;
      this.vForm.controls['comments'].setValidators([Validators.required, Validators.maxLength(4000)]);

    } else {
      this.model.ishire = false;
    }
  }

  maxLength(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  onBackSpace(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  createRequestBody() {
    this.RequestObj.ishire = this.model.ishire;
    this.RequestObj.comments = this.vForm.value.comments;
    this.RequestObj.requisitionid = this.requisitionId.toString();
    this.RequestObj.candidateid = this.candidateid;
  }

  onSubmit() {
    if (this.vForm.valid) {
      this.createRequestBody();
      this.HireCandidateService
        .postHireCandidate(this.candidateid, this.requisitionId, this.RequestObj)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            let body = JSON.parse(response._body);
            if (body.response) {
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Candidate hired successfully";
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
