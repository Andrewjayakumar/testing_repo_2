import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NewCandidateProdileService } from '../new-candidate-profile/new-candidate-profile.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkedInpopupComponent } from "../linkedinpopup/linkedinpopup.component";
import { LinkedinMailComponent } from '../linkedin-mail/linkedin-mail.component';
import { ShareMultipleUserComponent } from '../share-multiple-user/share-multiple-user.component';
import { UpdateClientComponent } from "../../application/requisitions/update-client/update-client.component";
import { CandidateResumeUploadComponent } from "../candidatesubmission/candidate-resumeupload/candidate-resumeupload.component";
import { PinToReqPopupComponent } from "../candidatesubmission/pin-to-req-popup/pin-to-req-popup.component";
import { AddToHotbooksPopupComponent } from "../candidatesubmission/add-to-hotbooks-popup/add-to-hotbooks-popup.component";
import { DncPopupComponent } from "../candidatesubmission/dnc-popup/dnc-popup.component";
import { MetalCardNotesComponent } from "../../shared/components/metal-card-notes/metal-card-notes.component";
import { CandidateBotResponseComponent } from "../../application/candidate/candidate-bot-response/candidate-bot-response.component";
import { SendSmsComponent } from "../candidatesubmission/send-sms/send-sms.component";
import { AcaDocumentsComponent } from '../../application/requisitions/add-requisition/recdetails/aca-documents/aca-documents.component';
import { CoPopupComponent } from '../candidatesubmission/co-popup/co-popup.component';
import { FormControlService } from '../form-control.service';
import { TechAssessmentComponent } from '../../application/candidate/tech-assessment/tech-assessment.component';







@Component({
  selector: 'app-newcandidateprofile',
  templateUrl: './new-candidate-profile.component.html',
  styleUrls: ['./new-candidate-profile.component.scss'],
  providers: [NewCandidateProdileService]
})
export class NewCandidateProfileComponent implements OnInit {

