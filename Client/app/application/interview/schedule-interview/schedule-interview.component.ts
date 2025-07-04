import { ChangeDetectionStrategy, Component, DoCheck, ElementRef, Input, OnChanges, EventEmitter, OnInit, Output, SimpleChanges, ViewChild, TemplateRef } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AddrecService } from "../../requisitions/add-requisition/addrec.service";
import { InterviewComponent } from "../interview.component";
import { InterviewService } from "../interview.service";
import { DateValidator, } from "./date-time-picker-modal/datevalidator";
import { Observable, ObservableInput } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';


import { Subject } from "rxjs";
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map } from 'rxjs/operators';
import { createEmptyStateSnapshot } from "@angular/router/src/router_state";
import { OneMonthPastDateValidator } from "./date-time-picker-modal/onemonthpastdatevalidator";

@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.component.html',
  styleUrls: ['./schedule-interview.component.scss'],
  providers: [InterviewService],

})

export class ScheduleInterviewComponent implements OnInit {
  visible = false;
  isReSchedule = false;
  followUpId = 'followup'
  reminderId = 'reminder'
  interviewForm: any;
  requisitionId: number
  candidateId: number
  showLoader: Boolean;
  reScheduleData: any;
  interviewDetails: any;
  nextInterviewRound: number;
  pendingInterview: string;
  candidateinterviewid: number;
  formSubmitted = true;
  reminderinminsInput = false;
  currentInterviewRound: number;
  inValidForm = false;
  ifRescheduleTrue = false;
  recruiters: any
  isLoading = false;
  rescheduleMail: any;
  interviewHistDetails:any;
  isClientScreenings;
  showSubmitToClientPopup:boolean;
  showSTCwarning:boolean;
  clientSubmission:boolean;
  loadSTCPopup=false;
  blockClientInterview:boolean;
  hideLevel:boolean=false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };
  modalRef: any;
  ngbModalOptions: NgbModalOptions = { backdrop: 'static', keyboard: false };
  @ViewChild('content') content: TemplateRef<any>;
  candidateOtherReqDetails:any;
  @Output() candidateOtherReqDetailsEmitter: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() nextInterviewRoundEmitter: EventEmitter<any> = new EventEmitter<any>();
  modalcloseResult: string;
  ndaID = 'isnda';

 


  

  public recruiterList$: Observable<any>;
  public recruiterinput$ = new Subject<string | null>();

  @ViewChild("closebutton") closebutton;
  @Output() switchTabEvent = new EventEmitter();


  emailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



  interviewType = [
    { id: 'Internal Screenings', type: 'Internal Screenings',
    },
    { id: 'Client Screenings', type: 'Client Screenings' },
  ];
  //interviewType: { id: string, type: string, disabled: boolean }[] = [];

  interviewlevelDefault = [
    { id: 'L1', level: 'L1' },
    { id: 'L2', level: 'L2' },
    { id: 'L3', level: 'L3' },
  ];
 

  //executedby = [
  //  { id: 'External Platform', level: 'External Platform' },
  //  { id: 'Internal Practice/Engineering', level: 'Internal Practice/Engineering' },

  //];

  executedby :any;

  interMode = [];

  intDuration = [
    { id: '30 Mins', duration: '30 Mins' },
    { id: '1:00 Hrs', duration: '1:00 Hrs' },
    { id: '1:30 Hrs', duration: '1:30 Hrs' },
    { id: '2:00 Hrs', duration: '2:00 Hrs' },
    { id: '2:30 Hrs', duration: '2:30 Hrs' },
    { id: '3:00 Hrs', duration: '3:00 Hrs' },
  ]

  reminder = [
    { id: '10 Mins', duration: 10 },
    { id: '20 Mins', duration: 20 },
    { id: '30 Mins', duration: 30 },
    { id: '40 Mins', duration: 40 },
    { id: '50 Mins', duration: 50 },
    { id: '60 Mins', duration: 60 },
    { id: '90 Mins', duration: 90 },
  ]
  timeZones = []

  //Payload to create and Reschedule
  objCreateInt = {
    "interviewtype": null,
    "interviewlevel": null,
    "executedby": null,
    "interviewmodeid": null,
    "interviewtime": null,
    "timezonecode": null,
    "duration": null,
    "zipcode": null,
    "city": null,
    "interviewername": null,
    "intervieweremail": null,
    "ccemail": null,
    "alertrequiredafterinterview": false,
    "isreminderrequired": false,
    "interviewreminder": null,
    "finalround": null,
    "notes": null,
    "candidateid": null,
    "requisitionid": null,
    "candidateinterviewid": 0,
    "isnda": false,
    "interviewlinklocation": null
  }


  constructor(
    private currentRoute: ActivatedRoute,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private elemnetRef: ElementRef,
    private formBuilder: FormBuilder,
    private interviewService: InterviewService,
    
    

  ) { this.initializetypeheads() 
    }





  ngOnInit(): void {
   


    if (this.isReSchedule === false) {

      this.getCandAndReqId();
      this.getIntRound();
      this.getinteviewMode();
      this.getTimeZone();
      this.getIntHistDetails();
      this.getInterviewExecutedByDetails();
      
      
      


    } else {
      this.getInterviewExecutedByDetails();
      this.getCandAndReqId();
      this.getIntRound();
      this.getIntDetails()
      this.getinteviewMode();
      this.getTimeZone();
      this.cc();
      this.getIntHistDetails();
      
      
      
    }

    this.interviewForm = this.formBuilder.group({

      "interviewType": new FormControl('', [Validators.required]),
      "interviewLevel": new FormControl('', [Validators.required],),
      "executedBy": new FormControl('', [Validators.required]),
      "interviewMode": new FormControl(" ", [Validators.required]),
      "dateAndTime": new FormControl("", [Validators.required, OneMonthPastDateValidator()],),
      "timeZone": new FormControl(" ", [Validators.required]),
      "duration": new FormControl(" ", [Validators.required]),
      "reminder": new FormControl(),
      "reminderinmins": new FormControl("", Validators.pattern(/^[0-9]\d*$/)),
      "followUp": new FormControl(),
      "finalRound": new FormControl("", [Validators.required]),
      "interviewerName": new FormControl("", Validators.pattern('^[a-zA-Z ]*$')),
      "interviewerEmail": new FormControl(''),
      "ccMail": new FormControl('',),
      "notes": new FormControl(['',
        Validators.maxLength(3000),
      ]),
      "isnda": new FormControl(),
      "interviewlinklocation": new FormControl()


    })





  }



  onSwitchreminder(event) {
    if (event === true) {
      this.interviewForm.controls['reminder'].setValue(true);


    } else {
      this.interviewForm.controls['reminder'].setValue(false);

      //To Toggle Reminder Dropdown Validation
      this.interviewForm.get('reminderinmins').clearValidators();
      this.interviewForm.get('reminderinmins').updateValueAndValidity();
      //To clear the value if we switch off the reminder
      this.interviewForm.get('reminderinmins').setValue(null);

    }


  }


  onSwitchFollowUp(event) {
    if (event === true) {
      this.interviewForm.controls['followUp'].setValue(true);

    } else {
      this.interviewForm.controls['followUp'].setValue(false);
    }

  }
  onSwitchNDA(event) {
    if (event === true) {
      this.interviewForm.controls['isnda'].setValue(true);

    } else {
      this.interviewForm.controls['isnda'].setValue(false);
    }

  }

  getCandAndReqId() {
    this.currentRoute.queryParams.subscribe(params => {
      this.requisitionId = parseInt(params['id']);
      this.candidateId = parseInt(params['candidateid']);
    });

  }

  getTimeZone() {
    this.interviewService.getTimeZone().subscribe(res => {
      let response = JSON.parse(res._body)['response'];
      this.timeZones = response.timezones;

    },
      err => {
        console.error(err);
      });

  }

  ccemailtoString() {
    // To convert & assign Ccmail from Array to String
    this.objCreateInt.ccemail = this.recruiters.toString();
  }

  getinteviewMode() {

    this.interviewService.getInterviewMode()
      .subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)['response'];
          this.interMode = response.interviewtype;

        },
        error => {
          error
        },
        () => {

        }
      );
  }



  //Method to Clear Validation on toggle between Client and Internal Screenings
  onInterviewTypeChange(data) {
    if (data === "Client Screenings") {
      this.interviewForm.get('interviewLevel').clearValidators();
      this.interviewForm.get('interviewLevel').updateValueAndValidity();
      //To clear the values if we again select Client Screenings
      this.interviewForm.get('interviewLevel').setValue(null);
      //For Executed
      this.interviewForm.get('executedBy').clearValidators();
      this.interviewForm.get('executedBy').updateValueAndValidity();
      //To clear the values if we again select Client Screenings
      this.interviewForm.get('executedBy').setValue(null);


    }


  }

  searchRecruiters(term: string): ObservableInput<any> {
    if (!term)
      return of([]);
    this.isLoading = true;
    const clientid = "0";
    return this.interviewService.getRecruitersList(term, clientid).pipe(
      map((res: any) => {
        this.isLoading = false
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];


      })

    );
  }

  initializetypeheads() {
    this.recruiterList$ = this.recruiterinput$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiters(term))

    );

  }



  //Create Interview Submit
  onSubmit(modalData) {

    if(this.nextInterviewRound === 1 && (this.candidateOtherReqDetails && this.candidateOtherReqDetails.interviewlevel==="L1")){
      this.showL1Warning();
     
    }else{
      this.createInterview(modalData);
     
    }

  }


  createInterview(modalData){

    this.objCreateInt.candidateid = this.candidateId
    this.objCreateInt.requisitionid = this.requisitionId

    this.markFormGroupTouched(this.interviewForm);

    if (this.blockClientInterview && this.objCreateInt.interviewtype == 'Client Screenings') {


      this.showSTCwarning = true;


    } else if (!this.interviewForm.valid) {

      this.inValidForm = true

    }
    else {

      this.interviewService.addInterview(this.objCreateInt).
        subscribe(
          (res: any) => {
            if (JSON.parse(res._body)['response']) {

              this.getIntRound();
            }
            this.modalService.open(modalData, {
              backdrop: 'static',
              keyboard: false
            });
            this.onReset();
            this.switchTabEvent.emit('interview');
          }, (err) => {


            console.log('Error in Fetching Data', err);


          })
    }

  }





  onReset() {
    this.interviewForm.reset();
    this.inValidForm = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


  //Reschedule Submit Action
  onreScheduleSubmit(modalData) {

    this.objCreateInt.candidateid = this.candidateId
    this.objCreateInt.requisitionid = this.requisitionId
    this.objCreateInt.candidateinterviewid = this.candidateinterviewid
    this.markFormGroupTouched(this.interviewForm)
    if ( this.blockClientInterview && this.objCreateInt.interviewtype=='Client Screenings' ) {
      
      
      this.showSTCwarning = true;
      

    } else if( !this.interviewForm.valid){
     
      this.inValidForm = true

    } else {

      this.interviewService.rescheduleInterview(this.objCreateInt).
        subscribe(
          (res: any) => {

            this.modalService.open(modalData);

            this.modal.close(true);

          }, (err) => {


            console.log('Error in Fetching Data', err);


          })
    }

  }


  getInterviewExecutedByDetails() {
    this.interviewService.getInterviewExecutedByDetails()
      .subscribe((res: any) => {
        let resP = JSON.parse(res._body);
          this.executedby = resP.response;
      },
        (err) => {
          console.log('Error in Fetching Data', err);
        })
  }

  getIntRound() {
    this.pendingInterview = '';
    this.interviewService.getInterviewNumber(this.requisitionId, this.candidateId)
      .subscribe((res: any) => {
        let resP = JSON.parse(res._body);
        if (resP.response == false) {
          this.pendingInterview = resP.message
        } else {
          this.nextInterviewRound = resP.response;
          this.nextInterviewRoundEmitter.emit(this.nextInterviewRound );
         
          if(this.nextInterviewRound ===1){
            this.getCanndidateOtherReqInterview();

          }
        }

      },
        (err) => {


          console.log('Error in Fetching Data', err);


        })
  }

  //to get reschedule interview details
  getIntDetails() {
    this.interviewService.getInterviewDetails(this.candidateinterviewid)
      .subscribe((res: any) => {

        this.interviewDetails = JSON.parse(res._body)['response'][0];
        this.objCreateInt.interviewtype = this.interviewDetails.interviewtype;
        this.objCreateInt.interviewmodeid = this.interviewDetails.interviewmodeid;
        this.objCreateInt.interviewtime = this.interviewDetails.interviewtime;
        this.objCreateInt.timezonecode = this.interviewDetails.timezonecode;
        this.objCreateInt.duration = this.interviewDetails.duration;
        this.objCreateInt.isreminderrequired = this.interviewDetails.isreminderrequired;
        this.objCreateInt.alertrequiredafterinterview = this.interviewDetails.alertrequiredafterinterview;
        this.objCreateInt.finalround = this.interviewDetails.finalround;
        this.objCreateInt.interviewername = this.interviewDetails.interviewername;
        this.objCreateInt.intervieweremail = this.interviewDetails.intervieweremail.split("@")[0];
        this.objCreateInt.notes = this.interviewDetails.notes;
        this.objCreateInt.interviewlevel = this.interviewDetails.interviewlevel;
        this.objCreateInt.executedby = this.interviewDetails.executedby;
        this.objCreateInt.interviewreminder = this.interviewDetails.interviewreminder;
        this.objCreateInt.interviewlinklocation = this.interviewDetails.interviewlinklocation;


      },
        (err) => {


          console.log('Error in Fetching Data', err);


        })
  }





  cc() {
    // Method for binding CC mail to Reschedule Screen
    this.interviewService.getInterviewDetails(this.candidateinterviewid)
      .subscribe((res: any) => {

        this.interviewDetails = JSON.parse(res._body)['response'][0];
        const emailString = this.interviewDetails.ccemail;
        const emailArray = emailString.split(",");
        const nameArray = emailArray.map((email) => {
          return email.split("@")[0];
        });

        this.recruiters = nameArray
     
      }
      )
  }


  //Disable Internal Screening , once the Client Screening selected//
  //Client Submission Configuration//

  getIntHistDetails() {
    this.interviewService.getInterviewHistoryDetails(this.candidateId, this.requisitionId)
      .subscribe((res: any) => {
        const responseBody = JSON.parse(res._body);
      
        if (responseBody && responseBody['response'] && responseBody['response'].length > 0) {
          this.interviewHistDetails = responseBody['response'][0]['results'];

         //Level Dropdown list Hide /show code
          const L1filteredData = this.interviewHistDetails.filter(data =>
            data.interviewlevel === 'L1' && !data.isinterviewcanceled
          );

          const L2filteredData = this.interviewHistDetails.filter(data =>
            data.interviewlevel === 'L2' && !data.isinterviewcanceled
          );
          const L3filteredData = this.interviewHistDetails.filter(data =>
            data.interviewlevel === 'L3' && !data.isinterviewcanceled
          );
          

          if (L1filteredData.length === 1) {

            this.interviewlevelDefault = this.interviewlevelDefault.filter(item => item.id !== 'L1');

          }
          if (L2filteredData.length === 1) {

            this.interviewlevelDefault = this.interviewlevelDefault.filter(item => item.id !== 'L1' && item.id !== 'L2');

          }
          if (L3filteredData.length === 2) {
            this.hideLevel = true;
        
          }

          //Level Dropdown list Hide /show code ends

          // To Check if the Candidate Submitted to Client
          const clientSubmission = responseBody['response'][0]['clientsubmission'];
          
          
          if (!clientSubmission && (!this.interviewHistDetails || this.interviewHistDetails.length === 0)) {
            this.loadSTCPopup= true;
            this.showSubmitToClientPopup = true;
            this.blockClientInterview = true;
            
          }else if(!clientSubmission){
            this.loadSTCPopup= true;
            this.blockClientInterview = true;
            

          }else{
            
            this.showSubmitToClientPopup = false;
            this.blockClientInterview = false;
      
          }

          //For Disabling Internal Screneings once the Internal Screening Scheduled
          if(this.interviewHistDetails){
  
          // To Check if "Client Screenings" interview is present in any of the interviews
          const clientScreeningsInterview = this.interviewHistDetails.find(interview =>
            interview.interviewtype === 'Client Screenings' && interview.interviewstatus !== 'Canceled'
          );
          if (clientScreeningsInterview) {
            // If "Client Screenings" interview is present
                this.interviewForm.get('interviewType').setValue('Client Screenings');
                this.interviewForm.get('interviewType').disable();
      
          } else{
         
          }
        }}
      });
  }
  

  // Submit to Client POPUP Configuration

  closeSubmitToClientPopupHandler() {
    this.showSubmitToClientPopup = false;
  }
  
  closeSTCwarningPopupHandler() {
    this.showSTCwarning = false;
  }

  submitToClientSuccess(){
    this.getIntHistDetails();
   
  }

  openPopup(closePopup?: boolean) {

    this.modalRef = this.modalService.open(this.content, this.ngbModalOptions);

    this.modalRef.result.then((result) => {
        if (result === 'Cross') {
        }
    }, (reason) => {
        if (reason === ModalDismissReasons.ESC ||
            reason === ModalDismissReasons.BACKDROP_CLICK) {

        }
    });


}

  showL1Warning(){
      this.popupConfig.title = "Attention !";
      this.popupConfig.type = "success";
      this.popupConfig.isConfirm = false;
      this.openPopup();

  }

  getCanndidateOtherReqInterview() {
    
      this.interviewService.getCandidateOtherReqStatus(this.candidateId)
      .subscribe((res: any) => {
        const data = JSON.parse(res._body)['response'][0];
        if(data){
          this.candidateOtherReqDetails = data;
          this.candidateOtherReqDetailsEmitter.emit(this.candidateOtherReqDetails); // Emit the data
        
        }
      });

    

  

      }


  

  
  ///////////////////////////////////////////////////////////////////////////////////


}


