import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-secure-candidate',
  templateUrl: './secure-candidate.component.html',
  styleUrls: ['./secure-candidate.component.scss'],
  providers: [CandidateService]
})
export class SecureCandidateComponent implements OnInit {

  // @Input('candidateid')
  public inputdata;
  public candidateid: number = null;
  //@Input('requisitionid')
  public reqid: number = null;
  candidatefullname;
  alertMessage = "";
  errorMessage = "";
  showLoader = false;
  submitclicked = false;
  isSendRequestDisable: boolean;
  public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public candidateservice: CandidateService, public modal: NgbActiveModal, private _modalService: NgbModal) { }

  datamodel = {
    "candidateid": null,
    "requisitionid": null,
    "firstname": "",
    "middlename": "",
    "lastname": "",
    "emailaddress": "",
    "homenumber": null,
    "mobilenumber": null

  };


  ngOnInit() {
    this.isSendRequestDisable = false;
    if (Array.isArray(this.inputdata)) {
      this.inputdata.forEach(x => {
        if (x.key == 'candidateid') {

          this.candidateid = x.value;
        }
        else if (x.key == 'id' || 'requisitionid') {

          this.reqid = x.value;
        }
      });
    }
    // console.log("reqid  " + this.reqid);
    this.datamodel.candidateid = this.candidateid;
    this.datamodel.requisitionid = this.reqid;
    this.showLoader = true;
    this.candidateservice.getCandidateBasicDetails(this.candidateid).subscribe(

      (res: any) => {

        let response = JSON.parse(res._body)['response']

        if (response) {
          response = response[0];

          this.datamodel.firstname = response.firstname;
          this.datamodel.lastname = response.lastname;
          this.datamodel.emailaddress = response.emailid;
          this.datamodel.mobilenumber = response.mobilephone;
          this.datamodel.homenumber = response.homephone;
          this.candidatefullname = response.fullname ? response.fullname : response.firstname + response.lastname;
          this.showLoader = false;

        }
        else {
          this.showLoader = false;
          this.errorMessage = " Error Occurred! Unable to fetch Candidate Details. Please Try again !"
        }
      }

    );

  }

  OnSubmitClicked(form) {
    this.showLoader = true;
    debugger;
    console.log("Form is valid " + form.valid);
    this.candidateservice.sendSTSRequest(this.datamodel).subscribe(
      (res: any) => {
        let response = JSON.parse(res._body)['response'];
        if (response) {
          //showngb alert
          this.alertMessage = "Successfully sent the STS request !";
          this.errorMessage = null;
          this.showLoader = false;

          setTimeout(() => { this.modal.close('ok'); }, 3000);

        } else {
          //showngb alert
          this.alertMessage = null;
          let errorResponse = JSON.parse(res._body)['message'];
          if (errorResponse == 'The request is already initiated, Please try again later') {
            this.errorMessage = errorResponse;
            this.isSendRequestDisable = true;
            setTimeout(() => { this.isSendRequestDisable = false; this.errorMessage = null; }, 1200000);
          }
          else {
            this.errorMessage = "Error Occurred! Request not Sent";
          }
          this.showLoader = false;
        }
      }
    );
  } 


}