  @Input() candId;
  public reqId;
  candidateData: any;
  candidateResume: any;
  errorMessage: string = null;
  @Input() modalRef;




  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public NewCandidateProdileService: NewCandidateProdileService,
    private sanitizer: DomSanitizer,
    private localStorage: LocalStoreManager,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public _controlService: FormControlService,
    private router: Router

  ) {
    this.reqId = this.route.snapshot.queryParams['requisitionid'];
  }


  ngOnInit() {
    this.getCandidateDetails();
    this.getCandidateResumeDetails();
    console.log("Modalref", this.modalRef);
  }

  getCandidateDetails() {

    this.NewCandidateProdileService.getCandidateDetails(this.candId).subscribe(
      (res: any) => {


        let response = JSON.parse(res._body)['response'];
        if (response) {
          this.candidateData = response;
        }
        console.log("DATA", response);
   
      }

    );
 
}

  getCandidateResumeDetails() {

    this.NewCandidateProdileService.getCandidateResumeDetails(this.candId,70).subscribe(
      (res: any) => {


        let response = JSON.parse(res._body)['response'];
        if (response) {
          let rawdata = JSON.parse(res._body)['response']['resume'];
          this.candidateResume = this.getSafeHtml(rawdata);

        }
        console.log("DATA Resume", response);

      }

    );

  }

  getSafeHtml(html: string): SafeHtml {
    const decoded = this.decodeHTMLEntities(html);
    return this.sanitizer.bypassSecurityTrustHtml(decoded);
  }
  decodeHTMLEntities(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  customAction(classname) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      size: 'lg',
      //  scrollable: true,
      windowClass: 'linkedinpopup'
    };
    switch (classname) {
      case 'linkedinpopup':
        // debugger;
        let modalRef = this.modalService.open(LinkedInpopupComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        break;
      case 'updateclient':
        // debugger;
        modalRef = this.modalService.open(UpdateClientComponent, ngbModalOptions);
        modalRef.componentInstance.inputdata = this.candId ? this.candId : "";
        break;
      case 'linkedinmail':
        modalRef = this.modalService.open(LinkedinMailComponent, ngbModalOptions);
        let additionaldata = [];
      
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        modalRef.componentInstance.additionaldata = additionaldata;
        break;

      case 'sharedinpopup':
        // ngbModalOptions.windowClass = "overrides";
        modalRef = this.modalService.open(ShareMultipleUserComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        break;
      case 'updateresumepopup':
        modalRef = this.modalService.open(CandidateResumeUploadComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        modalRef.componentInstance.action = 'profileresume';

        break;
      case 'notesinpopup':
        modalRef = this.modalService.open(MetalCardNotesComponent, ngbModalOptions);
        modalRef.componentInstance.id = this.candId ? this.candId : "";
        break;
      case 'candidatebotresponse':
        ngbModalOptions.windowClass = "overrides";

        modalRef = this.modalService.open(CandidateBotResponseComponent, ngbModalOptions);
        modalRef.componentInstance.id = this.candId ? this.candId : "";
        break;
      case 'pintoreqpopup':
        modalRef = this.modalService.open(PinToReqPopupComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        modalRef.result.then((result) => {
          if (result == 'success') {
            this._controlService.RefreshComponent();
          }
        });
        break;
      case 'addtohotbookpopup':
        modalRef = this.modalService.open(AddToHotbooksPopupComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId? this.candId : "";
        modalRef.result.then((result) => {
          if (result == 'success') {
            this._controlService.RefreshComponent();
          }
        });
        break;
      case 'dncpopup':
        modalRef = this.modalService.open(DncPopupComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        modalRef.result.then((result) => {
          if (result == 'success') {
            this._controlService.RefreshComponent();
          }
        });
        break;
      case 'sendSMS':
        modalRef = this.modalService.open(SendSmsComponent, ngbModalOptions);
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        modalRef.result.then((result) => {
          if (result == 'success') {
            this._controlService.RefreshComponent();
          }
        });
        break;
      case 'coPopup':
        modalRef = this.modalService.open(CoPopupComponent, {
          backdrop: 'static', size: 'lg', windowClass: 'coPopup'
        });
        modalRef.componentInstance.candidateid = this.candId ? this.candId : "";
        modalRef.result.then((result) => {
          if (result == 'success') {
            this._controlService.RefreshComponent();
          }
        });
        break;
      case 'acaPopup':
        let ngbModalOption: NgbModalOptions = { backdrop: "static", keyboard: true, size: "lg", };

        modalRef = this.modalService.open(AcaDocumentsComponent, ngbModalOption);
        modalRef.componentInstance.requisitionid = this.candId ? this.candId : "";
        break;
    
      case 'STSSendLinkRedirect':

        let userid = '';
        let current_user = this.localStorage.getData('current_user');
        if (current_user.email) {
          userid = current_user.email.split('@')[0];
        }
        const queryParams = `?eid=${encodeURIComponent(this.candId)}&uid=${encodeURIComponent(userid)}`;

        // Open the URL with query parameters in a new tab
        window.open('http://apps.ascendion.com/sts/collabera/Default.aspx' + queryParams, '_blank');
        break;
      case 'techassessment':

        modalRef = this.modalService.open(TechAssessmentComponent, { backdrop: 'static', size: 'lg', windowClass: 'coPopup' });
        modalRef.componentInstance.requisitionid = this.candId ? this.candId : "";
        break;

      case '':
      default:
        this.errorMessage = "Nothing to show. Please try again";
        break;

    }
  }

  redirectToMatchingReqs() {
  
    this.modalRef.close();
    if (this.candId) {
      let urlRoute = '/apps/requisitionspage/candidate-matching';
      let url = urlRoute + '?candidateid=' + this.candId;
      this.router.navigateByUrl(url);
    }
    
  }


}
