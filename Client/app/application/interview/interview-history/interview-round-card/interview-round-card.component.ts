import { Component, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit, TemplateRef} from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { InterviewComponent } from "../../interview.component";
import { InterviewService } from "../../interview.service";
import { IntCompleteOrEditFeedback } from "../../Model/InterviewFormData";
import { CancelInterview } from "../../Model/InterviewFormData";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { ScheduleInterviewComponent } from "../../schedule-interview/schedule-interview.component";
import { ActivatedRoute } from "@angular/router";
import { FileUploader } from 'ng2-file-upload';







@Component({
  selector: 'app-interview-round-card',
  templateUrl: './interview-round-card.component.html',
  styleUrls: ['./interview-round-card.component.scss'],
  providers: []
})

export class InterviewRoundCardComponent implements OnInit, AfterViewInit {
  interviewHistoryRoundDetails: any;
  cancelPopupOpen: boolean = false;
  cancelInterviewData: any = [];
  isEditFeedback: boolean = false;
  editFeedbackItemId: any;
  showsuccesspopup: boolean = false;
  successMessage: any = '';
  showFeedbackValidation: boolean = false;
  showCancelReasonValidation: boolean = false;
  private formData: IntCompleteOrEditFeedback = new IntCompleteOrEditFeedback();
  private cancelData: CancelInterview = new CancelInterview();
  candidateinterviewid: any;
  showSchedule = true;
  isReSchedule = true;
  currentInterviewRound: number;
  // @ViewChild('content') content: TemplateRef<HTMLInputElement>;
  @ViewChild('newcontent') newcontent: ElementRef;
  debriefObjDetails: any;
  finalarry = [];

  busy: Subscription;
  requisitionid: any;
  candidateId: any;
  showLoader = false;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  isUploading: boolean;
  fileslist = [];
  sourcelist = [];
  uploadForm: FormGroup;
  public fileName;
  public displaymesg;
  public errorMessage;
  public resumeWrongFormat = false;
  datafromDragndrop = false;
  public isFileDropped: boolean = false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  attachments: any = [];
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  FeedbackFileupload: FormGroup;









