import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SubmitcandidateService } from './../submitcandidate.service';

import {
  filter,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
  debounceTime,
  concat,
  map,
} from "rxjs/operators";
import { Observable, ObservableInput } from "rxjs/Observable";
import { Subscription, Subject } from "rxjs";
import { of } from "rxjs/observable/of";


@Component({
  selector: 'app-dnc-popup',
  templateUrl: './dnc-popup.component.html',
  styleUrls: ['./dnc-popup.component.scss']
})

export class DncPopupComponent implements OnInit {

  markDNC: boolean = false;

  justificationDesc;
  onlyReq;
  fullReqs;
  jobTitle;
  skill;
  jobTitlesAndSkills;
  currentrole;
  public displaymesg;
  public errorMessage;

  public currentDate: NgbDateStruct = <NgbDateStruct> {};
  public tillDate: NgbDateStruct = <NgbDateStruct> {};

  public onlyReqInput$ = new Subject<string | null>();
  onlyReqList: Observable<any>;

  public fullReqInput$ = new Subject<string | null>();
  fullReqList: Observable<any>;

  isOnlyReqLoading = false;
  isFullReqLoading = false;

  public datamodel = {
    "tilldate": null
    };

  public candidateid;
  busy: Subscription;
  candidateDetails: any;
  public requisitionid;
  fileslist = [];
  // uploadForm: FormGroup;
  public inputdata;

  public resumeuploaded = false;
  sourcelist: any;
  isSubmitClicked: boolean;
  // uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  datafromDragndrop = false;
  public isFileDropped: boolean = false;
  fileName: any;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  attachments: any = [];
  public resumeWrongFormat = false;
  public action;
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

    let today = new Date();
    this.currentDate.year = today.getFullYear();
    this.currentDate.month= today.getMonth() + 1;
    this.currentDate.day = today.getDate();
    let td = new Date(today.setDate(today.getDate() + 15));
    this.tillDate.year = td.getFullYear();
    this.tillDate.month= td.getMonth() + 1;
    this.tillDate.day = td.getDate();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.resetCreateNew && changes.resetCreateNew.currentValue) {
      this.tillDate = <NgbDateStruct>{};
  }
}


tillDateChanged() {
   
  if (!this.tillDate)
      return;

var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  
var date: any = new Date(`${this.tillDate.year}-${this.tillDate.month}-${this.tillDate.day}`);
// let dueDataObj:Date = new Date(date);
// this.datamodel.tillDate = dueDataObj.toISOString();
// this.datamodel.tillDate = (new Date(date)).toISOString();
// latest changes for start date for previous date on selection
let MM = ('0' + this.tillDate.month).slice(-2);
let DD = ('0' + this.tillDate.day).slice(-2);
this.datamodel.tilldate = `${MM}/${DD}/${this.tillDate.year}`;
  // ends

}
  

markAsDNC(e) {
  this.markDNC = !this.markDNC;
}


OnSubmitClicked() {
let data = {
  "candidateid": null,
  "donotcontact": true,
  "dnctilldate": null,
  "reason": null
}

data.candidateid = this.candidateid ? this.candidateid : null;
data.dnctilldate = this.datamodel.tilldate ? this.datamodel.tilldate : null;
data.reason = this.justificationDesc ? this.justificationDesc : null;

    this.service.updateDNC(data).subscribe(
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
