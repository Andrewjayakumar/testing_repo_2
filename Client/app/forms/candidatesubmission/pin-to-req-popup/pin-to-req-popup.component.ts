import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-pin-to-req-popup',
  templateUrl: './pin-to-req-popup.component.html',
  styleUrls: ['./pin-to-req-popup.component.scss']
})
export class PinToReqPopupComponent implements OnInit {

  recChange: boolean = false;
  onlyReq;
  fullReqs;
  jobTitle;
  skill;
  jobTitlesAndSkills;
  currentrole;
  public displaymesg;
  public errorMessage;

  public onlyReqInput$ = new Subject<string | null>();
  onlyReqList: Observable<any>;

  public fullReqInput$ = new Subject<string | null>();
  fullReqList: Observable<any>;

  isOnlyReqLoading = false;
  isFullReqLoading = false;

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
    // this.uploader = new FileUploader({
    //   url: '',
    //   disableMultipart: true,

    // });
    // this.hasBaseDropZoneOver = false;
    // this.hasAnotherDropZoneOver = false;

    this.initializeTypeAheads();
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

  }
  

        // initialize type heads for search
  initializeTypeAheads() {
    this.onlyReqList = this.onlyReqInput$.pipe(
    filter((t) => t && t.length > 1),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((term) => this.searchOnlyReq(term))
    );

    this.fullReqList = this.fullReqInput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchAllReq(term))
      );
      
}

searchOnlyReq(term: string) {
  if (!term) return of([]);
  this.isOnlyReqLoading = true;
  return this.service.getOnlyReq(term).pipe(
  map((res: any) => {
  this.isOnlyReqLoading = false;
  let resP = JSON.parse(res._body);
    return resP.response ? resP.response : [];
    })
  );
}

searchAllReq(term: string) {
  if (!term) return of([]);
  this.isFullReqLoading = true;
  return this.service.getOnlyReq(term).pipe(
  map((res: any) => {
  this.isFullReqLoading = false;
  let resP = JSON.parse(res._body);
    return resP.response ? resP.response : [];
    })
  );
}

onReqChange(e) {
  this.recChange = !this.recChange;
}


reqChanged() {
  let reqID;
  if(this.recChange) {
    reqID = this.fullReqs;
  } else {
    reqID = this.onlyReq;
  }
  if(reqID) {
    this.busy = this.service.getjobTitleAndSkills(reqID).subscribe(
      (res: any) => {
        this.jobTitlesAndSkills = JSON.parse(res._body)["response"];
        debugger;
        this.jobTitle = this.jobTitlesAndSkills[0].jobtitle;
        this.skill = this.jobTitlesAndSkills[0].skills;
      },
      err => {

      }
    )
  }
}

  OnSubmitClicked() {
    let data = {
      "id": null,
      "candidatestatusid": null,
      "matchingsource": null,

      "searchallreqs":false,
      "requisitionid":null,
      "jobtitle":"",
      "skills":null,
      "candidateid": null,
      "currentrole":null
    }

    if(this.recChange) {
      data.searchallreqs = true;
      data.requisitionid = this.fullReqs ? this.fullReqs : null;
    } else {
      data.searchallreqs = false;
      data.requisitionid = this.onlyReq ? this.onlyReq : null;
    }
    data.jobtitle = this.jobTitle ? this.jobTitle : null;
    data.skills = this.skill ? this.skill : null;
    data.candidateid = this.candidateid ? this.candidateid : null;
    data.currentrole = this.currentrole ? this.currentrole : null;


    this.service.sourceToReq(data).subscribe(
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
