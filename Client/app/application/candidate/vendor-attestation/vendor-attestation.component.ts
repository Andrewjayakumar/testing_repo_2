import { Component, OnInit, Input} from '@angular/core';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { VendorAttestationService } from '../vendor-attestation/vendor-attestation.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';

@Component({
  selector: 'app-vendor-attestation.component',
  templateUrl: './vendor-attestation.component.html',
  styleUrls: ['./vendor-attestation.component.scss'],
  providers: [VendorAttestationService]
})
export class VendorAttestationComponent implements OnInit {

  @Input() candidateid;
  requisitionId: number;
  subtierDetails: any;
  vForm: FormGroup;
  commentLengthRem = 3000;
  attestedResumeURL: string;
  currentRole: number;
  current_user_obj: any;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;

  requestBody = {
    candidateId: 0,
    requisitionId: 0,
    subtierName: "",
    authorizedRepresentative: "",
    federalId:"",
    subtierEmailId:"",
    attestedResumeURL: null,
    bypass: false,
    bypassreason:"",
    subtiername:"",
    authorizedrepresentative:"",
    federalid:"",
    subtieremailid:"",
    currentrole: 0
  };

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private vendorAttestationService: VendorAttestationService,
    private route: ActivatedRoute,
    private localStorage: LocalStoreManager
  ){
        this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }
  

  ngOnInit(){

    this.current_user_obj = this.localStorage.getData('current_user');
    this.currentRole = this.current_user_obj.activerole;

    this.getSubtierDetail();
    this.vendorAttestationForm();
  }

  public model = {
    "isbypass": false,
  };

 getSubtierDetail(){
    this.vendorAttestationService
    .getSubtierDetails(this.candidateid, this.requisitionId)
    .subscribe((response) => {
      if (JSON.parse(response._body)['response']) {
        this.subtierDetails = JSON.parse(response._body)['response'];
        this.attestedResumeURL = this.subtierDetails.attestedResumeURL;
      }
      
    },
    error => {}
    );
  }

  vendorAttestationForm(){
    this.vForm = this.fb.group({
      bypassComment: ['', null],
      subtierName: ['', Validators.required],
      representative: ['', Validators.required],
      federalId: ['', Validators.required],
      subtierEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onBypassValueChange(event){
    if (event === true) {
      this.vForm.controls['bypassComment'].setValidators([Validators.required, Validators.maxLength(3000)]);
    }
    else {
      this.vForm.controls['bypassComment'].setValidators(null);
    }
  }

  maxLength(event: any) {
    this.commentLengthRem = 3000 - event.target.textLength;
  }

  onBackSpace(event: any) {
    this.commentLengthRem = 3000 - event.target.textLength;
  }

  createRequestBody(){
    this.requestBody.candidateId = this.subtierDetails['candidateId'];
    this.requestBody.requisitionId = this.subtierDetails.requisitionId;
    this.requestBody.subtierName = this.subtierDetails.subtierName;
    this.requestBody.authorizedRepresentative = this.subtierDetails.authorizedRepresentative;
    this.requestBody.federalId = this.subtierDetails.federalId;
    this.requestBody.subtierEmailId = this.subtierDetails.subtierEmailId;
    this.requestBody.attestedResumeURL = this.subtierDetails.attestedResumeURL;
    this.requestBody.bypass = this.model.isbypass;
    this.requestBody.bypassreason = this.vForm.value.bypassComment;
    this.requestBody.subtiername = this.vForm.value.subtierName;
    this.requestBody.authorizedrepresentative = this.vForm.value.representative;
    this.requestBody.federalid = this.vForm.value.federalId;
    this.requestBody.subtieremailid = this.vForm.value.subtierEmail;
    this.requestBody.currentrole = this.currentRole;
  }

  createBypassRequest(){
    this.createRequestBody();
    this.isUploading = true;
    this.vendorAttestationService
    .postVendorBypassRequest(this.candidateid, this.requisitionId, this.vForm.value.bypassComment, this.requestBody)
    .subscribe((response) => {
      if (JSON.parse(response._body)) {
        let body = JSON.parse(response._body);
        if (body.response) {
          this.isUploading = false;
          this.displayMessage = "Bypass request created successfully";
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
    });
  }

  onSubmit() {
    console.log(this.vForm.valid);
    if (this.vForm.valid) {
      this.createRequestBody();
      this.isUploading = true;
      this.vendorAttestationService
        .postCreateVendorAttestaton(this.candidateid, this.requisitionId, this.requestBody)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            let body = JSON.parse(response._body);
            if (body.response) {
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Vendor attestation created successfully";
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
