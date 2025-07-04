import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef,ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FormatResumeService } from '../format-resume/format-resume.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { ActivatedRoute } from '@angular/router';





@Component({
  selector: 'app-formatresume',
  templateUrl: './format-resume.component.html',
  styleUrls: ['./format-resume.component.scss'],
  providers: [FormatResumeService]
})
export class FormatResumeComponent implements OnInit {
  public inputdata;
  public candidateid: number = null;
  requisitionid: any;
  candidateresume:any;
  formattedResume: any;
  scale = 100;
  top = 0;
  left = 0;
  current_user_obj: any;
  currentuser_id: any;
  downloadlabel = "Download";
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  contentDocument: any;
  radioSelectedval = '3';
  newformattedResume: any;
  frmtRsmErroMsg: any;
  @Input() candId;
  public reqId;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public _modalService: NgbModal,
    public FormatResumeService: FormatResumeService,
    private sanitizer: DomSanitizer,
    private localStorage: LocalStoreManager,
    private route: ActivatedRoute
  ) {
    this.reqId = this.route.snapshot.queryParams['requisitionid'];
  }

 
  ngOnInit() {
    this.current_user_obj = this.localStorage.getData('current_user');
    //  this.currentuser_role = this.current_user_obj.activerole;
    let index = this.current_user_obj.email.indexOf('@');
    this.currentuser_id = this.current_user_obj.email.substring(0, index);
    console.log("Data", this.inputdata);


    if (Array.isArray(this.inputdata)) {
      this.inputdata.forEach(x => {
        if (x.key == 'candidateid') {

          this.candidateid = x.value;
        }
        else if (x.key == 'id' || 'requisitionid') {

          this.requisitionid = x.value;
        }
      });
    }

    if (this.candId) {
      this.candidateid = this.candId;
    }
    if (this.reqId) {
      this.requisitionid = this.reqId;
    }

    this.getoriginalResume(this.candidateid, this.requisitionid);

    // track the formatted resume

    this.trackFormatResume(this.candidateid, this.requisitionid);

  
   

  }

  ngAfterViewInit(): void {
 
  }
  getoriginalResume(candidateid, requisitionid) {

    this.FormatResumeService.getCandidateResume(candidateid, requisitionid).subscribe(

      (res: any) => {

        let response = JSON.parse(res._body)['response']

        if (response) {
          this.candidateresume = this.sanitizer.bypassSecurityTrustHtml(response.resume);
          //this.populateIframe(this.candidateresume);

          if (this.candidateresume) {
            this.getformattedCandidateResume(this.candidateid);
          }


        }
        else {
       
        }
      }

    );
  }

  getformattedCandidateResume(candidateid) {
    this.FormatResumeService.getformattedCandidateResume(candidateid).subscribe(

      (res: any) => {

        let response = JSON.parse(res._body)['response'];

        if (response) {

        
          response = response.replace("1000", "550");
          response = response.replace("300", "250");
         // response = response.replace("10pt", "8pt");
        //  response = response.replace("11pt", "9pt");
     

         this.formattedResume = this.sanitizer.bypassSecurityTrustHtml(response.replace(/(?:\r\n|\r|\n)/g, "<br>"));


        }
        else {
          this.frmtRsmErroMsg = JSON.parse(res._body)['message'];
        }
      }

    );
  }
  downloadresume() {
    this.downloadlabel = "Please Wait"
    let data = {
      "candidateId": this.candidateid,
      "requisitionId": this.requisitionid,
      "isDownload": true,
      "isShare": false,
      "createdBy": this.currentuser_id
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.popupConfig.title = "";
    this.popupConfig.message = "Please Wait..";
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Ok";
    this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

    this.FormatResumeService.downandShareFormatResume(data).subscribe(
      (res: any) => {
     

        let response = JSON.parse(res._body)['response'];

        if (response) {
          this.downloadlabel = "Download";
          this.popupConfig.message = "Please check your email to download the resume";
          setTimeout(() => {
            this.confirmModal.close();
          }, 5000);
        }
        else {
          this.popupConfig.message = JSON.parse(res._body)['message'];
          setTimeout(() => {
            this.confirmModal.close();
          }, 5000);

        }
      }

    );
  }

  shareResume() {
    let data = {
      "candidateId": this.candidateid,
      "requisitionId": this.requisitionid,
      "isDownload": false,
      "isShare": true,
      "createdBy": this.currentuser_id
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.popupConfig.title = "";
    this.popupConfig.message = "Please Wait...";
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Yes";
    this.confirmModal = this._modalService.open(this.content, ngbModalOptions);
    this.FormatResumeService.downandShareFormatResume(data).subscribe(
      (res: any) => {

        let response = JSON.parse(res._body)['response'];

        if (response) {
          this.popupConfig.message = "profile shared successfully, please check mail";
          setTimeout(() => {
            this.confirmModal.close();
          }, 5000);

        }
        else {
          this.popupConfig.message = JSON.parse(res._body)['message'];
          setTimeout(() => {
            this.confirmModal.close();
          }, 5000);
        }
      }

    );
  }

  onradioBtnChanged(val) {
    if (val.target.value) {
      this.radioSelectedval = val.target.value;
    
    }
    if (this.radioSelectedval == '2' && this.formattedResume.changingThisBreaksApplicationSecurity) {
      this.formattedResume = this.formattedResume.changingThisBreaksApplicationSecurity.replace("550", "800");


      this.formattedResume = this.sanitizer.bypassSecurityTrustHtml(this.formattedResume);

    }
  }
  trackFormatResume(candidateid, requisitionid) {
    let data = {
      "pagename": "FormatResume",
      "actionname": requisitionid,
      "objectid": candidateid
    }
    this.FormatResumeService.trackFormatResume(data).subscribe(
      (res: any) => {

        let response = JSON.parse(res._body)['response'];
      }

    );
  }
}
