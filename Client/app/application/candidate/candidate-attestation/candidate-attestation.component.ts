import { ChangeDetectionStrategy, Component, DoCheck, ElementRef, Input, OnChanges, EventEmitter, OnInit, Output, SimpleChanges, ViewChild, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CandidateAttestationService } from '../candidate-attestation/candidate-attestation.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { Observable, ObservableInput } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { Subject } from "rxjs";
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-attestation.component',
  templateUrl: './candidate-attestation.component.html',
  styleUrls: ['./candidate-attestation.component.scss'],
  providers: [CandidateAttestationService]
})
export class CandidateAttestationComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;
  public zipcodeList$: Observable<any>;
  public zipcodeinput$ = new Subject<string | null>();

  @Input() candidateid;
  requisitionId: number;
  vForm: FormGroup;
  commentLengthRem = 4000;
  payRateUnits: any;
  payRateUnitType: string;
  cityList: any;
  state: any;
  currentRole: number;
  current_user_obj: any;
  candidateReq: any;
  displayMessage = "";
  errorMessage = "";
  isUploading = false;

  candidateReqObj = {
    candidateid: 0,
    requisitionid: 0,
    firstname: "",
    lastname: "",
    middlename: "",
    fullname: "",
    emailid: "",
    requisitionname: "",
    recname: "",
    clientid: "",
    clientname: "",
    billrate: 0,
    billratetype: "",
    jobtitle: "",
    jobtitleid: 0,
    region: "",
    zipcode: "",
    hiringmanagername: null,
    city: null,
    state: null,
    statecode: null,
    attestationlinkstatus: "",
    ismultipleattestation: false,
    bypassCheck: false,
    bypassreason: "",
    selectmultiple: false,
    additionalrequisitionid: [],
    payrateoffered: null,
    payrateunittypeid: null,
    candidateemptype: null,
    uvid: "",
    currentrole: 0
  };

  constructor(
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private candidateAttestationService: CandidateAttestationService,
    private route: ActivatedRoute,
    private localStorage: LocalStoreManager
  ){
        this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
        this.initializetypeheads();
  }

  ngOnInit(){

    this.current_user_obj = this.localStorage.getData('current_user');
    this.currentRole = this.current_user_obj.activerole;

    this.getCandidateReq();
    this.candidateAttestationForm();
    this.getPayRateUnitTypes();
  }

  public model = {
    "isbypass": false,
  };


  candidateAttestationForm(){
    this.vForm = this.fb.group({
      bypassComment: ['', null],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      reqNameId: ['', Validators.required],
      jobTitle: ['', Validators.required],
      clientName: ['', Validators.required],
      payRateOffered: [''],
      payRateUnit: [''],
      zipcode: [''],
      city: [''],
      state: ['']
    });
  }

  getCandidateReq(){
    this.candidateAttestationService
    .getCandidateReqDetails(this.candidateid, this.requisitionId)
    .subscribe((response) => {
      if (JSON.parse(response._body)['response']) {
        this.candidateReq = JSON.parse(response._body)['response'];
        this.candidateReqObj.firstname = this.candidateReq.firstname;
        this.candidateReqObj.lastname = this.candidateReq.lastname;
        this.candidateReqObj.middlename = this.candidateReq.middlename;
        this.candidateReqObj.fullname = this.candidateReq.fullname;
        this.candidateReqObj.emailid = this.candidateReq.emailid;
        this.candidateReqObj.requisitionname = this.candidateReq.requisitionname;
        this.candidateReqObj.recname = this.candidateReq.recname;
        this.candidateReqObj.clientid = this.candidateReq.clientid;
        this.candidateReqObj.clientname = this.candidateReq.clientname;
        //this.candidateReqObj.currentresume = this.candidateReq.currentresume;
        this.candidateReqObj.billrate = this.candidateReq.billrate;
        this.candidateReqObj.billratetype = this.candidateReq.billratetype;
        this.payRateUnitType = this.toTitleCase(this.candidateReqObj.billratetype);
        this.candidateReqObj.jobtitle = this.candidateReq.jobtitle;
        this.candidateReqObj.jobtitleid = this.candidateReq.jobtitleid;
        this.candidateReqObj.region = this.candidateReq.region;
        this.candidateReqObj.zipcode = this.candidateReq.zipcode;
        this.candidateReqObj.hiringmanagername = this.candidateReq.hiringmanagername;
        this.candidateReqObj.city = this.candidateReq.city;
        this.candidateReqObj.state = this.candidateReq.state;
        this.candidateReqObj.statecode = this.candidateReq.statecode;
        this.candidateReqObj.attestationlinkstatus = this.candidateReq.attestationlinkstatus;
        this.candidateReqObj.ismultipleattestation = this.candidateReq.ismultipleattestation;
      }      
    },
    error => {}
    );
  }

  getPayRateUnitTypes(){
    this.candidateAttestationService
    .getPayRateUnitType()
    .subscribe((response) => {
      if (JSON.parse(response._body)['response']) {
        this.payRateUnits = JSON.parse(response._body)['response'].payrateunittypes;
      }
    },
    error => {}
    );
    
  }

  searchZipcodes(text: string): Observable<any[]> {
    if (!text)
      return of([]);
    return this.candidateAttestationService.getZipCodes(text).pipe(
      map((res) => {
        let resP = JSON.parse(res._body);
        return resP.response.zipcodes ? resP.response.zipcodes : [];
      })
    );
  }

   initializetypeheads() {
    this.zipcodeList$ = this.zipcodeinput$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((text) => this.searchZipcodes(text))
    );
  }

  getCityListFromZipCode(){
     this.candidateAttestationService
    .getCityListFromZipCode(this.candidateReqObj.zipcode)
    .subscribe((response) => {
      if (JSON.parse(response._body)['response']) {
        this.cityList = JSON.parse(response._body)['response'];
      }
    });
  }

  onBypassValueChange(event){
    if (event === true) {
      this.vForm.controls['bypassComment'].setValidators([Validators.required, Validators.maxLength(4000)]);
    }
    else {
      this.vForm.controls['bypassComment'].setValidators(null);
    }
  }

  maxLength(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  onBackSpace(event: any) {
    this.commentLengthRem = 4000 - event.target.textLength;
  }

  createBypassRequestBody(){
    const bypassRequestbody: {
      candidateid: number,
      requisitionid: number,
      bypassreason: string
    } = {
      candidateid: this.candidateid,
      requisitionid: this.requisitionId,
      bypassreason: this.vForm.value.bypassComment
    };
    return bypassRequestbody;
  }

  createBypassRequest() {
    if (this.vForm.controls['bypassComment'].valid) {
      const bypassRequestbody = this.createBypassRequestBody();
      this.isUploading = true;
      this.candidateAttestationService
        .postCandidateBypassRequest(bypassRequestbody)
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
        }
      );
    }
  }

  onPayrateUnitChange(event){
    if(this.payRateUnitType){
      this.candidateReqObj.billratetype = this.payRateUnitType.toLowerCase();
    }
  }

  onZipcodeChange(event){
    this.getCityListFromZipCode();
  }

  onCityChange(event){

  }

  onStateChange(event){

  }

  createRequestBody(){
    this.candidateReqObj.candidateid = this.candidateid;
    this.candidateReqObj.requisitionid = this.requisitionId;
    this.candidateReqObj.firstname = this.vForm.value.firstName;
    this.candidateReqObj.middlename = this.vForm.value.middleName;
    this.candidateReqObj.lastname = this.vForm.value.lastName;
    this.candidateReqObj.recname = this.vForm.value.reqNameId;
    this.candidateReqObj.jobtitle = this.vForm.value.jobTitle;
    this.candidateReqObj.clientname = this.vForm.value.clientName;
    this.candidateReqObj.billrate = this.vForm.value.payRateOffered;
    this.candidateReqObj.billratetype = this.vForm.value.payRateUnit;
    this.candidateReqObj.zipcode = this.vForm.value.zipcode;
    this.candidateReqObj.city = this.vForm.value.city;
    this.candidateReqObj.state = this.vForm.value.state;
    this.candidateReqObj.currentrole = this.currentRole;
  }

  onSubmit() {
    if (this.vForm.valid) {
      this.createRequestBody();
      this.isUploading = true;
      this.candidateAttestationService
        .postCreateCandidateAttestaton(this.candidateid, this.requisitionId, this.candidateReqObj)
        .subscribe((response) => {
          if (JSON.parse(response._body)) {
            let body = JSON.parse(response._body);
            if (body.response) {
              this.isUploading = false;
              this.displayMessage = body.message ? body.message : "Candidate attestation created successfully";
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

  toTitleCase(title){
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
}
