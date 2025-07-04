import {
  Component, Input, ViewChild, OnInit, TemplateRef
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { CandidateService } from '../candidate.service';

import { Subscription } from 'rxjs';
import {
  NgbModal,
  NgbModalOptions,
  NgbTooltip,
  NgbModalRef,
  NgbActiveModal
} from "@ng-bootstrap/ng-bootstrap";
import { AddrecService } from '../../requisitions/add-requisition/addrec.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
@Component({
  selector: 'add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss'],
  providers: [CandidateService]
})
export class AddCandidate implements OnInit {
  addCandidateForm: FormGroup;
  isSubmitClicked: boolean;
  isResetClicked: boolean;

  uploader: FileUploader;


  phoneMask: any[] = [
    /[1-9]/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  busy: Subscription;
  isUploading: boolean;
    fileslist = [];
    sourcelist = [];
  uploadForm: FormGroup;
  public fileName;
  public displaymesg;
  public errorMessage;
  public resumeWrongFormat = false;
  createCandidateResp: any;
  isModalClosedsuccess = false;
  isModalClosederror = false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  addloader = false;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  datafromDragndrop = false;
  deliveryModelList: any = []; 
  public isFileDropped: boolean = false;
  labelsList: any;
  searching = false;
  searchFailed = false;
  selecteddropItem: any;
  recruiterItems$: Observable<any>;
  recruiterinput$ = new Subject<string | null>();
  isrecruiterLoading = false;
  EmpRefDetails: any;
  gcidItems$: Observable<any>;
  gcidinput$ = new Subject<string | null>();
  isgcidLoading = false;

  objAddCandidate = {
    email: "",
    offShore: null,
    deliveryModel:null,
    referral: false,
    isJump: false,
    resumeFile: "",
    referraltype: "",
    gcid: "",
    refereeFirstName: "",
    refereeLastName: "",
    refereeMobileName: "",
    refereeEmailId: "",
    labelId: '',
    employeeId: "",
    designation: '',
    emailid: '',
    fullname: '',
    isexecutive:false
  };
  attachments: any = [];
  constructor(
    private formBuilder: FormBuilder, public modal: NgbActiveModal, public _appService: CandidateService,
    private _modalService: NgbModal) {

    this.uploader = new FileUploader({
      url: '',
      disableMultipart: true, 
     
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
  }

  ngOnInit(): void {
   
    this.addCandidateForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL)]),
      //offShore: new FormControl(''),
      deliveryModel:new FormControl('', [Validators.required]),
      referral: new FormControl(''),
      resumeFile: new FormControl(''),
      activeConsultant: new FormControl(''),
      others: new FormControl(''),
      gcid: new FormControl(''),
      source: new FormControl('', [Validators.required]),
      refereeFirstName: new FormControl('', [Validators.required]),
      refereeLastName: new FormControl('', [Validators.required]),
      refereeMobileName: new FormControl(''),
      refereeEmailId: new FormControl('', [Validators.required, Validators.pattern(EMAIL)]),
      labels: [[], [Validators.required]],
      employeeid: new FormControl('', [Validators.required]),
      designation: new FormControl(''),
      emailid: new FormControl(''),
      fullname: new FormControl(''),


    });

      this.getSourceList();
    this.getDeliveryModel();
    this.getlabels();
    this.initializeTypeaheads();
  }
    getSourceList() {
        this._appService.getCandidateSourceOptions(true).subscribe((res: any) => {
           
            let response = res._body ? JSON.parse(res._body).response : {};
            this.sourcelist = response.candidatesource;
        });
  }

  getDeliveryModel(){
    this._appService.getDeliveryModels()
    .subscribe(res => {
      let response = JSON.parse(res._body)['response'];
      this.deliveryModelList = response ? response : [];
      // console.log(this.deliveryModelList)
    },
      err => {
        console.error("Couldnt fetch Delivery Models" + err);
      });
  }
  getlabels() {
    this._appService.getlabels()
      .subscribe(res => {
        let response = JSON.parse(res._body)['response']['labels'];
        this.labelsList = response ? response : [];
      },
        err => {
          console.error("Couldnt fetch Delivery Models" + err);
        });
  }
  
  // onChangeOffShore(e) {
  //     debugger;
  //     if (e === true) {
  //         this.addCandidateForm.controls['offShore'].setValue(true);

  //   } else {
  //       this.addCandidateForm.controls['offShore'].setValue(false);
  //   }
  // }

  onChangeReferral(e) {
      if (e === true) {
        this.objAddCandidate.referraltype = "EMP";
        this.addCandidateForm.controls['referral'].setValue(true);
       // this.addCandidateForm.controls['activeConsultant'].setValue("GCI");

      }
   
      else {
        this.addCandidateForm.controls['referral'].setValue(false);
        this.addCandidateForm.controls["employeeid"].setErrors(null);


      }
  }
    onActiveConsultantChange(e) {

    let a = this.addCandidateForm.controls['activeConsultant'].value;
    if (a === 'GCI') {
      this.objAddCandidate.referraltype = 'GCI';

    } else {
      this.objAddCandidate.referraltype = 'Other';

    }
  }
  OnReset() {
    this.isResetClicked = true;
    this.objAddCandidate.offShore = false;
      this.objAddCandidate.referral = false;
    this.objAddCandidate.referraltype = 'GCI';
    this.addCandidateForm.controls['deliveryModel'].setValue(null);
    this.addCandidateForm.controls['email'].setValue("");
    this.addCandidateForm.controls['resumeFile'].setValue("");
    this.addCandidateForm.controls['gcid'].setValue("");
    this.addCandidateForm.controls['source'].setValue(null);
    this.addCandidateForm.controls['refereeFirstName'].setValue("");
    this.addCandidateForm.controls['refereeLastName'].setValue("");
    this.addCandidateForm.controls['refereeMobileName'].setValue("");
    this.addCandidateForm.controls['refereeEmailId'].setValue("");
    this.addCandidateForm.controls['labels'].setValue(null);
    this.addCandidateForm.controls['employeeid'].setValue(null);


    
    this.fileName = '';
    this.addloader = false;

  }


  onFileChange(files): void {
   // debugger;
    this.fileslist = files;
    if (files.length === 0) {
      this.fileslist = []; // explicitly mark it to empty to show required message
      return;
    }
    let fileToUpload = <File>files[0];
    this.addCandidateForm.get('resumeFile').setValue(fileToUpload);

    let filename = fileToUpload.name;
    this.fileName = filename;
    let extension = '';
    this.resumeWrongFormat = false;
    this.datafromDragndrop = false;

    if (filename && filename.lastIndexOf(".") > -1) {
      extension = filename.substring(filename.lastIndexOf(".") + 1, filename.length)
    }

    if (extension != 'pdf' && extension != 'docx' && extension != 'doc') {
      this.fileslist = [];
      // explicitly mark the list to empty to show required message
      this.resumeWrongFormat = true;
      return;
    }
 
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileDrop(fileList: File[]) {
    this.addCandidateForm.get('resumeFile').setValue(fileList[0]);
    this.datafromDragndrop = true;
    this.fileName = '';
}

  fileOverDropZone(e: any): void {
    this.isFileDropped = e;
  }
  OnSubmit() {
  
    debugger;
    this.isSubmitClicked = true;
    this.isResetClicked = false;
    this.addloader = true;

    if (!this.isValidForm()) {
      this.addloader = false;
      return;
    } else {
      const formData = new FormData();
      if (this.objAddCandidate.referral ) {
        this.addCandidateForm.value.referral = true;
        if (this.objAddCandidate.referraltype == "EMP") {
          formData.append('referraltype', 'Employee');
          formData.append('employeeid', this.addCandidateForm.value.employeeid);

        } else {

          formData.append('referraltype', this.objAddCandidate.referraltype + '');
          formData.append('refereefirstname', this.addCandidateForm.value.refereeFirstName);
          formData.append('refereelastname', this.addCandidateForm.value.refereeLastName);
          formData.append('refereeemailid', this.addCandidateForm.value.refereeEmailId);
          formData.append('gcid', this.addCandidateForm.value.gcid);
          formData.append('refereephone', this.addCandidateForm.value.refereeMobileName);


        }

      }
      else {
        this.addCandidateForm.value.referral = false;

      }
      formData.append('file', this.addCandidateForm.get('resumeFile').value);
      formData.append('emailid', this.addCandidateForm.value.email);
    //  formData.append('offshore', this.objAddCandidate.offShore);
      formData.append('isreferral', this.addCandidateForm.value.referral);
      formData.append('sourceid', this.addCandidateForm.value.source);
      formData.append('deliverymodelid', this.addCandidateForm.value.deliveryModel);
      if (this.addCandidateForm.value.labels.length >= 1) {
        for (const index in this.addCandidateForm.value.labels) {
          formData.append(`labels`, this.addCandidateForm.value.labels[index]);
        }
      }



      this.busy = this._appService.addcandidatePost(formData).
        subscribe(
          (res: any) => {
            if (JSON.parse(res._body)['response']) {
              this.createCandidateResp = JSON.parse(res._body)['message'];
              this.isModalClosedsuccess = true;
              this.addloader = false;
              


              setTimeout(() => {
                this.isModalClosedsuccess = false;
                this.modal.close(true);


               }, 5000);


            } else {
              this.createCandidateResp = JSON.parse(res._body)['message'];
              this.isModalClosederror = true;
              this.addloader = false;


              setTimeout(() => {

              //  this.modal.close(true);
                this.isModalClosederror = false;


              }, 5000);
            }

          },
          err => {

          }
        );
    }
    
  }


  private isValidForm() {
    
    if (this.addCandidateForm.valid) {
      return true;
    }
 
      let isValidForm = true;


    if ((this.addCandidateForm.controls['email'].value && this.addCandidateForm.controls['email'].valid) && (this.addCandidateForm.controls['source'].value) &&(this.addCandidateForm.controls['deliveryModel'].value) && (this.fileslist.length > 0 || this.datafromDragndrop)) {
        isValidForm = true;
      } else 
        isValidForm = false;


    if (this.objAddCandidate.referral) {
     
        
      Object.keys(this.addCandidateForm.controls)
        .forEach(controlName => {
          if (this.objAddCandidate.referraltype == "EMP" && this.addCandidateForm.controls[controlName].invalid) {
            isValidForm = false;

          } else {
            isValidForm = true;

          }

          
          if (this.addCandidateForm.controls[controlName].invalid && (this.objAddCandidate.referraltype == "GCI" || this.objAddCandidate.referraltype == "Other")) {
              if ((controlName !== 'refereeFirstName' && controlName !== 'refereeLastName' && controlName !== 'refereeEmailId')) {
                isValidForm = false;
                
              }
            }
          
       
        });
    }
      return isValidForm;
  }

  clearResume() {
      this.attachments = [];
      this.fileslist = [];
     
    this.fileName = '';
    this.addCandidateForm.controls['resumeFile'].setValue("");

    if (this.uploader) {
      this.uploader.queue[0].file.name = null;
    }

  }


  removeFile() {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };

 
    this.popupConfig.title = "Alert !";
    this.popupConfig.message = `Are you sure you want to  remove this File ?`;
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Yes";

    this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

    this.confirmModal.result.then((result) => {

        if (result == 'cancel') {
          //do nothing. close popup
      }
    }, (approvereason) => {
            
      if (approvereason == 'ok') {
       
         
      }

    });
  }



  
  selectedItem(item) {
    this.selecteddropItem = '';
    this.objAddCandidate.fullname = null;
    this.objAddCandidate.emailid = null;
    this.objAddCandidate.designation = null;
    this.objAddCandidate.isexecutive = false;
    if (item) {
      this.selecteddropItem = item;
      if (this.selecteddropItem) {
        this.getrefereeDetails(this.selecteddropItem);
      }

    }
  }

  searchRecruiter(term: string) {
    if (!term)
      return of([]);

    this.isrecruiterLoading = true;
    return this._appService.searchRecruiter(term).pipe(
      map((res) => {
        debugger;
        this.isrecruiterLoading = false;
       // let resP = JSON.parse(res);
        return res ? res : []
      }),
      takeUntil(this.recruiterItems$)

    );
  }


  initializeTypeaheads(param?) {

    this.recruiterItems$ = this.recruiterinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiter(term))

    );

    this.gcidItems$ = this.gcidinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.getGCIDDetails(term))

    );
  }

  getrefereeDetails(selecteddropItem) {
    this._appService.getrefereeDetails(selecteddropItem)
      .subscribe(res => {
        let response = JSON.parse(res._body)['response'];
        this.EmpRefDetails = response ? response : [];
        if (this.EmpRefDetails[0]) {
          this.objAddCandidate.fullname = this.EmpRefDetails[0].fullname ? this.EmpRefDetails[0].fullname : null;
          this.objAddCandidate.emailid = this.EmpRefDetails[0].emailid ? this.EmpRefDetails[0].emailid : null;
          this.objAddCandidate.designation = this.EmpRefDetails[0].designation ? this.EmpRefDetails[0].designation : null;
          this.objAddCandidate.isexecutive = this.EmpRefDetails[0].isexecutive;

        }
      },
        err => {
          console.error("Couldnt fetch Delivery Models" + err);
        });
  }

  getGCIDDetails(term:string) {
    if (!term)
      return of([]);

    this.isgcidLoading = true;
    return this._appService.getGCIDDetails(term).pipe(
      map((res:any) => {
        debugger;
        this.isgcidLoading = false;
        let response = JSON.parse(res._body)['response'];
        return response ? response : []
      }),
      takeUntil(this.gcidItems$)

    );
  }
  getallgcidDetails(selecteddropItem) {
    this.objAddCandidate.refereeFirstName = "";
    this.objAddCandidate.refereeLastName = "";
    this.objAddCandidate.refereeEmailId = "";
    this.objAddCandidate.refereeMobileName = "";
    if (selecteddropItem){
      this.objAddCandidate.refereeFirstName = selecteddropItem.firstname ? selecteddropItem.firstname : null;
      this.objAddCandidate.refereeLastName = selecteddropItem.lastname ? selecteddropItem.lastname : null;
      this.objAddCandidate.refereeEmailId = selecteddropItem.emailid ? selecteddropItem.emailid : null;
      this.objAddCandidate.refereeMobileName = selecteddropItem.mobilenumber ? selecteddropItem.mobilenumber : null;

    }
  }
}