  constructor(private interviewService: InterviewService, private modalService: NgbModal, private fb: FormBuilder, public modal: NgbActiveModal, private currentRoute: ActivatedRoute, private _modalService: NgbModal, private formBuilder: FormBuilder) {
    this.uploader = new FileUploader({
      url: '',
      disableMultipart: true,

    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
  }

  ngOnInit(): void {

    this.currentRoute.queryParams.subscribe(params => {

      this.requisitionid = parseInt(params['id']);

      this.candidateId = parseInt(params['candidateid']);
    });
    this.getInterviewRoundDetails(this.candidateId, this.requisitionid);
    this.FeedbackFileupload = this.formBuilder.group({

      FeedbackFile: new FormControl(''),



    });

  }


  ngAfterViewInit() {
    //  this.getDebriefDetails();
  }
  getInterviewRoundDetails(tjcandidateId, requisitionId: any) {
    this.showLoader = true;
    this.interviewService.getInterviewHistoryDetails(this.candidateId, this.requisitionid)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['responsecode'] == 200 && JSON.parse(res._body)['response'].length > 0) {
            this.interviewHistoryRoundDetails = JSON.parse(res._body)['response'];
            console.log("Interview Details", this.interviewHistoryRoundDetails);
            this.getDebriefDetails();
            this.showLoader = false;
          
          }
          else {

          }
        },
        err => {

        },
        () => {
        }
      );
  }
  public model = {
    "rateInterviewScale": null,
    "panelPersons": "",
    "situationalOrTechnical": '',
    "howmanyQuestions": "",
    "managerFocusedOn": "",
    "howLongTheInterview": "",
    "isDetailedAboutProject": '',
    "isWillingToAcceptOffer": '',
    "aboutLookingFor": "",
    "isAdequate": '',


  };
  cancelReasonValidation() {
    if (this.cancelInterviewData.cancelreason == null || this.cancelInterviewData.cancelreason == '') {
      this.showCancelReasonValidation = true;
    } else {
      this.showCancelReasonValidation = false;
    }
  }
  cancelInterview(data: any) {
    this.cancelData = new CancelInterview();
    if (this.cancelInterviewData.cancelreason == '' || this.cancelInterviewData.cancelreason == null || this.cancelInterviewData.cancelreason.isNull) {
      this.showCancelReasonValidation = true;
    }
    else {
      this.cancelData.candidateinterviewid = this.cancelInterviewData.candidateinterviewid;
      this.cancelData.candidateid = this.interviewHistoryRoundDetails[0].candidateid;
      this.cancelData.requisitionid = this.interviewHistoryRoundDetails[0].requisitionid;

      this.cancelData.cancelreason = this.cancelInterviewData.cancelreason;
      let cancelIntData = Object.assign(this.cancelData);
      this.interviewService.cancelInterview(cancelIntData);
      let value = this.interviewService.cancelInterview(cancelIntData)
        .subscribe(
          (res: any) => {
            this.successMessage = 'Interview Round Cancelled Successfully!';
            this.showsuccesspopup = true;
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
      debugger;

      let index = this.interviewHistoryRoundDetails[0].results.findIndex(item => item.candidateinterviewid == data.candidateinterviewid);
      this.interviewHistoryRoundDetails[0].results[this.interviewHistoryRoundDetails[0].results.length - (index + 1)].isinterviewcanceled = true;
      this.cancelPopupOpen = false;

    }
  }

  openCancelpopup(data: any) {
    this.cancelPopupOpen = true;
    this.cancelInterviewData = data;
  }

  closeCancelpopup() {
    this.cancelPopupOpen = false;
    this.cancelInterviewData = [];
  }

  markCompleteInterview(data: any) {
    if (data.feedback == null || data.feedback == '' || data.feedback.isNull) {
      this.showFeedbackValidation = true;
    }
    else {
      const formData = new FormData();
      formData.append('candidateinterviewid', data.candidateinterviewid);
      formData.append('candidateid', this.interviewHistoryRoundDetails[0].candidateid);
      formData.append('requisitionid', this.interviewHistoryRoundDetails[0].requisitionid);
      formData.append('isinterviewcleared', data.isinterviewcleared);
      formData.append('feedback', data.feedback);
      formData.append('iscompleted', 'true');
      formData.append('isfeedbackedit', 'false');
      formData.append('FeedbackFile', this.FeedbackFileupload.get('FeedbackFile').value);


      //this.formData = new IntCompleteOrEditFeedback();
      //this.formData.candidateinterviewid = data.candidateinterviewid;
      //this.formData.candidateid = this.interviewHistoryRoundDetails[0].candidateid;
      //this.formData.requisitionid = this.interviewHistoryRoundDetails[0].requisitionid;
      //this.formData.isinterviewcleared = data.isinterviewcleared;
      //this.formData.feedback = data.feedback;
      //this.formData.iscompleted = true;
      //this.formData.isfeedbackedit = false;
      //this.formData.FeedbackFile = this.model.FeedbackFile;

      //let intValues = Object.assign(this.formData);
      let value = this.interviewService.markCompleteOrEditFeedbackInterview(formData)
        .subscribe(
          (res: any) => {
            if (JSON.parse(res._body)['response']) {
              this.successMessage = 'Interview Round Marked as Completed Successfully!';
              this.showsuccesspopup = true;
              debugger;
            }


          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
      debugger;
      let index = this.interviewHistoryRoundDetails[0].results.findIndex(item => item.candidateinterviewid == data.candidateinterviewid);
      this.interviewHistoryRoundDetails[0].results[index].iscompleted = true;
    }
  }

  rescheduleInterview(data: any) {


    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",

    };

    const modalRef = this.modalService.open(

      ScheduleInterviewComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.followUpId = modalRef.componentInstance.followUpId + 1;
    modalRef.componentInstance.reminderId = modalRef.componentInstance.reminderId + 1;
    modalRef.componentInstance.isReSchedule = this.isReSchedule;
    modalRef.componentInstance.candidateinterviewid = data.candidateinterviewid;
    modalRef.componentInstance.currentInterviewRound = data.interviewround;
    modalRef.componentInstance.ifRescheduleTrue = data.isreminderrequired;
    // console.log(data.isreminderrequired)
  }

  editFeedback(data: any) {
    this.editFeedbackItemId = data.candidateinterviewid;
    this.isEditFeedback = true;
  }

  updateFeedback(data: any) {
    if (data.feedback == null || data.feedback == '' || data.feedback.isNull) {
      this.showFeedbackValidation = true;
    }
    else {
      this.formData = new IntCompleteOrEditFeedback();
      this.formData.candidateinterviewid = data.candidateinterviewid;
      this.formData.candidateid = this.interviewHistoryRoundDetails[0].candidateid;
      this.formData.requisitionid = this.interviewHistoryRoundDetails[0].requisitionid;
      this.formData.feedback = data.feedback;
      this.formData.iscompleted = false;
      this.formData.isfeedbackedit = true;
      let intValues = Object.assign(this.formData);
      let value = this.interviewService.markCompleteOrEditFeedbackInterview(intValues)
        .subscribe(
          (res: any) => {
            this.successMessage = 'Interview Round Feedback Updated Successfully!';
            this.showsuccesspopup = true;
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
      debugger;
      let index = this.interviewHistoryRoundDetails[0].results.findIndex(item => item.candidateinterviewid == data.candidateinterviewid);
      this.interviewHistoryRoundDetails[0].results[index].iscompleted = true;
      this.isEditFeedback = false;
      this.editFeedbackItemId = null;
    }

  }

  feedbackValidation(data: any) {
    if (data.feedback == null || data.feedback == '') {
      this.showFeedbackValidation = true;
    }
    else {
      this.showFeedbackValidation = false;
    }
  }


  openDebrief(data: any) {
    //open debrief
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      windowClass: 'overrides'
    };
    if (data.candidateinterviewid) {
      this.candidateinterviewid = data.candidateinterviewid;
    }
    const modalRef = this.modalService.open(this.content, ngbModalOptions);

  }

  getDebriefDetails() {
    if (this.interviewHistoryRoundDetails[0].candidateid && this.interviewHistoryRoundDetails[0].requisitionid) {
      var obj = {
        "candidateid": this.interviewHistoryRoundDetails[0].candidateid,
        "requisitionid": this.interviewHistoryRoundDetails[0].requisitionid

      }
    }

    this.busy = this.interviewService.getDebriefDetails(obj)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.debriefObjDetails = JSON.parse(res._body)['response'];

            if (JSON.parse(res._body)['response']) {
              for (let i = 0; i < JSON.parse(res._body)['response'].length; i++) {

                for (let j = 0; j < this.interviewHistoryRoundDetails[0].results.length; j++) {
                  if (JSON.parse(res._body)['response'][i].candidateinterviewid == this.interviewHistoryRoundDetails[0].results[j].candidateinterviewid) {
                    this.interviewHistoryRoundDetails[0].results[j]['debrief'] = (JSON.parse(res._body)['response'][i]);

                    if ((JSON.parse(res._body)['response'][i].rateinterviewscale)) {
                      this.interviewHistoryRoundDetails[0].results[j]['debrief'].rateinterviewscale = (JSON.parse(res._body)['response'][i].rateinterviewscale).toString();

                    }
                    if ((JSON.parse(res._body)['response'][i].iswillingtoacceptoffer == true || JSON.parse(res._body)['response'][i].iswillingtoacceptoffer == false)) {
                      this.interviewHistoryRoundDetails[0].results[j]['debrief'].iswillingtoacceptoffer = (JSON.parse(res._body)['response'][i].iswillingtoacceptoffer).toString();

                    }
                    if ((JSON.parse(res._body)['response'][i].isdetailedaboutproject == true || JSON.parse(res._body)['response'][i].isdetailedaboutproject == false)) {
                      this.interviewHistoryRoundDetails[0].results[j]['debrief'].isdetailedaboutproject = (JSON.parse(res._body)['response'][i].isdetailedaboutproject).toString();

                    }
                    if ((JSON.parse(res._body)['response'][i].isadequate == true || JSON.parse(res._body)['response'][i].isadequate == false)) {
                      this.interviewHistoryRoundDetails[0].results[j]['debrief'].isadequate = (JSON.parse(res._body)['response'][i].isadequate).toString();

                    }




                  }
                }

              }

              

            }





          }
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );


  }
  DebriefSubmit(data) {
    this.model["isDetailedAboutProject"] == "true" ? true : false;
    this.model["isWillingToAcceptOffer"] == "true" ? true : false;
    this.model["isAdequate"] == "true" ? true : false;
    this.model['candidateInterviewId'] = this.candidateinterviewid;

    this.busy = this.interviewService.UpdateCandidateInterviewDeBriefing(this.model)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.successMessage = 'Debrief form submitted Successfully!';
            this.showsuccesspopup = true;
            this.getDebriefDetails();
            data('cross');
          }
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );


  }

  ResetDebriefDetails() {

    this.model["rateInterviewScale"] = null;
    this.model["panelPersons"] = "";
    this.model["situationalOrTechnical"] = "";
    this.model["howmanyQuestions"] = "";
    this.model["managerFocusedOn"] = "";
    this.model["howLongTheInterview"] = "";
    this.model["isDetailedAboutProject"] = null;
    this.model["isWillingToAcceptOffer"] = null;
    this.model["aboutLookingFor"] = null;
    this.model["isAdequate"] = null;

  }
  closeClick() {
    window.location.reload();
  }


  onFileChange(files): void {
    // debugger;
    this.fileslist = files;
    if (files.length === 0) {
      this.fileslist = []; // explicitly mark it to empty to show required message
      return;
    }
    let fileToUpload = <File>files[0];
    this.FeedbackFileupload.get('FeedbackFile').setValue(fileToUpload);
    console.log("file Upload", fileToUpload);

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
   // this.addCandidateForm.get('resumeFile').setValue(fileList[0]);
    this.datafromDragndrop = true;
    this.fileName = '';
  }

  fileOverDropZone(e: any): void {
    this.isFileDropped = e;
  }


  clearResume() {
    this.attachments = [];
    this.fileslist = [];

    this.fileName = '';
   // this.addCandidateForm.controls['resumeFile'].setValue("");

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

    this.confirmModal = this._modalService.open(this.newcontent, ngbModalOptions);

    this.confirmModal.result.then((result) => {

      if (result == 'cancel') {
        //do nothing. close popup
      }
    }, (approvereason) => {

      if (approvereason == 'ok') {


      }

    });
  }
}
