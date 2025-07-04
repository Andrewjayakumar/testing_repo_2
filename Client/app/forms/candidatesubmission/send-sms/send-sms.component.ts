
import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SubmitcandidateService } from './../submitcandidate.service';

import { Observable, ObservableInput } from "rxjs/Observable";
import { Subscription, Subject } from "rxjs";



@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})

export class SendSmsComponent implements OnInit {
  msgToSend: string = "";
  msgSent;
  currentrole;
  public displaymesg;
  public errorMessage;

  public candidateid;
  busy: Subscription;
  candidateDetails: any;
  public requisitionid;

  public inputdata;


  isSubmitClicked: boolean;
  // uploader: FileUploader;

  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;

  constructor(public modal: NgbActiveModal, 
    private service: SubmitcandidateService, 
    private formBuilder: FormBuilder, 
    private _modalService: NgbModal) {

 }

  ngOnInit() {
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
    this.currentrole = sessionStorage.getItem("selectedrole");

    this.busy = this.service.getSMS(this.candidateid).subscribe(
      (res: any) => {
        this.msgSent = JSON.parse(res._body)["response"];
      },
      err => {

      }
    )
  }


OnSubmitClicked() {
let data = {
  "candidateid": null,
  "message": ""
}

data.candidateid = this.candidateid ? this.candidateid : null;
data.message = this.msgToSend ? this.msgToSend : null;

    this.service.sendSMS(data).subscribe(
      (res) => {
        debugger;
        let body = JSON.parse(res["_body"]);
        if (body.response) {
          this.displaymesg = body.message ? body.message : "Success";
          setTimeout(() => {
            this.displaymesg = body.message ? body.message : "Success";
            this.modal.close("success");
          }, 5000);
        }
        else {
          this.errorMessage = body.message ? body.message : "Something went wrong";
          setTimeout(() => {
            this.errorMessage = body.message ? body.message : "Something went wrong";
          }, 5000);

        }
      }
    );

  }

}
